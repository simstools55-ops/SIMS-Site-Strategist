/** SIMS Site Strategist v0.1.90 | use blog-name folders for new development data; preserve analytics. */
const SSS_VERSION = '0.1.90';
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
    .addItem('Managerサイト設定を照合（読取専用）', 'sssP83CompareManagerSiteSettings')
    .addItem('Manager保存先の構造を照合（読取専用）', 'sssP84CheckManagerFolderStructure')
    .addItem('Manager記事情報の連携前確認（読取専用）', 'sssP69ManagerPreview')
    .addItem('Managerと戦略候補の照合監査（読取専用）', 'sssP70AuditManagerMatches')
    .addItem('Manager対応状況つき戦略候補を確認（読取専用）', 'sssP73ShowManagerCandidates')
    .addItem('Googleドライブの保存先を開く', 'sssOpenDriveFolder')
    .addSeparator()
    .addItem('GSCデータを収集（180日）', 'sssCollect180')
    .addItem('GSCデータを収集（365日・試験）', 'sssCollect365')
    .addItem('収集状況を確認', 'sssCollectionStatus')
    .addItem('収集進捗を画面で確認', 'sssShowCollectionProgress')
    .addItem('共通Evidenceを登録・確認', 'sssRegisterEvidenceSnapshot')
    .addItem('最新Evidenceの品質を検証', 'sssVerifyLatestEvidence')
    .addItem('差分更新の計画を確認（試験）', 'sssPreviewDeltaPlan')
    .addItem('差分データを取得（試験・別ZIP）', 'sssAcquireDeltaEvidence')
    .addItem('Evidence統合の事前監査（読取専用）', 'sssAuditMergeReadiness')
    .addItem('日別Evidenceを統合・保存（試験）', 'sssCreateMergedDailyEvidence')
    .addItem('統合Evidenceの品質検証（読取専用）', 'sssVerifyMergedDailyEvidence')
    .addItem('分析対象Evidenceを確認（読取専用）', 'sssShowAnalysisEvidence')
    .addItem('サイト全体の成長診断（読取専用）', 'sssDiagnoseSiteGrowth')
    .addItem('ページ別Evidenceの構造監査（読取専用）', 'sssAuditPageEvidenceStructure')
    .addItem('詳細Evidence収集計画を確認（読取専用）', 'sssPreviewDetailedEvidencePlan')
    .addItem('日付×ページを試験収集（1日・別ZIP）', 'sssCollectDailyPagePilot')
    .addItem('詳細Evidenceの品質検証（読取専用）', 'sssVerifyDailyPagePilot')
    .addItem('日付×ページ 7日収集を開始・再開（試験）', 'sssCollectDailyPageSevenDay')
    .addItem('日付×ページ 7日収集を連続実行（試験）', 'sssCollectDailyPageSevenDayAuto')
    .addItem('7日Detailed品質監査（読取専用）', 'sssAuditSevenDayDetailed')
    .addItem('7日Detailedを検証・統合（試験）', 'sssMergeSevenDayDetailed')
    .addItem('日付×ページの未収集日を確認（読取専用）', 'sssPreviewDailyPageMissing')
    .addItem('日付×ページの不足分を連続収集（最大7日・試験）', 'sssCollectDailyPageMissing')
    .addItem('日付×ページ 365日未収集を確認（読取専用）', 'sssPreviewDailyPageMissing365')
    .addItem('日付×ページ 365日不足分を収集（最大7日）', 'sssCollectDailyPageMissing365')
    .addItem('詳細Evidence 自動継続収集を開始（14日試験）', 'sssStartAutoDetailedPilot')
    .addItem('詳細Evidence 365日自動収集を開始', 'sssStartAutoDetailed365')
    .addItem('詳細Evidence 自動収集の状態確認', 'sssShowAutoDetailedPilotStatus')
    .addItem('詳細Evidence 自動収集トリガー監査（読取専用）', 'sssAuditAutoDetailedTriggers')
    .addItem('詳細Evidence 停滞収集を安全に再開', 'sssRecoverAutoDetailedCollection')
    .addItem('詳細Evidence 自動収集を停止', 'sssStopAutoDetailedPilot')
    .addItem('365日Detailed品質監査を開始（読取専用）', 'sssStartDetailed365Audit')
    .addItem('365日Detailed品質監査を続行（最大5ZIP）', 'sssContinueDetailed365Audit')
    .addItem('365日Detailed品質監査を自動継続', 'sssEnableDetailed365AutoAudit')
    .addItem('365日Detailed品質監査の自動実行を停止', 'sssStopDetailed365AutoAudit')
    .addItem('365日Detailed品質監査の自動実行状態', 'sssShowDetailed365AutoAudit')
    .addItem('365日Detailed品質監査の結果を確認', 'sssShowDetailed365Audit')
    .addItem('365日Detailed統合事前監査（読取専用）', 'sssPreviewDetailed365Merge')
    .addItem('365日Detailed分割統合を開始（試験）', 'sssStartDetailed365ChunkMerge')
    .addItem('365日Detailed分割統合を続行（試験）', 'sssContinueDetailed365ChunkMerge')
    .addItem('365日Detailed分割統合の状態', 'sssShowDetailed365ChunkMerge')
    .addItem('365日Detailed分割統合を自動継続', 'sssEnableDetailed365AutoMerge')
    .addItem('365日Detailed分割統合の自動実行を停止', 'sssStopDetailed365AutoMerge')
    .addItem('365日Detailed分割統合の自動実行状態', 'sssShowDetailed365AutoMerge')
    .addItem('365日Detailed統合ZIP監査を開始（読取専用）', 'sssStartDM365OutputAudit')
    .addItem('365日Detailed統合ZIP監査を続行（読取専用）', 'sssContinueDM365OutputAudit')
    .addItem('365日Detailed統合ZIP監査の結果', 'sssShowDM365OutputAudit')
    .addItem('365日Detailed統合ZIP監査を自動継続', 'sssEnableDM365OutputAutoAudit')
    .addItem('365日Detailed統合ZIP監査の自動実行を停止', 'sssStopDM365OutputAutoAudit')
    .addItem('365日Detailed統合ZIP監査の自動実行状態', 'sssShowDM365OutputAutoAudit')
    .addItem('365日Detailed元データ数値照合を開始（読取専用）', 'sssStartDM365SourceReconcile')
    .addItem('365日Detailed元データ数値照合を続行（読取専用）', 'sssContinueDM365SourceReconcile')
    .addItem('365日Detailed元データ数値照合の状態', 'sssShowDM365SourceReconcile')
    .addItem('365日Detailed元データ数値照合を自動継続', 'sssEnableDM365ReconAuto')
    .addItem('365日Detailed元データ数値照合の自動実行を停止', 'sssStopDM365ReconAuto')
    .addItem('365日Detailed元データ数値照合の自動実行状態', 'sssShowDM365ReconAuto')
    .addItem('30・90・365日中間集計を開始（試験）', 'sssPeriod51Start')
    .addItem('30・90・365日中間集計を続行（試験）', 'sssPeriod51Continue')
    .addItem('30・90・365日中間集計の状態', 'sssPeriod51Status')
    .addItem('30・90・365日中間集計を自動継続', 'sssPeriod52StartAuto')
    .addItem('30・90・365日中間集計の自動実行状態', 'sssPeriod52Status')
    .addItem('30・90・365日中間集計の自動実行を停止', 'sssPeriod52StopAuto')
    .addItem('30・90・365日ページ別統合を開始（試験）', 'sssP53Start')
    .addItem('30・90・365日ページ別統合を続行（試験）', 'sssP53Continue')
    .addItem('30・90・365日ページ別統合の状態', 'sssP53Status')
    .addItem('ページ別統合を高速自動継続（試験）', 'sssP55StartAuto')
    .addItem('ページ別統合の高速自動実行状態', 'sssP55Status')
    .addItem('ページ別統合の高速自動継続を停止', 'sssP55StopAuto')
    .addItem('ページ別統合 UIエラーHOLDを復旧', 'sssP56RecoverUiHold')
    .addItem('期間別最終ZIP品質監査を開始（読取専用）', 'sssP58AuditStart')
    .addItem('期間別最終ZIP品質監査を続行（最大5ZIP）', 'sssP58AuditContinue')
    .addItem('期間別最終ZIP品質監査の状態', 'sssP58AuditStatus')
    .addItem('期間別最終ZIP品質監査を高速自動継続', 'sssP59StartAuto')
    .addItem('期間別最終ZIP品質監査の高速自動実行状態', 'sssP59Status')
    .addItem('期間別最終ZIP品質監査の高速自動実行を停止', 'sssP59StopAuto')
    .addItem('サイト戦略診断を生成（読取専用・試験）', 'sssP60BuildStrategy')
    .addItem('サイト戦略診断の結果を確認', 'sssP60ShowStrategy')
    .addItem('サイト全体の傾向サマリーを確認（読取専用）', 'sssP64ShowSiteSummary')
    .addItem('サイト戦略の優先施策を確認（読取専用）', 'sssP65ShowPriorities')
    .addItem('戦略候補の影響度を確認（読取専用）', 'sssP66ShowImpact')
    .addItem('Detailed監査の日付・重複を診断（読取専用）', 'sssDiagnoseDetailedAuditDates')
    .addItem('Detailed不足日を1日だけ補完（試験）', 'sssRepairOneDetailedMissingDay')
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
  const html=HtmlService.createHtmlOutput('<html><head><base target="_top"><style>body{font-family:Arial,sans-serif;padding:24px;color:#222}h2{margin-top:0}.box{background:#f3f5f7;padding:18px;border-radius:10px;line-height:1.9}.muted{color:#666}</style></head><body><h2>SIMS Site Strategist v'+SSS_VERSION+'</h2><div class="box">'+(c.lockedAt?'<b>'+sssEscape_(c.siteName)+'</b><br>対象：'+sssEscape_(c.propertyUri)+'<br>サイト固定：完了':'初回セットアップが必要です。メニューから実行してください。')+'</div>'+folderLine+'<p class="muted">日別Evidenceの統合・品質検証に対応。ページ別・クエリ別の統合は未実装です。</p></body></html>').setWidth(550).setHeight(330);
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
/** Check the user-specified Manager sheet before reusing its existing blog folder.
 * This is a consistency check, not a cryptographic ownership proof.
 */
