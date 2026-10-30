/** SIMS Site Strategist v0.1.0 | P0 site-bound foundation. */
const SSS_VERSION = '0.1.0';
const SSS_PREFIX = 'SSS_';
const SSS_CONFIG_SHEET = 'SiteConfig';
const SSS_AUDIT_SHEET = 'AuditLog';
function onOpen() {
  SpreadsheetApp.getUi().createMenu('SIMS Site Strategist')
    .addItem('Homeを開く', 'sssHome')
    .addItem('初回セットアップ', 'sssSetup')
    .addItem('登録サイトを確認', 'sssShowSite')
    .addToUi();
}
function sssSpreadsheet_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function sssProperties_() { return PropertiesService.getDocumentProperties(); }
function sssConfig_() {
  const p = sssProperties_();
  return { siteId:p.getProperty(SSS_PREFIX+'SITE_ID') || '', propertyUri:p.getProperty(SSS_PREFIX+'PROPERTY_URI') || '', siteName:p.getProperty(SSS_PREFIX+'SITE_NAME') || '', lockedAt:p.getProperty(SSS_PREFIX+'LOCKED_AT') || '' };
}
function sssCanonicalProperty_(value) {
  const v=String(value||'').trim();
  if (/^sc-domain:[a-z0-9.-]+$/i.test(v)) return 'sc-domain:'+v.substring(10).toLowerCase();
  if (!/^https?:\/\//i.test(v)) throw new Error('GSCプロパティの形式が正しくありません。');
  const u=new URL(v); if (u.username || u.password || u.search || u.hash) throw new Error('URLに認証情報・クエリ・フラグメントを含めないでください。');
  if (u.pathname !== '/' && u.pathname !== '') throw new Error('URLプレフィックスはGSC登録値を正確に選択してください。');
  return u.origin.toLowerCase()+'/';
}
function sssListProperties() {
  const res=UrlFetchApp.fetch('https://www.googleapis.com/webmasters/v3/sites', {headers:{Authorization:'Bearer '+ScriptApp.getOAuthToken()},muteHttpExceptions:true});
  if(res.getResponseCode()!==200) throw new Error('Search Consoleのサイト一覧を取得できません（HTTP '+res.getResponseCode()+'）。API有効化・アクセス権を確認してください。');
  const body=JSON.parse(res.getContentText());
  return (body.siteEntry||[]).filter(x=>x.siteUrl && x.permissionLevel && x.permissionLevel!=='siteUnverifiedUser').map(x=>({uri:x.siteUrl, permission:x.permissionLevel}));
}
function sssEnsureSheets_() {
  const ss=sssSpreadsheet_();
  let config=ss.getSheetByName(SSS_CONFIG_SHEET);
  if(!config){config=ss.insertSheet(SSS_CONFIG_SHEET);config.getRange(1,1,1,2).setValues([['項目','値']]).setFontWeight('bold');config.setColumnWidth(1,170);config.setColumnWidth(2,440);}
  let audit=ss.getSheetByName(SSS_AUDIT_SHEET);
  if(!audit){audit=ss.insertSheet(SSS_AUDIT_SHEET);audit.appendRow(['日時','操作','サイトID','詳細']);}
  return {config,audit};
}
function sssAudit_(action,siteId,detail){sssEnsureSheets_().audit.appendRow([new Date(),action,siteId,detail||'']);}
function sssSetup() {
  const ui=SpreadsheetApp.getUi(), current=sssConfig_();
  if(current.lockedAt){sssShowSite();return;}
  const sites=sssListProperties();
  if(!sites.length){ui.alert('利用可能なSearch Consoleプロパティが見つかりません。');return;}
  const selection=ui.prompt('初回セットアップ：対象サイトを選択',sites.map((x,i)=>(i+1)+'. '+x.uri+' ('+x.permission+')').join('\n')+'\n\n番号を入力してください。',ui.ButtonSet.OK_CANCEL);
  if(selection.getSelectedButton()!==ui.Button.OK)return;
  const idx=Number(selection.getResponseText());
  if(!Number.isInteger(idx)||idx<1||idx>sites.length){ui.alert('一覧の番号を入力してください。');return;}
  const uri=sites[idx-1].uri;
  const nameInput=ui.prompt('サイト名', 'このサイト専属ツールの表示名を入力してください。',ui.ButtonSet.OK_CANCEL);
  if(nameInput.getSelectedButton()!==ui.Button.OK)return;
  const name=nameInput.getResponseText().trim();
  if(!name||name.length>100){ui.alert('サイト名を1～100文字で入力してください。');return;}
  const confirm=ui.alert('サイトを固定しますか？','対象：'+uri+'\nサイト名：'+name+'\n\n固定後は通常操作で変更できません。',ui.ButtonSet.YES_NO);
  if(confirm!==ui.Button.YES)return;
  sssBindSite_(uri,name);
  sssHome();
}
function sssBindSite_(propertyUri,siteName){
  const lock=LockService.getDocumentLock();if(!lock.tryLock(30000))throw new Error('別のセットアップ処理が実行中です。');
  try{
    const p=sssProperties_();if(p.getProperty(SSS_PREFIX+'LOCKED_AT'))throw new Error('すでにサイトが固定されています。');
    const allowed=sssListProperties().some(x=>x.uri===propertyUri);
    if(!allowed)throw new Error('対象サイトへのGSCアクセス権を確認できません。');
    const canonical=sssCanonicalProperty_(propertyUri);
    const id=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,canonical).map(b=>('0'+(b&255).toString(16)).slice(-2)).join('').slice(0,20);
    const time=new Date().toISOString();
    p.setProperties({SSS_SITE_ID:id,SSS_PROPERTY_URI:propertyUri,SSS_SITE_NAME:siteName,SSS_LOCKED_AT:time,SSS_VERSION:SSS_VERSION},false);
    const sheets=sssEnsureSheets_();
    sheets.config.getRange(2,1,5,2).setValues([['製品バージョン',SSS_VERSION],['サイト名',siteName],['GSCプロパティ',propertyUri],['サイトID',id],['固定日時',time]]);
    sssAudit_('SITE_LOCKED',id,'初回セットアップ完了');
  }finally{lock.releaseLock();}
}
function sssShowSite(){const c=sssConfig_();SpreadsheetApp.getUi().alert(c.lockedAt?'専属サイト：'+c.siteName+'\nGSC：'+c.propertyUri+'\nサイトID：'+c.siteId:'未設定です。初回セットアップを実行してください。');}
function sssHome(){
  const c=sssConfig_();
  const html=HtmlService.createHtmlOutput('<html><head><base target="_top"><style>body{font-family:Arial,sans-serif;padding:24px;color:#222}h2{margin-top:0}.box{background:#f3f5f7;padding:18px;border-radius:10px;line-height:1.9}.muted{color:#666}</style></head><body><h2>SIMS Site Strategist v'+SSS_VERSION+'</h2><div class="box">'+(c.lockedAt?'<b>'+sssEscape_(c.siteName)+'</b><br>対象：'+sssEscape_(c.propertyUri)+'<br>サイト固定：完了':'初回セットアップが必要です。メニューから実行してください。')+'</div><p class="muted">P0：サイト専属化の基盤。データ収集・診断・探索機能は今後の開発工程で追加します。</p></body></html>').setWidth(550).setHeight(290);
  SpreadsheetApp.getUi().showModalDialog(html,'Site Strategist Home');
}
function sssEscape_(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function sssValidateSite_(siteId,propertyUri){const c=sssConfig_();if(!c.lockedAt||c.siteId!==siteId||c.propertyUri!==propertyUri)throw new Error('登録サイトと異なるデータのため取り込みを拒否しました。');return true;}
