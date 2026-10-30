/** SIMS Site Strategist v0.1.17 | progress refresh feedback. */
const SSS_VERSION = '0.1.18';
const SSS_PREFIX = 'SSS_';
const SSS_CONFIG_SHEET = 'SiteConfig';
const SSS_AUDIT_SHEET = 'AuditLog';
function onOpen() {
  sssRefreshVersion_();
  SpreadsheetApp.getUi().createMenu('SIMS Site Strategist')
    .addItem('Homeを開く', 'sssHome')
    .addItem('初回セットアップ', 'sssSetup')
    .addItem('登録サイトを確認', 'sssShowSite')
    .addItem('ブログ別保存先を準備・確認', 'sssSetupDriveFolders')
    .addItem('Googleドライブの保存先を開く', 'sssOpenDriveFolder')
    .addItem('既存Evidenceの移行を確認・実行', 'sssMigrateEvidence')
    .addSeparator()
    .addItem('GSCデータを収集（180日）', 'sssCollect180')
    .addItem('GSCデータを収集（365日・試験）', 'sssCollect365')
    .addItem('収集状況を確認', 'sssCollectionStatus')
    .addItem('収集進捗を画面で確認', 'sssShowCollectionProgress')
    .addItem('共通Evidenceを登録・確認', 'sssRegisterEvidenceSnapshot')
    .addItem('最新Evidenceの品質を検証', 'sssVerifyLatestEvidence')
    .addItem('差分更新の計画を確認（試験）', 'sssPreviewDeltaPlan')
    .addItem('差分データを取得（試験・別ZIP）', 'sssAcquireDeltaEvidence')
    .addItem('中断した収集を再開', 'sssResumeCollection')
    .addToUi();
}
function sssSpreadsheet_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function sssProperties_() { return PropertiesService.getDocumentProperties(); }
function sssConfig_() {
  const p = sssProperties_();
  return { siteId:p.getProperty(SSS_PREFIX+'SITE_ID') || '', propertyUri:p.getProperty(SSS_PREFIX+'PROPERTY_URI') || '', siteName:p.getProperty(SSS_PREFIX+'SITE_NAME') || '', lockedAt:p.getProperty(SSS_PREFIX+'LOCKED_AT') || '' };
}
function sssCanonicalProperty_(value) {
  const v = String(value || '').trim();
  if (/^sc-domain:[a-z0-9.-]+$/i.test(v)) return 'sc-domain:' + v.substring(10).toLowerCase();
  // Apps Script V8 does not expose the browser URL constructor.
  const match = /^(https?):\/\/([^\/?#]+)(\/[^?#]*)?$/i.exec(v);
  if (!match) throw new Error('GSCプロパティの形式が正しくありません。');
  const scheme = match[1].toLowerCase();
  const authority = match[2];
  if (authority.indexOf('@') >= 0 || /\s/.test(authority)) throw new Error('URLのホスト名が正しくありません。');
  if (!/^(?:\[[0-9a-f:]+\]|[a-z0-9.-]+)(?::[0-9]{1,5})?$/i.test(authority)) throw new Error('URLのホスト名が正しくありません。');
  const path = match[3] || '/';
  // GSC URL-prefix properties may legitimately include a path.
  return scheme + '://' + authority.toLowerCase() + path;
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
// Update product version on every open, including already-bound site sheets.
// Historical Collector run versions (status B12) are intentionally untouched.
function sssRefreshVersion_() {
  const ss=sssSpreadsheet_();
  const sh=ss.getSheetByName(SSS_CONFIG_SHEET);
  if (!sh) return;
  const last=Math.max(sh.getLastRow(),2);
  const labels=sh.getRange(1,1,last,1).getDisplayValues();
  let row=labels.findIndex(x=>String(x[0]).trim()==='製品バージョン')+1;
  if (!row) { row=last+1; sh.getRange(row,1).setValue('製品バージョン'); }
  if (sh.getRange(row,2).getDisplayValue()!==SSS_VERSION) sh.getRange(row,2).setValue(SSS_VERSION);
  const props=sssProperties_();
  if(props.getProperty(SSS_PREFIX+'VERSION')!==SSS_VERSION) props.setProperty(SSS_PREFIX+'VERSION',SSS_VERSION);
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
  sssRefreshVersion_();
  const c=sssConfig_();
  const folderMap=sssDriveFolderMap_();
  const folderLine=folderMap?'<p>保存先：SIMS ＞ '+sssEscape_(folderMap.siteFolderName)+' ＞ Strategist（設定済み）</p>':'<p>保存先：未設定（メニューから準備してください）</p>';
  const html=HtmlService.createHtmlOutput('<html><head><base target="_top"><style>body{font-family:Arial,sans-serif;padding:24px;color:#222}h2{margin-top:0}.box{background:#f3f5f7;padding:18px;border-radius:10px;line-height:1.9}.muted{color:#666}</style></head><body><h2>SIMS Site Strategist v'+SSS_VERSION+'</h2><div class="box">'+(c.lockedAt?'<b>'+sssEscape_(c.siteName)+'</b><br>対象：'+sssEscape_(c.propertyUri)+'<br>サイト固定：完了':'初回セットアップが必要です。メニューから実行してください。')+'</div>'+folderLine+'<p class="muted">P2D：差分Evidenceの別ZIP取得に対応。統合・基準更新は未実装です。</p></body></html>').setWidth(550).setHeight(330);
  SpreadsheetApp.getUi().showModalDialog(html,'Site Strategist Home');
}

// P3: site-scoped Drive storage. Folder IDs are authoritative; names are display-only.
const SSS_DRIVE_PROP='SSS_DRIVE_FOLDERS_V1';
function sssDriveFolderMap_(){
  const raw=sssProperties_().getProperty(SSS_DRIVE_PROP);
  if(!raw)return null;
  const m=JSON.parse(raw),c=sssConfig_();
  if(m.siteId!==c.siteId||m.propertyUri!==c.propertyUri)throw new Error('保存先と専属サイトの識別情報が一致しません。');
  return m;
}
function sssDriveGetFolder_(id){
  if(!id)throw new Error('保存先フォルダーIDが未設定です。');
  try{return DriveApp.getFolderById(id);}catch(e){throw new Error('登録済み保存先フォルダーにアクセスできません。保存先は変更していません。');}
}
function sssDriveChild_(parent,name){
  const it=parent.getFoldersByName(name);
  if(it.hasNext()){
    const f=it.next();
    if(it.hasNext())throw new Error('同じ階層に同名フォルダーが複数あります：'+name+'。安全のため停止しました。');
    return f;
  }
  return parent.createFolder(name);
}
function sssDriveVerifyMap_(m){
  const c=sssConfig_();
  if(m.siteId!==c.siteId||m.propertyUri!==c.propertyUri)throw new Error('保存先のサイトIDが一致しません。');
  const root=sssDriveGetFolder_(m.rootId),site=sssDriveGetFolder_(m.siteIdFolder),strategist=sssDriveGetFolder_(m.strategistId);
  function childOf(f,p){const parents=f.getParents();while(parents.hasNext())if(parents.next().getId()===p.getId())return true;return false;}
  if(!childOf(site,root)||!childOf(strategist,site))throw new Error('保存先フォルダーの階層が変更されています。');
  const evidence=sssDriveGetFolder_(m.evidenceId);
  if(!childOf(evidence,strategist))throw new Error('Evidence保存先の階層が変更されています。');
  for(const key of ['baselineId','deltaId','archiveId'])if(!childOf(sssDriveGetFolder_(m[key]),evidence))throw new Error('Evidenceサブフォルダーの階層が変更されています。');
  for(const key of ['reportsId','exportId'])if(!childOf(sssDriveGetFolder_(m[key]),strategist))throw new Error('Strategist保存先の階層が変更されています。');
  return m;
}
function sssSetupDriveFolders(){
  const c=sssConfig_(),ui=SpreadsheetApp.getUi();
  if(!c.lockedAt)throw new Error('先にサイトの初回セットアップを完了してください。');
  const existing=sssDriveFolderMap_();
  if(existing){sssDriveVerifyMap_(existing);ui.alert('保存先は設定済みです。\nSIMS ＞ '+existing.siteFolderName+' ＞ Strategist\n'+sssDriveGetFolder_(existing.strategistId).getUrl());return;}
  const run=sdscGetRun_();
  if(run&&['RUNNING','PAUSED_AUTO_RESUME','ERROR'].includes(run.status))throw new Error('収集が未完了です。完了後に保存先を設定してください。');
  if(ui.alert('ブログ別保存先を作成','マイドライブ直下のSIMSフォルダー内に「'+c.siteName+'」の専用保存先を作成します。既存ZIPは移動しません。\n続行しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  const lock=LockService.getDocumentLock();if(!lock.tryLock(30000))throw new Error('別の設定処理が実行中です。');
  try{
    const old=sssDriveFolderMap_();if(old){sssDriveVerifyMap_(old);return;}
    const root=sssDriveChild_(DriveApp.getRootFolder(),'SIMS');
    // Site name is human-readable, immutable ID suffix disambiguates same-name blogs.
    const safeName=c.siteName.replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
    const folderName=safeName+' ['+c.siteId.slice(0,10)+']';
    const site=sssDriveChild_(root,folderName),strat=sssDriveChild_(site,'Strategist');
    const ev=sssDriveChild_(strat,'Evidence');
    const baseline=sssDriveChild_(ev,'Baseline'),delta=sssDriveChild_(ev,'Delta'),archive=sssDriveChild_(ev,'Archive');
    const reports=sssDriveChild_(strat,'Reports'),exp=sssDriveChild_(strat,'Export');
    const map={siteId:c.siteId,propertyUri:c.propertyUri,siteFolderName:folderName,rootId:root.getId(),siteIdFolder:site.getId(),strategistId:strat.getId(),evidenceId:ev.getId(),baselineId:baseline.getId(),deltaId:delta.getId(),archiveId:archive.getId(),reportsId:reports.getId(),exportId:exp.getId()};
    sssDriveVerifyMap_(map);
    sssProperties_().setProperty(SSS_DRIVE_PROP,JSON.stringify(map));
    sssAudit_('DRIVE_FOLDERS_CONFIGURED',c.siteId,'strategistFolderId='+strat.getId());
    ui.alert('保存先を準備しました。\nSIMS ＞ '+folderName+' ＞ Strategist\n既存ZIPは移動していません。');
  }finally{lock.releaseLock();}
}
function sssOpenDriveFolder(){
  const m=sssDriveFolderMap_();if(!m){SpreadsheetApp.getUi().alert('先に「ブログ別保存先を準備・確認」を実行してください。');return;}
  sssDriveVerifyMap_(m);
  const url=sssDriveGetFolder_(m.strategistId).getUrl();
  const html=HtmlService.createHtmlOutput('<div style="font:14px Arial;padding:18px"><p>SIMS ＞ '+sssEscape_(m.siteFolderName)+' ＞ Strategist</p><p><a href="'+sssEscape_(url)+'" target="_blank" rel="noopener">Googleドライブで保存先を開く</a></p></div>').setWidth(470).setHeight(160);
  SpreadsheetApp.getUi().showModalDialog(html,'保存先を開く');
}
function sssEvidenceFolderId_(isDelta){
  const m=sssDriveFolderMap_();if(!m)return '';
  sssDriveVerifyMap_(m);
  return isDelta?m.deltaId:m.baselineId;
}

function sssEscape_(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function sssValidateSite_(siteId,propertyUri){const c=sssConfig_();if(!c.lockedAt||c.siteId!==siteId||c.propertyUri!==propertyUri)throw new Error('登録サイトと異なるデータのため取り込みを拒否しました。');return true;}


// P1 adapter: never allow Collector's standalone site-switching UI.
function sssSyncCollectorConfig_() {
  const c=sssConfig_();
  if(!c.lockedAt||!c.siteId||!c.propertyUri) throw new Error('初回セットアップでサイトを固定してください。');
  sssValidateSite_(c.siteId,c.propertyUri);
  const existing=sdscGetConfig_();
  // Refuse a foreign collector configuration rather than silently reassigning it.
  if(existing.siteUrl && existing.siteUrl!==c.propertyUri) throw new Error('Collectorの設定に異なるサイトが残っています。安全のため停止しました。');
  const collectorConfig={siteUrl:c.propertyUri,siteName:c.siteName,searchType:'web',timezone:Session.getScriptTimeZone()||'Asia/Tokyo',outputFolderId:existing.outputFolderId||'',outputFileName:''};
  sdscSaveConfig_(collectorConfig);
  return collectorConfig;
}
function sssCollect180(){return sssCollectPeriod_(180);}
function sssCollect365(){return sssCollectPeriod_(365);}
function sssCollectPeriod_(days){
  if(days!==180 && days!==365)throw new Error('許可されていない収集期間です。');
  const c=sssSyncCollectorConfig_();
  const prev=sdscGetRun_();
  if(prev && ['RUNNING','PAUSED_AUTO_RESUME','ERROR'].indexOf(prev.status)>=0) throw new Error('未完了の収集があります。先に状況確認・再開してください。');
  const ui=SpreadsheetApp.getUi();
  const msg='専属サイト：'+c.siteName+'\n対象：'+c.propertyUri+'\n期間：'+days+'日\n\n新規収集では内部の収集データシートが初期化されます。既存のEvidence ZIPはDriveに保持されますが、必ず保存を確認してください。\n差分更新ではなく全件再収集です。続行しますか？';
  if(ui.alert(days+'日分のGSCデータを収集',msg,ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  // Audit only after confirmation; collection engine retains its existing checkpoint/resume behavior.
  const folderId=sssEvidenceFolderId_(false);
  const started=sdscStartCollection_(days,'',folderId||'');
  if(started)sssAudit_('COLLECT_START',c.siteId,days+'日');
  return started;
}
// Compare with the immutable Strategist binding, not the Collector config DTO.
function sssAssertRunSite_(run, bound) {
  if (!bound.lockedAt || !bound.siteId || !bound.propertyUri) throw new Error('専属サイトが未設定です。');
  if (!run) return;
  const runId=String(run.siteId||'');
  if (runId && runId!==bound.siteId) {
    sssAudit_('RUN_SITE_MISMATCH',bound.siteId,'runSiteId='+runId+'; boundSiteId='+bound.siteId);
    throw new Error('収集データのサイトIDが一致しません。収集状態は変更していません。');
  }
  const runProperty=String(run.propertyUri||run.siteUrl||'');
  if (runProperty && runProperty!==bound.propertyUri) {
    sssAudit_('RUN_PROPERTY_MISMATCH',bound.siteId,'runProperty='+runProperty+'; boundProperty='+bound.propertyUri);
    throw new Error('収集データのGSCプロパティが一致しません。');
  }
}
function sssCollectionStatus(){
  sssRefreshVersion_();
  const c=sssConfig_();
  sssSyncCollectorConfig_();
  const r=sdscGetRun_();
  sssAssertRunSite_(r,c);
  sdscShowStatus();
}
function sssResumeCollection(){
  const c=sssConfig_();
  sssSyncCollectorConfig_();
  const r=sdscGetRun_();
  if(!r)throw new Error('再開できる収集がありません。');
  sssAssertRunSite_(r,c);
  if(r.status==='COMPLETED') {SpreadsheetApp.getUi().alert('収集は完了しています。');return;}
  sdscResumeCollection();
}

/**
 * Site Collector v0.4.8
 * Single-Code distribution.
 * Production baseline: v0.4.8.
 * Runtime modules are consolidated into this file.
 */

// ============================================================================
// Core / Menu / Runner (source: Code.gs)
// ============================================================================

const SDSC_VERSION='0.4.8';

function sdscLegacyOnOpenDisabled_() {}

// Update only the current application version. Preserve historical run version (B12).
function sdscRefreshDisplayedVersion_(){
  try {
    const sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SDSC_CONFIG.sheets.status);
    if(sh && sh.getRange('A3').getDisplayValue()==='Collectorバージョン'){
      const cell=sh.getRange('B3');
      if(cell.getDisplayValue()!==SDSC_VERSION) cell.setValue(SDSC_VERSION);
    }
  }catch(e){ console.warn('Version display refresh skipped: '+e.message); }
}

function sdscShowSetupDialog(){
  const props=sdscGetAccessibleSites_();
  const current=sdscGetConfig_();
  const items=props.map((p,i)=>`${i+1}. ${p.siteUrl} [${p.permissionLevel}]`).join('\n');
  const ui=SpreadsheetApp.getUi();
  const prompt=ui.prompt(
    `Site Collector v${SDSC_VERSION}`,
    `収集するサイトの番号を入力してください。\n\n${items}\n\n現在: ${current.siteUrl||'(未設定)'}`,
    ui.ButtonSet.OK_CANCEL
  );
  if(prompt.getSelectedButton()!==ui.Button.OK)return;
  const idx=Number(prompt.getResponseText())-1;
  if(!Number.isInteger(idx)||idx<0||idx>=props.length){
    ui.alert('入力が正しくありません。');return;
  }

  const selectedSiteUrl=props[idx].siteUrl;
  const suggestedSiteName=sdscSuggestedSiteName_(selectedSiteUrl);
  const namePrompt=ui.prompt(
    'サイト名',
    `Evidence Packageのファイル名に使うサイト名を入力してください。\n\n例: サンプルサイト\n\n空欄の場合は「${suggestedSiteName}」を使用します。`,
    ui.ButtonSet.OK_CANCEL
  );
  if(namePrompt.getSelectedButton()!==ui.Button.OK)return;
  const siteName=namePrompt.getResponseText().trim()||suggestedSiteName;

  sdscSaveConfig_({
    siteUrl:selectedSiteUrl,
    siteName:siteName,
    permissionLevel:props[idx].permissionLevel,
    searchType:'web',
    timezone:Session.getScriptTimeZone()||'Asia/Tokyo',
    outputFolderId:current.outputFolderId||'',
    outputFileName:''
  });

  ui.alert(`設定しました。\n\nサイト名: ${siteName}\n対象サイト: ${selectedSiteUrl}\n標準収集期間: 120日\n\nEvidence Packageは「サイト名＋収集日時」が分かる名前で自動生成されます。`);
}
function sdscPrepareStandardCollection(){sdscShowSaveAndStartDialog_(SDSC_CONFIG.standardPeriodDays);}
function sdscPrepareDetailedCollection(){sdscShowSaveAndStartDialog_(SDSC_CONFIG.detailPeriodDays);}
function sdscStartStandardCollection(){sdscStartCollection_(SDSC_CONFIG.standardPeriodDays);}
function sdscStartDetailedCollection(){sdscStartCollection_(SDSC_CONFIG.detailPeriodDays);}

function sdscShowSaveAndStartDialog_(days){
  const config=sdscGetConfig_();
  if(!config.siteUrl)throw new Error('専属サイトの設定がありません。');
  const bound=sssConfig_();
  sssValidateSite_(bound.siteId,config.siteUrl);
  const defaultName=sdscDefaultEvidenceFileName_(config.siteName, config.siteUrl, config.timezone||'Asia/Tokyo');
  const initialFolder=sdscPickerFolderInfo_(config.outputFolderId||'');
  const title=days===SDSC_CONFIG.detailPeriodDays?'詳しく収集する（180日）':'診断データを収集';
  const html=HtmlService.createHtmlOutput(sdscSaveDialogHtml_({
    days:days,
    title:title,
    siteUrl:config.siteUrl,
    siteName:config.siteName||sdscSuggestedSiteName_(config.siteUrl),
    defaultFileName:defaultName,
    initialFolderId:initialFolder.id,
    initialFolderName:initialFolder.name
  })).setWidth(620).setHeight(520);
  SpreadsheetApp.getUi().showModalDialog(html,'Evidence Package の保存');
}

function sdscSuggestedSiteName_(siteUrl){
  return String(siteUrl||'site')
    .replace(/^sc-domain:/i,'')
    .replace(/^https?:\/\//i,'')
    .replace(/\/.*$/,'')
    .replace(/^www\./i,'')
    .trim()||'site';
}

function sdscSafeFilePart_(value,fallback){
  let v=String(value||'').trim()
    .replace(/[\\/:*?"<>|]/g,'-')
    .replace(/\s+/g,'-')
    .replace(/-+/g,'-')
    .replace(/^-+|-+$/g,'');
  return v||fallback||'site';
}

function sdscDefaultEvidenceFileName_(siteName,siteUrl,tz,at){
  const site=sdscSafeFilePart_(siteName||sdscSuggestedSiteName_(siteUrl),'site');
  const dt=at?new Date(at):new Date();
  const stamp=Utilities.formatDate(dt,tz||'Asia/Tokyo','yyyyMMdd-HHmm');
  return `SIMS-Evidence-${site}-${stamp}.zip`;
}

function sdscCanonicalEvidenceFileName_(config,startedAt){
  return sdscDefaultEvidenceFileName_(
    config.siteName,
    config.siteUrl,
    config.timezone||'Asia/Tokyo',
    startedAt||new Date().toISOString()
  );
}

function sdscNormalizeZipName_(name){
  let v=String(name||'').trim().replace(/[\\/:*?\"<>|]/g,'-');
  if(!v)v='SIMS-Evidence.zip';
  if(!/\.zip$/i.test(v))v+='.zip';
  return v;
}

function sdscPickerFolderInfo_(folderId){
  if(folderId){
    try{
      const f=DriveApp.getFolderById(folderId);
      return {id:f.getId(),name:f.getName()};
    }catch(e){}
  }
  const root=DriveApp.getRootFolder();
  return {id:root.getId(),name:'マイドライブ'};
}

function sdscListDriveFolders(parentId){
  let folder;
  try{folder=parentId?DriveApp.getFolderById(parentId):DriveApp.getRootFolder();}
  catch(e){folder=DriveApp.getRootFolder();}
  const items=[];
  const it=folder.getFolders();
  let count=0;
  while(it.hasNext()&&count<200){
    const f=it.next();
    items.push({id:f.getId(),name:f.getName()});
    count++;
  }
  items.sort((a,b)=>a.name.localeCompare(b.name,'ja'));
  let parent=null;
  try{
    const ps=folder.getParents();
    if(ps.hasNext()){
      const p=ps.next();
      parent={id:p.getId(),name:p.getName()||'マイドライブ'};
    }
  }catch(e){}
  return {id:folder.getId(),name:folder.getName()||'マイドライブ',parent:parent,folders:items,truncated:count>=200};
}

function sdscSaveCollectionSettingsAndStart(payload){
  const config=sdscGetConfig_();
  if(!config.siteUrl)throw new Error('対象サイトが設定されていません。');
  const folderId=String(payload&&payload.folderId||'').trim();
  const days=Number(payload&&payload.days||SDSC_CONFIG.standardPeriodDays);
  const requestedFileName=sdscNormalizeZipName_(payload&&payload.fileName);
  let folder=DriveApp.getRootFolder();
  if(folderId)folder=DriveApp.getFolderById(folderId);
  config.outputFolderId=folder.getId();
  config.outputFileName='';
  sdscSaveConfig_(config);
  const initialized=sdscStartCollection_(days,'',folder.getId(),true);
  if(!initialized)return {ok:false,cancelled:true};
  return {
    ok:true,
    folderName:folder.getName()||'マイドライブ',
    fileName:sdscResolveRunOutputFileName_(sdscGetRun_()),
    requestedFileName:requestedFileName,
    siteName:config.siteName||sdscSuggestedSiteName_(config.siteUrl),
    siteUrl:config.siteUrl
  };
}

function sdscSaveDialogHtml_(o){
  const data=JSON.stringify(o).replace(/</g,'\\u003c');
  return `<!doctype html><html><head><base target="_top"><style>
    body{font-family:Arial,'Noto Sans JP',sans-serif;margin:0;color:#202124;background:#fff}
    .wrap{padding:20px}.title{font-size:18px;font-weight:700;margin-bottom:6px}
    .sub{font-size:12px;color:#5f6368;margin-bottom:16px;word-break:break-all}
    label{display:block;font-weight:700;font-size:13px;margin:14px 0 6px}
    input{box-sizing:border-box;width:100%;padding:9px 10px;border:1px solid #dadce0;border-radius:6px;font-size:14px}
    .picker{border:1px solid #dadce0;border-radius:8px;overflow:hidden}
    .bar{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#f8f9fa;border-bottom:1px solid #dadce0}
    .where{font-weight:700;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .folders{height:220px;overflow:auto}.folder{padding:9px 12px;border-bottom:1px solid #f1f3f4;cursor:pointer}.folder:hover{background:#f8f9fa}
    button{border:1px solid #dadce0;background:#fff;border-radius:6px;padding:7px 12px;cursor:pointer}.primary{background:#1a73e8;color:#fff;border-color:#1a73e8}
    .actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.hint{font-size:12px;color:#5f6368;margin-top:6px}
    .selected{margin-top:8px;font-size:12px;color:#1a73e8}.msg{font-size:12px;color:#d93025;margin-top:8px}
    .progressCard{padding:6px}.brand{font-size:12px;font-weight:700;color:#1967d2;letter-spacing:.4px}.progressTitle{font-size:22px;font-weight:700;margin:8px 0 6px;color:#202124}.progressSite{padding:12px 14px;background:#eef4ff;border-radius:8px;font-weight:700;color:#174ea6;margin:12px 0}.progressSite span{font-size:12px;font-weight:400;color:#5f6368}.statusPill{display:inline-block;padding:5px 10px;border-radius:999px;background:#e8f0fe;color:#174ea6;font-size:12px;font-weight:700}.statusPill.completed{background:#e6f4ea;color:#137333}.statusPill.error{background:#fce8e6;color:#c5221f}.statusPill.paused_auto_resume{background:#fef7e0;color:#b06000}.progressBar{height:12px;background:#e8eaed;border-radius:999px;overflow:hidden;margin:16px 0 8px}.progressBar>div{height:100%;width:0;background:#1a73e8;transition:width .3s}.stepText{font-size:13px;font-weight:700;margin-bottom:16px}.progressGrid{display:grid;grid-template-columns:95px 1fr;gap:8px 12px;padding:14px;background:#f8f9fa;border-radius:8px;font-size:12px}.progressGrid>div:nth-child(odd){font-weight:700;color:#5f6368}.progressGrid>div:nth-child(even){word-break:break-all}
  </style></head><body><div class="wrap">
    <div class="title">${o.title}</div><div class="sub">サイト名: ${o.siteName}<br>対象サイト: ${o.siteUrl}</div>
    <label>保存先フォルダ</label><div class="picker"><div class="bar"><button id="up">↑ 上へ</button><div id="where" class="where"></div><button id="choose">このフォルダを選択</button></div><div id="folders" class="folders"></div></div>
    <div id="selected" class="selected"></div>
    <label>ファイル名</label><input id="filename" value="" readonly><div class="hint">サイト名と収集日時を含む名前で自動保存します。</div>
    <div id="msg" class="msg"></div><div class="actions"><button onclick="google.script.host.close()">キャンセル</button><button class="primary" id="start">保存して収集開始</button></div>
  </div><script>
    const opt=${data}; let current=null; let selected={id:opt.initialFolderId,name:opt.initialFolderName};
    document.getElementById('filename').value=opt.defaultFileName;
    function esc(s){return String(s||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));}
    function load(id){document.getElementById('folders').innerHTML='<div class="folder">読み込み中...</div>';google.script.run.withSuccessHandler(render).withFailureHandler(err=>showErr(err.message)).sdscListDriveFolders(id);}
    function render(d){current=d;document.getElementById('where').textContent=d.name;document.getElementById('up').disabled=!d.parent;const box=document.getElementById('folders');box.innerHTML=d.folders.length?'':'<div class="folder">サブフォルダはありません</div>';d.folders.forEach(f=>{const el=document.createElement('div');el.className='folder';el.textContent='📁 '+f.name;el.onclick=()=>load(f.id);box.appendChild(el);});if(d.truncated){const x=document.createElement('div');x.className='folder';x.textContent='※ 200件まで表示しています';box.appendChild(x);}}
    document.getElementById('up').onclick=()=>{if(current&&current.parent)load(current.parent.id)};
    document.getElementById('choose').onclick=()=>{if(!current)return;selected={id:current.id,name:current.name};document.getElementById('selected').textContent='保存先: '+selected.name;};
    document.getElementById('start').onclick=()=>{
      const fn=document.getElementById('filename').value.trim();
      if(!fn){showErr('ファイル名を入力してください。');return;}
      const b=document.getElementById('start');b.disabled=true;b.textContent='準備しています...';
      google.script.run.withSuccessHandler(r=>{
        if(!r||!r.ok){b.disabled=false;b.textContent='保存して収集開始';return;}
        showProgressScreen(r);
        google.script.run.withFailureHandler(err=>showProgressError(err.message)).sdscResumeCollection();
        pollProgress();
      }).withFailureHandler(err=>{b.disabled=false;b.textContent='保存して収集開始';showErr(err.message)}).sdscSaveCollectionSettingsAndStart({folderId:selected.id,fileName:fn,days:opt.days});
    };
    function showProgressScreen(r){
      document.querySelector('.wrap').innerHTML='<div class="progressCard">'+
        '<div class="brand">Site Collector</div>'+ 
        '<div class="progressTitle">診断データを収集しています</div>'+ 
        '<div class="progressSite">'+esc(r.siteName||'')+'<br><span>'+esc(r.siteUrl||'')+'</span></div>'+ 
        '<div class="statusPill" id="pstatus">準備中</div>'+ 
        '<div class="progressBar"><div id="pbar"></div></div>'+ 
        '<div class="stepText" id="pstep">収集を開始しています...</div>'+ 
        '<div class="progressGrid">'+
          '<div>開始日時</div><div id="pstart">-</div>'+ 
          '<div>完了日時</div><div id="pend">-</div>'+ 
          '<div>ファイル名</div><div id="pfile">'+esc(r.fileName||'')+'</div>'+ 
          '<div>保存先</div><div id="pfolder">'+esc(r.folderName||'')+'</div>'+ 
        '</div>'+ 
        '<div id="perror" class="msg"></div>'+ 
        '<div class="actions"><button id="closeProgress" onclick="google.script.host.close()">閉じる</button></div>'+ 
      '</div>';
    }
    function pollProgress(){
      google.script.run.withSuccessHandler(d=>{
        if(!d)return;
        updateProgress(d);
        if(d.status!=='COMPLETED'&&d.status!=='ERROR')setTimeout(pollProgress,10000);
      }).withFailureHandler(err=>{showProgressError(err.message);setTimeout(pollProgress,15000)}).sdscGetRunProgressForUi();
    }
    function updateProgress(d){
      const pill=document.getElementById('pstatus'); if(!pill)return;
      pill.textContent=d.statusLabel||d.status||''; pill.className='statusPill '+String(d.status||'').toLowerCase();
      document.getElementById('pbar').style.width=(d.progressPercent||0)+'%';
      document.getElementById('pstep').textContent=(d.stepLabel||'')+(d.progressText?' — '+d.progressText:'');
      document.getElementById('pstart').textContent=d.startedAt||'-';
      document.getElementById('pend').textContent=d.completedAt||'-';
      document.getElementById('pfile').textContent=d.outputFileName||document.getElementById('pfile').textContent;
      document.getElementById('pfolder').textContent=d.outputFolderName||document.getElementById('pfolder').textContent;
      if(d.error)document.getElementById('perror').textContent=d.error;
      if(d.status==='COMPLETED')document.querySelector('.progressTitle').textContent='収集が完了しました';
      if(d.status==='ERROR')document.querySelector('.progressTitle').textContent='収集中にエラーが発生しました';
    }
    function showProgressError(m){const e=document.getElementById('perror');if(e)e.textContent=m||'進捗を取得できませんでした。';}
    function showErr(m){document.getElementById('msg').textContent=m||'エラーが発生しました。'}
    document.getElementById('selected').textContent='保存先: '+selected.name; load(opt.initialFolderId);
  </script></body></html>`;
}

function sdscStartCollection_(days,fileName,folderId,deferResume){
  const config=sdscGetConfig_();
  if(!config.siteUrl)throw new Error('専属サイトの設定がありません。');
  const bound=sssConfig_();
  sssValidateSite_(bound.siteId,config.siteUrl);
  if(!sdscDeleteLegacyRawSheetsWithConfirmation_())return false;
  sdscClearResumeTrigger_();
  const startedAt=new Date().toISOString();
  const run={
    format:'SIMS_DOCTOR_SITE_COLLECTOR_RUN_V2',
    collectorVersion:SDSC_VERSION,
    siteId:sssConfig_().siteId,
    runId:`SITE-${Utilities.formatDate(new Date(startedAt),config.timezone||'Asia/Tokyo','yyyyMMdd-HHmmss')}`,
    status:'RUNNING',
    step:1,
    startedAt:startedAt,
    updatedAt:startedAt,
    period:sdscResolvePeriod_(days),
    cursors:{},rows:{},warnings:[],errors:[],
    progressText:'収集を開始します',
    outputFileName:sdscCanonicalEvidenceFileName_(config,startedAt),
    requestedOutputFolderId:String(folderId||config.outputFolderId||'')
  };
  sdscSaveRun_(run);
  sdscPrepareCompactSheets_();
  sdscWriteStatus_(run);
  if(!deferResume)sdscResumeCollection();
  return true;
}

function sdscResumeCollection(){
  const lock = LockService.getDocumentLock();
  if (!lock.tryLock(5000)) return;
  try {
  const run=sdscGetRun_();
  if(!run||!run.runId)throw new Error('実行中または再開可能なCollector Runがありません。');
  sssValidateSite_(run.siteId,sdscGetConfig_().siteUrl);

  // Recovery path for RC2 runs where ZIP generation succeeded but the final UI alert
  // failed in a time-based trigger context.
  if(run.outputFileUrl && Number(run.step) >= 7){
    run.status='COMPLETED';
    run.completedAt=run.completedAt||new Date().toISOString();
    run.progressText='Evidence Package生成完了';
    run.errors=[];
    sdscSaveRun_(run);
    sdscWriteStatus_(run);
    sdscClearResumeTrigger_();
    return;
  }

  if(run.status==='COMPLETED'){
    SpreadsheetApp.getUi().alert('このRunはすでに完了しています。');return;
  }
  run.status='RUNNING';
  run.updatedAt=new Date().toISOString();
  sdscSaveRun_(run);
  const invocationStartedAt=Date.now();
  const initialStep=run.step;
  const initialPageCursor=Number((run.cursors||{}).pageQueryTop||0);
  const deadline=Date.now()+SDSC_CONFIG.softExecutionMs;
  try{
    while(Date.now()<deadline-SDSC_CONFIG.deadlineGuardMs&&run.step<=6){
      if(run.step===1)sdscCollectSiteDaily_(run,deadline);
      else if(run.step===2)sdscCollectPagePeriod_(run,deadline);
      else if(run.step===3)sdscCollectPageWeekly_(run,deadline);
      else if(run.step===4)sdscCollectQueryPeriod_(run,deadline);
      else if(run.step===5)sdscCollectPageQueryTop_(run,deadline);
      else if(run.step===6){
        if(Date.now()>deadline-90000){sdscPauseAndSchedule_(run,'ZIP生成前に安全な実行時間を確保するため自動再開します');break;}
        sdscFinalizeEvidence_(run);
      }
      run.updatedAt=new Date().toISOString();
      sdscSaveRun_(run);
      sdscWriteStatus_(run);
      if(run.status==='PAUSED_AUTO_RESUME')break;
    }
    if(run.step<=6&&run.status!=='COMPLETED'&&run.status!=='PAUSED_AUTO_RESUME'){
      sdscPauseAndSchedule_(run,'安全時間に到達したため自動再開します');
    }
  }catch(e){
    run.errors=run.errors||[];
    run.errors.push({at:new Date().toISOString(),message:String(e&&e.stack?e.stack:e)});
    run.status='ERROR';
    run.progressText='エラーが発生しました。「途中から再開・特別操作 → 収集状況を確認」で内容を確認してください。';
    sdscSaveRun_(run);
    sdscWriteStatus_(run);
    throw e;
  }
  } finally {
    try {
      const pagesDone=Math.max(0,Number((run.cursors||{}).pageQueryTop||0)-initialPageCursor);
      console.log('[SDSC_PERF] '+JSON.stringify({version:SDSC_VERSION,runId:run.runId,initialStep:initialStep,finalStep:run.step,pagesDone:pagesDone,elapsedMs:Date.now()-invocationStartedAt,status:run.status}));
    } catch (metricError) { console.warn('[SDSC_PERF] metric error: '+metricError); }
    try { lock.releaseLock(); } catch (e) {}
  }
}

function sdscRepairStep5AndRebuild(){
  const run=sdscGetRun_();
  if(!run||!run.runId)throw new Error('修復対象のCollector Runがありません。');
  const ui=SpreadsheetApp.getUi();
  const r=ui.alert(
    '診断データを修復・再生成します',
    '取得済みの120日集計は再利用し、ページ別上位クエリだけを取り直します。\n現在のOutput ZIPは残ります。\n\n実行しますか？',
    ui.ButtonSet.YES_NO
  );
  if(r!==ui.Button.YES)return;

  sdscClearResumeTrigger_();

  const sh=SpreadsheetApp.getActive().getSheetByName(SDSC_CONFIG.sheets.pageQueryTop);
  if(!sh)throw new Error('pageQueryTopシートが見つかりません。');
  sh.clearContents();
  sh.getRange(1,1,1,6).setValues([['page','query','clicks','impressions','ctr','position']]);

  run.step=5;
  run.status='RUNNING';
  run.pageQueryTargetUrls=null;
  run.pageQueryTargetStrategy=null;
  run.urlResolution=null;
  run.cursors=run.cursors||{};
  run.cursors.pageQueryTop=0;
  run.rows=run.rows||{};
  run.rows.pageQueryTop=0;
  run.outputFileId=null;
  run.outputFileUrl=null;
  run.outputFolderId=null;
  run.outputFolderName=null;
  run.outputFolderUrl=null;
  run.completedAt=null;
  run.errors=[];
  run.progressText='診断データの修復を開始します';
  run.updatedAt=new Date().toISOString();
  sdscSaveRun_(run);
  sdscWriteStatus_(run);
  sdscResumeCollection();
}

function sdscFormatDateTime_(iso){
  if(!iso)return '';
  try{return Utilities.formatDate(new Date(iso),Session.getScriptTimeZone()||'Asia/Tokyo','yyyy/MM/dd HH:mm:ss');}
  catch(e){return String(iso||'');}
}

function sdscEstimateProgressPercent_(run){
  if(!run)return 0;
  if(run.status==='COMPLETED')return 100;
  const step=Math.max(1,Math.min(Number(run.step||1),6));
  let within=0;
  if(step===1&&run.period&&run.period.days){within=Math.min(1,Number((run.cursors||{}).siteDaily||0)/Number(run.period.days));}
  else if(step===5&&run.pageQueryTargetUrls&&run.pageQueryTargetUrls.length){within=Math.min(1,Number((run.cursors||{}).pageQueryTop||0)/run.pageQueryTargetUrls.length);}
  const pct=((step-1)+within)/6*100;
  return Math.max(2,Math.min(98,Math.round(pct)));
}

function sdscResolveRunOutputFileName_(run){
  if(!run)return '';
  if(run.outputFileName)return String(run.outputFileName);
  if(run.outputFileId){
    try{return DriveApp.getFileById(run.outputFileId).getName()||'';}catch(e){}
  }
  return '';
}

function sdscGetRunProgressForUi(){
  const run=sdscGetRun_();
  const config=sdscGetConfig_();
  if(!run)return {status:'NONE',statusLabel:'未開始',progressPercent:0};
  const step=Math.min(Number(run.step||0),6);
  return {
    status:run.status||'',
    statusLabel:sdscStatusLabel_(run.status),
    progressPercent:sdscEstimateProgressPercent_(run),
    step:step,
    stepLabel:run.status==='COMPLETED'?'6/6 完了':`${step}/6`,
    progressText:run.progressText||'',
    startedAt:sdscFormatDateTime_(run.startedAt),
    completedAt:sdscFormatDateTime_(run.completedAt),
    outputFileName:sdscResolveRunOutputFileName_(run),
    outputFileUrl:run.outputFileUrl||'',
    outputFolderName:run.outputFolderName||'',
    siteName:config.siteName||sdscSuggestedSiteName_(config.siteUrl),
    siteUrl:config.siteUrl||'',
    error:(run.errors&&run.errors.length)?run.errors[run.errors.length-1].message:''
  };
}

function sdscShowStatus(){
  const run=sdscGetRun_();
  if(!run){
    const ui=SpreadsheetApp.getUi();
    ui.alert(`Site Collector v${SDSC_VERSION}\n収集履歴はありません。`);
    return;
  }
  sdscWriteStatus_(run);
  const sh=SpreadsheetApp.getActive().getSheetByName(SDSC_CONFIG.sheets.status);
  if(sh){
    try{sh.showSheet();}catch(e){}
    SpreadsheetApp.getActive().setActiveSheet(sh);
  }
}

function sdscSafeConfiguredOutputFolderUrl_(){
  try{
    return sdscGetOutputFolderInfo_(sdscGetConfig_()).url;
  }catch(e){
    return '(保存先を確認できません)';
  }
}
function sdscResetState(){
  const ui=SpreadsheetApp.getUi();
  const r=ui.alert('Collector状態をリセットしますか？','途中状態だけを削除します。',ui.ButtonSet.YES_NO);
  if(r!==ui.Button.YES)return;
  sdscClearResumeTrigger_();
  PropertiesService.getDocumentProperties().deleteProperty(SDSC_CONFIG.runPropertyKey);
  ui.alert('Collector状態をリセットしました。');
}

// ============================================================================
// Configuration / State (source: CollectorConfig.gs)
// ============================================================================

const SDSC_CONFIG = Object.freeze({
  apiBase: 'https://www.googleapis.com/webmasters/v3',
  searchType: 'web',
  standardPeriodDays: 120,
  detailPeriodDays: 180,
  rowLimit: 5000,
  topQueriesPerPage: 20,
  maxBatchesPerInvocation: 16,
  // Step 5 only: allow more pages while retaining deadline and per-page checkpoints.
  pageQueryMaxBatchesPerInvocation: 160,
  deadlineGuardMs: 45000,
  maxRetries: 5,
  softExecutionMs: 4 * 60 * 1000,
  resumeDelayMinutes: 1,
  configPropertyKey: 'SDSC_CONFIG_V2',
  runPropertyKey: 'SDSC_RUN_V2',
  outputFolderName: 'SIMS-Doctor-Site-Collector',
  sheets: {
    status: '収集状況',
    siteDaily: '_SDSC_SITE_DAILY',
    pagePeriod: '_SDSC_PAGE_PERIOD',
    pageWeekly: '_SDSC_PAGE_WEEKLY',
    queryPeriod: '_SDSC_QUERY_PERIOD',
    pageQueryTop: '_SDSC_PAGE_QUERY_TOP'
  },
  legacyRawSheets: [
    '_SDSC_PAGE_DAILY',
    '_SDSC_QUERY_DAILY',
    '_SDSC_PAGE_QUERY'
  ]
});

function sdscGetConfig_() {
  const raw = PropertiesService.getDocumentProperties().getProperty(SDSC_CONFIG.configPropertyKey);
  return raw ? JSON.parse(raw) : {};
}
function sdscSaveConfig_(obj) {
  PropertiesService.getDocumentProperties().setProperty(SDSC_CONFIG.configPropertyKey, JSON.stringify(obj));
}
function sdscGetRun_() {
  const raw = PropertiesService.getDocumentProperties().getProperty(SDSC_CONFIG.runPropertyKey);
  return raw ? JSON.parse(raw) : null;
}
function sdscSaveRun_(run) {
  PropertiesService.getDocumentProperties().setProperty(SDSC_CONFIG.runPropertyKey, JSON.stringify(run));
}

function sdscResolveOutputFolderId_(input) {
  const value=String(input||'').trim();
  if(!value)return '';
  const m=value.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : value;
}
function sdscGetOutputFolderInfo_(config) {
  const folderId=sdscResolveOutputFolderId_(config&&config.outputFolderId);
  if(folderId){
    try{
      const folder=DriveApp.getFolderById(folderId);
      return {folder:folder,id:folder.getId(),name:folder.getName(),url:folder.getUrl(),isDefault:false};
    }catch(e){
      throw new Error('設定済みのEvidence保存先フォルダーを開けません。「1. 収集するサイトを選ぶ」で保存先を再設定してください。');
    }
  }
  const folder=sdscGetOrCreateFolder_(SDSC_CONFIG.outputFolderName);
  return {folder:folder,id:folder.getId(),name:folder.getName(),url:folder.getUrl(),isDefault:true};
}

function sdscResolvePeriod_(days) {
  const tz = Session.getScriptTimeZone() || 'Asia/Tokyo';
  const end = new Date();
  end.setDate(end.getDate() - 3);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  return {
    startDate: Utilities.formatDate(start, tz, 'yyyy-MM-dd'),
    endDate: Utilities.formatDate(end, tz, 'yyyy-MM-dd'),
    days
  };
}

// ============================================================================
// Search Console API (source: SearchConsoleClient.gs)
// ============================================================================

function sdscGetAccessibleSites_() {
  const res = sdscFetchJson_(`${SDSC_CONFIG.apiBase}/sites`, { method: 'get' });
  return (res.siteEntry || []).filter(x => x.siteUrl && x.permissionLevel !== 'siteUnverifiedUser');
}
function sdscSearchAnalyticsQuery_(siteUrl, body) {
  const encoded = encodeURIComponent(siteUrl);
  return sdscFetchJson_(`${SDSC_CONFIG.apiBase}/sites/${encoded}/searchAnalytics/query`, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(body)
  });
}
function sdscFetchJson_(url, options) {
  const opts = Object.assign({}, options || {});
  opts.muteHttpExceptions = true;
  opts.headers = Object.assign({}, opts.headers || {}, {
    Authorization: `Bearer ${ScriptApp.getOAuthToken()}`
  });
  let delay = 1000;
  for (let i = 0; i <= SDSC_CONFIG.maxRetries; i++) {
    const response = UrlFetchApp.fetch(url, opts);
    const code = response.getResponseCode();
    const text = response.getContentText();
    if (code >= 200 && code < 300) return text ? JSON.parse(text) : {};
    if ((code === 429 || code >= 500) && i < SDSC_CONFIG.maxRetries) {
      Utilities.sleep(delay);
      delay = Math.min(delay * 2, 16000);
      continue;
    }
    throw new Error(`Search Console API error ${code}: ${text}`);
  }
  throw new Error('Search Console API retry limit exceeded.');
}

// ============================================================================
// Checkpoint / Auto Resume (source: CheckpointStore.gs)
// ============================================================================

function sdscPauseAndSchedule_(run, note) {
  run.status = 'PAUSED_AUTO_RESUME';
  run.pauseReason = note || '';
  run.updatedAt = new Date().toISOString();
  sdscSaveRun_(run);
  sdscClearResumeTrigger_();
  ScriptApp.newTrigger('sdscResumeCollection')
    .timeBased()
    .after(SDSC_CONFIG.resumeDelayMinutes * 60 * 1000)
    .create();
}
function sdscClearResumeTrigger_() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'sdscResumeCollection') ScriptApp.deleteTrigger(t);
  });
}

// ============================================================================
// Period Helpers (source: PeriodHelpers.gs)
// ============================================================================

function sdscDateRange_(startDate, endDate) {
  const out = [];
  const d = new Date(startDate + 'T00:00:00Z');
  const e = new Date(endDate + 'T00:00:00Z');
  while (d <= e) {
    out.push(Utilities.formatDate(d, 'Etc/UTC', 'yyyy-MM-dd'));
    d.setUTCDate(d.getUTCDate()+1);
  }
  return out;
}
function sdscShiftDate_(dateStr, deltaDays) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate()+deltaDays);
  return Utilities.formatDate(d, 'Etc/UTC', 'yyyy-MM-dd');
}
function sdscPeriodDefinitions_(run) {
  const days = run.period.days;
  const half = Math.floor(days / 2);
  const firstEnd = sdscShiftDate_(run.period.startDate, half - 1);
  const secondStart = sdscShiftDate_(firstEnd, 1);
  const recentStart = sdscShiftDate_(run.period.endDate, -27);
  const prevEnd = sdscShiftDate_(recentStart, -1);
  const prevStart = sdscShiftDate_(prevEnd, -27);
  return [
    {key:'full', startDate:run.period.startDate, endDate:run.period.endDate},
    {key:'first_half', startDate:run.period.startDate, endDate:firstEnd},
    {key:'second_half', startDate:secondStart, endDate:run.period.endDate},
    {key:'recent28', startDate:recentStart, endDate:run.period.endDate},
    {key:'previous28', startDate:prevStart, endDate:prevEnd}
  ];
}
function sdscWeekDefinitions_(run) {
  const dates = sdscDateRange_(run.period.startDate, run.period.endDate);
  const out = [];
  for (let i=0; i<dates.length; i+=7) {
    out.push({startDate:dates[i], endDate:dates[Math.min(i+6, dates.length-1)]});
  }
  return out;
}

// ============================================================================
// Active URL Resolver (source: ActiveUrlResolver.gs)
// ============================================================================

function sdscParseUrl_(url) {
  const s = String(url || '').trim();
  const m = s.match(/^(https?):\/\/([^\/?#]+)([^?#]*)(?:\?[^#]*)?(?:#.*)?$/i);
  if (!m) return null;
  return {
    protocol: m[1].toLowerCase(),
    host: m[2].toLowerCase(),
    path: m[3] || '/'
  };
}

function sdscNormalizeUrl_(url) {
  const p = sdscParseUrl_(url);
  if (!p) return String(url || '').split('#')[0].split('?')[0];
  let path = p.path || '/';
  path = path.replace(/\/+$/, '');
  if (path === '') path = '/';
  return `${p.protocol}://${p.host}${path}`;
}

function sdscSameHost_(a, b) {
  const pa = sdscParseUrl_(a);
  const pb = sdscParseUrl_(b);
  return !!(pa && pb && pa.host === pb.host);
}

function sdscLooksLikeArticleUrl_(url, siteUrl) {
  if (!sdscSameHost_(url, siteUrl)) return false;
  const p = sdscParseUrl_(url);
  if (!p) return false;
  const path = p.path || '/';
  const lower = path.toLowerCase();

  const excluded = [
    '/archive', '/archives', '/category/', '/categories/', '/tag/', '/tags/',
    '/search/', '/about', '/information/', '/privacy', '/contact', '/feed',
    '/rss', '/sitemap', '/wp-admin', '/wp-login', '/author/', '/page/'
  ];
  if (path === '/' || excluded.some(x => lower.indexOf(x) >= 0)) return false;

  // Hatena Blog canonical article path, including HHMMSS tail.
  if (/^\/entry\/\d{4}\/\d{2}\/\d{2}\/[^\/?#]+\/?$/.test(path)) return true;

  // Common WordPress numeric permalink.
  if (/^\/\d+\/?$/.test(path)) return true;

  // Dated permalink fallback.
  if (/^\/\d{4}\/\d{2}\/\d{2}\/.+/.test(path)) return true;

  return false;
}

function sdscResolveActiveArticleUrls_(observedPages, siteUrl) {
  const observedMap = {};
  (observedPages || []).forEach(p => {
    const original = String(p || '');
    const n = sdscNormalizeUrl_(original);
    // Prefer the fragment/query-free exact GSC URL as the page filter target.
    if (!observedMap[n] || (!original.includes('#') && !original.includes('?'))) {
      observedMap[n] = original;
    }
  });

  const sitemapUrls = sdscDiscoverSitemapArticleUrls_(siteUrl);
  const sitemapSet = {};
  sitemapUrls.forEach(u => { sitemapSet[sdscNormalizeUrl_(u)] = true; });

  const intersectionKeys = Object.keys(observedMap).filter(n => sitemapSet[n]);
  if (intersectionKeys.length >= 20) {
    return {
      strategy: 'SITEMAP_INTERSECTION',
      pages: intersectionKeys.map(n => observedMap[n]).sort(),
      observedCount: Object.keys(observedMap).length,
      sitemapCount: Object.keys(sitemapSet).length
    };
  }

  const heuristic = Object.keys(observedMap)
    .filter(n => sdscLooksLikeArticleUrl_(observedMap[n], siteUrl))
    .map(n => observedMap[n])
    .sort();

  return {
    strategy: 'ARTICLE_URL_HEURISTIC',
    pages: heuristic,
    observedCount: Object.keys(observedMap).length,
    sitemapCount: Object.keys(sitemapSet).length
  };
}

function sdscDiscoverSitemapArticleUrls_(siteUrl) {
  const seeds = sdscSitemapSeeds_(siteUrl);
  const visited = {};
  const urls = [];
  const queue = seeds.slice();
  const maxSitemaps = 60;

  while (queue.length && Object.keys(visited).length < maxSitemaps) {
    const sitemapUrl = queue.shift();
    if (!sitemapUrl || visited[sitemapUrl]) continue;
    visited[sitemapUrl] = true;
    try {
      const response = UrlFetchApp.fetch(sitemapUrl, {
        muteHttpExceptions: true,
        followRedirects: true,
        headers: {'User-Agent':'SIMS-Doctor-Site-Collector/0.2'}
      });
      const code = response.getResponseCode();
      if (code < 200 || code >= 300) continue;
      const doc = XmlService.parse(response.getContentText());
      const root = doc.getRootElement();
      const ns = root.getNamespace();
      const rootName = root.getName().toLowerCase();

      if (rootName === 'sitemapindex') {
        root.getChildren('sitemap', ns).forEach(node => {
          const loc = node.getChildText('loc', ns);
          if (loc && !visited[loc]) queue.push(loc.trim());
        });
      } else if (rootName === 'urlset') {
        root.getChildren('url', ns).forEach(node => {
          const loc = node.getChildText('loc', ns);
          if (loc && sdscSameHost_(loc.trim(), siteUrl)) urls.push(loc.trim());
        });
      }
    } catch (e) {}
  }
  return [...new Set(urls)];
}

function sdscSitemapSeeds_(siteUrl) {
  const base = String(siteUrl || '').replace(/\/+$/, '');
  const out = [`${base}/sitemap.xml`, `${base}/sitemap_index.xml`];
  try {
    const res = UrlFetchApp.fetch(`${base}/robots.txt`, {muteHttpExceptions:true});
    if (res.getResponseCode() >= 200 && res.getResponseCode() < 300) {
      res.getContentText().split(/\r?\n/).forEach(line => {
        const m = line.match(/^\s*Sitemap:\s*(\S+)/i);
        if (m) out.push(m[1]);
      });
    }
  } catch (e) {}
  return [...new Set(out)];
}

// ============================================================================
// Storage (source: Storage.gs)
// ============================================================================

function sdscTidyUserSheets(){
  sdscTidyUserSheets_();
  SpreadsheetApp.getUi().alert(
    'シートを整理しました。\n\n利用者が通常確認するのは「収集状況」シートだけです。\n収集用の内部シートは非表示にしました。'
  );
}

function sdscTidyUserSheets_(){
  const ss=SpreadsheetApp.getActive();
  const legacyStatus=ss.getSheetByName('_SDSC_STATUS');
  if(legacyStatus&&!ss.getSheetByName(SDSC_CONFIG.sheets.status)){
    try{legacyStatus.setName(SDSC_CONFIG.sheets.status);}catch(e){}
  }
  const internalNames=[
    SDSC_CONFIG.sheets.siteDaily,
    SDSC_CONFIG.sheets.pagePeriod,
    SDSC_CONFIG.sheets.pageWeekly,
    SDSC_CONFIG.sheets.queryPeriod,
    SDSC_CONFIG.sheets.pageQueryTop
  ];

  internalNames.forEach(name=>{
    const sh=ss.getSheetByName(name);
    if(sh){
      try{sh.hideSheet();}catch(e){}
    }
  });

  const status=ss.getSheetByName(SDSC_CONFIG.sheets.status);
  if(status){
    try{status.showSheet();}catch(e){}
  }

  // A newly-created spreadsheet contains a blank "シート1" / "Sheet1".
  // Delete it only when it is still effectively empty and another sheet exists.
  ['シート1','Sheet1'].forEach(name=>{
    const sh=ss.getSheetByName(name);
    if(!sh||ss.getSheets().length<=1)return;
    if(sdscIsEffectivelyBlankSheet_(sh)){
      try{ss.deleteSheet(sh);}catch(e){}
    }
  });
}

function sdscIsEffectivelyBlankSheet_(sh){
  if(!sh)return false;
  try{
    if(sh.getLastRow()===0||sh.getLastColumn()===0)return true;
    const values=sh.getDataRange().getDisplayValues();
    for(let r=0;r<values.length;r++){
      for(let c=0;c<values[r].length;c++){
        if(String(values[r][c]||'').trim()!=='')return false;
      }
    }
    return true;
  }catch(e){
    return false;
  }
}

function sdscPrepareCompactSheets_() {
  const ss = SpreadsheetApp.getActive();
  const defs = [
    [SDSC_CONFIG.sheets.status, ['item','value']],
    [SDSC_CONFIG.sheets.siteDaily, ['date','clicks','impressions','ctr','position']],
    [SDSC_CONFIG.sheets.pagePeriod, ['period','page','clicks','impressions','ctr','position']],
    [SDSC_CONFIG.sheets.pageWeekly, ['week_start','week_end','page','clicks','impressions','ctr','position']],
    [SDSC_CONFIG.sheets.queryPeriod, ['period','query','clicks','impressions','ctr','position']],
    [SDSC_CONFIG.sheets.pageQueryTop, ['page','query','clicks','impressions','ctr','position']]
  ];
  defs.forEach(([name, headers]) => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    sh.clearContents();
    sh.getRange(1,1,1,headers.length).setValues([headers]);
    if (name !== SDSC_CONFIG.sheets.status) {
      try { sh.hideSheet(); } catch (e) {}
    }
  });
  sdscTidyUserSheets_();
}
function sdscAppendRows_(sheetName, rows) {
  if (!rows || !rows.length) return;
  const sh = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sh) throw new Error(`Output sheet not found: ${sheetName}`);
  sh.getRange(sh.getLastRow()+1, 1, rows.length, rows[0].length).setValues(rows);
}
function sdscDeleteLegacyRawSheetsWithConfirmation_() {
  const ss = SpreadsheetApp.getActive();
  const existing = SDSC_CONFIG.legacyRawSheets
    .map(n => ss.getSheetByName(n))
    .filter(Boolean);
  if (!existing.length) return true;
  const ui = SpreadsheetApp.getUi();
  const answer = ui.alert(
    '旧Collectorの巨大な生データシートを削除します',
    'v0.2.0では pageDaily / queryDaily の大量生データを保存しません。\n' +
    '1,000万セル制限を回避するため、旧Collectorの生データ用シートを削除します。\n\n' +
    'Evidence ZIPなど必要な成果物がある場合は先に保存してください。\n\n削除して新しい収集を開始しますか？',
    ui.ButtonSet.YES_NO
  );
  if (answer !== ui.Button.YES) return false;
  existing.forEach(sh => ss.deleteSheet(sh));
  return true;
}
function sdscStatusLabel_(status){
  const map={RUNNING:'収集中',PAUSED_AUTO_RESUME:'自動再開待ち',COMPLETED:'完了',ERROR:'エラー'};
  return map[String(status||'')]||String(status||'未開始');
}

function sdscWriteStatus_(run) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SDSC_CONFIG.sheets.status);
  if (!sh) return;
  const config=sdscGetConfig_();
  const rows = [
    ['Collectorバージョン', SDSC_VERSION],
    ['サイト名', config.siteName || sdscSuggestedSiteName_(config.siteUrl) || ''],
    ['対象サイト', config.siteUrl || ''],
    ['状態', sdscStatusLabel_(run.status)],
    ['進行ステップ', run.status==='COMPLETED'?'6/6':`${Math.min(Number(run.step||0),6)}/6`],
    ['収集期間', `${run.period ? run.period.days : ''}日`],
    ['進捗', run.progressText || ''],
    ['開始日時', sdscFormatDateTime_(run.startedAt)],
    ['完了日時', sdscFormatDateTime_(run.completedAt) || (run.status==='COMPLETED'?'完了時刻を確認中':'-')],
    ['収集時バージョン', String(run.collectorVersion || '(記録なし)')],
    ['パッケージ名', sdscResolveRunOutputFileName_(run) || '(未生成)'],
    ['Evidence Package', run.outputFileUrl || '(未生成)'],
    ['保存先', run.outputFolderName || ''],
    ['最新エラー', (run.errors && run.errors.length) ? run.errors[run.errors.length-1].message : 'なし']
  ];
  sh.clear();
  sh.getRange(1,1,1,2).setValues([['Site Collector','収集状況']]);
  sh.getRange(2,1,1,2).setValues([['項目','内容']]);
  sh.getRange(3,1,rows.length,2).setValues(rows);
  sh.setFrozenRows(2);
  sh.setColumnWidth(1,140);
  sh.setColumnWidth(2,520);
  sh.getRange(1,1,1,2).merge().setValue('Site Collector｜収集状況').setFontWeight('bold').setFontSize(16).setBackground('#174ea6').setFontColor('#ffffff').setHorizontalAlignment('left');
  sh.getRange(2,1,1,2).setFontWeight('bold').setBackground('#dbe8ff').setFontColor('#174ea6');
  sh.getRange(3,1,rows.length,1).setFontWeight('bold').setBackground('#f3f6fb').setFontColor('#4a5568');
  sh.getRange(3,2,rows.length,1).setWrap(true).setVerticalAlignment('top');
  const statusCell=sh.getRange(6,2); // row 3 + status index 3
  if(run.status==='COMPLETED')statusCell.setBackground('#e6f4ea').setFontColor('#137333').setFontWeight('bold');
  else if(run.status==='ERROR')statusCell.setBackground('#fce8e6').setFontColor('#c5221f').setFontWeight('bold');
  else if(run.status==='PAUSED_AUTO_RESUME')statusCell.setBackground('#fef7e0').setFontColor('#b06000').setFontWeight('bold');
  else statusCell.setBackground('#e8f0fe').setFontColor('#174ea6').setFontWeight('bold');
  sh.getRange(1,1,rows.length+2,2).setBorder(true,true,true,true,true,true,'#d9e2f1',SpreadsheetApp.BorderStyle.SOLID);
}
function sdscReadData_(sheetName) {
  const sh = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sh) return [];
  const v = sh.getDataRange().getValues();
  return v.length > 1 ? v.slice(1) : [];
}
function sdscSheetToCsv_(sheetName) {
  const sh = SpreadsheetApp.getActive().getSheetByName(sheetName);
  return sdscValuesToCsv_(sh.getDataRange().getDisplayValues());
}
function sdscValuesToCsv_(rows) {
  return rows.map(r => r.map(v => `"${String(v == null ? '' : v).replace(/"/g,'""')}"`).join(',')).join('\r\n');
}

// ============================================================================
// Collectors (source: Collectors.gs)
// ============================================================================

function sdscCollectSiteDaily_(run, deadline) {
  const config = sdscGetConfig_();
  const dates = sdscDateRange_(run.period.startDate, run.period.endDate);
  let i = run.cursors.siteDaily || 0;
  const rows = [];
  while (i < dates.length && Date.now() < deadline - SDSC_CONFIG.deadlineGuardMs) {
    const d = dates[i];
    const res = sdscSearchAnalyticsQuery_(config.siteUrl, {
      startDate:d, endDate:d, type:'web', dataState:'final', rowLimit:1
    });
    const r = (res.rows || [])[0] || {};
    rows.push([d,r.clicks||0,r.impressions||0,r.ctr||0,r.position||0]);
    i++;
  }
  sdscAppendRows_(SDSC_CONFIG.sheets.siteDaily, rows);
  run.cursors.siteDaily = i;
  run.rows.siteDaily = (run.rows.siteDaily||0) + rows.length;
  run.progressText = `サイト日次データ: ${i}/${dates.length}日`;
  if (i >= dates.length) run.step = 2;
  else sdscPauseAndSchedule_(run, run.progressText);
}

function sdscCollectPeriodDimension_(run, deadline, dimension, sheetName, cursorKey, nextStep) {
  const config = sdscGetConfig_();
  const periods = sdscPeriodDefinitions_(run);
  let state = run.cursors[cursorKey] || {periodIndex:0,startRow:0};
  let batches = 0;
  while (
    state.periodIndex < periods.length &&
    Date.now() < deadline - SDSC_CONFIG.deadlineGuardMs &&
    batches < SDSC_CONFIG.maxBatchesPerInvocation
  ) {
    const p = periods[state.periodIndex];
    const res = sdscSearchAnalyticsQuery_(config.siteUrl, {
      startDate:p.startDate, endDate:p.endDate, type:'web', dataState:'final',
      dimensions:[dimension], rowLimit:SDSC_CONFIG.rowLimit, startRow:state.startRow
    });
    const apiRows = res.rows || [];
    const rows = apiRows.map(r => [
      p.key,
      r.keys ? r.keys[0] : '',
      r.clicks||0,r.impressions||0,r.ctr||0,r.position||0
    ]);
    sdscAppendRows_(sheetName, rows);
    run.rows[cursorKey] = (run.rows[cursorKey]||0) + rows.length;
    if (apiRows.length < SDSC_CONFIG.rowLimit) {
      state = {periodIndex:state.periodIndex+1,startRow:0};
    } else {
      state.startRow += SDSC_CONFIG.rowLimit;
    }
    run.cursors[cursorKey] = state;
    run.progressText = `${cursorKey}: 期間 ${Math.min(state.periodIndex+1,periods.length)}/${periods.length}・${run.rows[cursorKey]}行`;
    sdscSaveRun_(run);
    batches++;
  }
  if (state.periodIndex >= periods.length) run.step = nextStep;
  else sdscPauseAndSchedule_(run, run.progressText);
}

function sdscCollectPagePeriod_(run, deadline) {
  sdscCollectPeriodDimension_(run, deadline, 'page', SDSC_CONFIG.sheets.pagePeriod, 'pagePeriod', 3);
}
function sdscCollectQueryPeriod_(run, deadline) {
  sdscCollectPeriodDimension_(run, deadline, 'query', SDSC_CONFIG.sheets.queryPeriod, 'queryPeriod', 5);
}

function sdscCollectPageWeekly_(run, deadline) {
  const config = sdscGetConfig_();
  const weeks = sdscWeekDefinitions_(run);
  let state = run.cursors.pageWeekly || {weekIndex:0,startRow:0};
  let batches = 0;
  while (
    state.weekIndex < weeks.length &&
    Date.now() < deadline - SDSC_CONFIG.deadlineGuardMs &&
    batches < SDSC_CONFIG.maxBatchesPerInvocation
  ) {
    const w = weeks[state.weekIndex];
    const res = sdscSearchAnalyticsQuery_(config.siteUrl, {
      startDate:w.startDate,endDate:w.endDate,type:'web',dataState:'final',
      dimensions:['page'],rowLimit:SDSC_CONFIG.rowLimit,startRow:state.startRow
    });
    const apiRows = res.rows || [];
    const rows = apiRows.map(r => [
      w.startDate,w.endDate,r.keys?r.keys[0]:'',
      r.clicks||0,r.impressions||0,r.ctr||0,r.position||0
    ]);
    sdscAppendRows_(SDSC_CONFIG.sheets.pageWeekly, rows);
    run.rows.pageWeekly=(run.rows.pageWeekly||0)+rows.length;
    if (apiRows.length < SDSC_CONFIG.rowLimit) state={weekIndex:state.weekIndex+1,startRow:0};
    else state.startRow += SDSC_CONFIG.rowLimit;
    run.cursors.pageWeekly=state;
    run.progressText=`ページ週次: ${Math.min(state.weekIndex+1,weeks.length)}/${weeks.length}週・${run.rows.pageWeekly}行`;
    sdscSaveRun_(run);
    batches++;
  }
  if (state.weekIndex >= weeks.length) run.step=4;
  else sdscPauseAndSchedule_(run,run.progressText);
}

function sdscCollectPageQueryTop_(run, deadline) {
  const config = sdscGetConfig_();

  if (!run.pageQueryTargetUrls) {
    const pageRows = sdscReadData_(SDSC_CONFIG.sheets.pagePeriod)
      .filter(r => r[0] === 'full' && r[1]);
    const observedPages = [...new Set(pageRows.map(r => String(r[1])))];
    const resolved = sdscResolveActiveArticleUrls_(observedPages, config.siteUrl);

    run.pageQueryTargetUrls = resolved.pages;
    run.pageQueryTargetStrategy = resolved.strategy;
    run.urlResolution = {
      observedPages: resolved.observedCount,
      sitemapUrls: resolved.sitemapCount,
      targetPages: resolved.pages.length,
      strategy: resolved.strategy
    };
    run.cursors.pageQueryTop = 0;
    run.progressText =
      `ページ別上位クエリ対象を確定: ${resolved.pages.length}ページ ` +
      `(${resolved.strategy}, GSC ${resolved.observedCount} URL → 対象 ${resolved.pages.length})`;
    sdscSaveRun_(run);
  }

  const pages = run.pageQueryTargetUrls || [];
  let i = run.cursors.pageQueryTop || 0;
  let batches = 0;

  while (
    i < pages.length &&
    Date.now() < deadline - SDSC_CONFIG.deadlineGuardMs &&
    batches < SDSC_CONFIG.pageQueryMaxBatchesPerInvocation
  ) {
    const page = pages[i];
    const res = sdscSearchAnalyticsQuery_(config.siteUrl, {
      startDate: run.period.startDate,
      endDate: run.period.endDate,
      type: 'web',
      dataState: 'final',
      dimensions: ['query'],
      rowLimit: SDSC_CONFIG.topQueriesPerPage,
      startRow: 0,
      dimensionFilterGroups: [{
        groupType: 'and',
        filters: [{
          dimension: 'page',
          operator: 'equals',
          expression: page
        }]
      }]
    });

    const rows = (res.rows || []).map(r => [
      page,
      r.keys ? r.keys[0] : '',
      r.clicks || 0,
      r.impressions || 0,
      r.ctr || 0,
      r.position || 0
    ]);

    sdscAppendRows_(SDSC_CONFIG.sheets.pageQueryTop, rows);
    run.rows.pageQueryTop = (run.rows.pageQueryTop || 0) + rows.length;
    i++;
    run.cursors.pageQueryTop = i;
    run.progressText =
      `ページ別上位クエリ: ${i}/${pages.length}ページ ` +
      `(${run.pageQueryTargetStrategy || 'UNKNOWN'})`;
    sdscSaveRun_(run);
    batches++;
  }

  if (i >= pages.length) run.step = 6;
  else sdscPauseAndSchedule_(run, run.progressText);
}

// ============================================================================
// Evidence Packager (source: EvidencePackager.gs)
// ============================================================================

function sdscFinalizeEvidence_(run) {
  const config=sdscGetConfig_();
  const files=[];
  const datasets=[];
  run.warnings=run.warnings||[];

  const siteRaw=sdscReadData_(SDSC_CONFIG.sheets.siteDaily);
  const siteRows=sdscDedupeRows_(siteRaw, r=>String(r[0]||''));
  if(siteRows.length!==siteRaw.length) run.warnings.push(`site_daily duplicate rows removed: ${siteRaw.length-siteRows.length}`);
  const siteValues=[['date','clicks','impressions','ctr','position']].concat(siteRows);
  files.push(Utilities.newBlob(sdscValuesToCsv_(siteValues),'text/csv','site_daily.csv'));
  datasets.push({name:'site_daily',file:'site_daily.csv',rowCount:siteRows.length,status:siteRows.length===run.period.days?'VALID':'WARNING'});

  const pageSummary=sdscBuildWideSummary_(sdscReadData_(SDSC_CONFIG.sheets.pagePeriod),'page');
  files.push(Utilities.newBlob(pageSummary.csv,'text/csv','page_summary.csv'));
  datasets.push({name:'page_summary',file:'page_summary.csv',rowCount:pageSummary.rowCount,status:'VALID'});

  const weeklyRaw=sdscReadData_(SDSC_CONFIG.sheets.pageWeekly);
  const weeklyRows=sdscDedupeRows_(weeklyRaw,r=>`${r[0]}|${r[1]}|${r[2]}`);
  if(weeklyRows.length!==weeklyRaw.length) run.warnings.push(`page_weekly duplicate rows removed: ${weeklyRaw.length-weeklyRows.length}`);
  const weeklyValues=[['week_start','week_end','page','clicks','impressions','ctr','position']].concat(weeklyRows);
  files.push(Utilities.newBlob(sdscValuesToCsv_(weeklyValues),'text/csv','page_weekly.csv'));
  datasets.push({name:'page_weekly',file:'page_weekly.csv',rowCount:weeklyRows.length,status:'VALID'});

  const querySummary=sdscBuildWideSummary_(sdscReadData_(SDSC_CONFIG.sheets.queryPeriod),'query');
  files.push(Utilities.newBlob(querySummary.csv,'text/csv','query_summary.csv'));
  datasets.push({name:'query_summary',file:'query_summary.csv',rowCount:querySummary.rowCount,status:'VALID'});

  const pqRaw=sdscReadData_(SDSC_CONFIG.sheets.pageQueryTop);
  const pqRows=sdscDedupeRows_(pqRaw,r=>`${r[0]}|${r[1]}`);
  if(pqRows.length!==pqRaw.length) run.warnings.push(`page_query_top duplicate rows removed: ${pqRaw.length-pqRows.length}`);
  const pqValues=[['page','query','clicks','impressions','ctr','position']].concat(pqRows);
  files.push(Utilities.newBlob(sdscValuesToCsv_(pqValues),'text/csv','page_query_top.csv'));

  const targetCount=(run.urlResolution&&run.urlResolution.targetPages)||0;
  const pqMissingForTargets=targetCount>0&&pqRows.length===0;
  const pqStatus=pqMissingForTargets?'WARNING':'VALID';
  datasets.push({name:'page_query_top',file:'page_query_top.csv',rowCount:pqRows.length,status:pqStatus});

  if(siteRows.length!==run.period.days) {
    run.warnings.push(`site_daily expected ${run.period.days} dates but found ${siteRows.length}`);
  }
  const observedCount=(run.urlResolution&&run.urlResolution.observedPages)||0;
  if(observedCount>0&&targetCount===0) {
    throw new Error(`Evidence validation failed: URL resolver selected 0 target pages from ${observedCount} observed pages.`);
  }
  if(pqMissingForTargets) {
    run.warnings.push(`page_query_top is empty for ${targetCount} target pages; Search Console may not yet expose page-level queries for these low-volume pages.`);
  }

  const report={
    format:'SIMS_DOCTOR_SITE_COLLECTION_REPORT_V2',
    status:'COMPLETED',
    startedAt:run.startedAt,
    completedAt:new Date().toISOString(),
    datasets,
    warnings:run.warnings||[],
    errors:[],
    storageMode:'COMPACT_EVIDENCE',
    urlResolution:run.urlResolution||null,
    note:'Large raw pageDaily/queryDaily datasets are intentionally not stored. Page trend is represented by page_weekly and period summaries.'
  };
  files.push(Utilities.newBlob(JSON.stringify(report,null,2),'application/json','collection_report.json'));

  const manifest={
    format:'SIMS_DOCTOR_SITE_EVIDENCE_PACKAGE_V2',
    packageVersion:'2.0.0-rc6',
    collectorVersion:SDSC_VERSION,
    siteId:sssConfig_().siteId,
    generatedAt:new Date().toISOString(),
    timezone:config.timezone||'Asia/Tokyo',
    site:{siteName:config.siteName||sdscSuggestedSiteName_(config.siteUrl),siteUrl:config.siteUrl,searchConsoleProperty:config.siteUrl},
    period:run.period,
    searchType:'web',
    storageMode:'COMPACT_EVIDENCE',
    urlResolution:run.urlResolution||null,
    datasets,
    evidenceQuality:{
      overall:run.warnings.length?'VALID_WITH_LIMITATIONS':'VALID',
      limitations:[
        'Search Console API may omit low-volume combinations.',
        'page_query_top contains up to the configured top queries per observed active article page.',
        'Page trend is weekly rather than full page-by-day raw storage.'
      ],
      warnings:run.warnings
    }
  };
  files.push(Utilities.newBlob(JSON.stringify(manifest,null,2),'application/json','manifest.json'));
  files.push(Utilities.newBlob(sdscReadmeText_(),'text/plain','README-FIRST.md'));

  const zipName=sdscNormalizeZipName_(run.outputFileName||sdscCanonicalEvidenceFileName_(config,run.startedAt));
  const folderInfo=sdscGetOutputFolderInfo_({outputFolderId:run.requestedOutputFolderId||config.outputFolderId||''});
  const file=folderInfo.folder.createFile(Utilities.zip(files,zipName));
  run.outputFileName=zipName;
  run.outputFileId=file.getId();
  run.outputFileUrl=file.getUrl();
  run.outputFolderId=folderInfo.id;
  run.outputFolderName=folderInfo.name;
  run.outputFolderUrl=folderInfo.url;
  run.status='COMPLETED';
  run.step=7;
  run.completedAt=new Date().toISOString();
  const warningCount=(run.warnings||[]).length;
  const pageQueryWarning=pqMissingForTargets?`（検索クエリ未取得: ${targetCount}記事）`:'';
  run.progressText=`Evidence Package生成完了${pageQueryWarning}：${zipName}`;
  run.errors=[];
  sdscSaveRun_(run);
  sdscWriteStatus_(run);
  sdscClearResumeTrigger_();
  try { sssIndexCompletedEvidence_(run); } catch (e) { sssAudit_('EVIDENCE_INDEX_ERROR',sssConfig_().siteId,String(e)); }
}

function sdscDedupeRows_(rows,keyFn){
  const map={};
  (rows||[]).forEach(r=>{ const k=keyFn(r); if(k) map[k]=r; });
  return Object.keys(map).sort().map(k=>map[k]);
}

function sdscBuildWideSummary_(rows, keyLabel) {
  const periods=['full','first_half','second_half','recent28','previous28'];
  const by={};
  rows.forEach(r=>{
    const period=String(r[0]||'');
    const key=String(r[1]||'');
    if(!key)return;
    by[key]=by[key]||{};
    by[key][period]={
      clicks:Number(r[2]||0),impressions:Number(r[3]||0),
      ctr:Number(r[4]||0),position:Number(r[5]||0)
    };
  });
  const headers=['key'];
  periods.forEach(p=>headers.push(`clicks_${p}`,`impressions_${p}`,`ctr_${p}`,`position_${p}`));
  const out=[headers];
  Object.keys(by).sort().forEach(key=>{
    const row=[key];
    periods.forEach(p=>{
      const m=by[key][p]||{clicks:0,impressions:0,ctr:0,position:0};
      row.push(m.clicks,m.impressions,m.ctr,m.position);
    });
    out.push(row);
  });
  return {csv:sdscValuesToCsv_(out),rowCount:out.length-1};
}
function sdscGetOrCreateFolder_(name) {
  const it=DriveApp.getFoldersByName(name);
  return it.hasNext()?it.next():DriveApp.createFolder(name);
}
function sdscReadmeText_() {
  return [
    'SIMS Doctor Site Evidence Package v2',
    '',
    'このZIPをSIMS Site Doctorへ添付してください。',
    'Collectorは診断を行わず、Search Console Evidenceのみを収集します。',
    '',
    'Compact Evidence:',
    '- site_daily.csv',
    '- page_summary.csv',
    '- page_weekly.csv',
    '- query_summary.csv',
    '- page_query_top.csv',
    '',
    'pageDaily/queryDailyの巨大な生データはGoogle Sheetsの1,000万セル制限回避のため保存しません。'
  ].join('\n');
}


// P2: durable evidence registry. No GSC re-query or destructive changes.
const SSS_EVIDENCE_SHEET='EvidenceRegistry';
function sssEvidenceSheet_(){
  const ss=sssSpreadsheet_();
  let sh=ss.getSheetByName(SSS_EVIDENCE_SHEET);
  if(!sh){sh=ss.insertSheet(SSS_EVIDENCE_SHEET);sh.appendRow(['登録日時','サイトID','GSCプロパティ','収集開始','収集終了','収集日数','完了日時','ZIPファイルID','ZIP名','ZIP URL','Collectorバージョン','状態']);sh.setFrozenRows(1);sh.setColumnWidth(10,460);}
  return sh;
}
function sssIndexCompletedEvidence_(run){
  const c=sssConfig_();
  if(!c.lockedAt)throw new Error('サイト未登録です。');
  if(!run||run.status!=='COMPLETED'||!run.outputFileId||!run.outputFileUrl)throw new Error('完了したEvidence ZIPがありません。');
  if(run.siteId!==c.siteId)throw new Error('EvidenceのサイトIDが一致しません。');
  const config=sdscGetConfig_();
  if(config.siteUrl!==c.propertyUri)throw new Error('EvidenceのGSCプロパティが一致しません。');
  const f=DriveApp.getFileById(run.outputFileId);
  if(f.isTrashed()||f.getMimeType()!=='application/zip')throw new Error('Evidence ZIPが存在しないか形式が異なります。');
  const sh=sssEvidenceSheet_();
  const last=sh.getLastRow();
  if(last>1){
    const ids=sh.getRange(2,8,last-1,1).getValues();
    if(ids.some(row=>String(row[0])===String(run.outputFileId)))return false;
  }
  sh.appendRow([new Date(),c.siteId,c.propertyUri,run.period.startDate,run.period.endDate,run.period.days,run.completedAt,run.outputFileId,run.outputFileName,run.outputFileUrl,run.collectorVersion||SDSC_VERSION,run.deltaAcquisition?'DELTA_UNMERGED':'REGISTERED_UNVERIFIED']);
  sssAudit_('EVIDENCE_REGISTERED',c.siteId,run.outputFileName);
  return true;
}
function sssRegisterEvidenceSnapshot(){
  sssRefreshVersion_();
  const run=sdscGetRun_();
  const added=sssIndexCompletedEvidence_(run);
  const sh=sssEvidenceSheet_();
  SpreadsheetApp.getUi().alert((added?'Evidence ZIPを共通台帳へ登録しました。':'既に登録済みです。')+'\n登録件数：'+Math.max(0,sh.getLastRow()-1)+'\n\n注意：ZIP内部のデータ品質は未検証です。差分更新はまだ実装されていません。');
}

// P2B: Validate archived Evidence without mutating collected data.
// A completed run is not sufficient proof of complete Search Console coverage.
function sssVerifyLatestEvidence(){
  sssRefreshVersion_();
  const sh=sssEvidenceSheet_(), last=sh.getLastRow();
  if(last<2)throw new Error('EvidenceRegistryに登録されたZIPがありません。');
  const row=last;
  const result=sssVerifyEvidenceRow_(row);
  SpreadsheetApp.getUi().alert('Evidence品質検証：'+result.status+'\n'+result.details.join('\n'));
}
// Normalize Sheets Date objects and ISO date strings to the same calendar-day key.
function sssEvidenceDateKey_(value){
  if(value instanceof Date){
    if(isNaN(value.getTime()))throw new Error('Evidence台帳の日付が不正です。');
    return Utilities.formatDate(value,Session.getScriptTimeZone(),'yyyy-MM-dd');
  }
  const s=String(value==null?'':value).trim();
  const m=/^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/.exec(s);
  if(!m)throw new Error('Evidenceの収集日付を解釈できません: '+s);
  const key=m[1]+'-'+m[2]+'-'+m[3];
  const d=new Date(key+'T00:00:00Z');
  if(isNaN(d.getTime())||d.toISOString().slice(0,10)!==key)throw new Error('Evidenceの収集日付が不正です: '+s);
  return key;
}
function sssVerifyEvidenceRow_(row){
  const lock=LockService.getDocumentLock();
  if(!lock.tryLock(30000))throw new Error('別の検証処理が実行中です。');
  try{
    const sh=sssEvidenceSheet_(), values=sh.getRange(row,1,1,12).getValues()[0], c=sssConfig_();
    if(!c.lockedAt||String(values[1])!==c.siteId||String(values[2])!==c.propertyUri)throw new Error('専属サイトと台帳のサイト情報が一致しません。');
    const file=DriveApp.getFileById(String(values[7]));
    if(file.isTrashed()||file.getMimeType()!=='application/zip')throw new Error('登録されたZIPが見つからないか形式が不正です。');
    if(file.getSize()>90*1024*1024)throw new Error('ZIPが90MBを超えるため安全上の理由で検証を停止しました。');
    const blobs=Utilities.unzip(file.getBlob()), files={};
    blobs.forEach(b=>{const name=b.getName();if(files[name])throw new Error('ZIPに重複したファイル名があります: '+name);files[name]=b;});
    if(!files['manifest.json']||!files['collection_report.json'])throw new Error('必須のmanifest.jsonまたはcollection_report.jsonがありません。');
    const manifest=JSON.parse(files['manifest.json'].getDataAsString('UTF-8'));
    const report=JSON.parse(files['collection_report.json'].getDataAsString('UTF-8'));
    if(manifest.format!=='SIMS_DOCTOR_SITE_EVIDENCE_PACKAGE_V2'||report.format!=='SIMS_DOCTOR_SITE_COLLECTION_REPORT_V2')throw new Error('Evidenceの形式が想定と異なります。');
    if(manifest.siteId!==c.siteId||!manifest.site||manifest.site.searchConsoleProperty!==c.propertyUri)throw new Error('ZIP内部のサイト情報が一致しません。');
    if(!manifest.period||sssEvidenceDateKey_(manifest.period.startDate)!==sssEvidenceDateKey_(values[3])||sssEvidenceDateKey_(manifest.period.endDate)!==sssEvidenceDateKey_(values[4])||Number(manifest.period.days)!==Number(values[5]))throw new Error('ZIP内部の収集期間が台帳と一致しません。');
    const required=['site_daily.csv','page_summary.csv','page_weekly.csv','query_summary.csv','page_query_top.csv'];
    const details=[], warnings=[];
    const declared={};(manifest.datasets||[]).forEach(d=>{declared[d.file]=d;});
    required.forEach(name=>{
      if(!files[name]||!declared[name])throw new Error('必須データが不足しています: '+name);
      const raw=files[name].getDataAsString('UTF-8');
      // Count CSV records using a quote-aware parser (newlines within quoted cells are supported).
      let quoted=false,records=0;
      for(let i=0;i<raw.length;i++){
        const ch=raw[i];
        if(ch==='"') {if(quoted&&raw[i+1]==='"'){i++;}else{quoted=!quoted;}}
        else if(ch==='\n'&&!quoted)records++;
      }
      if(quoted)throw new Error('CSVの引用符が閉じていません: '+name);
      if(raw.length&&raw[raw.length-1]!=='\n')records++;
      const count=Math.max(0,records-1);
      if(count!==Number(declared[name].rowCount))throw new Error(name+' の件数がmanifestと一致しません ('+count+' / '+declared[name].rowCount+')');
      details.push(name+': '+count+'件');
      if(declared[name].status!=='VALID')warnings.push(name+'='+declared[name].status);
    });
    (manifest.evidenceQuality&&manifest.evidenceQuality.warnings||[]).forEach(w=>warnings.push(String(w)));
    if(report.status!=='COMPLETED')warnings.push('収集レポートがCOMPLETEDではありません');
    const isDelta=String(values[8]).indexOf('SIMS-DeltaEvidence-')===0 || String(values[11]).indexOf('DELTA_')===0;
    const status=isDelta?(warnings.length?'DELTA_VERIFIED_WITH_LIMITATIONS':'DELTA_VERIFIED'):(warnings.length?'VERIFIED_WITH_LIMITATIONS':'VERIFIED');
    sh.getRange(row,12).setValue(status);
    sssAudit_('EVIDENCE_VERIFIED',c.siteId,'ZIP='+values[7]+'; '+status+'; warnings='+warnings.length);
    if(warnings.length)details.push('注意事項: '+warnings.slice(0,5).join(' / '));
    return {status,details};
  }catch(e){
    // Do not turn a previously verified record into an unverified record on transient Drive failures.
    sssAudit_('EVIDENCE_VERIFY_ERROR',sssConfig_().siteId,String(e));
    throw e;
  }finally{lock.releaseLock();}
}


// P2C: read-only delta planning. Never changes the source Evidence or Collector run.
const SSS_DELTA_PLAN_SHEET='DeltaPlan';
function sssDateUtc_(key){
  const k=sssEvidenceDateKey_(key);
  return new Date(k+'T00:00:00Z');
}
function sssShiftUtc_(key,days){
  const d=sssDateUtc_(key);
  d.setUTCDate(d.getUTCDate()+days);
  return d.toISOString().slice(0,10);
}
function sssPreviewDeltaPlan(){
  sssRefreshVersion_();
  const c=sssConfig_();
  if(!c.lockedAt)throw new Error('サイトの初回セットアップが必要です。');
  const registry=sssEvidenceSheet_();
  const last=registry.getLastRow();
  if(last<2)throw new Error('EvidenceRegistryに基準データがありません。');
  const rows=registry.getRange(2,1,last-1,12).getValues();
  const candidates=rows.map((v,i)=>({v,row:i+2})).filter(x=>
    String(x.v[1])===c.siteId && String(x.v[2])===c.propertyUri &&
    ['VERIFIED','VERIFIED_WITH_LIMITATIONS'].indexOf(String(x.v[11]))>=0);
  if(!candidates.length)throw new Error('このサイトの検証済みEvidenceがありません。先に品質検証を実行してください。');
  candidates.sort((a,b)=>sssEvidenceDateKey_(b.v[4]).localeCompare(sssEvidenceDateKey_(a.v[4])));
  const base=candidates[0];
  // Use only stable GSC dates; never plan future dates or an empty window.
  const today=Utilities.formatDate(new Date(),Session.getScriptTimeZone()||'Asia/Tokyo','yyyy-MM-dd');
  const stableEnd=sssShiftUtc_(today,-3);
  const baseEnd=sssEvidenceDateKey_(base.v[4]);
  const baseStart=sssEvidenceDateKey_(base.v[3]);
  const deltaDays=Math.round((sssDateUtc_(stableEnd)-sssDateUtc_(baseEnd))/86400000);
  const newDays=Math.max(0,deltaDays);
  // Recheck the latest 14 stable days even when no new day is available.
  // Clamp to the verified baseline start to avoid requesting dates outside the snapshot.
  const overlapEnd=sssDateUtc_(stableEnd)<sssDateUtc_(baseEnd)?stableEnd:baseEnd;
  const overlapStartCandidate=sssShiftUtc_(overlapEnd,-13);
  const overlapStart=sssDateUtc_(overlapStartCandidate)<sssDateUtc_(baseStart)?baseStart:overlapStartCandidate;
  const hasOverlap=sssDateUtc_(overlapEnd)>=sssDateUtc_(baseStart);
  const needsUpdate=newDays>0 || hasOverlap;
  const start=hasOverlap?overlapStart:sssShiftUtc_(baseEnd,1);
  const warning=deltaDays>30?'更新間隔が30日を超えています。全件収集との比較を推奨します。':'';
  const plan=[
    ['製品バージョン',SSS_VERSION],['サイト名',c.siteName],['GSCプロパティ',c.propertyUri],
    ['基準Evidence行',base.row],['基準ZIP ID',String(base.v[7])],['基準品質状態',String(base.v[11])],
    ['基準収集開始',sssEvidenceDateKey_(base.v[3])],['基準収集終了',baseEnd],
    ['GSC安定日（当日-3日）',stableEnd],['新規対象日数',Math.max(0,deltaDays)],
    ['再取得開始日（14日重複）',hasOverlap?overlapStart:'対象なし'],
    ['再取得終了日',hasOverlap?overlapEnd:'対象なし'],
    ['実行判定',needsUpdate?(newDays>0?'新規取得＋直近再取得':'直近再取得のみ'):'取得対象なし'],
    ['注意事項',warning||'集計粒度が異なるため、既存CSVへの単純追記は禁止'],
    ['計画生成日時',new Date()]
  ];
  const ss=sssSpreadsheet_();
  let sh=ss.getSheetByName(SSS_DELTA_PLAN_SHEET);
  if(!sh)sh=ss.insertSheet(SSS_DELTA_PLAN_SHEET);
  sh.clearContents();
  sh.getRange(1,1,1,2).setValues([['項目','値']]).setFontWeight('bold');
  sh.getRange(2,1,plan.length,2).setValues(plan);
  sh.setColumnWidth(1,240);sh.setColumnWidth(2,480);
  sssAudit_('DELTA_PLAN_PREVIEW',c.siteId,'base='+base.row+'; newDays='+newDays+'; overlap='+ (hasOverlap?overlapStart+'..'+overlapEnd:'none'));
  SpreadsheetApp.getUi().alert('差分更新計画を作成しました。\n新規対象：'+newDays+'日\n再取得：'+(hasOverlap?overlapStart+' ～ '+overlapEnd:'対象なし')+'\n\nDeltaPlanシートをご確認ください。\n※データ取得・書き換えは行っていません。');
}

// P2D: Isolated delta acquisition. Existing verified ZIPs are never modified.
// The Collector uses temporary working sheets and its normal checkpoint/resume engine.
// Delta Evidence is a standalone package, NOT a merged 365-day snapshot.
function sssAcquireDeltaEvidence(){
  sssRefreshVersion_();
  const c=sssConfig_();
  if(!c.lockedAt)throw new Error('先に初回セットアップを実行してください。');
  const sh=sssSpreadsheet_().getSheetByName(SSS_DELTA_PLAN_SHEET);
  if(!sh||sh.getLastRow()<16)throw new Error('先に「差分更新の計画を確認」を実行してください。');
  const vals=sh.getRange(2,1,sh.getLastRow()-1,2).getValues();
  const plan={};vals.forEach(r=>plan[String(r[0])]=r[1]);
  if(String(plan['GSCプロパティ'])!==c.propertyUri)throw new Error('計画のサイトが固定サイトと一致しません。');
  if(String(plan['基準品質状態'])!=='VERIFIED'&&String(plan['基準品質状態'])!=='VERIFIED_WITH_LIMITATIONS')throw new Error('検証済みEvidenceが必要です。');
  const created=plan['計画生成日時'];
  if(!(created instanceof Date)||Date.now()-created.getTime()>24*3600000||created.getTime()>Date.now()+60000)throw new Error('計画が古いか日時が不正です。再作成してください。');
  const stable=sssShiftUtc_(Utilities.formatDate(new Date(),Session.getScriptTimeZone()||'Asia/Tokyo','yyyy-MM-dd'),-3);
  if(sssEvidenceDateKey_(plan['GSC安定日（当日-3日）'])!==stable)throw new Error('GSC安定日が変わりました。計画を再作成してください。');
  const start=sssEvidenceDateKey_(plan['再取得開始日（14日重複）']);
  const baseEnd=sssEvidenceDateKey_(plan['基準収集終了']);
  const newDays=Number(plan['新規対象日数']);
  const end=newDays>0?stable:sssEvidenceDateKey_(plan['再取得終了日']);
  const days=Math.round((sssDateUtc_(end)-sssDateUtc_(start))/86400000)+1;
  if(!Number.isInteger(days)||days<1||days>400)throw new Error('差分対象期間が不正です。');
  if(sssDateUtc_(start)>sssDateUtc_(end)||sssDateUtc_(end)>sssDateUtc_(stable))throw new Error('取得期間が不正です。');
  const registry=sssEvidenceSheet_();
  const baselineRow=Number(plan['基準Evidence行']);
  if(!Number.isInteger(baselineRow)||baselineRow<2||baselineRow>registry.getLastRow())throw new Error('基準Evidence行が不正です。');
  const baseline=registry.getRange(baselineRow,1,1,12).getValues()[0];
  if(String(baseline[1])!==c.siteId||String(baseline[2])!==c.propertyUri||String(baseline[7])!==String(plan['基準ZIP ID'])||String(baseline[11])!==String(plan['基準品質状態'])||sssEvidenceDateKey_(baseline[4])!==baseEnd)throw new Error('基準Evidenceが計画作成後に変化しました。');
  const old=sdscGetRun_();
  if(old&&['RUNNING','PAUSED_AUTO_RESUME','ERROR'].includes(old.status))throw new Error('未完了の収集があります。先に処理してください。');
  const ui=SpreadsheetApp.getUi();
  const message='専属サイト：'+c.siteName+'\n取得期間：'+start+' ～ '+end+'（'+days+'日）\n基準ZIP ID：'+String(baseline[7])+'\n\nCollectorの一時作業シートは初期化されます。\n既存の検証済みZIPは変更しません。\n新しい差分ZIPは自動的に別ファイルとして作成されます。\n統合・基準Evidenceへの昇格は行いません。\n\n開始しますか？';
  if(ui.alert('差分Evidenceの試験取得',message,ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  const config=sssSyncCollectorConfig_();
  sssValidateSite_(c.siteId,config.siteUrl);
  const fileName='SIMS-DeltaEvidence-'+sdscSafeFilePart_(c.siteName,'site')+'-'+Utilities.formatDate(new Date(),config.timezone||'Asia/Tokyo','yyyyMMdd-HHmmss')+'.zip';
  const folderId=sssEvidenceFolderId_(true);
  const started=sdscStartCollection_(days,fileName,folderId||config.outputFolderId||'',true);
  if(!started)return;
  const run=sdscGetRun_();
  run.period={startDate:start,endDate:end,days:days};
  run.deltaAcquisition={format:'SIMS_STRATEGIST_DELTA_ACQUISITION_V1',baselineZipId:String(baseline[7]),baselineRegistryRow:baselineRow,plannedAt:created.toISOString(),startDate:start,endDate:end,merged:false};
  run.outputFileName=fileName;
  sdscSaveRun_(run);
  sdscWriteStatus_(run);
  sssAudit_('DELTA_ACQUIRE_START',c.siteId,start+'..'+end+'; baseline='+String(baseline[7]));
  sdscResumeCollection();
}

// P3B: Explicit, idempotent migration of verified historical ZIPs. No ZIP rewrite.
function sssMigrateEvidence(){
  const ui=SpreadsheetApp.getUi(), c=sssConfig_(), m=sssDriveFolderMap_();
  if(!c.lockedAt||!m)throw new Error('専属サイトと保存先を先に設定してください。');
  sssDriveVerifyMap_(m);
  const run=sdscGetRun_();
  if(run&&['RUNNING','PAUSED_AUTO_RESUME'].includes(run.status))throw new Error('収集中は移行できません。');
  const sh=sssEvidenceSheet_(), last=sh.getLastRow();
  if(last<2){ui.alert('移行対象のEvidenceがありません。');return;}
  const rows=sh.getRange(2,1,last-1,12).getValues(), jobs=[], skipped=[];
  const valid={VERIFIED:'baselineId',DELTA_VERIFIED:'deltaId'};
  const seen={};
  rows.forEach((v,i)=>{
    const row=i+2, state=String(v[11]||'');
    if(!valid[state]){skipped.push('行'+row+': 状態 '+state+' は移行対象外');return;}
    if(String(v[1])!==c.siteId||String(v[2])!==c.propertyUri)throw new Error('行'+row+'のサイト識別情報が異なります。');
    const id=String(v[7]||'');
    if(!id||seen[id])throw new Error('ZIP IDが空または重複しています（行'+row+'）。');
    seen[id]=true;
    const file=DriveApp.getFileById(id);
    if(file.isTrashed()||file.getMimeType()!=='application/zip')throw new Error('行'+row+'のZIPが利用できません。');
    if(String(v[8])!==file.getName())throw new Error('行'+row+'のZIP名が台帳と一致しません。');
    if(file.getSize()>90*1024*1024)throw new Error('行'+row+'のZIPが90MBを超えています。');
    const blobs=Utilities.unzip(file.getBlob());
    const manifests=blobs.filter(b=>b.getName()==='manifest.json');
    if(manifests.length!==1)throw new Error('行'+row+'のmanifest.jsonが不正です。');
    const manifest=JSON.parse(manifests[0].getDataAsString('UTF-8'));
    if(manifest.format!=='SIMS_DOCTOR_SITE_EVIDENCE_PACKAGE_V2'||manifest.siteId!==c.siteId||!manifest.site||manifest.site.searchConsoleProperty!==c.propertyUri||!manifest.period||sssEvidenceDateKey_(manifest.period.startDate)!==sssEvidenceDateKey_(v[3])||sssEvidenceDateKey_(manifest.period.endDate)!==sssEvidenceDateKey_(v[4])||Number(manifest.period.days)!==Number(v[5]))throw new Error('行'+row+'のZIP内部情報が台帳と一致しません。');
    const target=sssDriveGetFolder_(m[valid[state]]);
    const parents=file.getParents(), parentIds=[];
    while(parents.hasNext())parentIds.push(parents.next().getId());
    if(parentIds.indexOf(target.getId())>=0){skipped.push('行'+row+': 移行済み');return;}
    if(parentIds.length!==1)throw new Error('行'+row+'の親フォルダー数が想定外です。');
    // Fail closed: only migrate ZIPs currently stored in the Collector's legacy directory.
    const parent=DriveApp.getFolderById(parentIds[0]);
    if(parent.getName()!=='SIMS-Doctor-Site-Collector')throw new Error('行'+row+'の元保存先が想定外です: '+parent.getName());
    jobs.push({row:row,id:id,name:file.getName(),targetId:target.getId(),targetName:state==='VERIFIED'?'Baseline':'Delta',oldParentId:parentIds[0]});
  });
  if(!jobs.length){ui.alert('移行対象なし。\n'+skipped.join('\n'));return;}
  const summary=jobs.map(j=>'行'+j.row+' '+j.name+' → '+j.targetName).join('\n');
  if(ui.alert('既存Evidenceの安全な移行','移行予定：'+jobs.length+'件\n'+summary+'\n\nZIPのファイルID・台帳・品質状態は変更しません。移行を開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  const lock=LockService.getDocumentLock();
  if(!lock.tryLock(30000))throw new Error('別の処理が実行中です。');
  const moved=[];
  try{
    sssDriveVerifyMap_(sssDriveFolderMap_());
    jobs.forEach(j=>{
      const current=sh.getRange(j.row,1,1,12).getValues()[0];
      if(String(current[7])!==j.id||String(current[1])!==c.siteId||String(current[2])!==c.propertyUri||valid[String(current[11])]===undefined||m[valid[String(current[11])]]!==j.targetId)throw new Error('台帳が変更されたため移行を中止しました（行'+j.row+'）。');
      const file=DriveApp.getFileById(j.id), parents=file.getParents(), ids=[];
      while(parents.hasNext())ids.push(parents.next().getId());
      if(ids.length!==1||ids[0]!==j.oldParentId)throw new Error('元保存先が変わりました（行'+j.row+'）。');
      file.moveTo(sssDriveGetFolder_(j.targetId));
      const after=DriveApp.getFileById(j.id), ap=after.getParents();let found=false;
      while(ap.hasNext())if(ap.next().getId()===j.targetId)found=true;
      if(!found||after.getId()!==j.id)throw new Error('移行後の保存先確認に失敗（行'+j.row+'）。');
      moved.push(j);
      sssAudit_('EVIDENCE_MOVED',c.siteId,'row='+j.row+' fileId='+j.id+' from='+j.oldParentId+' to='+j.targetId);
    });
    ui.alert('移行完了：'+moved.length+'件\n既存ZIPのファイルIDとEvidenceRegistryは変更していません。\n'+skipped.join('\n'));
  }catch(e){
    sssAudit_('EVIDENCE_MIGRATION_PARTIAL',c.siteId,'moved='+moved.map(j=>j.id).join(',')+' error='+String(e));
    throw new Error('移行を停止しました。移行済み：'+moved.length+'件。元へ自動的には戻しません。再実行前にAuditLogを確認してください。詳細：'+String(e));
  }finally{lock.releaseLock();}
}


/** Read-only progress snapshot. Never fetches GSC data or mutates the run. */
function sssProgressSnapshot_(){
  const c=sssConfig_();
  const run=sdscGetRun_();
  sssAssertRunSite_(run,c);
  if(!run)return {exists:false,version:SSS_VERSION,siteName:c.siteName};
  const step=Math.max(1,Math.min(6,Number(run.step)||1));
  const labels=['日別サイト集計','ページ別期間集計','ページ別週次集計','クエリ集計','ページ別上位クエリ','Evidence ZIP生成'];
  const status=String(run.status||'UNKNOWN');
  return {exists:true,version:SSS_VERSION,siteName:c.siteName,status:status,
    step:status==='COMPLETED'?6:step,stepName:labels[step-1],
    progress:String(run.progressText||''),startedAt:String(run.startedAt||''),
    updatedAt:String(run.updatedAt||''),completedAt:String(run.completedAt||''),
    periodDays:Number(run.period&&run.period.days)||0,
    error:(run.errors&&run.errors.length)?String(run.errors[run.errors.length-1].message||''):''};
}
function sssGetCollectionProgress(){return sssProgressSnapshot_();}
function sssShowCollectionProgress(){
  const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><head><base target="_blank"><meta charset="UTF-8"><style>
  body{font:14px Arial,sans-serif;color:#202124;margin:22px}h2{font-size:19px}#badge{font-weight:bold;padding:7px 11px;background:#e8f0fe;border-radius:6px;display:inline-block}dl{display:grid;grid-template-columns:110px 1fr;gap:12px 8px}dt{color:#5f6368}dd{margin:0;overflow-wrap:anywhere}#error{color:#b3261e;white-space:pre-wrap}small{color:#5f6368}button{padding:8px 15px;cursor:pointer}#feedback{margin:10px 0;color:#19633a}
  </style></head><body><h2>収集進捗</h2><div id="badge">読み込み中</div><p id="site"></p><dl id="details"></dl><p id="error" role="alert"></p><button id="refresh" onclick="load('manual')">今すぐ更新</button><p id="feedback" role="status" aria-live="polite">情報を取得しています…</p><p><small>収集中・自動再開待ちの間だけ15秒ごとに確認します。完了・エラー時は自動停止します。</small></p>
  <script>
  const button=document.getElementById('refresh');
  const feedback=document.getElementById('feedback');
  let busy=false;
  let timer=null;
  function stopPolling(){if(timer!==null){clearInterval(timer);timer=null;}}
  function startPolling(){if(timer===null)timer=setInterval(()=>load('auto'),15000);}
  function esc(v){const el=document.createElement('div');el.textContent=String(v==null?'':v);return el.innerHTML;}
  function stamp(){return new Date().toLocaleTimeString('ja-JP',{hour12:false});}
  function load(source){
    if(busy){if(source==='manual')feedback.textContent='更新処理中です。完了までお待ちください。';return;}
    busy=true;button.disabled=true;button.textContent='更新中…';
    feedback.textContent=(source==='manual'?'手動更新中…':'自動確認中…');
    google.script.run.withSuccessHandler(r=>{
      busy=false;button.disabled=false;button.textContent='今すぐ更新';
      if(!r||typeof r!=='object'){feedback.textContent='取得結果が不正です（最終確認：'+stamp()+'）';return;}
      document.getElementById('badge').textContent=!r.exists?'収集履歴なし':({'RUNNING':'収集中','PAUSED_AUTO_RESUME':'自動再開待ち','COMPLETED':'完了','ERROR':'エラー'}[r.status]||r.status);
      document.getElementById('site').textContent=r.siteName||'';
      const rows=r.exists?[['工程',r.step+'/6：'+r.stepName],['進捗',r.progress],['対象期間',r.periodDays+'日'],['開始',r.startedAt],['最終更新',r.updatedAt],['完了',r.completedAt||'—']]:[];
      document.getElementById('details').innerHTML=rows.map(([k,v])=>'<dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd>').join('');
      document.getElementById('error').textContent=r.error||'';
      if(r.exists && ['RUNNING','PAUSED_AUTO_RESUME'].includes(r.status)){startPolling();}else{stopPolling();}
      feedback.textContent=(source==='manual'?'最新情報を確認しました':'自動確認しました')+'（最終確認：'+stamp()+'）';
    }).withFailureHandler(e=>{
      busy=false;button.disabled=false;button.textContent='今すぐ更新';
      stopPolling();
      feedback.textContent='更新に失敗しました（'+stamp()+'）。再試行できます。';
      document.getElementById('error').textContent=e&&e.message?e.message:String(e);
    }).sssGetCollectionProgress();
  }
  load('initial');window.addEventListener('pagehide',stopPolling);
  </script></body></html>`).setWidth(570).setHeight(540);
  SpreadsheetApp.getUi().showModalDialog(html,'収集進捗');
}