function sssCheckManagerIdentityForSetup_(spreadsheetId,c){
  const id=String(spreadsheetId||'').trim();
  if(!/^[A-Za-z0-9_-]{25,120}$/.test(id))throw new Error('ManagerスプレッドシートIDの形式が正しくありません。');
  const book=SpreadsheetApp.openById(id), sh=book.getSheetByName('Settings');
  if(!sh)throw new Error('指定したManagerにSettingsシートがありません。');
  const n=sh.getLastRow();
  if(n<2||n>5000)throw new Error('Manager Settingsの行数が想定範囲外です。');
  const values=sh.getRange(1,1,n,Math.min(sh.getLastColumn(),4)).getDisplayValues(), settings={};
  for(const row of values){const key=String(row[0]||'').trim();if(key&&!(key in settings))settings[key]=String(row[1]||'').trim();}
  if(!settings.BlogName||settings.BlogName!==c.siteName)throw new Error('Managerのブログ名とS3の登録名が一致しません。');
  if(!settings.SearchConsoleProperty||sssCanonicalProperty_(settings.SearchConsoleProperty)!==sssCanonicalProperty_(c.propertyUri))throw new Error('ManagerとS3のGSCプロパティが一致しません。');
  if(!settings.BlogUrl)throw new Error('ManagerのBlogUrlが未設定です。');
  const scope=sssP72PropertyScope_(c.propertyUri);
  if(!scope||!sssP72WithinScope_(settings.BlogUrl,scope))throw new Error('ManagerのブログURLがS3のGSC対象範囲外です。');
  return {blogName:settings.BlogName,blogUrl:settings.BlogUrl,managerSpreadsheetId:id};
}
function sssSetupDriveFolders(){
  const c=sssConfig_(),ui=SpreadsheetApp.getUi();
  if(!c.lockedAt)throw new Error('先にサイトの初回セットアップを完了してください。');
  const existing=sssDriveFolderMap_();
  if(existing){sssDriveVerifyMap_(existing);ui.alert('保存先は設定済みです。\nSIMS ＞ '+existing.siteFolderName+' ＞ Strategist\n'+sssDriveGetFolder_(existing.strategistId).getUrl()+'\n※既存の保存先は自動変更しません。新規収集には新しい開発用シートを使用してください。');return;}
  const run=sdscGetRun_();
  if(run&&['RUNNING','PAUSED_AUTO_RESUME','ERROR'].includes(run.status))throw new Error('収集が未完了です。完了後に保存先を設定してください。');
  if(ui.alert('ブログ別保存先を作成','マイドライブ直下のSIMSフォルダー内に「'+c.siteName+'」の専用保存先を作成します。既存ZIPは移動しません。\n続行しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  const lock=LockService.getDocumentLock();if(!lock.tryLock(30000))throw new Error('別の設定処理が実行中です。');
  try{
    const old=sssDriveFolderMap_();if(old){sssDriveVerifyMap_(old);return;}
    // Do not create folders until the existing blog folder has been checked.
    const safeName=c.siteName.replace(/[\\/:*?"<>|]/g,'-').trim().slice(0,75);
    if(!safeName||safeName==='.'||safeName==='..')throw new Error('ブログ名から安全な保存先名を生成できません。');
    const rootParent=DriveApp.getRootFolder();
    const rootMatches=rootParent.getFoldersByName('SIMS');
    let root=null;
    if(rootMatches.hasNext()){root=rootMatches.next();if(rootMatches.hasNext())throw new Error('マイドライブ直下にSIMSフォルダーが複数あります。');}
    let site=null,managerInfo=null;
    if(root){
      const matches=root.getFoldersByName(safeName);
      if(matches.hasNext()){site=matches.next();if(matches.hasNext())throw new Error('同名のブログフォルダーが複数あります。');}
    }
    if(site){
      const managers=site.getFoldersByName('Manager');
      if(managers.hasNext()){
        managers.next();if(managers.hasNext())throw new Error('Managerフォルダーが複数あります。');
        const answer=ui.prompt('既存SBMブログの照合','「'+safeName+'」にはManagerフォルダーがあります。対象SBMのスプレッドシートIDを入力してください。設定値を照合し、不一致なら停止します。',ui.ButtonSet.OK_CANCEL);
        if(answer.getSelectedButton()!==ui.Button.OK)return;
        managerInfo=sssCheckManagerIdentityForSetup_(answer.getResponseText(),c);
        if(ui.alert('既存ブログフォルダーを共用','Manager設定のブログ名・GSCプロパティ・URL範囲に矛盾はありません。\nブログURL：'+managerInfo.blogUrl+'\n\nこのフォルダーにS3用Strategistを作成しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
      }else{
        // Without Manager metadata, a pre-existing folder cannot be safely adopted.
        throw new Error('同名ブログフォルダーはありますが、Managerフォルダーがありません。自動的に共用せず停止しました。');
      }
      const existingStrategist=site.getFoldersByName('Strategist');
      if(existingStrategist.hasNext())throw new Error('既存Strategistフォルダーがあります。上書き・自動共用を行いません。');
    }
    if(!root)root=rootParent.createFolder('SIMS');
    if(!site)site=root.createFolder(safeName);
    const folderName=safeName;
    const strat=sssDriveChild_(site,'Strategist');
    const ev=sssDriveChild_(strat,'Evidence');
    const baseline=sssDriveChild_(ev,'Baseline'),delta=sssDriveChild_(ev,'Delta'),archive=sssDriveChild_(ev,'Archive');
    const reports=sssDriveChild_(strat,'Reports'),exp=sssDriveChild_(strat,'Export');
    const map={siteId:c.siteId,propertyUri:c.propertyUri,siteFolderName:folderName,rootId:root.getId(),siteIdFolder:site.getId(),strategistId:strat.getId(),evidenceId:ev.getId(),baselineId:baseline.getId(),deltaId:delta.getId(),archiveId:archive.getId(),reportsId:reports.getId(),exportId:exp.getId()};
    sssDriveVerifyMap_(map);
    sssProperties_().setProperty(SSS_DRIVE_PROP,JSON.stringify(map));
    sssAudit_('DRIVE_FOLDERS_CONFIGURED',c.siteId,'strategistFolderId='+strat.getId()+'; managerChecked='+(!!managerInfo));
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
  const tz=Session.getScriptTimeZone()||'Asia/Tokyo';
  if(value instanceof Date){
    if(isNaN(value.getTime()))throw new Error('Evidence台帳の日付が不正です。');
    return Utilities.formatDate(value,tz,'yyyy-MM-dd');
  }
  const s=String(value==null?'':value).trim();
  let m=/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})(?:$|[T\s])/.exec(s);
  if(m){
    const key=m[1]+'-'+m[2].padStart(2,'0')+'-'+m[3].padStart(2,'0');
    const d=new Date(key+'T00:00:00Z');
    if(!isNaN(d.getTime())&&d.toISOString().slice(0,10)===key)return key;
  }
  // Sheets display values can contain a Date.toString() representation.
  // Only accept an explicit timezone-bearing English Date string, not ambiguous locale dates.
  if(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4}/.test(s)){
    const d=new Date(s);
    if(!isNaN(d.getTime()))return Utilities.formatDate(d,tz,'yyyy-MM-dd');
  }
  throw new Error('Evidenceの収集日付を解釈できません: '+s);
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

// P4A: Read-only merge readiness audit. No source ZIP, registry, or Evidence folder writes.
// This audit intentionally does NOT merge period-level page/query aggregates.
function sssAuditMergeReadiness(options){
  const internal=options===true;
  sssRefreshVersion_();
  const c=sssConfig_();
  if(!c.lockedAt)throw new Error('サイトの初回セットアップが必要です。');
  const sh=sssEvidenceSheet_(),last=sh.getLastRow();
  if(last<2)throw new Error('EvidenceRegistryが空です。');
  const entries=sh.getRange(2,1,last-1,12).getValues().map((v,i)=>({v,row:i+2})).filter(x=>
    String(x.v[1])===c.siteId && String(x.v[2])===c.propertyUri &&
    ['VERIFIED','VERIFIED_WITH_LIMITATIONS','DELTA_VERIFIED','DELTA_VERIFIED_WITH_LIMITATIONS'].includes(String(x.v[11])));
  if(!entries.length)throw new Error('検証済みEvidenceがありません。');
  const byDate={},sources=[],issues=[];
  entries.sort((a,b)=>sssEvidenceDateKey_(a.v[3]).localeCompare(sssEvidenceDateKey_(b.v[3])) || a.row-b.row);
  entries.forEach(entry=>{
    const v=entry.v,id=String(v[7]),file=DriveApp.getFileById(id);
    if(file.isTrashed()||file.getMimeType()!=='application/zip')throw new Error('ZIPが不正です: 台帳行'+entry.row);
    if(file.getSize()>90*1024*1024)throw new Error('ZIPが90MBを超えます: 台帳行'+entry.row);
    const blobs=Utilities.unzip(file.getBlob()),map={};
    blobs.forEach(b=>{const n=b.getName();if(map[n])throw new Error('ZIP内ファイル名重複: '+n);map[n]=b;});
    if(!map['manifest.json']||!map['site_daily.csv'])throw new Error('必須ファイル不足: 台帳行'+entry.row);
    const m=JSON.parse(map['manifest.json'].getDataAsString('UTF-8'));
    if(m.format!=='SIMS_DOCTOR_SITE_EVIDENCE_PACKAGE_V2'||m.siteId!==c.siteId||!m.site||m.site.searchConsoleProperty!==c.propertyUri)throw new Error('ZIPのサイト情報が一致しません: 台帳行'+entry.row);
    if(!m.period||sssEvidenceDateKey_(m.period.startDate)!==sssEvidenceDateKey_(v[3])||sssEvidenceDateKey_(m.period.endDate)!==sssEvidenceDateKey_(v[4]))throw new Error('ZIPの期間が台帳と一致しません: 台帳行'+entry.row);
    const csv=Utilities.parseCsv(map['site_daily.csv'].getDataAsString('UTF-8'));
    if(!csv.length||csv[0].join('|')!=='date|clicks|impressions|ctr|position')throw new Error('site_daily.csvのヘッダーが不正: 台帳行'+entry.row);
    const local={};
    csv.slice(1).forEach(r=>{
      if(r.length!==5)throw new Error('日別CSV列数が不正: 台帳行'+entry.row);
      const day=sssEvidenceDateKey_(r[0]);
      if(day<sssEvidenceDateKey_(v[3])||day>sssEvidenceDateKey_(v[4]))throw new Error('期間外の日付: '+day);
      if(local[day])throw new Error('同一ZIP内に日付重複: '+day);
      const clicks=Number(r[1]),impressions=Number(r[2]),ctr=Number(r[3]),position=Number(r[4]);
      if(![clicks,impressions,ctr,position].every(Number.isFinite)||clicks<0||impressions<0||clicks>impressions||ctr<0||ctr>1||position<0)throw new Error('不正な日別数値: '+day);
      local[day]=true;
      // Later evidence replaces an overlapping day; never sum duplicate days.
      byDate[day]={clicks,impressions,position,source:id};
    });
    sources.push({registryRow:entry.row,zipId:id,days:Object.keys(local).length,periodStart:sssEvidenceDateKey_(v[3]),periodEnd:sssEvidenceDateKey_(v[4]),quality:String(v[11])});
  });
  const days=Object.keys(byDate).sort();
  let missing=0;
  for(let i=1;i<days.length;i++)missing+=Math.round((sssDateUtc_(days[i])-sssDateUtc_(days[i-1]))/86400000)-1;
  if(missing)issues.push('期間内に未収集の日付が'+missing+'日あります。');
  if(sources.some(x=>x.quality.indexOf('LIMITATIONS')>=0))issues.push('品質制限付きEvidenceが含まれます。');
  issues.push('ページ別・クエリ別の期間集計は重複を正確に除外できないため統合対象外です。');
  const total=days.reduce((a,d)=>{const r=byDate[d];a.clicks+=r.clicks;a.impressions+=r.impressions;a.positionWeighted+=r.position*r.impressions;return a;},{clicks:0,impressions:0,positionWeighted:0});
  const result={format:'SIMS_S3_MERGE_READINESS_AUDIT_V1',version:SSS_VERSION,siteId:c.siteId,propertyUri:c.propertyUri,generatedAt:new Date().toISOString(),readOnly:true,sourceCount:sources.length,sources,uniqueDays:days.length,firstDate:days[0]||null,lastDate:days[days.length-1]||null,missingDays:missing,siteDailyTotals:{clicks:total.clicks,impressions:total.impressions,ctr:total.impressions?total.clicks/total.impressions:0,position:total.impressions?total.positionWeighted/total.impressions:null},issues,mergeStatus:'NOT_EXECUTED'};
  const summary='統合事前監査（読取専用）\n検証済みZIP：'+sources.length+'件\n日別データ：'+days.length+'日\n欠落日：'+missing+'日\n期間：'+(result.firstDate||'なし')+' ～ '+(result.lastDate||'なし')+'\n\n注意：実際の統合ZIPはまだ作成しません。元Evidenceは変更していません。\n'+issues.join('\n');
  if(internal){result.dailyRows=days.map(day=>Object.assign({date:day},byDate[day]));return result;}
  SpreadsheetApp.getUi().alert(summary);
  return result;
}

// P4B: Generate a new immutable daily-only merged ZIP. No registry or source mutations.
function sssCreateMergedDailyEvidence(){
  sssRefreshVersion_();
  const ui=SpreadsheetApp.getUi(),c=sssConfig_(),map=sssDriveFolderMap_();
  if(!map)throw new Error('先にブログ別保存先を準備してください。');
  sssDriveVerifyMap_(map);
  const audit=sssAuditMergeReadiness(true);
  if(!audit.dailyRows.length)throw new Error('統合可能な日別データがありません。');
  const warning='日別データ：'+audit.uniqueDays+'日\n欠落日：'+audit.missingDays+'日\n対象期間：'+audit.firstDate+' ～ '+audit.lastDate+'\n\n元ZIPと台帳は変更しません。新しい統合ZIPを作成しますか？';
  if(ui.alert('日別Evidenceの統合（試験）',warning,ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  const lock=LockService.getDocumentLock();
  if(!lock.tryLock(30000))throw new Error('他の統合処理が実行中です。');
  try{
    // Re-audit under lock to ensure no unverified input is silently included.
    const a=sssAuditMergeReadiness(true);
    const head=['date','clicks','impressions','ctr','position'];
    const csv=[head].concat(a.dailyRows.map(r=>[r.date,r.clicks,r.impressions,r.impressions?r.clicks/r.impressions:0,r.position]));
    const windows={};
    [30,90,365].forEach(n=>{
      const end=sssDateUtc_(a.lastDate),start=new Date(end.getTime()-(n-1)*86400000);
      const startKey=Utilities.formatDate(start,'UTC','yyyy-MM-dd');
      const rows=a.dailyRows.filter(r=>r.date>=startKey&&r.date<=a.lastDate);
      const clicks=rows.reduce((v,r)=>v+r.clicks,0),impressions=rows.reduce((v,r)=>v+r.impressions,0);
      const weighted=rows.reduce((v,r)=>v+r.position*r.impressions,0);
      windows[String(n)]={startDate:startKey,endDate:a.lastDate,availableDays:rows.length,expectedDays:n,complete:rows.length===n,clicks,impressions,ctr:impressions?clicks/impressions:0,position:impressions?weighted/impressions:null};
    });
    const manifest={format:'SIMS_S3_MERGED_DAILY_V1',version:SSS_VERSION,siteId:c.siteId,propertyUri:c.propertyUri,createdAt:new Date().toISOString(),period:{startDate:a.firstDate,endDate:a.lastDate},sourceZips:a.sources,uniqueDays:a.uniqueDays,missingDays:a.missingDays,issues:a.issues,scope:'site_daily_only',pageQueryAggregatesMerged:false,windows};
    const files=[Utilities.newBlob(sdscValuesToCsv_(csv),'text/csv','site_daily.csv'),Utilities.newBlob(JSON.stringify(manifest,null,2),'application/json','manifest.json')];
    const evidence=sssDriveGetFolder_(map.evidenceId);
    const merged=sssDriveChild_(evidence,'Merged');
    const filename='SIMS_S3_Merged_Daily_'+Utilities.formatDate(new Date(),'UTC','yyyyMMdd_HHmmss')+'.zip';
    const zip=Utilities.zip(files,filename);
    const file=merged.createFile(zip);
    sssAudit_('MERGED_DAILY_CREATED',c.siteId,'fileId='+file.getId()+'; days='+a.uniqueDays);
    ui.alert('日別Evidence統合ZIPを作成しました。\nファイル：'+filename+'\n日数：'+a.uniqueDays+'\n欠落日：'+a.missingDays+'\n保存先：Evidence / Merged\n\n元EvidenceとEvidenceRegistryは変更していません。');
    return {fileId:file.getId(),fileUrl:file.getUrl(),manifest};
  }finally{lock.releaseLock();}
}

// P4C: Verify the newest merged daily ZIP without changing any Drive file or registry.
function sssVerifyMergedDailyEvidence(silent){
  sssRefreshVersion_();
  const ui=SpreadsheetApp.getUi(),c=sssConfig_(),map=sssDriveFolderMap_();
  if(!map)throw new Error('ブログ別保存先が未設定です。');
  sssDriveVerifyMap_(map);
  const evidence=sssDriveGetFolder_(map.evidenceId);
  const folders=evidence.getFoldersByName('Merged');
  if(!folders.hasNext())throw new Error('Evidence / Merged がありません。先に統合ZIPを作成してください。');
  const folder=folders.next(),iter=folder.getFiles();
  let latest=null;
  while(iter.hasNext()){
    const f=iter.next();
    if(!f.isTrashed() && /^SIMS_S3_Merged_Daily_\d{8}_\d{6}\.zip$/.test(f.getName()) && (!latest || f.getLastUpdated().getTime()>latest.getLastUpdated().getTime()))latest=f;
  }
  if(!latest)throw new Error('統合ZIPが見つかりません。');
  if(latest.getSize()>90*1024*1024)throw new Error('ZIPサイズが上限を超えています。');
  const contents=Utilities.unzip(latest.getBlob()),files={};
  contents.forEach(b=>{if(files[b.getName()])throw new Error('ZIP内に同名ファイルがあります。');files[b.getName()]=b;});
  if(!files['site_daily.csv']||!files['manifest.json'])throw new Error('統合ZIPの必須ファイルが不足しています。');
  const m=JSON.parse(files['manifest.json'].getDataAsString('UTF-8'));
  if(m.format!=='SIMS_S3_MERGED_DAILY_V1'||m.siteId!==c.siteId||m.propertyUri!==c.propertyUri||m.scope!=='site_daily_only'||m.pageQueryAggregatesMerged!==false)throw new Error('manifestの形式またはサイト識別が一致しません。');
  const csv=Utilities.parseCsv(files['site_daily.csv'].getDataAsString('UTF-8'));
  if(!csv.length||csv[0].join('|')!=='date|clicks|impressions|ctr|position')throw new Error('CSVヘッダーが不正です。');
  const rows=[],seen={};
  csv.slice(1).forEach((r,i)=>{
    if(r.length!==5)throw new Error('CSV列数不正: '+(i+2));
    const date=sssEvidenceDateKey_(r[0]);
    if(seen[date])throw new Error('日付重複: '+date);
    seen[date]=true;
    const clicks=Number(r[1]),impressions=Number(r[2]),ctr=Number(r[3]),position=Number(r[4]);
    if(![clicks,impressions,ctr,position].every(Number.isFinite)||clicks<0||impressions<0||clicks>impressions||ctr<0||ctr>1||position<0)throw new Error('数値不正: '+date);
    if(Math.abs(ctr-(impressions?clicks/impressions:0))>1e-9)throw new Error('CTR不整合: '+date);
    rows.push({date,clicks,impressions,position});
  });
  rows.sort((a,b)=>a.date.localeCompare(b.date));
  const first=rows.length?rows[0].date:null,last=rows.length?rows[rows.length-1].date:null;
  let missing=0;
  for(let i=1;i<rows.length;i++)missing+=Math.round((sssDateUtc_(rows[i].date)-sssDateUtc_(rows[i-1].date))/86400000)-1;
  if(!m.period||first!==m.period.startDate||last!==m.period.endDate||rows.length!==Number(m.uniqueDays)||missing!==Number(m.missingDays))throw new Error('CSVとmanifestの期間・日数が一致しません。');
  if(!Array.isArray(m.sourceZips)||!m.sourceZips.length||m.sourceZips.some(x=>!x.zipId||!x.registryRow))throw new Error('統合元の追跡情報が不足しています。');
  const tolerance=(a,b)=>Number.isFinite(Number(a))&&Math.abs(Number(a)-Number(b))<=1e-8*Math.max(1,Math.abs(Number(a)),Math.abs(Number(b)));
  [30,90,365].forEach(n=>{
    const w=m.windows&&m.windows[String(n)];if(!w)throw new Error(n+'日集計がありません。');
    const end=sssDateUtc_(last),start=new Date(end.getTime()-(n-1)*86400000);
    const startKey=Utilities.formatDate(start,'UTC','yyyy-MM-dd');
    const part=rows.filter(r=>r.date>=startKey&&r.date<=last);
    const clicks=part.reduce((a,r)=>a+r.clicks,0),impressions=part.reduce((a,r)=>a+r.impressions,0);
    const weighted=part.reduce((a,r)=>a+r.position*r.impressions,0);
    const position=impressions?weighted/impressions:null;
    if(w.startDate!==startKey||w.endDate!==last||w.availableDays!==part.length||w.expectedDays!==n||w.complete!==(part.length===n)||!tolerance(w.clicks,clicks)||!tolerance(w.impressions,impressions)||!tolerance(w.ctr,impressions?clicks/impressions:0)||(position===null?w.position!==null:!tolerance(w.position,position)))throw new Error(n+'日集計の照合に失敗しました。');
  });
  const result={ok:true,readOnly:true,fileId:latest.getId(),fileName:latest.getName(),uniqueDays:rows.length,missingDays:missing,firstDate:first,lastDate:last,sourceCount:m.sourceZips.length,windowsVerified:[30,90,365]};
  if(silent!==true)ui.alert('統合Evidence品質検証：合格\nファイル：'+result.fileName+'\n日数：'+rows.length+'日\n欠落日：'+missing+'日\n期間：'+first+' ～ '+last+'\n統合元：'+result.sourceCount+'件\n30日・90日・365日集計：照合OK\n\n読取専用：元Evidence・台帳・統合ZIPは変更していません。');
  return result;
}

// P4D: Resolve the latest merged ZIP only after the full v0.1.22 integrity audit.
// This is a read-only selection preview; no persistent pointer or analysis is written.
function sssShowAnalysisEvidence(){
  const ui=SpreadsheetApp.getUi();
  try {
    const r=sssVerifyMergedDailyEvidence(true);
    if(!r.ok||r.missingDays!==0)throw new Error('統合Evidenceの品質条件を満たしません。');
    ui.alert('分析対象Evidence：利用可能（読取専用）\nファイル：'+r.fileName+'\n対象期間：'+r.firstDate+' ～ '+r.lastDate+'\n日別データ：'+r.uniqueDays+'日\n欠落日：'+r.missingDays+'日\n統合元：'+r.sourceCount+'件\n検証済み集計：'+r.windowsVerified.join('・')+'日\n\n注意：現在は日別のサイト全体指標のみ使用可能です。ページ別・クエリ別の診断には使用しません。\n分析対象の固定登録や元Evidenceの変更は行いません。');
    return r;
  } catch(e) {
    ui.alert('分析対象Evidence：利用不可\n'+String(e&&e.message||e)+'\n\n品質検証に失敗したデータは分析に使用しません。');
    return {ok:false,error:String(e&&e.message||e)};
  }
}

// P4E: Read-only site-wide diagnostic. Comparison periods never overlap.
function sssDiagnoseSiteGrowth(){
  const ui=SpreadsheetApp.getUi();
  try {
    const verified=sssVerifyMergedDailyEvidence(true);
    if(!verified.ok||verified.missingDays!==0)throw new Error('品質検証済みの連続日別Evidenceが必要です。');
    const f=DriveApp.getFileById(verified.fileId);
    const blobs=Utilities.unzip(f.getBlob());
    const csvBlob=blobs.filter(b=>b.getName()==='site_daily.csv')[0];
    if(!csvBlob)throw new Error('日別CSVが見つかりません。');
    const csv=Utilities.parseCsv(csvBlob.getDataAsString('UTF-8'));
    const rows=csv.slice(1).map(r=>({date:sssEvidenceDateKey_(r[0]),clicks:Number(r[1]),impressions:Number(r[2]),position:Number(r[4])})).sort((a,b)=>a.date.localeCompare(b.date));
    const aggregate=part=>{
      const clicks=part.reduce((n,r)=>n+r.clicks,0),impressions=part.reduce((n,r)=>n+r.impressions,0);
      const weighted=part.reduce((n,r)=>n+r.position*r.impressions,0);
      return {days:part.length,clicks,impressions,ctr:impressions?clicks/impressions:0,position:impressions?weighted/impressions:null};
    };
    const pct=(now,old)=>old===0?(now===0?'0.0%':'比較不可（前期0）'):(100*(now-old)/old).toFixed(1)+'%';
    const fmt=a=>a.toLocaleString('ja-JP');
    const sections=[];
    [30,90].forEach(n=>{
      if(rows.length<2*n){sections.push(n+'日比較：データ不足（'+(2*n)+'日必要）');return;}
      const current=aggregate(rows.slice(-n)),previous=aggregate(rows.slice(-2*n,-n));
      const trend=current.clicks>previous.clicks?'増加':current.clicks<previous.clicks?'減少':'横ばい';
      sections.push('【直近'+n+'日 対 その前'+n+'日】 '+trend+'\n'+
        'クリック '+fmt(current.clicks)+' / '+fmt(previous.clicks)+'（'+pct(current.clicks,previous.clicks)+'）\n'+
        '表示回数 '+fmt(current.impressions)+' / '+fmt(previous.impressions)+'（'+pct(current.impressions,previous.impressions)+'）\n'+
        'CTR '+(100*current.ctr).toFixed(2)+'% / '+(100*previous.ctr).toFixed(2)+'%\n'+
        '平均掲載順位 '+(current.position===null?'―':current.position.toFixed(2))+' / '+(previous.position===null?'―':previous.position.toFixed(2)));
    });
    const annual=aggregate(rows.slice(-365));
    sections.push('【直近365日（比較なし）】\nクリック '+fmt(annual.clicks)+'、表示回数 '+fmt(annual.impressions)+'、CTR '+(100*annual.ctr).toFixed(2)+'%、平均掲載順位 '+(annual.position===null?'―':annual.position.toFixed(2)));
    const message='サイト全体の成長診断（読取専用）\nサイト：'+sssConfig_().siteName+'\n対象：'+verified.firstDate+' ～ '+verified.lastDate+'\n元データ：'+verified.fileName+'\n\n'+sections.join('\n\n')+'\n\n※クリック数の増減を簡易判定しています。季節性や原因・記事別・クエリ別の特定は行いません。\n※GSCで取得済みの最終日までの診断です。元Evidenceは変更しません。';
    ui.alert(message);
    return {ok:true,readOnly:true,source:verified.fileName,availableDays:rows.length,diagnostic:'site_daily_only'};
  }catch(e){ui.alert('サイト全体の成長診断：実行できません\n'+String(e&&e.message||e));return {ok:false,error:String(e&&e.message||e)};}
}

// P5A: Page-level Evidence structural audit. Does not merge or mutate files/registry.
function sssAuditPageEvidenceStructure(){
  const c=sssConfig_();
  if(!c.lockedAt)throw new Error('サイトの初回セットアップが必要です。');
  const sh=sssEvidenceSheet_(),last=sh.getLastRow();
  if(last<2)throw new Error('EvidenceRegistryが空です。');
  const allowed=['VERIFIED','VERIFIED_WITH_LIMITATIONS','DELTA_VERIFIED','DELTA_VERIFIED_WITH_LIMITATIONS'];
  const entries=sh.getRange(2,1,last-1,12).getValues().map((v,i)=>({v,row:i+2})).filter(e=>String(e.v[1])===c.siteId&&String(e.v[2])===c.propertyUri&&allowed.includes(String(e.v[11])));
  if(!entries.length)throw new Error('検証済みEvidenceがありません。');
  const names=['page_summary.csv','page_weekly.csv','query_summary.csv','page_query_top.csv'];
  const results=[];let earliest=null,latest=null;
  entries.sort((a,b)=>sssEvidenceDateKey_(a.v[3]).localeCompare(sssEvidenceDateKey_(b.v[3]))||a.row-b.row);
  entries.forEach(e=>{
    const v=e.v,from=sssEvidenceDateKey_(v[3]),to=sssEvidenceDateKey_(v[4]);
    if(from>to)throw new Error('期間が逆転しています: 台帳行'+e.row);
    const file=DriveApp.getFileById(String(v[7]));
    if(file.isTrashed()||file.getMimeType()!=='application/zip'||file.getSize()>90*1024*1024)throw new Error('ZIP形式またはサイズが不正: 台帳行'+e.row);
    const files={};Utilities.unzip(file.getBlob()).forEach(b=>{if(files[b.getName()])throw new Error('ZIP内重複ファイル: '+b.getName());files[b.getName()]=b;});
    if(!files['manifest.json'])throw new Error('manifest不足: 台帳行'+e.row);
    const m=JSON.parse(files['manifest.json'].getDataAsString('UTF-8'));
    if(m.siteId!==c.siteId||!m.site||m.site.searchConsoleProperty!==c.propertyUri||!m.period||sssEvidenceDateKey_(m.period.startDate)!==from||sssEvidenceDateKey_(m.period.endDate)!==to)throw new Error('サイトまたは期間の不一致: 台帳行'+e.row);
    const declared={};(m.datasets||[]).forEach(d=>declared[d.file]=d);
    const detail={registryRow:e.row,start:from,end:to,quality:String(v[11]),datasets:{}};
    names.forEach(n=>{
      if(!files[n])throw new Error(n+' がありません: 台帳行'+e.row);
      const rows=Utilities.parseCsv(files[n].getDataAsString('UTF-8'));
      if(!rows.length||!rows[0].length)throw new Error(n+' のヘッダーがありません: 台帳行'+e.row);
      const headers=rows[0].map(x=>String(x).trim());
      if(new Set(headers).size!==headers.length)throw new Error(n+' のヘッダー重複: 台帳行'+e.row);
      if(rows.slice(1).some(r=>r.length!==headers.length))throw new Error(n+' の列数不一致: 台帳行'+e.row);
      const count=rows.length-1;
      if(declared[n]&&Number(declared[n].rowCount)!==count)throw new Error(n+' のmanifest件数不一致: 台帳行'+e.row);
      detail.datasets[n]={rows:count,columns:headers};
    });
    results.push(detail);earliest=!earliest||from<earliest?from:earliest;latest=!latest||to>latest?to:latest;
  });
  const overlaps=[];
  for(let i=0;i<results.length;i++)for(let j=i+1;j<results.length;j++){
    const a=results[i],b=results[j],start=a.start>b.start?a.start:b.start,end=a.end<b.end?a.end:b.end;
    if(start<=end)overlaps.push('台帳'+a.registryRow+'・'+b.registryRow+'：'+start+' ～ '+end);
  }
  const headersMismatch=[];
  names.forEach(n=>{const expected=results[0].datasets[n].columns.join('|');results.slice(1).forEach(r=>{if(r.datasets[n].columns.join('|')!==expected)headersMismatch.push(n+'：台帳'+r.registryRow);});});
  const lines=['ページ別Evidence構造監査（読取専用）','検証済みZIP：'+results.length+'件','対象期間：'+earliest+' ～ '+latest,'期間重複：'+overlaps.length+'組','ヘッダー不一致：'+headersMismatch.length+'件'];
  results.forEach(r=>{lines.push('【台帳'+r.registryRow+'】'+r.start+' ～ '+r.end);names.forEach(n=>lines.push('  '+n+'：'+r.datasets[n].rows+'件'));});
  if(overlaps.length)lines.push('重複期間：\n'+overlaps.join('\n'));
  if(headersMismatch.length)lines.push('ヘッダー不一致：\n'+headersMismatch.join('\n'));
  lines.push('注意：期間集計データは重複を正確に除去できないため、単純加算しません。','元Evidence・台帳は変更していません。');
  SpreadsheetApp.getUi().alert(lines.join('\n'));
  return {readOnly:true,sourceCount:results.length,periodStart:earliest,periodEnd:latest,overlaps,headersMismatch,results};
}

// P5B: Plan-only, no GSC API access, no writes to Evidence/Registry.
// Distinguish analysis needs from API coverage; do not claim exhaustive query retrieval.
function sssPreviewDetailedEvidencePlan(){
  const c=sssConfig_();
  if(!c.lockedAt)throw new Error('初回セットアップが必要です。');
  const sh=sssEvidenceSheet_(),last=sh.getLastRow();
  const allowed=['VERIFIED','VERIFIED_WITH_LIMITATIONS','DELTA_VERIFIED','DELTA_VERIFIED_WITH_LIMITATIONS'];
  const rows=last<2?[]:sh.getRange(2,1,last-1,12).getValues().filter(v=>String(v[1])===c.siteId&&String(v[2])===c.propertyUri&&allowed.includes(String(v[11])));
  const ranges=rows.map(v=>({start:sssEvidenceDateKey_(v[3]),end:sssEvidenceDateKey_(v[4])})).sort((a,b)=>a.start.localeCompare(b.start));
  const start=ranges.length?ranges[0].start:'未収集';
  const end=ranges.length?ranges.reduce((x,r)=>r.end>x?r.end:x,ranges[0].end):'未収集';
  const lines=[
    '詳細Evidence収集計画（読取専用）',
    'サイト：'+c.siteName,
    '既存の検証済みEvidence：'+rows.length+'件',
    '既存データ範囲：'+start+' ～ '+end,
    '',
    '【成長機会】日付×クエリ／日付×ページ：需要変化と成長記事を検出',
    '【不調診断】日付×ページ／日付×クエリ：減少の寄与度を確認',
    '【サイト構造】ページ×クエリ：検索意図の重複候補を抽出',
    '',
    '収集単位：日付×ページ、日付×クエリ、日付×ページ×クエリ',
    '実装時は日単位で分割取得し、途中再開・件数上限・欠落可能性を記録します。',
    'GSCの行数制限・匿名化クエリ等により完全網羅は保証しません。',
    '日付×ページ×クエリは件数・処理時間が大きいため段階的に収集します。',
    '保存は既存Baseline/Delta/Mergedと分離し、元Evidenceは変更しません。',
    '',
    'この画面ではGSC APIの呼出し・データ収集・ファイル保存は行いません。'
  ];
  SpreadsheetApp.getUi().alert(lines.join('\n'));
  return {ok:true,readOnly:true,version:SSS_VERSION,sourceCount:rows.length,range:{start,end},plannedDimensions:['date,page','date,query','date,page,query'],collectionExecuted:false};
}

// v0.1.27: Bounded, explicit one-day pilot. Never changes baseline/delta/merged or registry.
function sssCollectDailyPagePilot(){
  const ui=SpreadsheetApp.getUi(),c=sssConfig_();
  if(!c.lockedAt||!c.propertyUri)throw new Error('サイト固定の初回セットアップが必要です。');
  const m=sssDriveFolderMap_();if(!m)throw new Error('ブログ別保存先を先に準備してください。');
  sssDriveVerifyMap_(m);
  const tz=Session.getScriptTimeZone()||'Asia/Tokyo';
  const today=Utilities.formatDate(new Date(),tz,'yyyy-MM-dd');
  const target=Utilities.formatDate(new Date(Date.now()-4*86400000),tz,'yyyy-MM-dd');
  const ok=ui.alert('詳細Evidence試験収集',
    'サイト：'+c.siteName+'\n対象日：'+target+'（4日前）\n日付×ページの最大25,000行を取得し、専用ZIPに保存します。\n件数上限時は不完全として記録します。既存Evidence・台帳は変更しません。実行しますか？',ui.ButtonSet.YES_NO);
  if(ok!==ui.Button.YES)return {ok:false,cancelled:true};
  const lock=LockService.getDocumentLock();if(!lock.tryLock(30000))throw new Error('他の処理が実行中です。');
  try{
    const rows=[],limit=25000,batch=5000;
    for(let offset=0;offset<limit;offset+=batch){
      const result=sdscSearchAnalyticsQuery_(c.propertyUri,{
        startDate:target,endDate:target,type:'web',dataState:'final',
        dimensions:['date','page'],rowLimit:batch,startRow:offset
      });
      const items=result.rows||[];
      for(const r of items){
        const keys=r.keys||[];
        if(keys[0]!==target||!keys[1])throw new Error('API応答の日付またはページが不正です。保存を中止しました。');
        rows.push([keys[0],keys[1],Number(r.clicks||0),Number(r.impressions||0),Number(r.ctr||0),Number(r.position||0)]);
      }
      if(items.length<batch)break;
    }
    const capReached=rows.length===limit;
    const csv=[['date','page','clicks','impressions','ctr','position']].concat(rows)
      .map(a=>a.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';
    const manifest={schema:'s3.daily_page.pilot.v1',version:SSS_VERSION,siteId:c.siteId,
      propertyUri:c.propertyUri,siteName:c.siteName,dimension:['date','page'],
      startDate:target,endDate:target,requestedRowLimit:limit,rows:rows.length,
      capReached:capReached,completeness:capReached?'LIMIT_REACHED_POSSIBLY_TRUNCATED':'API_RETURNED_LESS_THAN_CAP_NOT_EXHAUSTIVENESS_PROOF',
      collectedAt:new Date().toISOString(),source:'GSC Search Analytics API',
      notes:'Anonymized queries, API row limits and GSC reporting limitations may apply.'};
    const evidence=sssDriveGetFolder_(m.evidenceId);
    const folder=sssDriveChild_(evidence,'Detailed');
    const stamp=Utilities.formatDate(new Date(),tz,'yyyyMMdd_HHmmss');
    const name='SIMS_S3_Daily_Page_Pilot_'+stamp+'.zip';
    const blob=Utilities.zip([
      Utilities.newBlob(csv,'text/csv','daily_page.csv'),
      Utilities.newBlob(JSON.stringify(manifest,null,2),'application/json','manifest.json')],name);
    const f=folder.createFile(blob);
    ui.alert('詳細Evidence試験収集が完了しました。\n日付：'+target+'\n行数：'+rows.length+
      '\n件数上限：'+(capReached?'到達（不完全の可能性）':'未到達')+'\n保存先：Evidence / Detailed\nZIP：'+f.getName()+
      '\n元Evidence・台帳は変更していません。');
    return {ok:true,fileId:f.getId(),name:f.getName(),date:target,rows:rows.length,capReached};
  }finally{lock.releaseLock();}
}


// v0.1.28: Verify latest daily-page pilot ZIP without changing Drive files or Sheets.
// Passing integrity checks does NOT establish GSC coverage completeness.
function sssVerifyDailyPagePilot(){
  const ui=SpreadsheetApp.getUi();
  try {
    const c=sssConfig_();
    if(!c.lockedAt||!c.siteId||!c.propertyUri)throw new Error('サイトの初回セットアップが必要です。');
    const map=sssDriveFolderMap_();
    if(!map)throw new Error('ブログ別保存先が未設定です。');
    sssDriveVerifyMap_(map);
    const ev=sssDriveGetFolder_(map.evidenceId);
    const folders=ev.getFoldersByName('Detailed');
    if(!folders.hasNext())throw new Error('Detailedフォルダーがありません。');
    const folder=folders.next();
    if(folders.hasNext())throw new Error('Detailedフォルダーが複数存在します。保存先を確認してください。');
    const iterator=folder.getFiles();let latest=null;
    while(iterator.hasNext()){
      const f=iterator.next();
      if(f.isTrashed()||!/^SIMS_S3_Daily_Page_Pilot_\d{8}_\d{6}\.zip$/.test(f.getName()))continue;
      if(!latest||f.getName()>latest.getName())latest=f;
    }
    if(!latest)throw new Error('検証対象の試験収集ZIPがありません。');
    if(latest.getMimeType()!=='application/zip'||latest.getSize()>90*1024*1024)throw new Error('ZIP形式またはサイズが不正です。');
    const blobs=Utilities.unzip(latest.getBlob()),parts={};
    blobs.forEach(b=>{const name=b.getName();if(parts[name])throw new Error('ZIP内に重複ファイルがあります: '+name);parts[name]=b;});
    if(Object.keys(parts).length!==2||!parts['manifest.json']||!parts['daily_page.csv'])throw new Error('ZIPの必須ファイル構成が不正です。');
    const m=JSON.parse(parts['manifest.json'].getDataAsString('UTF-8'));
    if(m.schema!=='s3.daily_page.pilot.v1'||m.siteId!==c.siteId||m.propertyUri!==c.propertyUri||m.dimension.join('|')!=='date|page')throw new Error('manifestのサイト識別または収集単位が一致しません。');
    const day=String(m.startDate||'');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||m.endDate!==day||isNaN(Date.parse(day+'T00:00:00Z')))throw new Error('manifestの対象日が不正です。');
    const csv=Utilities.parseCsv(parts['daily_page.csv'].getDataAsString('UTF-8'));
    const expected=['date','page','clicks','impressions','ctr','position'];
    if(!csv.length||csv[0].join('|')!==expected.join('|'))throw new Error('CSVヘッダーが一致しません。');
    const data=csv.slice(1).filter(r=>!(r.length===1&&r[0]===''));
    if(data.length!==Number(m.rows))throw new Error('CSV件数とmanifestの件数が一致しません。');
    const limit=Number(m.requestedRowLimit);
    if(!Number.isSafeInteger(limit)||limit<=0||data.length>limit||typeof m.capReached!=='boolean'||m.capReached!==(data.length===limit))throw new Error('取得上限とmanifestの記録が矛盾しています。');
    const keys=new Set();let clicks=0,impressions=0,errors=[];
    data.forEach((r,i)=>{
      const row=i+2;
      if(r.length!==6){errors.push(row+'行: 列数不一致');return;}
      const [date,page]=r;
      if(date!==day){errors.push(row+'行: 日付不一致');return;}
      if(!/^https?:\/\/[^\s\/]+(?:\/|$)/i.test(page)){errors.push(row+'行: URL不正');return;}
      const key=date+'\u0000'+page;
      if(keys.has(key)){errors.push(row+'行: 日付×URL重複');return;}
      keys.add(key);
      const values=r.slice(2).map(Number),[cl,imp,ctr,pos]=values;
      if(r.slice(2).some(v=>String(v).trim()==='')||values.some(v=>!Number.isFinite(v))||!Number.isSafeInteger(cl)||!Number.isSafeInteger(imp)||cl<0||imp<0||cl>imp||ctr<0||ctr>1||pos<0){errors.push(row+'行: 指標の値が不正');return;}
      if(imp===0&&cl!==0){errors.push(row+'行: 表示回数とクリック数が矛盾');return;}
      if(Math.abs(ctr-(imp?cl/imp:0))>0.000001){errors.push(row+'行: CTR不一致');return;}
      if(imp>0&&pos<=0){errors.push(row+'行: 平均掲載順位不正');return;}
      clicks+=cl;impressions+=imp;
    });
    if(errors.length)throw new Error('CSV品質検証NG（'+errors.length+'件）\n'+errors.slice(0,8).join('\n'));
    const message='詳細Evidence品質検証：整合性合格\nファイル：'+latest.getName()+'\n対象日：'+day+'\n行数：'+data.length+'\n重複・数値異常：0件\nクリック：'+clicks+'／表示回数：'+impressions+'\n取得上限：'+(m.capReached?'到達（欠落の可能性あり）':'未到達')+'\n\n※GSCの網羅性は保証しません。\n読取専用：元Evidence・台帳・ZIPは変更していません。';
    ui.alert(message);
    return {ok:true,readOnly:true,integrity:'PASS',coverage:'NOT_GUARANTEED',fileName:latest.getName(),rows:data.length,date:day,capReached:m.capReached};
  }catch(e){ui.alert('詳細Evidence品質検証：不合格\n'+String(e&&e.message||e));return {ok:false,readOnly:true,error:String(e&&e.message||e)};}
}

// v0.1.30: Manual 7-day collection and bounded multi-day continuation share one engine.
function sssCollectDailyPageSevenDay(){return sssCollectDailyPageSevenDayCore_(false);}
function sssCollectDailyPageSevenDayAuto(){return sssCollectDailyPageSevenDayCore_(true);}
function sssCollectDailyPageSevenDayCore_(multi){
  const ui=SpreadsheetApp.getUi(),c=sssConfig_();
  if(!c.lockedAt||!c.siteId||!c.propertyUri)throw new Error('サイト固定の初回セットアップが必要です。');
  const map=sssDriveFolderMap_();if(!map)throw new Error('ブログ別保存先が未設定です。');
  sssDriveVerifyMap_(map);
  const lock=LockService.getDocumentLock();if(!lock.tryLock(30000))throw new Error('他の処理が実行中です。');
  const started=Date.now(),budgetMs=240000,maxDays=multi?5:1;
  try{
    const props=PropertiesService.getDocumentProperties(),stateKey='SSS_DAILY_PAGE_7DAY_'+c.siteId;
    let state=null;const saved=props.getProperty(stateKey);
    if(saved){state=JSON.parse(saved);if(state.siteId!==c.siteId||state.propertyUri!==c.propertyUri)throw new Error('再開状態のサイトが一致しません。');}
    const tz=Session.getScriptTimeZone()||'Asia/Tokyo';
    if(!state||state.status==='COMPLETE'){
      const today=Utilities.formatDate(new Date(),tz,'yyyy-MM-dd'),dates=[];
      for(let n=10;n>=4;n--)dates.push(Utilities.formatDate(new Date(Date.now()-n*86400000),tz,'yyyy-MM-dd'));
      state={schema:'s3.daily_page.seven_day.state.v1',siteId:c.siteId,propertyUri:c.propertyUri,dates:dates,done:{},status:'ACTIVE',createdAt:new Date().toISOString(),referenceDay:today};
    }
    const ev=sssDriveGetFolder_(map.evidenceId),folder=sssDriveChild_(ev,'Detailed');
    const pending=state.dates.filter(d=>!state.done[d]);
    if(!pending.length){state.status='COMPLETE';props.setProperty(stateKey,JSON.stringify(state));ui.alert('7日収集：完了（7/7）');return {ok:true,complete:true};}
    const msg='サイト：'+c.siteName+'\n対象：'+state.dates[0]+' ～ '+state.dates[6]+'\n完了：'+Object.keys(state.done).length+'/7日\n未収集：'+pending.join(', ')+'\n今回：'+(multi?'最大'+maxDays+'日を連続収集（約4分で安全停止）':'1日分を収集')+'\n元Evidence・台帳は変更しません。続けますか？';
    if(ui.alert('日付×ページ 7日収集'+(multi?'（連続実行・試験）':'（試験）'),msg,ui.ButtonSet.YES_NO)!==ui.Button.YES)return {ok:false,cancelled:true};
    let processed=0,stoppedForTime=false,failed='';
    for(const next of pending){
      if(processed>=maxDays)break;
      if(Date.now()-started>budgetMs){stoppedForTime=true;break;}
      try{
        const name='SIMS_S3_Daily_Page_7Day_'+c.siteId+'_'+next.replace(/-/g,'')+'.zip';
        const matches=folder.getFilesByName(name);
        if(matches.hasNext()){
          const existing=matches.next();if(matches.hasNext())throw new Error('同名ZIPが複数あります。');
          const parts=Utilities.unzip(existing.getBlob()),mb=parts.find(b=>b.getName()==='manifest.json');
          if(!mb)throw new Error('既存ZIPのmanifestがありません。');
          const m=JSON.parse(mb.getDataAsString('UTF-8'));
          if(m.siteId!==c.siteId||m.propertyUri!==c.propertyUri||m.startDate!==next||m.endDate!==next||m.schema!=='s3.daily_page.seven_day.v1')throw new Error('同名ZIPの識別情報が一致しません。');
          state.done[next]={fileId:existing.getId(),rows:m.rows,reused:true,capReached:m.capReached};
        }else{
          const rows=[],limit=25000,batch=5000;
          for(let offset=0;offset<limit;offset+=batch){
            // A single date is atomic: do not persist partial daily ZIPs.
            if(Date.now()-started>budgetMs)throw new Error('TIME_BUDGET_REACHED');
            const result=sdscSearchAnalyticsQuery_(c.propertyUri,{startDate:next,endDate:next,type:'web',dataState:'final',dimensions:['date','page'],rowLimit:batch,startRow:offset});
            const items=result.rows||[];
            for(const r of items){const keys=r.keys||[];if(keys[0]!==next||!keys[1])throw new Error('GSC応答の日付またはURLが不正です。');rows.push([keys[0],keys[1],Number(r.clicks||0),Number(r.impressions||0),Number(r.ctr||0),Number(r.position||0)]);}
            if(items.length<batch)break;
          }
          const capReached=rows.length===limit;
          const csv=[['date','page','clicks','impressions','ctr','position']].concat(rows).map(a=>a.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';
          const manifest={schema:'s3.daily_page.seven_day.v1',version:SSS_VERSION,siteId:c.siteId,propertyUri:c.propertyUri,siteName:c.siteName,dimension:['date','page'],startDate:next,endDate:next,rows:rows.length,requestedRowLimit:limit,capReached:capReached,completeness:capReached?'LIMIT_REACHED_POSSIBLY_TRUNCATED':'NOT_GUARANTEED',collectedAt:new Date().toISOString()};
          const file=folder.createFile(Utilities.zip([Utilities.newBlob(csv,'text/csv','daily_page.csv'),Utilities.newBlob(JSON.stringify(manifest,null,2),'application/json','manifest.json')],name));
          state.done[next]={fileId:file.getId(),rows:rows.length,reused:false,capReached:capReached};
        }
        processed++;
        state.status=Object.keys(state.done).length===7?'COMPLETE':'ACTIVE';state.updatedAt=new Date().toISOString();
        props.setProperty(stateKey,JSON.stringify(state));
      }catch(e){
        if(String(e&&e.message||e)==='TIME_BUDGET_REACHED'){stoppedForTime=true;break;}
        failed=next+'：'+String(e&&e.message||e);break;
      }
    }
    const count=Object.keys(state.done).length,remaining=state.dates.filter(d=>!state.done[d]);
    const summary='日付×ページ 7日収集：'+(count===7?'完了':'途中保存')+'\n進捗：'+count+'/7日\n今回処理：'+processed+'日\n残り：'+remaining.length+'日'+(remaining.length?'（次：'+remaining[0]+'）':'')+'\n保存先：Evidence / Detailed'+(stoppedForTime?'\n実行時間を考慮して停止しました。':'')+(failed?'\nエラー：'+failed:'')+'\n同じメニューから再開できます。';
    ui.alert(summary);
    return {ok:!failed,complete:count===7,done:count,total:7,processed:processed,remaining:remaining.length,stoppedForTime:stoppedForTime,error:failed||null};
  }finally{lock.releaseLock();}
}

// v0.1.31: Validate each daily ZIP before combining; never alter source evidence.
function sssSevenDayInspect_(){
  const c=sssConfig_();if(!c.lockedAt||!c.siteId||!c.propertyUri)throw new Error('サイト固定が必要です。');
  const map=sssDriveFolderMap_();if(!map)throw new Error('ブログ別保存先がありません。');
  sssDriveVerifyMap_(map);
  const ev=sssDriveGetFolder_(map.evidenceId),folders=ev.getFoldersByName('Detailed');
  if(!folders.hasNext())throw new Error('Detailedフォルダーがありません。');
  const folder=folders.next();if(folders.hasNext())throw new Error('Detailedフォルダーが複数あります。');
  const key='SSS_DAILY_PAGE_7DAY_'+c.siteId,saved=PropertiesService.getDocumentProperties().getProperty(key);
  if(!saved)throw new Error('7日収集の状態がありません。');
  const state=JSON.parse(saved);
  if(state.siteId!==c.siteId||state.propertyUri!==c.propertyUri||!Array.isArray(state.dates)||state.dates.length!==7)throw new Error('収集状態が不正です。');
  const dates=state.dates,seen=new Set(),all=[],sources=[],issues=[],warnings=[];
  for(let i=0;i<dates.length;i++){
    const day=dates[i];if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||seen.has(day))throw new Error('対象日が不正です。');seen.add(day);
    if(i&&Date.parse(day+'T00:00:00Z')-Date.parse(dates[i-1]+'T00:00:00Z')!==86400000)issues.push('収集対象の日付が連続していません。');
    const name='SIMS_S3_Daily_Page_7Day_'+c.siteId+'_'+day.replace(/-/g,'')+'.zip';
    const matches=folder.getFilesByName(name);
    if(!matches.hasNext()){issues.push(day+': ZIPなし');continue;}
    const f=matches.next();if(matches.hasNext()){issues.push(day+': 同名ZIP複数');continue;}
    try{
      if(f.getSize()>90*1024*1024)throw new Error('ZIPサイズ超過');
      const blobs=Utilities.unzip(f.getBlob()),parts={};
      blobs.forEach(b=>{if(parts[b.getName()])throw new Error('ZIP内部ファイル重複');parts[b.getName()]=b;});
      if(Object.keys(parts).length!==2||!parts['manifest.json']||!parts['daily_page.csv'])throw new Error('ZIP構造不一致');
      const m=JSON.parse(parts['manifest.json'].getDataAsString('UTF-8'));
      if(m.schema!=='s3.daily_page.seven_day.v1'||m.siteId!==c.siteId||m.propertyUri!==c.propertyUri||m.startDate!==day||m.endDate!==day||!Array.isArray(m.dimension)||m.dimension.join('|')!=='date|page')throw new Error('manifest識別不一致');
      const csv=Utilities.parseCsv(parts['daily_page.csv'].getDataAsString('UTF-8'));
      if(!csv.length||csv[0].join('|')!=='date|page|clicks|impressions|ctr|position')throw new Error('CSVヘッダー不一致');
      const rows=csv.slice(1).filter(r=>!(r.length===1&&r[0]===''));
      if(rows.length!==Number(m.rows))throw new Error('manifest件数不一致');
      const limit=Number(m.requestedRowLimit);
      if(!Number.isSafeInteger(limit)||limit<=0||rows.length>limit||typeof m.capReached!=='boolean'||m.capReached!==(rows.length===limit))throw new Error('取得上限情報不一致');
      const urls=new Set();let clicks=0,impressions=0,positionWeighted=0;
      rows.forEach((r,j)=>{
        if(r.length!==6||r[0]!==day||!/^https?:\/\/[^\s/]+(?:\/|$)/i.test(r[1]))throw new Error((j+2)+'行: 日付・URL・列数不正');
        if(urls.has(r[1]))throw new Error((j+2)+'行: URL重複');urls.add(r[1]);
        if(r.slice(2).some(v=>String(v).trim()===''))throw new Error((j+2)+'行: 数値空欄');
        const [cl,imp,ctr,pos]=r.slice(2).map(Number);
        if(![cl,imp,ctr,pos].every(Number.isFinite)||!Number.isSafeInteger(cl)||!Number.isSafeInteger(imp)||cl<0||imp<0||cl>imp||ctr<0||ctr>1||pos<0||(imp>0&&pos<=0)||Math.abs(ctr-(imp?cl/imp:0))>0.000001)throw new Error((j+2)+'行: 数値異常');
        clicks+=cl;impressions+=imp;positionWeighted+=pos*imp;
        all.push([day,r[1],cl,imp,ctr,pos]);
      });
      sources.push({fileId:f.getId(),name:f.getName(),date:day,rows:rows.length,clicks:clicks,impressions:impressions,capReached:m.capReached});
      if(m.capReached)warnings.push(day+': 取得上限に到達');
      if(!state.done||!state.done[day])warnings.push(day+': 進捗台帳に完了記録なし');
    }catch(e){issues.push(day+': '+String(e&&e.message||e));}
  }
  // A prior one-day pilot can coexist, but is not added to the seven-day merge.
  const iterator=folder.getFiles();let pilots=0;
  while(iterator.hasNext()){const f=iterator.next();if(!f.isTrashed()&&/^SIMS_S3_Daily_Page_Pilot_\d{8}_\d{6}\.zip$/.test(f.getName()))pilots++;}
  if(pilots)warnings.push('別の1日試験ZIP '+pilots+'件は統合対象外');
  return {c,map,dates,all,sources,issues,warnings,pilots,complete:issues.length===0&&sources.length===7};
}
function sssAuditSevenDayDetailed(){
  const ui=SpreadsheetApp.getUi();
  try{const a=sssSevenDayInspect_();
    ui.alert('7日Detailed品質監査：'+(a.complete?'合格':'要確認')+'\n検証済み：'+a.sources.length+'/7日\n行数：'+a.all.length+'\n対象：'+a.dates[0]+' ～ '+a.dates[6]+'\n問題：'+a.issues.length+'件\n注意：'+a.warnings.length+'件'+(a.issues.length?'\n'+a.issues.slice(0,5).join('\n'):'')+(a.warnings.length?'\n'+a.warnings.slice(0,5).join('\n'):'')+'\n読取専用：ファイル・台帳は変更していません。');
    return {ok:a.complete,days:a.sources.length,rows:a.all.length,issues:a.issues,warnings:a.warnings,readOnly:true};
  }catch(e){ui.alert('7日Detailed品質監査：不合格\n'+String(e.message||e));return {ok:false,error:String(e.message||e)};}
}
function sssMergeSevenDayDetailed(){
  const ui=SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();
  if(!lock.tryLock(30000))throw new Error('他の処理が実行中です。');
  try{
    const a=sssSevenDayInspect_();
    if(!a.complete)throw new Error('品質監査に合格していません。問題：'+a.issues.slice(0,4).join(' / '));
    const keyset=new Set();let clicks=0,impressions=0,weighted=0;
    for(const r of a.all){const key=r[0]+'\u0000'+r[1];if(keyset.has(key))throw new Error('日付×URL重複を検出しました。');keyset.add(key);clicks+=r[2];impressions+=r[3];weighted+=r[5]*r[3];}
    if(ui.alert('7日Detailed統合（試験）','検証済み：7日\n行数：'+a.all.length+'\n対象：'+a.dates[0]+' ～ '+a.dates[6]+'\n新しい統合ZIPを作成します。元データは変更しません。',ui.ButtonSet.YES_NO)!==ui.Button.YES)return {ok:false,cancelled:true};
    const evidence=sssDriveGetFolder_(a.map.evidenceId),folder=sssDriveChild_(evidence,'DetailedMerged');
    const manifest={schema:'s3.daily_page.merged.v1',version:SSS_VERSION,siteId:a.c.siteId,propertyUri:a.c.propertyUri,createdAt:new Date().toISOString(),period:{startDate:a.dates[0],endDate:a.dates[6]},days:7,rows:a.all.length,clicks,impressions,ctr:impressions?clicks/impressions:0,position:impressions?weighted/impressions:0,sources:a.sources,warnings:a.warnings,coverage:'NOT_GUARANTEED',scope:'date_page_7day_only',analysisWindows:{days30:'INSUFFICIENT_DATA',days90:'INSUFFICIENT_DATA',days365:'INSUFFICIENT_DATA'}};
    const csv=[['date','page','clicks','impressions','ctr','position']].concat(a.all).map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';
    const name='SIMS_S3_Detailed_Merged_'+a.c.siteId+'_'+a.dates[0].replace(/-/g,'')+'_'+a.dates[6].replace(/-/g,'')+'_'+Utilities.formatDate(new Date(),Session.getScriptTimeZone()||'Asia/Tokyo','yyyyMMdd_HHmmss')+'.zip';
    const f=folder.createFile(Utilities.zip([Utilities.newBlob(csv,'text/csv','daily_page.csv'),Utilities.newBlob(JSON.stringify(manifest,null,2),'application/json','manifest.json')],name));
    ui.alert('7日Detailed統合：完了\n日数：7\n行数：'+a.all.length+'\nクリック：'+clicks+'\n表示回数：'+impressions+'\n保存先：Evidence / DetailedMerged\nZIP：'+f.getName()+'\n元Evidenceは変更していません。');
    return {ok:true,fileId:f.getId(),fileName:f.getName(),rows:a.all.length,days:7};
  }catch(e){ui.alert('7日Detailed統合：中止\n'+String(e&&e.message||e));return {ok:false,error:String(e&&e.message||e)};}
  finally{lock.releaseLock();}
}

// v0.1.34: A bounded, opt-in pilot. No triggers, deletes, or source modifications.
function sssDailyPageMissingPlan_(windowDays){
  windowDays=windowDays||30;
  if(!Number.isInteger(windowDays)||windowDays<1||windowDays>365)throw new Error('収集対象日数が不正です。');
  const c=sssConfig_();if(!c.lockedAt||!c.siteId||!c.propertyUri)throw new Error('サイト固定が必要です。');
  const map=sssDriveFolderMap_();if(!map)throw new Error('ブログ別保存先がありません。');
  sssDriveVerifyMap_(map);
  const ev=sssDriveGetFolder_(map.evidenceId),folders=ev.getFoldersByName('Detailed');
  if(!folders.hasNext())throw new Error('Detailedフォルダーがありません。');
  const folder=folders.next();if(folders.hasNext())throw new Error('Detailedフォルダーが複数あります。');
  const tz=Session.getScriptTimeZone()||'Asia/Tokyo';
  // Date math anchored at local noon avoids DST boundary errors.
  const today=Utilities.formatDate(new Date(),tz,'yyyy-MM-dd');
  const base=new Date(today+'T12:00:00+09:00');
  const dayOffset=n=>Utilities.formatDate(new Date(base.getTime()-n*86400000),tz,'yyyy-MM-dd');
  const end=dayOffset(4),start=dayOffset(windowDays+3),days=[];
  for(let n=windowDays+3;n>=4;n--)days.push(dayOffset(n));
  const known={},issues=[],warnings=[],groups={},files=folder.getFiles();
  while(files.hasNext()){
    const f=files.next();if(f.isTrashed()||!/\.zip$/i.test(f.getName()))continue;
    try{
      const blobs=Utilities.unzip(f.getBlob());
      const mb=blobs.filter(b=>b.getName()==='manifest.json');
      if(mb.length!==1)throw new Error('manifest件数不正');
      const m=JSON.parse(mb[0].getDataAsString('UTF-8'));
      if(m.siteId!==c.siteId||m.propertyUri!==c.propertyUri)continue;
      if(!['s3.daily_page.seven_day.v1','s3.daily_page.pilot.v1','s3.daily_page.missing.v1'].includes(m.schema))continue;
      const d=m.startDate||m.date;
      if(!/^\d{4}-\d{2}-\d{2}$/.test(d)||m.endDate&&m.endDate!==d)throw new Error('対象日不正');
      if(!days.includes(d))continue;
      const cb=blobs.filter(b=>b.getName()==='daily_page.csv');
      if(cb.length!==1)throw new Error('CSV件数不正');
      const csvText=cb[0].getDataAsString('UTF-8');
      const csv=Utilities.parseCsv(csvText);
      if(!csv.length||csv[0].join('|')!=='date|page|clicks|impressions|ctr|position')throw new Error('CSVヘッダー不正');
      const rows=csv.slice(1).filter(r=>!(r.length===1&&r[0]===''));
      if(rows.length!==Number(m.rows))throw new Error('CSV/manifest行数不一致');
      const limit=Number(m.requestedRowLimit);
      if(!Number.isSafeInteger(limit)||limit<1||rows.length>limit||typeof m.capReached!=='boolean'||m.capReached!==(rows.length===limit))throw new Error('取得上限情報不正');
      const keys=new Set();
      for(const r of rows){
        if(r.length!==6||r[0]!==d||!/^https?:\/\/[^\s/]+(?:\/|$)/i.test(r[1])||keys.has(r[1]))throw new Error('CSVキー・URL不正');
        keys.add(r[1]);
        if(r.slice(2).some(v=>String(v).trim()===''))throw new Error('数値空欄');
        const [cl,imp,ctr,pos]=r.slice(2).map(Number);
        if(![cl,imp,ctr,pos].every(Number.isFinite)||!Number.isSafeInteger(cl)||!Number.isSafeInteger(imp)||cl<0||imp<0||cl>imp||ctr<0||ctr>1||pos<0||(imp>0&&pos<=0)||Math.abs(ctr-(imp?cl/imp:0))>0.000001)throw new Error('CSV数値不正');
      }
      // Normalize row order; two legitimate collections of the same date can differ.
      const fingerprint=JSON.stringify(rows.map(r=>r.join('\u0001')).sort());
      (groups[d]||(groups[d]=[])).push({fileId:f.getId(),name:f.getName(),rows:rows.length,capReached:m.capReached,fingerprint,collectedAt:String(m.collectedAt||''),schema:m.schema});
    }catch(e){issues.push(f.getName()+': '+String(e&&e.message||e));}
  }
  const duplicates=[];
  for(const d of Object.keys(groups)){
    const candidates=groups[d];
    // All candidates were individually validated. Select deterministically; never sum.
    candidates.sort((a,b)=>Number(a.capReached)-Number(b.capReached)||b.rows-a.rows||b.collectedAt.localeCompare(a.collectedAt)||a.name.localeCompare(b.name));
    known[d]=candidates[0];
    if(candidates.length>1){
      duplicates.push(d);
      const identical=candidates.every(x=>x.fingerprint===candidates[0].fingerprint);
      warnings.push(d+': '+candidates.length+'件（'+(identical?'同一内容':'内容差あり')+'）、採用: '+candidates[0].name);
    }
  }
  const missing=days.filter(d=>!known[d]);
  return {c,folder,days,start,end,missing,known,issues,warnings,duplicates,windowDays};
}
function sssPreviewDailyPageMissing(){
  return sssPreviewDailyPageMissingWindow_(30);
}
function sssPreviewDailyPageMissing365(){
  return sssPreviewDailyPageMissingWindow_(365);
}
function sssPreviewDailyPageMissingWindow_(windowDays){
  const ui=SpreadsheetApp.getUi();try{
    const p=sssDailyPageMissingPlan_(windowDays);
    ui.alert('日付×ページ 未収集日確認（読取専用）\n対象：'+p.start+' ～ '+p.end+'（'+windowDays+'日）\n収集済み：'+(windowDays-p.missing.length)+'日\n未収集：'+p.missing.length+'日'+(p.missing.length?'\n次の対象：'+p.missing.slice(0,7).join(', '):'')+'\n同日ZIP重複：'+p.duplicates.length+'日\n読取上の注意：'+p.issues.length+'件\n重複の処理：'+(p.warnings.length?p.warnings.slice(0,2).join(' / '):'なし')+'\n'+(p.issues.length?'停止理由：'+p.issues.slice(0,2).join(' / '):'')+'\n\n対象：直近'+windowDays+'日。既存ZIPは変更しません。');
    return {ok:true,readOnly:true,missing:p.missing,duplicates:p.duplicates};
  }catch(e){ui.alert('未収集日確認：中止\n'+String(e.message||e));return {ok:false,error:String(e.message||e)};}
}
function sssCollectDailyPageMissing(){
  return sssCollectDailyPageMissingWindow_(30);
}
function sssCollectDailyPageMissing365(){
  return sssCollectDailyPageMissingWindow_(365);
}
function sssCollectDailyPageMissingWindow_(windowDays){
  const ui=SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();
  if(!lock.tryLock(30000)){ui.alert('別の処理が実行中です。');return {ok:false};}
  const started=Date.now(),budgetMs=220000,maxDays=7;
  try{
    const p=sssDailyPageMissingPlan_(windowDays);
    if(p.issues.length)throw new Error('Evidence検証エラー（収集停止）：\n'+p.issues.slice(0,4).join('\n')); // Verified duplicates are not an error.
    if(!p.missing.length){ui.alert('直近'+windowDays+'日：未収集日はありません。');return {ok:true,processed:0};}
    const batch=p.missing.slice(0,maxDays);
    if(ui.alert('日付×ページ 不足分収集（試験）','対象：'+p.start+' ～ '+p.end+'（'+windowDays+'日）\n未収集：'+p.missing.length+'日\n今回：最大'+batch.length+'日（'+batch[0]+'から）\n1日25,000行まで。ZIPは別保存し、元データは変更しません。実行しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return {ok:false,cancelled:true};
    let done=0,failed='',stopped=false;
    for(const day of batch){
      if(Date.now()-started>budgetMs){stopped=true;break;}
      try{
        const name='SIMS_S3_Daily_Page_Missing_'+p.c.siteId+'_'+day.replace(/-/g,'')+'.zip';
        if(p.folder.getFilesByName(name).hasNext())throw new Error('同名ZIPが存在します。再取得を停止しました。');
        const rows=[],limit=25000,step=5000;
        for(let offset=0;offset<limit;offset+=step){
          if(Date.now()-started>budgetMs)throw new Error('TIME_BUDGET_REACHED');
          const result=sdscSearchAnalyticsQuery_(p.c.propertyUri,{startDate:day,endDate:day,type:'web',dataState:'final',dimensions:['date','page'],rowLimit:step,startRow:offset});
          const items=result.rows||[];
          for(const r of items){const k=r.keys||[];if(k[0]!==day||!k[1])throw new Error('GSC応答のキーが不正です。');rows.push([k[0],k[1],Number(r.clicks||0),Number(r.impressions||0),Number(r.ctr||0),Number(r.position||0)]);}
          if(items.length<step)break;
        }
        const keys=new Set();for(const r of rows){const key=r[0]+'\u0000'+r[1];if(keys.has(key))throw new Error('日付×URLが重複しています。');keys.add(key);if(r.slice(2).some(x=>!Number.isFinite(x))||r[2]<0||r[3]<0||r[2]>r[3])throw new Error('数値異常があります。');}
        const csv=[['date','page','clicks','impressions','ctr','position']].concat(rows).map(a=>a.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';
        const manifest={schema:'s3.daily_page.missing.v1',version:SSS_VERSION,siteId:p.c.siteId,propertyUri:p.c.propertyUri,siteName:p.c.siteName,dimension:['date','page'],startDate:day,endDate:day,rows:rows.length,requestedRowLimit:limit,capReached:rows.length===limit,completeness:'NOT_GUARANTEED',collectedAt:new Date().toISOString()};
        p.folder.createFile(Utilities.zip([Utilities.newBlob(csv,'text/csv','daily_page.csv'),Utilities.newBlob(JSON.stringify(manifest,null,2),'application/json','manifest.json')],name));
        done++;
      }catch(e){if(String(e.message||e)==='TIME_BUDGET_REACHED')stopped=true;else failed=day+'：'+String(e.message||e);break;}
    }
    ui.alert('不足分収集：'+(failed?'要確認':'処理終了')+'\n今回保存：'+done+'日\n残り見込み：'+(p.missing.length-done)+'日'+(stopped?'\n実行時間を考慮して停止しました。':'')+(failed?'\nエラー：'+failed:'')+'\n重複ZIP：'+p.duplicates.length+'日（正本選択済み）\n同じメニューから再開できます。\n元Evidenceは変更していません。');
    return {ok:!failed,processed:done,remaining:p.missing.length-done,error:failed||null};
  }catch(e){ui.alert('不足分収集：中止\n'+String(e.message||e));return {ok:false,error:String(e.message||e)};}
  finally{lock.releaseLock();}
}


// v0.1.35: explicit opt-in, at most 14 newly collected dates per pilot.
// No recurring schedule. Only own continuation triggers may be deleted.
const SSS_AUTO_KEY_ = 'SSS_AUTO_DETAILED_PILOT_V1';
const SSS_AUTO_HANDLER_ = 'sssAutoDetailedPilotTick';
const SSS_AUTO_MAX_ATTEMPTS_ = 500; // Hard safety cap, never an infinite background loop.
function sssAutoState_(){
  const raw=sssProperties_().getProperty(SSS_AUTO_KEY_);
  if(!raw)return null;
  const state=JSON.parse(raw);
  if(state.siteId!==sssConfig_().siteId)throw new Error('サイト識別子が一致しません。');
  return state;
}
function sssAutoSave_(state){sssProperties_().setProperty(SSS_AUTO_KEY_,JSON.stringify(state));}
function sssAutoClearTriggers_(){
  for(const t of ScriptApp.getProjectTriggers())if(t.getHandlerFunction()===SSS_AUTO_HANDLER_)ScriptApp.deleteTrigger(t);
}
// v0.1.37: durable repeating continuation trigger. A forced timeout must not
// consume the only future execution. Only the dedicated handler is managed.
function sssAutoSchedule_(){
  const own=ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()===SSS_AUTO_HANDLER_);
  if(own.length===1)return;
  if(own.length>1)throw new Error('専用トリガーが複数あります。安全のため停止しました。');
  ScriptApp.newTrigger(SSS_AUTO_HANDLER_).timeBased().everyMinutes(5).create();
}
function sssAutoStopInternal_(reason){
  const s=sssAutoState_();
  if(s){s.status=reason;s.updatedAt=new Date().toISOString();sssAutoSave_(s);}
  sssAutoClearTriggers_();
  return s;
}
function sssStartAutoDetailedPilot(){
  const ui=SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();
  if(!lock.tryLock(1000)){if(!silent)ui.alert('他の処理が実行中です。');return false;}
  try{
    const old=sssAutoState_();
    if(old&&old.status==='RUNNING'){ui.alert('自動収集が既に実行中です。状態確認メニューをご利用ください。');return;}
    const p=sssDailyPageMissingPlan_(365);
    if(p.issues.length)throw new Error('Evidenceの読取異常があるため開始できません：'+p.issues.slice(0,2).join(' / '));
    if(!p.missing.length){ui.alert('未収集日はありません。');return;}
    const count=Math.min(14,p.missing.length);
    if(ui.alert('詳細Evidence 自動継続収集（限定試験）','未収集：'+p.missing.length+'日\n今回の新規収集上限：'+count+'日\n最初の対象：'+p.missing[0]+'\n一時トリガーを作成し、終了時に削除します。GSC APIへのアクセスと新規ZIP保存を実行します。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
    const state={siteId:p.c.siteId,status:'RUNNING',startedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),targetDays:p.missing.slice(0,count),completed:[],errors:[],attempts:0};
    sssAutoSave_(state);
    sssAutoSchedule_();
    ui.alert('自動継続収集を予約しました。\n対象：'+count+'日\n約1分後から開始します。\n「詳細Evidence 自動収集の状態確認」で進捗を確認できます。');
  }catch(e){ui.alert('自動収集を開始できません：'+String(e.message||e));}
  finally{lock.releaseLock();}
}
function sssAutoDetailedPilotTick(){
  const lock=LockService.getDocumentLock();
  if(!lock.tryLock(1000))return;
  try{
    const s=sssAutoState_();
    if(!s||s.status!=='RUNNING'){sssAutoClearTriggers_();return;}
    s.attempts++;
    if(s.attempts>SSS_AUTO_MAX_ATTEMPTS_)throw new Error('再開回数が安全上限を超えました。');
    const p=sssDailyPageMissingPlan_(365);
    if(p.issues.length)throw new Error('既存Evidenceの読取異常：'+p.issues.slice(0,2).join(' / '));
    const started=Date.now(),budget=110000;
    let processedThisTick=0;
    for(const day of s.targetDays){
      if(s.completed.includes(day))continue;
      if(Date.now()-started>budget||processedThisTick>=4)break;
      // A previously written, verified ZIP counts as done (e.g. after interruption).
      if(p.known[day]){s.completed.push(day);s.updatedAt=new Date().toISOString();sssAutoSave_(s);continue;}
      const name='SIMS_S3_Daily_Page_Missing_'+p.c.siteId+'_'+day.replace(/-/g,'')+'.zip';
      if(p.folder.getFilesByName(name).hasNext())throw new Error(day+': 同名ZIPが存在します。品質を確認してください。');
      const rows=[],limit=25000,step=5000;
      for(let offset=0;offset<limit;offset+=step){
        if(Date.now()-started>budget){s.updatedAt=new Date().toISOString();sssAutoSave_(s);return;}
        const response=sdscSearchAnalyticsQuery_(p.c.propertyUri,{startDate:day,endDate:day,type:'web',dataState:'final',dimensions:['date','page'],rowLimit:step,startRow:offset});
        const items=response.rows||[];
        for(const r of items){const k=r.keys||[];if(k[0]!==day||!k[1])throw new Error(day+': GSCキー不正');rows.push([k[0],k[1],Number(r.clicks||0),Number(r.impressions||0),Number(r.ctr||0),Number(r.position||0)]);}
        if(items.length<step)break;
      }
      const keys=new Set();
      for(const r of rows){if(keys.has(r[1]))throw new Error(day+': URL重複');keys.add(r[1]);if(r.slice(2).some(v=>!Number.isFinite(v))||r[2]<0||r[3]<0||r[2]>r[3]||Math.abs(r[4]-(r[3]?r[2]/r[3]:0))>0.000001)throw new Error(day+': 数値異常');}
      const csv=[['date','page','clicks','impressions','ctr','position']].concat(rows).map(a=>a.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';
      const manifest={schema:'s3.daily_page.missing.v1',version:SSS_VERSION,siteId:p.c.siteId,propertyUri:p.c.propertyUri,siteName:p.c.siteName,dimension:['date','page'],startDate:day,endDate:day,rows:rows.length,requestedRowLimit:limit,capReached:rows.length===limit,completeness:'NOT_GUARANTEED',collectedAt:new Date().toISOString(),collectionMode:'auto_pilot'};
      p.folder.createFile(Utilities.zip([Utilities.newBlob(csv,'text/csv','daily_page.csv'),Utilities.newBlob(JSON.stringify(manifest,null,2),'application/json','manifest.json')],name));
      s.completed.push(day);processedThisTick++;s.updatedAt=new Date().toISOString();sssAutoSave_(s);
    }
    if(s.completed.length>=s.targetDays.length){s.status='COMPLETED';s.updatedAt=new Date().toISOString();sssAutoSave_(s);sssAutoClearTriggers_();}
    else sssAutoSchedule_();
  }catch(e){
    const s=sssAutoState_();if(s){s.status='ERROR';s.updatedAt=new Date().toISOString();s.errors.push(String(e&&e.message||e));sssAutoSave_(s);}
    sssAutoClearTriggers_();
    console.error('S3 auto detailed pilot stopped: '+String(e&&e.stack||e));
  }finally{lock.releaseLock();}
}
function sssShowAutoDetailedPilotStatus(){
  const ui=SpreadsheetApp.getUi();try{
    const s=sssAutoState_();if(!s){ui.alert('自動収集の実行履歴はありません。');return;}
    ui.alert('詳細Evidence 自動収集\n状態：'+s.status+'\n進捗：'+s.completed.length+'/'+s.targetDays.length+'日\n残り：'+(s.targetDays.length-s.completed.length)+'日\n最終更新：'+s.updatedAt+(s.errors.length?'\nエラー：'+s.errors.slice(-1)[0]:'')+'\n専用トリガー：'+sssAutoTriggerCount_()+'件'+(s.status==='COMPLETED'&&sssAutoTriggerCount_()?'\n警告：完了後のトリガー残留':'')+'\n※元Evidenceは変更しません。');
  }catch(e){ui.alert('状態確認エラー：'+String(e.message||e));}
}
function sssStopAutoDetailedPilot(){
  const ui=SpreadsheetApp.getUi();
  if(ui.alert('自動収集を停止','一時トリガーを削除して自動収集を停止します。保存済みZIPは残します。',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  const lock=LockService.getDocumentLock();if(!lock.tryLock(30000)){ui.alert('収集処理が実行中です。完了後に再度停止してください。');return;}
  try{sssAutoStopInternal_('STOPPED');ui.alert('自動収集を停止しました。保存済みEvidenceは保持しています。');}finally{lock.releaseLock();}
}


// v0.1.37: read-only trigger audit. Does not delete unrelated triggers.
function sssAutoTriggerCount_(){
  return ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()===SSS_AUTO_HANDLER_).length;
}
function sssAuditAutoDetailedTriggers(){
  const ui=SpreadsheetApp.getUi();
  try{
    const s=sssAutoState_(),count=sssAutoTriggerCount_();
    const status=s?s.status:'履歴なし';
    const issue=(status==='COMPLETED'||status==='STOPPED'||status==='ERROR')&&count>0;
    ui.alert('詳細Evidence 自動収集トリガー監査（読取専用）\n状態：'+status+'\n専用トリガー：'+count+'件\n判定：'+(issue?'要確認（終了後に残留）':count>1?'要確認（複数登録）':'正常')+'\n他のトリガーには触れません。');
    return {ok:!issue&&count<=1,triggerCount:count,status};
  }catch(e){ui.alert('トリガー監査エラー：'+String(e.message||e));return {ok:false};}
}
// Opt-in full-window collection. The same verified ZIP reader is used on each continuation.
// For safety, start only after the previous pilot is no longer running.
function sssStartAutoDetailed365(){
  const ui=SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();
  if(!lock.tryLock(1000)){if(!silent)ui.alert('他の処理が実行中です。');return false;}
  try{
    const old=sssAutoState_();
    if(old&&old.status==='RUNNING')throw new Error('自動収集が既に進行中です。');
    const p=sssDailyPageMissingPlan_(365);
    if(p.issues.length)throw new Error('Evidence読取異常：'+p.issues.slice(0,3).join(' / '));
    if(!p.missing.length){ui.alert('未収集日はありません。');return;}
    if(sssAutoTriggerCount_())throw new Error('以前の専用トリガーが残っています。トリガー監査で確認してください。');
    const days=p.missing.slice();
    if(ui.alert('詳細Evidence 365日自動収集','対象：'+p.start+' ～ '+p.end+'\n未収集：'+days.length+'日\n収集済み：'+(365-days.length)+'日\n一時トリガーで分割実行します。GSC APIへのアクセスと新規ZIP保存を行います。途中停止はメニューから可能です。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
    const now=new Date().toISOString();
    const state={siteId:p.c.siteId,status:'RUNNING',mode:'365',startedAt:now,updatedAt:now,targetDays:days,completed:[],errors:[],attempts:0};
    sssAutoSave_(state);
    try{sssAutoSchedule_();}catch(e){state.status='ERROR';state.updatedAt=new Date().toISOString();state.errors.push('トリガー予約失敗：'+String(e));sssAutoSave_(state);throw e;}
    ui.alert('365日自動収集を予約しました。\n今回の未収集：'+days.length+'日\n状態確認メニューで進捗を確認できます。');
  }catch(e){ui.alert('365日自動収集を開始できません：'+String(e.message||e));}
  finally{lock.releaseLock();}
}

// v0.1.37: opt-in recovery of a stalled 365-day job, preserving its targetDays.
// Reconciles each day with verified ZIPs inside sssAutoDetailedPilotTick.
function sssRecoverAutoDetailedCollection(){
  // Recovery must remain O(1): do NOT scan/decompress 365 days of Drive ZIPs here.
  const ui=SpreadsheetApp.getUi();
  try{
    const state=sssAutoState_();
    if(!state||state.mode!=='365'||state.status!=='RUNNING')throw new Error('再開対象の365日収集がありません。');
    const elapsed=Date.now()-Date.parse(state.updatedAt);
    if(!Number.isFinite(elapsed)||elapsed<15*60000)throw new Error('最終更新から15分経過していません。');
    const count=sssAutoTriggerCount_();
    if(count>1)throw new Error('専用トリガーが複数あります。');
    const recorded=state.completed.length,remaining=state.targetDays.length-recorded;
    if(ui.alert('停滞した自動収集を再開',
      '記録済み：'+recorded+'/'+state.targetDays.length+'日\n残り（暫定）：'+remaining+'日\n専用トリガー：'+count+'件\n'+
      '※この画面ではEvidence全件を走査しません。再開後の収集処理で保存済みZIPを検証してスキップします。\n'+
      '専用トリガーを再設定しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
    const lock=LockService.getDocumentLock();
    if(!lock.tryLock(1000))throw new Error('別の収集処理が実行中です。');
    try{
      // Re-read after confirmation to avoid reviving a completed or stopped job.
      const current=sssAutoState_();
      if(!current||current.status!=='RUNNING'||current.mode!=='365')throw new Error('状態が変更されました。');
      if(sssAutoTriggerCount_()>1)throw new Error('専用トリガーが複数あります。');
      sssAutoClearTriggers_();
      sssAutoSchedule_();
      current.updatedAt=new Date().toISOString();current.recoveredAt=current.updatedAt;
      sssAutoSave_(current);
    }finally{lock.releaseLock();}
    ui.alert('再開を予約しました。進捗は収集処理が実行された後に更新されます。');
  }catch(e){ui.alert('再開を中止しました：'+String(e.message||e));}
}


// v0.1.39: bounded, resumable audit. Source ZIPs and EvidenceRegistry are NEVER modified.
// Audit records are stored only in a dedicated spreadsheet tab, not in Evidence.
const SSS_D365_KEY_='SSS_DETAILED_365_AUDIT_V1';
const SSS_D365_SHEET_='DetailedAudit';
function sssD365Sheet_(){
  const ss=sssSpreadsheet_();let sh=ss.getSheetByName(SSS_D365_SHEET_);
  if(!sh)sh=ss.insertSheet(SSS_D365_SHEET_);
  if(sh.getLastRow()===0)sh.appendRow(['Date','File ID','ZIP','Status','Rows','Cap reached','Fingerprint','Note']);
  return sh;
}
function sssD365State_(){const raw=sssProperties_().getProperty(SSS_D365_KEY_);return raw?JSON.parse(raw):null;}
function sssD365Save_(s){sssProperties_().setProperty(SSS_D365_KEY_,JSON.stringify(s));}
function sssD365Folder_(){
  const c=sssConfig_();if(!c.lockedAt||!c.siteId||!c.propertyUri)throw new Error('サイト固定が必要です。');
  const map=sssDriveFolderMap_();sssDriveVerifyMap_(map);
  const dirs=sssDriveGetFolder_(map.evidenceId).getFoldersByName('Detailed');
  if(!dirs.hasNext())throw new Error('Detailedフォルダーがありません。');
  const dir=dirs.next();if(dirs.hasNext())throw new Error('Detailedフォルダーが複数あります。');
  return {c,dir};
}
function sssStartDetailed365Audit(){
  const ui=SpreadsheetApp.getUi();
  try{
    const old=sssD365State_();
    if(old&&old.status==='RUNNING'){ui.alert('監査は実行中です。「続行」または「自動継続」を選択してください。');return;}
    if(ui.alert('365日Detailed品質監査','既存Evidenceを変更せず、ZIPを最大5件ずつ検証します。監査記録用のDetailedAuditシートは初期化します。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
    sssD365DeleteTriggers_();
    const x=sssD365Folder_(),sh=sssD365Sheet_();
    if(sh.getLastRow()>1)sh.getRange(2,1,sh.getLastRow()-1,8).clearContent();
    const tz=Session.getScriptTimeZone()||'Asia/Tokyo';
    const today=Utilities.formatDate(new Date(),tz,'yyyy-MM-dd');
    const base=new Date(today+'T12:00:00+09:00');
    const day=n=>Utilities.formatDate(new Date(base.getTime()-n*86400000),tz,'yyyy-MM-dd');
    const state={siteId:x.c.siteId,propertyUri:x.c.propertyUri,status:'RUNNING',start:day(368),end:day(4),checked:0,valid:0,invalid:0,warnings:0,startedAt:new Date().toISOString(),token:null};
    sssD365Save_(state);ui.alert('監査を開始しました。次に「365日Detailed品質監査を続行」を選択してください。');
  }catch(e){ui.alert('監査開始エラー：'+String(e.message||e));}
}
function sssD365InspectFile_(file,c,start,end){
  const name=file.getName();
  if(file.isTrashed()||!/\.zip$/i.test(name))return null;
  let day='',rows=0,cap='',fingerprint='',note='',status='OK';
  try{
    if(file.getSize()>90*1024*1024)throw new Error('ZIPサイズ上限超過');
    const blobs=Utilities.unzip(file.getBlob());const parts={};
    blobs.forEach(b=>{if(parts[b.getName()])throw new Error('ZIP内部重複');parts[b.getName()]=b;});
    if(Object.keys(parts).length!==2||!parts['manifest.json']||!parts['daily_page.csv'])throw new Error('ZIP構造不正');
    const m=JSON.parse(parts['manifest.json'].getDataAsString('UTF-8'));
    if(m.siteId!==c.siteId||m.propertyUri!==c.propertyUri)return null;
    if(!['s3.daily_page.seven_day.v1','s3.daily_page.pilot.v1','s3.daily_page.missing.v1'].includes(m.schema))return null;
    day=m.startDate||m.date;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||m.endDate&&m.endDate!==day)throw new Error('日付不整合');
    if(day<start||day>end)return null;
    const csv=Utilities.parseCsv(parts['daily_page.csv'].getDataAsString('UTF-8'));
    if(!csv.length||csv[0].join('|')!=='date|page|clicks|impressions|ctr|position')throw new Error('CSVヘッダー不正');
    const data=csv.slice(1).filter(r=>!(r.length===1&&r[0]===''));rows=data.length;
    const limit=Number(m.requestedRowLimit);
    if(rows!==Number(m.rows)||!Number.isSafeInteger(limit)||limit<1||rows>limit||typeof m.capReached!=='boolean'||m.capReached!==(rows===limit))throw new Error('件数・取得上限不整合');
    const keys=new Set();const canonical=[];
    for(const r of data){
      if(r.length!==6||r[0]!==day||!/^https?:\/\/[^\s/]+(?:\/|$)/i.test(r[1])||keys.has(r[1]))throw new Error('日付・URL・重複不正');
      keys.add(r[1]);if(r.slice(2).some(v=>String(v).trim()===''))throw new Error('数値空欄');
      const [cl,imp,ctr,pos]=r.slice(2).map(Number);
      if(![cl,imp,ctr,pos].every(Number.isFinite)||!Number.isSafeInteger(cl)||!Number.isSafeInteger(imp)||cl<0||imp<0||cl>imp||ctr<0||ctr>1||pos<0||(imp>0&&pos<=0)||Math.abs(ctr-(imp?cl/imp:0))>0.000001)throw new Error('数値不正');
      canonical.push(r.join('\u0001'));
    }
    canonical.sort();
    const digest=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,canonical.join('\n'));
    fingerprint=Utilities.base64EncodeWebSafe(digest).replace(/=+$/,'');
    cap=m.capReached?'YES':'NO';if(m.capReached){status='WARNING';note='取得上限到達。網羅性は保証できません。';}
  }catch(e){status='ERROR';note=String(e.message||e).slice(0,300);}
  return [day,file.getId(),name,status,rows,cap,fingerprint,note];
}
// Dedicated audit triggers only. Other product triggers are never touched.
const SSS_D365_AUTO_HANDLER_='sssD365AutoTick';
function sssD365Triggers_(){return ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()===SSS_D365_AUTO_HANDLER_);}
function sssD365DeleteTriggers_(){sssD365Triggers_().forEach(t=>ScriptApp.deleteTrigger(t));}
function sssD365EnsureTrigger_(){
  const ts=sssD365Triggers_();
  if(!ts.length)ScriptApp.newTrigger(SSS_D365_AUTO_HANDLER_).timeBased().everyMinutes(5).create();
  else ts.slice(1).forEach(t=>ScriptApp.deleteTrigger(t));
}
function sssD365Batch_(isAuto){
  const lock=LockService.getDocumentLock();
  if(!lock.tryLock(isAuto?100:1000))return {busy:true};
  try{
    const s=sssD365State_();if(!s||s.status!=='RUNNING')return {inactive:true};
    const x=sssD365Folder_();if(s.siteId!==x.c.siteId||s.propertyUri!==x.c.propertyUri)throw new Error('サイト識別不一致');
    const it=s.token?DriveApp.continueFileIterator(s.token):x.dir.getFiles();
    const batch=[];const started=Date.now();let count=0;
    // Keep each tick short; a single very large ZIP may still exceed this budget.
    while(it.hasNext()&&count<3&&Date.now()-started<65000){
      const file=it.next();count++;
      const record=sssD365InspectFile_(file,x.c,s.start,s.end);
      if(record){batch.push(record);s.checked++;if(record[3]==='ERROR')s.invalid++;else{s.valid++;if(record[3]==='WARNING')s.warnings++;}}
    }
    if(batch.length){const sh=sssD365Sheet_();sh.getRange(sh.getLastRow()+1,1,batch.length,8).setValues(batch);}
    s.token=it.hasNext()?it.getContinuationToken():null;
    if(!s.token){s.status='SCANNED';s.auto=false;sssD365DeleteTriggers_();}
    s.updatedAt=new Date().toISOString();s.lastError='';sssD365Save_(s);
    return {count:count,state:s};
  }finally{lock.releaseLock();}
}
function sssContinueDetailed365Audit(){
  const ui=SpreadsheetApp.getUi();
  try{
    const result=sssD365Batch_(false);
    if(result.busy){ui.alert('別の監査処理が実行中です。');return;}
    if(result.inactive){ui.alert('実行中の監査がありません。');return;}
    const s=result.state;
    ui.alert('Detailed監査：'+s.status+'\n今回走査：'+result.count+' ZIP\n対象ZIP：'+s.checked+'件\n正常・注意：'+s.valid+'件\n不正：'+s.invalid+'件\n取得上限注意：'+s.warnings+'件\n'+(s.token?'監査を続行できます。':'走査完了。「結果を確認」を実行してください。'));
  }catch(e){ui.alert('監査エラー：'+String(e.message||e));}
}
function sssEnableDetailed365AutoAudit(){
  const ui=SpreadsheetApp.getUi();
  try{
    const s=sssD365State_();if(!s||s.status!=='RUNNING')throw new Error('先に監査を開始してください。');
    if(ui.alert('365日Detailed自動監査','5分ごとの専用トリガーで未検査ZIPを分割監査します。元Evidenceは変更しません。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
    sssD365EnsureTrigger_();s.auto=true;s.lastError='';sssD365Save_(s);
    ui.alert('自動監査を予約しました。進捗は「自動実行状態」で確認できます。');
  }catch(e){ui.alert('自動監査開始エラー：'+String(e.message||e));}
}
function sssD365AutoTick(){
  const s=sssD365State_();
  if(!s||s.status!=='RUNNING'||!s.auto){sssD365DeleteTriggers_();return;}
  try{sssD365Batch_(true);}
  catch(e){
    // Do not destroy the checkpoint. Stop automatic retries for investigation.
    const x=sssD365State_();if(x){x.auto=false;x.lastError=String(e.message||e).slice(0,500);x.updatedAt=new Date().toISOString();sssD365Save_(x);}
    sssD365DeleteTriggers_();throw e;
  }
}
function sssStopDetailed365AutoAudit(){
  const ui=SpreadsheetApp.getUi();
  if(ui.alert('自動監査を停止','監査結果とチェックポイントを保持して専用トリガーだけ停止しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  const lock=LockService.getDocumentLock();if(!lock.tryLock(1000)){ui.alert('監査処理中です。しばらくして再試行してください。');return;}
  try{const s=sssD365State_();if(s){s.auto=false;sssD365Save_(s);}sssD365DeleteTriggers_();ui.alert('自動監査を停止しました。記録は保持されています。');}
  finally{lock.releaseLock();}
}
function sssShowDetailed365AutoAudit(){
  const ui=SpreadsheetApp.getUi(),s=sssD365State_();
  if(!s){ui.alert('監査は未開始です。');return;}
  ui.alert('365日Detailed自動監査\n状態：'+s.status+'\n自動実行：'+(s.auto?'ON':'OFF')+'\n検証済みZIP：'+s.checked+'件\n不正：'+s.invalid+'件\n取得上限注意：'+s.warnings+'件\n専用トリガー：'+sssD365Triggers_().length+'件\n最終更新：'+(s.updatedAt||'-')+'\nエラー：'+(s.lastError||'なし'));
}
function sssShowDetailed365Audit(){
  const ui=SpreadsheetApp.getUi();try{
    const s=sssD365State_();if(!s)throw new Error('監査が未開始です。');
    if(s.status!=='SCANNED'){ui.alert('監査進行中：'+s.checked+'件検証済み。続行メニューをご利用ください。');return;}
    const sh=sssD365Sheet_(),rows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,8).getValues():[];
    const byDay={},issues=[];rows.forEach(r=>{if(r[3]==='ERROR'){issues.push(r[2]+': '+r[7]);return;}if(r[0]){(byDay[r[0]]||(byDay[r[0]]=[])).push(r);}});
    let unique=0,duplicates=0,conflicts=0,caps=0;
    Object.keys(byDay).forEach(d=>{unique++;const arr=byDay[d];if(arr.length>1){duplicates++;if(new Set(arr.map(r=>r[6])).size>1)conflicts++;}if(arr.some(r=>r[5]==='YES'))caps++;});
    const missing=365-unique;
    const result=issues.length||missing||conflicts?'要確認':'構造検証合格（網羅性は保証しません）';
    ui.alert('365日Detailed品質監査：'+result+'\n対象：'+s.start+' ～ '+s.end+'\n有効日数：'+unique+'/365日\n未確認日：'+missing+'日\n同日ZIP重複：'+duplicates+'日（内容差あり：'+conflicts+'日）\n取得上限到達日：'+caps+'日\n不正ZIP：'+issues.length+'件\n'+issues.slice(0,3).join('\n')+'\n元Evidence・台帳は変更していません。');
  }catch(e){ui.alert('監査結果確認エラー：'+String(e.message||e));}
}


// v0.1.42: Merge preflight uses only persisted audit metadata. No ZIP extraction,
// Drive writes, EvidenceRegistry changes, or analysis-data generation.
function sssDetailed365MergePlan_(state,records){
  if(!state||state.status!=='SCANNED')throw new Error('365日Detailed品質監査が完了していません。');
  if(state.auto)throw new Error('自動監査が実行中です。');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(state.start)||!/^\d{4}-\d{2}-\d{2}$/.test(state.end)||state.start>state.end)throw new Error('監査期間が不正です。');
  const begin=Date.parse(state.start+'T00:00:00Z'),finish=Date.parse(state.end+'T00:00:00Z');
  const days=Math.round((finish-begin)/86400000)+1;
  if(days!==365)throw new Error('監査対象期間が365日ではありません（'+days+'日）。');
  const byDay=new Map(),errors=[],unknown=[];
  records.forEach((r,i)=>{
    const rawDay=r[0];
    // Sheets converts ISO date strings to Date objects when read with getValues().
    // Normalize in the spreadsheet timezone before validating the YYYY-MM-DD key.
    const day=rawDay instanceof Date && !Number.isNaN(rawDay.getTime())
      ? Utilities.formatDate(rawDay,sssSpreadsheet_().getSpreadsheetTimeZone()||'Asia/Tokyo','yyyy-MM-dd')
      : String(rawDay||'').trim();
    const id=String(r[1]||'').trim(),zip=String(r[2]||'').trim();
    const status=String(r[3]||'').trim(),rows=Number(r[4]),cap=String(r[5]||'').trim(),fingerprint=String(r[6]||'').trim();
    if(status==='ERROR'){errors.push(zip||('行'+(i+2)));return;}
    if(!['OK','WARNING'].includes(status)||!/^\d{4}-\d{2}-\d{2}$/.test(day)||day<state.start||day>state.end||!id||!zip||!Number.isSafeInteger(rows)||rows<0||!['YES','NO'].includes(cap)||!fingerprint){unknown.push('行'+(i+2));return;}
    if(!byDay.has(day))byDay.set(day,[]);
    byDay.get(day).push({day,id,zip,status,rows,cap,fingerprint});
  });
  const selected=[],missing=[],conflicts=[],duplicates=[],capped=[];
  for(let t=begin;t<=finish;t+=86400000){
    const day=new Date(t).toISOString().slice(0,10),arr=byDay.get(day)||[];
    if(!arr.length){missing.push(day);continue;}
    if(arr.length>1)duplicates.push(day);
    const fps=new Set(arr.map(x=>x.fingerprint));
    if(fps.size>1){conflicts.push(day);continue;}
    // Same-content duplicates: choose deterministically, never silently choose conflicting content.
    arr.sort((a,b)=>a.id.localeCompare(b.id));
    selected.push(arr[0]);
    if(arr.some(x=>x.cap==='YES'))capped.push(day);
  }
  const auditCount=Number(state.checked);
  const recordCount=records.length;
  const countMismatch=!Number.isSafeInteger(auditCount)||auditCount!==recordCount;
  const blocked=!!(missing.length||conflicts.length||errors.length||unknown.length||countMismatch||capped.length);
  return {status:blocked?'HOLD':'READY',start:state.start,end:state.end,selected:selected.length,missing,conflicts,duplicates,capped,errors,unknown,auditCount,recordCount,countMismatch,selectedFiles:selected};
}
function sssPreviewDetailed365Merge(){
  const ui=SpreadsheetApp.getUi();
  try{
    const s=sssD365State_();
    if(!s||s.status!=='SCANNED')throw new Error('先に365日Detailed品質監査を完了してください。');
    const c=sssConfig_();
    if(!c.lockedAt||s.siteId!==c.siteId||s.propertyUri!==c.propertyUri)throw new Error('監査対象サイトと現在の固定サイトが一致しません。');
    const sh=sssSpreadsheet_().getSheetByName(SSS_D365_SHEET_);
    if(!sh)throw new Error('DetailedAuditシートがありません。');
    const last=sh.getLastRow();
    const records=last>1?sh.getRange(2,1,last-1,8).getValues():[];
    const p=sssDetailed365MergePlan_(s,records);
    const examples=a=>a.slice(0,3).join(', ')+(a.length>3?' ほか'+(a.length-3)+'件':'');
    ui.alert('365日Detailed統合事前監査（読取専用）\n'+
      '判定：'+p.status+'\n'+
      '期間：'+p.start+' ～ '+p.end+'\n'+
      '正本候補：'+p.selected+'/365日\n'+
      '未確認日：'+p.missing.length+'日'+(p.missing.length?' ('+examples(p.missing)+')':'')+'\n'+
      '同日重複：'+p.duplicates.length+'日\n'+
      '内容不一致：'+p.conflicts.length+'日'+(p.conflicts.length?' ('+examples(p.conflicts)+')':'')+'\n'+
      '取得上限：'+p.capped.length+'日\n'+
      '不正ZIP：'+p.errors.length+'件\n'+
      '監査記録不整合：'+(p.unknown.length+(p.countMismatch?1:0))+'件\n'+
      '監査済みZIP / 記録行：'+p.auditCount+' / '+p.recordCount+'\n\n'+
      (p.status==='READY'?'統合準備判定：READY（統合ZIPは未生成）':'統合準備判定：HOLD（問題を解決するまで統合しません）')+'\n'+
      '元Evidence・監査シート・台帳は変更していません。');
  }catch(e){ui.alert('統合事前監査エラー：'+String(e.message||e));}
}

// v0.1.43: Metadata-only diagnostic. Never changes source ZIP, registry, audit rows, or triggers.
function sssDiagnoseDetailedAuditDates(){
  const ui=SpreadsheetApp.getUi();
  try{
    const state=sssD365State_();
    if(!state||state.status!=='SCANNED')throw new Error('完了した品質監査が必要です。');
    const cfg=sssConfig_();
    if(state.siteId!==cfg.siteId||state.propertyUri!==cfg.propertyUri)throw new Error('サイトIDまたはGSCプロパティが一致しません。');
    const sheet=sssSpreadsheet_().getSheetByName(SSS_D365_SHEET_);
    if(!sheet)throw new Error('DetailedAuditがありません。');
    const n=sheet.getLastRow();
    const rows=n>1?sheet.getRange(2,1,n-1,8).getValues():[];
    const tz=sssSpreadsheet_().getSpreadsheetTimeZone()||'Asia/Tokyo';
    const byDay=new Map(),invalid=[];
    rows.forEach((r,i)=>{
      const d=r[0] instanceof Date && !isNaN(r[0].getTime())?Utilities.formatDate(r[0],tz,'yyyy-MM-dd'):String(r[0]||'').trim();
      if(!/^\d{4}-\d{2}-\d{2}$/.test(d)){invalid.push(i+2);return;}
      if(!byDay.has(d))byDay.set(d,[]);
      byDay.get(d).push({id:String(r[1]||''),zip:String(r[2]||''),status:String(r[3]||''),fp:String(r[6]||'')});
    });
    const dates=Array.from(byDay.keys()).sort();
    const expected=[];
    for(let t=Date.parse(state.start+'T00:00:00Z'),end=Date.parse(state.end+'T00:00:00Z');t<=end;t+=86400000)expected.push(new Date(t).toISOString().slice(0,10));
    const missing=expected.filter(d=>!byDay.has(d));
    const outside=dates.filter(d=>d<state.start||d>state.end);
    const duplicate=dates.filter(d=>byDay.get(d).length>1);
    const dupDetails=duplicate.slice(0,3).map(d=>d+' ('+byDay.get(d).length+'件、指紋'+new Set(byDay.get(d).map(x=>x.fp)).size+'種類)');
    const preview=a=>a.slice(0,4).join(', ')+(a.length>4?' ほか'+(a.length-4)+'件':'');
    ui.alert('Detailed監査の日付・重複診断（読取専用）\n'+
      '監査対象：'+state.start+' ～ '+state.end+'\n'+
      '監査行：'+rows.length+'件 / 異なる日付：'+dates.length+'日\n'+
      '記録の最古：'+(dates[0]||'-')+' / 最新：'+(dates[dates.length-1]||'-')+'\n'+
      '対象期間内の不足：'+missing.length+'日 '+preview(missing)+'\n'+
      '対象期間外：'+outside.length+'日 '+preview(outside)+'\n'+
      '同日重複：'+duplicate.length+'日 '+dupDetails.join('、')+'\n'+
      '日付不正：'+invalid.length+'行\n\n'+
      'この診断ではGSC API呼出し・ZIP展開・書込みを行いません。\n'+
      '不足日がGSCで取得可能か、重複ZIPが同一内容かは別途確認が必要です。');
  }catch(e){ui.alert('日付・重複診断エラー：'+String(e&&e.message||e));}
}


// v0.1.45: Single-day repair, fail-closed. Never deletes or overwrites source Evidence.
function sssRepairOneDetailedMissingDay(){
  const ui=SpreadsheetApp.getUi();
  try{
    const state=sssD365State_(),c=sssConfig_();
    if(!state||state.status!=='SCANNED'||state.auto)throw new Error('品質監査の完了が必要です。');
    if(state.siteId!==c.siteId||state.propertyUri!==c.propertyUri||!c.lockedAt)throw new Error('サイト固定情報が一致しません。');
    const sh=sssSpreadsheet_().getSheetByName(SSS_D365_SHEET_);
    if(!sh)throw new Error('DetailedAuditがありません。');
    const records=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,8).getValues():[];
    const plan=sssDetailed365MergePlan_(state,records);
    if(plan.missing.length!==1||plan.errors.length||plan.unknown.length||plan.conflicts.length||plan.countMismatch||plan.capped.length)
      throw new Error('安全な1日補完の条件を満たしません。事前監査を確認してください。');
    const day=plan.missing[0];
    if(day!=='2026-10-28')throw new Error('今回の試験対象日ではありません: '+day);
    const now=Utilities.formatDate(new Date(),Session.getScriptTimeZone()||'Asia/Tokyo','yyyy-MM-dd');
    if(day>=now)throw new Error('対象日が未来または当日です。');
    if(ui.alert('Detailed不足日を1日だけ補完（試験）',
      '対象：'+day+'\nGSCの確定データを最大25,000行取得します。\nZIPは新規保存し、品質検査合格時のみ監査記録を1行追加します。\n既存ZIPは変更しません。実行しますか？',
      ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
    const lock=LockService.getDocumentLock();
    if(!lock.tryLock(1000))throw new Error('他の処理が実行中です。');
    try{
      // Re-check persisted audit under lock; never duplicate a repaired date.
      const fresh=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,8).getValues():[];
      const check=sssDetailed365MergePlan_(sssD365State_(),fresh);
      if(check.missing.length!==1||check.missing[0]!==day)throw new Error('監査状態が変わりました。再確認してください。');
      const limit=25000,batchSize=5000,rows=[];
      for(let offset=0;offset<limit;offset+=batchSize){
        const response=sdscSearchAnalyticsQuery_(c.propertyUri,{startDate:day,endDate:day,type:'web',dataState:'final',dimensions:['date','page'],rowLimit:batchSize,startRow:offset});
        const items=response.rows||[];
        for(const r of items){
          if(!r.keys||r.keys[0]!==day||!r.keys[1])throw new Error('APIの日付・URLが一致しません。');
          rows.push([r.keys[0],r.keys[1],Number(r.clicks||0),Number(r.impressions||0),Number(r.ctr||0),Number(r.position||0)]);
        }
        if(items.length<batchSize)break;
      }
      if(!rows.length)throw new Error('API応答が0件です。確定状況を確認し、空ZIPは作成しません。');
      const csv=[['date','page','clicks','impressions','ctr','position']].concat(rows)
        .map(a=>a.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';
      const manifest={schema:'s3.daily_page.missing.v1',version:SSS_VERSION,siteId:c.siteId,propertyUri:c.propertyUri,siteName:c.siteName,dimension:['date','page'],startDate:day,endDate:day,rows:rows.length,requestedRowLimit:limit,capReached:rows.length===limit,completeness:'NOT_GUARANTEED',collectedAt:new Date().toISOString(),collectionMode:'single_day_repair'};
      const folder=sssD365Folder_().dir;
      const name='SIMS_S3_Daily_Page_Repair_'+day.replace(/-/g,'')+'_'+Utilities.formatDate(new Date(),'Asia/Tokyo','yyyyMMdd_HHmmss')+'.zip';
      const file=folder.createFile(Utilities.zip([Utilities.newBlob(csv,'text/csv','daily_page.csv'),Utilities.newBlob(JSON.stringify(manifest),'application/json','manifest.json')],name));
      const record=sssD365InspectFile_(file,c,state.start,state.end);
      if(!record||record[3]!=='OK')throw new Error('ZIPを保存しましたが品質監査が合格しませんでした。監査記録は追加していません。ZIP：'+name+' / '+(record?record[7]||record[3]:'対象外'));
      // Audit append is idempotency-checked; state counters updated only after append.
      const current=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,8).getValues():[];
      const latest=sssDetailed365MergePlan_(sssD365State_(),current);
      if(latest.missing.length!==1||latest.missing[0]!==day)throw new Error('補完中に監査記録が変更されました。ZIPは保存済みです。再収集せず監査を確認してください。');
      sh.appendRow(record);
      const next=sssD365State_();next.checked=Number(next.checked)+1;next.valid=Number(next.valid)+1;next.updatedAt=new Date().toISOString();sssD365Save_(next);
      ui.alert('1日補完：品質監査合格\n対象：'+day+'\n行数：'+rows.length+'\nZIP：'+name+'\n監査記録：1行追加\n既存Evidenceは変更していません。\n次に統合事前監査を実行してください。');
    }finally{lock.releaseLock();}
  }catch(e){ui.alert('1日補完を停止しました：'+String(e&&e.message||e));}
}


// v0.1.45: bounded, checkpointed 365-day Detailed merge into independently
// verifiable chunk ZIPs. Does not mutate source Evidence or audit rows.
const SSS_DM365_KEY_='SSS_DETAILED_365_CHUNK_MERGE_V1';
function sssDM365State_(){const x=sssProperties_().getProperty(SSS_DM365_KEY_);return x?JSON.parse(x):null;}
function sssDM365Save_(s){sssProperties_().setProperty(SSS_DM365_KEY_,JSON.stringify(s));}
function sssDM365Plan_(){
 const s=sssD365State_(),c=sssConfig_();
 if(!s||s.siteId!==c.siteId||s.propertyUri!==c.propertyUri||!c.lockedAt)throw new Error('サイト固定・監査状態が一致しません。');
 const sh=sssSpreadsheet_().getSheetByName(SSS_D365_SHEET_);
 if(!sh)throw new Error('DetailedAuditがありません。');
 const rec=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,8).getValues():[];
 const p=sssDetailed365MergePlan_(s,rec);
 if(p.status!=='READY'||p.selectedFiles.length!==365)throw new Error('統合事前監査がREADYではありません。');
 return {p,c};
}
function sssDM365Folder_(){const map=sssDriveFolderMap_();sssDriveVerifyMap_(map);return sssDriveChild_(sssDriveGetFolder_(map.evidenceId),'DetailedMerged');}
function sssDM365Find_(folder,name){const it=folder.getFilesByName(name);const found=[];while(it.hasNext()){const f=it.next();if(!f.isTrashed())found.push(f);}if(found.length>1)throw new Error('同名出力ZIPが複数あります: '+name);return found[0]||null;}
function sssDM365ReadChunk_(f,expected){
 const blobs=Utilities.unzip(f.getBlob()),parts={};blobs.forEach(b=>{if(parts[b.getName()])throw new Error('ZIP内部ファイル重複');parts[b.getName()]=b;});
 if(!parts['manifest.json']||!parts['daily_page.csv']||Object.keys(parts).length!==2)throw new Error('出力ZIP構造不正');
 const m=JSON.parse(parts['manifest.json'].getDataAsString('UTF-8'));
 if(m.schema!=='s3.daily_page.chunk365.v1'||m.batch!==expected.batch||m.siteId!==expected.siteId||m.sourceSignature!==expected.signature)throw new Error('出力ZIP識別不一致');
 const rows=Utilities.parseCsv(parts['daily_page.csv'].getDataAsString('UTF-8'));
 if(rows[0].join('|')!=='date|page|clicks|impressions|ctr|position'||rows.length-1!==m.rows)throw new Error('出力CSV不一致');
 return m;
}
function sssDM365Signature_(files){const raw=files.map(f=>[f.day,f.id,f.fingerprint].join('|')).join('\n');return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,raw)).replace(/=+$/,'');}
function sssStartDetailed365ChunkMerge(){
 const ui=SpreadsheetApp.getUi();try{
  const {p,c}=sssDM365Plan_(),old=sssDM365State_();
  if(old&&old.status==='RUNNING')throw new Error('既に分割統合中です。「続行」を使用してください。');
  if(ui.alert('365日Detailed分割統合（試験）','READY：365日。5日ずつZIPに保存し、最後に索引ZIPを作成します。単一の巨大ZIPは作成しません。既存Evidenceは変更しません。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  const files=p.selectedFiles.slice().sort((a,b)=>a.day.localeCompare(b.day)),signature=sssDM365Signature_(files);
  const run='DM365_'+c.siteId+'_'+signature.slice(0,16);
  sssDM365Save_({status:'RUNNING',siteId:c.siteId,propertyUri:c.propertyUri,start:p.start,end:p.end,signature,run,next:0,parts:[],updatedAt:new Date().toISOString(),error:''});
  ui.alert('分割統合を開始しました。次に「分割統合を続行」を実行してください。1回につき最大5日処理します。');
 }catch(e){ui.alert('分割統合開始エラー：'+String(e.message||e));}
}
function sssContinueDetailed365ChunkMerge(silent){
 const ui=silent?null:SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();
 if(!lock.tryLock(1000)){if(ui)ui.alert('別の処理が実行中です。');return;}
 try{
  const s=sssDM365State_();if(!s||s.status!=='RUNNING')throw new Error('実行中の分割統合がありません。');
  const {p,c}=sssDM365Plan_(),files=p.selectedFiles.slice().sort((a,b)=>a.day.localeCompare(b.day)),signature=sssDM365Signature_(files);
  if(c.siteId!==s.siteId||c.propertyUri!==s.propertyUri||signature!==s.signature||s.start!==p.start||s.end!==p.end)throw new Error('監査正本が変更されました。統合を停止します。');
  const folder=sssDM365Folder_(),batch=Math.floor(s.next/5),slice=files.slice(s.next,s.next+5);
  if(!slice.length)throw new Error('進捗不整合です。');
  const name=s.run+'_part_'+String(batch+1).padStart(3,'0')+'.zip';
  let f=sssDM365Find_(folder,name),manifest;
  if(f){manifest=sssDM365ReadChunk_(f,{batch,siteId:c.siteId,signature});}
  else{
   const all=[],sources=[],keys=new Set();let clicks=0,impressions=0,weighted=0;
   for(const item of slice){
    const source=DriveApp.getFileById(item.id);
    if(source.isTrashed()||source.getName()!==item.zip)throw new Error('元ZIPが変更・削除されました: '+item.day);
    const audit=sssD365InspectFile_(source,c,s.start,s.end);
    if(!audit||audit[3]!=='OK'||audit[0]!==item.day||audit[6]!==item.fingerprint)throw new Error('元ZIPの再検証失敗: '+item.day);
    const bs=Utilities.unzip(source.getBlob()),csvBlob=bs.filter(b=>b.getName()==='daily_page.csv')[0];
    if(!csvBlob)throw new Error('CSVがありません: '+item.day);
    const rows=Utilities.parseCsv(csvBlob.getDataAsString('UTF-8')).slice(1);
    for(const r of rows){if(r.length===1&&r[0]==='')continue;
     const key=r[0]+'\u0000'+r[1];if(keys.has(key))throw new Error('日付×URL重複');keys.add(key);
     const cl=Number(r[2]),imp=Number(r[3]),pos=Number(r[5]);clicks+=cl;impressions+=imp;weighted+=pos*imp;all.push(r);
    }
    sources.push({date:item.day,fileId:item.id,fingerprint:item.fingerprint,rows:audit[4]});
   }
   manifest={schema:'s3.daily_page.chunk365.v1',version:SSS_VERSION,siteId:c.siteId,propertyUri:c.propertyUri,sourceSignature:signature,batch,period:{startDate:slice[0].day,endDate:slice[slice.length-1].day},days:slice.length,rows:all.length,clicks,impressions,ctr:impressions?clicks/impressions:0,position:impressions?weighted/impressions:0,sources,coverage:'NOT_GUARANTEED',createdAt:new Date().toISOString()};
   const csv=[['date','page','clicks','impressions','ctr','position']].concat(all).map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n';
   f=folder.createFile(Utilities.zip([Utilities.newBlob(csv,'text/csv','daily_page.csv'),Utilities.newBlob(JSON.stringify(manifest),'application/json','manifest.json')],name));
   sssDM365ReadChunk_(f,{batch,siteId:c.siteId,signature});
  }
  s.parts.push({batch,fileId:f.getId(),name,days:manifest.days,rows:manifest.rows,clicks:manifest.clicks,impressions:manifest.impressions,weighted:manifest.position*manifest.impressions});
  s.next+=slice.length;s.updatedAt=new Date().toISOString();sssDM365Save_(s);
  if(s.next===365){
   const summary={schema:'s3.daily_page.chunk365.index.v1',version:SSS_VERSION,siteId:c.siteId,propertyUri:c.propertyUri,sourceSignature:signature,start:s.start,end:s.end,days:365,parts:s.parts,rows:s.parts.reduce((a,x)=>a+x.rows,0),clicks:s.parts.reduce((a,x)=>a+x.clicks,0),impressions:s.parts.reduce((a,x)=>a+x.impressions,0),coverage:'NOT_GUARANTEED',createdAt:new Date().toISOString()};
   const indexName=s.run+'_INDEX.zip';let index=sssDM365Find_(folder,indexName);
   if(!index)index=folder.createFile(Utilities.zip([Utilities.newBlob(JSON.stringify(summary,null,2),'application/json','index.json')],indexName));
   s.status='COMPLETED';s.indexId=index.getId();s.indexName=indexName;s.updatedAt=new Date().toISOString();sssDM365Save_(s);
  }
  if(s.status==='COMPLETED')sssDM365RemoveAutoTriggers_();
  if(ui)ui.alert('365日Detailed分割統合：'+s.status+'\n進捗：'+s.next+'/365日\n分割ZIP：'+s.parts.length+'件\n保存先：Evidence / DetailedMerged\n'+(s.status==='COMPLETED'?'索引ZIP：'+s.indexName:'続行メニューから再開できます。')+'\n元Evidenceは変更していません。');
 }catch(e){const s=sssDM365State_();if(s){s.error=String(e.message||e).slice(0,400);if(silent){s.status='ERROR';sssDM365RemoveAutoTriggers_();}sssDM365Save_(s);}if(ui)ui.alert('分割統合を停止：'+String(e.message||e));else console.error('Detailed merge stopped: '+String(e.stack||e));}
 finally{lock.releaseLock();}
}
function sssShowDetailed365ChunkMerge(){const s=sssDM365State_();SpreadsheetApp.getUi().alert(s?'365日Detailed分割統合\n状態：'+s.status+'\n進捗：'+s.next+'/365日\n分割ZIP：'+s.parts.length+'件\n索引：'+(s.indexName||'未生成')+'\nエラー：'+(s.error||'なし'):'分割統合は未開始です。');}

// v0.1.46: Dedicated auto-continuation for Detailed chunk merge.
const SSS_DM365_AUTO_HANDLER_='sssDM365AutoTick';
function sssDM365AutoTriggers_(){return ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()===SSS_DM365_AUTO_HANDLER_);}
function sssDM365RemoveAutoTriggers_(){sssDM365AutoTriggers_().forEach(t=>ScriptApp.deleteTrigger(t));}
function sssEnableDetailed365AutoMerge(){
 const ui=SpreadsheetApp.getUi();try{
  const s=sssDM365State_();if(!s||s.status!=='RUNNING'||s.next>=365)throw new Error('継続可能な分割統合がありません。');
  const {p,c}=sssDM365Plan_();const signature=sssDM365Signature_(p.selectedFiles.slice().sort((a,b)=>a.day.localeCompare(b.day)));
  if(signature!==s.signature||c.siteId!==s.siteId||c.propertyUri!==s.propertyUri)throw new Error('監査正本またはサイト固定情報が変更されました。');
  if(ui.alert('365日Detailed分割統合の自動継続','現在 '+s.next+'/365日、分割ZIP '+s.parts.length+'件です。専用トリガーで約5分ごとに最大5日ずつ統合します。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  sssDM365RemoveAutoTriggers_();
  ScriptApp.newTrigger(SSS_DM365_AUTO_HANDLER_).timeBased().everyMinutes(5).create();
  s.error='';sssDM365Save_(s);
  ui.alert('自動継続を設定しました。既存の進捗 '+s.next+'/365日から続行します。');
 }catch(e){ui.alert('自動継続設定エラー：'+String(e.message||e));}
}
function sssDM365AutoTick(){
 const s=sssDM365State_();
 if(!s||s.status!=='RUNNING'){sssDM365RemoveAutoTriggers_();return;}
 sssContinueDetailed365ChunkMerge(true);
}
function sssStopDetailed365AutoMerge(){
 const ui=SpreadsheetApp.getUi();if(ui.alert('自動継続を停止','専用トリガーだけを削除します。統合済みZIPと進捗は保持します。停止しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
 sssDM365RemoveAutoTriggers_();ui.alert('専用トリガーを停止しました。統合進捗は保持されています。');
}
function sssShowDetailed365AutoMerge(){
 const s=sssDM365State_(),n=sssDM365AutoTriggers_().length;
 SpreadsheetApp.getUi().alert('365日Detailed分割統合 自動実行\n状態：'+(s?s.status:'未開始')+'\n進捗：'+(s?s.next:0)+'/365日\n分割ZIP：'+(s?s.parts.length:0)+'件\n専用トリガー：'+n+'件\nエラー：'+(s&&s.error?s.error:'なし'));
}


// v0.1.47: Read-only verification of completed chunk ZIPs and index.
// Checkpoint is stored in script properties; source and output Drive files are never edited.
const SSS_DM365_AUDIT_KEY_='SSS_DM365_OUTPUT_AUDIT_V1';
function sssDM365AuditState_(){const x=sssProperties_().getProperty(SSS_DM365_AUDIT_KEY_);return x?JSON.parse(x):null;}
function sssDM365AuditSave_(s){sssProperties_().setProperty(SSS_DM365_AUDIT_KEY_,JSON.stringify(s));}
function sssDM365AuditIndex_(merge){
 if(!merge||merge.status!=='COMPLETED'||merge.next!==365||merge.parts.length!==73||!merge.indexId)throw new Error('365日統合の完了状態が不正です。');
 const folder=sssDM365Folder_(),index=DriveApp.getFileById(merge.indexId);
 if(index.isTrashed()||index.getName()!==merge.indexName||!sssDM365Find_(folder,merge.indexName)||sssDM365Find_(folder,merge.indexName).getId()!==index.getId())throw new Error('索引ZIPの保存先または識別が不正です。');
 const blobs=Utilities.unzip(index.getBlob());if(blobs.length!==1||blobs[0].getName()!=='index.json')throw new Error('索引ZIP構造不正');
 const idx=JSON.parse(blobs[0].getDataAsString('UTF-8'));
 if(idx.schema!=='s3.daily_page.chunk365.index.v1'||idx.siteId!==merge.siteId||idx.propertyUri!==merge.propertyUri||idx.sourceSignature!==merge.signature||idx.days!==365||idx.start!==merge.start||idx.end!==merge.end||!Array.isArray(idx.parts)||idx.parts.length!==73)throw new Error('索引ZIPの識別情報不一致');
 if(JSON.stringify(idx.parts)!==JSON.stringify(merge.parts))throw new Error('索引とチェックポイントの分割ZIP一覧が一致しません。');
 return idx;
}
function sssStartDM365OutputAudit(){
 const ui=SpreadsheetApp.getUi();try{
  const m=sssDM365State_(),idx=sssDM365AuditIndex_(m);
  if(ui.alert('365日Detailed統合ZIP監査','73件の分割ZIPを1件ずつ検証します。元Evidence・統合ZIPは変更しません。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  sssDM365AuditSave_({status:'RUNNING',signature:m.signature,indexId:m.indexId,siteId:m.siteId,next:0,days:0,rows:0,clicks:0,impressions:0,issues:[],updatedAt:new Date().toISOString()});
  ui.alert('監査を開始しました。「監査を続行」で1件ずつ検証します。');
 }catch(e){ui.alert('監査開始エラー：'+String(e.message||e));}
}
function sssContinueDM365OutputAudit(silent){
 silent=(silent===true);const ui=silent?null:SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();if(!lock.tryLock(1000)){if(ui)ui.alert('他の処理が実行中です。');return;}
 try{
  const a=sssDM365AuditState_(),m=sssDM365State_();if(!a||a.status!=='RUNNING')throw new Error('監査が実行中ではありません。');
  const idx=sssDM365AuditIndex_(m);if(a.signature!==m.signature||a.indexId!==m.indexId||a.siteId!==m.siteId)throw new Error('統合結果が監査開始時から変更されています。');
  const part=idx.parts[a.next];if(!part)throw new Error('監査進捗不正');
  const folder=sssDM365Folder_(),f=DriveApp.getFileById(part.fileId);
  if(f.isTrashed()||f.getName()!==part.name||!sssDM365Find_(folder,part.name)||sssDM365Find_(folder,part.name).getId()!==f.getId())throw new Error('分割ZIPの保存先または識別不正: '+part.name);
  const blobs=Utilities.unzip(f.getBlob()),map={};for(const b of blobs){if(map[b.getName()])throw new Error('ZIP内重複');map[b.getName()]=b;}
  if(blobs.length!==2||!map['manifest.json']||!map['daily_page.csv'])throw new Error('ZIP構造不正');
  const mf=JSON.parse(map['manifest.json'].getDataAsString('UTF-8'));
  if(mf.schema!=='s3.daily_page.chunk365.v1'||mf.batch!==a.next||mf.siteId!==m.siteId||mf.propertyUri!==m.propertyUri||mf.sourceSignature!==m.signature||mf.days!==part.days||mf.rows!==part.rows||mf.clicks!==part.clicks||mf.impressions!==part.impressions||!Array.isArray(mf.sources)||mf.sources.length!==part.days)throw new Error('manifest・索引の整合性不正');
  const csv=Utilities.parseCsv(map['daily_page.csv'].getDataAsString('UTF-8'));
  if(csv[0].join('|')!=='date|page|clicks|impressions|ctr|position'||csv.length-1!==mf.rows)throw new Error('CSVヘッダー・行数不一致');
  const dates=new Set(),keys=new Set();let clicks=0,impressions=0;
  for(let i=1;i<csv.length;i++){
   const r=csv[i];if(r.length!==6||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(r[0])||!r[1])throw new Error('CSV行形式不正: '+i);
   const key=r[0]+'\u0000'+r[1];if(keys.has(key))throw new Error('日付×URL重複: '+i);keys.add(key);dates.add(r[0]);
   const c=Number(r[2]),im=Number(r[3]),ctr=Number(r[4]),pos=Number(r[5]);
   if(![c,im,ctr,pos].every(Number.isFinite)||c<0||im<0||c>im||ctr<0||ctr>1||pos<0)throw new Error('CSV数値不正: '+i);
   clicks+=c;impressions+=im;
  }
  const expected=mf.sources.map(x=>x.date);
  if(new Set(expected).size!==part.days||dates.size!==part.days||expected.some(d=>!dates.has(d)))throw new Error('収録日付不一致');
  if(clicks!==mf.clicks||impressions!==mf.impressions)throw new Error('CSV数値合計不一致');
  if(a.next===0&&mf.period.startDate!==m.start)throw new Error('開始日不一致');
  if(a.next===72&&mf.period.endDate!==m.end)throw new Error('終了日不一致');
  a.next++;a.days+=mf.days;a.rows+=mf.rows;a.clicks+=clicks;a.impressions+=impressions;a.updatedAt=new Date().toISOString();
  if(a.next===73){
   if(a.days!==365||a.rows!==idx.rows||a.clicks!==idx.clicks||a.impressions!==idx.impressions)throw new Error('全体集計が索引と一致しません。');
   a.status='PASSED';
  }
  sssDM365AuditSave_(a);
  if(a.status==='PASSED')sssDM365AuditRemoveAutoTriggers_();
  if(ui)ui.alert('統合ZIP品質監査：'+a.status+'\n検証：'+a.next+'/73件\n日数：'+a.days+'/365日\n行数：'+a.rows+'\nクリック：'+a.clicks+'\n表示回数：'+a.impressions+'\n元Evidence・ZIPは変更していません。');
 }catch(e){const a=sssDM365AuditState_();if(a){a.status='HOLD';a.issues.push(String(e.message||e).slice(0,300));a.updatedAt=new Date().toISOString();sssDM365AuditSave_(a);}if(silent)sssDM365AuditRemoveAutoTriggers_();if(ui)ui.alert('統合ZIP監査を保留：'+String(e.message||e));else console.error('Detailed output audit HOLD: '+String(e.stack||e));}
 finally{lock.releaseLock();}
}
function sssShowDM365OutputAudit(){const a=sssDM365AuditState_();SpreadsheetApp.getUi().alert(a?'365日Detailed統合ZIP監査\n状態：'+a.status+'\n検証：'+a.next+'/73件\n日数：'+a.days+'/365日\n行数：'+a.rows+'\nエラー：'+(a.issues.join(' / ')||'なし'):'統合ZIP監査は未開始です。');}


// v0.1.49: Dedicated time-based continuation for output ZIP audit.
const SSS_DM365_AUDIT_AUTO_HANDLER_='sssDM365OutputAuditAutoTick';
function sssDM365AuditAutoTriggers_(){return ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()===SSS_DM365_AUDIT_AUTO_HANDLER_);}
function sssDM365AuditRemoveAutoTriggers_(){sssDM365AuditAutoTriggers_().forEach(t=>ScriptApp.deleteTrigger(t));}
function sssEnableDM365OutputAutoAudit(){
 const ui=SpreadsheetApp.getUi();try{
  const a=sssDM365AuditState_(),m=sssDM365State_();
  if(!a||a.status!=='RUNNING'||a.next<1||a.next>=73)throw new Error('途中から継続可能な品質監査がありません。');
  sssDM365AuditIndex_(m);
  if(a.signature!==m.signature||a.indexId!==m.indexId||a.siteId!==m.siteId)throw new Error('監査開始時から統合結果が変更されています。');
  if(ui.alert('365日Detailed統合ZIP監査の自動継続','検証済み '+a.next+'/73件から、専用トリガーで約5分ごとに1件ずつ検証します。既存の監査進捗は保持します。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  sssDM365AuditRemoveAutoTriggers_();
  ScriptApp.newTrigger(SSS_DM365_AUDIT_AUTO_HANDLER_).timeBased().everyMinutes(5).create();
  ui.alert('自動監査を設定しました。進捗 '+a.next+'/73件から継続します。');
 }catch(e){ui.alert('自動監査設定エラー：'+String(e.message||e));}
}
function sssDM365OutputAuditAutoTick(){
 const a=sssDM365AuditState_();
 if(!a||a.status!=='RUNNING'){sssDM365AuditRemoveAutoTriggers_();return;}
 sssContinueDM365OutputAudit(true);
}
function sssStopDM365OutputAutoAudit(){
 const ui=SpreadsheetApp.getUi();if(ui.alert('自動品質監査を停止','品質監査専用トリガーだけを削除します。検証済み進捗は保持します。停止しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
 sssDM365AuditRemoveAutoTriggers_();ui.alert('専用トリガーを停止しました。品質監査の進捗は保持されています。');
}
function sssShowDM365OutputAutoAudit(){
 const a=sssDM365AuditState_(),n=sssDM365AuditAutoTriggers_().length;
 SpreadsheetApp.getUi().alert('365日Detailed統合ZIP監査 自動実行\n状態：'+(a?a.status:'未開始')+'\n検証：'+(a?a.next:0)+'/73件\n日数：'+(a?a.days:0)+'/365日\n専用トリガー：'+n+'件\nエラー：'+(a&&a.issues&&a.issues.length?a.issues.join(' / '):'なし'));
}


// v0.1.49: Read-only per-day numeric reconciliation of canonical source ZIPs
// against the 73 output chunks. One chunk (up to five days) per invocation.
// This validates daily rows/clicks/impressions; it is NOT a row-by-row equality proof.
const SSS_DM365_RECON_KEY_='SSS_DM365_SOURCE_RECON_V1';
function sssDM365ReconState_(){const x=sssProperties_().getProperty(SSS_DM365_RECON_KEY_);return x?JSON.parse(x):null;}
function sssDM365ReconSave_(s){sssProperties_().setProperty(SSS_DM365_RECON_KEY_,JSON.stringify(s));}
function sssStartDM365SourceReconcile(){
 const ui=SpreadsheetApp.getUi();try{
  const m=sssDM365State_(),a=sssDM365AuditState_();
  if(!m||m.status!=='COMPLETED'||!a||a.status!=='PASSED'||a.next!==73)throw new Error('統合ZIP品質監査がPASSEDではありません。');
  const idx=sssDM365AuditIndex_(m),plan=sssDM365Plan_().p;
  const files=plan.selectedFiles.slice().sort((x,y)=>x.day.localeCompare(y.day));
  if(sssDM365Signature_(files)!==m.signature||idx.parts.length!==73)throw new Error('元Evidenceの正本選択が統合時から変わりました。');
  const old=sssDM365ReconState_();
  if(old&&old.status==='RUNNING')throw new Error('照合中です。「続行」を選択してください。');
  if(ui.alert('365日Detailed元データ数値照合','365日分の正本ZIPと統合ZIPを5日単位で読み取り専用照合します。元Evidenceと統合ZIPは変更しません。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  sssDM365ReconSave_({status:'RUNNING',signature:m.signature,indexId:m.indexId,siteId:m.siteId,next:0,days:0,rows:0,clicks:0,impressions:0,issues:[],updatedAt:new Date().toISOString()});
  ui.alert('照合を開始しました。「元データ数値照合を続行」で最初の5日を確認してください。');
 }catch(e){ui.alert('照合開始エラー：'+String(e.message||e));}
}
function sssDM365ReconCsvTotals_(blob,expectedDay){
 const rows=Utilities.parseCsv(blob.getDataAsString('UTF-8'));
 if(!rows.length||rows[0].join('|')!=='date|page|clicks|impressions|ctr|position')throw new Error('CSVヘッダー不一致: '+expectedDay);
 let count=0,clicks=0,impressions=0;const keys=new Set();
 for(let i=1;i<rows.length;i++){
  const r=rows[i];if(r.length===1&&r[0]==='')continue;
  if(r.length!==6||r[0]!==expectedDay||!r[1])throw new Error('CSV日付・列数不一致: '+expectedDay+' 行'+i);
  if(keys.has(r[1]))throw new Error('同日ページ重複: '+expectedDay);keys.add(r[1]);
  const c=Number(r[2]),im=Number(r[3]);
  if(!Number.isSafeInteger(c)||!Number.isSafeInteger(im)||c<0||im<0||c>im)throw new Error('クリック・表示回数不正: '+expectedDay);
  count++;clicks+=c;impressions+=im;
 }
 return {rows:count,clicks,impressions};
}
function sssContinueDM365SourceReconcile(silent){
 const ui=silent?null:SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();
 if(!lock.tryLock(1000)){if(ui)ui.alert('他の処理が実行中です。');return;}
 try{
  const s=sssDM365ReconState_(),m=sssDM365State_(),a=sssDM365AuditState_();
  if(!s||s.status!=='RUNNING')throw new Error('実行中の数値照合がありません。');
  if(!m||m.status!=='COMPLETED'||!a||a.status!=='PASSED'||s.signature!==m.signature||s.indexId!==m.indexId||s.siteId!==m.siteId)throw new Error('統合・監査状態が変わりました。');
  const idx=sssDM365AuditIndex_(m),p=sssDM365Plan_().p;
  const selected=p.selectedFiles.slice().sort((x,y)=>x.day.localeCompare(y.day));
  if(sssDM365Signature_(selected)!==m.signature)throw new Error('正本選択が変更されています。');
  const part=idx.parts[s.next];if(!part||s.next>=73)throw new Error('照合進捗不正');
  const output=DriveApp.getFileById(part.fileId);
  if(output.isTrashed()||output.getName()!==part.name)throw new Error('統合ZIPが変更されています。');
  const b=Utilities.unzip(output.getBlob()),csv=b.filter(x=>x.getName()==='daily_page.csv');
  if(b.length!==2||csv.length!==1)throw new Error('統合ZIP構造不正');
  const merged=Utilities.parseCsv(csv[0].getDataAsString('UTF-8'));
  if(!merged.length||merged[0].join('|')!=='date|page|clicks|impressions|ctr|position')throw new Error('統合CSVヘッダー不正');
  const outputDays={};for(let i=1;i<merged.length;i++){
   const r=merged[i];if(r.length===1&&r[0]==='')continue;
   if(r.length!==6||!r[0]||!r[1])throw new Error('統合CSV行不正');
   const d=outputDays[r[0]]||(outputDays[r[0]]={rows:0,clicks:0,impressions:0,keys:new Set()});
   if(d.keys.has(r[1]))throw new Error('統合CSV重複: '+r[0]);d.keys.add(r[1]);
   const c=Number(r[2]),im=Number(r[3]);if(!Number.isSafeInteger(c)||!Number.isSafeInteger(im)||c<0||im<0||c>im)throw new Error('統合CSV数値不正');
   d.rows++;d.clicks+=c;d.impressions+=im;
  }
  const slice=selected.slice(s.next*5,s.next*5+part.days);
  if(slice.length!==part.days||Object.keys(outputDays).length!==slice.length)throw new Error('統合日数不一致');
  let totalRows=0,totalClicks=0,totalImpressions=0;
  for(const item of slice){
   const source=DriveApp.getFileById(item.id);
   if(source.isTrashed()||source.getName()!==item.zip)throw new Error('元ZIPが変更されています: '+item.day);
   const checked=sssD365InspectFile_(source,sssConfig_(),m.start,m.end);
   if(!checked||checked[3]!=='OK'||checked[0]!==item.day||checked[6]!==item.fingerprint)throw new Error('元ZIPのFingerprint検証失敗: '+item.day);
   const bs=Utilities.unzip(source.getBlob()),sourceCsv=bs.filter(x=>x.getName()==='daily_page.csv');
   if(sourceCsv.length!==1)throw new Error('元ZIPにCSVがありません: '+item.day);
   const orig=sssDM365ReconCsvTotals_(sourceCsv[0],item.day),dst=outputDays[item.day];
   if(!dst||orig.rows!==dst.rows||orig.clicks!==dst.clicks||orig.impressions!==dst.impressions)throw new Error('日別数値不一致: '+item.day+' 元='+JSON.stringify(orig)+' 統合='+JSON.stringify(dst||null));
   totalRows+=orig.rows;totalClicks+=orig.clicks;totalImpressions+=orig.impressions;
  }
  if(totalRows!==part.rows||totalClicks!==part.clicks||totalImpressions!==part.impressions)throw new Error('分割ZIP索引との数値不一致');
  s.next++;s.days+=slice.length;s.rows+=totalRows;s.clicks+=totalClicks;s.impressions+=totalImpressions;s.updatedAt=new Date().toISOString();
  if(s.next===73){if(s.days!==365||s.rows!==idx.rows||s.clicks!==idx.clicks||s.impressions!==idx.impressions)throw new Error('全体索引との数値不一致');s.status='PASSED';}
  sssDM365ReconSave_(s);
  if(s.status==='PASSED')sssDM365ReconRemoveAutoTriggers_();
  if(ui)ui.alert('元データ数値照合：'+s.status+'\n検証：'+s.next+'/73件\n日数：'+s.days+'/365日\n行数：'+s.rows+'\nクリック：'+s.clicks+'\n表示回数：'+s.impressions+'\n元Evidence・統合ZIPは変更していません。');
 }catch(e){const s=sssDM365ReconState_();if(s){s.status='HOLD';s.issues.push(String(e.message||e).slice(0,500));s.updatedAt=new Date().toISOString();sssDM365ReconSave_(s);}if(silent)sssDM365ReconRemoveAutoTriggers_();if(ui)ui.alert('元データ数値照合 HOLD：'+String(e.message||e));else console.error('Source reconciliation HOLD: '+String(e.stack||e));}
 finally{lock.releaseLock();}
}
function sssShowDM365SourceReconcile(){
 const s=sssDM365ReconState_();SpreadsheetApp.getUi().alert(s?'365日Detailed元データ数値照合\n状態：'+s.status+'\n検証：'+s.next+'/73件\n日数：'+s.days+'/365日\nエラー：'+(s.issues.join(' / ')||'なし'):'数値照合は未開始です。');
}

// v0.1.50: Resume existing reconciliation from checkpoint with a dedicated trigger.
const SSS_DM365_RECON_AUTO_HANDLER_='sssDM365ReconAutoTick';
function sssDM365ReconAutoTriggers_(){return ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()===SSS_DM365_RECON_AUTO_HANDLER_);}
function sssDM365ReconRemoveAutoTriggers_(){sssDM365ReconAutoTriggers_().forEach(t=>ScriptApp.deleteTrigger(t));}
function sssEnableDM365ReconAuto(){
 const ui=SpreadsheetApp.getUi();try{
  const s=sssDM365ReconState_(),m=sssDM365State_(),a=sssDM365AuditState_();
  if(!s||s.status!=='RUNNING'||s.next<1||s.next>=73)throw new Error('継続可能な数値照合がありません。開始メニューを再実行しないでください。');
  if(!m||m.status!=='COMPLETED'||!a||a.status!=='PASSED'||s.signature!==m.signature||s.indexId!==m.indexId||s.siteId!==m.siteId)throw new Error('統合・監査状態が変わりました。');
  if(ui.alert('365日Detailed元データ数値照合を自動継続','検証済み '+s.next+'/73件から、約5分ごとに最大1件ずつ照合します。進捗を初期化しません。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  sssDM365ReconRemoveAutoTriggers_();
  ScriptApp.newTrigger(SSS_DM365_RECON_AUTO_HANDLER_).timeBased().everyMinutes(5).create();
  ui.alert('自動数値照合を設定しました。'+s.next+'/73件から再開します。');
 }catch(e){ui.alert('自動照合設定エラー：'+String(e.message||e));}
}
function sssDM365ReconAutoTick(){
 const s=sssDM365ReconState_();
 if(!s||s.status!=='RUNNING'){sssDM365ReconRemoveAutoTriggers_();return;}
 sssContinueDM365SourceReconcile(true);
}
function sssStopDM365ReconAuto(){
 const ui=SpreadsheetApp.getUi();
 if(ui.alert('自動数値照合を停止','数値照合専用トリガーのみ削除します。照合済み進捗は保持します。停止しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
 sssDM365ReconRemoveAutoTriggers_();ui.alert('自動照合を停止しました。進捗は保持しています。');
}
function sssShowDM365ReconAuto(){
 const s=sssDM365ReconState_(),n=sssDM365ReconAutoTriggers_().length;
 SpreadsheetApp.getUi().alert('365日Detailed元データ数値照合 自動実行\n状態：'+(s?s.status:'未開始')+'\n検証：'+(s?s.next:0)+'/73件\n日数：'+(s?s.days:0)+'/365日\n専用トリガー：'+n+'件\nエラー：'+(s&&s.issues&&s.issues.length?s.issues.join(' / '):'なし'));
}


// v0.1.51: Bounded period aggregation, one verified merged chunk per invocation.
// Intermediate page totals are saved separately; final cross-chunk reduction is NOT yet implemented.
const SSS_PERIOD51_KEY_='SSS_PERIOD_051_V1';
function sssPeriod51State_(){const v=sssProperties_().getProperty(SSS_PERIOD51_KEY_);return v?JSON.parse(v):null;}
function sssPeriod51Save_(s){sssProperties_().setProperty(SSS_PERIOD51_KEY_,JSON.stringify(s));}
function sssPeriod51Folder_(){return sssDriveChild_(sssDM365Folder_(),'PeriodAnalysis');}
function sssPeriod51Start(){
 const ui=SpreadsheetApp.getUi();try{
  const m=sssDM365State_(),a=sssDM365AuditState_(),r=sssDM365ReconState_();
  if(!m||m.status!=='COMPLETED'||!a||a.status!=='PASSED'||!r||r.status!=='PASSED'||r.next!==73||r.signature!==m.signature||r.indexId!==m.indexId)throw new Error('365日統合・監査・元データ照合がすべてPASSEDである必要があります。');
  sssDM365AuditIndex_(m);
  const old=sssPeriod51State_();if(old&&old.status==='RUNNING')throw new Error('集計が進行中です。続行を使用してください。');
  if(ui.alert('30・90・365日集計（第1段階）','73件のZIPを1件ずつ読み、期間別・ページ別の中間集計ZIPを別保存します。元データは変更しません。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  sssPeriod51Save_({status:'RUNNING',signature:m.signature,indexId:m.indexId,siteId:m.siteId,next:0,parts:[],totals:{'30':{rows:0,clicks:0,impressions:0,weighted:0},'90':{rows:0,clicks:0,impressions:0,weighted:0},'365':{rows:0,clicks:0,impressions:0,weighted:0}},updatedAt:new Date().toISOString(),error:''});
  ui.alert('期間別集計を開始しました。続行メニューで最初の分割ZIPを処理してください。');
 }catch(e){ui.alert('期間別集計開始エラー：'+String(e.message||e));}
}
function sssPeriod51Continue(){return sssPeriod52Continue_(false);}
function sssPeriod52Continue_(automatic){
 const ui=automatic?null:SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();if(!lock.tryLock(1000)){if(!automatic)ui.alert('他の処理が実行中です。');return;}
 try{
  const s=sssPeriod51State_(),m=sssDM365State_(),r=sssDM365ReconState_();
  if(!s||s.status!=='RUNNING'||!m||m.status!=='COMPLETED'||!r||r.status!=='PASSED'||s.signature!==m.signature||s.indexId!==m.indexId||s.siteId!==m.siteId)throw new Error('集計状態または検証済み元データが変わりました。');
  const idx=sssDM365AuditIndex_(m),part=idx.parts[s.next];if(!part)throw new Error('分割ZIPの進捗が不正です。');
  const source=DriveApp.getFileById(part.fileId);if(source.isTrashed()||source.getName()!==part.name)throw new Error('統合ZIPが見つかりません。');
  const blobs=Utilities.unzip(source.getBlob()),csv=blobs.filter(b=>b.getName()==='daily_page.csv');if(blobs.length!==2||csv.length!==1)throw new Error('統合ZIP構造が不正です。');
  const rows=Utilities.parseCsv(csv[0].getDataAsString('UTF-8'));
  if(!rows.length||rows[0].join('|')!=='date|page|clicks|impressions|ctr|position')throw new Error('CSVヘッダー不一致');
  const end=new Date(m.end+'T00:00:00Z');if(isNaN(end.getTime()))throw new Error('終了日が不正です。');
  const windows=[30,90,365].map(days=>({days,start:new Date(end.getTime()-(days-1)*86400000).toISOString().slice(0,10)}));
  const pages={},totals={};windows.forEach(w=>{pages[w.days]=new Map();totals[w.days]={rows:0,clicks:0,impressions:0,weighted:0};});
  for(let i=1;i<rows.length;i++){
   const x=rows[i];if(x.length===1&&x[0]==='')continue;
   if(x.length!==6||!/^\d{4}-\d{2}-\d{2}$/.test(x[0])||!x[1])throw new Error('CSV行不正: '+i);
   const clicks=Number(x[2]),im=Number(x[3]),pos=Number(x[5]);if(!Number.isSafeInteger(clicks)||!Number.isSafeInteger(im)||clicks<0||im<clicks||!Number.isFinite(pos)||pos<0)throw new Error('数値不正: '+i);
   for(const w of windows){if(x[0]<w.start||x[0]>m.end)continue;
    const t=totals[w.days];t.rows++;t.clicks+=clicks;t.impressions+=im;t.weighted+=pos*im;
    const map=pages[w.days],v=map.get(x[1])||{rows:0,clicks:0,impressions:0,weighted:0};v.rows++;v.clicks+=clicks;v.impressions+=im;v.weighted+=pos*im;map.set(x[1],v);
   }
  }
  const folder=sssPeriod51Folder_(),name='S3_Period51_'+s.signature.slice(0,12)+'_part_'+String(s.next+1).padStart(3,'0')+'.zip';
  if(sssDM365Find_(folder,name))throw new Error('同名の中間ZIPが既にあります。重複作成防止のため停止します: '+name);
  const files=[];for(const w of windows){const data=[['page','rows','clicks','impressions','position_weighted_sum']];
   [...pages[w.days].entries()].sort((a,b)=>a[0].localeCompare(b[0])).forEach(([page,v])=>data.push([page,v.rows,v.clicks,v.impressions,v.weighted]));
   files.push(Utilities.newBlob(data.map(row=>row.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n','text/csv','pages_'+w.days+'.csv'));
  }
  const manifest={schema:'s3.period51.partial.v1',siteId:s.siteId,sourceSignature:s.signature,batch:s.next,sourceFileId:part.fileId,periodEnd:m.end,totals,scope:'PARTIAL_NOT_FINAL',createdAt:new Date().toISOString()};
  files.push(Utilities.newBlob(JSON.stringify(manifest),'application/json','manifest.json'));
  const created=folder.createFile(Utilities.zip(files,name));
  s.parts.push({batch:s.next,fileId:created.getId(),name});
  windows.forEach(w=>{const t=s.totals[w.days],v=totals[w.days];t.rows+=v.rows;t.clicks+=v.clicks;t.impressions+=v.impressions;t.weighted+=v.weighted;});
  s.next++;s.updatedAt=new Date().toISOString();if(s.next===73)s.status='PARTIALS_COMPLETED';sssPeriod51Save_(s);
  if(s.status==='PARTIALS_COMPLETED')sssPeriod52RemoveTriggers_();
  if(!automatic)ui.alert('期間別中間集計：'+s.status+'\n処理済み：'+s.next+'/73件\n中間ZIP：'+s.parts.length+'件\n保存先：Evidence / DetailedMerged / PeriodAnalysis\n※ページ別の全期間統合は次工程です。');
 }catch(e){const s=sssPeriod51State_();if(s){s.status='HOLD';s.error=String(e.message||e).slice(0,400);sssPeriod51Save_(s);}sssPeriod52RemoveTriggers_();if(!automatic)ui.alert('期間別集計 HOLD：'+String(e.message||e));else console.error('期間別集計 HOLD：'+String(e.stack||e));}
 finally{lock.releaseLock();}
}
function sssPeriod51Status(){const s=sssPeriod51State_();SpreadsheetApp.getUi().alert(s?'期間別集計（第1段階）\n状態：'+s.status+'\n進捗：'+s.next+'/73件\n中間ZIP：'+s.parts.length+'件\nエラー：'+(s.error||'なし'):'期間別集計は未開始です。');}

// v0.1.52: only the dedicated period-partial trigger is managed.
function sssPeriod52Triggers_(){return ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='sssPeriod52Tick');}
function sssPeriod52RemoveTriggers_(){sssPeriod52Triggers_().forEach(t=>ScriptApp.deleteTrigger(t));}
function sssPeriod52StartAuto(){
 const ui=SpreadsheetApp.getUi();try{
  const s=sssPeriod51State_(),m=sssDM365State_(),r=sssDM365ReconState_();
  if(!s||s.status!=='RUNNING'||s.next<1||s.next>=73||s.parts.length!==s.next)throw new Error('1/73件以降のRUNNING状態が必要です。開始メニューは再実行しないでください。');
  if(!m||m.status!=='COMPLETED'||!r||r.status!=='PASSED'||s.signature!==m.signature||s.indexId!==m.indexId||s.siteId!==m.siteId)throw new Error('検証済みEvidenceの識別情報が一致しません。');
  if(ui.alert('中間集計を自動継続','既存の'+s.next+'/73件から約5分間隔で再開します。元Evidenceと統合ZIPは変更しません。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  const old=sssPeriod52Triggers_();if(old.length>1)throw new Error('専用トリガーが重複しています。監査してから再開してください。');
  if(!old.length)ScriptApp.newTrigger('sssPeriod52Tick').timeBased().everyMinutes(5).create();
  ui.alert('中間集計の自動継続を設定しました。進捗：'+s.next+'/73件、専用トリガー：'+sssPeriod52Triggers_().length+'件');
 }catch(e){ui.alert('自動継続設定エラー：'+String(e.message||e));}
}
function sssPeriod52Tick(){
 const s=sssPeriod51State_();if(!s||s.status!=='RUNNING'){sssPeriod52RemoveTriggers_();return;}
 sssPeriod52Continue_(true);
}
function sssPeriod52Status(){
 const s=sssPeriod51State_();SpreadsheetApp.getUi().alert('期間別中間集計 自動実行\n状態：'+(s?s.status:'未開始')+'\n進捗：'+(s?s.next:0)+'/73件\n中間ZIP：'+(s?s.parts.length:0)+'件\n専用トリガー：'+sssPeriod52Triggers_().length+'件\nエラー：'+(s&&s.error?s.error:'なし'));
}
function sssPeriod52StopAuto(){
 const ui=SpreadsheetApp.getUi();if(ui.alert('自動継続を停止','専用トリガーのみ削除し、進捗を保持します。停止しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
 sssPeriod52RemoveTriggers_();ui.alert('自動継続を停止しました。中間ZIPと進捗は保持しています。');
}


// v0.1.54: hierarchical bounded reduction; no source ZIP is changed.
// Each invocation reduces up to four input ZIPs to one output ZIP.
const SSS_P53_KEY_='SSS_PERIOD_053_V1';
function sssP53Get_(){const x=sssProperties_().getProperty(SSS_P53_KEY_);return x?JSON.parse(x):null;}
function sssP53Put_(x){sssProperties_().setProperty(SSS_P53_KEY_,JSON.stringify(x));}
function sssP53Folder_(){return sssDriveChild_(sssPeriod51Folder_(),'FinalReduction');}
function sssP53Start(){
 const ui=SpreadsheetApp.getUi();try{
  const p=sssPeriod51State_(),m=sssDM365State_(),r=sssDM365ReconState_();
  if(!p||p.status!=='PARTIALS_COMPLETED'||p.next!==73||p.parts.length!==73||!m||m.status!=='COMPLETED'||!r||r.status!=='PASSED'||p.signature!==m.signature||p.indexId!==m.indexId)throw new Error('73件の中間集計と元データ照合の完了が必要です。');
  const old=sssP53Get_();if(old&&old.status==='RUNNING')throw new Error('統合が進行中です。続行を使用してください。');
  if(ui.alert('ページ別最終統合（試験）','73件の中間ZIPを4件以下ずつ階層的に集約します。元データ・中間ZIPは変更しません。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  sssP53Put_({status:'RUNNING',signature:p.signature,siteId:p.siteId,indexId:p.indexId,round:0,next:0,inputs:p.parts.map(z=>({id:z.fileId,name:z.name})),outputs:[],totalMs:0,steps:0,error:'',lastTiming:null,updatedAt:new Date().toISOString()});
  ui.alert('統合を開始しました。続行メニューを実行してください。');
 }catch(e){ui.alert('統合開始エラー：'+String(e.message||e));}
}
function sssP53Read_(ref,signature,siteId){
 const file=DriveApp.getFileById(ref.id);if(file.isTrashed()||file.getName()!==ref.name)throw new Error('入力ZIP不一致: '+ref.name);
 const blobs=Utilities.unzip(file.getBlob()),by={};blobs.forEach(b=>{if(by[b.getName()])throw new Error('ZIP内ファイル重複');by[b.getName()]=b;});
 if(blobs.length!==4||!by['manifest.json'])throw new Error('ZIP構造不正: '+ref.name);
 const mf=JSON.parse(by['manifest.json'].getDataAsString('UTF-8'));
 if(mf.siteId!==siteId||mf.sourceSignature!==signature||!['s3.period51.partial.v1','s3.period53.reduced.v1'].includes(mf.schema))throw new Error('manifest不一致: '+ref.name);
 const maps={},totals={};
 for(const d of [30,90,365]){
  const blob=by['pages_'+d+'.csv'];if(!blob)throw new Error('CSV欠落');
  const rows=Utilities.parseCsv(blob.getDataAsString('UTF-8'));
  if(!rows.length||rows[0].join('|')!=='page|rows|clicks|impressions|position_weighted_sum')throw new Error('CSVヘッダー不正');
  const map=new Map(),sum={rows:0,clicks:0,impressions:0,weighted:0};
  for(let i=1;i<rows.length;i++){
   const x=rows[i];if(x.length===1&&x[0]==='')continue;
   if(x.length!==5||!x[0]||map.has(x[0]))throw new Error('ページ重複・CSV行不正');
   const n=x.slice(1).map(Number);if(!n.every(Number.isFinite)||n.slice(0,3).some(v=>!Number.isSafeInteger(v)||v<0)||n[2]<n[1]||n[3]<0)throw new Error('数値不正');
   const v={rows:n[0],clicks:n[1],impressions:n[2],weighted:n[3]};map.set(x[0],v);
   for(const k of ['rows','clicks','impressions','weighted'])sum[k]+=v[k];
  }
  const expected=mf.totals&&mf.totals[String(d)];
  if(!expected||['rows','clicks','impressions'].some(k=>sum[k]!==expected[k])||Math.abs(sum.weighted-expected.weighted)>Math.max(0.001,Math.abs(expected.weighted)*1e-10))throw new Error('manifest集計値不一致: '+ref.name+' '+d);
  maps[d]=map;totals[d]=sum;
 }
 return {maps,totals};
}
function sssP53Continue(){sssP53Continue_(false);}
function sssP53Continue_(silent){
 const ui=silent?null:SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();if(!lock.tryLock(1000)){if(!silent)ui.alert('他の処理が実行中です。');return false;}
 let s;try{
  s=sssP53Get_();const p=sssPeriod51State_(),m=sssDM365State_(),r=sssDM365ReconState_();
  if(!s||s.status!=='RUNNING'||!p||p.status!=='PARTIALS_COMPLETED'||!m||m.status!=='COMPLETED'||!r||r.status!=='PASSED'||s.signature!==p.signature||s.indexId!==p.indexId)throw new Error('照合済みデータまたは統合状態が変わりました。');
  const start=Date.now(),readStart=Date.now(),batch=s.inputs.slice(s.next,s.next+4);if(!batch.length)throw new Error('入力位置が不正です。');
  const maps={30:new Map(),90:new Map(),365:new Map()},totals={};for(const d of [30,90,365])totals[d]={rows:0,clicks:0,impressions:0,weighted:0};
  for(const ref of batch){const data=sssP53Read_(ref,s.signature,s.siteId);for(const d of [30,90,365]){
   for(const [page,v] of data.maps[d]){const map=maps[d],a=map.get(page)||{rows:0,clicks:0,impressions:0,weighted:0};for(const k of ['rows','clicks','impressions','weighted'])a[k]+=v[k];map.set(page,a);}
   for(const k of ['rows','clicks','impressions','weighted'])totals[d][k]+=data.totals[d][k];
  }}
  const readMs=Date.now()-readStart,encodeStart=Date.now(),blobs=[];
  for(const d of [30,90,365]){const lines=[['page','rows','clicks','impressions','position_weighted_sum']];
   [...maps[d]].sort((a,b)=>a[0].localeCompare(b[0])).forEach(([page,v])=>lines.push([page,v.rows,v.clicks,v.impressions,v.weighted]));
   blobs.push(Utilities.newBlob(lines.map(row=>row.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\r\n')+'\r\n','text/csv','pages_'+d+'.csv'));
  }
  const mf={schema:'s3.period53.reduced.v1',version:SSS_VERSION,siteId:s.siteId,sourceSignature:s.signature,round:s.round,batch:s.next,inputs:batch,totals,createdAt:new Date().toISOString()};
  blobs.push(Utilities.newBlob(JSON.stringify(mf),'application/json','manifest.json'));
  const encodeMs=Date.now()-encodeStart,saveStart=Date.now(),folder=sssP53Folder_();
  const name='S3_Period53_'+s.signature.slice(0,12)+'_r'+s.round+'_b'+String(s.next).padStart(3,'0')+'.zip';
  if(sssDM365Find_(folder,name))throw new Error('同名ZIPがあります。重複作成を防ぐため停止: '+name);
  const file=folder.createFile(Utilities.zip(blobs,name));const saveMs=Date.now()-saveStart;
  s.outputs.push({id:file.getId(),name});s.next+=batch.length;s.steps++;s.totalMs+=Date.now()-start;
  s.lastTiming={inputs:batch.length,readMs,encodeMs,saveMs,totalMs:Date.now()-start};
  if(s.next===s.inputs.length){if(s.outputs.length===1){
   const result=sssP53Read_(s.outputs[0],s.signature,s.siteId);
   for(const d of [30,90,365])for(const k of ['rows','clicks','impressions'])if(result.totals[d][k]!==p.totals[String(d)][k])throw new Error('最終合計不一致: '+d+' '+k);
   s.status='COMPLETED';s.final=s.outputs[0];
  }else{s.inputs=s.outputs;s.outputs=[];s.next=0;s.round++;}}
  s.updatedAt=new Date().toISOString();sssP53Put_(s);
  if(!silent)ui.alert('ページ別統合：'+s.status+'\n段階：'+s.round+'\n進捗：'+s.next+'/'+s.inputs.length+'件\n最終ZIP：'+(s.final?s.final.name:'未生成')+'\n今回：'+s.lastTiming.totalMs+'ms（読込 '+readMs+' / CSV '+encodeMs+' / 保存 '+saveMs+'）\n※元Evidence・中間ZIPは変更しません。');
  return true;
 }catch(e){if(s){s.status='HOLD';s.error=String(e.message||e).slice(0,500);sssP53Put_(s);}sssP55RemoveTriggers_();if(!silent)ui.alert('ページ別統合 HOLD：'+String(e.message||e));return false;}
 finally{lock.releaseLock();}
}
function sssP53Status(){const s=sssP53Get_();SpreadsheetApp.getUi().alert(!s?'未開始':'ページ別統合\n状態：'+s.status+'\n段階：'+s.round+'\n進捗：'+s.next+'/'+s.inputs.length+'件\n総実行時間：'+(s.totalMs/1000).toFixed(1)+'秒\n直近処理時間：'+JSON.stringify(s.lastTiming)+'\n最終ZIP：'+(s.final?s.final.name:'未生成')+'\nエラー：'+(s.error||'なし'));}


// v0.1.57: time-budgeted automatic continuation. One minute timer is a wake-up,
// not a five-minute wait per input. Never resets the existing P53 checkpoint.
const SSS_P55_MAX_RUN_MS_=210000;
const SSS_P55_MAX_STEPS_=24;
function sssP55Triggers_(){return ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='sssP55Tick');}
function sssP55RemoveTriggers_(){sssP55Triggers_().forEach(t=>ScriptApp.deleteTrigger(t));}
function sssP55StartAuto(){
 const ui=SpreadsheetApp.getUi();try{
  const s=sssP53Get_();if(!s||s.status!=='RUNNING'||s.steps<1)throw new Error('最初の手動統合を完了したRUNNING状態が必要です。');
  const triggers=sssP55Triggers_();if(triggers.length>1)throw new Error('専用トリガーが重複しています。');
  if(ui.alert('ページ別統合を高速自動継続','現在の進捗を保持し、1回の起動で安全な時間内に複数バッチを処理します。専用トリガーは約1分間隔です。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  if(!triggers.length)ScriptApp.newTrigger('sssP55Tick').timeBased().everyMinutes(1).create();
  ui.alert('自動継続を設定しました。進捗は既存のチェックポイントから再開します。');
 }catch(e){ui.alert('自動継続設定エラー：'+String(e.message||e));}
}
function sssP55Tick(){
 const begin=Date.now();let steps=0;
 try{
  while(steps<SSS_P55_MAX_STEPS_){
   const s=sssP53Get_();if(!s||s.status!=='RUNNING'){sssP55RemoveTriggers_();return;}
   // Stop before another batch when time is insufficient; do not start
   // a potentially expensive batch near the Apps Script execution limit.
   const last=s.lastTiming&&s.lastTiming.totalMs||15000;
   if(Date.now()-begin+Math.max(30000,last*2)>SSS_P55_MAX_RUN_MS_)break;
   if(!sssP53Continue_(true)){const now=sssP53Get_();if(now&&now.status==='HOLD')sssP55RemoveTriggers_();return;}
   steps++;
  }
  const s=sssP53Get_();if(!s||s.status!=='RUNNING')sssP55RemoveTriggers_();
 }catch(e){const s=sssP53Get_();if(s){s.status='HOLD';s.error='自動実行: '+String(e.message||e).slice(0,450);sssP53Put_(s);}sssP55RemoveTriggers_();throw e;}
}
// v0.1.57: recover only the verified background-UI failure, preserving all progress.
function sssP56RecoverUiHold(){
 const ui=SpreadsheetApp.getUi();
 const lock=LockService.getDocumentLock();
 if(!lock.tryLock(5000)){ui.alert('他の処理が実行中です。後ほど再試行してください。');return;}
 try{
  const s=sssP53Get_();
  if(!s||s.status!=='HOLD'||!/^自動実行: Cannot call SpreadsheetApp\.getUi\(\) from this context\.?$/.test(String(s.error||''))){
   ui.alert('対象外の状態またはエラーです。既存状態を変更しません。');return;
  }
  if(s.round!==0||s.next!==4||s.steps!==1||!Array.isArray(s.outputs)||s.outputs.length!==1){
   ui.alert('進捗が想定と異なるため復旧を中止しました。');return;
  }
  const p=sssPeriod51State_(),m=sssDM365State_(),r=sssDM365ReconState_();
  if(!p||p.status!=='PARTIALS_COMPLETED'||!m||m.status!=='COMPLETED'||!r||r.status!=='PASSED'||s.signature!==p.signature||s.indexId!==p.indexId){
   ui.alert('データ整合条件が一致しないため復旧を中止しました。');return;
  }
  // Verify the already-written output before resuming; never overwrite a ZIP.
  sssP53Read_(s.outputs[0],s.signature,s.siteId);
  if(ui.alert('UI呼び出しエラーから復旧','4/73件のチェックポイントを維持してRUNNINGに戻します。再開後は「ページ別統合を高速自動継続（試験）」を実行してください。',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  s.status='RUNNING';s.error='';s.updatedAt=new Date().toISOString();sssP53Put_(s);
  ui.alert('復旧しました。進捗：4/73件。高速自動継続を開始してください。');
 }catch(e){ui.alert('復旧中止：'+String(e.message||e));}
 finally{lock.releaseLock();}
}
function sssP55Status(){const s=sssP53Get_();SpreadsheetApp.getUi().alert('高速自動ページ別統合\n状態：'+(s?s.status:'未開始')+'\n段階：'+(s?s.round:'-')+'\n進捗：'+(s?s.next+'/'+s.inputs.length:'-')+'\n累計処理：'+(s?s.steps:0)+'バッチ\n専用トリガー：'+sssP55Triggers_().length+'件\n最終ZIP：'+(s&&s.final?s.final.name:'未生成')+'\nエラー：'+(s&&s.error?s.error:'なし'));}
function sssP55StopAuto(){const ui=SpreadsheetApp.getUi();if(ui.alert('高速自動継続を停止','専用トリガーのみ削除します。処理済みZIPとチェックポイントは維持します。',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;sssP55RemoveTriggers_();ui.alert('専用トリガーを停止しました。進捗は保持されています。');}


// v0.1.59: read-only final period audit; no GSC calls, ZIP writes, or sheet writes.
// Scans all 73 original partial ZIPs independently, then compares to the final ZIP.
const SSS_P58_KEY_='SSS_PERIOD_058_AUDIT_V1';
function sssP58Get_(){const v=sssProperties_().getProperty(SSS_P58_KEY_);return v?JSON.parse(v):null;}
function sssP58Put_(s){sssProperties_().setProperty(SSS_P58_KEY_,JSON.stringify(s));}
function sssP58Blank_(){return {rows:0,clicks:0,impressions:0,weighted:0};}
function sssP58Compare_(a,b,where){
 for(const k of ['rows','clicks','impressions'])if(a[k]!==b[k])throw new Error(where+' '+k+' 不一致: '+a[k]+' / '+b[k]);
 if(Math.abs(a.weighted-b.weighted)>Math.max(0.01,Math.abs(b.weighted)*1e-9))throw new Error(where+' 掲載順位加重合計不一致');
}
function sssP58Prereq_(){
 const s=sssP53Get_(),p=sssPeriod51State_(),m=sssDM365State_(),r=sssDM365ReconState_();
 if(!s||s.status!=='COMPLETED'||!s.final||!p||p.status!=='PARTIALS_COMPLETED'||!Array.isArray(p.parts)||p.parts.length!==73||!m||m.status!=='COMPLETED'||!r||r.status!=='PASSED'||s.signature!==p.signature||s.signature!==m.signature||s.indexId!==p.indexId||s.indexId!==m.indexId||s.siteId!==p.siteId)throw new Error('照合済み73件・最終統合の完了条件が一致しません。');
 return {s,p};
}
function sssP58AuditStart(){
 const ui=SpreadsheetApp.getUi();try{
  const {s,p}=sssP58Prereq_();
  const existing=sssP58Get_();if(existing&&existing.status==='RUNNING')throw new Error('監査が進行中です。続行メニューを使用してください。');
  // Verify the final ZIP independently before opening an audit checkpoint.
  const final=sssP53Read_(s.final,s.signature,s.siteId);
  for(const d of [30,90,365])sssP58Compare_(final.totals[d],p.totals[String(d)],'最終ZIP vs 中間集計 '+d+'日');
  if(ui.alert('期間別最終ZIP品質監査','73件の中間ZIPを読取専用で再検証し、最終ZIPと集計値を照合します。最大5件ずつ実行します。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  const sums={};for(const d of [30,90,365])sums[d]=sssP58Blank_();
  sssP58Put_({status:'RUNNING',signature:s.signature,siteId:s.siteId,indexId:s.indexId,finalId:s.final.id,next:0,total:73,sums,error:'',updatedAt:new Date().toISOString()});
  ui.alert('監査を開始しました。最終ZIPの構造と集計値は一次検査合格です。続行してください。');
 }catch(e){ui.alert('監査開始中止：'+String(e.message||e));}
}
function sssP58AuditContinue(){
 const ui=SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();
 if(!lock.tryLock(1000)){ui.alert('他の処理が実行中です。');return;}
 let a;
 try{
  a=sssP58Get_();const {s,p}=sssP58Prereq_();
  if(!a||a.status!=='RUNNING'||a.signature!==s.signature||a.indexId!==s.indexId||a.finalId!==s.final.id)throw new Error('監査チェックポイントが不一致です。');
  const stop=Math.min(a.next+5,p.parts.length);
  for(let i=a.next;i<stop;i++){
   const part=p.parts[i];const ref={id:part.fileId,name:part.name};
   const data=sssP53Read_(ref,s.signature,s.siteId);
   for(const d of [30,90,365])for(const k of ['rows','clicks','impressions','weighted'])a.sums[d][k]+=data.totals[d][k];
   a.next=i+1;
  }
  if(a.next===p.parts.length){
   const final=sssP53Read_(s.final,s.signature,s.siteId);
   for(const d of [30,90,365]){
    sssP58Compare_(a.sums[d],p.totals[String(d)],'73件中間ZIP vs 集計記録 '+d+'日');
    sssP58Compare_(a.sums[d],final.totals[d],'73件中間ZIP vs 最終ZIP '+d+'日');
   }
   a.status='PASSED';
  }
  a.updatedAt=new Date().toISOString();sssP58Put_(a);
  ui.alert('期間別最終ZIP監査：'+a.status+'\n進捗：'+a.next+'/73件\n最終ZIP：'+s.final.name+'\nエラー：なし\n※元Evidence・中間ZIP・最終ZIPは変更していません。');
 }catch(e){if(a&&a.status==='RUNNING'){a.status='HOLD';a.error=String(e.message||e).slice(0,450);a.updatedAt=new Date().toISOString();sssP58Put_(a);}ui.alert('監査停止：'+String(e.message||e));}
 finally{lock.releaseLock();}
}
function sssP58AuditStatus(){const a=sssP58Get_();SpreadsheetApp.getUi().alert(!a?'期間別最終ZIP監査：未開始':'期間別最終ZIP監査\n状態：'+a.status+'\n進捗：'+a.next+'/'+a.total+'件\nエラー：'+(a.error||'なし')+'\n※読取専用監査です。');}


// v0.1.59: UI-free, time-budgeted continuation of the v0.1.59 read-only audit.
// All checkpoints are committed after each ZIP. No source or merged ZIP writes.
const SSS_P59_BUDGET_MS_=180000;
const SSS_P59_MAX_FILES_=24;
function sssP59Triggers_(){return ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='sssP59Tick');}
function sssP59RemoveTriggers_(){sssP59Triggers_().forEach(t=>ScriptApp.deleteTrigger(t));}
function sssP59Tick(){
 const lock=LockService.getDocumentLock();
 if(!lock.tryLock(1000))return;
 let a=null;
 try{
  a=sssP58Get_();
  if(!a||a.status!=='RUNNING'){sssP59RemoveTriggers_();return;}
  const {s,p}=sssP58Prereq_();
  if(a.signature!==s.signature||a.siteId!==s.siteId||a.indexId!==s.indexId||a.finalId!==s.final.id||a.total!==73||p.parts.length!==73||a.next<0||a.next>73)throw new Error('監査チェックポイントと元データが一致しません。');
  const start=Date.now();let count=0;
  while(a.next<73&&count<SSS_P59_MAX_FILES_&&Date.now()-start<SSS_P59_BUDGET_MS_){
   const part=p.parts[a.next];
   const data=sssP53Read_({id:part.fileId,name:part.name},s.signature,s.siteId);
   for(const d of [30,90,365])for(const k of ['rows','clicks','impressions','weighted'])a.sums[d][k]+=data.totals[d][k];
   a.next++;count++;a.updatedAt=new Date().toISOString();sssP58Put_(a);
  }
  if(a.next===73){
   const final=sssP53Read_(s.final,s.signature,s.siteId);
   for(const d of [30,90,365]){
    sssP58Compare_(a.sums[d],p.totals[String(d)],'73件中間ZIP vs 集計記録 '+d+'日');
    sssP58Compare_(a.sums[d],final.totals[d],'73件中間ZIP vs 最終ZIP '+d+'日');
   }
   a.status='PASSED';a.updatedAt=new Date().toISOString();sssP58Put_(a);
   sssP59RemoveTriggers_();
  }
 }catch(e){
  a=sssP58Get_();
  if(a&&a.status==='RUNNING'){a.status='HOLD';a.error='自動監査: '+String(e.message||e).slice(0,420);a.updatedAt=new Date().toISOString();sssP58Put_(a);}
  sssP59RemoveTriggers_();
  console.error('sssP59Tick: '+String(e&&e.stack||e));
 }finally{lock.releaseLock();}
}
function sssP59StartAuto(){
 const ui=SpreadsheetApp.getUi();
 try{
  const a=sssP58Get_(),pr=sssP58Prereq_();
  if(!a||a.status!=='RUNNING'||a.next<0||a.next>=73||a.total!==73||a.signature!==pr.s.signature||a.finalId!==pr.s.final.id)throw new Error('RUNNINGの監査チェックポイントが見つからないか不整合です。');
  if(sssP59Triggers_().length>1)throw new Error('専用トリガーが重複しています。');
  if(ui.alert('期間別最終ZIP品質監査を高速自動継続','現在の'+a.next+'/73件から再開します。既存ZIPは変更しません。開始しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
  if(!sssP59Triggers_().length)ScriptApp.newTrigger('sssP59Tick').timeBased().everyMinutes(1).create();
  ui.alert('高速自動監査を予約しました。進捗：'+a.next+'/73件。状態メニューで確認できます。');
 }catch(e){ui.alert('高速自動監査を開始できません：'+String(e.message||e));}
}
function sssP59Status(){
 const a=sssP58Get_();SpreadsheetApp.getUi().alert('期間別最終ZIP高速自動監査\n状態：'+(a?a.status:'未開始')+'\n進捗：'+(a?a.next+'/'+a.total:'-')+'件\n専用トリガー：'+sssP59Triggers_().length+'件\nエラー：'+(a&&a.error?a.error:'なし')+'\n元Evidence・中間ZIP・最終ZIPは変更しません。');
}
function sssP59StopAuto(){
 const ui=SpreadsheetApp.getUi();if(ui.alert('高速自動監査を停止','専用トリガーを削除します。監査進捗と既存ZIPは保持します。',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
 sssP59RemoveTriggers_();ui.alert('専用トリガーを停止しました。チェックポイントは保持されています。');
}


// v0.1.61: bound strategy preview storage to Apps Script property quota.
// v0.1.61: read-only site strategy diagnostic from audited period aggregates.
// No GSC API calls, ZIP writes, source mutation or UI use in background functions.
const SSS_P60_KEY_='SSS_PERIOD_060_STRATEGY_V1';
const SSS_P61_PROPERTY_LIMIT_=8500; // below the Apps Script 9KB per-value quota
function sssP60Get_(){const x=sssProperties_().getProperty(SSS_P60_KEY_);return x?JSON.parse(x):null;}
function sssP60Put_(x){
 // DocumentProperties has a 9KB per-value limit. Persist a bounded preview only.
 const data=JSON.parse(JSON.stringify(x));
 let payload=JSON.stringify(data);
 while(payload.length>SSS_P61_PROPERTY_LIMIT_ && data.top.length){
  data.top.pop();payload=JSON.stringify(data);
 }
 if(payload.length>SSS_P61_PROPERTY_LIMIT_)throw new Error('診断結果の保存サイズが上限を超えました。');
 sssProperties_().setProperty(SSS_P60_KEY_,payload);
 return data.top.length;
}
function sssP60Rate_(a,b){return b>0?a/b:null;}
function sssP60Metrics_(v){return {clicks:v.clicks,impressions:v.impressions,ctr:sssP60Rate_(v.clicks,v.impressions),position:sssP60Rate_(v.weighted,v.impressions)};}
function sssP60Diagnostic_(current,baseline){
 const c=sssP60Metrics_(current),b=sssP60Metrics_(baseline);
 const clickRate=b.clicks>0?c.clicks/(b.clicks/2):null; // 30d vs prior 60d normalized to 30d
 const impressionRate=b.impressions>0?c.impressions/(b.impressions/2):null;
 const positionDelta=c.position!==null&&b.position!==null?c.position-b.position:null;
 const ctrDelta=c.ctr!==null&&b.ctr!==null?c.ctr-b.ctr:null;
 const eligible=c.impressions>=100&&b.impressions>=200;
 const flags=[];
 if(eligible){
  if(clickRate!==null&&clickRate<=0.7)flags.push('CLICK_DECLINE');
  if(impressionRate!==null&&impressionRate<=0.7)flags.push('IMPRESSION_DECLINE');
  if(positionDelta!==null&&positionDelta>=3)flags.push('RANK_DECLINE');
  if(impressionRate!==null&&impressionRate>=1.3&&clickRate!==null&&clickRate>=1.2)flags.push('GROWTH');
  if(c.position!==null&&c.position>=3&&c.position<=15&&c.impressions>=300&&c.ctr<0.025)flags.push('CTR_OPPORTUNITY');
 }
 const priority=flags.includes('CLICK_DECLINE')||flags.includes('RANK_DECLINE')?'HIGH':flags.includes('IMPRESSION_DECLINE')||flags.includes('CTR_OPPORTUNITY')?'MEDIUM':flags.includes('GROWTH')?'GROWTH':'WATCH';
 return {current:c,baseline60:b,clickRate,impressionRate,positionDelta,ctrDelta,eligible,flags,priority};
}
function sssP60BuildStrategy(){
 const ui=SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();
 if(!lock.tryLock(1000)){ui.alert('別の処理が実行中です。');return;}
 try{
  const audit=sssP58Get_(),reduction=sssP53Get_(),partial=sssPeriod51State_();
  if(!audit||audit.status!=='PASSED'||audit.next!==73||!reduction||reduction.status!=='COMPLETED'||!reduction.final||!partial||partial.status!=='PARTIALS_COMPLETED'||audit.signature!==reduction.signature||audit.finalId!==reduction.final.id||partial.signature!==reduction.signature)throw new Error('最終ZIP品質監査 PASSED と対象データの整合が必要です。');
  const file=DriveApp.getFileById(reduction.final.id);
  if(file.isTrashed()||file.getName()!==reduction.final.name)throw new Error('最終ZIPの参照が変わりました。');
  const result=sssP53Read_(reduction.final,reduction.signature,reduction.siteId);
  const current=result.maps[30],ninety=result.maps[90];
  const diagnostics=[],totals={current:{rows:0,clicks:0,impressions:0,weighted:0},baseline:{rows:0,clicks:0,impressions:0,weighted:0}};
  const keys=new Set([...current.keys(),...ninety.keys()]);
  for(const page of keys){
   const c=current.get(page)||sssP58Blank_(),n=ninety.get(page)||sssP58Blank_();
   const b={rows:n.rows-c.rows,clicks:n.clicks-c.clicks,impressions:n.impressions-c.impressions,weighted:n.weighted-c.weighted};
   if(b.rows<0||b.clicks<0||b.impressions<0||b.impressions<b.clicks||b.weighted< -0.001)throw new Error('30日と90日の差分が不正です: '+page);
   const d=sssP60Diagnostic_(c,b);diagnostics.push({page,...d});
   for(const k of ['rows','clicks','impressions','weighted']){totals.current[k]+=c[k];totals.baseline[k]+=b[k];}
  }
  for(const k of ['rows','clicks','impressions']){
   if(totals.current[k]!==result.totals[30][k]||totals.current[k]+totals.baseline[k]!==result.totals[90][k])throw new Error('集計照合不一致: '+k);
  }
  const rank={HIGH:0,MEDIUM:1,GROWTH:2,WATCH:3};
  diagnostics.sort((a,b)=>rank[a.priority]-rank[b.priority]||b.current.clicks-a.current.clicks||a.page.localeCompare(b.page));
  const counts={HIGH:0,MEDIUM:0,GROWTH:0,WATCH:0};diagnostics.forEach(x=>counts[x.priority]++);
  const output={schema:'s3.strategy.preview.v1',status:'READY',siteId:reduction.siteId,signature:reduction.signature,finalId:reduction.final.id,periodEnd:partial.periodEnd||sssDM365State_().end,generatedAt:new Date().toISOString(),counts,pageCount:diagnostics.length,totals,top:diagnostics.slice(0,12).map(x=>({page:x.page,priority:x.priority,flags:x.flags,current:x.current,baseline60:x.baseline60,clickRate:x.clickRate,impressionRate:x.impressionRate,positionDelta:x.positionDelta})),limitations:['30日と直前60日を日数補正して比較。季節性・検索需要変化は未調整。','平均順位はページ内の表示回数加重平均。クエリ構成の変化による影響を含む。','CTR改善候補は探索的な閾値判定であり改善効果の保証ではない。','この診断は保存済みZIPを読み取るのみ。サイトや記事は更新しない。']};
  // Keep property size bounded; never persist all page-level records.
  const savedCount=sssP60Put_(output);
  ui.alert('サイト戦略診断（読取専用）\n状態：READY\nページ数：'+output.pageCount+'\n優先確認：'+counts.HIGH+'件\n改善機会：'+counts.MEDIUM+'件\n成長候補：'+counts.GROWTH+'件\n経過観察：'+counts.WATCH+'件\n上位'+savedCount+'件を保存しました。結果確認メニューをご利用ください。\n※これは探索的診断です。');
 }catch(e){ui.alert('サイト戦略診断を生成できませんでした：'+String(e.message||e));}
 finally{lock.releaseLock();}
}
// v0.1.62: Japanese diagnostic explanation and auditable 30d-equivalent metrics.
// Presentation-only change: no recomputation, source writes, or automatic article edits.
function sssP62Num_(n,d){return typeof n==='number'&&isFinite(n)?n.toLocaleString('ja-JP',{minimumFractionDigits:d===undefined?0:d,maximumFractionDigits:d===undefined?0:d}):'データ不足';}
function sssP62Pct_(n){return typeof n==='number'&&isFinite(n)?(n*100).toFixed(2)+'%':'データ不足';}
function sssP62Label_(x){return ({HIGH:'優先確認',MEDIUM:'改善機会',GROWTH:'成長候補',WATCH:'経過観察'})[x]||'判定保留';}
function sssP62Reasons_(flags){
 const map={CLICK_DECLINE:'クリック数が減少',IMPRESSION_DECLINE:'表示回数が減少',RANK_DECLINE:'平均掲載順位が低下',GROWTH:'クリック数と表示回数が増加',CTR_OPPORTUNITY:'CTR改善余地の候補'};
 return (flags||[]).map(x=>map[x]||'未定義の診断コード').join('／')||'特記事項なし';
}
function sssP62Advice_(x){
 const f=x.flags||[];
 if(f.includes('IMPRESSION_DECLINE'))return '検索需要・露出・季節性を確認。';
 if(f.includes('RANK_DECLINE'))return '主要クエリと競合・順位推移を確認。';
 if(f.includes('CTR_OPPORTUNITY'))return '検索意図とタイトル・説明文の適合を確認。';
 if(f.includes('CLICK_DECLINE'))return 'クリック減少の要因をクエリ別に確認。';
 if(f.includes('GROWTH'))return '伸びている検索意図と関連ページを確認。';
 return '追加の観察を推奨。';
}
function sssP60ShowStrategy(){
 const ui=SpreadsheetApp.getUi(),s=sssP60Get_();if(!s){ui.alert('診断結果がありません。先に診断を生成してください。');return;}
 const r=sssP53Get_(),a=sssP58Get_();if(!r||!a||a.status!=='PASSED'||!r.final||s.finalId!==r.final.id||s.signature!==r.signature){ui.alert('診断結果が現在の検証済みデータと一致しません。再生成してください。');return;}
 const lines=(s.top||[]).slice(0,5).map((x,i)=>{
  const c=x.current||{},b=x.baseline60||{};
  return (i+1)+'. 【'+sssP62Label_(x.priority)+'】 '+x.page+'\n'+
   '理由：'+sssP62Reasons_(x.flags)+'\n'+
   'クリック：直近30日 '+sssP62Num_(c.clicks)+' / 前60日の30日換算 '+sssP62Num_(typeof b.clicks==='number'?b.clicks/2:null,1)+'\n'+
   '表示回数：'+sssP62Num_(c.impressions)+' / '+sssP62Num_(typeof b.impressions==='number'?b.impressions/2:null,1)+'\n'+
   'CTR：'+sssP62Pct_(c.ctr)+' / '+sssP62Pct_(b.ctr)+'\n'+
   '平均順位：'+sssP62Num_(c.position,1)+' / '+sssP62Num_(b.position,1)+'\n'+
   '確認方針：'+sssP62Advice_(x)+'\n※改善の実施判断ではなく調査候補です。';
 });
 ui.alert('サイト戦略診断：'+s.status+'\n基準日：'+s.periodEnd+'\n対象ページ：'+s.pageCount+'\n優先確認：'+s.counts.HIGH+' / 改善機会：'+s.counts.MEDIUM+' / 成長候補：'+s.counts.GROWTH+'\n\n優先候補（上位'+lines.length+'件）\n\n'+(lines.join('\n\n')||'該当なし')+'\n\n※前60日のクリック・表示回数は2で割った30日換算値です。CTR・平均順位は前60日の実測値です。季節性・検索需要・クエリ構成は未補正。数値のみで記事修正を決定しないでください。');
}

// v0.1.64: site-level, read-only descriptive comparison of the persisted audit-backed preview.
// No API calls, no Drive writes, no article edits, no diagnosis reclassification.
function sssP64ShowSiteSummary(){
 const ui=SpreadsheetApp.getUi();
 try{
  const s=sssP60Get_(),r=sssP53Get_(),a=sssP58Get_();
  if(!s||s.status!=='READY')throw new Error('先にサイト戦略診断を生成してください。');
  if(!r||!r.final||!a||a.status!=='PASSED'||s.finalId!==r.final.id||s.signature!==r.signature||s.siteId!==r.siteId)throw new Error('診断結果が現在の監査済みデータと一致しません。');
  const t=s.totals||{},c=t.current,b=t.baseline;
  if(!c||!b||!Number.isFinite(c.clicks)||!Number.isFinite(b.clicks)||!Number.isFinite(c.impressions)||!Number.isFinite(b.impressions))throw new Error('診断結果に比較用の集計値がありません。');
  const pct=(n,d)=>d>0?((n/d-1)*100).toFixed(1)+'%':'比較不可（前期間0）';
  const cCtr=c.impressions>0?c.clicks/c.impressions:null,bCtr=b.impressions>0?b.clicks/b.impressions:null;
  const cPos=c.impressions>0?c.weighted/c.impressions:null,bPos=b.impressions>0?b.weighted/b.impressions:null;
  const fmt=n=>sssP62Num_(n,1),rate=n=>sssP62Pct_(n);
  ui.alert('サイト全体の傾向（読取専用）\n基準日：'+s.periodEnd+'\n対象ページ：'+s.pageCount+'\n\n直近30日 / 前60日を30日換算\nクリック：'+fmt(c.clicks)+' / '+fmt(b.clicks/2)+'（変化 '+pct(c.clicks,b.clicks/2)+'）\n表示回数：'+fmt(c.impressions)+' / '+fmt(b.impressions/2)+'（変化 '+pct(c.impressions,b.impressions/2)+'）\nCTR：'+rate(cCtr)+' / '+rate(bCtr)+'\n平均順位：'+fmt(cPos)+' / '+fmt(bPos)+'\n\n優先確認：'+s.counts.HIGH+'件、改善機会：'+s.counts.MEDIUM+'件、成長候補：'+s.counts.GROWTH+'件\n\n※全ページ集計の記述的比較です。CTR・順位は実測値で、前60日を2で割りません。季節性・検索需要・クエリ構成は未補正。原因や改善効果は確定できません。');
 }catch(e){ui.alert('サイト全体の傾向を表示できません：'+String(e.message||e));}
}

// v0.1.66: exploratory site-level action priorities based solely on audited, persisted preview.
// Read-only: no GSC requests, Drive writes, property mutations, triggers or article edits.
function sssP65Evaluate_(s){
 if(!s||s.status!=='READY'||!s.totals||!s.counts)throw new Error('診断結果が未生成です。');
 const c=s.totals.current,b=s.totals.baseline;
 if(!c||!b||!Number.isFinite(c.clicks)||!Number.isFinite(b.clicks)||!Number.isFinite(c.impressions)||!Number.isFinite(b.impressions)||c.clicks<0||b.clicks<0||c.impressions<0||b.impressions<0)throw new Error('比較数値が不正です。');
 const n=Number(s.pageCount),counts=s.counts;
 if(!Number.isInteger(n)||n<0||['HIGH','MEDIUM','GROWTH','WATCH'].some(k=>!Number.isInteger(counts[k])||counts[k]<0)||counts.HIGH+counts.MEDIUM+counts.GROWTH+counts.WATCH!==n)throw new Error('分類件数が一致しません。');
 const clickRatio=b.clicks>0?c.clicks/(b.clicks/2):null;
 const impressionRatio=b.impressions>0?c.impressions/(b.impressions/2):null;
 const ctrNow=c.impressions>0?c.clicks/c.impressions:null;
 const ctrPrev=b.impressions>0?b.clicks/b.impressions:null;
 const suggestions=[];
 if(clickRatio!==null&&clickRatio<0.8){
  suggestions.push({name:'検索流入減少の要因を切り分ける',why:'サイト全体のクリック数が比較期間の80%未満',next:'GSCの主要クエリ・ページ別で需要、露出、CTR、順位の変化を確認。'});
 }
 if(impressionRatio!==null&&impressionRatio<0.8){
  suggestions.push({name:'検索露出の減少を確認する',why:'サイト全体の表示回数が比較期間の80%未満',next:'主要クエリの検索需要と掲載順位の変化、インデックス状況を確認。'});
 }
 if(ctrNow!==null&&ctrPrev!==null&&ctrNow<ctrPrev*0.8&&c.impressions>=1000){
  suggestions.push({name:'検索結果での訴求を点検する',why:'サイト全体のCTRが比較期間より相対的に20%以上低下',next:'上位表示ページの検索意図とタイトル・説明文を確認。クエリ構成の変化に注意。'});
 }
 if(counts.HIGH>0){suggestions.push({name:'優先確認候補を精査する',why:'優先確認候補 '+counts.HIGH+'件',next:'上位候補のクエリ別推移とManagerの作業状態を確認し、重複改修を避ける。'});}
 if(counts.GROWTH>0){suggestions.push({name:'成長ページの横展開を検討する',why:'成長候補 '+counts.GROWTH+'件',next:'伸びた検索意図を確認し、関連記事・内部リンクの余地を調査。'});}
 if(counts.MEDIUM>0){suggestions.push({name:'改善機会を絞り込む',why:'改善機会候補 '+counts.MEDIUM+'件',next:'表示回数、順位、CTR、検索意図を確認し効果見込みを比較。'});}
 if(!suggestions.length)suggestions.push({name:'定期観察を続ける',why:'現行の探索条件で明確な優先候補なし',next:'次回のデータ更新後に再評価。'});
 return {suggestions:suggestions.slice(0,4),clickRatio,impressionRatio};
}
function sssP65ShowPriorities(){
 const ui=SpreadsheetApp.getUi();
 try{
  const s=sssP60Get_(),r=sssP53Get_(),a=sssP58Get_();
  if(!s||!r||!r.final||!a||a.status!=='PASSED'||s.finalId!==r.final.id||s.signature!==r.signature||s.siteId!==r.siteId)throw new Error('監査PASSEDの最新診断結果が必要です。');
  const out=sssP65Evaluate_(s);
  const rows=out.suggestions.map((x,i)=>(i+1)+'. '+x.name+'\n根拠：'+x.why+'\n次の確認：'+x.next);
  ui.alert('サイト戦略・優先施策（探索的提案／読取専用）\n基準日：'+s.periodEnd+'\n対象ページ：'+s.pageCount+'\n\n'+rows.join('\n\n')+'\n\n※順位は仮の確認順です。季節性・検索需要・クエリ構成は未補正。Managerの作業状態は未取得。記事の修正・公開は行いません。');
 }catch(e){ui.alert('優先施策を表示できません：'+String(e.message||e));}
}


// v0.1.66: transparent impact-oriented triage of stored strategy candidates.
// No Manager status is inferred. This is not a traffic forecast or a directive to edit articles.
function sssP66Impact_(x){
 const c=x.current||{},b=x.baseline60||{};
 const clicks=Number(c.clicks),prior60=Number(b.clicks),imps=Number(c.impressions);
 if(!Number.isFinite(clicks)||!Number.isFinite(prior60)||!Number.isFinite(imps)||clicks<0||prior60<0||imps<0)return null;
 const baseline30=prior60/2;
 const decline=Math.max(0,baseline30-clicks);
 return {decline,clicks,imps,baseline30,needsManagerCheck:true};
}
function sssP66ShowImpact(){
 const ui=SpreadsheetApp.getUi();
 try{
  const s=sssP60Get_(),r=sssP53Get_(),a=sssP58Get_();
  if(!s||s.status!=='READY'||!r||!r.final||!a||a.status!=='PASSED'||s.finalId!==r.final.id||s.signature!==r.signature||s.siteId!==r.siteId)throw new Error('監査PASSEDの診断結果が必要です。');
  const rows=(s.top||[]).map(x=>({x,impact:sssP66Impact_(x)})).filter(v=>v.impact!==null);
  rows.sort((a,b)=>b.impact.decline-a.impact.decline||b.impact.imps-a.impact.imps||a.x.page.localeCompare(b.x.page));
  const lines=rows.slice(0,5).map((v,i)=>(i+1)+'. '+v.x.page+'\n分類：'+sssP62Label_(v.x.priority)+' / '+sssP62Reasons_(v.x.flags)+'\nクリック：直近30日 '+sssP62Num_(v.impact.clicks)+'、前60日30日換算 '+sssP62Num_(v.impact.baseline30,1)+'\n減少幅の参考値：'+sssP62Num_(v.impact.decline,1)+'クリック / 表示回数：'+sssP62Num_(v.impact.imps)+'\n次の確認：クエリ別変化とManager作業状態');
  ui.alert('サイト戦略・影響度の確認（読取専用）\n基準日：'+s.periodEnd+'\n保存済み候補：'+(s.top||[]).length+'件（全'+s.pageCount+'ページではありません）\n\n'+(lines.join('\n\n')||'有効な候補なし')+'\n\n※減少幅は過去60日の30日換算との差であり、回復可能クリック数の予測ではありません。季節性・需要変化は未補正。Manager作業状態は未取得のため、改善中・モニター中の除外は未実施です。');
 }catch(e){ui.alert('影響度の表示に失敗：'+String(e.message||e));}
}


/** Read-only assessment: never relocate ZIPs or rewrite a registered folder binding. */
function sssPreviewBlogFolderUnification(){
  const ui=SpreadsheetApp.getUi(),c=sssConfig_();
  if(!c.lockedAt)throw new Error('先にサイトの初回セットアップを完了してください。');
  const name=c.siteName.replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  const m=sssDriveFolderMap_();
  if(!m){ui.alert('保存先の確認','保存先は未設定です。新規設定では SIMS ＞ '+name+' ＞ Strategist を使用します。既存の同名ブログとの照合は未実施です。',ui.ButtonSet.OK);return;}
  sssDriveVerifyMap_(m);
  if(m.siteFolderName===name){ui.alert('保存先の確認','既にブログ名のみの保存先です。\nSIMS ＞ '+name+' ＞ Strategist\n既存データは変更していません。',ui.ButtonSet.OK);return;}
  const root=sssDriveGetFolder_(m.rootId),it=root.getFoldersByName(name);
  let n=0;while(it.hasNext()){it.next();n++;}
  ui.alert('保存先の統一：事前確認',
    '現在：SIMS ＞ '+m.siteFolderName+' ＞ Strategist\n目標：SIMS ＞ '+name+' ＞ Strategist\n目標ブログ名フォルダーの検出数：'+n+'\n\n既存データの移動・保存先IDの変更は行っていません。\n'+
    (n>1?'同名フォルダーが複数あるため統一を停止する必要があります。':
    n===1?'既存SBMフォルダーとのサイト照合が必要です。':'新規フォルダー作成前に既存データの移行計画が必要です。'),ui.ButtonSet.OK);
}


/** P68: migration preflight is strictly read-only. No folder creation or property mutation. */
function sssAuditFolderMigration(){
 const ui=SpreadsheetApp.getUi();
 try {
  const c=sssConfig_();if(!c.lockedAt)throw new Error('サイト初回セットアップが必要です。');
  const m=sssDriveFolderMap_();if(!m)throw new Error('S3保存先が未設定です。');
  sssDriveVerifyMap_(m);
  const root=sssDriveGetFolder_(m.rootId);
  const safe=c.siteName.replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  const matches=root.getFoldersByName(safe),targets=[];
  while(matches.hasNext())targets.push(matches.next());
  const current=sssDriveGetFolder_(m.siteIdFolder);
  const strat=sssDriveGetFolder_(m.strategistId);
  const report=[];
  report.push('サイト：'+c.siteName);
  report.push('現在：SIMS ＞ '+current.getName()+' ＞ Strategist');
  report.push('目標：SIMS ＞ '+safe+' ＞ Strategist');
  report.push('目標ブログ名フォルダー：'+targets.length+'件');
  if(targets.length>1)report.push('判定：停止（同名フォルダーが複数）');
  else if(targets.length===0)report.push('判定：要確認（目標フォルダーなし）');
  else if(targets[0].getId()===current.getId())report.push('判定：既に統一済み（移行不要）');
  else {
   const it=targets[0].getFoldersByName('Strategist');let count=0;while(it.hasNext()){it.next();count++;}
   report.push('目標側Strategistフォルダー：'+count+'件');
   report.push('判定：移行前の手動照合が必要（サイトURL・所有者・既存ファイルを確認）');
  }
  const keys=[['Evidence',m.evidenceId],['Baseline',m.baselineId],['Delta',m.deltaId],['Archive',m.archiveId],['Reports',m.reportsId],['Export',m.exportId]];
  keys.forEach(function(k){const folder=sssDriveGetFolder_(k[1]);let n=0;const files=folder.getFiles();while(files.hasNext()){files.next();n++;}report.push(k[0]+'：直下'+n+'ファイル');});
  report.push('※サブフォルダー内のファイル数は含みません。');
  report.push('※Managerとの同一サイト判定は未実施です。');
  report.push('※移動・作成・削除・保存先設定の変更は一切行いません。');
  ui.alert('S3保存先・移行前監査',report.join('\n'),ui.ButtonSet.OK);
 }catch(e){ui.alert('移行前監査：'+String(e.message||e));}
}


/** P69: explicit one-shot read-only Manager preview; no stored spreadsheet IDs, no Drive writes. */
function sssP69ManagerPreview(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_();if(!c.lockedAt||!c.propertyUri)throw new Error('S3サイト固定が必要です。');
  const answer=ui.prompt('Manager連携・事前確認（読取専用）','同じブログのSBMスプレッドシートIDを入力してください。IDは保存しません。記事管理の先頭行と件数だけを確認します。',ui.ButtonSet.OK_CANCEL);
  if(answer.getSelectedButton()!==ui.Button.OK)return;
  const id=String(answer.getResponseText()||'').trim();
  if(!/^[a-zA-Z0-9_-]{25,120}$/.test(id))throw new Error('スプレッドシートIDの形式が正しくありません。');
  const manager=SpreadsheetApp.openById(id),sh=manager.getSheetByName('記事管理');
  if(!sh||sh.getLastRow()<2)throw new Error('Managerの記事管理シートまたは記事データがありません。');
  const n=sh.getLastColumn(),headers=sh.getRange(1,1,1,n).getDisplayValues()[0].map(x=>String(x).trim());
  const required=['記事URL','ArticleID','作業状態'];
  for(const key of required)if(headers.indexOf(key)<0)throw new Error('Manager記事管理の必須列がありません：'+key);
  const titleKey=headers.indexOf('記事タイトル')>=0?'記事タイトル':headers.indexOf('H1タイトル')>=0?'H1タイトル':'';
  if(!titleKey)throw new Error('記事タイトル列がありません。');
  const urlCol=headers.indexOf('記事URL')+1,rows=sh.getLastRow()-1;
  // Sample a bounded number of URL cells. Never treat a sample as proof of site ownership.
  const sample=sh.getRange(2,urlCol,Math.min(rows,200),1).getDisplayValues().map(x=>String(x[0]).trim()).filter(Boolean);
  let target='';
  const prop=String(c.propertyUri);
  if(prop.indexOf('sc-domain:')===0)target=prop.substring(10).toLowerCase();
  else {const m=/^https?:\/\/([^\/:?#]+)/i.exec(prop);if(m)target=m[1].toLowerCase();}
  if(!target)throw new Error('S3のGSCプロパティからドメインを判定できません。');
  let matches=0,foreign=0,invalid=0;
  for(const u of sample){const m=/^https?:\/\/([^\/:?#]+)/i.exec(u);if(!m){invalid++;continue;}const host=m[1].toLowerCase();if(host===target||host.endsWith('.'+target))matches++;else foreign++;}
  const verdict=foreign>0?'停止：別ドメインの記事URLを検出':matches===0?'保留：同一ドメインを確認できない':'仮確認：同一ドメインのURLを検出（サイト一致の確定ではありません）';
  ui.alert('Manager連携・読取専用監査',
    'S3サイト：'+c.siteName+'\nGSCプロパティ：'+c.propertyUri+'\nManager：'+manager.getName()+'\n記事管理：'+rows+'行\nタイトル列：'+titleKey+'\nURL検査：最大200行\n同一ドメイン：'+matches+'件／別ドメイン：'+foreign+'件／形式不明：'+invalid+'件\n判定：'+verdict+'\n\n記事ID・状態の取得に必要な列を確認しました。\nこの処理は読み取りのみです。IDは保存せず、フォルダー移行・改善候補の除外は行いません。',ui.ButtonSet.OK);
 }catch(e){ui.alert('Manager連携・事前確認：'+String(e.message||e));}
}

/** P70: One-shot bounded URL matching audit; never stores Manager ID or changes strategy candidates. */
function sssP70NormalizeUrl_(raw){
  const value=String(raw||'').trim();
  if(!/^https?:\/\//i.test(value))return '';
  // Refuse URLs with userinfo or nonstandard ports rather than silently matching a different origin.
  const m=/^https?:\/\/([^\/?#]+)(\/[^?#]*)?(?:[?#].*)?$/i.exec(value);
  if(!m||m[1].includes('@'))return '';
  const host=m[1].toLowerCase().replace(/:80$|:443$/,'');
  if(!/^[a-z0-9.-]+$/.test(host)||host.startsWith('.')||host.endsWith('.'))return '';
  let path=(m[2]||'/').replace(/\/{2,}/g,'/');
  if(path!=='/')path=path.replace(/\/+$/,'');
  return host+path;
}
function sssP70AuditManagerMatches(){
  const ui=SpreadsheetApp.getUi();
  try{
    const c=sssConfig_();if(!c.lockedAt||!c.propertyUri)throw new Error('S3サイト固定が必要です。');
    const data=sssP60Get_(),period=sssP53Get_(),audit=sssP58Get_();
    if(!data||data.status!=='READY'||!Array.isArray(data.top)||!data.top.length||
       !period||!period.final||!audit||audit.status!=='PASSED'||
       data.finalId!==period.final.id||data.signature!==period.signature||data.siteId!==period.siteId||
       data.siteId!==c.siteId)throw new Error('最新の監査PASSEDデータと一致する戦略診断が必要です。監査と診断を再実行してください。');
    const ans=ui.prompt('Managerと戦略候補の照合監査','同じサイトのManagerスプレッドシートIDを入力してください（保存しません）。記事管理と戦略候補を読み取り照合します。',ui.ButtonSet.OK_CANCEL);
    if(ans.getSelectedButton()!==ui.Button.OK)return;
    const id=String(ans.getResponseText()||'').trim();if(!/^[A-Za-z0-9_-]{25,120}$/.test(id))throw new Error('スプレッドシートIDの形式が不正です。');
    const book=SpreadsheetApp.openById(id),sheet=book.getSheetByName('記事管理');
    if(!sheet)throw new Error('記事管理シートがありません。');
    const count=sheet.getLastRow()-1;if(count<1||count>10000)throw new Error('記事管理行数が検査上限外です（1～10,000行）。分割方式の実装が必要です。');
    const cols=sheet.getLastColumn(),values=sheet.getRange(1,1,count+1,cols).getDisplayValues();
    const h=values.shift().map(x=>String(x).trim());
    const col={};for(const name of ['記事URL','ArticleID','作業状態']){col[name]=h.indexOf(name);if(col[name]<0)throw new Error('必須列なし：'+name);}
    const title=h.indexOf('記事タイトル')>=0?h.indexOf('記事タイトル'):h.indexOf('H1タイトル');
    if(title<0)throw new Error('タイトル列がありません。');
    const scope=sssP72PropertyScope_(c.propertyUri);
    if(!scope)throw new Error('GSCプロパティの範囲を確認できません。照合を停止しました。');
    const index={};let foreign=0,invalid=0,duplicates=0;
    for(const row of values){const raw=row[col['記事URL']],key=sssP70NormalizeUrl_(raw);
      if(!key){if(String(raw).trim())invalid++;continue;}
      if(!sssP72WithinScope_(raw,scope)){foreign++;continue;}
      if(index[key]){duplicates++;index[key].duplicate=true;continue;}
      index[key]={id:row[col.ArticleID],title:row[title],state:row[col['作業状態']],duplicate:false};
    }
    if(foreign)throw new Error('別ドメインの記事URLを'+foreign+'件検出。照合を停止しました。');
    if(invalid)throw new Error('形式不明の記事URLを'+invalid+'件検出。照合を停止しました（空欄は除外）。');
    let matched=0,unmatched=0,ambiguous=0,hold=0,eligible=0,unknown=0;const lines=[];
    for(const item of data.top){if(!sssP72WithinScope_(item.page,scope))throw new Error('S3戦略候補がGSCプロパティ範囲外です。照合を停止しました。');const key=sssP70NormalizeUrl_(item.page);const found=index[key];
      if(!found){unmatched++;continue;}
      if(found.duplicate){ambiguous++;continue;}
      matched++;const state=String(found.state||'').trim();
      const blocked=/改善中|モニター中|モニタ中/.test(state);
      if(blocked)hold++;else if(state==='未着手')eligible++;else unknown++;
      if(lines.length<5)lines.push('・'+String(found.id||'ID未登録')+'／'+state+'／'+String(found.title||'タイトル未登録').slice(0,32));
    }
    const status=duplicates?'要確認（重複URLあり。該当候補は保留）':'照合監査完了（サイト所有権の確定ではありません）';
    ui.alert('Manager・戦略候補の照合結果',
      'Manager：'+book.getName()+'\n記事管理：'+count+'行\n保存済みS3候補：'+data.top.length+'件\n一致：'+matched+'件／未一致：'+unmatched+'件／重複で保留：'+ambiguous+'件\n一致内：改善中・モニター中 '+hold+'件／未着手 '+eligible+'件／その他 '+unknown+'件\nManager URL重複：'+duplicates+'件／形式不明：'+invalid+'件\n判定：'+status+'\n\n'+lines.join('\n')+'\n\n※今回の検査は保存済みプレビュー候補のみ。実際の除外・書込・ファイル移動は行いません。',ui.ButtonSet.OK);
  }catch(e){ui.alert('Manager照合監査：'+String(e.message||e));}
}

/** Domain property covers host and subdomains; URL-prefix property covers exact scheme, host, port and path prefix. */
function sssP72PropertyScope_(uri){
  const value=String(uri||'').trim();
  if(/^sc-domain:/i.test(value)){
    const host=value.slice(10).toLowerCase().replace(/\.$/,'');
    return /^[a-z0-9.-]+$/.test(host)&&host.indexOf('.')>0?{kind:'domain',host:host}:null;
  }
  try{
    const u=new URL(value);
    if(!/^https?:$/.test(u.protocol)||u.username||u.password||!u.hostname)return null;
    return {kind:'prefix',origin:u.origin.toLowerCase(),path:u.pathname||'/',query:u.search||''};
  }catch(e){return null;}
}
function sssP72WithinScope_(raw,scope){
  try{
    const u=new URL(String(raw||'').trim());
    if(!/^https?:$/.test(u.protocol)||u.username||u.password)return false;
    const host=u.hostname.toLowerCase().replace(/\.$/,'');
    if(scope.kind==='domain')return host===scope.host||host.endsWith('.'+scope.host);
    if(u.origin.toLowerCase()!==scope.origin)return false;
    // GSC URL-prefix property uses literal prefix matching, including optional query.
    return (u.pathname+u.search).startsWith(scope.path+scope.query);
  }catch(e){return false;}
}


/** v0.1.73: Live read-only Manager state view. No persisted Manager ID, no write or auto-exclusion. */
function sssP73ShowManagerCandidates(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_(),s=sssP60Get_(),r=sssP53Get_(),a=sssP58Get_();
  if(!c.lockedAt||!c.propertyUri||!s||s.status!=='READY'||!Array.isArray(s.top)||!s.top.length||
     !r||!r.final||!a||a.status!=='PASSED'||s.finalId!==r.final.id||s.signature!==r.signature||s.siteId!==r.siteId||s.siteId!==c.siteId)
   throw new Error('現在の監査済みデータと一致する戦略診断が必要です。');
  const scope=sssP72PropertyScope_(c.propertyUri);
  if(!scope)throw new Error('GSCプロパティの範囲を確認できません。');
  const response=ui.prompt('Manager対応状況つき戦略候補','同じサイトのManagerスプレッドシートIDを入力してください（保存しません）。',ui.ButtonSet.OK_CANCEL);
  if(response.getSelectedButton()!==ui.Button.OK)return;
  const id=String(response.getResponseText()||'').trim();
  if(!/^[A-Za-z0-9_-]{25,120}$/.test(id))throw new Error('スプレッドシートIDの形式が不正です。');
  const sh=SpreadsheetApp.openById(id).getSheetByName('記事管理');
  if(!sh)throw new Error('記事管理シートがありません。');
  const n=sh.getLastRow()-1;
  if(n<1||n>10000)throw new Error('記事管理の行数が検査上限外です。');
  const rows=sh.getRange(1,1,n+1,sh.getLastColumn()).getDisplayValues();
  const h=rows.shift().map(x=>String(x).trim());
  const col={};for(const key of ['記事URL','ArticleID','作業状態']){col[key]=h.indexOf(key);if(col[key]<0)throw new Error('必須列なし：'+key);}
  const ti=h.indexOf('記事タイトル')>=0?h.indexOf('記事タイトル'):h.indexOf('H1タイトル');
  if(ti<0)throw new Error('記事タイトル列がありません。');
  const map=new Map();let foreign=0,invalid=0;
  for(const row of rows){
   const raw=String(row[col['記事URL']]||'').trim();if(!raw)continue;
   const key=sssP70NormalizeUrl_(raw);
   if(!key){invalid++;continue;}
   if(!sssP72WithinScope_(raw,scope)){foreign++;continue;}
   if(map.has(key)){map.get(key).duplicate=true;continue;}
   map.set(key,{id:row[col.ArticleID],title:row[ti],state:String(row[col['作業状態']]||'').trim(),duplicate:false});
  }
  if(foreign||invalid)throw new Error('Manager内に範囲外URL '+foreign+'件、形式不明URL '+invalid+'件。照合を停止しました。');
  const lines=[];let blocked=0,ready=0,review=0;
  for(const x of s.top.slice(0,8)){
   if(!sssP72WithinScope_(x.page,scope))throw new Error('戦略候補にプロパティ範囲外のURLがあります。');
   const key=sssP70NormalizeUrl_(x.page),v=map.get(key);
   let label='未照合・要確認';
   if(v&&!v.duplicate){
    if(/改善中|モニター中|モニタ中/.test(v.state)){label='Manager対応中・新規改善提案は保留';blocked++;}
    else if(v.state==='未着手'){label='候補（実施前に再確認）';ready++;}
    else {label='状態確認が必要（'+(v.state||'空欄')+'）';review++;}
   }else {label=v&&v.duplicate?'URL重複・保留':'未照合・要確認';review++;}
   lines.push((lines.length+1)+'. '+sssP62Label_(x.priority)+'／'+label+'\n'+
     (v&&!v.duplicate?String(v.id||'IDなし')+' '+String(v.title||'タイトルなし').slice(0,45)+'\n':'')+x.page);
  }
  ui.alert('Manager対応状況つき戦略候補',
   '対象：保存済み上位'+lines.length+'件\n対応中：'+blocked+'件／未着手：'+ready+'件／確認待ち：'+review+'件\n\n'+lines.join('\n\n')+
   '\n\n※Managerの状態は表示時に読み取り。記事修正・候補削除・ファイル移動・ID保存は行いません。',ui.ButtonSet.OK);
 }catch(e){ui.alert('Manager対応状況つき戦略候補：'+String(e.message||e));}
}


/** P74: recursive, read-only inventory. Never creates folders or changes bindings. */
function sssP74MigrationInventory(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_(),m=sssDriveFolderMap_();
  if(!c.lockedAt||!m)throw new Error('サイト固定と保存先設定が必要です。');
  sssDriveVerifyMap_(m);
  const root=sssDriveGetFolder_(m.rootId),source=sssDriveGetFolder_(m.strategistId);
  const safe=c.siteName.replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  const it=root.getFoldersByName(safe),sites=[];
  while(it.hasNext())sites.push(it.next());
  if(sites.length!==1)throw new Error('目標ブログ名フォルダーが'+sites.length+'件です。統合前に確認してください。');
  const targetSite=sites[0];
  if(targetSite.getId()===sssDriveGetFolder_(m.siteIdFolder).getId()){
   ui.alert('全階層監査','既にブログ名フォルダーを利用しています。移行不要です。',ui.ButtonSet.OK);return;
  }
  const st=targetSite.getFoldersByName('Strategist'),targets=[];
  while(st.hasNext())targets.push(st.next());
  if(targets.length>1)throw new Error('統一先にStrategistフォルダーが複数あります。');
  const limit=20000,scan=function(folder){
   const out={files:0,folders:0,bytes:0,paths:{},truncated:false},queue=[{folder:folder,path:''}];
   while(queue.length){
    if(out.files+out.folders>=limit){out.truncated=true;break;}
    const cur=queue.shift(),fs=cur.folder.getFiles();
    while(fs.hasNext()){
     if(out.files+out.folders>=limit){out.truncated=true;break;}
     const f=fs.next();if(f.isTrashed())continue;
     const path=cur.path+'/'+f.getName();
     (out.paths[path]||(out.paths[path]=[])).push({id:f.getId(),size:f.getSize()});
     out.files++;out.bytes+=f.getSize();
    }
    if(out.truncated)break;
    const subs=cur.folder.getFolders();
    while(subs.hasNext()){
     if(out.files+out.folders>=limit){out.truncated=true;break;}
     const sub=subs.next();if(sub.isTrashed())continue;
     out.folders++;queue.push({folder:sub,path:cur.path+'/'+sub.getName()});
    }
    if(out.truncated)break;
   }
   return out;
  };
  const a=scan(source),b=targets.length?scan(targets[0]):{files:0,folders:0,bytes:0,paths:{},truncated:false};
  const collision=Object.keys(a.paths).filter(function(k){return !!b.paths[k];});
  const duplicate=Object.keys(a.paths).filter(function(k){return a.paths[k].length>1;});
  const report=[
   '現在：SIMS ＞ '+sssDriveGetFolder_(m.siteIdFolder).getName()+' ＞ Strategist',
   '目標：SIMS ＞ '+safe+' ＞ Strategist',
   '移行元：'+a.files+'ファイル／'+a.folders+'フォルダー／'+a.bytes+'バイト',
   '移行先：'+b.files+'ファイル／'+b.folders+'フォルダー／'+b.bytes+'バイト',
   '同一相対パスのファイル衝突：'+collision.length+'件',
   '移行元の同一相対パス重複：'+duplicate.length+'件',
   '件数上限到達：'+(a.truncated||b.truncated?'あり（監査未完了）':'なし'),
   '判定：'+(a.truncated||b.truncated||collision.length||duplicate.length?'要確認・移行禁止':'ファイル名衝突なし（サイト同一性と内容の検証は別途必要）'),
   '※Googleドライブのファイル移動・作成・削除、設定変更は一切行いません。'
  ];
  if(collision.length)report.push('衝突例：'+collision.slice(0,3).join('、'));
  ui.alert('S3全階層・移行前監査',report.join('\n'),ui.ButtonSet.OK);
 }catch(e){ui.alert('全階層監査：'+String(e.message||e));}
}

/** P75: conservative preflight, no mutations. Does not certify Manager ownership. */
function sssP75MigrationReadiness(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_(),m=sssDriveFolderMap_();
  if(!c.lockedAt||!m)throw new Error('サイト固定と保存先設定が必要です。');
  sssDriveVerifyMap_(m);
  const root=sssDriveGetFolder_(m.rootId),sourceSite=sssDriveGetFolder_(m.siteIdFolder);
  const source=sssDriveGetFolder_(m.strategistId);
  const safe=String(c.siteName||'').replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  if(!safe)throw new Error('ブログ名が空欄です。');
  const candidates=root.getFoldersByName(safe),targets=[];
  while(candidates.hasNext())targets.push(candidates.next());
  const reasons=[];
  if(targets.length!==1)reasons.push('ブログ名フォルダーの候補が'+targets.length+'件（必要数：1）');
  const target=targets.length===1?targets[0]:null;
  if(target&&target.getId()===sourceSite.getId()){
   ui.alert('移行の安全条件','現在の保存先は既にブログ名フォルダーです。移行は不要です。\n※Managerとのサイト一致確認は別工程です。',ui.ButtonSet.OK);return;
  }
  let stratCount=0,managerCount=0,sourceCount=0,targetCount=0;
  if(target){
   const st=target.getFoldersByName('Strategist');while(st.hasNext()){st.next();stratCount++;}
   const mg=target.getFoldersByName('Manager');while(mg.hasNext()){mg.next();managerCount++;}
   if(stratCount>1)reasons.push('移行先Strategistフォルダーが重複');
   if(managerCount!==1)reasons.push('移行先Managerフォルダーが一意でない（'+managerCount+'件）');
   // Existing Strategist data must be inventoried before any merge or copy.
   if(stratCount===1)reasons.push('移行先Strategistが存在。ファイル衝突と内容照合が必要');
  }
  const sourceFiles=source.getFiles();while(sourceFiles.hasNext()){sourceFiles.next();sourceCount++;if(sourceCount>20000)break;}
  if(sourceCount>20000)reasons.push('移行元直下ファイルの検査上限を超過');
  // Site identity cannot be inferred from folder name, domain or folder topology.
  reasons.push('ManagerとS3のサイト同一性を認証する仕組みが未実装');
  reasons.push('コピー後のハッシュ照合・保存先切替・復旧手順が未実装');
  const lines=[
   '移行元：SIMS ＞ '+sourceSite.getName()+' ＞ Strategist',
   '移行先：SIMS ＞ '+safe+' ＞ Strategist',
   '移行元直下ファイル：'+(sourceCount>20000?'20,000超':sourceCount)+'件（全階層は別メニューで監査）',
   '移行先ブログ名フォルダー：'+targets.length+'件',
   '移行先Managerフォルダー：'+managerCount+'件',
   '移行先Strategistフォルダー：'+stratCount+'件',
   '判定：HOLD（移行を許可しません）',
   '保留理由：\n・'+reasons.join('\n・'),
   '※この確認ではファイル・フォルダー・設定を一切変更しません。'
  ];
  ui.alert('S3保存先移行・安全条件',lines.join('\n'),ui.ButtonSet.OK);
 }catch(e){ui.alert('移行安全条件の確認：'+String(e.message||e));}
}

/** P76: independent, read-only folder-identity and ambiguity risk review.
 * A matching folder name or Manager child is NOT evidence of site ownership.
 * No Drive writes, no binding change, and no migration permission is issued.
 */
function sssP76MigrationRiskReview(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_(),m=sssDriveFolderMap_();
  if(!c.lockedAt||!m)throw new Error('サイト固定と保存先設定が必要です。');
  sssDriveVerifyMap_(m);
  const root=sssDriveGetFolder_(m.rootId),oldSite=sssDriveGetFolder_(m.siteIdFolder);
  const safe=String(c.siteName||'').replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  if(!safe)throw new Error('ブログ名が空です。');
  const folders=root.getFoldersByName(safe),candidates=[];
  while(folders.hasNext()){candidates.push(folders.next());if(candidates.length>20)break;}
  const risks=[];
  if(candidates.length!==1)risks.push('同名ブログフォルダーが一意ではありません：'+candidates.length+'件');
  const target=candidates.length===1?candidates[0]:null;
  let managerCount=0,stratCount=0;
  if(target){
   const mi=target.getFoldersByName('Manager');while(mi.hasNext()){mi.next();managerCount++;}
   const si=target.getFoldersByName('Strategist');while(si.hasNext()){si.next();stratCount++;}
   if(managerCount!==1)risks.push('Managerフォルダーが一意ではありません：'+managerCount+'件');
   if(stratCount>1)risks.push('Strategistフォルダーが重複しています：'+stratCount+'件');
   // Folder names alone never authorize access to another product's files.
  }
  const same=!!target&&target.getId()===oldSite.getId();
  if(!same)risks.push('Managerのサイト識別情報とS3の同一性は未証明です');
  risks.push('コピー後の内容検証・切替・復旧処理は未実装です');
  const out=[
   '対象サイト：'+c.siteName,
   'GSCプロパティ：'+c.propertyUri,
   '現在：SIMS ＞ '+oldSite.getName()+' ＞ Strategist',
   '目標：SIMS ＞ '+safe+' ＞ Strategist',
   '目標ブログ名フォルダー：'+candidates.length+'件',
   'Managerフォルダー：'+managerCount+'件',
   'Strategistフォルダー：'+stratCount+'件',
   '現在のフォルダーと目標が同じ：'+(same?'はい':'いいえ'),
   '判定：'+(same?'保存先の変更は不要（Manager連携の認証は別）':'HOLD（移行不可）'),
   '確認事項：\n・'+risks.join('\n・'),
   '※この処理は読取専用です。移動・削除・作成・設定変更はありません。'
  ];
  ui.alert('S3保存先統一・リスク確認',out.join('\n'),ui.ButtonSet.OK);
 }catch(e){ui.alert('保存先統一・リスク確認：'+String(e.message||e));}
}

/** P78: single read-only overview. This NEVER authorizes migration. */
function sssP78MigrationDashboard(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_(),m=sssDriveFolderMap_();
  if(!c.lockedAt||!m)throw new Error('サイト固定と保存先設定が必要です。');
  sssDriveVerifyMap_(m);
  const root=sssDriveGetFolder_(m.rootId),current=sssDriveGetFolder_(m.siteIdFolder);
  const safe=String(c.siteName||'').replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  if(!safe)throw new Error('ブログ名が空です。');
  const it=root.getFoldersByName(safe),targets=[];
  while(it.hasNext()){targets.push(it.next());if(targets.length>20)break;}
  const t=targets.length===1?targets[0]:null;
  function countChildren_(folder,name){
   if(!folder)return 0;
   const iter=folder.getFoldersByName(name);let n=0;
   while(iter.hasNext()){iter.next();n++;if(n>20)break;}
   return n;
  }
  const manager=countChildren_(t,'Manager'),strategist=countChildren_(t,'Strategist');
  const same=!!t&&t.getId()===current.getId();
  const issues=[];
  if(targets.length!==1)issues.push('ブログ名フォルダーが一意でない');
  if(t&&manager!==1)issues.push('Managerフォルダーが一意でない');
  if(t&&strategist>1)issues.push('Strategistフォルダーが重複');
  if(!same)issues.push('既存保存先と統一先が異なる');
  issues.push('SBMとS3のサイト同一性は未認証');
  issues.push('コピー・内容照合・切替・復旧は未実装');
  const lines=[
   'サイト：'+c.siteName,
   'GSC：'+c.propertyUri,
   '現在：SIMS ＞ '+current.getName()+' ＞ Strategist',
   '統一先：SIMS ＞ '+safe+' ＞ Strategist',
   'ブログ名フォルダー候補：'+(targets.length>20?'20超':targets.length)+'件',
   '統一先のManager：'+manager+'件／Strategist：'+strategist+'件',
   '保存先の一致：'+(same?'はい':'いいえ'),
   '判定：'+(same?'保存先変更不要（Manager連携は未認証）':'HOLD（移行禁止）'),
   '確認事項：\n・'+issues.join('\n・'),
   '※読取専用。ファイルのコピー・移動・削除、設定変更は行いません。'
  ];
  ui.alert('保存先統一・総合チェック',lines.join('\n'),ui.ButtonSet.OK);
 }catch(e){ui.alert('保存先統一・総合チェック：'+String(e.message||e));}
}

/** P79: Strict, read-only preflight. A URL-scope match is not proof of ownership. */
function sssP79ManagerIdentityPreflight(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_(),m=sssDriveFolderMap_();
  if(!c.lockedAt||!c.siteId||!c.propertyUri||!m)throw new Error('S3のサイト固定と保存先設定が必要です。');
  sssDriveVerifyMap_(m);
  const scope=sssP72PropertyScope_(c.propertyUri);
  if(!scope)throw new Error('GSCプロパティの範囲を確認できません。');
  const ans=ui.prompt('Managerサイト照合（読取専用）','対象ブログのManagerスプレッドシートIDを入力してください。IDは保存しません。',ui.ButtonSet.OK_CANCEL);
  if(ans.getSelectedButton()!==ui.Button.OK)return;
  const id=String(ans.getResponseText()||'').trim();
  if(!/^[A-Za-z0-9_-]{25,120}$/.test(id))throw new Error('スプレッドシートIDの形式が不正です。');
  const book=SpreadsheetApp.openById(id),sh=book.getSheetByName('記事管理');
  if(!sh)throw new Error('Managerの記事管理シートがありません。');
  const count=sh.getLastRow()-1;
  if(count<1||count>10000)throw new Error('記事管理の全件監査ができません（対象は1～10,000行）。移行はHOLDです。');
  const headers=sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0].map(v=>String(v).trim());
  const urlCol=headers.indexOf('記事URL')+1;
  if(!urlCol||headers.indexOf('ArticleID')<0||headers.indexOf('作業状態')<0)throw new Error('Manager記事管理の必須列がありません。');
  const urls=sh.getRange(2,urlCol,count,1).getDisplayValues();
  let inScope=0,outScope=0,invalid=0,blank=0,duplicates=0;
  const seenUrls=new Set();
  for(const row of urls){
   const raw=String(row[0]||'').trim();
   if(!raw){blank++;continue;}
   const normalized=sssP70NormalizeUrl_(raw);
   if(!normalized){invalid++;continue;}
   if(seenUrls.has(normalized))duplicates++;else seenUrls.add(normalized);
   if(sssP72WithinScope_(raw,scope))inScope++;else outScope++;
  }
  const root=sssDriveGetFolder_(m.rootId),source=sssDriveGetFolder_(m.siteIdFolder);
  const name=String(c.siteName||'').replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  if(!name)throw new Error('S3のブログ名がありません。');
  if(source.getName()!==name && source.getName()!==m.siteFolderName){
   throw new Error('登録済みS3保存先の名称が記録と異なります。移行はHOLDです。');
  }
  const iter=root.getFoldersByName(name);let folders=0,target=null;
  while(iter.hasNext()){target=iter.next();folders++;if(folders>20)break;}
  let managerFolders=0,strategistFolders=0;
  if(folders===1){
   const a=target.getFoldersByName('Manager');while(a.hasNext()){a.next();managerFolders++;if(managerFolders>20)break;}
   const b=target.getFoldersByName('Strategist');while(b.hasNext()){b.next();strategistFolders++;if(strategistFolders>20)break;}
  }
  const reasons=[];
  if(inScope===0)reasons.push('対象プロパティ内の記事URLがありません');
  if(blank)reasons.push('記事URLの空欄：'+blank+'件（全記事の照合ができません）');
  if(outScope)reasons.push('プロパティ範囲外の記事URL：'+outScope+'件');
  if(invalid)reasons.push('形式不明の記事URL：'+invalid+'件');
  if(duplicates)reasons.push('記事URLの重複：'+duplicates+'件（同一URLの複数行）');
  if(folders!==1)reasons.push('ブログ名フォルダーが一意ではありません');
  if(managerFolders!==1)reasons.push('Managerフォルダーが一意ではありません');
  if(strategistFolders>1)reasons.push('Strategistフォルダーが重複しています');
  // URL一致とフォルダー名一致は所有権・サイトID一致の証明にならない。
  // 読取専用の予備監査は常に移行HOLDとし、別途認証済みの移行ゲートを要求する。
  const structural=reasons.length===0;
  ui.alert('Managerサイト照合・移行前確認',[
   'S3サイト：'+c.siteName,'GSC：'+c.propertyUri,'Manager：'+book.getName(),
   '記事管理：'+count+'行／対象範囲：'+inScope+'件／範囲外：'+outScope+'件／形式不明：'+invalid+'件／重複：'+duplicates+'件／空欄：'+blank+'件',
   'ブログ名フォルダー：'+folders+'件／Manager：'+managerFolders+'件／Strategist：'+strategistFolders+'件',
   '現保存先：'+source.getName()+'（フォルダーID：'+source.getId()+'）',
   '構造・URL範囲チェック：'+(structural?'予備検査に問題なし（同一サイトの証明ではありません）':'HOLD'),
   reasons.length?'要確認：\n・'+reasons.join('\n・'):'要確認：サイトの所有・SBMの内部サイトIDは未認証',
   '最終判定：HOLD（サイトID・保存先所有権の照合未完了／移行禁止）',
   '※URL範囲一致はサイト同一性の証明ではありません。読取専用。IDを保存せず、移行・切替・削除を行いません。'
  ].join('\n'),ui.ButtonSet.OK);
 }catch(e){ui.alert('Managerサイト照合：'+String(e.message||e));}
}

/** P83: Compare Manager's configured identity without changing either product.
 * Different products can have different SiteID generation; do not treat a
 * matching URL or a displayed ID as proof of Drive-folder ownership.
 */
function sssP83CompareManagerSiteSettings(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_(),m=sssDriveFolderMap_();
  if(!c.lockedAt||!c.siteId||!c.propertyUri||!m)throw new Error('S3のサイト固定と保存先登録が必要です。');
  sssDriveVerifyMap_(m);
  const answer=ui.prompt('Managerサイト設定の照合（読取専用）','対象ブログのManagerスプレッドシートIDを入力してください。IDは保存しません。',ui.ButtonSet.OK_CANCEL);
  if(answer.getSelectedButton()!==ui.Button.OK)return;
  const id=String(answer.getResponseText()||'').trim();
  if(!/^[A-Za-z0-9_-]{25,120}$/.test(id))throw new Error('スプレッドシートIDの形式が不正です。');
  const book=SpreadsheetApp.openById(id),sh=book.getSheetByName('Settings');
  if(!sh)throw new Error('ManagerのSettingsシートがありません。');
  const last=sh.getLastRow();
  if(last<2||last>5000)throw new Error('Settingsの行数が監査範囲外です。');
  const values=sh.getRange(1,1,last,Math.min(sh.getLastColumn(),4)).getDisplayValues();
  const settings={};
  for(const row of values){const k=String(row[0]||'').trim();if(k&&!(k in settings))settings[k]=String(row[1]||'').trim();}
  const blogUrl=settings.BlogUrl||'',blogName=settings.BlogName||'',managerId=settings.SiteID||'',managerProperty=settings.SearchConsoleProperty||'';
  const scope=sssP72PropertyScope_(c.propertyUri);
  if(!scope)throw new Error('S3のGSCプロパティを解釈できません。');
  const issues=[];
  if(!blogUrl)issues.push('ManagerのBlogUrlが未設定');
  else if(!sssP72WithinScope_(blogUrl,scope))issues.push('ManagerのBlogUrlがS3のGSCプロパティ範囲外');
  if(!blogName)issues.push('ManagerのBlogNameが未設定');
  else if(blogName!==c.siteName)issues.push('ブログ名が異なる（改称・表記揺れの可能性）');
  if(!managerId)issues.push('ManagerのSiteIDが未設定');
  if(!managerProperty)issues.push('ManagerのSearchConsolePropertyが未設定');
  else if(sssCanonicalProperty_(managerProperty)!==sssCanonicalProperty_(c.propertyUri))issues.push('GSCプロパティの設定値が一致しない');
  ui.alert('Managerサイト設定の照合',[
   'S3：'+c.siteName+'／'+c.propertyUri,
   'Manager：'+(blogName||'未設定')+'／'+(blogUrl||'未設定'),
   'Manager GSC：'+(managerProperty||'未設定'),
   'Manager SiteID：'+(managerId||'未設定'),
   'S3 SiteID：'+c.siteId,
   '設定値の予備照合：'+(issues.length?'HOLD':'矛盾は検出されませんでした'),
   issues.length?'要確認：\n・'+issues.join('\n・'):'※URL・名前・設定値が一致しても所有権は証明されません。',
   '移行許可：HOLD（Manager保存先の所有権・紐付け未認証）',
   '※読取専用。Manager IDは保存せず、ファイル移動・保存先切替も行いません。'
  ].join('\n'),ui.ButtonSet.OK);
 }catch(e){ui.alert('Managerサイト設定照合：'+String(e.message||e));}
}

/** P84: Read-only structural cross-check of Manager's expected Drive tree.
 * Manager v9.2.4 binds its actual folder IDs in its own DocumentProperties
 * (SIMS_DRIVE_BACKUP_BINDING_V1). S3 cannot read those properties from a
 * different Apps Script project; this check MUST NOT assert ownership.
 */
function sssP84CheckManagerFolderStructure(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_(),m=sssDriveFolderMap_();
  if(!c.lockedAt||!m)throw new Error('サイト固定とS3保存先登録が必要です。');
  sssDriveVerifyMap_(m);
  const root=sssDriveGetFolder_(m.rootId),current=sssDriveGetFolder_(m.siteIdFolder);
  const safe=String(c.siteName||'').replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  if(!safe)throw new Error('ブログ名が未設定です。');
  function unique_(parent,name){
   const it=parent.getFoldersByName(name),found=[];
   while(it.hasNext()){const f=it.next();if(!f.isTrashed())found.push(f);if(found.length>1)break;}
   return {count:found.length,folder:found.length===1?found[0]:null};
  }
  const site=unique_(root,safe),manager=site.folder?unique_(site.folder,'Manager'):{count:0,folder:null};
  const backup=manager.folder?unique_(manager.folder,'Backups'):{count:0,folder:null};
  const strategist=site.folder?unique_(site.folder,'Strategist'):{count:0,folder:null};
  const issues=[];
  if(site.count!==1)issues.push('ブログ名フォルダーが一意ではありません');
  if(manager.count!==1)issues.push('Managerフォルダーが一意ではありません');
  if(backup.count!==1)issues.push('Backupsフォルダーが一意ではありません');
  if(strategist.count>1)issues.push('Strategistフォルダーが重複しています');
  const same=!!site.folder&&site.folder.getId()===current.getId();
  if(!same)issues.push('S3の現在の保存先とブログ名フォルダーが異なります');
  ui.alert('Manager保存先の構造確認',[
   '対象：'+c.siteName,
   'SIMS直下のブログ名フォルダー：'+site.count+'件',
   'Manager：'+manager.count+'件／Backups：'+backup.count+'件',
   'Strategist：'+strategist.count+'件',
   'S3保存先と統一先が同じ：'+(same?'はい':'いいえ'),
   '構造確認：'+(issues.length?'HOLD（要確認）':'構造上の矛盾なし'),
   issues.length?'確認事項：\n・'+issues.join('\n・'):'',
   '移行許可：HOLD（Manager固有の保存先bindingは未照合）',
   '※Manager v9.2.4の正式な保存先IDはManager自身のDocumentPropertiesにあり、S3からは直接読めません。',
   '※この機能は読取専用です。フォルダー作成・移動・設定変更はしません。'
  ].filter(Boolean).join('\n'),ui.ButtonSet.OK);
 }catch(e){ui.alert('Manager保存先構造確認：'+String(e.message||e));}
}


/** P85: Read-only staged-copy plan. No Drive mutations; actual migration remains disabled. */
function sssP85StageCopyPlan(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_(),m=sssDriveFolderMap_();
  if(!c.lockedAt||!m)throw new Error('サイト固定と保存先登録が必要です。');
  sssDriveVerifyMap_(m);
  const root=sssDriveGetFolder_(m.rootId),source=sssDriveGetFolder_(m.strategistId);
  const blog=String(c.siteName||'').replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  if(!blog)throw new Error('ブログ名が空欄です。');
  const candidates=root.getFoldersByName(blog);let target=null,count=0;
  while(candidates.hasNext()){const f=candidates.next();if(!f.isTrashed()){target=f;count++;if(count>1)break;}}
  if(count!==1)throw new Error('SBMのブログ名フォルダーが一意ではありません（'+count+'件）。');
  const manager=target.getFoldersByName('Manager');
  if(!manager.hasNext())throw new Error('移行先にManagerフォルダーがありません。');
  manager.next();if(manager.hasNext())throw new Error('Managerフォルダーが重複しています。');
  const same=target.getId()===m.siteIdFolder;
  const existing=target.getFoldersByName('Strategist');let existingCount=0;
  while(existing.hasNext()){existing.next();existingCount++;if(existingCount>1)break;}
  if(!same&&existingCount)throw new Error('移行先にStrategistフォルダーが存在します。自動上書き・合流は禁止です。');
  const stats={files:0,folders:0,bytes:0,items:0};
  const queue=[source],MAX=20000;
  while(queue.length){
   const folder=queue.shift();stats.items++;
   if(stats.items>MAX)throw new Error('監査上限に達しました。移行計画は保留です。');
   const files=folder.getFiles();while(files.hasNext()){
    const file=files.next();if(file.isTrashed())continue;
    stats.files++;stats.items++;stats.bytes+=Number(file.getSize())||0;
    if(stats.items>MAX)throw new Error('監査上限に達しました。移行計画は保留です。');
   }
   const children=folder.getFolders();while(children.hasNext()){
    const child=children.next();if(child.isTrashed())continue;
    stats.folders++;queue.push(child);
   }
  }
  ui.alert('ブログ名フォルダー移行計画（読取専用）',[
   'サイト：'+c.siteName,'移行元：'+source.getName()+' / '+source.getId(),
   '移行先：SIMS ＞ '+blog+' ＞ Strategist',
   '対象：'+stats.files+'ファイル／'+stats.folders+'サブフォルダー',
   '合計：'+stats.bytes+'バイト',
   '移行先Strategist：'+existingCount+'件',
   same?'既に同じ保存先です。':'コピー候補の構造監査は完了しました。',
   '実行判定：HOLD（コピー・検証・切替は未実装）',
   'この画面はファイル・フォルダー・設定を変更しません。'
  ].join('\n'),ui.ButtonSet.OK);
 }catch(e){ui.alert('移行計画：HOLD\n'+String(e.message||e));}
}


/** P86: staged copy prototype. Explicit invocation only; not in the user menu.
 * Copies at most ONE source file per invocation. Never switches bindings or deletes data.
 * A staged file is considered copied only after byte-level SHA-256 verification.
 * Files larger than 10 MiB are held for a later streaming/batched implementation.
 */
const SSS_P86_STATE='SSS_P86_STAGING_V1';
function sssP86Digest_(blob){
 const bytes=blob.getBytes();
 return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,bytes)
  .map(function(x){return ('0'+(x&255).toString(16)).slice(-2);}).join('');
}
function sssP86OneCopy(){
 const ui=SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();
 if(!lock.tryLock(1000))throw new Error('他の処理が実行中です。');
 try{
  const c=sssConfig_(),m=sssDriveFolderMap_();
  if(!c.lockedAt||!m)throw new Error('サイト設定と保存先が必要です。');
  sssDriveVerifyMap_(m);
  const root=sssDriveGetFolder_(m.rootId),source=sssDriveGetFolder_(m.strategistId);
  const name=String(c.siteName||'').replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  if(!name)throw new Error('ブログ名の確認に失敗しました。');
  const blogIt=root.getFoldersByName(name);
  if(!blogIt.hasNext())throw new Error('SBMのブログ名フォルダーがありません。');
  const blog=blogIt.next();if(blogIt.hasNext())throw new Error('同名ブログフォルダーが重複しています。');
  if(blog.getId()===m.siteIdFolder)throw new Error('保存先は既にブログ名フォルダーです。');
  const manager=blog.getFoldersByName('Manager');
  if(!manager.hasNext())throw new Error('Managerフォルダーがありません。');
  manager.next();if(manager.hasNext())throw new Error('Managerフォルダーが重複しています。');
  if(blog.getFoldersByName('Strategist').hasNext())throw new Error('移行先にStrategistフォルダーが既に存在します。');
  const prop=sssProperties_(),raw=prop.getProperty(SSS_P86_STATE);
  let state=raw?JSON.parse(raw):null;
  const stagingName='Strategist-Migration-Staging';
  const stageIt=blog.getFoldersByName(stagingName);
  let stage;
  if(state){
   if(state.siteId!==c.siteId||state.propertyUri!==c.propertyUri||state.sourceId!==source.getId()||state.blogId!==blog.getId())throw new Error('移行状態とサイト設定が一致しません。');
   if(!stageIt.hasNext())throw new Error('記録済みのステージングフォルダーが見つかりません。');
   stage=stageIt.next();if(stageIt.hasNext()||stage.getId()!==state.stageId)throw new Error('ステージングのIDが一致しません。');
  }else{
   if(stageIt.hasNext())throw new Error('未登録のステージングフォルダーが存在します。');
   if(ui.alert('S3試験コピー','最大1ファイルを検証付きでコピーします。既存の保存先は切り替えません。実行しますか？',ui.ButtonSet.YES_NO)!==ui.Button.YES)return;
   stage=blog.createFolder(stagingName);
   state={siteId:c.siteId,propertyUri:c.propertyUri,sourceId:source.getId(),blogId:blog.getId(),stageId:stage.getId(),createdAt:new Date().toISOString()};
   prop.setProperty(SSS_P86_STATE,JSON.stringify(state));
  }
  const queue=[{folder:source,target:stage}],MAX=20000;let scanned=0;
  while(queue.length){
   const node=queue.shift();if(++scanned>MAX)throw new Error('監査上限に達しました。');
   // Fail closed on ambiguous names before creating or copying anything in this node.
   const sourceFileNames={};
   const fileScan=node.folder.getFiles();
   while(fileScan.hasNext()){
    const item=fileScan.next();if(item.isTrashed())continue;
    const key=item.getName();
    if(Object.prototype.hasOwnProperty.call(sourceFileNames,key))throw new Error('移行元に同名ファイルが複数あります：'+key);
    sourceFileNames[key]=true;
   }
   const sourceFolderNames={};
   const folderScan=node.folder.getFolders();
   while(folderScan.hasNext()){
    const item=folderScan.next();if(item.isTrashed())continue;
    const key=item.getName();
    if(Object.prototype.hasOwnProperty.call(sourceFolderNames,key))throw new Error('移行元に同名サブフォルダーが複数あります：'+key);
    sourceFolderNames[key]=true;
   }
   const fs=node.folder.getFiles();
   while(fs.hasNext()){ 
    const f=fs.next();if(f.isTrashed())continue;
    if(++scanned>MAX)throw new Error('監査上限に達しました。');
    const matches=node.target.getFilesByName(f.getName());
    if(matches.hasNext()){
     const old=matches.next();if(matches.hasNext())throw new Error('同名ファイルが重複しています：'+f.getName());
     if(f.getSize()>10*1024*1024)throw new Error('大容量ファイルは未対応です：'+f.getName());
     if(old.getSize()!==f.getSize()||sssP86Digest_(old.getBlob())!==sssP86Digest_(f.getBlob()))throw new Error('コピー済みファイルの内容が異なります：'+f.getName());
     continue;
    }
    if(node.target.getFoldersByName(f.getName()).hasNext())throw new Error('移行先でファイル名とフォルダー名が衝突：'+f.getName());
    if(f.getSize()>10*1024*1024)throw new Error('10MiB超のファイルは保留：'+f.getName());
    const blob=f.getBlob(),hash=sssP86Digest_(blob);
    const copied=node.target.createFile(blob).setName(f.getName());
    if(copied.getSize()!==f.getSize()||sssP86Digest_(copied.getBlob())!==hash)throw new Error('コピー後の内容照合に失敗：'+f.getName());
    ui.alert('検証付きコピー完了','1ファイルをコピー・SHA-256照合しました：'+f.getName()+'\n保存先切替は行っていません。',ui.ButtonSet.OK);
    return;
   }
   const folders=node.folder.getFolders();
   while(folders.hasNext()){
    const sub=folders.next();if(sub.isTrashed())continue;
    const it=node.target.getFoldersByName(sub.getName());let target;
    if(it.hasNext()){target=it.next();if(it.hasNext())throw new Error('同名サブフォルダーが重複しています：'+sub.getName());}
    else {
     if(node.target.getFilesByName(sub.getName()).hasNext())throw new Error('移行先でフォルダー名とファイル名が衝突：'+sub.getName());
     target=node.target.createFolder(sub.getName());
    }
    queue.push({folder:sub,target:target});
   }
  }
  ui.alert('ステージング照合完了','対象ファイルはすべて照合済みです。ただし保存先切替は未実装です。',ui.ButtonSet.OK);
 }finally{lock.releaseLock();}
}


/** P88: read-only full staging verification. Never creates folders, copies files,
 * changes bindings or authorizes cutover. Fail closed on any ambiguous name.
 * Uses DriveApp blob reads; large objects are HOLD, not silently skipped.
 */
function sssP88VerifyStaging(){
 const ui=SpreadsheetApp.getUi();
 try{
  const c=sssConfig_(),m=sssDriveFolderMap_();
  if(!c.lockedAt||!m)throw new Error('サイト設定と保存先が必要です。');
  sssDriveVerifyMap_(m);
  const prop=sssProperties_(),raw=prop.getProperty(SSS_P86_STATE);
  if(!raw)throw new Error('ステージング状態が登録されていません。');
  const state=JSON.parse(raw);
  if(state.siteId!==c.siteId||state.propertyUri!==c.propertyUri||state.sourceId!==m.strategistId)
   throw new Error('移行状態とサイト設定が一致しません。');
  const root=sssDriveGetFolder_(m.rootId),source=sssDriveGetFolder_(m.strategistId);
  const name=String(c.siteName||'').replace(/[\\/:*?"<>|]/g,'-').slice(0,75);
  const blogs=root.getFoldersByName(name);
  if(!blogs.hasNext())throw new Error('ブログ名フォルダーがありません。');
  const blog=blogs.next();if(blogs.hasNext()||blog.getId()!==state.blogId)throw new Error('ブログフォルダーID不一致または重複。');
  const stages=blog.getFoldersByName('Strategist-Migration-Staging');
  if(!stages.hasNext())throw new Error('ステージングフォルダーがありません。');
  const stage=stages.next();if(stages.hasNext()||stage.getId()!==state.stageId)throw new Error('ステージングフォルダーID不一致または重複。');
  const MAX_ITEMS=20000,MAX_BYTES=10*1024*1024;
  let total=0,files=0,folders=0,bytes=0;
  function inventory(base){
   const out={},queue=[{folder:base,path:''}];
   while(queue.length){
    const node=queue.shift();if(++total>MAX_ITEMS)throw new Error('検証件数の上限に達しました。');
    const names={};
    const fit=node.folder.getFiles();
    while(fit.hasNext()){
     const f=fit.next();if(f.isTrashed())continue;
     if(++total>MAX_ITEMS)throw new Error('検証件数の上限に達しました。');
     const n=f.getName();if(names[n])throw new Error('同一階層に同名項目があります：'+node.path+n);names[n]=true;
     const size=f.getSize();if(size>MAX_BYTES)throw new Error('10MiB超のファイルがあり検証を保留：'+node.path+n);
     out[node.path+n]={kind:'file',size:size,digest:sssP86Digest_(f.getBlob())};
    }
    const dit=node.folder.getFolders();
    while(dit.hasNext()){
     const d=dit.next();if(d.isTrashed())continue;
     if(++total>MAX_ITEMS)throw new Error('検証件数の上限に達しました。');
     const n=d.getName();if(names[n])throw new Error('同一階層に同名項目があります：'+node.path+n);names[n]=true;
     const path=node.path+n+'/';out[path]={kind:'folder'};queue.push({folder:d,path:path});
    }
   }
   return out;
  }
  const a=inventory(source),b=inventory(stage);
  const ak=Object.keys(a),bk=Object.keys(b);
  const missing=ak.filter(k=>!Object.prototype.hasOwnProperty.call(b,k));
  const extra=bk.filter(k=>!Object.prototype.hasOwnProperty.call(a,k));
  const different=ak.filter(k=>Object.prototype.hasOwnProperty.call(b,k)&&
    (a[k].kind!==b[k].kind||a[k].size!==b[k].size||a[k].digest!==b[k].digest));
  files=ak.filter(k=>a[k].kind==='file').length;
  folders=ak.length-files;
  bytes=ak.reduce((n,k)=>n+(a[k].size||0),0);
  const ok=!missing.length&&!extra.length&&!different.length;
  ui.alert('ステージング全件照合（読取専用）',[
   '判定：'+(ok?'全件一致（切替は未許可）':'HOLD'),
   '移行元：'+files+'ファイル／'+folders+'フォルダー／'+bytes+'バイト',
   '不足：'+missing.length+'／余分：'+extra.length+'／不一致：'+different.length,
   (missing[0]?'不足例：'+missing[0]:''),(extra[0]?'余分例：'+extra[0]:''),(different[0]?'不一致例：'+different[0]:''),
   'この検証は保存先の切替・ファイルの変更を行いません。'
  ].filter(Boolean).join('\n'),ui.ButtonSet.OK);
 }catch(e){ui.alert('ステージング検証：HOLD\n'+String(e.message||e));}
}
