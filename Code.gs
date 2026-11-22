/** SIMS Site Strategist v0.1.194 | M4/M5 growth strategy foundation. */
const SSS_VERSION = '0.1.194';
const SSS_PREFIX = 'SSS_';
const SSS_CONFIG_SHEET = 'SiteConfig';
const SSS_AUDIT_SHEET = 'AuditLog';

/**
 * Stable user-facing entry points. Development-only operations remain in the
 * separate S3｜開発・試験 menu until their full workflows pass acceptance tests.
 * No new data mutations or article actions are introduced by this menu.
 */
function sssAddOperationalMenu_() {
  const ui = SpreadsheetApp.getUi();
  const diagnosis = ui.createMenu('ブログ総合診断')
    .addItem('総合診断を開く', 'sssM3IntegratedDialog');
  const structure = ui.createMenu('サイト構造最適化')
    .addItem('関連記事候補を分析', 'sssM2Preview')
    .addItem('検索意図・競合を精査', 'sssM2PilotDialog');
  const growth = ui.createMenu('既存ブログの成長戦略')
    .addItem('検索戦略をまとめて分析', 'sssM3StrategyDialog');
  const collection = ui.createMenu('データ収集・更新')
    .addItem('分析データを更新', 'sssM1RefreshEvidence')
    .addItem('データの状態・品質を確認', 'sssM1EvidenceStatus')
    .addItem('GSCデータを収集（365日）', 'sssCollect365')
    .addItem('収集状況を確認', 'sssCollectionStatus');
  const settings = ui.createMenu('設定・メンテナンス')
    .addItem('初回セットアップ', 'sssSetupWizard')
    .addItem('登録サイトを確認', 'sssShowSite')
    .addItem('ブログ別保存先を準備・確認', 'sssSetupDriveFolders');
  ui.createMenu('S3｜サイト戦略')
    .addItem('ホームを開く', 'sssHome')
    .addSeparator()
    .addSubMenu(diagnosis)
    .addSubMenu(structure)
    .addSubMenu(growth)
    .addSeparator()
    .addSubMenu(collection)
    .addSubMenu(settings)
    .addToUi();
}

function onOpen() {

  sssRefreshVersion_();
  sssAddOperationalMenu_();
  if (PropertiesService.getScriptProperties().getProperty('S3_SHOW_DEV_MENU') === 'true') SpreadsheetApp.getUi().createMenu('S3｜開発・試験')
    .addItem('Homeを開く', 'sssHome')
    .addItem('SBM向け戦略提案を出力（試験）', 'sssStrategyProposalDialog')
    .addItem('全記事台帳の照合（読取専用）', 'sssM1Preview')
    .addItem('関連記事候補の分析（試験）', 'sssM2Preview')
    .addItem('検索意図・競合精査（試験）', 'sssM2PilotDialog')
    .addItem('精査済み候補の確認（試験）', 'sssM2CandidatePreview')
    .addItem('ブログ総合診断・基礎集計（試験）', 'sssM3Preview')
    .addItem('ブログ総合診断（試験・自動進行）', 'sssM3PilotDialog')
    .addItem('サイト全体の検索クエリを確認（試験）', 'sssM3SiteQueryDialog')
    .addItem('検索語と既存記事の関連候補（試験）', 'sssM3SiteQueryCoverageDialog')
    .addItem('検索語×実績ページの確認（試験）', 'sssM3QueryPageDialog')
    .addItem('検索語の役割・競合候補を確認（試験）', 'sssM3RoleReviewDialog')
    .addItem('検索戦略をまとめて分析（試験）', 'sssM3StrategyDialog')
    .addItem('保存済み検索戦略とSBM状態を照合（試験）', 'sssM3StrategyRoutingDialog')
    .addItem('追加調査の証拠を自動収集（試験）', 'sssM3ResearchEvidenceDialog')
    .addItem('期間別GSC・SBM履歴を照合（試験）', 'sssM3ResearchTimelineDialog')
    .addItem('追加調査の証拠を統合確認（試験）', 'sssM3EvidencePackageDialog')
    .addItem('記事本文の証拠を確認（試験）', 'sssM3BodyEvidenceDialog')
    .addItem('複数記事の本文を比較（試験）', 'sssM3BodyCompareDialog')
    .addItem('保存済み記事役割とSBM状態を照合（試験）', 'sssM3RoleLiveDialog')
    .addItem('検索語を個別に深掘り（試験）', 'sssM3QueryDeepDiveDialog')
    .addItem('分析データを更新', 'sssM1RefreshEvidence')
    .addItem('分析データの状態・品質を確認', 'sssM1EvidenceStatus')
    .addItem('初回セットアップ', 'sssSetupWizard')
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
// v0.1.91: resumable, single-dialog setup. Existing site binding is immutable.
function sssWizardStatus_(){
  const c=sssConfig_(),map=sssDriveFolderMap_();
  return {locked:!!c.lockedAt,siteName:c.siteName||'',propertyUri:c.propertyUri||'',siteId:c.siteId||'',storageReady:!!map,folderName:map?map.siteFolderName:'',version:SSS_VERSION};
}
function sssWizardSites_(){return sssListProperties().map(x=>({uri:x.uri,permission:x.permission}));}
function sssWizardBind_(uri,name){
  const c=sssConfig_();if(c.lockedAt)throw new Error('サイトはすでに固定されています。');
  name=String(name||'').trim();if(!name||name.length>100)throw new Error('ブログ名を1～100文字で入力してください。');
  sssBindSite_(String(uri||''),name);return sssWizardStatus_();
}
function sssWizardManagerId_(value){
  const v=String(value||'').trim();
  const match=v.match(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]{25,120})(?:[/?#]|$)/);
  const id=match?match[1]:v;
  if(!/^[A-Za-z0-9_-]{25,120}$/.test(id))throw new Error('SBMのスプレッドシートURL、またはIDを入力してください。');
  return id;
}
function sssWizardCheckManager_(value){
  const c=sssConfig_();if(!c.lockedAt)throw new Error('先にサイトを登録してください。');
  const info=sssCheckManagerIdentityForSetup_(sssWizardManagerId_(value),c);
  return {blogName:info.blogName,blogUrl:info.blogUrl,managerSpreadsheetId:info.managerSpreadsheetId};
}
function sssWizardCreateStorage_(value){
  const c=sssConfig_();if(!c.lockedAt)throw new Error('先にサイトを登録してください。');
  const old=sssDriveFolderMap_();if(old){sssDriveVerifyMap_(old);sssEnsureDetailedFolder_();return sssWizardStatus_();}
  const run=sdscGetRun_();if(run&&['RUNNING','PAUSED_AUTO_RESUME','ERROR'].includes(run.status))throw new Error('収集が未完了です。');
  const lock=LockService.getDocumentLock();if(!lock.tryLock(30000))throw new Error('別の設定処理が実行中です。');
  try{
    const prior=sssDriveFolderMap_();if(prior){sssDriveVerifyMap_(prior);sssEnsureDetailedFolder_();return sssWizardStatus_();}
    const safeName=c.siteName.replace(/[\\/:*?"<>|]/g,'-').trim().slice(0,75);
    if(!safeName||safeName==='.'||safeName==='..')throw new Error('ブログ名が保存先に使えません。');
    const roots=DriveApp.getRootFolder().getFoldersByName('SIMS');
    if(!roots.hasNext())throw new Error('SBMのSIMSフォルダーがありません。先にSBMをセットアップしてください。');
    const root=roots.next();if(roots.hasNext())throw new Error('SIMSフォルダーが複数あります。');
    const matches=root.getFoldersByName(safeName);
    if(!matches.hasNext())throw new Error('SBMのブログフォルダーがありません。先にSBMをセットアップしてください。');
    const site=matches.next();if(matches.hasNext())throw new Error('同名ブログフォルダーが複数あります。');
    const managers=site.getFoldersByName('Manager');
    if(!managers.hasNext())throw new Error('SBMのManagerフォルダーがありません。');
    managers.next();if(managers.hasNext())throw new Error('Managerフォルダーが複数あります。');
    const info=sssCheckManagerIdentityForSetup_(sssWizardManagerId_(value),c);
    const stratMatches=site.getFoldersByName('Strategist');
    if(stratMatches.hasNext())throw new Error('既存のStrategistフォルダーがあります。自動共用しません。');
    const strat=site.createFolder('Strategist');
    const ev=sssDriveChild_(strat,'Evidence');
    const baseline=sssDriveChild_(ev,'Baseline'),delta=sssDriveChild_(ev,'Delta'),archive=sssDriveChild_(ev,'Archive');
    const reports=sssDriveChild_(strat,'Reports'),exp=sssDriveChild_(strat,'Export');
    const map={siteId:c.siteId,propertyUri:c.propertyUri,siteFolderName:safeName,rootId:root.getId(),siteIdFolder:site.getId(),strategistId:strat.getId(),evidenceId:ev.getId(),baselineId:baseline.getId(),deltaId:delta.getId(),archiveId:archive.getId(),reportsId:reports.getId(),exportId:exp.getId()};
    sssDriveVerifyMap_(map);
    sssProperties_().setProperty(SSS_DRIVE_PROP,JSON.stringify(map));
    sssM1SaveManager_(info,c);
    sssEnsureDetailedFolder_();
    sssAudit_('DRIVE_FOLDERS_CONFIGURED',c.siteId,'strategistFolderId='+strat.getId()+'; managerChecked=true; source=wizard');
    return sssWizardStatus_();
  }finally{lock.releaseLock();}
}
// Public HTML-service entrypoints. Functions ending in underscore are private to google.script.run.
function sssWizardStatus(){return sssWizardStatus_();}
function sssWizardSites(){return sssWizardSites_();}
function sssWizardBind(uri,name){return sssWizardBind_(uri,name);}
function sssWizardCheckManager(value){return sssWizardCheckManager_(value);}
function sssWizardCreateStorage(value){return sssWizardCreateStorage_(value);}
// Single-file distribution: HTML is embedded at build time; no separate HTML file required.
const SSS_SETUP_WIZARD_HTML_ = "<!doctype html><html><head><base target=\"_top\"><meta charset=\"utf-8\"><style>\nbody{font:14px Arial,'Noto Sans JP',sans-serif;color:#202124;padding:20px;margin:0}h2{margin:0 0 8px}p{line-height:1.6}.muted{color:#60646c}.steps{display:flex;gap:6px;margin:16px 0}.step{flex:1;background:#e8eaed;border-radius:8px;padding:8px 4px;text-align:center;font-size:11px}.step.done{background:#e3f2e8}.step.active{background:#dbeafe;font-weight:bold}.panel{background:#f7f8fa;border-radius:10px;padding:18px;min-height:200px}label{display:block;font-weight:bold;margin:12px 0 5px}input,select{box-sizing:border-box;width:100%;padding:11px;border:1px solid #aab0b6;border-radius:6px;background:white;font-size:14px}.actions{display:flex;justify-content:space-between;margin-top:18px}button{padding:10px 18px;border:0;border-radius:6px;cursor:pointer;background:#1769aa;color:white}button.secondary{background:#e8eaed;color:#202124}button:disabled{opacity:.45;cursor:default}.error{color:#b3261e;white-space:pre-wrap;margin-top:12px}.ok{color:#137333}.tiny{font-size:12px}.path{padding:10px;background:white;border-radius:5px;overflow-wrap:anywhere}\n</style></head><body><h2>S3 初回セットアップ</h2><div class=\"muted tiny\">設定済みの項目は引き継ぎ、未完了のところから再開します。</div><div class=\"steps\" id=\"steps\"></div><div id=\"panel\" class=\"panel\">設定を確認しています…</div><div class=\"error\" id=\"error\" role=\"alert\"></div><button class=\"secondary\" id=\"retry\" style=\"display:none;margin-top:10px\" onclick=\"init()\">再試行</button><div class=\"actions\"><button class=\"secondary\" id=\"back\" onclick=\"back()\">戻る</button><button id=\"next\" onclick=\"next()\">次へ</button></div>\n<script>\nlet status=null,sites=[],step=0,manager=null,busy=false;\nconst titles=['GSCサイト','ブログ名','SBM接続','保存先','完了'];\nfunction el(id){return document.getElementById(id)}\nfunction safe(t){return String(t||'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]))}\nlet requestToken=0;\nfunction error(e){busy=false;el('error').textContent=(e&&e.message)||String(e);el('retry').style.display='inline-block';if(!status){el('panel').textContent='設定を取得できませんでした。再試行してください。';el('next').disabled=true;}else draw()}\nfunction invoke(fn,args,done){\n  const token=++requestToken;busy=true;el('error').textContent='';el('retry').style.display='none';draw();\n  // Timeout is a UI notice, not cancellation of the server operation. Never retry writes automatically.\n  const timeout=setTimeout(()=>{if(token!==requestToken)return;el('error').textContent='応答に時間がかかっています。処理状況を確認してください。書き込み操作の場合は重複実行せず、画面を閉じて再開してください。';},30000);\n  try{\n    const runner=google.script.run.withFailureHandler(e=>{if(token!==requestToken)return;clearTimeout(timeout);error(e)}).withSuccessHandler(x=>{if(token!==requestToken)return;clearTimeout(timeout);busy=false;try{done(x)}catch(e){error(e)}});\n    runner[fn].apply(runner,args||[]);\n  }catch(e){clearTimeout(timeout);error(e)}\n}\nfunction init(){invoke('sssWizardStatus',[],s=>{status=s;if(s.storageReady)step=4;else if(s.locked)step=2;else step=0; if(!s.locked)loadSites();else draw()})}\nfunction loadSites(){invoke('sssWizardSites',[],v=>{sites=v||[];draw()})}\nfunction draw(){if(!status)return;el('steps').innerHTML=titles.map((t,i)=>'<div class=\"step '+(i<step?'done':i===step?'active':'')+'\">'+(i<step?'✓ ':'')+safe(t)+'</div>').join('');let h='';\nif(step===0){h='<h3>1. GSCの対象サイトを選択</h3><p>Search Consoleに登録されているサイトを選んでください。</p><label>対象サイト</label><select id=\"site\">'+sites.map(x=>'<option value=\"'+safe(x.uri)+'\">'+safe(x.uri)+'</option>').join('')+'</select>';if(!sites.length)h+='<p>サイトを読み込めませんでした。権限を確認してください。</p>'}\nif(step===1){h='<h3>2. ブログ名を入力</h3><p>SBMで登録したブログ名と同じ名前を入力してください。</p><label>ブログ名</label><input id=\"blog\" maxlength=\"100\" placeholder=\"例：ガジェット探検記\"><p class=\"muted tiny\">確定後は通常操作で変更できません。</p>'}\nif(step===2){h='<h3>3. SBMとの接続</h3><p>SBMのスプレッドシートを開き、ブラウザのアドレス欄からURLをコピーして貼り付けてください。IDだけでも入力できます。</p><div class=\"path\">登録サイト：'+safe(status.siteName)+'<br>GSC：'+safe(status.propertyUri)+'</div><label>SBMのスプレッドシートURLまたはID</label><input id=\"manager\" placeholder=\"https://docs.google.com/spreadsheets/d/…/edit\"><p class=\"muted tiny\">ブログ名・GSCプロパティ・URL範囲を照合します。SBMのデータは変更しません。</p>';if(manager)h+='<p class=\"ok\">照合済み：'+safe(manager.blogName)+'（'+safe(manager.blogUrl)+'）</p>'}\nif(step===3){h='<h3>4. 保存先を確認</h3><p class=\"ok\">SBMのサイト設定と一致しています。</p><div class=\"path\">SIMS ／ '+safe(status.siteName)+' ／ Strategist</div><p>SBMの既存ブログフォルダー内に、S3専用のStrategistフォルダーを作成します。既存データは移動・削除しません。</p><p class=\"muted tiny\">既存のStrategistがある場合や、フォルダー名が重複している場合は停止します。</p>'}\nif(step===4){h='<h3 class=\"ok\">セットアップ完了</h3><p>対象：'+safe(status.siteName)+'</p><p>GSC：'+safe(status.propertyUri)+'</p><div class=\"path\">保存先：SIMS ／ '+safe(status.folderName)+' ／ Strategist</div><p>メニューからGSCデータ収集を開始できます。</p>'}\nel('panel').innerHTML=h;el('back').disabled=busy||step===0||status.storageReady||status.locked&&step<=2;el('next').disabled=busy||(step===0&&!sites.length);el('next').textContent=step===4?'閉じる':step===2?'SBMを照合':step===3?'保存先を確定':'次へ';}\nfunction back(){if(step>0&&!busy){step--;draw()}}\nfunction next(){if(busy)return;if(step===0){const v=el('site').value;if(!v)return;window.selectedSite=v;step=1;draw();return}if(step===1){const name=el('blog').value.trim();if(!name){el('error').textContent='ブログ名を入力してください。';return}if(!confirm('次のサイトを固定します。確定後は通常操作で変更できません。\\n'+selectedSite+'\\n'+name+'\\n続行しますか？'))return;invoke('sssWizardBind',[selectedSite,name],s=>{status=s;step=2;draw()});return}if(step===2){const value=el('manager').value.trim();if(!value){el('error').textContent='SBMのURLまたはIDを入力してください。';return}invoke('sssWizardCheckManager',[value],x=>{manager=x;step=3;draw()});return}if(step===3){if(!manager){el('error').textContent='SBMの照合が必要です。';return}if(!confirm('SBMの既存ブログフォルダー内にStrategistを作成します。よろしいですか？'))return;invoke('sssWizardCreateStorage',[manager.managerSpreadsheetId],s=>{status=s;step=4;draw()});return}google.script.host.close()}\ninit();\n</script></body></html>\n";
function sssSetupWizard(){
  const html=HtmlService.createHtmlOutput(SSS_SETUP_WIZARD_HTML_).setWidth(670).setHeight(590);
  SpreadsheetApp.getUi().showModalDialog(html,'S3 初回セットアップ');
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
// v0.1.97: Ensure a single Detailed folder in the verified S3 Evidence tree.
// Never search globally, adopt a different site, or alter existing ZIPs.
function sssEnsureDetailedFolder_(){
  const c=sssConfig_();
  if(!c.lockedAt||!c.siteId||!c.propertyUri)throw new Error('サイト固定が必要です。');
  const map=sssDriveFolderMap_();
  if(!map)throw new Error('ブログ別保存先がありません。初回セットアップを完了してください。');
  sssDriveVerifyMap_(map);
  const evidence=sssDriveGetFolder_(map.evidenceId);
  return sssDriveChild_(evidence,'Detailed');
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
  if(existing){sssDriveVerifyMap_(existing);sssEnsureDetailedFolder_();ui.alert('保存先は設定済みです。\nSIMS ＞ '+existing.siteFolderName+' ＞ Strategist\n'+sssDriveGetFolder_(existing.strategistId).getUrl()+'\n※既存の保存先は自動変更しません。新規収集には新しい開発用シートを使用してください。');return;}
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
    sssEnsureDetailedFolder_();
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
  const c=sssConfig_();
  if(!c.lockedAt || !c.siteId || !c.propertyUri || !c.siteName) throw new Error('収集対象のサイト固定情報が不足しています。初回セットアップを確認してください。');
  const collector=sssSyncCollectorConfig_();
  if(collector.siteUrl!==c.propertyUri || collector.siteName!==c.siteName) throw new Error('S3とCollectorの収集対象が一致しません。処理を停止しました。');
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
// v0.1.98: one-minute recurring continuation trigger; lock prevents overlap.
// v0.1.37: durable repeating continuation trigger. A forced timeout must not
// consume the only future execution. Only the dedicated handler is managed.
function sssAutoSchedule_(){
  const own=ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()===SSS_AUTO_HANDLER_);
  if(own.length===1)return;
  if(own.length>1)throw new Error('専用トリガーが複数あります。安全のため停止しました。');
  ScriptApp.newTrigger(SSS_AUTO_HANDLER_).timeBased().everyMinutes(1).create();
}
function sssAutoStopInternal_(reason){
  const s=sssAutoState_();
  if(s){s.status=reason;s.updatedAt=new Date().toISOString();sssAutoSave_(s);}
  sssAutoClearTriggers_();
  return s;
}
function sssStartAutoDetailedPilot(){
  const ui=SpreadsheetApp.getUi(),lock=LockService.getDocumentLock();
  if(!lock.tryLock(1000)){ui.alert('他の処理が実行中です。');return false;}
  try{
    const old=sssAutoState_();
    if(old&&old.status==='RUNNING'){ui.alert('自動収集が既に実行中です。状態確認メニューをご利用ください。');return;}
    sssEnsureDetailedFolder_();
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
  if(!lock.tryLock(1000)){ui.alert('他の処理が実行中です。');return false;}
  try{
    const old=sssAutoState_();
    if(old&&old.status==='RUNNING')throw new Error('自動収集が既に進行中です。');
    sssEnsureDetailedFolder_();
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
function sssP72ParseUrl_(raw){
  // Apps Script V8 does not provide the WHATWG URL constructor.
  // Accept only absolute HTTP(S) URLs; reject userinfo, fragments, malformed hosts and ports.
  const value=String(raw||'').trim();
  const match=/^(https?):\/\/([^\/?#]+)(\/[^?#]*)?(\?[^#]*)?$/i.exec(value);
  if(!match)return null;
  const scheme=match[1].toLowerCase(),authority=match[2];
  if(authority.indexOf('@')!==-1||/\s/.test(authority))return null;
  const hostMatch=/^([a-z0-9.-]+)(?::([0-9]{1,5}))?$/i.exec(authority);
  if(!hostMatch)return null;
  const host=hostMatch[1].toLowerCase().replace(/\.$/,'');
  if(!host||host.startsWith('.')||host.includes('..')||!host.includes('.'))return null;
  const port=hostMatch[2]||'';
  if(port&&(+port<1||+port>65535))return null;
  const effectivePort=port&&!(scheme==='https'&&port==='443')&&!(scheme==='http'&&port==='80')?':'+port:'';
  return {origin:scheme+'://'+host+effectivePort,host:host,path:match[3]||'/',query:match[4]||''};
}
/** Domain property covers host and subdomains; URL-prefix property covers exact scheme, host, port and literal path/query prefix. */
function sssP72PropertyScope_(uri){
  const value=String(uri||'').trim();
  if(/^sc-domain:/i.test(value)){
    const host=value.slice(10).toLowerCase().replace(/\.$/,'');
    return /^[a-z0-9.-]+$/.test(host)&&host.indexOf('.')>0?{kind:'domain',host:host}:null;
  }
  const parsed=sssP72ParseUrl_(value);
  return parsed?{kind:'prefix',origin:parsed.origin,path:parsed.path,query:parsed.query}:null;
}
function sssP72WithinScope_(raw,scope){
  const parsed=sssP72ParseUrl_(raw);
  if(!parsed||!scope)return false;
  if(scope.kind==='domain')return parsed.host===scope.host||parsed.host.endsWith('.'+scope.host);
  if(scope.kind!=='prefix'||parsed.origin!==scope.origin)return false;
  return (parsed.path+parsed.query).startsWith(scope.path+scope.query);
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

// Shared article identity: ported from SBM v9.3.93 sbmNormalizeUrl_.
function sssArticleUrlKey_(url) {
  var raw = String(url || '').trim();
  if (!raw) return '';
  if (/^sc-domain:/i.test(raw)) return raw.toLowerCase();

  // Official: URL比較・保存の共通Canonical Key。
  // Search Console/CMSで末尾スラッシュの有無が異なっても同一記事として扱う。
  // 運用シートでは「ルート以外は末尾スラッシュなし」に統一し、GSCの生データ表現には依存しない。
  raw = raw.split('#')[0].split('?')[0].trim();
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw.replace(/^\/+/, '');

  var m = raw.match(/^(https?):\/\/([^\/]+)(\/.*)?$/i);
  if (!m) return raw;
  var scheme = String(m[1] || 'https').toLowerCase();
  var authority = String(m[2] || '').toLowerCase();
  if (scheme === 'https') authority = authority.replace(/:443$/, '');
  if (scheme === 'http') authority = authority.replace(/:80$/, '');
  var path = String(m[3] || '/');
  if (path !== '/') path = path.replace(/\/+$/, '');
  return scheme + '://' + authority + path;
}

function sssM1UrlInfo_(raw,scope){
 const value=String(raw||'').trim(), noFragment=value.split('#')[0];
 if(/\s/.test(value)||!sssP72ParseUrl_(noFragment))return {status:'INVALID_URL'};
 if(!sssP72WithinScope_(noFragment,scope))return {status:'OUT_OF_SCOPE'};
 return {status:'VALID',key:sssArticleUrlKey_(value)};
}
function sssM1Join_(articles,pages,scope){
 const ids=new Map(),urls=new Map(),groups=new Map(),gscOnly=[];
 const bump=(m,k)=>m.set(k,(m.get(k)||0)+1);
 const prepared=articles.map(a=>({a,u:sssM1UrlInfo_(a.url,scope)}));
 for(const {a,u} of prepared){if(a.article_id)bump(ids,a.article_id);if(u.key)bump(urls,u.key);}
 for(const [url,metrics] of pages){const u=sssM1UrlInfo_(url,scope);const row={url,metrics,match_status:u.status==='VALID'?'GSC_ONLY':u.status};if(!u.key){gscOnly.push(row);continue;}if(!groups.has(u.key))groups.set(u.key,[]);groups.get(u.key).push(row);if(!urls.has(u.key))gscOnly.push(row);}
 const counts={};const records=prepared.map(({a,u})=>{
  const variants=u.key?groups.get(u.key)||[]:[];let status,metrics=null;
  if(u.status!=='VALID')status=u.status;
  else if(!a.article_id||ids.get(a.article_id)>1||urls.get(u.key)>1)status='AMBIGUOUS';
  else if(variants.length){status='MATCHED';const exact=variants.find(v=>v.url===a.url)||variants.find(v=>v.url===u.key);metrics=exact?exact.metrics:null;}
  else status='SBM_ONLY';
  counts[status]=(counts[status]||0)+1;
  return Object.assign({},a,{canonical_key:u.key||null,match_status:status,metrics,metric_policy:'EXACT_OR_CANONICAL_ONLY',gsc_variants:variants});
 });
 return {records,gscOnly,counts,raw_url_count:pages.size,unmatched_key_count:new Set(gscOnly.map(v=>sssM1UrlInfo_(v.url,scope).key).filter(Boolean)).size,scope};
}
function sssM1Articles_(values){
 const h=values[0].map(x=>String(x).trim());
 const col=(names,required)=>{for(const n of names){const hits=h.filter(x=>x===n).length;if(hits>1)throw new Error('列重複: '+n);if(hits===1)return h.indexOf(n);}if(required)throw new Error('必須列なし: '+names.join('/'));return -1;};
 const id=col(['ArticleID'],true),url=col(['記事URL'],true),title=col(['記事タイトル','H1タイトル'],true),state=col(['作業状態'],true),date=col(['公開日','記事公開日'],false);
 return values.slice(1).map((r,i)=>({r,i})).filter(x=>x.r.some(v=>String(v).trim())).map(x=>({article_id:String(x.r[id]||'').trim(),url:String(x.r[url]||'').trim(),title:String(x.r[title]||''),state:String(x.r[state]||''),published_at:date<0?null:String(x.r[date]||'')||null,source_row:x.i+2}));
}
function sssM1Load_(managerId){
 const c=sssConfig_();if(!c.lockedAt||!c.siteId)throw new Error('サイト固定が必要です。');
 sssCheckManagerIdentityForSetup_(managerId,c);
 const scope=sssP72PropertyScope_(c.propertyUri);if(!scope)throw new Error('対象範囲不明');
 const sh=SpreadsheetApp.openById(managerId).getSheetByName('記事管理');
 if(!sh||sh.getLastRow()<1||sh.getLastRow()>10001)throw new Error('記事管理が存在しないか行数上限外です。');
 const articles=sssM1Articles_(sh.getRange(1,1,sh.getLastRow(),sh.getLastColumn()).getDisplayValues());
 const e=sssM1Evidence_(c),result=sssM1Join_(articles,e.pages,scope);
 return Object.assign(result,{schema_version:'s3.inventory.v1',site_id:c.siteId,run_id:Utilities.getUuid(),generated_at:new Date().toISOString(),source_refs:Object.assign({manager_id:managerId},e.refs),limitations:['検索実績未確認はゼロ・未登録を意味しない',...e.limitations]});
}
function sssM1SaveManager_(info,c){
 sssProperties_().setProperty('SSS_M1_MANAGER_'+c.siteId,JSON.stringify({id:info.managerSpreadsheetId,siteId:c.siteId,propertyUri:c.propertyUri}));
}
function sssM1FindManagers_(){
 const c=sssConfig_();if(!c.lockedAt||!c.siteId)throw Error('先にサイトを登録してください。');
 const saved=sssProperties_().getProperty('SSS_M1_MANAGER_'+c.siteId);
 if(saved){try{const x=JSON.parse(saved);if(x.siteId===c.siteId&&x.propertyUri===c.propertyUri)return {site:c.siteName,candidates:[sssM1ManagerCandidate_(x.id,c)],complete:true};}catch(e){/* revalidate through discovery */}}
 const map=sssDriveFolderMap_(), candidates=[],seen=new Set();let complete=true;
 if(map){sssDriveVerifyMap_(map);const site=sssDriveGetFolder_(map.siteIdFolder),folders=site.getFoldersByName('Manager');
 if(folders.hasNext()){const folder=folders.next();if(folders.hasNext())complete=false;else {const files=folder.getFilesByType(MimeType.GOOGLE_SHEETS);let n=0;while(files.hasNext()){if(++n>40){complete=false;break;}const f=files.next();if(f.isTrashed()||seen.has(f.getId()))continue;seen.add(f.getId());try{candidates.push(sssM1ManagerCandidate_(f.getId(),c));}catch(e){}}}}}
 return {site:c.siteName,candidates,complete};
}
function sssM1ManagerCandidate_(id,c){
 const info=sssCheckManagerIdentityForSetup_(id,c),book=SpreadsheetApp.openById(id),sh=book.getSheetByName('記事管理');
 if(!sh||sh.getLastRow()<1)throw Error('記事管理がありません。');
 sssM1Articles_([sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0]]);
 return {id:info.managerSpreadsheetId,name:book.getName(),url:book.getUrl()};
}
function sssM1ConnectionStatus(){return sssM1FindManagers_();}
// Classify URL shapes only; never infer canonical identity or deletion eligibility.
function sssM1ClassifyUrls_(result,scope){
 const known=new Set(result.records.map(a=>a.url));
 const counts={}, examples={};
 for(const row of result.gscOnly){
  const u=sssP72ParseUrl_(row.url.split('#')[0]);let k;
  if(row.match_status==='INVALID_URL'||!u)k='INVALID';
  else if(row.match_status==='OUT_OF_SCOPE')k='OUTSIDE';
  else if(u.query&&known.has(row.url.slice(0,row.url.indexOf('?'))))k='ARTICLE_PARAMETER';
  else if(/^\/archive(?:\/|$)/.test(u.path))k='ARCHIVE';
  else if(/^\/(?:category|tag)(?:\/|$)/.test(u.path))k='CATEGORY';
  else if(/^\/(?:search|page)(?:\/|$)/.test(u.path))k='LIST_SEARCH';
  else if(u.path==='/')k='HOME';
  else if(u.query)k='OTHER_PARAMETER';
  else if(/\.hatenablog\.(?:com|jp)$|\.hateblo\.jp$|\.hatenadiary\.com$/.test(u.host)&&/^\/entry\/[^/]/.test(u.path))k='ARTICLE_CANDIDATE';
  else k='UNKNOWN';
  counts[k]=(counts[k]||0)+1;if(!examples[k])examples[k]=[];if(examples[k].length<2)examples[k].push(row.url);
 }
 return {counts,examples};
}
function sssM1ResultText_(x){
 const labels={MATCHED:'検索実績と照合済み',SBM_ONLY:'検索実績未確認',AMBIGUOUS:'重複・識別不能',INVALID_URL:'不正URL',OUT_OF_SCOPE:'対象範囲外'};
 const kinds={ARTICLE_PARAMETER:'登録記事のパラメーター付きURL',ARCHIVE:'アーカイブ・カテゴリー一覧',CATEGORY:'カテゴリー・タグ',LIST_SEARCH:'一覧・検索',HOME:'トップページ',OTHER_PARAMETER:'その他パラメーター付き',ARTICLE_CANDIDATE:'未登録記事候補（URL形式）',UNKNOWN:'その他・要確認',INVALID:'不正URL',OUTSIDE:'対象範囲外'};
 const y=sssM1ClassifyUrls_(x,x.scope);
 return ['SBM登録記事：'+x.records.length+'件',...Object.keys(labels).map(k=>labels[k]+'：'+(x.counts[k]||0)+'件'),'','GSC側のみの元URL：'+x.gscOnly.length+'件（記事数ではありません）','正規化後の未照合キー：'+x.unmatched_key_count+'件（有効・範囲内のみ）','登録記事に対応する元URL：'+(x.raw_url_count-x.gscOnly.length)+'件','実績は完全一致または正規化キーそのものの行のみ採用。別表記の実績は合算しません。',...Object.keys(kinds).filter(k=>y.counts[k]).map(k=>kinds[k]+'：'+y.counts[k]+'件\n  例：'+y.examples[k][0]),'','URL形式による暫定分類です。登録漏れ・正規URL・削除対象は確定していません。',...x.limitations,'SBM・Evidenceへの書き込みなし。連携先はS3に保存しました。'].join('\n');
}
function sssM1RunConnection(value){
 const lock=LockService.getDocumentLock();if(!lock.tryLock(1000))throw Error('別の処理が実行中です。');
 try{const c=sssConfig_(),id=sssWizardManagerId_(value);sssM1ManagerCandidate_(id,c);const x=sssM1Load_(id);sssM1SaveManager_({managerSpreadsheetId:id},c);
 return sssM1ResultText_(x);
 }finally{lock.releaseLock();}
}
function sssM1Preview(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:18px;color:#202124}button,input,select{padding:10px;margin:8px 0;box-sizing:border-box}input,select{width:100%}button{cursor:pointer;border:1px solid #aaa;background:#fff;border-radius:5px}#go{background:#2459a6;color:white;border:0}body{overflow-wrap:anywhere}#msg{white-space:pre-wrap;line-height:1.6;overflow-wrap:anywhere;}a{word-break:break-all}</style><p id="msg">連携先のSBMを確認しています…</p><div id="choices" hidden><select id="pick"></select><p id="url"></p><button id="go" onclick="run(document.getElementById('pick').value)">照合を開始</button></div><div id="manual" hidden><p>対象ブログのSBMを開き、ブラウザのアドレス欄のURLをコピーして貼り付けてください。</p><input id="address" placeholder="https://docs.google.com/spreadsheets/d/…/edit"><button onclick="run(document.getElementById('address').value)">URLで照合</button></div><button onclick="google.script.host.close()">閉じる</button><script>
 const el=id=>document.getElementById(id);function fail(e){el('msg').textContent='処理停止：'+e.message;el('manual').hidden=false;el('choices').hidden=true;document.querySelectorAll('#manual button').forEach(b=>b.disabled=false)}
 function run(id){if(!id.trim())return;el('choices').hidden=true;el('manual').hidden=true;el('msg').textContent='全記事と検索実績を照合しています…';google.script.run.withFailureHandler(fail).withSuccessHandler(x=>el('msg').textContent=x).sssM1RunConnection(id)}
 google.script.run.withFailureHandler(fail).withSuccessHandler(x=>{el('msg').textContent='対象ブログ：'+x.site+'\\nSBMのデータは変更しません。';const p=el('pick');p.add(new Option('連携先を選択してください',''));for(const c of x.candidates)p.add(new Option(c.name,c.id));if(x.candidates.length===1&&x.complete)p.selectedIndex=1;function show(){const c=x.candidates.find(y=>y.id===p.value);el('url').textContent='';el('go').disabled=!c}p.onchange=show;show();el('choices').hidden=!x.candidates.length;el('manual').hidden=!!x.candidates.length&&x.complete;if(!x.candidates.length)el('msg').textContent+='\\n連携先を自動特定できませんでした。';}).sssM1ConnectionStatus();
 </script>`).setWidth(640).setHeight(540);SpreadsheetApp.getUi().showModalDialog(html,'全記事台帳の照合');
}

// Compact snapshots use their actual windows, never disguise 28 days as 30 days.
function sssM1CompactPages_(rows,days){
 const windows=['full','first_half','second_half','recent28','previous28'];
 const header=['key'];for(const w of windows)for(const k of ['clicks','impressions','ctr','position'])header.push(k+'_'+w);
 if(!rows.length||rows[0].join('|')!==header.join('|'))throw Error('簡易Evidenceのヘッダー不一致');
 const pages=new Map();for(const row of rows.slice(1)){
  if(row.length===1&&row[0]==='')continue;
  if(row.length!==header.length||!row[0]||pages.has(row[0]))throw Error('簡易EvidenceのURL重複・行不正');
  const m={30:null,90:null,365:null,compact:{days,windows:{}}};
  windows.forEach((w,i)=>{const raw=row.slice(1+i*4,5+i*4),n=raw.map(Number);if(raw.some(v=>String(v).trim()==='')||!n.every(Number.isFinite)||n.some(v=>v<0)||!Number.isSafeInteger(n[0])||!Number.isSafeInteger(n[1])||n[0]>n[1]||n[2]>1)throw Error('簡易Evidenceの数値不正');m.compact.windows[w]=n[1]===0?null:{clicks:n[0],impressions:n[1],ctr:n[2],position:n[3]};});
  if(days===365)m[365]=m.compact.windows.full;pages.set(row[0],m);
 }return pages;
}
function sssM1CompactRef_(c){
 const sh=sssSpreadsheet_().getSheetByName(SSS_EVIDENCE_SHEET);if(!sh||sh.getLastRow()<2)return null;
 const rows=sh.getRange(2,1,sh.getLastRow()-1,12).getValues();
 const refs=rows.filter(v=>String(v[1])===c.siteId&&String(v[2])===c.propertyUri&&[180,365].includes(Number(v[5]))&&['VERIFIED','VERIFIED_WITH_LIMITATIONS'].includes(String(v[11]))&&!String(v[8]).startsWith('SIMS-DeltaEvidence-')).map(v=>({id:String(v[7]),start:sssEvidenceDateKey_(v[3]),end:sssEvidenceDateKey_(v[4]),days:Number(v[5])}));
 refs.sort((a,b)=>b.end.localeCompare(a.end)||b.days-a.days);return refs[0]||null;
}
function sssM1ReadCompact_(c,ref){
 const f=DriveApp.getFileById(ref.id);if(f.isTrashed()||f.getMimeType()!=='application/zip'||f.getSize()>90*1024*1024)throw Error('簡易Evidence ZIPが不正');
 const by={};for(const b of Utilities.unzip(f.getBlob())){const k=b.getName();if(by[k])throw Error('ZIP内重複');by[k]=b;}
 const mf=JSON.parse(by['manifest.json'].getDataAsString('UTF-8'));
 if(mf.format!=='SIMS_DOCTOR_SITE_EVIDENCE_PACKAGE_V2'||mf.storageMode!=='COMPACT_EVIDENCE'||mf.siteId!==c.siteId||mf.site.searchConsoleProperty!==c.propertyUri||mf.period.startDate!==ref.start||mf.period.endDate!==ref.end||Number(mf.period.days)!==ref.days)throw Error('簡易Evidenceのサイト・期間不一致');
 const pages=sssM1CompactPages_(Utilities.parseCsv(by['page_summary.csv'].getDataAsString('UTF-8')),ref.days);
 const d=mf.datasets.find(x=>x.file==='page_summary.csv');if(!d||d.status!=='VALID'||Number(d.rowCount)!==pages.size)throw Error('簡易Evidenceのページ件数・品質不一致');
 return {pages,refs:{evidence_id:ref.id,mode:'COMPACT',period:ref},limitations:['簡易Evidence：'+ref.start+' ～ '+ref.end+'（'+ref.days+'日）','30・90日実績は未取得。28日・半期は別項目。ゼロ埋めされた期間は未確認扱い。','GSCの網羅性は保証されません。']};
}
function sssM1Evidence_(c){
 const a=sssP58Get_(),r=sssP53Get_(),p=sssPeriod51State_(),m=sssDM365State_(),ref=sssM1CompactRef_(c);
 const detailedEnd=m&&r&&m.signature===r.signature&&m.siteId===c.siteId&&m.propertyUri===c.propertyUri?m.end:null;
 if(sssM1PreferDetailed_(detailedEnd,ref)&&a&&a.status==='PASSED'&&a.next===73&&r&&r.status==='COMPLETED'&&r.final&&p&&p.status==='PARTIALS_COMPLETED'&&a.signature===r.signature&&a.finalId===r.final.id&&p.signature===r.signature&&r.siteId===c.siteId){
  const data=sssP53Read_(r.final,r.signature,c.siteId),pages=new Map();for(const d of [30,90,365])for(const [url,v] of data.maps[d]){if(!pages.has(url))pages.set(url,{30:null,90:null,365:null});pages.get(url)[d]=sssP60Metrics_(v);}
  return {pages,refs:{evidence_id:r.final.id,signature:r.signature,mode:'DETAILED',period:{start:m.start,end:m.end,days:365}},limitations:['詳細Evidence：'+m.start+' ～ '+m.end+'（365日）']};
 }
 if(!ref)throw Error('監査済みEvidenceがありません。「分析データを更新」から収集し、品質検証を行ってください。');return sssM1ReadCompact_(c,ref);
}
function sssM1PreferDetailed_(end,ref){return !!end&&(!ref||end>=ref.end);}
// Verification runs outside the Collector document lock and is retriable on demand.
function sssM1VerifyCompleted_(){
 const c=sssConfig_(),run=sdscGetRun_();sssAssertRunSite_(run,c);
 if(!run||run.status!=='COMPLETED'||run.deltaAcquisition||![180,365].includes(Number(run.period.days)))return '対象の完了収集なし';
 const lock=LockService.getDocumentLock();if(!lock.tryLock(1000))throw Error('別の処理が実行中です。');
 let rows;try{const current=sdscGetRun_();if(!current||current.outputFileId!==run.outputFileId||current.status!=='COMPLETED')throw Error('収集状態が変わりました。');sssIndexCompletedEvidence_(run);const sh=sssEvidenceSheet_(),n=sh.getLastRow();rows=sh.getRange(2,1,n-1,12).getValues();}finally{lock.releaseLock();}
 const hits=rows.map((v,i)=>({v,row:i+2})).filter(x=>String(x.v[7])===String(run.outputFileId)&&String(x.v[1])===c.siteId&&String(x.v[2])===c.propertyUri);
 if(hits.length!==1)throw Error('完了ZIPの台帳照合不一致');
 const x=hits[0];if(['VERIFIED','VERIFIED_WITH_LIMITATIONS'].includes(String(x.v[11])))return String(x.v[11]);
 return sssVerifyEvidenceRow_(x.row).status;
}
function sssM1StatusText_(e,verification,today){
 const p=e.refs.period, age=Math.round((Date.parse(today+'T00:00:00Z')-Date.parse(p.end+'T00:00:00Z'))/86400000);
 const v={VERIFIED:'検証済み',VERIFIED_WITH_LIMITATIONS:'検証済み（制限あり）','対象の完了収集なし':'新たな検証対象なし'};
 return ['既存の'+(e.refs.mode==='DETAILED'?'詳細':'簡易')+'データを利用できます','収集期間：'+p.start+' ～ '+p.end+'（'+p.days+'日）','最終データ日から：'+(Number.isFinite(age)&&age>=0?age+'日':'確認不能'),'新規収集の品質確認：'+(v[verification]||verification),...e.limitations].join('\n');
}
function sssM1EvidenceStatus(){
 const ui=SpreadsheetApp.getUi();let verification;try{verification=sssM1VerifyCompleted_();}catch(e){verification='品質検証保留：'+e.message;}
 try{const e=sssM1Evidence_(sssConfig_());ui.alert('分析データの状態',sssM1StatusText_(e,verification,Utilities.formatDate(new Date(),'Asia/Tokyo','yyyy-MM-dd')),ui.ButtonSet.OK);}catch(e){ui.alert('分析データの状態：'+verification+'\n'+e.message);}
}
function sssM1RefreshEvidence(){
 const ui=SpreadsheetApp.getUi(),c=sssConfig_();if(!c.lockedAt)throw Error('先にサイトを登録してください。');
 const run=sdscGetRun_();sssAssertRunSite_(run,c);
 if(run&&['RUNNING','PAUSED_AUTO_RESUME','ERROR'].includes(run.status)){ui.alert('未完了の収集があります。既存の収集状況・再開メニューを使用してください。');return;}
 if(run&&run.status==='COMPLETED'){try{sssM1VerifyCompleted_();}catch(e){ui.alert('前回収集の品質検証が保留です：'+e.message);return;}}
 const ref=sssM1CompactRef_(c);const msg=(ref?'検証済み簡易Evidence：'+ref.end+'（'+ref.days+'日）':'検証済み簡易Evidenceなし')+'\n365日分を再収集しますか？既存ZIPは保持されます。収集後は「分析データの状態・品質を確認」で検証できます。';
 if(ui.alert('分析データを更新',msg,ui.ButtonSet.YES_NO)===ui.Button.YES)sssCollect365();
}

// M2 pure analytical primitives; no menu or network side effects.
function sssM2ParseTrendPercent_(value) {
  const raw = String(value == null ? '' : value).trim();
  if (!raw) return null;
  if (raw === '∞' || /^inf(?:inity)?$/i.test(raw)) return Infinity;
  const n = Number(raw.replace(/,/g,'').replace(/％/g,'%').replace(/%/g,''));
  return isFinite(n) ? n : null;
}

function sssM2TrendScore_(value, maxAbs) {
  const n = sssM2ParseTrendPercent_(value);
  if (n === null) return 0;
  if (n === Infinity) return maxAbs;
  if (n >= 100) return maxAbs;
  if (n >= 20) return Math.max(2, Math.round(maxAbs * 0.65));
  if (n > 0) return Math.max(1, Math.round(maxAbs * 0.35));
  if (n <= -100) return -maxAbs;
  if (n <= -20) return -Math.max(2, Math.round(maxAbs * 0.65));
  if (n < 0) return -Math.max(1, Math.round(maxAbs * 0.35));
  return 0;
}

function sssM2AdsCompetitionSignal_(competition, competitionIndex) {
  // Google Adsの競合性はSEO難易度ではないため、減点材料には使わない。
  // 広告主需要の補助Signalとして最大3点だけ加点する。
  let score = 0;
  const c = String(competition || '').trim().toLowerCase();
  if (['高','high'].includes(c)) score += 2;
  else if (['中','medium'].includes(c)) score += 1;
  const idx = Number(String(competitionIndex || '').replace(/,/g,''));
  if (isFinite(idx) && idx >= 70) score += 1;
  else if (isFinite(idx) && idx >= 30) score += 0.5;
  return Math.min(3, score);
}

function sssM2NormalizeQuery_(q){
  return String(q||'').toLowerCase()
    .normalize('NFKC')
    .replace(/[　\s]+/g,' ')
    .replace(/[｜|／/・,，。!！?？:：;；()[\]【】「」『』]/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function sssM2GenericIntentToken_(t){
  const x=String(t||'').toLowerCase();
  return /^(202[0-9]|20[0-9]{2}|最新版|最新|完全版|方法|やり方|使い方|手順|設定|解除|変更|新機能|機能|原因|対処|対処法|直し方|意味|とは|できない|エラー|不具合|確認|おすすめ|戻す|追加|表示|使う|やる)$/.test(x);
}

function sssM2QueryTokens_(q){
  return sssM2NormalizeQuery_(q).split(' ')
    .map(x=>x.trim())
    .filter(x=>x&&x.length>=2)
    .filter(x=>!sssM2GenericIntentToken_(x));
}

function sssM2AnchorTokens_(q){
  // Topic/entity anchors only. Generic intent words must never establish ownership.
  return sssM2QueryTokens_(q).filter(x=>{
    if(sssM2GenericIntentToken_(x))return false;
    // Avoid numeric-only / year-only anchors.
    if(/^\d+$/.test(x))return false;
    return true;
  });
}

function sssM2HasTopicAnchorMatch_(query,text){
  const anchors=sssM2AnchorTokens_(query);
  const nt=sssM2NormalizeQuery_(text);
  if(!anchors.length)return false;
  return anchors.some(a=>nt.indexOf(a)>=0);
}

function sssM2QuerySimilarity_(a,b){
  const na=sssM2NormalizeQuery_(a),nb=sssM2NormalizeQuery_(b);
  if(!na||!nb)return 0;
  if(na===nb)return 1;
  if(na.indexOf(nb)>=0||nb.indexOf(na)>=0)return .85;

  const ta=sssM2QueryTokens_(na),tb=sssM2QueryTokens_(nb);
  if(!ta.length||!tb.length)return 0;
  const sa={};ta.forEach(x=>sa[x]=1);
  let common=0;tb.forEach(x=>{if(sa[x])common++});
  const union={};ta.concat(tb).forEach(x=>union[x]=1);
  return common/Math.max(Object.keys(union).length,1);
}

function sssM2TitleQueryCoverage_(title,q){
  const nt=sssM2NormalizeQuery_(title),nq=sssM2NormalizeQuery_(q);
  if(!nt||!nq)return 0;
  if(nt.indexOf(nq)>=0)return 1;

  const terms=sssM2QueryTokens_(nq);
  if(!terms.length)return 0;

  // Critical gate: at least one topic/entity anchor must be present.
  // Example: "LINEラボ 新機能 使い方" must not match a Claude article
  // merely because both contain "新機能" and "使い方".
  if(!sssM2HasTopicAnchorMatch_(q,title))return 0;

  let hit=0;
  terms.forEach(t=>{if(nt.indexOf(t)>=0)hit++});
  return hit/terms.length;
}

// BOS v0.14.41 demand adapter. Unknown is not zero; ranges stay ranges.
function sssM2Volume_(value) {
  const raw=String(value==null?'':value).trim();
  const t=raw.normalize('NFKC').replace(/,/g,'').trim();
  const m=t.match(/^(\d+)(?:\s*[-–—~〜]\s*(\d+))?$/);
  if(!m)return {status:/^(?:-|—|n\/a|取得不可)$/i.test(t)?'UNAVAILABLE':'UNKNOWN',min:null,max:null,raw:raw};
  const min=Number(m[1]),max=m[2]===undefined?min:Number(m[2]);
  if(!Number.isSafeInteger(min)||!Number.isSafeInteger(max)||max<min)return {status:'UNKNOWN',min:null,max:null,raw:raw};
  return {status:max===0?'ZERO':min===0?'RANGE_INCLUDES_ZERO':'CONFIRMED',min:min,max:max,raw:raw};
}
function sssM2Demand_(metrics) {
  metrics=metrics||{};
  const volume=sssM2Volume_(metrics.volume);
  const points=v=>Math.min(13,Math.log10(v+1)*5);
  return {volume:volume,volumePointsMin:volume.min===null?null:points(volume.min),volumePointsMax:volume.max===null?null:points(volume.max),trend3mPoints:sssM2TrendScore_(metrics.trend3m,8),trendYoyPoints:sssM2TrendScore_(metrics.trendYoy,6),adsSignal:sssM2AdsCompetitionSignal_(metrics.competition,metrics.competitionIndex),seoDifficulty:null};
}
// SKE lexical evidence only; missing fields cannot establish non-ownership.
function sssM2IntentEvidence_(query,article) {
  article=article||{};
  const title=article.title||'', mq=article.mainQuery||'', intent=article.intent||'';
  const anchor=sssM2HasTopicAnchorMatch_(query,title)||sssM2HasTopicAnchorMatch_(query,mq);
  const score=anchor?Math.max(sssM2QuerySimilarity_(query,mq),sssM2TitleQueryCoverage_(title,query),sssM2QuerySimilarity_(query,intent)):null;
  return {anchor:anchor,lexicalScore:score,missingFields:['title','mainQuery','intent'].filter(k=>!String(article[k]||'').trim()),ownership:'UNCONFIRMED'};
}

// BOS v0.14.41 column aliases.
function sssM2ResolveColumns_(headers) {
  const norm = s => String(s || '').replace(/^\uFEFF/, '').trim().toLowerCase();
  const find = names => headers.findIndex(h => names.some(n => norm(h) === norm(n)));
  return {
    no: find(['No','番号']),
    wordCount: find(['単語数','語数','word count','words']),
    keyword: find(['キーワード','keyword','query','検索キーワード']),
    seoDifficulty: find(['SEO難易度','seo difficulty','difficulty']),
    volume: find(['月間検索数','平均月間検索数','search volume','volume','monthly searches','avg. monthly searches','average monthly searches']),
    cpc: find(['CPC ($)','cpc','CPC']),
    competition: find(['競合性','competition']),
    occurrence: find(['出現時期','occurrence']),
    trend3m: find(['3 か月の推移','3か月の推移','3 month change','three month change']),
    trendYoy: find(['前年比の推移','前年比','year over year change','yoy change']),
    competitionIndex: find(['Competition (indexed value)','competition indexed value','競合性（インデックス値）','競合性指数'])
  };
}

// Import adapter: text already decoded by caller; no persistent writes.
function sssM2ImportKeywords_(text, filename, parseCsv){
 const clean=String(text||'').replace(/^\uFEFF/,'');
 const lines=clean.split(/\r?\n/); let rows=null, idx=null, offset=-1;
 for(let i=0;i<Math.min(30,lines.length);i++){
  const delimiter=lines[i].includes('\t')?'\t':',';
  const header=parseCsv(lines[i],delimiter)[0]||[];
  const found=sssM2ResolveColumns_(header);
  if(found.keyword<0)continue;
  rows=parseCsv(lines.slice(i).join('\n'),delimiter);idx=found;offset=i;break;
 }
 if(!rows)throw Error('キーワード列を認識できません');
 const out=[];
 for(let i=1;i<rows.length;i++){
  const row=rows[i];if(row.every(x=>!String(x).trim()))continue;
  if(row.length!==rows[0].length)throw Error('列数不一致: '+(offset+i+1));
  const get=k=>idx[k]<0?null:String(row[idx[k]]).trim();
  const keyword=get('keyword');if(!keyword)continue;
  const metrics={volume:get('volume'),trend3m:get('trend3m'),trendYoy:get('trendYoy'),competition:get('competition'),competitionIndex:get('competitionIndex')};
  out.push({keyword,source:filename||'IMPORT',source_row:offset+i+1,metrics,demand:sssM2Demand_(metrics),externalSeoDifficulty:get('seoDifficulty'),cpc:get('cpc')});
 }return out;
}
function sssM2ImportBlob_(blob){
 const bytes=blob.getBytes();const a=bytes[0]&255,b=bytes[1]&255;
 const charset=a===255&&b===254?'UTF-16LE':a===254&&b===255?'UTF-16BE':'UTF-8';
 return sssM2ImportKeywords_(blob.getDataAsString(charset),blob.getName(),(t,d)=>Utilities.parseCsv(t,d));
}
// Read-only provisional lexical candidates; never infer ownership from a title.
function sssM2InventoryCandidates_(query,inventory,limit){
 if(!sssM2NormalizeQuery_(query))throw Error('キーワードが空です');
 const records=inventory.records; if(!Array.isArray(records))throw Error('記事台帳が不正');
 const hits=[];let skipped=0;
 for(const a of records){
  if(!['MATCHED','SBM_ONLY'].includes(a.match_status)){skipped++;continue;}
  const evidence=sssM2IntentEvidence_(query,a);
  if(evidence.anchor)hits.push({article_id:a.article_id,url:a.url,title:a.title,match_status:a.match_status,evidence});
 }
 hits.sort((a,b)=>b.evidence.lexicalScore-a.evidence.lexicalScore);
 return {query,site_id:inventory.site_id||null,inventory_run_id:inventory.run_id||null,scanned:records.length,skipped,hit_count:hits.length,candidates:hits.slice(0,Math.max(1,Math.min(100,Number(limit)||20))),ownership:'UNCONFIRMED',limitations:['語彙候補のみ。本文・検索意図・クエリ実績の確認が必要。']};
}

// M2: compact page/query evidence is independent of the selected page metrics period.
function sssM2QueryEvidence_(rows, inventory, ref, scope, dataset){
 if(!Array.isArray(rows)||!rows.length||!dataset||Number(dataset.rowCount)!==rows.length-1)throw Error('クエリEvidence件数不一致');
 if(JSON.stringify(rows[0])!==JSON.stringify(['page','query','clicks','impressions','ctr','position']))throw Error('クエリEvidence列不一致');
 const owners=new Map(), index=new Map(), seen=new Set();let ignored=0;
 for(const a of inventory.records)if(['MATCHED','SBM_ONLY'].includes(a.match_status)&&a.canonical_key)owners.set(a.canonical_key,a);
 for(const r of rows.slice(1)){
  if(r.length!==6)throw Error('クエリEvidence行不正');
  const u=sssM1UrlInfo_(r[0],scope), q=sssM2NormalizeQuery_(r[1]), id=JSON.stringify([r[0],r[1]]);
  if(seen.has(id))throw Error('クエリEvidence重複');seen.add(id);
  const a=owners.get(u.key);if(!a||u.status!=='VALID'||!q){ignored++;continue;}
  const nums=r.slice(2).map(v=>String(v).trim()===''?NaN:Number(v));if(nums.some(v=>!Number.isFinite(v)||v<0))throw Error('クエリEvidence数値不正');
  if(!index.has(q))index.set(q,[]);
  index.get(q).push({article_id:a.article_id,url:r[0],query:r[1],clicks:nums[0],impressions:nums[1],ctr:nums[2],position:nums[3]});
 }
 return {index,period:ref,ignored,coverage:'TOP_QUERIES_ONLY',limitations:['記事別上位クエリのみ。未観測は需要ゼロ・非所有を意味しない。別表記URLの実績は合算しない。']};
}
// Site-level observations are independent of article ownership.
function sssM2SiteQueryIndex_(rows,d){
 const periods=['full','first_half','second_half','recent28','previous28'];
 const headers=['key'];for(const p of periods)for(const k of ['clicks','impressions','ctr','position'])headers.push(k+'_'+p);
 if(!d||d.status!=='VALID'||!Array.isArray(rows)||Number(d.rowCount)!==rows.length-1||JSON.stringify(rows[0])!==JSON.stringify(headers))throw Error('サイトクエリEvidence不正');
 const index=new Map();for(const r of rows.slice(1)){
  if(r.length!==headers.length||r.slice(1).some(v=>String(v).trim()===''||!Number.isFinite(Number(v))||Number(v)<0))throw Error('サイトクエリ数値不正');
  const q=sssM2NormalizeQuery_(r[0]);if(!q)continue;if(!index.has(q))index.set(q,[]);index.get(q).push({query:r[0],clicks:Number(r[1]),impressions:Number(r[2])});
 }return index;
}
// Bounded lexical variants: discovery only, never proof of identical intent.
function sssM2DiscoveryKey_(q){return sssM2NormalizeQuery_(q).replace(/クローム/g,'chrome').replace(/太く(?:する|した|なった|なる|したい)?|太字/g,'太字').replace(/\s+/g,'');}
function sssM2RelatedQueryKeys_(q,index){
 const terms=sssM2QueryTokens_(q).map(sssM2DiscoveryKey_).filter(Boolean);
 if(terms.length<2||!index)return [];
 const exact=sssM2NormalizeQuery_(q),hits=[];
 for(const k of index.keys()){if(k===exact)continue;const n=sssM2DiscoveryKey_(k);if(terms.every(t=>n.includes(t)))hits.push(k);}
 return hits;
}
function sssM2QueryDiagnostics_(q,e){
 const key=sssM2NormalizeQuery_(q),site=e&&e.siteIndex?e.siteIndex.get(key)||[]:null;
 return {site_status:site===null?'UNAVAILABLE':site.some(x=>x.impressions>0)?'OBSERVED':'NOT_OBSERVED',site_rows:site||[],article_query_keys:e?e.index.size:0,site_query_keys:e&&e.siteIndex?e.siteIndex.size:0,ignored:e?e.ignored:0,site_related:sssM2RelatedQueryKeys_(q,e&&e.siteIndex),article_related:sssM2RelatedQueryKeys_(q,e&&e.index)};
}
function sssM2LoadQueryEvidence_(inventory){
 const c=sssConfig_();if(inventory.site_id!==c.siteId)throw Error('台帳サイト不一致');
 const ref=sssM1CompactRef_(c);if(!ref)return null;
 const f=DriveApp.getFileById(ref.id);if(f.isTrashed()||f.getMimeType()!=='application/zip'||f.getSize()>90*1024*1024)throw Error('クエリEvidence ZIP不正');
 const by={};for(const b of Utilities.unzip(f.getBlob())){const k=b.getName();if(by[k])throw Error('ZIP内重複');by[k]=b;}
 const m=JSON.parse(by['manifest.json'].getDataAsString('UTF-8'));
 if(m.format!=='SIMS_DOCTOR_SITE_EVIDENCE_PACKAGE_V2'||m.storageMode!=='COMPACT_EVIDENCE'||m.siteId!==c.siteId||m.site.searchConsoleProperty!==c.propertyUri||m.period.startDate!==ref.start||m.period.endDate!==ref.end||Number(m.period.days)!==ref.days)throw Error('クエリEvidenceサイト・期間不一致');
 const d=m.datasets.find(x=>x.file==='page_query_top.csv');if(!d||!by['page_query_top.csv']||!['VALID','VALID_WITH_LIMITATIONS'].includes(d.status))return null;
 const e=sssM2QueryEvidence_(Utilities.parseCsv(by['page_query_top.csv'].getDataAsString('UTF-8')),inventory,ref,sssP72PropertyScope_(c.propertyUri),d);
 const sd=m.datasets.find(x=>x.file==='query_summary.csv');if(sd&&by['query_summary.csv']&&sd.status==='VALID')e.siteIndex=sssM2SiteQueryIndex_(Utilities.parseCsv(by['query_summary.csv'].getDataAsString('UTF-8')),sd);return e;
}
function sssM2OwnershipSignals_(query,inventory,evidence){
 const lexical=sssM2InventoryCandidates_(query,inventory,100);
 const observed=evidence?evidence.index.get(sssM2NormalizeQuery_(query))||[]:[];
 return {lexical,observed,query_period:evidence?evidence.period:null,observation_status:observed.length?'OBSERVED':evidence?'NOT_OBSERVED':'UNAVAILABLE',ownership:'UNCONFIRMED'};
}
// BOS band mapping, with an explicit unknown state instead of false RED.
function sssM2SerpGrade_(band,hardBlock){
 if(hardBlock===true)return 'BLOCK';if(hardBlock!==false)return 'UNCONFIRMED';
 return ({TOP10:'GREEN',TOP20:'YELLOW',TOP30:'PALE_PINK',OUT:'RED'})[String(band||'').trim().toUpperCase()]||'UNCONFIRMED';
}

// M2 SERP contract adapter, based on BOS v0.14.41. Pure functions; no persistence.
function sssM2SerpRequest_(requestId,site,candidates,generatedAt){
 if(!String(requestId||'').trim()||!site||!site.id||!site.url||!Array.isArray(candidates)||!candidates.length||candidates.length>5)throw Error('SERP依頼情報不正');
 const keys=new Set();const list=candidates.map(c=>{const keyword=String(c.main_keyword||c.keyword||'').trim(),key=sssM2NormalizeQuery_(keyword);if(!key||keys.has(key))throw Error('依頼キーワード不正・重複');keys.add(key);return Object.assign({},c,{main_keyword:keyword});});
 return {format:'SIMS_BOS_SERP_REVIEW_REQUEST_V1',contract_version:'1.0',product:'SIMS Site Strategist',product_version:SSS_VERSION,request_id:requestId,generated_at:generatedAt,site:{id:site.id,name:site.name||'',url:site.url},candidate_count:list.length,candidates:list,evaluation_policy:{minimum_verified_results_per_candidate:5,require_web_verification:true,do_not_assume_volume_zero_means_no_demand:true,do_not_finalize_article_green_before_cannibalization_check:true}};
}
function sssM2SerpPrompt_(p){return ['現在のWeb検索で各候補を精査。確認済みの個別ページを最低5件。架空URL・検索一覧・推測順位は禁止。取得不足は明示。需要不明だけでhard_blockにしない。自サイト記事があっても検索意図の独立性を別途確認する。','SIMS_BOS_SERP_REVIEW_RESULT_V2 のJSONを返す。request_idを一致させる。resultsには main_keyword, checked_count, serp_evidence [{title,url,rank?,site_type,weakness_or_strength}], reachable_band (TOP10/TOP20/TOP30/OUT), confidence_percent, hard_block, block_reason, blue_ocean_score, search_intent, evidence_summary を含める。順位帯を推測できない場合はnull。','REQUEST JSON:',JSON.stringify(p,null,2)].join('\n');}
function sssM2ParseSerp_(raw){const s=String(raw||'').trim();const fenced=s.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);return JSON.parse(fenced?fenced[1]:s);}
function sssM2ValidateSerp_(p,request,scope){
 if(!request||request.format!=='SIMS_BOS_SERP_REVIEW_REQUEST_V1'||!p||p.format!=='SIMS_BOS_SERP_REVIEW_RESULT_V2'||p.request_id!==request.request_id||!Array.isArray(p.results)||p.results.length!==request.candidates.length)throw Error('SERP回答契約不一致');
 if(p.site&&((p.site.id&&p.site.id!==request.site.id)||(p.site.url&&p.site.url!==request.site.url)))throw Error('SERP回答サイト不一致');
 const expected=new Set(request.candidates.map(c=>sssM2NormalizeQuery_(c.main_keyword))), seen=new Set();
 if(expected.size!==request.candidates.length)throw Error('依頼重複');
 const results=p.results.map(r=>{
  const key=sssM2NormalizeQuery_(r.main_keyword);if(!expected.has(key)||seen.has(key))throw Error('回答キーワード不一致・重複');seen.add(key);
  if(!Array.isArray(r.serp_evidence)||typeof r.hard_block!=='boolean'||!Number.isInteger(r.checked_count)||r.checked_count!==r.serp_evidence.length)throw Error('検索証拠件数・停止判定不正');
  if(typeof r.blue_ocean_score!=='number'||!Number.isFinite(r.blue_ocean_score)||r.blue_ocean_score<0||r.blue_ocean_score>100||typeof r.confidence_percent!=='number'||!Number.isFinite(r.confidence_percent)||r.confidence_percent<0||r.confidence_percent>100)throw Error('評価数値不正');
  for(const f of ['search_intent','evidence_summary'])if(typeof r[f]!=='string'||!r[f].trim())throw Error('必須説明不足: '+f);
  if(r.hard_block&&(!String(r.block_reason||'').trim()))throw Error('停止理由不足');
  if(r.reachable_band!==null&&!['TOP10','TOP20','TOP30','OUT'].includes(r.reachable_band))throw Error('順位帯不正');
  const urls=new Set();let own=false;
  for(const e of r.serp_evidence){const url=String(e.url||'').trim();if(!String(e.title||'').trim()||!/^https?:\/\/[^\s/?#]+(?:[^\s]*)$/i.test(url)||/\/search(?:[/?#]|$)/i.test(url)||/[?&](?:q|s|query|search_query)=/i.test(url))throw Error('検索証拠URL不正');const u=sssM1UrlInfo_(url,scope);if(u.status==='INVALID_URL')throw Error('検索証拠URL不正');const k=sssArticleUrlKey_(url);if(!k||urls.has(k))throw Error('検索証拠URL重複・不正');urls.add(k);if(u.status==='VALID')own=true;if(e.rank!=null&&(!Number.isInteger(e.rank)||e.rank<1))throw Error('順位不正');}
  const sufficient=urls.size>=5;return {keyword:r.main_keyword,grade:sufficient?sssM2SerpGrade_(r.reachable_band,r.hard_block):'UNCONFIRMED',evidence_status:sufficient?'REPORTED_SUFFICIENT':'INSUFFICIENT',own_site_hit:own,cannibal_status:'UNCONFIRMED',publication_gate:'HOLD',raw:r};
 });return {request_id:request.request_id,site_id:request.site.id,results,evidence_verification:'STRUCTURAL_ONLY'};
}

// M2 integrated read-only screening: SKE ownership hints and BOS risk are provisional.
function sssM2Screen_(keyword,inventory,evidence){
 const signals=sssM2OwnershipSignals_(keyword,inventory,evidence);
 const by=new Map(signals.lexical.candidates.map(a=>[a.article_id,{article_id:a.article_id,title:a.title,url:a.url,lexical:a.evidence.lexicalScore,observations:[]} ]));
 const articles=new Map(inventory.records.filter(a=>['MATCHED','SBM_ONLY'].includes(a.match_status)).map(a=>[a.article_id,a]));
 for(const o of signals.observed){const a=articles.get(o.article_id);if(!a)continue;if(!by.has(o.article_id))by.set(o.article_id,{article_id:a.article_id,title:a.title,url:a.url,lexical:null,observations:[]});by.get(o.article_id).observations.push(o);}
 const candidates=Array.from(by.values());
 const relatedKeys=sssM2RelatedQueryKeys_(keyword,evidence&&evidence.index);
 for(const key of relatedKeys){for(const o of evidence.index.get(key)){const a=articles.get(o.article_id);if(!a)continue;let item=by.get(o.article_id);if(!item){item={article_id:a.article_id,title:a.title,url:a.url,lexical:null,observations:[],related_queries:[]};by.set(o.article_id,item);candidates.push(item);}if(!item.related_queries)item.related_queries=[];if(!item.related_queries.includes(key))item.related_queries.push(key);}}

 const risk=candidates.length>1?'MULTIPLE_ARTICLES_REVIEW':candidates.length?'RELATED_ARTICLE_REVIEW':'NO_SIGNAL_NOT_CONFIRMED';
 return {keyword,site_id:inventory.site_id,inventory_run_id:inventory.run_id,scanned:signals.lexical.scanned,skipped:signals.lexical.skipped,lexical_hit_count:signals.lexical.hit_count,observation_status:signals.observation_status,query_period:signals.query_period,candidates,risk,ownership:'UNCONFIRMED',publication_gate:'HOLD',limitations:['上位クエリと語彙による暫定候補。本文・検索意図の精査が必要。','語彙候補の表示上限100件。検索実績は合算しない。']};
}
function sssM2RunScreen(keyword){
 const q=String(keyword||'').trim();if(!q||q.length>200)throw Error('検索キーワードを200文字以内で入力してください。');
 const c=sssConfig_(),connection=sssM1FindManagers_();if(!connection.complete||connection.candidates.length!==1)throw Error('先に全記事台帳の照合でSBM連携先を確定してください。');
 const inventory=sssM1Load_(connection.candidates[0].id),evidence=sssM2LoadQueryEvidence_(inventory),r=sssM2Screen_(q,inventory,evidence),d=sssM2QueryDiagnostics_(q,evidence);
 return ['対象ブログ：'+c.siteName,'対象キーワード：'+q,'探索記事：'+r.scanned+'件（識別保留 '+r.skipped+'件）','記事別上位クエリ：'+(r.observation_status==='UNAVAILABLE'?'利用不可':r.observation_status==='OBSERVED'?'観測あり':'観測なし'),'クエリ期間：'+(r.query_period?r.query_period.start+' ～ '+r.query_period.end:'不明'),'サイト全体クエリ：'+({OBSERVED:'観測あり',NOT_OBSERVED:'観測なし',UNAVAILABLE:'利用不可'})[d.site_status], 'サイト全体の一致行：'+d.site_rows.length+'件（合算なし）', 'クエリ索引：サイト '+d.site_query_keys+'種類 / 記事別 '+d.article_query_keys+'種類 / 記事未照合等 '+d.ignored+'行','サイト関連クエリ：'+d.site_related.length+'種類（暫定・合算なし）',...d.site_related.slice(0,10).map(k=>'  '+k),'記事別関連クエリ：'+d.article_related.length+'種類（暫定）','語彙候補：'+r.lexical_hit_count+'件','関連候補：'+r.candidates.length+'件（暫定）',...r.candidates.slice(0,10).map(a=>a.article_id+' '+a.title+' / クエリ観測 '+a.observations.length+'件 / 関連語 '+(a.related_queries||[]).slice(0,3).join('、')),'記事作成判定：保留','本文・検索意図の精査が必要です。観測なしは需要ゼロではありません。'].join('\n');
}
function sssM2Preview(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:16px;color:#202124}input{width:100%;box-sizing:border-box;padding:10px}button{padding:10px 16px;margin:12px 8px 0 0;border:1px solid #aaa;border-radius:5px;background:white}#go{background:#2459a6;color:white}#result{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.6}</style><p>既存記事と検索クエリから関連記事候補を確認します。SBM・Evidenceは変更しません。</p><input id="q" placeholder="例：LINE 通知 来ない" maxlength="200"><button id="go" onclick="run()">分析を開始</button><button onclick="google.script.host.close()">閉じる</button><p id="result"></p><script>function run(){const q=document.getElementById('q').value.trim(),b=document.getElementById('go'),r=document.getElementById('result');if(!q){r.textContent='キーワードを入力してください。';return;}b.disabled=true;r.textContent='全記事と検索実績を分析しています…';google.script.run.withSuccessHandler(x=>{b.disabled=false;r.textContent=x}).withFailureHandler(e=>{b.disabled=false;r.textContent='処理停止：'+e.message}).sssM2RunScreen(q)}</script>`).setWidth(640).setHeight(540);SpreadsheetApp.getUi().showModalDialog(html,'関連記事候補の分析（試験）');
}

// M2 intent review adapter: bounded evidence, separate from SERP ranking and demand.
function sssM2IntentRequest_(id,site,screen,evidence,at){
 if(!id||!site||!site.id||screen.site_id!==site.id||!screen.keyword)throw Error('検索意図依頼不正');
 const d=sssM2QueryDiagnostics_(screen.keyword,evidence),keys=d.site_related.slice(0,50),articles=screen.candidates.slice(0,30);
 return {format:'S3_INTENT_REVIEW_REQUEST_V1',request_id:id,site_id:site.id,property:site.url,keyword:screen.keyword,generated_at:at,period:screen.query_period,exact_site_rows:d.site_rows,related_site_queries:keys.map(k=>({key:k,rows:evidence.siteIndex.get(k)})),articles,coverage:{scanned:screen.scanned,skipped:screen.skipped,related_total:d.site_related.length,article_total:screen.candidates.length,limited:keys.length<d.site_related.length||articles.length<screen.candidates.length,ownership:'UNCONFIRMED'},publication_gate:'HOLD'};
}
function sssM2IntentPrompt_(p){return ['既存記事URLの本文を確認し、検索意図を比較してください。サイト全体クエリを個別記事に帰属させない。未観測は需要ゼロではない。関連語は同一意図とは限らない。アクセス不可は明記し、推測で確定しない。','S3_INTENT_REVIEW_RESULT_V1 のJSONを返す。request_id,site_id,keyword,assessment (SAME_INTENT/DISTINCT_INTENT/UNCERTAIN), articles [{article_id,body_status (VERIFIED/UNAVAILABLE),reason}], reason を含める。記事作成承認は行わない。',JSON.stringify(p,null,2)].join('\n');}
function sssM2ValidateIntent_(p,r){
 if(!r||r.format!=='S3_INTENT_REVIEW_REQUEST_V1'||!p||p.format!=='S3_INTENT_REVIEW_RESULT_V1'||p.request_id!==r.request_id||p.site_id!==r.site_id||p.keyword!==r.keyword||!['SAME_INTENT','DISTINCT_INTENT','UNCERTAIN'].includes(p.assessment)||!String(p.reason||'').trim()||!Array.isArray(p.articles)||p.articles.length!==r.articles.length)throw Error('検索意図回答不正');
 const ids=new Set(r.articles.map(a=>a.article_id));for(const a of p.articles){if(!ids.delete(a.article_id)||!['VERIFIED','UNAVAILABLE'].includes(a.body_status)||!String(a.reason||'').trim())throw Error('記事確認回答不正');}
 const sufficient=r.articles.length>0&&!r.coverage.limited&&!r.coverage.skipped&&p.articles.every(a=>a.body_status==='VERIFIED');
 return {request_id:r.request_id,assessment:sufficient?p.assessment:'UNCERTAIN',verification:'REPORTED_ONLY',publication_gate:'HOLD',raw:p};
}

// M2 read-only end-to-end pilot. All outputs remain provisional; no publication mutation.
function sssM2CombinedDecision_(d,s,i){
 const grade=s.grade, intent=i.assessment;
 const action=grade==='BLOCK'?'BLOCK':intent==='SAME_INTENT'?'REVIEW_EXISTING':intent!=='DISTINCT_INTENT'?'HOLD_INTENT':grade==='UNCONFIRMED'?'HOLD_SERP':d.volume.status!=='CONFIRMED'?'HOLD_DEMAND':grade==='GREEN'||grade==='YELLOW'?'REVIEW_NEW_ARTICLE':'LOW_PRIORITY';
 return {action,grade,intent,demand:d.volume.status,publication_gate:'HOLD',verification:'REPORTED_ONLY'};
}
function sssM2PilotPrepare(q,volume){
 q=String(q||'').trim();if(!q||q.length>200)throw Error('キーワードを200文字以内で入力してください。');
 const c=sssConfig_(),conn=sssM1FindManagers_();if(!conn.complete||conn.candidates.length!==1)throw Error('先にSBM連携先を確定してください。');
 const inv=sssM1Load_(conn.candidates[0].id),e=sssM2LoadQueryEvidence_(inv),screen=sssM2Screen_(q,inv,e),id=Utilities.getUuid(),at=new Date().toISOString(),site={id:c.siteId,name:c.siteName,url:c.propertyUri};
 const demand=sssM2Demand_({volume}),serp=sssM2SerpRequest_(id,site,[{main_keyword:q,demand}],at),intent=sssM2IntentRequest_(id,site,screen,e,at);
 const packet={site_id:c.siteId,property:c.propertyUri,demand,serp,intent};
 // Store immutable request in S3 document properties, chunked below per-value limit.
 const raw=JSON.stringify(packet);if(raw.length>100000)throw Error('依頼データが大きすぎます。');
 const lock=LockService.getDocumentLock();lock.waitLock(10000);try{const p=sssProperties_(),old=Number(p.getProperty('SSS_M2_PILOT_N')||0);p.deleteProperty('SSS_M2_PILOT_N');for(let n=0;n<old;n++)p.deleteProperty('SSS_M2_PILOT_'+n);const chunks=raw.match(/[\s\S]{1,2000}/g);const values={};chunks.forEach((v,n)=>values['SSS_M2_PILOT_'+n]=v);p.setProperties(values);p.setProperty('SSS_M2_PILOT_N',String(chunks.length));}finally{lock.releaseLock();}
 return '次の二つの調査を実施し、単一JSON {"serp": SERP回答オブジェクト, "intent": 検索意図回答オブジェクト} を返してください。\n'+sssM2SerpPrompt_(serp)+'\n\n'+sssM2IntentPrompt_(intent);
}
function sssM2PilotReceive(raw){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);try{const p=sssProperties_(),n=Number(p.getProperty('SSS_M2_PILOT_N')||0);if(!Number.isInteger(n)||n<1||n>50)throw Error('先に依頼を作成してください。');let data='';for(let j=0;j<n;j++){const part=p.getProperty('SSS_M2_PILOT_'+j);if(part===null)throw Error('依頼保存不完全');data+=part;}const r=JSON.parse(data),c=sssConfig_();if(c.siteId!==r.site_id||c.propertyUri!==r.property)throw Error('対象サイト不一致');const a=sssM2ParseSerp_(raw),s=sssM2ValidateSerp_(a.serp,r.serp,sssP72PropertyScope_(c.propertyUri)),i=sssM2ValidateIntent_(a.intent,r.intent);const decision=sssM2CombinedDecision_(r.demand,s.results[0],i);sssM2SaveReview_(SpreadsheetApp.getActiveSpreadsheet(),r,a,decision);return sssM2ReviewText_(r,decision);}finally{lock.releaseLock();}
}
function sssM2PilotDialog(){
 const h=HtmlService.createHtmlOutput(`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;height:100%;box-sizing:border-box}body{font:14px Arial;display:flex;flex-direction:column;padding:12px;gap:8px}main{flex:1;min-height:0;overflow:auto;padding:0 8px 12px}label{display:block;margin-top:8px}input,textarea{box-sizing:border-box;width:100%;margin:6px 0}input{padding:6px}textarea{height:110px;resize:vertical}button{padding:9px;margin:4px 6px 4px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere}.op{display:flex;align-items:center;flex-wrap:wrap;gap:6px}.status{flex:1;min-width:140px;overflow-wrap:anywhere;color:#174b79}.status.error{color:#a11;background:#fce8e6}footer{flex:none;border-top:1px solid #ddd}</style><main><p>検索需要・競合・検索意図の連携試験。SBMとEvidenceは変更しません。新規依頼は前回の試験依頼を置き換えます。</p><div class="op"><button id="resume" onclick="resume()">前回の依頼を再開</button><span class="status" id="resumeStatus" role="status"></span></div><label>キーワード<input id="q" value="Chrome 太字"></label><label>月間検索数（不明なら空欄）<input id="v"></label><div class="op"><button id="prepare" onclick="prepare()">精査依頼を作成</button><span class="status" id="prepareStatus" role="status" aria-live="polite"></span></div><label>精査依頼文<textarea id="req" readonly></textarea></label><div class="op"><button id="copy" onclick="copyRequest()" disabled>依頼文をコピー</button><span class="status" id="copyStatus" role="status" aria-live="polite"></span></div><label>Claude回答JSON<textarea id="ans"></textarea></label><div class="op"><button id="receive" onclick="receive()" disabled>回答を検証</button><span class="status" id="receiveStatus" role="status" aria-live="polite"></span></div><pre id="result" tabindex="-1"></pre></main><footer><button id="close" onclick="google.script.host.close()">閉じる</button></footer><script>const el=id=>document.getElementById(id);let pending=false,ready=false;function status(id,t,error){const x=el(id+'Status');x.textContent=t;x.className=error?'status error':'status'}function busy(v){pending=v;el('prepare').disabled=v;el('resume').disabled=v;el('close').disabled=v;el('copy').disabled=v||!ready;el('receive').disabled=v||!ready;el('q').disabled=v;el('v').disabled=v;el('ans').disabled=v}function fail(id,e){busy(false);status(id,'停止：'+(e.message||e),true)}async function copyRequest(){if(pending||!ready)return;try{let ok=false;try{if(navigator.clipboard){await navigator.clipboard.writeText(el('req').value);ok=true}}catch(e){}if(!ok){el('req').focus();el('req').select();ok=document.execCommand('copy')}if(!ok)throw Error('copy');status('copy','コピーしました！')}catch(e){status('copy','コピーできませんでした。依頼文を選択して Ctrl+C でコピーしてください。',true)}}function prepare(){if(pending)return;ready=false;busy(true);status('prepare','分析中…');status('copy','');status('receive','');el('req').value='';el('ans').value='';el('result').textContent='';google.script.run.withFailureHandler(e=>fail('prepare',e)).withSuccessHandler(x=>{el('req').value=x;ready=true;busy(false);status('prepare','依頼作成完了。依頼文をコピーしてください。')}).sssM2PilotPrepare(el('q').value,el('v').value)}function resume(){if(pending)return;busy(true);status('resume','読込中…');google.script.run.withFailureHandler(e=>fail('resume',e)).withSuccessHandler(x=>{el('q').value=x.keyword;el('v').value=x.volume;el('req').value=x.prompt;el('ans').value='';el('result').textContent=x.result||'';ready=!x.saved;busy(false);status('resume',x.saved?'登録済みの結果を表示しました。':'依頼を再開しました。')}).sssM2PilotResume()}function receive(){if(pending||!ready)return;if(!el('ans').value.trim()){status('receive','Claude回答JSONを貼り付けてください。',true);return}busy(true);status('receive','検証中…');el('result').textContent='';google.script.run.withFailureHandler(e=>fail('receive',e)).withSuccessHandler(x=>{busy(false);el('result').textContent=x;status('receive','回答の検証完了。結果を確認してください。')}).sssM2PilotReceive(el('ans').value)}</script>`).setWidth(650).setHeight(620);SpreadsheetApp.getUi().showModalDialog(h,'検索意図・競合精査（試験）');
}

// S3-only review ledger. Request ID is the immutable deduplication key.
function sssM2ReviewText_(r,d){
 const labels={REVIEW_EXISTING:'既存記事の改善を検討',REVIEW_NEW_ARTICLE:'新記事作成の精査候補',HOLD_INTENT:'検索意図の追加精査',HOLD_SERP:'競合の追加精査',HOLD_DEMAND:'検索需要の追加確認',LOW_PRIORITY:'優先度を下げる',BLOCK:'記事化停止'};
 return ['対象：'+r.intent.keyword,'推奨処置：'+(labels[d.action]||d.action),'検索意図：'+({SAME_INTENT:'重複あり',DISTINCT_INTENT:'独立',UNCERTAIN:'未確定'}[d.intent]||d.intent),'上位表示見込み：'+(d.grade==='UNCONFIRMED'?'未確定':d.grade),'検索需要：'+(d.demand==='UNKNOWN'?'未確認':d.demand),'新記事作成：保留','証拠：AI報告に基づく（独立検証なし）','精査履歴に保存済み'].join('\n');
}
function sssM2SaveReview_(ss,r,a,d){
 const name='S3_精査履歴',header=['request_id','site_id','keyword','saved_at','action','grade','intent','demand','publication_gate','verification','request_json_1','request_json_2','request_json_3','response_json_1','response_json_2','response_json_3'];
 const split=x=>{const t=JSON.stringify(x);if(t.length>120000)throw Error('精査履歴の保存上限を超えました。');return [t.slice(0,40000),t.slice(40000,80000),t.slice(80000)].map(v=>"'"+v);};
 const row=[r.intent.request_id,r.site_id,"'"+r.intent.keyword,new Date().toISOString(),d.action,d.grade,d.intent,d.demand,d.publication_gate,d.verification,...split(r),...split(a)];
 let sh=ss.getSheetByName(name);if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,header.length).setValues([header]);sh.setFrozenRows(1);}
 if(JSON.stringify(sh.getRange(1,1,1,header.length).getValues()[0])!==JSON.stringify(header))throw Error('精査履歴の列構成が一致しません。');
 const n=sh.getLastRow();if(n>1&&sh.getRange(2,1,n-1,1).getValues().some(x=>x[0]===row[0]))throw Error('この依頼は登録済みです。');
 sh.getRange(n+1,1,1,row.length).setValues([row]);
}

// Candidate view derives from the immutable review ledger; no duplicate persistent state.
function sssM2CandidateRows_(rows,site){
 const latest=new Map();for(const r of rows){if(r[1]!==site||!r[0]||!r[2])continue;const key=sssM2NormalizeQuery_(String(r[2]).replace(/^'/,''));if(!key)continue;const prev=latest.get(key);if(!prev||String(r[3])>=String(prev[3]))latest.set(key,r);}
 return Array.from(latest.values()).sort((a,b)=>String(b[3]).localeCompare(String(a[3])));
}
function sssM2LedgerRows_(ss){const sh=ss.getSheetByName('S3_精査履歴');if(!sh||sh.getLastRow()<2)return [];const h=sh.getRange(1,1,1,10).getValues()[0];if(h.join('|')!=='request_id|site_id|keyword|saved_at|action|grade|intent|demand|publication_gate|verification')throw Error('精査履歴の列構成が一致しません。');return sh.getRange(2,1,sh.getLastRow()-1,10).getValues();}
function sssM2CandidatePreview(){const c=sssConfig_(),rows=sssM2CandidateRows_(sssM2LedgerRows_(SpreadsheetApp.getActiveSpreadsheet()),c.siteId);const text=rows.length?rows.slice(0,50).map(r=>sssM2ReviewText_({intent:{keyword:String(r[2]).replace(/^'/,'')}},{action:r[4],grade:r[5],intent:r[6],demand:r[7]})).join('\n\n'):'精査済み候補はありません。';SpreadsheetApp.getUi().alert('精査済み候補（最新・最大50件／全'+rows.length+'件）',text,SpreadsheetApp.getUi().ButtonSet.OK);}
function sssM2PilotResume(){const lock=LockService.getDocumentLock();lock.waitLock(10000);try{const p=sssProperties_(),n=Number(p.getProperty('SSS_M2_PILOT_N')||0);if(!Number.isInteger(n)||n<1||n>50)throw Error('再開できる依頼がありません。');let raw='';for(let j=0;j<n;j++){const part=p.getProperty('SSS_M2_PILOT_'+j);if(part===null)throw Error('依頼保存不完全');raw+=part;}const r=JSON.parse(raw),c=sssConfig_();if(c.siteId!==r.site_id||c.propertyUri!==r.property)throw Error('対象サイト不一致');const saved=sssM2LedgerRows_(SpreadsheetApp.getActiveSpreadsheet()).find(x=>x[0]===r.intent.request_id&&x[1]===c.siteId);return {keyword:r.intent.keyword,volume:r.demand.volume.raw||'',prompt:'次の二つの調査を実施し、単一JSON {"serp": SERP回答オブジェクト, "intent": 検索意図回答オブジェクト} を返してください。\n'+sssM2SerpPrompt_(r.serp)+'\n\n'+sssM2IntentPrompt_(r.intent),saved:!!saved,result:saved?sssM2ReviewText_(r,{action:saved[4],grade:saved[5],intent:saved[6],demand:saved[7]}):''};}finally{lock.releaseLock();}}

// M3 evidence coverage triage: data quality only. No content-quality or SEO judgment.
function sssM3EvidenceTriage_(inventory){
 if(!inventory||!Array.isArray(inventory.records))throw Error('M3台帳不正');
 const groups={IDENTITY_REVIEW:[],NO_GSC_URL_MATCH:[],MATCHED_METRICS_UNAVAILABLE:[],OBSERVED_IMPRESSIONS:[],MATCHED_ZERO_IMPRESSIONS:[],INVALID_METRICS:[]};
 for(const a of inventory.records){
  const id=String(a.article_id||''),entry={article_id:id,title:String(a.title||''),url:String(a.url||'')};
  let key='';
  if(a.match_status!=='MATCHED'&&a.match_status!=='SBM_ONLY')key='IDENTITY_REVIEW';
  else if(a.match_status==='SBM_ONLY')key='NO_GSC_URL_MATCH';
  else if(!a.metrics)key='MATCHED_METRICS_UNAVAILABLE';
  else {
   const m=a.metrics[365]||a.metrics.compact&&a.metrics.compact.windows&&a.metrics.compact.windows.full;
   if(!m)key='MATCHED_METRICS_UNAVAILABLE';
   else if(!Number.isFinite(Number(m.impressions))||Number(m.impressions)<0||!Number.isFinite(Number(m.clicks))||Number(m.clicks)<0||Number(m.clicks)>Number(m.impressions))key='INVALID_METRICS';
   else key=Number(m.impressions)>0?'OBSERVED_IMPRESSIONS':'MATCHED_ZERO_IMPRESSIONS';
  }
  groups[key].push(entry);
 }
 const counts={},examples={};for(const k of Object.keys(groups)){counts[k]=groups[k].length;examples[k]=groups[k].slice(0,3);}
 const total=Object.values(counts).reduce((a,b)=>a+b,0);if(total!==inventory.records.length)throw Error('M3分類件数不一致');
 return {format:'S3_M3_EVIDENCE_TRIAGE_V1',site_id:inventory.site_id||null,counts,examples,total,
  decision:'NO_CONTENT_ACTION',limitations:['観測ゼロは需要ゼロではない','URL未照合は未インデックスを意味しない','記事品質・統合・削除・noindexは判定しない','集計は採用Evidenceの対象期間に限定']};
}

// M3: site-wide evidence inventory snapshot. No ranking, deletion, merge or publication decision.
function sssM3Summarize_(inventory, queryEvidence, reviewRows){
 if(!inventory||!Array.isArray(inventory.records)||!inventory.site_id)throw Error('M3台帳不正');
 const counts={MATCHED:0,SBM_ONLY:0,AMBIGUOUS:0,INVALID_URL:0,OUT_OF_SCOPE:0};
 const states={},seen=new Set();let duplicateIds=0,withMetrics=0;
 for(const a of inventory.records){
  if(!a||!a.match_status)throw Error('M3記事状態不正');
  counts[a.match_status]=(counts[a.match_status]||0)+1;
  const st=String(a.state||'未設定');states[st]=(states[st]||0)+1;
  if(a.article_id){if(seen.has(a.article_id))duplicateIds++;seen.add(a.article_id);}
  if(a.metrics!==null&&a.metrics!==undefined)withMetrics++;
 }
 const q=queryEvidence||null;
 const own=(reviewRows||[]).filter(r=>r[1]===inventory.site_id);
 const latest=sssM2CandidateRows_(own,inventory.site_id);
 return {format:'S3_SITE_DIAGNOSTIC_SNAPSHOT_V1',site_id:inventory.site_id,inventory_run_id:inventory.run_id||null,
  articles:inventory.records.length,match_counts:counts,workflow_states:states,duplicate_article_ids:duplicateIds,
  metrics_attached:withMetrics,metrics_missing:inventory.records.length-withMetrics,
  gsc_only_raw:(inventory.gscOnly||[]).length,gsc_only_normalized:inventory.unmatched_key_count||0,
  query_status:q?'AVAILABLE':'UNAVAILABLE',article_query_keys:q&&q.index?q.index.size:null,
  site_query_keys:q&&q.siteIndex?q.siteIndex.size:null,query_ignored:q?q.ignored:null,
  reviewed_requests:own.length,latest_reviewed_keywords:latest.length,
  limitations:['未観測はクリック・需要ゼロを意味しない','URL別実績は合算しない','検索クエリのサイト全体実績を記事に帰属させない','削除・noindex・統合・新規作成は本集計で決定しない']};
}
function sssM3RunDeepPreview_(){
 const c=sssConfig_(),conn=sssM1FindManagers_();
 if(!conn.complete||conn.candidates.length!==1)throw Error('先にSBM連携先を確定してください。');
 const inv=sssM1Load_(conn.candidates[0].id),q=sssM2LoadQueryEvidence_(inv);
 const rows=sssM2LedgerRows_(SpreadsheetApp.getActiveSpreadsheet()),d=sssM3Summarize_(inv,q,rows),t=sssM3EvidenceTriage_(inv);
 return ['ブログ総合診断・基礎集計（試験）','対象ブログ：'+c.siteName,'記事総数：'+d.articles+'件',
 'GSC照合：一致 '+d.match_counts.MATCHED+'件／SBMのみ '+d.match_counts.SBM_ONLY+'件',
 '照合保留・URL異常：'+(d.match_counts.AMBIGUOUS+d.match_counts.INVALID_URL+d.match_counts.OUT_OF_SCOPE)+'件',
 '記事ID重複：'+d.duplicate_article_ids+'件','検索実績の紐付けあり：'+d.metrics_attached+'件（未紐付け '+d.metrics_missing+'件）',
 'GSC側のみ：生URL '+d.gsc_only_raw+'件／正規化キー '+d.gsc_only_normalized+'件',
 '記事状態：'+Object.entries(d.workflow_states).map(([k,v])=>k+' '+v+'件').join('、'),
 '検索クエリ：'+(d.query_status==='AVAILABLE'?'利用可能':'利用不可'),
 'サイト全体クエリ：'+(d.site_query_keys===null?'不明':d.site_query_keys+'種類'),
 '記事別上位クエリ：'+(d.article_query_keys===null?'不明':d.article_query_keys+'種類'),
 '精査履歴：'+d.reviewed_requests+'件／最新候補 '+d.latest_reviewed_keywords+'件',
 '【分析データの確認対象】',
 '記事識別の確認：'+t.counts.IDENTITY_REVIEW+'件',
 'GSC URL照合なし：'+t.counts.NO_GSC_URL_MATCH+'件',
 'URL照合あり・数値未取得：'+t.counts.MATCHED_METRICS_UNAVAILABLE+'件',
 '表示回数の観測あり：'+t.counts.OBSERVED_IMPRESSIONS+'件',
 'URL照合あり・表示回数0：'+t.counts.MATCHED_ZERO_IMPRESSIONS+'件',
 '数値異常：'+t.counts.INVALID_METRICS+'件',
 '確認対象の例（最大3件）：'+t.examples.IDENTITY_REVIEW.concat(t.examples.INVALID_METRICS).slice(0,3).map(x=>x.article_id+' '+x.title).join('／'),
 '※これは全記事の基礎集計です。削除・統合・noindex・記事作成の判断は行いません。',
 '※検索実績未確認は検索需要ゼロではありません。'].join('\n');
}
// Fast first-stage M3 snapshot. Do not decompress 365-day detailed Evidence or
// the 96k-keyword query archive in an interactive google.script.run request.
// The slow deep preview remains internal until a bounded/batched reader exists.
function sssM3QuickSummarize_(articles,siteName,source){
 if(!Array.isArray(articles))throw Error('記事台帳が不正です。');
 const states={},seen=new Set(),dupes=[];let missingId=0,missingUrl=0;
 for(const a of articles){
  const st=String(a.state||'未設定');states[st]=(states[st]||0)+1;
  if(!a.article_id)missingId++;
  else if(seen.has(a.article_id)){if(dupes.length<3)dupes.push(a.article_id);}else seen.add(a.article_id);
  if(!a.url)missingUrl++;
 }
 return {format:'S3_M3_FAST_SNAPSHOT_V1',site:siteName,articles:articles.length,states,missingId,missingUrl,duplicateIds:dupes,
  evidence:source||'未確認',gsc:'NOT_LOADED',query:'NOT_LOADED',contentAction:'NONE'};
}
function sssM3RunPreview(){
 const c=sssConfig_(),conn=sssM1FindManagers_();
 if(!conn.complete||conn.candidates.length!==1)throw Error('先にSBM連携先を確定してください。');
 const id=conn.candidates[0].id;
 // Limit the initial request to the SBM inventory; no Drive ZIP reads or CSV expansion.
 const sh=SpreadsheetApp.openById(id).getSheetByName('記事管理');
 if(!sh||sh.getLastRow()<1||sh.getLastRow()>10001)throw Error('SBM記事管理の行数が不正です。');
 const articles=sssM1Articles_(sh.getRange(1,1,sh.getLastRow(),sh.getLastColumn()).getDisplayValues());
 const e=sssM3QuickSummarize_(articles,c.siteName,'この画面ではEvidenceの展開を省略');
 return ['ブログ総合診断・高速基礎集計（試験）','対象ブログ：'+e.site,'記事総数：'+e.articles+'件',
  '記事ID未設定：'+e.missingId+'件','記事URL未設定：'+e.missingUrl+'件',
  '記事ID重複（表示最大3件）：'+(e.duplicateIds.join('／')||'検出なし'),
  '記事状態：'+Object.entries(e.states).map(([k,v])=>k+' '+v+'件').join('、'),
  'GSC URL照合・記事別検索実績：今回未取得',
  '検索クエリ・Evidence品質：今回未取得',
  '精査履歴：今回未取得',
  '処理方針：SBM記事台帳のみを高速集計。大量ZIPの読み込みは行いません。',
  '※未取得を0件・検索需要ゼロと解釈しません。',
  '※削除・統合・noindex・記事作成の判断は行いません。'].join('\n');
}
function sssM3Preview(){
 const h=HtmlService.createHtmlOutput(`<!doctype html><meta charset="utf-8"><style>html,body{height:100%;margin:0;box-sizing:border-box}body{font:14px Arial;display:flex;flex-direction:column;padding:16px;gap:12px}main{flex:1;min-height:0;overflow:auto}button{padding:9px 14px}#msg{margin-left:10px;color:#174b79}#result{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7}footer{border-top:1px solid #ddd;padding-top:8px}</style><main><p>SBMの記事台帳だけを高速集計します。GSC・Evidenceの詳細集計は次工程です。記事やデータは変更しません。</p><button id="go" onclick="run()">診断を開始</button><span id="msg" role="status"></span><pre id="result"></pre><hr><button id="batch" onclick="startBatch()">全記事の分割台帳診断を開始</button><button onclick="resumeBatch()">途中から再開</button><span id="batchMsg" role="status"></span><pre id="batchResult"></pre><hr><button id="meta" onclick="runMeta()">分析データの登録状態を確認</button><span id="metaMsg" role="status"></span><pre id="metaResult"></pre></main><footer><button onclick="google.script.host.close()">閉じる</button></footer><script>function run(){const b=document.getElementById('go'),m=document.getElementById('msg'),r=document.getElementById('result');b.disabled=true;m.textContent='集計中…';r.textContent='';google.script.run.withSuccessHandler(x=>{b.disabled=false;m.textContent='集計が完了しました。';r.textContent=x}).withFailureHandler(e=>{b.disabled=false;m.textContent='集計停止：'+(e.message||e)}).sssM3RunPreview()}function runMeta(){const b=document.getElementById('meta'),m=document.getElementById('metaMsg'),r=document.getElementById('metaResult');b.disabled=true;m.textContent='確認中…';r.textContent='';google.script.run.withSuccessHandler(x=>{b.disabled=false;m.textContent='確認が完了しました。';r.textContent=x}).withFailureHandler(e=>{b.disabled=false;m.textContent='確認停止：'+(e.message||e)}).sssM3RunMetadataPreview()}function startBatch(){const b=document.getElementById('batch'),m=document.getElementById('batchMsg'),r=document.getElementById('batchResult');b.disabled=true;m.textContent='分割処理を準備中…';r.textContent='';google.script.run.withSuccessHandler(x=>nextBatch()).withFailureHandler(e=>{b.disabled=false;m.textContent='開始停止：'+(e.message||e)}).sssM3BatchStart()}function nextBatch(){const b=document.getElementById('batch'),m=document.getElementById('batchMsg'),r=document.getElementById('batchResult');google.script.run.withSuccessHandler(x=>{m.textContent='台帳走査：'+(x.scanned===undefined?x.processed:x.scanned)+'/'+x.total+'行／有効記事'+x.processed+'件';if(x.status==='COMPLETED'){google.script.run.withSuccessHandler(z=>{b.disabled=false;m.textContent='分割集計完了';r.textContent=JSON.stringify(z,null,2)}).withFailureHandler(e=>{b.disabled=false;m.textContent='集計結果の表示停止：'+(e.message||e)}).sssM3BatchSummary_()}else nextBatch()}).withFailureHandler(e=>{b.disabled=false;m.textContent='処理停止：'+(e.message||e)+'。再開可能です。'}).sssM3BatchContinue()}function resumeBatch(){const b=document.getElementById('batch'),m=document.getElementById('batchMsg');b.disabled=true;m.textContent='再開中…';nextBatch()}</script>`).setWidth(650).setHeight(610);
 SpreadsheetApp.getUi().showModalDialog(h,'ブログ総合診断・基礎集計（試験）');
}


// M3 stage 2: bounded metadata only. Never decompress ZIPs or read query CSVs here.
function sssM3MetadataSummarize_(site,compact,detailed,ledgerCount){
 if(!site||!site.siteId)throw Error('サイト設定がありません。');
 const valid=(x)=>x&&/^\d{4}-\d{2}-\d{2}$/.test(String(x.end||''));
 const cp=valid(compact)?{mode:'COMPACT',end:compact.end,days:compact.days,id:compact.id}:null;
 const dp=valid(detailed)&&detailed.status==='VERIFIED'?{mode:'DETAILED',end:detailed.end,days:365,id:detailed.id}:null;
 const chosen=dp&&(!cp||dp.end>=cp.end)?dp:cp;
 return {format:'S3_M3_METADATA_SNAPSHOT_V1',site_id:site.siteId,
  compact:cp?{end:cp.end,days:cp.days}:null,
  detailed:dp?{end:dp.end,days:dp.days}:null,
  selected:chosen?{mode:chosen.mode,end:chosen.end,days:chosen.days}:null,
  review_count:ledgerCount,content_action:'NONE',metrics_status:'NOT_LOADED',
  limitations:['ZIP・検索クエリ・記事別数値は読み込まない','登録情報だけではZIPの現時点の実在性・完全性は保証できない','データなしは需要ゼロを意味しない']};
}
function sssM3RunMetadataPreview(){
 const c=sssConfig_(),ref=sssM1CompactRef_(c),m=sssDM365State_(),a=sssDM365AuditState_(),r=sssDM365ReconState_();
 const detailed=m&&m.siteId===c.siteId&&m.propertyUri===c.propertyUri&&a&&a.status==='PASSED'&&r&&r.status==='COMPLETED'&&m.signature===r.signature&&r.final?{status:'VERIFIED',end:m.end,id:r.final.id}:null;
 const ss=SpreadsheetApp.getActiveSpreadsheet(),sh=ss.getSheetByName('S3_精査履歴');
 let n=0;if(sh&&sh.getLastRow()>=2){const ids=sh.getRange(2,2,sh.getLastRow()-1,1).getValues();n=ids.filter(x=>String(x[0])===c.siteId).length;}
 const d=sssM3MetadataSummarize_(c,ref,detailed,n);
 return ['分析データの登録状態（軽量確認）','対象ブログ：'+c.siteName,
  '簡易Evidence：'+(d.compact?d.compact.end+'まで（'+d.compact.days+'日）':'検証済み登録なし'),
  '詳細Evidence：'+(d.detailed?d.detailed.end+'まで（365日）':'完了・監査済み登録なし'),
  '採用予定：'+(d.selected?d.selected.mode+'／'+d.selected.end:'未選択'),
  '保存済み精査履歴：'+d.review_count+'件',
  '検索実績・記事別数値：今回未取得',
  '※ZIP本体を読み込まないため、品質・検索需要・記事健全性は判定しません。',
  '※SBM・Evidence・記事への書き込みは行いません。'].join('\n');
}


// M3 stage 3: bounded, resumable inventory preparation. No Evidence ZIP decompression.
// S3 owns this checkpoint sheet; SBM and the Evidence registry are strictly read-only.
const SSS_M3_BATCH_KEY_ = 'SSS_M3_BATCH_V1';
const SSS_M3_BATCH_SHEET_ = 'S3_M3_記事基盤';
const SSS_M3_BATCH_HEADERS_ = ['run_id','site_id','article_id','url','title','state','published_at','source_row','url_status'];
// Stable checksum of the source header; catches column reordering with unchanged width.
function sssM3HeaderSignature_(headers){
 const raw=JSON.stringify(headers.map(v=>String(v).trim()));
 // Non-cryptographic FNV-1a, adequate for accidental header edits.
 let h=2166136261;for(let i=0;i<raw.length;i++){h^=raw.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
 return h.toString(16).padStart(8,'0');
}
function sssM3BatchRowCount_(state){return state.total_rows-1;}
function sssM3BatchValidate_(state,config,managerId){
 if(!state||state.format!=='S3_M3_BATCH_V1'||state.site_id!==config.siteId||state.property!==config.propertyUri||state.manager_id!==managerId||!Number.isInteger(state.next_row)||!Number.isInteger(state.total_rows)||state.next_row<2||state.next_row>state.total_rows+1||state.total_rows>10001||!Number.isInteger(state.processed)||state.processed<0||state.processed>sssM3BatchRowCount_(state)||!Number.isInteger(state.scanned_rows===undefined?state.next_row-2:state.scanned_rows)||(state.scanned_rows===undefined?state.next_row-2:state.scanned_rows)!==state.next_row-2||state.processed>state.next_row-2||!state.header_signature)throw Error('M3分割処理の状態が不一致です。再開始してください。');
 return state;
}
function sssM3BatchSheet_(){
 const ss=SpreadsheetApp.getActiveSpreadsheet();let sh=ss.getSheetByName(SSS_M3_BATCH_SHEET_);
 if(!sh)sh=ss.insertSheet(SSS_M3_BATCH_SHEET_);
 const head=sh.getRange(1,1,1,SSS_M3_BATCH_HEADERS_.length).getDisplayValues()[0];
 if(head.some((x,i)=>x!==SSS_M3_BATCH_HEADERS_[i])){
  if(sh.getLastRow()>1)throw Error('M3作業シートの列構成が異なります。自動上書きはしません。');
  sh.getRange(1,1,1,SSS_M3_BATCH_HEADERS_.length).setValues([SSS_M3_BATCH_HEADERS_]);
 }
 return sh;
}
function sssM3BatchStart(){
 const c=sssConfig_(),conn=sssM1FindManagers_();
 if(!conn.complete||conn.candidates.length!==1)throw Error('SBM連携先が一意に確定していません。');
 const managerId=conn.candidates[0].id,src=SpreadsheetApp.openById(managerId).getSheetByName('記事管理');
 if(!src||src.getLastRow()<1||src.getLastRow()>10001)throw Error('SBM記事管理の行数が不正です。');
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const sh=sssM3BatchSheet_();
  const previous=sssProperties_().getProperty(SSS_M3_BATCH_KEY_);
  if(previous){const old=JSON.parse(previous);if(old.status==='RUNNING')throw Error('実行中の分割処理があります。続きから再開してください。');}
  const header=src.getRange(1,1,1,src.getLastColumn()).getDisplayValues()[0];
  sssM1Articles_([header]); // Validate required columns before deleting old checkpoints.
  if(sh.getLastRow()>1)sh.deleteRows(2,sh.getLastRow()-1);
  const state={format:'S3_M3_BATCH_V1',run_id:Utilities.getUuid(),site_id:c.siteId,property:c.propertyUri,manager_id:managerId,next_row:2,total_rows:src.getLastRow(),source_columns:src.getLastColumn(),header_signature:sssM3HeaderSignature_(header),status:'RUNNING',processed:0,scanned_rows:0,started_at:new Date().toISOString()};
  sssProperties_().setProperty(SSS_M3_BATCH_KEY_,JSON.stringify(state));
  return {status:state.status,processed:0,total:state.total_rows-1,run_id:state.run_id};
 }finally{lock.releaseLock();}
}
function sssM3BatchContinue(){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const c=sssConfig_(),p=sssProperties_(),raw=p.getProperty(SSS_M3_BATCH_KEY_);
  if(!raw)throw Error('先にM3分割処理を開始してください。');
  const s=JSON.parse(raw);sssM3BatchValidate_(s,c,s.manager_id);
  if(s.status==='COMPLETED')return {status:'COMPLETED',processed:s.processed,total:s.total_rows-1,run_id:s.run_id};
  if(s.status!=='RUNNING')throw Error('M3処理が停止しています。');
  const source=SpreadsheetApp.openById(s.manager_id).getSheetByName('記事管理');
  if(!source||source.getLastRow()!==s.total_rows||source.getLastColumn()!==s.source_columns)throw Error('SBM記事管理の行数・列数が開始時から変わりました。再開始してください。');
  const header=source.getRange(1,1,1,s.source_columns).getDisplayValues()[0];
  if(sssM3HeaderSignature_(header)!==s.header_signature)throw Error('SBM記事管理の列名または並びが変わりました。再開始してください。');
  // One bounded batch per RPC; avoids large Drive ZIPs and long synchronous operations.
  const count=Math.min(75,s.total_rows-s.next_row+1),sh=sssM3BatchSheet_();
  if(sh.getLastRow()!==s.processed+1)throw Error('M3作業シートの進捗が一致しません。再開始してください。');
  // Verify the last committed checkpoint row before appending. This detects a manual
  // sheet edit or an interrupted commit without re-reading the entire inventory.
  if(s.processed>0){const last=sh.getRange(s.processed+1,1,1,9).getDisplayValues()[0];
   if(last[0]!==s.run_id||last[1]!==c.siteId||(!Number.isInteger(Number(last[7]))||Number(last[7])>=s.next_row||Number(last[7])<2))throw Error('M3作業シートの最終行が不一致です。再開始してください。');}
  if(count>0){
   const rows=source.getRange(s.next_row,1,count,s.source_columns).getDisplayValues();
   const articles=sssM1Articles_([header,...rows]);const scope=sssP72PropertyScope_(c.propertyUri);
   const out=articles.map(a=>[s.run_id,c.siteId,a.article_id,a.url,a.title,a.state,a.published_at||'',s.next_row+a.source_row-2,sssM1UrlInfo_(a.url,scope).status]);
   if(out.length)sh.getRange(sh.getLastRow()+1,1,out.length,SSS_M3_BATCH_HEADERS_.length).setValues(out);
   s.processed+=out.length;s.next_row+=count;s.scanned_rows=s.next_row-2;
  }
  if(s.next_row>s.total_rows){s.status='COMPLETED';s.completed_at=new Date().toISOString();}
  p.setProperty(SSS_M3_BATCH_KEY_,JSON.stringify(s));
  return {status:s.status,processed:s.processed,scanned:s.next_row-2,total:s.total_rows-1,run_id:s.run_id};
 }finally{lock.releaseLock();}
}
function sssM3BatchStatus(){
 const c=sssConfig_(),raw=sssProperties_().getProperty(SSS_M3_BATCH_KEY_);
 if(!raw)return {status:'NOT_STARTED',processed:0};
 const s=JSON.parse(raw);if(s.site_id!==c.siteId||s.property!==c.propertyUri)return {status:'OTHER_SITE',processed:0};
 return {status:s.status,processed:s.processed,scanned:s.next_row-2,total:s.total_rows-1,run_id:s.run_id};
}
function sssM3BatchSummary_(){
 const st=sssM3BatchStatus();if(st.status!=='COMPLETED')throw Error('M3分割処理が完了していません。');
 const sh=sssM3BatchSheet_(),rows=sh.getLastRow()>1?sh.getRange(2,1,sh.getLastRow()-1,9).getDisplayValues():[];
 if(rows.some(r=>r[0]!==st.run_id))throw Error('別の実行結果が混在しています。');
 if(rows.length!==st.processed||rows.some((r,i)=>r[1]!==sssConfig_().siteId||(i>0&&Number(r[7])<=Number(rows[i-1][7]))))throw Error('M3作業シートの行順・サイトが不一致です。');
 const articles=rows.map(r=>({article_id:r[2],url:r[3],state:r[5]}));
 const summary=sssM3QuickSummarize_(articles,sssConfig_().siteName,'NOT_LOADED');
 const urls={};for(const r of rows)urls[r[8]]=(urls[r[8]]||0)+1;
 return {format:'S3_M3_BATCH_SUMMARY_V1',run_id:st.run_id,articles:summary.articles,states:summary.states,missing_id:summary.missingId,missing_url:summary.missingUrl,duplicate_ids:summary.duplicateIds,url_states:urls,evidence:'NOT_LOADED',content_action:'NONE'};
}

// M3 evidence execution planner: metadata-only, never opens or decompresses a ZIP.
// A ZIP cannot be streamed by Utilities.unzip. Therefore a 75-row article batch
// does not itself bound ZIP expansion; a separate materialization step is required.
function sssM3EvidencePlan_(compact,detailed){
 const valid=x=>!!x&&/^\d{4}-\d{2}-\d{2}$/.test(String(x.end||''));
 const cp=valid(compact)?{mode:'COMPACT',end:String(compact.end),id:String(compact.id||'')}:null;
 const dp=valid(detailed)&&detailed.status==='VERIFIED'?{mode:'DETAILED',end:String(detailed.end),id:String(detailed.id||'')}:null;
 const selected=dp&&(!cp||dp.end>=cp.end)?dp:cp;
 return {format:'S3_M3_EVIDENCE_PLAN_V1',selected:selected||null,
  materialization:'NOT_STARTED',article_batch_size:75,
  zip_expansion_bounded:false,
  content_action:'NONE',
  next_step:selected?'MATERIALIZE_EVIDENCE_INDEX':'VERIFY_EVIDENCE_FIRST',
  limitations:['ZIPの展開は一括処理のため、記事75行分割では時間上限を回避できない',
   '記事ごとの実績は中間索引が完成するまで未取得','未観測を表示回数ゼロとみなさない']};
}


// M3 stage 4: bounded materialization from the Collector's already extracted
// _SDSC_PAGE_PERIOD sheet. This deliberately does NOT open an Evidence ZIP.
// It is available only while the Collector's completed run still corresponds
// to the selected compact Evidence. Other cases return NOT_AVAILABLE, not zero.
const SSS_M3_PAGE_STAGE_KEY_='SSS_M3_PAGE_STAGE_V1';
const SSS_M3_PAGE_STAGE_SHEET_='S3_M3_ページ中間索引';
const SSS_M3_PAGE_STAGE_HEADERS_=['run_id','site_id','source_row','page','clicks','impressions','ctr','position'];
function sssM3PageStageSource_(){
 const c=sssConfig_(),ref=sssM1CompactRef_(c),run=sdscGetRun_();
 if(!ref||!run||run.status!=='COMPLETED'||run.deltaAcquisition||String(run.outputFileId||'')!==ref.id)
  return {available:false,reason:'採用済み簡易Evidenceと一致する完了収集の作業表がありません。ZIPは展開しません。'};
 sssAssertRunSite_(run,c);
 if(!run.period||run.period.startDate!==ref.start||run.period.endDate!==ref.end||Number(run.period.days)!==ref.days)
  return {available:false,reason:'作業表の収集期間が採用済みEvidenceと一致しません。'};
 const sh=sssSpreadsheet_().getSheetByName(SDSC_CONFIG.sheets.pagePeriod);
 if(!sh||sh.getLastRow()<1||sh.getLastRow()>200001||sh.getLastColumn()!==6)
  return {available:false,reason:'ページ集計の作業表がないか、処理上限を超えています。'};
 const h=sh.getRange(1,1,1,6).getDisplayValues()[0];
 if(h.join('|')!=='period|page|clicks|impressions|ctr|position')
  return {available:false,reason:'ページ集計の列構成が一致しません。'};
 return {available:true,site_id:c.siteId,evidence_id:ref.id,source_rows:sh.getLastRow(),source_signature:sssM3HeaderSignature_(h),sheet:sh};
}
function sssM3PageStageSheet_(){
 const ss=sssSpreadsheet_();let sh=ss.getSheetByName(SSS_M3_PAGE_STAGE_SHEET_);
 if(!sh)sh=ss.insertSheet(SSS_M3_PAGE_STAGE_SHEET_);
 const h=sh.getRange(1,1,1,8).getDisplayValues()[0];
 if(h.some((v,i)=>v!==SSS_M3_PAGE_STAGE_HEADERS_[i])){
  if(sh.getLastRow()>1)throw Error('既存のページ中間索引の列構成が異なります。自動上書きしません。');
  sh.getRange(1,1,1,8).setValues([SSS_M3_PAGE_STAGE_HEADERS_]);
 }
 return sh;
}
// M3 compact Evidence fallback. Only small verified compact packages are eligible.
// The compressed-size guard avoids automatically unzipping large archives; it
// does not imply that ZIP decompression is streaming or fully memory bounded.
const SSS_M3_COMPACT_ZIP_MAX_BYTES_=2*1024*1024;
const SSS_M3_COMPACT_PAGE_MAX_=10000;
function sssM3CompactFallbackPlan_(ref,size){
 if(!ref||!ref.id)return {available:false,reason:'検証済みの簡易Evidenceがありません。'};
 if(!Number.isFinite(size)||size<=0||size>SSS_M3_COMPACT_ZIP_MAX_BYTES_)
  return {available:false,reason:'簡易Evidence ZIPが安全な自動展開上限（2MB）を超えています。大容量ZIPは自動展開しません。'};
 return {available:true,mode:'COMPACT_ZIP',evidence_id:ref.id};
}
function sssM3CompactFallbackSource_(){
 const c=sssConfig_(),ref=sssM1CompactRef_(c);
 if(!ref)return sssM3CompactFallbackPlan_(null,0);
 try{const f=DriveApp.getFileById(ref.id);
  if(f.isTrashed()||f.getMimeType()!=='application/zip')return {available:false,reason:'簡易Evidence ZIPが存在しないか形式が不正です。'};
  return sssM3CompactFallbackPlan_(ref,f.getSize());
 }catch(e){return {available:false,reason:'簡易Evidence ZIPの情報を確認できません：'+String(e&&e.message||e)};}
}
// M3 fallback for large compact ZIPs: bounded Search Console page re-query.
// This is NEW OBSERVATION of the same date window, NOT a read of archived Evidence.
// Never label its numbers as verified archived Evidence or infer zero demand.
const SSS_M3_GSC_BATCH_=400;
const SSS_M3_GSC_PAGE_CAP_=48000;
function sssM3GscPlan_(ref){
 if(!ref||!ref.id||!/^\d{4}-\d{2}-\d{2}$/.test(ref.start)||!/^\d{4}-\d{2}-\d{2}$/.test(ref.end))
  return {available:false,reason:'GSC再取得の基準となる検証済みEvidenceの期間がありません。'};
 return {available:true,mode:'GSC_REQUERY',reason:'大容量ZIPを展開せず、Evidenceと同じ日付範囲のGSCページ実績を小分けに再取得します。保存済みEvidenceの数値と同一である保証はありません。',start:ref.start,end:ref.end};
}
function sssM3GscRows_(response,runId,siteId,offset){
 if(!response||!Array.isArray(response.rows))throw Error('GSCページ実績の応答形式が不正です。');
 if(response.rows.length>SSS_M3_GSC_BATCH_)throw Error('GSCの返却行数が上限を超えています。');
 const urls=new Set();
 return response.rows.map((r,i)=>{
  if(r&&Array.isArray(r.keys)&&r.keys.length===1){if(urls.has(String(r.keys[0])))throw Error('同一GSC応答内にURL重複があります。');urls.add(String(r.keys[0]));}
  if(!r||!Array.isArray(r.keys)||r.keys.length!==1||!/^https?:\/\//i.test(String(r.keys[0])))throw Error('GSCページURLが不正です。');
  const n=[r.clicks,r.impressions,r.ctr,r.position].map(Number);
  if(!n.every(Number.isFinite)||n.some(v=>v<0)||!Number.isSafeInteger(n[0])||!Number.isSafeInteger(n[1])||n[0]>n[1]||n[2]>1)throw Error('GSCページ実績の数値が不正です。');
  return [runId,siteId,offset+i+2,String(r.keys[0]),...n];
 });
}
function sssM3GscFetch_(c,ref,offset){
 if(!Number.isSafeInteger(offset)||offset<0||offset>SSS_M3_GSC_PAGE_CAP_)throw Error('GSCの取得位置が不正です。');
 const response=sdscSearchAnalyticsQuery_(c.propertyUri,{startDate:ref.start,endDate:ref.end,type:'web',dataState:'final',dimensions:['page'],rowLimit:SSS_M3_GSC_BATCH_,startRow:offset});
 return response;
}
function sssM3PageStageStartGsc_(){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const c=sssConfig_(),ref=sssM1CompactRef_(c),plan=sssM3GscPlan_(ref);
  if(!plan.available)return {status:'NOT_AVAILABLE',reason:plan.reason};
  const p=sssProperties_(),old=p.getProperty(SSS_M3_PAGE_STAGE_KEY_);
  if(old)throw Error('ページ中間索引の既存状態があります。自動上書きしません。');
  const sh=sssM3PageStageSheet_();if(sh.getLastRow()>1)throw Error('ページ中間索引に既存データがあります。自動上書きしません。');
  // Fetch before committing checkpoint: permission/network errors leave no state.
  const response=sssM3GscFetch_(c,ref,0),runId=Utilities.getUuid(),rows=sssM3GscRows_(response,runId,c.siteId,0);
  if(!rows.length)return {status:'NOT_AVAILABLE',reason:'GSCからページ実績を取得できませんでした。ゼロ需要とは判断しません。'};
  sh.getRange(2,1,rows.length,8).setValues(rows);
  const finished=rows.length<SSS_M3_GSC_BATCH_;
  const st={format:'S3_M3_PAGE_STAGE_V1',status:finished?'COMPLETED':'RUNNING',run_id:runId,site_id:c.siteId,
   evidence_id:ref.id,source_mode:'GSC_REQUERY',source_signature:'GSC_REQUERY:'+ref.id+':'+ref.start+':'+ref.end,
   start:ref.start,end:ref.end,next_offset:rows.length,scanned:rows.length,stored:rows.length,
   source_rows:finished?rows.length+1:SSS_M3_GSC_PAGE_CAP_+1,next_row:rows.length+2,
   limitations:['保存済みEvidenceではなくGSC APIから同じ期間を再取得','GSCの返却上限・再取得時点の差異により網羅性は保証されない']};
  p.setProperty(SSS_M3_PAGE_STAGE_KEY_,JSON.stringify(st));
  return {status:st.status,scanned:st.scanned,stored:st.stored,total:finished?st.stored:null,source_mode:st.source_mode,content_action:'NONE'};
 }finally{lock.releaseLock();}
}
function sssM3PageStageContinueGsc_(){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const c=sssConfig_(),p=sssProperties_(),raw=p.getProperty(SSS_M3_PAGE_STAGE_KEY_);
  if(!raw)throw Error('GSCページ索引が未開始です。');
  const st=JSON.parse(raw),ref=sssM1CompactRef_(c),sh=sssM3PageStageSheet_();
  if(st.format!=='S3_M3_PAGE_STAGE_V1'||st.source_mode!=='GSC_REQUERY'||st.site_id!==c.siteId||!ref||st.evidence_id!==ref.id||
   st.source_signature!=='GSC_REQUERY:'+ref.id+':'+ref.start+':'+ref.end||st.start!==ref.start||st.end!==ref.end||
   !Number.isSafeInteger(st.next_offset)||st.next_offset!==st.stored||st.scanned!==st.stored||sh.getLastRow()!==st.stored+1)
   throw Error('GSC再取得のサイト・期間・保存進捗が一致しません。');
  if(st.status==='COMPLETED')return {status:'COMPLETED',scanned:st.scanned,stored:st.stored,total:st.stored,source_mode:st.source_mode};
  if(st.status!=='RUNNING'||st.next_offset>=SSS_M3_GSC_PAGE_CAP_)throw Error('GSCの取得上限に達しました。網羅性が確認できないため安全停止します。');
  const last=sh.getRange(st.stored+1,1,1,8).getDisplayValues()[0];
  if(last[0]!==st.run_id||last[1]!==c.siteId||Number(last[2])!==st.stored+1)throw Error('GSC再取得の末尾行が一致しません。');
  const response=sssM3GscFetch_(c,ref,st.next_offset),rows=sssM3GscRows_(response,st.run_id,c.siteId,st.next_offset);
  // Duplicate page keys across batches indicate unstable pagination; do not continue.
  if(rows.length){
   const seen=new Set(sh.getRange(2,4,st.stored,1).getDisplayValues().map(r=>r[0]));
   if(rows.some(r=>seen.has(r[3])))throw Error('GSCのページングでURL重複を検出しました。再取得の整合性を保証できません。');
   sh.getRange(sh.getLastRow()+1,1,rows.length,8).setValues(rows);
  }
  st.stored+=rows.length;st.scanned+=rows.length;st.next_offset+=rows.length;st.next_row=st.stored+2;
  if(rows.length<SSS_M3_GSC_BATCH_){st.status='COMPLETED';st.source_rows=st.stored+1;}
  p.setProperty(SSS_M3_PAGE_STAGE_KEY_,JSON.stringify(st));
  return {status:st.status,scanned:st.scanned,stored:st.stored,total:st.status==='COMPLETED'?st.stored:null,source_mode:st.source_mode,content_action:'NONE'};
 }finally{lock.releaseLock();}
}
function sssM3CompactPageRows_(pages,runId,siteId){
 if(!(pages instanceof Map)||pages.size>SSS_M3_COMPACT_PAGE_MAX_)throw Error('簡易Evidenceのページ数が安全上限を超えています。');
 const out=[];let sourceRow=1;
 for(const [url,value] of pages){sourceRow++;
  const m=value&&value.compact&&value.compact.windows&&value.compact.windows.full;
  // Null is unknown / zero-filled in compact Evidence, never a measured zero.
  if(!m)continue;
  const nums=[m.clicks,m.impressions,m.ctr,m.position];
  if(!url||!nums.every(Number.isFinite)||nums.some(v=>v<0)||!Number.isSafeInteger(nums[0])||!Number.isSafeInteger(nums[1])||nums[0]>nums[1]||nums[2]>1)throw Error('簡易Evidenceのページ実績が不正です。');
  out.push([runId,siteId,sourceRow,url,...nums]);
 }
 return out;
}
function sssM3PageStageStartCompact_(){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const c=sssConfig_(),fallback=sssM3CompactFallbackSource_();
  if(!fallback.available)return {status:'NOT_AVAILABLE',reason:fallback.reason};
  const p=sssProperties_(),raw=p.getProperty(SSS_M3_PAGE_STAGE_KEY_);
  if(raw){const prev=JSON.parse(raw);
   if(prev.site_id!==c.siteId||prev.status==='RUNNING')throw Error('既存のページ中間索引を保護するため停止しました。');
   if(prev.status==='COMPLETED')throw Error('ページ中間索引は既に完了しています。');
  }
  // The package reader validates manifest, site, period, and page CSV.
  // ZIP is unzipped only after the compressed-size gate above.
  const ref=sssM1CompactRef_(c),e=sssM1ReadCompact_(c,ref),runId=Utilities.getUuid();
  const rows=sssM3CompactPageRows_(e.pages,runId,c.siteId);
  const sh=sssM3PageStageSheet_();
  if(sh.getLastRow()>1)throw Error('既存のページ中間索引があるため、自動上書きしません。');
  for(let i=0;i<rows.length;i+=400)sh.getRange(sh.getLastRow()+1,1,Math.min(400,rows.length-i),8).setValues(rows.slice(i,i+400));
  const st={format:'S3_M3_PAGE_STAGE_V1',status:'COMPLETED',run_id:runId,site_id:c.siteId,evidence_id:ref.id,
   source_rows:e.pages.size+1,source_signature:'COMPACT_EVIDENCE:'+ref.id,next_row:e.pages.size+2,
   scanned:e.pages.size,stored:rows.length,source_mode:'COMPACT_ZIP',unknown_pages:e.pages.size-rows.length};
  p.setProperty(SSS_M3_PAGE_STAGE_KEY_,JSON.stringify(st));
  return {status:'COMPLETED',scanned:st.scanned,stored:st.stored,total:st.scanned,unknown_pages:st.unknown_pages,source_mode:st.source_mode,content_action:'NONE'};
 }finally{lock.releaseLock();}
}
function sssM3PageStageStart(){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const source=sssM3PageStageSource_();if(!source.available)return {status:'NOT_AVAILABLE',reason:source.reason};
  const p=sssProperties_(),previous=p.getProperty(SSS_M3_PAGE_STAGE_KEY_);
  if(previous&&JSON.parse(previous).status==='RUNNING')throw Error('中間索引作成中です。続きから実行してください。');
  const sh=sssM3PageStageSheet_();if(sh.getLastRow()>1)sh.deleteRows(2,sh.getLastRow()-1);
  const st={format:'S3_M3_PAGE_STAGE_V1',status:'RUNNING',run_id:Utilities.getUuid(),site_id:source.site_id,evidence_id:source.evidence_id,source_rows:source.source_rows,source_signature:source.source_signature,next_row:2,scanned:0,stored:0};
  p.setProperty(SSS_M3_PAGE_STAGE_KEY_,JSON.stringify(st));return {status:st.status,scanned:0,total:st.source_rows-1,stored:0};
 }finally{lock.releaseLock();}
}
function sssM3PageStageContinue(){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const p=sssProperties_(),raw=p.getProperty(SSS_M3_PAGE_STAGE_KEY_);
  if(!raw)throw Error('ページ中間索引を先に開始してください。');
  const st=JSON.parse(raw),src=sssM3PageStageSource_();
  if(!src.available)throw Error(src.reason);
  if(st.format!=='S3_M3_PAGE_STAGE_V1'||st.site_id!==src.site_id||st.evidence_id!==src.evidence_id||st.source_rows!==src.source_rows||st.source_signature!==src.source_signature||!Number.isInteger(st.next_row)||st.next_row<2||st.next_row>st.source_rows+1||st.scanned!==st.next_row-2)throw Error('ページ中間索引の再開条件が変わりました。');
  if(st.status==='COMPLETED')return {status:st.status,scanned:st.scanned,stored:st.stored,total:st.source_rows-1};
  if(st.status!=='RUNNING')throw Error('ページ中間索引は実行中ではありません。');
  const dest=sssM3PageStageSheet_();if(dest.getLastRow()!==st.stored+1)throw Error('中間索引の保存行数が一致しません。');
  if(st.stored){const last=dest.getRange(st.stored+1,1,1,8).getDisplayValues()[0];if(last[0]!==st.run_id||last[1]!==st.site_id)throw Error('中間索引の実行IDが一致しません。');}
  const n=Math.min(400,st.source_rows-st.next_row+1),rows=n>0?src.sheet.getRange(st.next_row,1,n,6).getDisplayValues():[];
  const out=[];
  rows.forEach((r,i)=>{
   if(r[0]!=='full')return;
   const vals=r.slice(2).map(Number);
   if(!r[1]||r.slice(2).some(x=>String(x).trim()==='')||!vals.every(Number.isFinite)||vals.some(x=>x<0)||vals[0]>vals[1]||vals[2]>1)throw Error('ページ集計に不正な数値があります（元行'+(st.next_row+i)+'）。');
   out.push([st.run_id,st.site_id,st.next_row+i,r[1],...vals]);
  });
  if(out.length)dest.getRange(dest.getLastRow()+1,1,out.length,8).setValues(out);
  st.next_row+=n;st.scanned+=n;st.stored+=out.length;
  if(st.next_row>st.source_rows)st.status='COMPLETED';
  p.setProperty(SSS_M3_PAGE_STAGE_KEY_,JSON.stringify(st));
  return {status:st.status,scanned:st.scanned,stored:st.stored,total:st.source_rows-1};
 }finally{lock.releaseLock();}
}
function sssM3PageStageStatus(){
 const raw=sssProperties_().getProperty(SSS_M3_PAGE_STAGE_KEY_);
 if(!raw)return {status:'NOT_STARTED'};
 const st=JSON.parse(raw),c=sssConfig_();
 return st.site_id===c.siteId?{status:st.status,run_id:st.run_id,scanned:st.scanned,stored:st.stored,total:st.source_rows-1}:{status:'OTHER_SITE'};
}


// M3 stage 5: conservative URL-to-article matching, independent of Evidence ZIP.
// Pure matching helper. A normalized match is never used when two SBM articles
// share that key; GSC-only pages remain unowned. This is not a content decision.
function sssM3MatchPageRows_(articleRows,pageRows){
 const exact=new Map(),normalized=new Map(),bad=[];
 const add=(map,key,a)=>{if(!key)return;const list=map.get(key)||[];list.push(a);map.set(key,list);};
 for(const a of articleRows){
  const id=String(a.article_id||'').trim(),url=String(a.url||'').trim();
  if(!id||!url){bad.push({article_id:id,reason:'MISSING_ID_OR_URL'});continue;}
  add(exact,url,a);add(normalized,sssP70NormalizeUrl_(url),a);
 }
 const out=[],counts={EXACT:0,NORMALIZED:0,AMBIGUOUS:0,UNMATCHED:0,INVALID_URL:0};
 for(const p of pageRows){
  const url=String(p.url||'').trim(),key=sssP70NormalizeUrl_(url);
  if(!key){counts.INVALID_URL++;out.push({url,status:'INVALID_URL',article_id:null});continue;}
  const candidates=normalized.get(key)||[];
  const unique=[...new Map(candidates.map(a=>[a.article_id,a])).values()];
  // Exact URLs may have multiple registered IDs; never pick arbitrarily.
  const status=unique.length>1?'AMBIGUOUS':unique.length===0?'UNMATCHED':exact.has(url)?'EXACT':'NORMALIZED';
  counts[status]++;
  out.push({url,status,article_id:unique.length===1?unique[0].article_id:null,
   clicks:p.clicks,impressions:p.impressions});
 }
 return {format:'S3_M3_PAGE_MATCH_V1',counts,rows:out,invalid_articles:bad,content_action:'NONE'};
}
// Bounded read-only pilot for a single slice of the already staged page index.
// Does not save a diagnosis or modify SBM, Evidence, or existing article data.
function sssM3MatchPagePreview(offset){
 const c=sssConfig_(),batch=sssM3BatchStatus(),stage=sssM3PageStageStatus();
 if(batch.status!=='COMPLETED'||stage.status!=='COMPLETED')
  return {status:'NOT_READY',reason:'記事基盤とページ中間索引の両方を完了してください。'};
 const articleSheet=sssM3BatchSheet_(),pageSheet=sssM3PageStageSheet_();
 if(articleSheet.getLastRow()>10001||pageSheet.getLastRow()>200001)throw Error('分析対象の行数が上限を超えました。');
 const ar=articleSheet.getLastRow()>1?articleSheet.getRange(2,1,articleSheet.getLastRow()-1,9).getDisplayValues():[];
 if(ar.length!==batch.processed||ar.some(r=>r[0]!==batch.run_id||r[1]!==c.siteId))throw Error('記事基盤の実行ID・サイトが一致しません。');
 const start=Number(offset===undefined?0:offset);
 if(!Number.isSafeInteger(start)||start<0||start>stage.stored)throw Error('ページ分析の開始位置が不正です。');
 const count=Math.min(400,stage.stored-start),pr=count?pageSheet.getRange(start+2,1,count,8).getDisplayValues():[];
 if(pr.some(r=>r[0]!==stage.run_id||r[1]!==c.siteId))throw Error('ページ索引の実行ID・サイトが一致しません。');
 const articles=ar.map(r=>({article_id:r[2],url:r[3]}));
 const pages=pr.map(r=>({url:r[3],clicks:Number(r[4]),impressions:Number(r[5])}));
 if(pages.some(p=>!Number.isFinite(p.clicks)||!Number.isFinite(p.impressions)||p.clicks<0||p.impressions<0||p.clicks>p.impressions))throw Error('ページ索引の数値が不正です。');
 const result=sssM3MatchPageRows_(articles,pages);
 return {status:start+count>=stage.stored?'COMPLETED':'RUNNING',offset:start,next_offset:start+count,total:stage.stored,
  counts:result.counts,sample:result.rows.slice(0,10),content_action:'NONE',
  note:'400ページ以内の読取専用照合。未照合は検索需要ゼロを意味しません。'};
}


// M3 stage 6: aggregate a bounded, validated page-match slice by article.
// This is deliberately a partial observation, not a full-period diagnosis.
// Unmatched/ambiguous pages are never assigned to an article.
function sssM3AggregateMatchSlice_(match){
 if(!match||match.format!=='S3_M3_PAGE_MATCH_V1'||!Array.isArray(match.rows))throw Error('M3照合データの形式が不正です。');
 const byId=new Map(),counts={EXACT:0,NORMALIZED:0,AMBIGUOUS:0,UNMATCHED:0,INVALID_URL:0};
 let unassignedClicks=0,unassignedImpressions=0;
 for(const r of match.rows){
  if(!Object.prototype.hasOwnProperty.call(counts,r.status))throw Error('M3照合状態が不正です。');
  counts[r.status]++;
  const clicks=Number(r.clicks),impressions=Number(r.impressions);
  if(r.status==='INVALID_URL')continue;
  if(!Number.isFinite(clicks)||!Number.isFinite(impressions)||clicks<0||impressions<0||clicks>impressions)throw Error('M3検索実績の数値が不正です。');
  if(r.status==='AMBIGUOUS'||r.status==='UNMATCHED'){
   unassignedClicks+=clicks;unassignedImpressions+=impressions;continue;
  }
  const id=String(r.article_id||'').trim();
  if(!id)throw Error('M3照合済み記事IDがありません。');
  const a=byId.get(id)||{article_id:id,clicks:0,impressions:0,page_rows:0};
  a.clicks+=clicks;a.impressions+=impressions;a.page_rows++;byId.set(id,a);
 }
 return {format:'S3_M3_PAGE_METRICS_SLICE_V1',counts,articles:[...byId.values()].sort((a,b)=>a.article_id.localeCompare(b.article_id)),unassigned:{clicks:unassignedClicks,impressions:unassignedImpressions},content_action:'NONE',coverage:'PARTIAL_SLICE'};
}
function sssM3MetricsSlicePreview(offset){
 const c=sssConfig_(),batch=sssM3BatchStatus(),stage=sssM3PageStageStatus();
 if(batch.status!=='COMPLETED'||stage.status!=='COMPLETED')return {status:'NOT_READY',reason:'記事基盤とページ中間索引の両方を完了してください。'};
 const aSheet=sssM3BatchSheet_(),pSheet=sssM3PageStageSheet_();
 if(aSheet.getLastRow()>10001||pSheet.getLastRow()>200001)throw Error('分析対象の行数が上限を超えました。');
 const ar=aSheet.getLastRow()>1?aSheet.getRange(2,1,aSheet.getLastRow()-1,9).getDisplayValues():[];
 if(ar.length!==batch.processed||ar.some(r=>r[0]!==batch.run_id||r[1]!==c.siteId))throw Error('記事台帳の実行ID・サイトが一致しません。');
 const start=Number(offset===undefined?0:offset);
 if(!Number.isSafeInteger(start)||start<0||start>stage.stored)throw Error('開始位置が不正です。');
 const count=Math.min(400,stage.stored-start),pr=count?pSheet.getRange(start+2,1,count,8).getDisplayValues():[];
 if(pr.some(r=>r[0]!==stage.run_id||r[1]!==c.siteId))throw Error('ページ索引の実行ID・サイトが一致しません。');
 const pages=pr.map(r=>({url:r[3],clicks:Number(r[4]),impressions:Number(r[5])}));
 if(pages.some(p=>!Number.isFinite(p.clicks)||!Number.isFinite(p.impressions)||p.clicks<0||p.impressions<0||p.clicks>p.impressions))throw Error('ページ索引の数値が不正です。');
 const match=sssM3MatchPageRows_(ar.map(r=>({article_id:r[2],url:r[3]})),pages);
 const agg=sssM3AggregateMatchSlice_(match);
 return {status:start+count>=stage.stored?'COMPLETED':'RUNNING',offset:start,next_offset:start+count,total:stage.stored,run_ids:{articles:batch.run_id,pages:stage.run_id},...agg,note:'一部分の実績です。全件の診断・削除・統合・noindexの判定には使用しません。'};
}


// M3 stage 7: append-only, resumable page-metrics journal. Each 400-page
// slice is committed as one batch with an explicit END marker. An interrupted
// write fails closed; it never silently replays the slice or double counts.
const SSS_M3_METRICS_KEY_='SSS_M3_METRICS_JOURNAL_V1';
const SSS_M3_METRICS_SHEET_='S3_M3_記事別実績中間集計';
const SSS_M3_METRICS_HEADERS_=['run_id','site_id','batch_start','batch_end','kind','article_id','clicks','impressions','page_rows','match_status'];
function sssM3MetricsJournalSheet_(){
 const ss=sssSpreadsheet_();let sh=ss.getSheetByName(SSS_M3_METRICS_SHEET_);
 if(!sh)sh=ss.insertSheet(SSS_M3_METRICS_SHEET_);
 const h=sh.getRange(1,1,1,10).getDisplayValues()[0];
 if(h.some((v,i)=>v!==SSS_M3_METRICS_HEADERS_[i])){
  if(sh.getLastRow()>1)throw Error('M3実績中間集計の列構成が異なります。自動上書きしません。');
  sh.getRange(1,1,1,10).setValues([SSS_M3_METRICS_HEADERS_]);
 }
 return sh;
}
function sssM3MetricsJournalPlan_(state,batch,stage,rowCount,lastRow){
 if(!state||state.format!=='S3_M3_METRICS_JOURNAL_V1'||state.article_run!==batch.run_id||state.page_run!==stage.run_id||state.site_id!==state.current_site||state.total!==stage.stored)
  throw Error('M3実績集計の元データが変わりました。再開始してください。');
 if(!Number.isSafeInteger(state.next_offset)||state.next_offset<0||state.next_offset>state.total||!Number.isSafeInteger(state.written)||state.written<0||rowCount!==state.written+1)
  throw Error('M3実績集計の進捗と保存行数が一致しません。');
 if(state.written>0&&(!lastRow||lastRow[0]!==state.run_id||lastRow[1]!==state.site_id||lastRow[4]!=='END'||Number(lastRow[3])!==state.next_offset))
  throw Error('M3実績集計の最終コミットが一致しません。再実行による二重計上を停止しました。');
 return {start:state.next_offset,count:Math.min(400,state.total-state.next_offset)};
}
function sssM3MetricsJournalStart(){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const c=sssConfig_(),batch=sssM3BatchStatus(),stage=sssM3PageStageStatus();
  if(batch.status!=='COMPLETED'||stage.status!=='COMPLETED')return {status:'NOT_READY',reason:'記事台帳とページ中間索引の完了が必要です。'};
  const p=sssProperties_(),raw=p.getProperty(SSS_M3_METRICS_KEY_);
  if(raw&&JSON.parse(raw).status==='RUNNING')throw Error('実績集計中です。続きから再開してください。');
  const sh=sssM3MetricsJournalSheet_();if(sh.getLastRow()>1)sh.deleteRows(2,sh.getLastRow()-1);
  const st={format:'S3_M3_METRICS_JOURNAL_V1',status:'RUNNING',run_id:Utilities.getUuid(),site_id:c.siteId,current_site:c.siteId,article_run:batch.run_id,page_run:stage.run_id,total:stage.stored,next_offset:0,written:0,batches:0};
  if(st.total===0)st.status='COMPLETED';
  p.setProperty(SSS_M3_METRICS_KEY_,JSON.stringify(st));
  return {status:st.status,processed:0,total:st.total,batches:0};
 }finally{lock.releaseLock();}
}
function sssM3MetricsJournalContinue(){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const c=sssConfig_(),p=sssProperties_(),raw=p.getProperty(SSS_M3_METRICS_KEY_);
  if(!raw)throw Error('実績集計を先に開始してください。');
  const st=JSON.parse(raw),batch=sssM3BatchStatus(),stage=sssM3PageStageStatus();
  if(batch.status!=='COMPLETED'||stage.status!=='COMPLETED')throw Error('元データの完了状態が変わりました。');
  st.current_site=c.siteId;
  const sh=sssM3MetricsJournalSheet_(),last=st.written?sh.getRange(st.written+1,1,1,10).getDisplayValues()[0]:null;
  const plan=sssM3MetricsJournalPlan_(st,batch,stage,sh.getLastRow(),last);
  if(st.status==='COMPLETED')return {status:'COMPLETED',processed:st.next_offset,total:st.total,batches:st.batches};
  if(st.status!=='RUNNING')throw Error('実績集計の状態が不正です。');
  const result=sssM3MetricsSlicePreview(st.next_offset);
  if(result.status==='NOT_READY'||result.offset!==plan.start||result.next_offset!==plan.start+plan.count||result.run_ids.articles!==st.article_run||result.run_ids.pages!==st.page_run)throw Error('実績集計の読み取り範囲が一致しません。');
  const end=result.next_offset,rows=result.articles.map(a=>[st.run_id,st.site_id,plan.start,end,'ARTICLE',a.article_id,a.clicks,a.impressions,a.page_rows,'ASSIGNED']);
  rows.push([st.run_id,st.site_id,plan.start,end,'UNASSIGNED','',result.unassigned.clicks,result.unassigned.impressions,0,'UNMATCHED_OR_AMBIGUOUS']);
  for(const k of ['EXACT','NORMALIZED','AMBIGUOUS','UNMATCHED','INVALID_URL'])rows.push([st.run_id,st.site_id,plan.start,end,'COUNT','',0,0,result.counts[k],k]);
  rows.push([st.run_id,st.site_id,plan.start,end,'END','',0,0,plan.count,'COMMITTED']);
  // Commit marker is written last in the same range. On interrupted writes,
  // the checkpoint and sheet length disagree and the next call stops.
  sh.getRange(sh.getLastRow()+1,1,rows.length,10).setValues(rows);
  st.next_offset=end;st.written+=rows.length;st.batches++;
  if(end===st.total){st.status='COMPLETED';st.completed_at=new Date().toISOString();}
  p.setProperty(SSS_M3_METRICS_KEY_,JSON.stringify(st));
  return {status:st.status,processed:end,total:st.total,batches:st.batches,article_rows:result.articles.length,unassigned:result.unassigned,content_action:'NONE'};
 }finally{lock.releaseLock();}
}
function sssM3MetricsJournalStatus(){
 const raw=sssProperties_().getProperty(SSS_M3_METRICS_KEY_);
 if(!raw)return {status:'NOT_STARTED'};
 const st=JSON.parse(raw),c=sssConfig_();
 if(st.site_id!==c.siteId)return {status:'OTHER_SITE'};
 return {status:st.status,processed:st.next_offset,total:st.total,batches:st.batches,content_action:'NONE',coverage:st.status==='COMPLETED'?'ALL_STAGED_PAGES':'PARTIAL'};
}


// M3 stage 8: bounded, read-only validation and consolidation of the journal.
// Does not claim ALL_STAGED_PAGES until every journal row is validated.
function sssM3ConsolidateJournalRows_(rows,expectedRun,expectedSite,initialOffset){
 const byId=new Map(),counts={EXACT:0,NORMALIZED:0,AMBIGUOUS:0,UNMATCHED:0,INVALID_URL:0};
 const unassigned={clicks:0,impressions:0};let pages=0,batches=0,at=0,previousEnd=initialOffset===undefined?0:initialOffset;
 if(!Number.isSafeInteger(previousEnd)||previousEnd<0)throw Error('M3ジャーナルの開始位置が不正です。');
 const number=(v)=>{if(v===''||v===null||v===undefined)throw Error('M3集計値が空欄です。');const n=Number(v);if(!Number.isSafeInteger(n)||n<0)throw Error('M3集計値が不正です。');return n;};
 while(at<rows.length){
  const first=rows[at],start=number(first[2]),end=number(first[3]);
  if(start!==previousEnd||end<=start||end-start>400)throw Error('M3ジャーナルのバッチ範囲が不連続です。');
  let endSeen=false,unassignedSeen=false;const seenCounts=new Set();let batchCount=0;
  for(;at<rows.length;at++){
   const r=rows[at];
   if(r[0]!==expectedRun||r[1]!==expectedSite||number(r[2])!==start||number(r[3])!==end)throw Error('M3ジャーナルの実行ID・バッチが一致しません。');
   const kind=r[4],clicks=number(r[6]),impressions=number(r[7]),rowCount=number(r[8]);
   if(clicks>impressions)throw Error('M3ジャーナルのクリック数が表示回数を超えています。');
   if(kind==='ARTICLE'){
    const id=String(r[5]||'').trim();if(!id||r[9]!=='ASSIGNED'||rowCount<1)throw Error('M3記事行が不正です。');
    const v=byId.get(id)||{article_id:id,clicks:0,impressions:0,page_rows:0};
    v.clicks+=clicks;v.impressions+=impressions;v.page_rows+=rowCount;byId.set(id,v);
   }else if(kind==='UNASSIGNED'){
    if(unassignedSeen||r[9]!=='UNMATCHED_OR_AMBIGUOUS'||rowCount!==0)throw Error('M3未帰属行が不正です。');
    unassignedSeen=true;unassigned.clicks+=clicks;unassigned.impressions+=impressions;
   }else if(kind==='COUNT'){
    const k=String(r[9]);if(!(k in counts)||seenCounts.has(k)||clicks!==0||impressions!==0)throw Error('M3照合件数行が不正です。');
    seenCounts.add(k);counts[k]+=rowCount;batchCount+=rowCount;
   }else if(kind==='END'){
    if(r[9]!=='COMMITTED'||clicks!==0||impressions!==0||rowCount!==end-start||!unassignedSeen||seenCounts.size!==5||batchCount!==rowCount)throw Error('M3ジャーナルのコミットが不完全です。');
    endSeen=true;at++;break;
   }else throw Error('M3ジャーナルの行種別が不正です。');
  }
  if(!endSeen)throw Error('M3ジャーナルのコミット行がありません。');
  pages+=end-start;previousEnd=end;batches++;
 }
 return {format:'S3_M3_JOURNAL_CONSOLIDATION_V1',status:'VALIDATED',processed:pages,batches,
  articles:[...byId.values()].sort((a,b)=>a.article_id.localeCompare(b.article_id)),counts,unassigned,
  coverage:'VALIDATED_PREFIX',content_action:'NONE'};
}
function sssM3JournalConsolidationPreview(){
 const c=sssConfig_(),raw=sssProperties_().getProperty(SSS_M3_METRICS_KEY_);
 if(!raw)return {status:'NOT_READY',reason:'中間集計ジャーナルがありません。'};
 const st=JSON.parse(raw),batch=sssM3BatchStatus(),stage=sssM3PageStageStatus();
 if(st.site_id!==c.siteId||st.article_run!==batch.run_id||st.page_run!==stage.run_id||batch.status!=='COMPLETED'||stage.status!=='COMPLETED')throw Error('M3集計の元データが変わりました。');
 const sh=sssM3MetricsJournalSheet_();
 if(sh.getLastRow()!==st.written+1)throw Error('M3ジャーナル行数が進捗と一致しません。');
 if(st.written>10000)return {status:'TOO_LARGE_FOR_PREVIEW',written:st.written,reason:'安全な読取上限を超えています。分割統合が必要です。'};
 const rows=st.written?sh.getRange(2,1,st.written,10).getDisplayValues():[];
 const v=sssM3ConsolidateJournalRows_(rows,st.run_id,st.site_id);
 if(v.processed!==st.next_offset||v.batches!==st.batches)throw Error('M3ジャーナルの検証結果とチェックポイントが一致しません。');
 const complete=st.status==='COMPLETED'&&v.processed===st.total;
 return {...v,status:complete?'COMPLETED':'PARTIAL',coverage:complete?'ALL_STAGED_PAGES':'VALIDATED_PREFIX',
  total:st.total,article_count:v.articles.length,note:'登録済みページのみ。未照合は需要ゼロではなく、記事処置は行いません。'};
}


// M3 stage 9: resumable validation of an arbitrarily long journal, one
// complete committed batch per invocation. The checkpoint stores only cursor
// metadata; the cumulative summary is stored in a dedicated S3 sheet.
const SSS_M3_ROLLUP_KEY_='SSS_M3_ROLLUP_V1';
const SSS_M3_ROLLUP_SHEET_='S3_M3_記事別実績統合';
const SSS_M3_ROLLUP_HEADERS_=['run_id','site_id','article_id','clicks','impressions','page_rows'];
function sssM3RollupSheet_(){
 const ss=sssSpreadsheet_();let sh=ss.getSheetByName(SSS_M3_ROLLUP_SHEET_);
 if(!sh)sh=ss.insertSheet(SSS_M3_ROLLUP_SHEET_);
 const h=sh.getRange(1,1,1,6).getDisplayValues()[0];
 if(h.some((v,i)=>v!==SSS_M3_ROLLUP_HEADERS_[i])){
  if(sh.getLastRow()>1)throw Error('M3統合シートの列構成が異なります。');
  sh.getRange(1,1,1,6).setValues([SSS_M3_ROLLUP_HEADERS_]);
 }
 return sh;
}
// Pure helper: validate a single complete batch and merge it into the prior
// article summary. Journal sequence and commit marker are validated upstream.
function sssM3RollupFold_(previous,rows,run,site,offset){
 const v=sssM3ConsolidateJournalRows_(rows,run,site,offset);
 if(v.batches!==1||v.processed<1||v.processed>400)throw Error('M3統合対象は1コミットバッチのみです。');
 const map=new Map();
 for(const a of previous){
  const id=String(a.article_id||'').trim();
  if(!id||map.has(id))throw Error('M3統合済み記事IDが重複しています。');
  for(const k of ['clicks','impressions','page_rows'])if(!Number.isSafeInteger(a[k])||a[k]<0)throw Error('M3統合済み数値が不正です。');
  if(a.clicks>a.impressions)throw Error('M3統合済みクリック数が不正です。');
  map.set(id,{...a});
 }
 for(const a of v.articles){
  const b=map.get(a.article_id)||{article_id:a.article_id,clicks:0,impressions:0,page_rows:0};
  for(const k of ['clicks','impressions','page_rows']){
   b[k]+=a[k];if(!Number.isSafeInteger(b[k]))throw Error('M3統合値が安全な整数範囲を超えています。');
  }
  map.set(a.article_id,b);
 }
 return {articles:[...map.values()].sort((a,b)=>a.article_id.localeCompare(b.article_id)),
  pages:v.processed,counts:v.counts,unassigned:v.unassigned};
}
function sssM3RollupDigest_(rows){
 // Deterministic non-cryptographic checksum for detecting partial/stale writes.
 let h=2166136261;
 for(const row of rows){const str=JSON.stringify(row);for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}}
 return String(h>>>0);
}
// Canonicalize display-formatted sheet cells to the exact typed rows used
// when the rollup checksum was persisted. Reject invalid numbers instead of
// silently treating corrupted cells as zero.
function sssM3RollupCanonicalRows_(rows){
 return rows.map(r=>{
  if(!Array.isArray(r)||r.length!==6)throw Error('M3統合表の列数が不正です。');
  const out=[String(r[0]),String(r[1]),String(r[2])];
  for(let i=3;i<6;i++){
   const raw=r[i];
   if(typeof raw==='string'&&!/^(0|[1-9]\d*)$/.test(raw))throw Error('M3統合表に不正な数値があります。');
   const n=Number(raw);
   if(!Number.isSafeInteger(n)||n<0)throw Error('M3統合表に不正な数値があります。');
   out.push(n);
  }
  if(out[3]>out[4])throw Error('M3統合表のクリック数が表示回数を超えています。');
  if(out[5]<1)throw Error('M3統合表のページ行数が不正です。');
  return out;
 });
}
function sssM3RollupStart(){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const c=sssConfig_(),p=sssProperties_(),raw=p.getProperty(SSS_M3_METRICS_KEY_);
  if(!raw)throw Error('M3実績ジャーナルがありません。');
  const journal=JSON.parse(raw),batch=sssM3BatchStatus(),stage=sssM3PageStageStatus();
  if(journal.status!=='COMPLETED'||journal.site_id!==c.siteId||journal.article_run!==batch.run_id||journal.page_run!==stage.run_id||journal.total!==stage.stored)throw Error('検証可能な完了済みジャーナルがありません。');
  const prior=p.getProperty(SSS_M3_ROLLUP_KEY_);
  if(prior&&JSON.parse(prior).status==='RUNNING')throw Error('M3統合処理は進行中です。続きから再開してください。');
  const sh=sssM3RollupSheet_();if(sh.getLastRow()>1)sh.deleteRows(2,sh.getLastRow()-1);
  const st={format:'S3_M3_ROLLUP_V1',status:journal.written?'RUNNING':'COMPLETED',site_id:c.siteId,journal_run:journal.run_id,
   journal_written:journal.written,source_total:journal.total,cursor:0,processed:0,batches:0,summary_rows:0,
   counts:{EXACT:0,NORMALIZED:0,AMBIGUOUS:0,UNMATCHED:0,INVALID_URL:0},unassigned:{clicks:0,impressions:0},summary_digest:sssM3RollupDigest_([])};
  p.setProperty(SSS_M3_ROLLUP_KEY_,JSON.stringify(st));
  return {status:st.status,processed:0,total:st.source_total};
 }finally{lock.releaseLock();}
}
function sssM3RollupContinue(){
 const lock=LockService.getDocumentLock();lock.waitLock(10000);
 try{
  const p=sssProperties_(),raw=p.getProperty(SSS_M3_ROLLUP_KEY_);
  if(!raw)throw Error('M3統合処理を先に開始してください。');
  const st=JSON.parse(raw),c=sssConfig_(),jr=JSON.parse(p.getProperty(SSS_M3_METRICS_KEY_)||'null');
  const batch=sssM3BatchStatus(),stage=sssM3PageStageStatus();
  if(st.format!=='S3_M3_ROLLUP_V1'||st.site_id!==c.siteId||!jr||jr.status!=='COMPLETED'||jr.run_id!==st.journal_run||jr.written!==st.journal_written||jr.total!==st.source_total||jr.article_run!==batch.run_id||jr.page_run!==stage.run_id||stage.status!=='COMPLETED'||batch.status!=='COMPLETED')throw Error('M3統合の元データが変更されました。');
  const sh=sssM3RollupSheet_(),journal=sssM3MetricsJournalSheet_();
  if(sh.getLastRow()!==st.summary_rows+1||journal.getLastRow()!==st.journal_written+1)throw Error('M3統合シートまたはジャーナルの行数が進捗と一致しません。');
  if(st.status==='COMPLETED')return {status:'COMPLETED',processed:st.processed,total:st.source_total,articles:st.summary_rows};
  if(st.status!=='RUNNING'||st.cursor>=st.journal_written)throw Error('M3統合のカーソルが不正です。');
  // Journal batch size is <= 400 article rows + 7 metadata rows.
  const count=Math.min(407,st.journal_written-st.cursor);
  const slice=journal.getRange(st.cursor+2,1,count,10).getDisplayValues();
  const endIndex=slice.findIndex(r=>r[4]==='END');
  if(endIndex<0)throw Error('M3ジャーナルのコミット行が見つかりません。');
  const one=slice.slice(0,endIndex+1),start=Number(one[0][2]),end=Number(one[0][3]);
  if(start!==st.processed||end<=start)throw Error('M3統合バッチの処理位置が不連続です。');
  if(st.summary_rows>5000)throw Error('M3記事別集計が5000件を超えました。安全上限を超えています。');
  const existing=st.summary_rows?sh.getRange(2,1,st.summary_rows,6).getDisplayValues().map(r=>{
   if(r[0]!==st.journal_run||r[1]!==st.site_id)throw Error('M3統合済みデータの実行IDが不正です。');
   return {article_id:r[2],clicks:Number(r[3]),impressions:Number(r[4]),page_rows:Number(r[5])};
  }):[];
  const existingData=existing.map(a=>[st.journal_run,st.site_id,a.article_id,a.clicks,a.impressions,a.page_rows]);
  if(sssM3RollupDigest_(existingData)!==st.summary_digest)throw Error('M3統合シートの内容がチェックポイントと一致しません。');
  const folded=sssM3RollupFold_(existing,one,st.journal_run,st.site_id,start);
  if(folded.articles.length>5000)throw Error('M3統合対象の記事数が安全上限を超えました。');
  // Overwrite only the dedicated S3 rollup. A partial write leaves the old
  // checkpoint inconsistent with row count or a content digest; fail closed.
  const data=folded.articles.map(a=>[st.journal_run,st.site_id,a.article_id,a.clicks,a.impressions,a.page_rows]);
  const old=sh.getLastRow()-1;
  if(data.length)sh.getRange(2,1,data.length,6).setValues(data);
  if(old>data.length)sh.getRange(data.length+2,1,old-data.length,6).clearContent();
  st.cursor+=one.length;st.processed+=folded.pages;st.batches++;st.summary_rows=data.length;st.summary_digest=sssM3RollupDigest_(data);
  for(const k of Object.keys(st.counts))st.counts[k]+=folded.counts[k];
  for(const k of ['clicks','impressions'])st.unassigned[k]+=folded.unassigned[k];
  if(st.cursor===st.journal_written){
   if(st.processed!==st.source_total||st.batches!==jr.batches)throw Error('M3統合完了数が元ジャーナルと一致しません。');
   st.status='COMPLETED';
  }
  p.setProperty(SSS_M3_ROLLUP_KEY_,JSON.stringify(st));
  return {status:st.status,processed:st.processed,total:st.source_total,articles:st.summary_rows,batches:st.batches,content_action:'NONE'};
 }finally{lock.releaseLock();}
}
function sssM3RollupStatus(){
 const raw=sssProperties_().getProperty(SSS_M3_ROLLUP_KEY_);
 if(!raw)return {status:'NOT_STARTED'};
 const st=JSON.parse(raw),c=sssConfig_();
 return st.site_id===c.siteId?{status:st.status,processed:st.processed,total:st.source_total,articles:st.summary_rows,batches:st.batches,coverage:st.status==='COMPLETED'?'ALL_STAGED_PAGES':'PARTIAL',content_action:'NONE'}:{status:'OTHER_SITE'};
}


// M3 stage 10: read-only full article inventory/evidence join. A missing
// staged GSC page is NOT evidence that a page has no search demand.
function sssM3ArticleHealthJoin_(inventory,metrics){
 const byId=new Map(),seen=new Set(),out=[];
 for(const m of metrics){
  const id=String(m.article_id||'').trim();
  if(!id||byId.has(id))throw Error('M3検索実績の記事IDが空欄または重複しています。');
  for(const k of ['clicks','impressions','page_rows'])if(!Number.isSafeInteger(m[k])||m[k]<0)throw Error('M3検索実績の数値が不正です。');
  if(m.clicks>m.impressions||m.page_rows<1)throw Error('M3検索実績のクリック数・ページ行数が不正です。');
  byId.set(id,m);
 }
 for(const a of inventory){
  const id=String(a.article_id||'').trim();
  if(!id||seen.has(id))throw Error('M3記事台帳の記事IDが空欄または重複しています。');
  seen.add(id);
  const m=byId.get(id),urlStatus=String(a.url_status||''),state=String(a.state||'');
  const identityIssue=!String(a.url||'').trim()||urlStatus!=='VALID';
  const status=identityIssue?'IDENTITY_REVIEW':m?(m.impressions>0?'OBSERVED_IMPRESSIONS':'MATCHED_ZERO_IMPRESSIONS'):'NO_GSC_URL_MATCH';
  out.push({article_id:id,url:String(a.url||''),state,clicks:m?m.clicks:null,impressions:m?m.impressions:null,
   page_rows:m?m.page_rows:0,evidence_status:status,content_action:'NONE'});
 }
 const orphan=[...byId.keys()].filter(id=>!seen.has(id));
 if(orphan.length)throw Error('M3検索実績にSBM記事台帳にない記事IDがあります。');
 const counts={};for(const r of out)counts[r.evidence_status]=(counts[r.evidence_status]||0)+1;
 return {format:'S3_M3_ARTICLE_HEALTH_JOIN_V1',status:'VALIDATED',articles:out,article_count:out.length,
  counts,coverage:'ALL_STAGED_PAGES',content_action:'NONE',limitations:['検索実績なしは検索需要ゼロではありません','記事削除・統合・noindexは判定しません']};
}
function sssM3ArticleHealthPreview(){
 const c=sssConfig_(),p=sssProperties_();
 const batch=sssM3BatchStatus(),roll=sssM3RollupStatus();
 const bs=JSON.parse(p.getProperty(SSS_M3_BATCH_KEY_)||'null');
 const rs=JSON.parse(p.getProperty(SSS_M3_ROLLUP_KEY_)||'null');
 const jr=JSON.parse(p.getProperty(SSS_M3_METRICS_KEY_)||'null');
 if(batch.status!=='COMPLETED'||roll.status!=='COMPLETED'||!bs||!rs||!jr)
  return {status:'NOT_READY',reason:'記事台帳と検索実績の分割統合が完了していません。'};
 if(bs.site_id!==c.siteId||rs.site_id!==c.siteId||jr.site_id!==c.siteId||rs.journal_run!==jr.run_id||
    jr.article_run!==bs.run_id||rs.processed!==jr.total||rs.source_total!==jr.total)
  throw Error('M3記事台帳と検索実績の実行元が一致しません。');
 if(bs.processed>5000||rs.summary_rows>5000)throw Error('M3記事別照合の安全上限5000件を超えています。');
 const a=sssM3BatchSheet_(),r=sssM3RollupSheet_();
 if(a.getLastRow()!==bs.processed+1||r.getLastRow()!==rs.summary_rows+1)
  throw Error('M3記事台帳または統合表の保存行数が一致しません。');
 const articleRows=bs.processed?a.getRange(2,1,bs.processed,9).getDisplayValues():[];
 const metricRows=rs.summary_rows?r.getRange(2,1,rs.summary_rows,6).getDisplayValues():[];
 if(sssM3RollupDigest_(sssM3RollupCanonicalRows_(metricRows))!==rs.summary_digest)throw Error('M3統合表のチェックサムが一致しません。');
 const inventory=articleRows.map(x=>{
  if(x[0]!==bs.run_id||x[1]!==c.siteId)throw Error('M3記事台帳の実行IDが一致しません。');
  return {article_id:x[2],url:x[3],state:x[5],url_status:x[8]};
 });
 const metrics=metricRows.map(x=>{
  if(x[0]!==rs.journal_run||x[1]!==c.siteId)throw Error('M3統合表の実行IDが一致しません。');
  return {article_id:x[2],clicks:Number(x[3]),impressions:Number(x[4]),page_rows:Number(x[5])};
 });
 const result=sssM3ArticleHealthJoin_(inventory,metrics);
 return {...result,site_id:c.siteId,article_run:bs.run_id,journal_run:jr.run_id,
  note:'中間索引に収集されたページに限る。未照合は需要ゼロを意味しない。'};
}


// M3 stage 11: conservative, non-prescriptive review queue.  This is not an
// article quality score.  No content change, merge or noindex is authorized.
// SBM states may contain display icons, spacing or explanatory suffixes.
// Never interpret an unrecognized state as an eligible, untouched article.
function sssM3ClassifySbmState_(raw){
 const value=String(raw===null||raw===undefined?'':raw).normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g,'').trim();
 if(!value)return {kind:'UNKNOWN',label:'(空欄)'};
 if(/モニタ[ー]?中|改善中|再診処置|治療待ち|処置中/.test(value))return {kind:'ACTIVE',label:value};
 if(/未着手|完了|管理対象外|統合済み/.test(value))return {kind:'KNOWN',label:value};
 return {kind:'UNKNOWN',label:value};
}
function sssM3HealthReviewTriage_(joined){
 if(!joined||joined.format!=='S3_M3_ARTICLE_HEALTH_JOIN_V1'||joined.status!=='VALIDATED'||joined.coverage!=='ALL_STAGED_PAGES'||!Array.isArray(joined.articles)||joined.article_count!==joined.articles.length)
  throw Error('M3記事別照合の検証済み全件データが必要です。');
 const seen=new Set(),stateCounts={},stateSamples=[],queue=[],counts={DATA_QUALITY:0,SEARCH_REVIEW:0,MONITORING:0,INSUFFICIENT_EVIDENCE:0,OBSERVED_NO_TRIGGER:0,STATE_UNVERIFIED:0};
 for(const a of joined.articles){
  const id=String(a.article_id||'').trim(),state=String(a.state||'').trim(),ev=String(a.evidence_status||'');
  const sbm=sssM3ClassifySbmState_(state);stateCounts[sbm.kind]=(stateCounts[sbm.kind]||0)+1;
  if(sbm.kind==='UNKNOWN'&&stateSamples.length<10)stateSamples.push({article_id:id,raw_state:state});
  if(!id||seen.has(id))throw Error('M3記事IDが空欄または重複しています。');
  seen.add(id);
  if(!['IDENTITY_REVIEW','NO_GSC_URL_MATCH','MATCHED_ZERO_IMPRESSIONS','OBSERVED_IMPRESSIONS'].includes(ev))throw Error('M3検索実績の判定が不正です。');
  if(ev==='OBSERVED_IMPRESSIONS'||ev==='MATCHED_ZERO_IMPRESSIONS'){
   if(!Number.isSafeInteger(a.clicks)||!Number.isSafeInteger(a.impressions)||a.clicks<0||a.impressions<0||a.clicks>a.impressions||!Number.isSafeInteger(a.page_rows)||a.page_rows<1)throw Error('M3検索実績の数値が不正です。');
   if(ev==='OBSERVED_IMPRESSIONS'&&a.impressions===0||ev==='MATCHED_ZERO_IMPRESSIONS'&&a.impressions!==0)throw Error('M3検索実績の判定と数値が矛盾しています。');
  }else if(a.clicks!==null||a.impressions!==null)throw Error('未照合記事に検索実績が割り当てられています。');
  let category,reason,rank;
  if(ev==='IDENTITY_REVIEW'){
   category='DATA_QUALITY';reason='URL・記事識別情報の確認が必要';rank=1;
  }else if(sbm.kind==='ACTIVE'){
   category='MONITORING';reason='SBMで処理中・経過観察中のため重複依頼を保留';rank=4;
  }else if(sbm.kind==='UNKNOWN'){
   category='STATE_UNVERIFIED';reason='SBMの作業状態を識別できないため、改善提案を保留';rank=2;
  }else if(ev==='NO_GSC_URL_MATCH'||ev==='MATCHED_ZERO_IMPRESSIONS'){
   category='INSUFFICIENT_EVIDENCE';reason='検索実績の確認不足。需要ゼロとは判定しない';rank=3;
  }else if(a.impressions>=100&&a.clicks===0){
   category='SEARCH_REVIEW';reason='表示100回以上・クリック0回のため検索意図と訴求を確認する候補（暫定基準）';rank=2;
  }else{
   category='OBSERVED_NO_TRIGGER';reason='現時点で優先確認条件に該当しない';rank=5;
  }
  counts[category]++;
  queue.push({article_id:id,state,evidence_status:ev,category,rank,reason,clicks:a.clicks,impressions:a.impressions,content_action:'NONE'});
 }
 queue.sort((a,b)=>a.rank-b.rank||(a.article_id<b.article_id?-1:a.article_id>b.article_id?1:0));
 return {format:'S3_M3_HEALTH_TRIAGE_V1',status:'PROVISIONAL_REVIEW_ONLY',article_count:queue.length,counts,queue,
  coverage:'ALL_STAGED_PAGES',state_counts:stateCounts,unrecognized_states:stateSamples,content_action:'NONE',publication_gate:'HOLD',
  limitations:['表示100回・クリック0回は暫定的な確認候補条件であり改善指示ではありません','未照合・表示0は需要ゼロを意味しません','SBM処理中の記事は重複改善依頼を出しません','記事削除・統合・noindexは決定しません']};
}
function sssM3HealthReviewPreview(){
 const joined=sssM3ArticleHealthPreview();
 if(joined.status==='NOT_READY')return joined;
 const r=sssM3HealthReviewTriage_(joined);
 return {format:r.format,status:r.status,site_id:joined.site_id,article_count:r.article_count,counts:r.counts,
  review_sample:r.queue.filter(x=>x.category==='DATA_QUALITY'||x.category==='SEARCH_REVIEW'||x.category==='STATE_UNVERIFIED').slice(0,30),
  state_counts:r.state_counts,unrecognized_states:r.unrecognized_states,
  review_sample_limit:30,coverage:r.coverage,content_action:'NONE',publication_gate:'HOLD',limitations:r.limitations};
}


// M3 stage 12: one bounded server operation per invocation. The dialog
// orchestrates successive calls; no long synchronous loop in Apps Script.
// A missing Collector work table is a STOP, not a reason to unzip Evidence.
function sssM3PilotPlan_(statuses,sourceAvailable){
 const steps=[
  ['ARTICLE_INVENTORY','sssM3BatchStart','sssM3BatchContinue'],
  ['PAGE_INDEX','sssM3PageStageStart','sssM3PageStageContinue'],
  ['METRICS_JOURNAL','sssM3MetricsJournalStart','sssM3MetricsJournalContinue'],
  ['ARTICLE_ROLLUP','sssM3RollupStart','sssM3RollupContinue']];
 // Never continue a downstream stage when an upstream stage is unfinished.
 // Such a state indicates stale checkpoints, a partial reset, or manual edits.
 for(let i=1;i<steps.length;i++){
  const downstream=statuses[i]||{status:'NOT_STARTED'};
  if(downstream.status==='RUNNING'||downstream.status==='COMPLETED'){
   for(let j=0;j<i;j++)if(!statuses[j]||statuses[j].status!=='COMPLETED')
    return {status:'BLOCKED',stage:steps[i][0],reason:'後続工程が存在しますが、先行工程が完了していません。データを上書きせず停止します。'};
  }
 }
 for(let i=0;i<steps.length;i++){
  const [stage,start,cont]=steps[i],st=statuses[i]||{status:'NOT_STARTED'};
  if(st.status==='COMPLETED')continue;
  if(st.status!=='RUNNING'&&st.status!=='NOT_STARTED')return {status:'BLOCKED',stage,reason:'別サイトまたは不整合のある作業状態です。自動初期化しません。'};
  if(i===1&&!sourceAvailable)return {status:'BLOCKED',stage,reason:'Collectorの完了済み作業データがありません。ZIPの自動展開は行いません。'};
  return {status:'READY',stage,method:st.status==='RUNNING'?cont:start};
 }
 return {status:'READY',stage:'HEALTH_REVIEW',method:'sssM3HealthReviewPreview'};
}
function sssM3PilotStatus(){
 const c=sssConfig_(),batch=sssM3BatchStatus(),page=sssM3PageStageStatus(),journal=sssM3MetricsJournalStatus(),rollup=sssM3RollupStatus();
 // Only probe Collector when page materialization is pending. Completed
 // stages must remain reviewable after Collector has discarded its work table.
 const needsSource=batch.status==='COMPLETED'&&page.status==='NOT_STARTED';
 let source={available:true,reason:''};
 if(needsSource){
  try{source=sssM3PageStageSource_();}
  catch(e){source={available:false,reason:'Collector作業データの確認に失敗しました：'+String(e&&e.message||e)};}
  if(!source.available){
   const alternative=sssM3CompactFallbackSource_();
   const ref=sssM1CompactRef_(c),gsc=sssM3GscPlan_(ref);
   source=alternative.available?{available:true,mode:'COMPACT_ZIP',reason:''}:
    gsc.available?{available:true,mode:'GSC_REQUERY',reason:gsc.reason}:
    {available:false,reason:source.reason+' '+alternative.reason+' '+gsc.reason};
  }
 }
 const plan=sssM3PilotPlan_([batch,page,journal,rollup],source.available);
 return {format:'S3_M3_PILOT_STATUS_V2',site_id:c.siteId,plan,stages:{ARTICLE_INVENTORY:batch,PAGE_INDEX:page,METRICS_JOURNAL:journal,ARTICLE_ROLLUP:rollup},source_available:needsSource?source.available:null,source_mode:needsSource?String(source.mode||'COLLECTOR'):null,source_reason:needsSource?source.reason:'',content_action:'NONE'};
}
function sssM3PilotStep(){
 const before=sssM3PilotStatus(),plan=before.plan;
 if(plan.status!=='READY')return {status:'BLOCKED',stage:plan.stage,reason:plan.reason,progress:before.stages};
 const methods={sssM3BatchStart,sssM3BatchContinue,sssM3PageStageStart,sssM3PageStageContinue,sssM3MetricsJournalStart,sssM3MetricsJournalContinue,sssM3RollupStart,sssM3RollupContinue,sssM3HealthReviewPreview};
 let result;
 if(plan.stage==='PAGE_INDEX'){
  const current=sssM3PageStageStatus();
  if(current.status==='RUNNING'){
   const raw=sssProperties_().getProperty(SSS_M3_PAGE_STAGE_KEY_);
   result=raw&&JSON.parse(raw).source_mode==='GSC_REQUERY'?sssM3PageStageContinueGsc_():methods[plan.method]();
  }else if(plan.method==='sssM3PageStageStart'&&!sssM3PageStageSource_().available){
   const alternative=sssM3CompactFallbackSource_();
   result=alternative.available?sssM3PageStageStartCompact_():sssM3PageStageStartGsc_();
  }else result=methods[plan.method]();
 }else result=methods[plan.method]();
 if(!result||typeof result!=='object')return {status:'BLOCKED',stage:plan.stage,reason:'工程の戻り値を確認できません。',content_action:'NONE'};
 if(plan.stage==='HEALTH_REVIEW'){
  if(result.format!=='S3_M3_HEALTH_TRIAGE_V1'||result.status!=='PROVISIONAL_REVIEW_ONLY'||result.content_action!=='NONE'||result.publication_gate!=='HOLD')
   return {status:'BLOCKED',stage:plan.stage,reason:'診断プレビューの検証済み形式を確認できません。公開・改善指示は行いません。',result,content_action:'NONE'};
  return {status:'COMPLETED',stage:plan.stage,result,content_action:'NONE'};
 }
 if(result.status!=='RUNNING'&&result.status!=='COMPLETED')return {status:'BLOCKED',stage:plan.stage,reason:result.reason||'工程が正常終了していません。',result,content_action:'NONE'};
 return {status:'PROGRESSED',stage:plan.stage,result,content_action:'NONE'};
}
// M3 read-only dashboard: validated preview only, no diagnosis persistence or SBM mutation.
function sssM3DashboardData(){
 const status=sssM3PilotStatus();
 if(status.plan.status!=='READY'||status.plan.stage!=='HEALTH_REVIEW')
  return {status:'NOT_READY',reason:'全工程が完了していません。',content_action:'NONE'};
 const r=sssM3HealthReviewPreview();
 if(r.format!=='S3_M3_HEALTH_TRIAGE_V1'||r.status!=='PROVISIONAL_REVIEW_ONLY'||r.publication_gate!=='HOLD'||r.content_action!=='NONE')
  throw Error('M3診断結果の形式・公開保留条件を確認できません。');
 const categories=['DATA_QUALITY','SEARCH_REVIEW','MONITORING','INSUFFICIENT_EVIDENCE','OBSERVED_NO_TRIGGER','STATE_UNVERIFIED'];
 if(!r.counts||categories.some(k=>!Number.isSafeInteger(r.counts[k])||r.counts[k]<0)||categories.reduce((a,k)=>a+r.counts[k],0)!==r.article_count)
  throw Error('M3診断区分の合計が記事数と一致しません。');
 return {format:'S3_M3_DASHBOARD_V1',status:'READY',article_count:r.article_count,
  counts:Object.fromEntries(categories.map(k=>[k,r.counts[k]])),
  sample:(r.review_sample||[]).slice(0,20).map(x=>({article_id:String(x.article_id||''),category:String(x.category||''),reason:String(x.reason||''),impressions:x.impressions,clicks:x.clicks})),
  sample_limit:20,state_counts:r.state_counts,unrecognized_states:r.unrecognized_states,coverage:r.coverage,publication_gate:'HOLD',content_action:'NONE',
  notice:'暫定診断です。検索実績の欠落は需要ゼロを意味しません。記事改善・公開は実行しません。'};
}
function sssM3PilotDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>
 body{font:14px Arial,sans-serif;padding:18px;margin:0;line-height:1.6;color:#202124}h3{margin:0 0 8px;font-size:19px}p{margin:6px 0 14px;color:#555}button{padding:10px 18px;border:1px solid #b8bfc6;border-radius:5px;background:#fff;cursor:pointer}button:disabled{opacity:.5;cursor:default}#run{background:#1765ad;color:#fff;border-color:#1765ad}#stop{margin-left:8px}#status{margin:14px 0 8px;font-weight:bold;min-height:22px}#track{height:10px;background:#e7eaee;border-radius:10px;overflow:hidden}#bar{height:100%;background:#2779b8;width:0%;transition:width .2s}#pct{font-size:12px;color:#555;margin:4px 0 12px}#steps{padding:0;list-style:none;margin:14px 0}#steps li{padding:7px 8px;border-bottom:1px solid #eee}#steps li.current{background:#eaf3fd;font-weight:bold}#steps li.done{color:#216b43}#notice{font-size:12px;color:#666}details{margin-top:12px}pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:155px;overflow:auto;background:#f5f6f7;padding:10px;font-size:11px}footer{margin-top:16px;border-top:1px solid #ddd;padding-top:12px}#dashboard{margin-top:14px;padding:12px;border:1px solid #d8dee5;border-radius:6px}#dashboard[hidden]{display:none}.stat{padding:5px 0;border-bottom:1px solid #eee}.stat strong{float:right}#samples{padding-left:20px}#samples li{margin:5px 0}#resultBtn{margin-top:10px}
 </style><h3>ブログ総合診断</h3><p>開始すると途中経過を表示しながら自動で進みます。SBMとEvidenceは変更しません。</p>
 <button id="run" onclick="start()">診断を開始・再開</button><button id="stop" onclick="stop()" disabled>停止</button><div id="status" role="status" aria-live="polite">準備状況を確認しています…</div>
 <div id="track" role="progressbar" aria-label="診断の進捗" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div id="bar"></div></div><div id="pct">進捗を確認中</div>
 <ol id="steps"><li id="s0">記事台帳を確認</li><li id="s1">検索データを準備</li><li id="s2">検索実績を集計</li><li id="s3">記事別実績を統合</li><li id="s4">診断結果を確認</li></ol>
 <button id="resultBtn" onclick="loadDashboard()" disabled>診断結果を見る</button><section id="dashboard" hidden aria-live="polite"><h3>ブログの診断概要</h3><div id="summary"></div><h4>優先確認候補（最大20件）</h4><ol id="samples"></ol><p id="disclaimer"></p></section><div id="notice">処理は小分けに実行します。通信エラーや不整合があれば停止します。画面を閉じると自動実行は止まり、保存済みの進捗から再開できます。</div>
 <details><summary>技術情報（必要な場合のみ）</summary><pre id="out">未取得</pre></details><footer><button onclick="google.script.host.close()">閉じる</button></footer>
 <script>
 const names=['ARTICLE_INVENTORY','PAGE_INDEX','METRICS_JOURNAL','ARTICLE_ROLLUP','HEALTH_REVIEW'];
 let running=false,stopping=false,calls=0,token=0,dashboardReady=false;const MAX_CALLS=250;
 function el(id){return document.getElementById(id)}
 function show(x){el('out').textContent=JSON.stringify(x,null,2)}
 function message(s){el('status').textContent=s}
 function setButtons(){el('run').disabled=running;el('stop').disabled=!running||stopping;el('resultBtn').disabled=running||!dashboardReady}
 function stop(){stopping=true;el('stop').disabled=true;message('現在の区間が終わり次第、停止します…')}
 function halt(s){running=false;stopping=false;token++;setButtons();message(s)}
 function fail(e){halt('安全停止：'+String(e&&e.message||e)+'。詳細を確認してください。')}
 function progress(x){
  if(!x||!x.plan||!x.stages){fail('進捗情報が不正です');return false}
  show(x);const index=names.indexOf(x.plan.stage),states=names.slice(0,4).map(k=>x.stages[k]||{});
  let fraction=0;const fractions=states.map((v,i)=>{
   if(v.status==='COMPLETED')return 1;
   if(v.status!=='RUNNING')return 0;
   const total=Number(v.total),done=Number(v.scanned??v.processed??0);
   return total>0&&Number.isFinite(done)?Math.max(0,Math.min(.99,done/total)):.03;
  });
  fraction=(fractions.reduce((a,b)=>a+b,0)+(index===4?0.2:0))/5;
  const pct=Math.max(0,Math.min(99,Math.round(fraction*100)));
  el('bar').style.width=pct+'%';el('track').setAttribute('aria-valuenow',String(pct));el('pct').textContent='全体の目安 '+pct+'%（工程ごとの進捗）';
  names.forEach((name,i)=>{const node=el('s'+i);node.className=i<4&&states[i].status==='COMPLETED'?'done':name===x.plan.stage?'current':'';node.textContent=(i<4&&states[i].status==='COMPLETED'?'✓ ':name===x.plan.stage?'▶ ':'')+['記事台帳を確認','検索データを準備','検索実績を集計','記事別実績を統合','診断結果を確認'][i]});
  return true;
 }
 function loadDashboard(){
  if(running)return;
  el('resultBtn').disabled=true;message('診断結果を確認しています…');
  google.script.run.withSuccessHandler(x=>{
   show(x);el('resultBtn').disabled=false;
   if(!x||x.status!=='READY'){message('診断結果はまだ利用できません。');return}
   const labels={DATA_QUALITY:'記事情報の確認',SEARCH_REVIEW:'検索実績の確認候補',MONITORING:'SBMで処理・観察中',INSUFFICIENT_EVIDENCE:'判断材料が不足',OBSERVED_NO_TRIGGER:'優先条件に非該当',STATE_UNVERIFIED:'SBM作業状態を要確認'};
   const sum=el('summary');sum.replaceChildren();
   const title=document.createElement('p');title.textContent='診断対象 '+x.article_count+'記事（暫定判定）';sum.appendChild(title);
   Object.keys(labels).forEach(k=>{const d=document.createElement('div');d.className='stat';d.textContent=labels[k];const n=document.createElement('strong');n.textContent=String(x.counts[k]??0)+'件';d.appendChild(n);sum.appendChild(d)});
   const stateNote=document.createElement('p');stateNote.textContent='SBM作業状態の識別：対応中 '+(x.state_counts?.ACTIVE??0)+'件／既知のその他 '+(x.state_counts?.KNOWN??0)+'件／未識別 '+(x.state_counts?.UNKNOWN??0)+'件';sum.appendChild(stateNote);
   const list=el('samples');list.replaceChildren();(x.sample||[]).forEach(a=>{const li=document.createElement('li');li.textContent=a.article_id+'：'+(labels[a.category]||a.category)+' — '+a.reason;list.appendChild(li)});
   if(!list.children.length){const li=document.createElement('li');li.textContent='該当候補はありません';list.appendChild(li)}
   el('disclaimer').textContent=x.notice;el('dashboard').hidden=false;message('診断結果を表示しました。記事の変更は行っていません。');
  }).withFailureHandler(e=>{el('resultBtn').disabled=false;message('結果表示を停止：'+String(e&&e.message||e))}).sssM3DashboardData();
 }
 function poll(t){google.script.run.withSuccessHandler(x=>{
  if(t!==token)return;if(!progress(x))return;
  if(x.plan.stage==='HEALTH_REVIEW'&&x.stages.ARTICLE_ROLLUP.status==='COMPLETED'){dashboardReady=true;setButtons()}
  if(x.plan.status==='BLOCKED'){halt('安全停止：'+(x.plan.reason||'データの確認が必要です'));return}
  if(stopping){halt('停止しました。続きから再開できます。');return}
  if(!running){message('準備完了。「診断を開始・再開」を押してください。');return}
  if(calls>=MAX_CALLS){halt('安全停止：連続実行の上限に達しました。再開すると続きから処理できます。');return}
  message('診断中：'+['記事台帳','検索データ','検索実績','記事別統合','診断結果'][Math.max(0,names.indexOf(x.plan.stage))]+'を処理しています…');step(t);
 }).withFailureHandler(e=>{if(t===token)fail(e)}).sssM3PilotStatus()}
 function step(t){if(!running||stopping){halt('停止しました。続きから再開できます。');return}calls++;
  google.script.run.withSuccessHandler(x=>{
   if(t!==token)return;show(x);
   if(!x||x.status==='BLOCKED'||(x.status!=='PROGRESSED'&&x.status!=='COMPLETED')){halt('安全停止：'+(x&&x.reason||'処理結果を確認できません'));return}
   if(x.status==='COMPLETED'){
    el('bar').style.width='100%';el('track').setAttribute('aria-valuenow','100');el('pct').textContent='全工程の処理完了';el('s4').className='done';el('s4').textContent='✓ 診断結果を確認';
    dashboardReady=true;halt('診断プレビューが完了しました。結果を表示します。');loadDashboard();return;
   }
   if(stopping){halt('停止しました。続きから再開できます。');return}
   poll(t);
  }).withFailureHandler(e=>{if(t===token)fail(e)}).sssM3PilotStep();
 }
 function start(){if(running)return;running=true;stopping=false;calls=0;token++;setButtons();message('保存済みの進捗を確認しています…');poll(token)}
 poll(token);
 </script></html>`).setWidth(720).setHeight(690);
 SpreadsheetApp.getUi().showModalDialog(html,'ブログ総合診断');
}


// M3 stage 13: site-wide QUERY observations, deliberately separate from
// article/page evidence.  Bounded live GSC query, not a reconstruction of
// archived query_summary.  No article ownership, volume or SERP conclusions.
const SSS_M3_SITE_QUERY_LIMIT_=200;
function sssM3SiteQueryClassify_(response,period,siteId){
 if(!period||!/^\d{4}-\d{2}-\d{2}$/.test(String(period.start))||!/^\d{4}-\d{2}-\d{2}$/.test(String(period.end))||period.start>period.end||!String(siteId||''))throw Error('検索クエリの対象期間・サイトが不正です。');
 if(!response||!Array.isArray(response.rows)||response.rows.length>SSS_M3_SITE_QUERY_LIMIT_)throw Error('GSC検索クエリの応答形式または件数が不正です。');
 const seen=new Set(),items=[];
 for(const r of response.rows){
  if(!r||!Array.isArray(r.keys)||r.keys.length!==1)throw Error('GSC検索クエリのキーが不正です。');
  const q=String(r.keys[0]||'').trim(),key=q.normalize('NFKC').toLowerCase();
  if(!q||q.length>500||seen.has(key))throw Error('GSC検索クエリが空欄・重複・長すぎます。');seen.add(key);
  const clicks=Number(r.clicks),impressions=Number(r.impressions),position=Number(r.position);
  if(!Number.isSafeInteger(clicks)||!Number.isSafeInteger(impressions)||clicks<0||impressions<0||clicks>impressions||!Number.isFinite(position)||position<0)throw Error('GSC検索クエリの実績値が不正です。');
  items.push({query:q,clicks,impressions,position,signal:impressions>=100&&clicks===0?'CHECK_INTENT':'OBSERVED',ownership:'UNCONFIRMED',content_action:'NONE'});
 }
 items.sort((a,b)=>b.impressions-a.impressions||a.query.localeCompare(b.query,'ja'));
 return {format:'S3_M3_SITE_QUERY_PILOT_V1',status:'PROVISIONAL',site_id:siteId,period:{start:period.start,end:period.end},observation:'LIVE_GSC_REQUERY',coverage:'TOP_QUERY_SAMPLE',sample_limit:SSS_M3_SITE_QUERY_LIMIT_,returned:items.length,queries:items,publication_gate:'HOLD',content_action:'NONE',limitations:['検索クエリはサイト全体の観測値であり、記事IDへ帰属させません','上位最大200件の抜粋です。未掲載の検索語に需要がないとは判定しません','再取得時点の数値は保存済みEvidenceと一致する保証がありません','表示100回・クリック0回は精査の入口であり、新記事・既存記事修正を承認しません']};
}
function sssM3SiteQueryPilot(){
 const c=sssConfig_(),ref=sssM1CompactRef_(c),plan=sssM3GscPlan_(ref);
 if(!plan.available)return {status:'BLOCKED',reason:plan.reason,content_action:'NONE',publication_gate:'HOLD'};
 const response=sdscSearchAnalyticsQuery_(c.propertyUri,{startDate:plan.start,endDate:plan.end,type:'web',dataState:'final',dimensions:['query'],rowLimit:SSS_M3_SITE_QUERY_LIMIT_,startRow:0});
 return sssM3SiteQueryClassify_(response,{start:plan.start,end:plan.end},c.siteId);
}
function sssM3SiteQueryDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:18px;line-height:1.6;color:#202124}h3{margin:0 0 8px}p{color:#555}button{padding:9px 16px;border:1px solid #b8bfc6;border-radius:5px;background:white;cursor:pointer}button:disabled{opacity:.5}#run{background:#1765ad;color:white}#status{margin:12px 0;font-weight:bold}table{width:100%;border-collapse:collapse}th,td{padding:7px;border-bottom:1px solid #ddd;text-align:left}td.num{text-align:right}small{color:#666}#scroll{max-height:330px;overflow:auto}footer{border-top:1px solid #ddd;margin-top:14px;padding-top:12px}</style><h3>サイト全体の検索クエリ</h3><p>GSCの検索クエリ上位最大200件を読み取り専用で確認します。既存記事への帰属や新記事作成は決定しません。</p><button id="run" onclick="run()">検索データを確認</button><div id="status" role="status" aria-live="polite">開始待ち</div><div id="meta"></div><div id="scroll"><table><thead><tr><th>検索クエリ</th><th>表示</th><th>クリック</th><th>確認</th></tr></thead><tbody id="rows"></tbody></table></div><p><small>表示100回以上・クリック0回は暫定的な確認対象です。検索意図・競合・既存記事との重複は未検証です。</small></p><footer><button onclick="google.script.host.close()">閉じる</button></footer><script>const e=id=>document.getElementById(id);function run(){e('run').disabled=true;e('status').textContent='GSCから検索データを取得しています…';google.script.run.withSuccessHandler(x=>{e('run').disabled=false;if(!x||x.status!=='PROVISIONAL'){e('status').textContent='安全停止：'+(x&&x.reason||'データを確認できません');return}e('status').textContent='確認完了。記事への変更はありません。';e('meta').textContent='対象期間：'+x.period.start+' ～ '+x.period.end+'／上位'+x.returned+'件（最大200件）';const body=e('rows');body.replaceChildren();x.queries.forEach(r=>{const tr=document.createElement('tr');[r.query,r.impressions,r.clicks,r.signal==='CHECK_INTENT'?'要精査':'観測'].forEach((v,i)=>{const td=document.createElement('td');td.textContent=String(v);if(i===1||i===2)td.className='num';tr.appendChild(td)});body.appendChild(tr)})}).withFailureHandler(err=>{e('run').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3SiteQueryPilot()}</script></html>`).setWidth(780).setHeight(640);
 SpreadsheetApp.getUi().showModalDialog(html,'サイト全体の検索クエリ（試験）');
}


// M3 stage 14: conservative title-only lexical coverage hints.  This does
// not establish search intent, article ownership, a content gap, or demand.
// It deliberately cannot return NEW_ARTICLE or REWRITE decisions.
function sssM3QueryTokens_(value){
 const normalized=String(value||'').normalize('NFKC').toLowerCase();
 const words=normalized.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー]+|[a-z0-9]+/gu)||[];
 const stop=new Set(['とは','方法','やり方','使い方','について','する','できる','こと','とき','場合','おすすめ','完全','ガイド','解説','最新','比較','対応','記事']);
 return [...new Set(words.filter(x=>x.length>=2&&!stop.has(x)))];
}
function sssM3QueryCoverageHints_(queries,articles){
 if(!Array.isArray(queries)||queries.length>200||!Array.isArray(articles)||articles.length>5000)throw Error('検索語または記事台帳の件数が上限を超えています。');
 const ids=new Set(),catalog=[];
 for(const a of articles){
  const id=String(a.article_id||'').trim(),title=String(a.title||'').trim();
  if(!id||ids.has(id))throw Error('記事台帳の記事IDが空欄または重複しています。');ids.add(id);
  catalog.push({article_id:id,title,tokens:sssM3QueryTokens_(title)});
 }
 const seen=new Set(),results=[];
 for(const q of queries){
  const query=String(q.query||'').trim(),key=query.normalize('NFKC').toLowerCase();
  if(!query||seen.has(key))throw Error('検索クエリが空欄または重複しています。');seen.add(key);
  const tokens=sssM3QueryTokens_(query),candidates=[];
  if(tokens.length){
   for(const a of catalog){
    const matched=tokens.filter(t=>a.tokens.some(x=>x===t||x.includes(t)&&t.length>=3||t.includes(x)&&x.length>=3));
    if(!matched.length)continue;
    const score=matched.length/tokens.length;
    candidates.push({article_id:a.article_id,title:a.title,matched_terms:matched.length,query_terms:tokens.length,score:Math.round(score*100)});
   }
   candidates.sort((a,b)=>b.score-a.score||b.matched_terms-a.matched_terms||a.article_id.localeCompare(b.article_id));
  }
  results.push({query,coverage_hint:!tokens.length?'NO_DISTINCTIVE_TOKENS':candidates.length?'TITLE_SIMILARITY_OBSERVED':'NO_TITLE_SIMILARITY_IN_SAMPLE',candidate_count:candidates.length,candidates:candidates.slice(0,3),ownership:'UNCONFIRMED',intent:'NOT_CHECKED',content_action:'NONE'});
 }
 return {format:'S3_M3_QUERY_COVERAGE_HINTS_V1',status:'PROVISIONAL',article_count:catalog.length,query_count:results.length,results,publication_gate:'HOLD',content_action:'NONE',limitations:['記事タイトルの文字列類似だけを確認します。本文・検索意図・SERPは未検証です','類似記事が見つからなくても新記事の機会とは判定しません','類似記事が見つかってもその検索語の実績を記事へ帰属させません']};
}
function sssM3SiteQueryCoveragePilot(){
 const c=sssConfig_(),batch=sssM3BatchStatus();
 if(batch.status!=='COMPLETED')return {status:'BLOCKED',reason:'SBM記事台帳の取得が完了していません。',content_action:'NONE'};
 const query=sssM3SiteQueryPilot();
 if(query.status!=='PROVISIONAL')return query;
 const sh=sssM3BatchSheet_();
 if(sh.getLastRow()!==batch.processed+1||batch.processed>5000)throw Error('M3記事台帳の保存行数が一致しません。');
 const rows=sh.getRange(2,1,batch.processed,9).getDisplayValues();
 if(rows.some(x=>x[0]!==batch.run_id||x[1]!==c.siteId))throw Error('M3記事台帳に異なる実行結果が混在しています。');
 const articles=rows.map(x=>({article_id:x[2],title:x[4]}));
 const hints=sssM3QueryCoverageHints_(query.queries,articles);
 return {format:'S3_M3_SITE_QUERY_COVERAGE_V1',status:'PROVISIONAL',site_id:c.siteId,period:query.period,observation:query.observation,coverage:query.coverage,queries:query.queries.map((x,i)=>({...x,...hints.results[i]})),article_count:hints.article_count,publication_gate:'HOLD',content_action:'NONE',limitations:hints.limitations};
}
function sssM3SiteQueryCoverageDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:18px;line-height:1.6;color:#202124}h3{margin:0 0 8px}p,small{color:#555}button{padding:9px 16px;border:1px solid #b8bfc6;border-radius:5px;background:white;cursor:pointer}button:disabled{opacity:.5}#run{background:#1765ad;color:white}#status{margin:12px 0;font-weight:bold}table{width:100%;border-collapse:collapse}th,td{padding:7px;border-bottom:1px solid #ddd;text-align:left;vertical-align:top}td.num{text-align:right}#scroll{max-height:390px;overflow:auto}footer{border-top:1px solid #ddd;margin-top:14px;padding-top:12px}</style><h3>検索語と既存記事の関連候補</h3><p>サイト全体の検索語と記事タイトルを比較します。類似は参考情報であり、新記事・改善・記事への実績帰属は決定しません。</p><button id="run" onclick="run()">関連候補を確認</button><div id="status" role="status" aria-live="polite">開始待ち</div><div id="meta"></div><div id="scroll"><table><thead><tr><th>検索クエリ</th><th>表示</th><th>タイトル類似の候補（最大3件）</th></tr></thead><tbody id="rows"></tbody></table></div><p><small>候補なしは記事不足を意味しません。本文・検索意図・SERPの確認が必要です。</small></p><footer><button onclick="google.script.host.close()">閉じる</button></footer><script>const e=id=>document.getElementById(id);function run(){e('run').disabled=true;e('status').textContent='GSCと記事台帳を確認しています…';google.script.run.withSuccessHandler(x=>{e('run').disabled=false;if(!x||x.status!=='PROVISIONAL'){e('status').textContent='安全停止：'+(x&&x.reason||'データを確認できません');return}e('status').textContent='確認完了。記事の変更はありません。';e('meta').textContent='対象期間：'+x.period.start+' ～ '+x.period.end+'／記事台帳'+x.article_count+'件／検索語'+x.queries.length+'件';const body=e('rows');body.replaceChildren();x.queries.forEach(r=>{const tr=document.createElement('tr');const cells=[r.query,String(r.impressions),r.candidates.length?r.candidates.map(c=>c.article_id+' '+c.title+'（語句一致 '+c.score+'%）').join(' ／ '):'タイトル類似候補なし（記事不足とは未判定）'];cells.forEach((v,i)=>{const td=document.createElement('td');td.textContent=v;if(i===1)td.className='num';tr.appendChild(td)});body.appendChild(tr)})}).withFailureHandler(err=>{e('run').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3SiteQueryCoveragePilot()}</script></html>`).setWidth(850).setHeight(680);
 SpreadsheetApp.getUi().showModalDialog(html,'検索語と既存記事の関連候補（試験）');
}


// M3 stage 15: bounded, live query x page observations. This is a SAMPLE,
// not exhaustive coverage. Ownership is verified against the full saved SBM
// inventory; ambiguous or unmatched URLs remain unassigned. Read-only.
const SSS_M3_QUERY_PAGE_LIMIT_=250;
function sssM3QueryPageAnalyze_(response,articles,siteId,period){
 if(!siteId||!period||!/^(\d{4}-\d{2}-\d{2})$/.test(period.start)||!/^(\d{4}-\d{2}-\d{2})$/.test(period.end)||period.start>period.end)throw Error('対象サイト・期間が不正です。');
 if(!response||!Array.isArray(response.rows)||response.rows.length>SSS_M3_QUERY_PAGE_LIMIT_||!Array.isArray(articles)||articles.length>5000)throw Error('GSC応答または記事台帳の件数が不正です。');
 const ids=new Set();for(const a of articles){if(!a||!a.article_id||ids.has(a.article_id))throw Error('記事IDが空欄または重複しています。');ids.add(a.article_id);}
 const entries=[],keys=new Set();
 for(const r of response.rows){
  if(!r||!Array.isArray(r.keys)||r.keys.length!==2)throw Error('検索語×ページのキーが不正です。');
  const query=String(r.keys[0]||'').trim(),url=String(r.keys[1]||'').trim();
  if(!query||query.length>500||!/^https?:\/\//i.test(url))throw Error('検索語またはページURLが不正です。');
  const key=JSON.stringify([query.normalize('NFKC').toLowerCase(),url]);if(keys.has(key))throw Error('検索語×ページの重複行があります。');keys.add(key);
  const clicks=Number(r.clicks),impressions=Number(r.impressions),position=Number(r.position);
  if(!Number.isSafeInteger(clicks)||!Number.isSafeInteger(impressions)||clicks<0||impressions<0||clicks>impressions||!Number.isFinite(position)||position<0)throw Error('検索実績の数値が不正です。');
  entries.push({query,url,clicks,impressions,position});
 }
 const matched=sssM3MatchPageRows_(articles,entries.map(x=>({url:x.url,clicks:x.clicks,impressions:x.impressions})));
 const rows=entries.map((x,i)=>({...x,match_status:matched.rows[i].status,article_id:matched.rows[i].article_id,content_action:'NONE'}));
 const queries=new Map();
 for(const r of rows){const key=r.query.normalize('NFKC').toLowerCase();let q=queries.get(key);if(!q){q={query:r.query,sample_rows:0,article_ids:new Set(),unmatched_rows:0,ambiguous_rows:0};queries.set(key,q)}q.sample_rows++;if(r.article_id)q.article_ids.add(r.article_id);if(r.match_status==='UNMATCHED'||r.match_status==='INVALID_URL')q.unmatched_rows++;if(r.match_status==='AMBIGUOUS')q.ambiguous_rows++;}
 const overview=[...queries.values()].map(q=>({query:q.query,sample_rows:q.sample_rows,observed_article_ids:[...q.article_ids].sort(),unmatched_rows:q.unmatched_rows,ambiguous_rows:q.ambiguous_rows,signal:q.ambiguous_rows?'IDENTITY_REVIEW':q.article_ids.size>1?'MULTIPLE_ARTICLES_OBSERVED':q.article_ids.size===1?'ONE_ARTICLE_OBSERVED':'NO_MATCH_IN_SAMPLE',intent:'NOT_CHECKED',content_action:'NONE'}));
 return {format:'S3_M3_QUERY_PAGE_PILOT_V1',status:'PROVISIONAL',site_id:siteId,period,observation:'LIVE_GSC_REQUERY',coverage:'TOP_QUERY_PAGE_SAMPLE',sample_limit:SSS_M3_QUERY_PAGE_LIMIT_,returned:rows.length,article_count:articles.length,queries:overview,rows,publication_gate:'HOLD',content_action:'NONE',limitations:['検索語×ページの上位250行だけの抜粋であり全件ではありません','複数記事の観測はカニバリゼーション確定ではありません','該当記事がない場合も新記事の必要性は未判定です','GSC再取得値は保存済みEvidenceと一致する保証がありません']};
}
function sssM3QueryPagePilot(){
 const c=sssConfig_(),batch=sssM3BatchStatus();if(batch.status!=='COMPLETED')return {status:'BLOCKED',reason:'SBM記事台帳の取得が完了していません。'};
 const ref=sssM1CompactRef_(c),plan=sssM3GscPlan_(ref);if(!plan.available)return {status:'BLOCKED',reason:plan.reason};
 const sh=sssM3BatchSheet_();if(batch.processed>5000||sh.getLastRow()!==batch.processed+1)throw Error('保存済み記事台帳の行数が一致しません。');
 const data=sh.getRange(2,1,batch.processed,9).getDisplayValues();if(data.some(r=>r[0]!==batch.run_id||r[1]!==c.siteId))throw Error('保存済み記事台帳のサイト・実行IDが一致しません。');
 const articles=data.map(r=>({article_id:r[2],url:r[3],title:r[4]}));
 const response=sdscSearchAnalyticsQuery_(c.propertyUri,{startDate:plan.start,endDate:plan.end,type:'web',dataState:'final',dimensions:['query','page'],rowLimit:SSS_M3_QUERY_PAGE_LIMIT_,startRow:0});
 return sssM3QueryPageAnalyze_(response,articles,c.siteId,{start:plan.start,end:plan.end});
}
function sssM3QueryPageDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:18px;color:#202124;line-height:1.55}h3{margin:0 0 10px}button{padding:9px 15px;border:1px solid #bdc1c6;border-radius:5px;background:white;cursor:pointer}#run{background:#1765ad;color:white}button:disabled{opacity:.5}#status{font-weight:bold;margin:12px 0}table{border-collapse:collapse;width:100%;table-layout:fixed}th,td{text-align:left;padding:10px 6px;border-bottom:1px solid #ddd;overflow-wrap:anywhere;vertical-align:top}th:first-child{width:45%}th:nth-child(2){width:20%}small{color:#555}footer{border-top:1px solid #ddd;margin-top:16px;padding-top:12px}</style><h3>検索語×実績ページの確認</h3><p>GSCの検索語×ページ上位250行を、保存済みの記事台帳と照合します。観測結果は暫定で、記事改善や新記事作成は決定しません。</p><button id="run" onclick="run()">実績ページを確認</button><div id="status" role="status" aria-live="polite">開始待ち</div><div id="meta"></div><table><thead><tr><th>検索語</th><th>記事ID</th><th>確認状態</th></tr></thead><tbody id="rows"></tbody></table><p><small>上位250行の抜粋です。複数記事が観測されても記事競合は未確定です。記事が見つからなくても記事不足とは判断しません。</small></p><details><summary>技術情報</summary><pre id="technical" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre></details><footer><button onclick="google.script.host.close()">閉じる</button></footer><script>const e=id=>document.getElementById(id);function run(){e('run').disabled=true;e('status').textContent='GSCと記事台帳を照合しています…';google.script.run.withSuccessHandler(x=>{e('run').disabled=false;if(!x||x.status!=='PROVISIONAL'){e('status').textContent='安全停止：'+(x&&x.reason||'確認できません');return}e('status').textContent='確認完了。記事の変更はありません。';e('meta').textContent='対象期間：'+x.period.start+' ～ '+x.period.end+'／取得'+x.returned+'行／対象記事'+x.article_count+'件';const body=e('rows');body.replaceChildren();x.queries.forEach(q=>{const tr=document.createElement('tr');const label=q.signal==='MULTIPLE_ARTICLES_OBSERVED'?'複数記事で観測（競合未判定）':q.signal==='IDENTITY_REVIEW'?'URL照合の確認が必要':q.signal==='ONE_ARTICLE_OBSERVED'?'実績ページを確認':'対応記事は未確認';[q.query,q.observed_article_ids.join('、')||'—',label].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});body.appendChild(tr)});e('technical').textContent=JSON.stringify({coverage:x.coverage,returned:x.returned,limitations:x.limitations},null,2)}).withFailureHandler(err=>{e('run').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3QueryPagePilot()}</script></html>`).setWidth(850).setHeight(680);
 SpreadsheetApp.getUi().showModalDialog(html,'検索語×実績ページの確認（試験）');
}


// M3 stage 16: evidence-based role REVIEW only. Query-page TOP250 is a
// non-exhaustive sample, not proof of intent, cannibalization, or gaps.
function sssM3RoleReviewClassify_(observation){
 if(!observation||observation.status!=='PROVISIONAL'||observation.format!=='S3_M3_QUERY_PAGE_PILOT_V1'||!Array.isArray(observation.queries)||!Array.isArray(observation.rows)||observation.rows.length>250)throw Error('検索語×ページの観測データが不正です。');
 const byQuery=new Map();
 for(const row of observation.rows){
  const key=String(row.query||'').normalize('NFKC').toLowerCase();
  if(!key||!Number.isSafeInteger(row.impressions)||row.impressions<0||!Number.isSafeInteger(row.clicks)||row.clicks<0||row.clicks>row.impressions)throw Error('検索語×ページの数値が不正です。');
  if(!byQuery.has(key))byQuery.set(key,[]);
  byQuery.get(key).push(row);
 }
 const seen=new Set(),results=[];
 for(const q of observation.queries){
  const key=String(q.query||'').normalize('NFKC').toLowerCase();
  if(!key||seen.has(key)||!byQuery.has(key))throw Error('検索語の対応関係が不正です。');seen.add(key);
  const rows=byQuery.get(key),ids=[...new Set(rows.filter(r=>r.article_id).map(r=>String(r.article_id)))].sort();
  if(rows.length!==q.sample_rows||ids.join('|')!==q.observed_article_ids.join('|'))throw Error('検索語の集計と実績行が一致しません。');
  const unresolved=rows.filter(r=>!r.article_id).length;
  let classification='ONE_ARTICLE_OBSERVED',reason='この抜粋では1記事の実績を確認。検索意図と記事の役割は未確認。';
  if(q.ambiguous_rows>0){classification='URL_IDENTITY_REVIEW';reason='URL照合が曖昧です。記事の帰属を確定できません。';}
  else if(ids.length>1){classification='MULTI_ARTICLE_REVIEW';reason='同一検索語で複数記事を観測。競合・役割分離は未判定。';}
  else if(ids.length===0){classification='NO_MATCH_IN_SAMPLE';reason='抜粋内で記事IDを確認できません。新記事が必要とは限りません。';}
  else if(unresolved>0){classification='PARTIAL_URL_COVERAGE';reason='記事1件の実績は確認しましたが、未照合ページがあります。';}
  const matchedRows=rows.filter(r=>r.article_id);
  results.push({query:q.query,classification,reason,article_ids:ids,sample_rows:rows.length,sample_impressions:rows.reduce((a,r)=>a+r.impressions,0),sample_clicks:rows.reduce((a,r)=>a+r.clicks,0),unresolved_rows:unresolved,action:'REVIEW_ONLY',publication_gate:'HOLD'});
 }
 if(seen.size!==byQuery.size)throw Error('検索語の集計に欠落があります。');
 const counts={};for(const r of results)counts[r.classification]=(counts[r.classification]||0)+1;
 results.sort((a,b)=>{const pri={URL_IDENTITY_REVIEW:0,MULTI_ARTICLE_REVIEW:1,PARTIAL_URL_COVERAGE:2,ONE_ARTICLE_OBSERVED:3,NO_MATCH_IN_SAMPLE:4};return pri[a.classification]-pri[b.classification]||b.sample_impressions-a.sample_impressions||a.query.localeCompare(b.query,'ja')});
 return {format:'S3_M3_ROLE_REVIEW_V1',status:'PROVISIONAL',site_id:observation.site_id,period:observation.period,source:'LIVE_GSC_QUERY_PAGE_TOP250',returned:observation.returned,counts,results,publication_gate:'HOLD',content_action:'NONE',limitations:['上位250行の抜粋であり検索語ごとの全ページではありません','表示回数は抜粋行の合計でサイト全体の検索需要ではありません','複数記事の観測は競合確定ではありません','新記事・改善・統合・noindex・公開は決定しません']};
}
function sssM3RoleReviewPilot(){
 const x=sssM3QueryPagePilot();
 if(!x||x.status!=='PROVISIONAL')return x;
 return sssM3RoleReviewClassify_(x);
}
function sssM3RoleReviewDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;color:#202124;padding:18px;line-height:1.55}h3{margin:0 0 10px}button{padding:9px 14px;border:1px solid #b8bfc6;border-radius:5px;background:white;cursor:pointer}#run{background:#1765ad;color:white}button:disabled{opacity:.5}#status{font-weight:bold;margin:12px 0}table{border-collapse:collapse;width:100%;table-layout:fixed}th,td{padding:9px 6px;text-align:left;border-bottom:1px solid #ddd;overflow-wrap:anywhere;vertical-align:top}th:first-child{width:34%}th:nth-child(2){width:25%}small{color:#555}footer{border-top:1px solid #ddd;margin-top:12px;padding-top:12px}</style><h3>検索語の役割・競合候補</h3><p>実際の検索語×ページ実績をもとに確認候補を整理します。競合や新記事の必要性は確定しません。</p><button id="run" onclick="run()">候補を分析</button><div id="status" role="status" aria-live="polite">開始待ち</div><div id="meta"></div><table><thead><tr><th>検索語</th><th>観測記事</th><th>確認内容</th></tr></thead><tbody id="rows"></tbody></table><p><small>検索語×ページ上位250行の抜粋。候補なしは需要ゼロや記事不足を意味しません。</small></p><details><summary>技術情報</summary><pre id="technical" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre></details><footer><button onclick="google.script.host.close()">閉じる</button></footer><script>const e=id=>document.getElementById(id);function run(){e('run').disabled=true;e('status').textContent='検索実績を照合しています…';google.script.run.withSuccessHandler(x=>{e('run').disabled=false;if(!x||x.status!=='PROVISIONAL'){e('status').textContent='安全停止：'+(x&&x.reason||'確認できません');return}e('status').textContent='分析完了。記事は変更していません。';e('meta').textContent='対象期間：'+x.period.start+' ～ '+x.period.end+'／実績'+x.returned+'行／検索語'+x.results.length+'件';const body=e('rows');body.replaceChildren();x.results.slice(0,40).forEach(r=>{const tr=document.createElement('tr');[r.query,r.article_ids.join('、')||'—',r.reason].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});body.appendChild(tr)});e('technical').textContent=JSON.stringify({counts:x.counts,limitations:x.limitations},null,2)}).withFailureHandler(err=>{e('run').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3RoleReviewPilot()}</script></html>`).setWidth(850).setHeight(680);
 SpreadsheetApp.getUi().showModalDialog(html,'検索語の役割・競合候補（試験）');
}


// M3 stage 17: a bounded query-specific page drilldown. GSC query filter is
// EXACT, one query per invocation, no automatic ZIP extraction or writes.
const SSS_M3_DEEP_DIVE_LIMIT_=100;
function sssM3QueryDeepDiveAnalyze_(response,articles,siteId,period,query){
 const q=String(query||'').trim();
 if(!q||q.length>500||!siteId||!period||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(period.start)||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(period.end)||period.start>period.end)throw Error('検索語・対象期間が不正です。');
 if(!response||!Array.isArray(response.rows)||response.rows.length>SSS_M3_DEEP_DIVE_LIMIT_||!Array.isArray(articles)||articles.length>5000)throw Error('ページ別実績の応答が不正です。');
 const urls=new Set(),entries=[];
 for(const r of response.rows){
  if(!r||!Array.isArray(r.keys)||r.keys.length!==1)throw Error('ページ別実績のキーが不正です。');
  const url=String(r.keys[0]||'').trim();
  if(!/^https?:\/\//i.test(url)||urls.has(url))throw Error('ページURLが不正または重複しています。');urls.add(url);
  const clicks=Number(r.clicks),impressions=Number(r.impressions),position=Number(r.position);
  if(!Number.isSafeInteger(clicks)||!Number.isSafeInteger(impressions)||clicks<0||impressions<0||clicks>impressions||!Number.isFinite(position)||position<0)throw Error('ページ実績の数値が不正です。');
  entries.push({url,clicks,impressions,position});
 }
 const matched=sssM3MatchPageRows_(articles,entries.map(x=>({url:x.url,clicks:x.clicks,impressions:x.impressions})));
 if(!matched||!Array.isArray(matched.rows)||matched.rows.length!==entries.length)throw Error('ページ照合結果が不正です。');
 const rows=entries.map((r,i)=>({...r,article_id:matched.rows[i].article_id||'',match_status:matched.rows[i].status}));
 const ids=[...new Set(rows.filter(r=>r.article_id).map(r=>r.article_id))].sort();
 const unresolved=rows.filter(r=>!r.article_id).length;
 const classification=rows.some(r=>r.match_status==='AMBIGUOUS')?'URL_IDENTITY_REVIEW':ids.length>1?'MULTI_ARTICLE_REVIEW':unresolved?'PARTIAL_COVERAGE':ids.length===1?'ONE_ARTICLE_OBSERVED':'NO_PAGE_OBSERVED';
 return {format:'S3_M3_QUERY_DEEP_DIVE_V1',status:'PROVISIONAL',site_id:siteId,period,query:q,source:'LIVE_GSC_EXACT_QUERY_PAGES',returned:rows.length,limit:SSS_M3_DEEP_DIVE_LIMIT_,truncated_possible:rows.length===SSS_M3_DEEP_DIVE_LIMIT_,classification,article_ids:ids,unresolved_rows:unresolved,rows,publication_gate:'HOLD',content_action:'NONE',limitations:['GSCの指定検索語に一致するページ上位100件の取得であり、全ページを保証しません','検索意図の一致・記事競合・新記事の必要性は未確定です','GSC再取得値は保存済みEvidenceと一致する保証がありません']};
}
function sssM3QueryDeepDiveCandidates(){
 const x=sssM3SiteQueryPilot();if(!x||x.status!=='PROVISIONAL')return x;
 return {status:'PROVISIONAL',period:x.period,queries:x.queries.slice(0,20).map(r=>({query:r.query,impressions:r.impressions})),publication_gate:'HOLD',content_action:'NONE'};
}
function sssM3QueryDeepDivePilot(query){
 const c=sssConfig_(),batch=sssM3BatchStatus();if(batch.status!=='COMPLETED')return {status:'BLOCKED',reason:'記事台帳が未完成です。'};
 const ref=sssM1CompactRef_(c),plan=sssM3GscPlan_(ref);if(!plan.available)return {status:'BLOCKED',reason:plan.reason};
 const q=String(query||'').trim();if(!q||q.length>500)throw Error('検索語が不正です。');
 // Prevent arbitrary cross-site or unobserved queries; verify against a fresh
 // bounded site-level query response before issuing the exact-match request.
 const candidates=sssM3QueryDeepDiveCandidates();if(candidates.status!=='PROVISIONAL')return candidates;
 if(!candidates.queries.some(r=>r.query===q))return {status:'BLOCKED',reason:'上位20件の検索語から選択してください。'};
 const sh=sssM3BatchSheet_();if(batch.processed>5000||sh.getLastRow()!==batch.processed+1)throw Error('記事台帳の件数が一致しません。');
 const data=sh.getRange(2,1,batch.processed,9).getDisplayValues();if(data.some(r=>r[0]!==batch.run_id||r[1]!==c.siteId))throw Error('記事台帳のサイト・実行IDが一致しません。');
 const articles=data.map(r=>({article_id:r[2],url:r[3],title:r[4]}));
 const response=sdscSearchAnalyticsQuery_(c.propertyUri,{startDate:plan.start,endDate:plan.end,type:'web',dataState:'final',dimensions:['page'],dimensionFilterGroups:[{groupType:'and',filters:[{dimension:'query',operator:'equals',expression:q}]}],rowLimit:SSS_M3_DEEP_DIVE_LIMIT_,startRow:0});
 return sssM3QueryDeepDiveAnalyze_(response,articles,c.siteId,{start:plan.start,end:plan.end},q);
}
function sssM3QueryDeepDiveDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;color:#202124;padding:18px;line-height:1.6}h3{margin:0 0 8px}button,select{padding:9px;border:1px solid #bdc1c6;border-radius:5px}button{cursor:pointer;background:#1765ad;color:white}button:disabled{opacity:.5}select{max-width:100%;width:100%;margin:10px 0}table{width:100%;border-collapse:collapse;table-layout:auto}#rows td:nth-child(3){min-width:230px;font-size:12px;line-height:1.5}#rows td:nth-child(4){min-width:125px}#rows td:first-child{min-width:150px}td,th{border-bottom:1px solid #ddd;text-align:left;padding:9px;overflow-wrap:anywhere}th:first-child{width:30%}#status{font-weight:bold;margin:12px 0}small{color:#555}footer{margin-top:16px;border-top:1px solid #ddd;padding-top:12px}footer button{background:white;color:#222}</style><h3>検索語を個別に深掘り</h3><p>検索需要上位20語から1語を選び、GSCでその検索語のページ別実績を最大100件確認します。競合・統合・新記事作成は決定しません。</p><select id="query" aria-label="分析する検索語" disabled><option>検索語を取得しています…</option></select><button id="run" onclick="run()" disabled>選んだ検索語を分析</button><div id="status" role="status" aria-live="polite">検索語を取得しています…</div><div id="meta"></div><table><thead><tr><th>記事ID</th><th>表示回数</th><th>クリック数</th><th>照合状態</th></tr></thead><tbody id="rows"></tbody></table><p><small>100件に達した場合、ほかのページが存在する可能性があります。検索意図は未検証です。</small></p><details><summary>技術情報</summary><pre id="technical" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre></details><footer><button onclick="google.script.host.close()">閉じる</button></footer><script>const e=id=>document.getElementById(id);google.script.run.withSuccessHandler(x=>{if(!x||x.status!=='PROVISIONAL'){e('status').textContent='安全停止：'+(x&&x.reason||'検索語を取得できません');return}const sel=e('query');sel.replaceChildren();x.queries.forEach(r=>{const o=document.createElement('option');o.value=r.query;o.textContent=r.query+'（表示 '+r.impressions+'）';sel.appendChild(o)});sel.disabled=!x.queries.length;e('run').disabled=!x.queries.length;e('status').textContent='検索語を選んで分析してください。'}).withFailureHandler(err=>{e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3QueryDeepDiveCandidates();function run(){e('run').disabled=true;e('status').textContent='指定検索語の実績ページを確認しています…';google.script.run.withSuccessHandler(x=>{e('run').disabled=false;if(!x||x.status!=='PROVISIONAL'){e('status').textContent='安全停止：'+(x&&x.reason||'確認できません');return}e('status').textContent='確認完了。記事の変更はありません。';e('meta').textContent='検索語：'+x.query+'／取得'+x.returned+'件'+(x.truncated_possible?'（100件上限・未取得の可能性）':'')+'／観測記事'+x.article_ids.length+'件／分類 '+x.classification;const body=e('rows');body.replaceChildren();x.rows.forEach(r=>{const tr=document.createElement('tr');[r.article_id||'未照合',r.impressions,r.clicks,r.match_status].forEach(v=>{const td=document.createElement('td');td.textContent=String(v);tr.appendChild(td)});body.appendChild(tr)});e('technical').textContent=JSON.stringify({period:x.period,source:x.source,limitations:x.limitations},null,2)}).withFailureHandler(err=>{e('run').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3QueryDeepDivePilot(e('query').value)}</script></html>`).setWidth(820).setHeight(680);
 SpreadsheetApp.getUi().showModalDialog(html,'検索語を個別に深掘り（試験）');
}


// M3 phase batch: one-click guided review of up to 10 observed queries.
// Each RPC is bounded to two exact-query GSC requests, with no persistent
// changes or automatic publication. The client advances after each RPC.
const SSS_M3_STRATEGY_QUERY_LIMIT_=10;
const SSS_M3_STRATEGY_BATCH_SIZE_=2;
function sssM3StrategySelect_(siteQueries){
 if(!siteQueries||siteQueries.status!=='PROVISIONAL'||!Array.isArray(siteQueries.queries))throw Error('サイト全体の検索需要データが不正です。');
 const seen=new Set(),selected=[];
 for(const r of siteQueries.queries){
  const q=String(r.query||'').trim(),key=q.normalize('NFKC').toLowerCase();
  if(!q||q.length>500||seen.has(key)||!Number.isSafeInteger(r.impressions)||r.impressions<0)throw Error('検索語の候補が不正です。');
  seen.add(key);
  if(selected.length<SSS_M3_STRATEGY_QUERY_LIMIT_)selected.push({query:q,impressions:r.impressions,clicks:r.clicks,position:r.position});
 }
 return selected;
}
function sssM3StrategyInterpret_(q,deep){
 if(!deep||deep.status!=='PROVISIONAL'||deep.query!==q.query||deep.content_action!=='NONE'||deep.publication_gate!=='HOLD')throw Error('個別検索語の精査結果が不正です。');
 let category='EXISTING_ARTICLE_REVIEW',reason='実績記事を確認しました。改善要否は検索意図・記事の役割を確認して判断します。';
 if(deep.classification==='MULTI_ARTICLE_REVIEW'){category='ROLE_REVIEW';reason='同じ検索語で複数記事の実績を観測。記事競合か役割分担かは未確定です。';}
 else if(deep.classification==='URL_IDENTITY_REVIEW'||deep.classification==='PARTIAL_COVERAGE'){category='EVIDENCE_REVIEW';reason='URLの帰属または取得範囲が不十分です。';}
 else if(deep.classification==='NO_PAGE_OBSERVED'){category='OPPORTUNITY_RESEARCH';reason='今回の取得範囲では実績記事が未確認です。新記事が必要とは限りません。';}
 else if(deep.classification!=='ONE_ARTICLE_OBSERVED')throw Error('検索語の分類が不正です。');
 if(deep.truncated_possible){category='EVIDENCE_REVIEW';reason='ページ実績が100件の上限に達したため、追加調査が必要です。';}
 return {query:q.query,impressions:q.impressions,clicks:q.clicks,position:q.position,category,reason,article_ids:deep.article_ids,observed_pages:deep.returned,publication_gate:'HOLD',content_action:'NONE'};
}
function sssM3StrategyBatchPilot(offset){
 if(!Number.isSafeInteger(offset)||offset<0||offset%SSS_M3_STRATEGY_BATCH_SIZE_!==0||offset>=SSS_M3_STRATEGY_QUERY_LIMIT_)throw Error('分析位置が不正です。');
 const c=sssConfig_(),batch=sssM3BatchStatus();
 if(batch.status!=='COMPLETED'||batch.processed>5000)return {status:'BLOCKED',reason:'記事台帳が未完成です。'};
 const ref=sssM1CompactRef_(c),plan=sssM3GscPlan_(ref);
 if(!plan.available)return {status:'BLOCKED',reason:plan.reason};
 const site=sssM3SiteQueryPilot();
 if(!site||site.status!=='PROVISIONAL'||site.site_id!==c.siteId||site.period.start!==plan.start||site.period.end!==plan.end)throw Error('検索需要の対象サイト・期間が一致しません。');
 const candidates=sssM3StrategySelect_(site);
 const sh=sssM3BatchSheet_();
 if(sh.getLastRow()!==batch.processed+1)throw Error('記事台帳の行数が一致しません。');
 const data=sh.getRange(2,1,batch.processed,9).getDisplayValues();
 if(data.some(r=>r[0]!==batch.run_id||r[1]!==c.siteId))throw Error('記事台帳のサイト・実行IDが一致しません。');
 const articles=data.map(r=>({article_id:r[2],url:r[3],title:r[4]}));
 const results=[];
 for(const q of candidates.slice(offset,offset+SSS_M3_STRATEGY_BATCH_SIZE_)){
  const response=sdscSearchAnalyticsQuery_(c.propertyUri,{startDate:plan.start,endDate:plan.end,type:'web',dataState:'final',dimensions:['page'],dimensionFilterGroups:[{groupType:'and',filters:[{dimension:'query',operator:'equals',expression:q.query}]}],rowLimit:SSS_M3_DEEP_DIVE_LIMIT_,startRow:0});
  const deep=sssM3QueryDeepDiveAnalyze_(response,articles,c.siteId,{start:plan.start,end:plan.end},q.query);
  results.push(sssM3StrategyInterpret_(q,deep));
 }
 return {format:'S3_M3_STRATEGY_BATCH_V1',status:'PROVISIONAL',site_id:c.siteId,period:{start:plan.start,end:plan.end},offset,total:candidates.length,next_offset:offset+results.length,results,publication_gate:'HOLD',content_action:'NONE',limitations:['検索需要上位最大10語の抜粋です','1回の通信で最大2検索語を調査します','実績ページ上位100件の抜粋で、未観測は需要なしを意味しません','新記事・既存記事改善・統合・noindex・公開は決定しません']};
}
function sssM3StrategyDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:20px;color:#202124;line-height:1.6}h3{margin:0 0 8px}p,small{color:#555}button{padding:10px 16px;border:1px solid #bdc1c6;border-radius:5px;cursor:pointer;background:#1765ad;color:white}button:disabled{opacity:.5}#status{font-weight:bold;margin:12px 0}progress{width:100%;height:15px}table{width:100%;border-collapse:collapse;table-layout:auto}#rows td:nth-child(3){min-width:230px;font-size:12px;line-height:1.5}#rows td:nth-child(4){min-width:125px}#rows td:first-child{min-width:150px}td,th{border-bottom:1px solid #ddd;padding:9px 6px;text-align:left;overflow-wrap:anywhere;vertical-align:top}th:first-child{width:32%}th:nth-child(2){width:24%}footer{border-top:1px solid #ddd;padding-top:14px;margin-top:16px}footer button{background:white;color:#202124}#stop{background:white;color:#202124}</style><h3>検索戦略をまとめて分析</h3><p>検索需要の上位10語を、実績ページと記事台帳に照合します。2語ずつ自動進行し、改善・公開は実行しません。</p><button id="start" onclick="start()">分析を開始</button> <button id="stop" onclick="stop()" disabled>停止</button><div id="status" role="status" aria-live="polite">開始待ち</div><progress id="bar" max="10" value="0"></progress><div id="meta">0 / 最大10語</div><section id="handoff" hidden><h4>Claudeへ精査を依頼</h4><p>分析結果を確認し、依頼文をコピーしてClaudeへ貼り付けてください。記事変更は行いません。</p><button id="buildPrompt" onclick="buildPrompt()">精査依頼文を作成</button> <button id="copyPrompt" onclick="copyPrompt()" disabled>依頼文をコピー</button><span id="promptStatus" role="status"></span><textarea id="prompt" readonly style="box-sizing:border-box;width:100%;height:180px;resize:vertical" aria-label="Claude精査依頼文"></textarea><h4>Claude回答の確認</h4><textarea id="answer" style="box-sizing:border-box;width:100%;height:140px;resize:vertical" placeholder="ClaudeのJSON回答を貼り付け"></textarea><button id="verifyAnswer" onclick="verifyAnswer()">回答を検証</button><div id="answerStatus" role="status"></div><pre id="verified" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre><div><button id="saveReview" onclick="saveReview()" disabled>検証結果をS3に保存</button><span id="saveStatus" role="status" aria-live="polite"></span></div><p><small>保存先はS3専用シートです。SBM・Evidence・記事は変更しません。保存後の優先度は追加調査の順序であり、処置の承認ではありません。</small></p></section><table><thead><tr><th>検索語</th><th>観測記事</th><th>次の確認</th></tr></thead><tbody id="rows"></tbody></table><p><small>分類は追加調査の振り分けです。新記事・統合・改善を確定しません。</small></p><details><summary>技術情報</summary><pre id="technical" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre></details><footer><button onclick="google.script.host.close()">閉じる</button></footer><script>function sssM3StrategyLocalPrompt_(payload){
 if(!payload||payload.format!=='S3_M3_STRATEGY_HANDOFF_INPUT_V1'||typeof payload.site_id!=='string'||!/^[-a-zA-Z0-9_]{6,100}$/.test(payload.site_id)||!payload.period||!/^\\d{4}-\\d{2}-\\d{2}$/.test(payload.period.start)||!/^\\d{4}-\\d{2}-\\d{2}$/.test(payload.period.end)||payload.period.start>payload.period.end||!Array.isArray(payload.results)||payload.results.length<1||payload.results.length>10)throw Error('精査依頼の入力形式が不正です。');
 const validCategories=new Set(['ROLE_REVIEW','EVIDENCE_REVIEW','EXISTING_ARTICLE_REVIEW','OPPORTUNITY_RESEARCH']);
 const seen=new Set();const rows=payload.results.map(r=>{
  const query=String(r.query||'').trim(),key=query.normalize('NFKC').toLowerCase();
  if(!query||query.length>500||seen.has(key)||!validCategories.has(r.category)||r.publication_gate!=='HOLD'||r.content_action!=='NONE'||!Array.isArray(r.article_ids)||r.article_ids.length>100||!Number.isSafeInteger(r.impressions)||r.impressions<0||!Number.isSafeInteger(r.clicks)||r.clicks<0||r.clicks>r.impressions||!Number.isSafeInteger(r.observed_pages)||r.observed_pages<0||r.observed_pages>100)throw Error('検索語の根拠・保留ゲートが不正です。');
  seen.add(key);const ids=[...new Set(r.article_ids)];if(ids.length!==r.article_ids.length||ids.some(id=>typeof id!=='string'||!/^A\\d{6}$/.test(id)))throw Error('記事IDの形式・重複が不正です。');
  if(!['string','undefined'].includes(typeof r.reason)||String(r.reason||'').length>500)throw Error('確認理由が不正です。');
  return {query,impressions:r.impressions,clicks:r.clicks,observed_pages:r.observed_pages,article_ids:ids,category:r.category,reason:String(r.reason||'')};
 });
 const envelope={format:'S3_M3_STRATEGY_CLAUDE_REVIEW_V1',site_id:payload.site_id,period:{start:payload.period.start,end:payload.period.end},source:'LIVE_GSC_EXACT_QUERY_PAGES_TOP100_PER_QUERY',status:'PROVISIONAL',publication_gate:'HOLD',content_action:'NONE',queries:rows,limitations:['GSC再取得値は保存済みEvidenceと同一とは限らない','検索語はサイト上位最大10語であり全検索語ではない','検索語別ページは上位100件まで、欠落は需要ゼロを意味しない','同一検索語で複数記事が観測されてもカニバリゼーションは未確定','タイトル・本文・SERP・検索意図の確認はこのデータに含まれない','SBMで処理中の記事への重複依頼は禁止']};
 const instruction=[
  'あなたはS3の検索戦略精査担当です。以下の観測データのみを確定事実として扱い、検索意図・SERP・記事本文を未確認なら推測で補完しないでください。',
  '【目的】検索語ごとに既存記事の役割確認、競合疑義、追加調査、新記事企画の可能性を整理してください。自動で記事改善・統合・削除・noindex・公開を決定しないでください。',
  '【重要】記事IDは観測対象であり、記事本文やSBM作業状態を検証した証拠ではありません。未取得の検索語やページを「存在しない」と断定しないでください。',
  '【回答形式】JSONのみ。{ "format":"S3_M3_STRATEGY_CLAUDE_RESPONSE_V1", "site_id":"...", "publication_gate":"HOLD", "content_action":"NONE", "reviews":[{"query":"...","assessment":"EXISTING_REVIEW|ROLE_REVIEW|NEW_ARTICLE_RESEARCH|EVIDENCE_NEEDED","confidence":"PROVISIONAL|UNCONFIRMED","observed_article_ids":["A000001"],"reason":"根拠と未確認事項","next_evidence":["確認事項"]}] }',
  '各検索語につき1件のreviewsを返し、site_idとqueryと記事IDは入力から変更しないでください。未確認のSERP順位・検索ボリューム・本文内容・体験談を捏造しないでください。',
  '【観測データ】',JSON.stringify(envelope,null,2)
 ];
 return {format:'S3_M3_STRATEGY_HANDOFF_V1',status:'READY',site_id:payload.site_id,query_count:rows.length,publication_gate:'HOLD',content_action:'NONE',prompt:instruction.join('\\n\\n')};
}const e=id=>document.getElementById(id);let active=false,offset=0,site='',period='',all=[],verifiedReview=null;function start(){active=true;offset=0;site='';period='';all=[];verifiedReview=null;e('saveReview').disabled=true;e('saveStatus').textContent='';e('handoff').hidden=true;e('prompt').value='';e('rows').replaceChildren();e('start').disabled=true;e('stop').disabled=false;step()}function stop(){active=false;e('status').textContent='停止しました。再開時は先頭から読み取り専用で再分析します。';e('stop').disabled=true;e('start').disabled=false}function fail(msg){active=false;e('status').textContent='安全停止：'+msg;e('start').disabled=false;e('stop').disabled=true}function buildPrompt(){if(active||!site||!all.length||offset!==all.length){e('promptStatus').textContent='分析完了後に作成してください。';return}e('buildPrompt').disabled=true;e('promptStatus').textContent='依頼文を作成しています…';try{const x=sssM3StrategyLocalPrompt_({format:'S3_M3_STRATEGY_HANDOFF_INPUT_V1',site_id:site,period:JSON.parse(period),results:all});if(!x||x.status!=='READY'||x.publication_gate!=='HOLD'||x.content_action!=='NONE'||x.query_count!==all.length)throw Error('依頼文の整合性を確認できません');e('prompt').value=x.prompt;verifiedReview=null;e('saveReview').disabled=true;e('saveStatus').textContent='';e('copyPrompt').disabled=false;e('promptStatus').textContent='依頼文を作成しました。'}catch(err){e('copyPrompt').disabled=true;e('promptStatus').textContent='安全停止：'+String(err&&err.message||err)}finally{e('buildPrompt').disabled=false}}async function copyPrompt(){const v=e('prompt').value;if(!v)return;try{let ok=false;try{if(navigator.clipboard){await navigator.clipboard.writeText(v);ok=true}}catch(err){}if(!ok){e('prompt').focus();e('prompt').select();ok=document.execCommand('copy')}if(!ok)throw Error('copy');e('promptStatus').textContent='コピーしました！'}catch(err){e('promptStatus').textContent='コピーできませんでした。テキストを選択しCtrl+Cでコピーしてください。'}}function sssM3StrategyValidateLocal_(payload,answerText){
 if(!payload||payload.format!=='S3_M3_STRATEGY_HANDOFF_INPUT_V1'||!Array.isArray(payload.results)||payload.results.length<1||payload.results.length>10||typeof answerText!=='string'||!answerText.trim()||answerText.length>60000)throw Error('回答または分析根拠が不正です。');
 let a;try{a=JSON.parse(answerText.trim())}catch(err){throw Error('Claude回答はJSON形式で貼り付けてください。')}
 if(!a||a.format!=='S3_M3_STRATEGY_CLAUDE_RESPONSE_V1'||a.site_id!==payload.site_id||a.publication_gate!=='HOLD'||a.content_action!=='NONE'||!Array.isArray(a.reviews)||a.reviews.length!==payload.results.length)throw Error('回答形式・サイトID・保留ゲート・件数が一致しません。');
 const expected=new Map(payload.results.map(r=>[r.query,r]));if(expected.size!==payload.results.length)throw Error('観測検索語が重複しています。');
 const allowed=new Set(['EXISTING_REVIEW','ROLE_REVIEW','NEW_ARTICLE_RESEARCH','EVIDENCE_NEEDED']);const seen=new Set(),reviews=[];
 for(const r of a.reviews){
  if(!r||typeof r.query!=='string'||!expected.has(r.query)||seen.has(r.query)||!allowed.has(r.assessment)||!['PROVISIONAL','UNCONFIRMED'].includes(r.confidence)||typeof r.reason!=='string'||!r.reason.trim()||r.reason.length>1500||!Array.isArray(r.next_evidence)||r.next_evidence.length>10||r.next_evidence.some(x=>typeof x!=='string'||!x.trim()||x.length>300)||!Array.isArray(r.observed_article_ids))throw Error('回答の検索語・判断項目が不正です。');
  const ids=expected.get(r.query).article_ids;if(!Array.isArray(ids)||r.observed_article_ids.length!==ids.length||r.observed_article_ids.some(x=>!ids.includes(x))||new Set(r.observed_article_ids).size!==ids.length)throw Error('回答が観測記事IDを変更しています。');
  seen.add(r.query);reviews.push({query:r.query,assessment:r.assessment,confidence:r.confidence,reason:r.reason,next_evidence:r.next_evidence,observed_article_ids:ids});
 }
 return {format:'S3_M3_STRATEGY_CLAUDE_VERIFIED_V1',status:'REVIEWED',site_id:payload.site_id,review_count:reviews.length,reviews,publication_gate:'HOLD',content_action:'NONE'};
}
function verifyAnswer(){if(active||!e('prompt').value||!e('answer').value.trim()){e('answerStatus').textContent='依頼文を作成し、ClaudeのJSON回答を貼り付けてください。';return}e('verifyAnswer').disabled=true;e('answerStatus').textContent='回答を確認しています…';try{const x=sssM3StrategyValidateLocal_({format:'S3_M3_STRATEGY_HANDOFF_INPUT_V1',site_id:site,period:JSON.parse(period),results:all},e('answer').value);verifiedReview=x;e('saveReview').disabled=false;e('saveStatus').textContent='未保存。必要ならS3に保存してください。';e('answerStatus').textContent='形式検証完了（画面内）。記事の処置は実行していません。';e('verified').textContent=x.reviews.map(r=>r.query+'：'+r.assessment+'／'+r.confidence+'／'+r.reason).join('\\n')}catch(err){verifiedReview=null;e('saveReview').disabled=true;e('answerStatus').textContent='安全停止：'+String(err&&err.message||err);e('verified').textContent=''}finally{e('verifyAnswer').disabled=false}}
function saveReview(){if(active||!verifiedReview||!e('answer').value.trim()){e('saveStatus').textContent='回答の形式検証を完了してください。';return}e('saveReview').disabled=true;e('saveStatus').textContent='S3に保存しています…';const payload={format:'S3_M3_STRATEGY_HANDOFF_INPUT_V1',site_id:site,period:JSON.parse(period),results:all};google.script.run.withSuccessHandler(x=>{e('saveStatus').textContent=x&&x.status==='SAVED'?'S3に保存しました（'+x.count+'件、追加調査待ち）。':x&&x.status==='ALREADY_SAVED'?'保存済みの結果です（重複登録なし）。':'保存結果を確認できません。';e('saveReview').disabled=false}).withFailureHandler(err=>{e('saveStatus').textContent='保存できませんでした：'+String(err&&err.message||err);e('saveReview').disabled=false}).sssM3StrategySaveReview(payload,e('answer').value)}
function step(){if(!active)return;e('status').textContent='検索実績を確認しています（'+offset+'語処理済み）…';google.script.run.withSuccessHandler(x=>{if(!active)return;if(!x||x.status!=='PROVISIONAL'){fail(x&&x.reason||'確認できません');return}if(x.format!=='S3_M3_STRATEGY_BATCH_V1'||x.offset!==offset||x.next_offset<=offset||x.next_offset>x.total||x.total>10||x.publication_gate!=='HOLD'||x.content_action!=='NONE'){fail('分析区間の整合性が確認できません');return}if(site&&(site!==x.site_id||period!==JSON.stringify(x.period))){fail('サイト・期間が途中で変わりました');return}site=x.site_id;period=JSON.stringify(x.period);x.results.forEach(r=>{all.push(r);const tr=document.createElement('tr');const label=r.category==='ROLE_REVIEW'?'複数記事の役割を確認':r.category==='OPPORTUNITY_RESEARCH'?'新規機会を追加調査':r.category==='EVIDENCE_REVIEW'?'データを再確認':'既存記事の役割を確認';[r.query,r.article_ids.join('、')||'未確認',label].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});e('rows').appendChild(tr)});offset=x.next_offset;e('bar').max=x.total||1;e('bar').value=offset;e('meta').textContent=offset+' / '+x.total+'語';e('technical').textContent=JSON.stringify({site_id:site,period:x.period,limitations:x.limitations},null,2);if(offset>=x.total){active=false;e('status').textContent='分析完了。記事は変更していません。';e('start').disabled=false;e('stop').disabled=true;e('handoff').hidden=false;return}step()}).withFailureHandler(err=>fail(String(err&&err.message||err))).sssM3StrategyBatchPilot(offset)}</script></html>`).setWidth(850).setHeight(680);
 SpreadsheetApp.getUi().showModalDialog(html,'検索戦略をまとめて分析（試験）');
}


// M3 strategic review handoff: deterministic, read-only Claude request.
// All user-interface inputs are untrusted; enforce a bounded schema and HOLD.
function sssM3StrategyHandoffBuild_(payload){
 if(!payload||payload.format!=='S3_M3_STRATEGY_HANDOFF_INPUT_V1'||typeof payload.site_id!=='string'||!/^[-a-zA-Z0-9_]{6,100}$/.test(payload.site_id)||!payload.period||!/^\d{4}-\d{2}-\d{2}$/.test(payload.period.start)||!/^\d{4}-\d{2}-\d{2}$/.test(payload.period.end)||payload.period.start>payload.period.end||!Array.isArray(payload.results)||payload.results.length<1||payload.results.length>10)throw Error('精査依頼の入力形式が不正です。');
 const validCategories=new Set(['ROLE_REVIEW','EVIDENCE_REVIEW','EXISTING_ARTICLE_REVIEW','OPPORTUNITY_RESEARCH']);
 const seen=new Set();const rows=payload.results.map(r=>{
  const query=String(r.query||'').trim(),key=query.normalize('NFKC').toLowerCase();
  if(!query||query.length>500||seen.has(key)||!validCategories.has(r.category)||r.publication_gate!=='HOLD'||r.content_action!=='NONE'||!Array.isArray(r.article_ids)||r.article_ids.length>100||!Number.isSafeInteger(r.impressions)||r.impressions<0||!Number.isSafeInteger(r.clicks)||r.clicks<0||r.clicks>r.impressions||!Number.isSafeInteger(r.observed_pages)||r.observed_pages<0||r.observed_pages>100)throw Error('検索語の根拠・保留ゲートが不正です。');
  seen.add(key);const ids=[...new Set(r.article_ids)];if(ids.length!==r.article_ids.length||ids.some(id=>typeof id!=='string'||!/^A\d{6}$/.test(id)))throw Error('記事IDの形式・重複が不正です。');
  if(!['string','undefined'].includes(typeof r.reason)||String(r.reason||'').length>500)throw Error('確認理由が不正です。');
  return {query,impressions:r.impressions,clicks:r.clicks,observed_pages:r.observed_pages,article_ids:ids,category:r.category,reason:String(r.reason||'')};
 });
 const envelope={format:'S3_M3_STRATEGY_CLAUDE_REVIEW_V1',site_id:payload.site_id,period:{start:payload.period.start,end:payload.period.end},source:'LIVE_GSC_EXACT_QUERY_PAGES_TOP100_PER_QUERY',status:'PROVISIONAL',publication_gate:'HOLD',content_action:'NONE',queries:rows,limitations:['GSC再取得値は保存済みEvidenceと同一とは限らない','検索語はサイト上位最大10語であり全検索語ではない','検索語別ページは上位100件まで、欠落は需要ゼロを意味しない','同一検索語で複数記事が観測されてもカニバリゼーションは未確定','タイトル・本文・SERP・検索意図の確認はこのデータに含まれない','SBMで処理中の記事への重複依頼は禁止']};
 const instruction=[
  'あなたはS3の検索戦略精査担当です。以下の観測データのみを確定事実として扱い、検索意図・SERP・記事本文を未確認なら推測で補完しないでください。',
  '【目的】検索語ごとに既存記事の役割確認、競合疑義、追加調査、新記事企画の可能性を整理してください。自動で記事改善・統合・削除・noindex・公開を決定しないでください。',
  '【重要】記事IDは観測対象であり、記事本文やSBM作業状態を検証した証拠ではありません。未取得の検索語やページを「存在しない」と断定しないでください。',
  '【回答形式】JSONのみ。{ "format":"S3_M3_STRATEGY_CLAUDE_RESPONSE_V1", "site_id":"...", "publication_gate":"HOLD", "content_action":"NONE", "reviews":[{"query":"...","assessment":"EXISTING_REVIEW|ROLE_REVIEW|NEW_ARTICLE_RESEARCH|EVIDENCE_NEEDED","confidence":"PROVISIONAL|UNCONFIRMED","observed_article_ids":["A000001"],"reason":"根拠と未確認事項","next_evidence":["確認事項"]}] }',
  '各検索語につき1件のreviewsを返し、site_idとqueryと記事IDは入力から変更しないでください。未確認のSERP順位・検索ボリューム・本文内容・体験談を捏造しないでください。',
  '【観測データ】',JSON.stringify(envelope,null,2)
 ];
 return {format:'S3_M3_STRATEGY_HANDOFF_V1',status:'READY',site_id:payload.site_id,query_count:rows.length,publication_gate:'HOLD',content_action:'NONE',prompt:instruction.join('\n\n')};
}


// Verify a pasted Claude JSON response against the exact observed handoff.
// This is an advisory review only, never an execution authorization.
function sssM3StrategyHandoffValidate_(payload,answerText){
 const handoff=sssM3StrategyHandoffBuild_(payload);
 if(typeof answerText!=='string'||answerText.length>60000)throw Error('Claude回答が空または大きすぎます。');
 let a;try{a=JSON.parse(answerText.trim());}catch(e){throw Error('Claude回答はJSON形式で貼り付けてください。');}
 if(!a||a.format!=='S3_M3_STRATEGY_CLAUDE_RESPONSE_V1'||a.site_id!==handoff.site_id||a.publication_gate!=='HOLD'||a.content_action!=='NONE'||!Array.isArray(a.reviews)||a.reviews.length!==payload.results.length)throw Error('Claude回答の形式・サイト・保留ゲートが一致しません。');
 const allowed=new Set(['EXISTING_REVIEW','ROLE_REVIEW','NEW_ARTICLE_RESEARCH','EVIDENCE_NEEDED']);
 const expected=new Map(payload.results.map(r=>[r.query,r]));const seen=new Set();const reviews=[];
 for(const r of a.reviews){
  if(!r||typeof r.query!=='string'||!expected.has(r.query)||seen.has(r.query)||!allowed.has(r.assessment)||!['PROVISIONAL','UNCONFIRMED'].includes(r.confidence)||typeof r.reason!=='string'||!r.reason.trim()||r.reason.length>1500||!Array.isArray(r.next_evidence)||r.next_evidence.length>10||r.next_evidence.some(x=>typeof x!=='string'||!x.trim()||x.length>300)||!Array.isArray(r.observed_article_ids))throw Error('Claude回答の検索語・判断項目が不正です。');
  const ids=expected.get(r.query).article_ids;if(r.observed_article_ids.length!==ids.length||r.observed_article_ids.some(x=>!ids.includes(x))||new Set(r.observed_article_ids).size!==ids.length)throw Error('Claude回答が観測記事IDを変更しています。');
  seen.add(r.query);reviews.push({query:r.query,assessment:r.assessment,confidence:r.confidence,reason:r.reason,next_evidence:r.next_evidence,observed_article_ids:ids});
 }
 return {format:'S3_M3_STRATEGY_CLAUDE_VERIFIED_V1',status:'REVIEWED',site_id:handoff.site_id,review_count:reviews.length,reviews,publication_gate:'HOLD',content_action:'NONE',message:'回答形式と観測記事IDを検証しました。SEO判断の正確性は未検証です。'};
}

// v0.1.154: S3-owned, idempotent, advisory-only strategy review ledger.
function sssM3StrategyPriority_(review, observed){
 const n=Array.isArray(review.observed_article_ids)?review.observed_article_ids.length:0;
 const imp=Number(observed&&observed.impressions)||0;
 const base=review.assessment==='ROLE_REVIEW'?30:review.assessment==='EVIDENCE_NEEDED'?25:review.assessment==='EXISTING_REVIEW'?15:10;
 const score=base+Math.min(n,12)*2+Math.min(Math.floor(Math.log10(Math.max(1,imp))*3),18);
 return {score:score,priority:score>=50?'優先確認':score>=35?'通常確認':'経過確認',routing:'EVIDENCE_REVIEW_ONLY'};
}
function sssM3StrategySaveReview(payload,answerText){
 const validated=sssM3StrategyHandoffValidate_(payload,answerText);
 const cfg=sssConfig_();
 if(cfg.siteId!==validated.site_id)throw Error('現在の登録サイトと精査対象サイトが異なります。');
 if(!payload.period||payload.period.start>payload.period.end)throw Error('対象期間が不正です。');
 const ss=SpreadsheetApp.getActiveSpreadsheet();if(!ss)throw Error('S3のスプレッドシートが見つかりません。');
 const lock=LockService.getDocumentLock()||LockService.getScriptLock();
 if(!lock.tryLock(10000))throw Error('別の保存処理が進行中です。時間をおいて再試行してください。');
 try{
  const name='S3_検索戦略精査';
  const headers=['保存日時','サイトID','期間開始','期間終了','検索語','判定','確信度','優先度','参考点','観測記事ID','理由','追加確認事項','根拠表示回数','根拠クリック数','保存キー','処置状態'];
  let sh=ss.getSheetByName(name);
  if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);}
  else if(sh.getLastColumn()<headers.length||sh.getRange(1,1,1,headers.length).getValues()[0].some((v,i)=>v!==headers[i]))throw Error('S3の保存シートの列構成が異なります。自動上書きしません。');
  const canonical=JSON.stringify({site_id:validated.site_id,period:payload.period,reviews:validated.reviews});
  const hash=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,canonical).map(x=>('0'+(x&255).toString(16)).slice(-2)).join('');
  const key='S3STRAT_'+hash;
  const last=sh.getLastRow();
  if(last>1&&sh.getRange(2,15,last-1,1).getValues().some(r=>r[0]===key))return {status:'ALREADY_SAVED',count:validated.review_count,publication_gate:'HOLD',content_action:'NONE'};
  const byQuery=new Map(payload.results.map(r=>[r.query,r]));
  const now=new Date();
  const rows=validated.reviews.map(r=>{
   const observed=byQuery.get(r.query);const p=sssM3StrategyPriority_(r,observed);
   return [now,validated.site_id,payload.period.start,payload.period.end,r.query,r.assessment,r.confidence,p.priority,p.score,r.observed_article_ids.join(', '),r.reason,r.next_evidence.join(' / '),Number(observed.impressions)||0,Number(observed.clicks)||0,key,'追加調査待ち'];
  });
  sh.getRange(last+1,1,rows.length,headers.length).setValues(rows);
  return {status:'SAVED',count:rows.length,publication_gate:'HOLD',content_action:'NONE'};
 }finally{lock.releaseLock();}
}


// v0.1.155: read-only routing preflight. The S3 inventory is a snapshot,
// never proof of the current SBM state. No referrals are issued here.
function sssM3StrategyRoutingAnalyze_(ledger, inventory, siteId){
 if(!Array.isArray(ledger)||ledger.length>10000||!Array.isArray(inventory)||inventory.length>10001||!siteId)throw Error('照合データの形式が不正です。');
 const byId=new Map(),duplicates=new Set();
 for(const r of inventory){
  if(!r||r[1]!==siteId||!/^A\d{6}$/.test(String(r[2]||'')))continue;
  const id=r[2];if(byId.has(id))duplicates.add(id);else byId.set(id,{state:String(r[5]||'').trim(),title:String(r[4]||'')});
 }
 const byQuery=new Map();
 for(const r of ledger){
  if(!r||r[1]!==siteId)continue;
  const query=String(r[4]||'').trim(),assessment=String(r[5]||''),ids=String(r[9]||'').split(',').map(x=>x.trim()).filter(Boolean);
  if(!query||!['ROLE_REVIEW','EXISTING_REVIEW','EVIDENCE_NEEDED','NEW_ARTICLE_RESEARCH'].includes(assessment)||ids.some(id=>!/^A\d{6}$/.test(id))||r[15]!=='追加調査待ち')continue;
  const period=String(r[2]||'')+' / '+String(r[3]||'');
  const key=period+'|'+query;
  // Prefer the latest saved record for the same query and period.
  const states=ids.map(id=>({id,state:duplicates.has(id)?'台帳重複':byId.has(id)?byId.get(id).state:'台帳未照合'}));
  const blocked=states.filter(x=>!['未着手','完了'].includes(x.state));
  const status=!ids.length?'記事未確認':blocked.length?'SBM状態の再確認が必要':'SBM最新状態の確認待ち';
  byQuery.set(key,{query,period,assessment,priority:String(r[7]||''),article_ids:ids,states,status,action:'EVIDENCE_REVIEW_ONLY'});
 }
 const items=[...byQuery.values()].sort((a,b)=>({優先確認:0,通常確認:1,経過確認:2}[a.priority]??3)-({優先確認:0,通常確認:1,経過確認:2}[b.priority]??3));
 return {format:'S3_M3_STRATEGY_ROUTING_PREFLIGHT_V1',status:'PROVISIONAL',site_id:siteId,count:items.length,items:items.slice(0,100),truncated:items.length>100,publication_gate:'HOLD',content_action:'NONE',limitations:['記事状態はS3に保存したSBM台帳の取得時点の情報であり最新状態を保証しません','SBMで処理中・モニター中・再診中の記事への紹介状は発行しません','この結果は追加調査の候補であり改善・新記事・統合を決定しません']};
}
function sssM3StrategyRoutingPreview(){
 const c=sssConfig_(),ss=SpreadsheetApp.getActiveSpreadsheet(),sh=ss.getSheetByName('S3_検索戦略精査');
 if(!sh||sh.getLastRow()<2)return {status:'BLOCKED',reason:'保存済みの検索戦略精査がありません。先にClaude回答を検証して保存してください。'};
 const batch=sssM3BatchStatus();if(batch.status!=='COMPLETED')return {status:'BLOCKED',reason:'記事台帳の取得が完了していません。'};
 const inv=ss.getSheetByName(SSS_M3_BATCH_SHEET_);
 if(!inv||inv.getLastRow()!==batch.processed+1||batch.processed>5000)throw Error('記事台帳の整合性が確認できません。');
 const head=inv.getRange(1,1,1,9).getDisplayValues()[0];if(head.some((v,i)=>v!==SSS_M3_BATCH_HEADERS_[i]))throw Error('記事台帳の列構成が不正です。');
 const rows=inv.getRange(2,1,batch.processed,9).getDisplayValues();
 if(rows.some(r=>r[0]!==batch.run_id||r[1]!==c.siteId))throw Error('記事台帳のサイト・実行IDが一致しません。');
 const expected=['保存日時','サイトID','期間開始','期間終了','検索語','判定','確信度','優先度','参考点','観測記事ID','理由','追加確認事項','根拠表示回数','根拠クリック数','保存キー','処置状態'];
 if(sh.getLastColumn()<16||sh.getRange(1,1,1,16).getDisplayValues()[0].some((v,i)=>v!==expected[i]))throw Error('検索戦略精査シートの列構成が不正です。');
 const ledger=sh.getRange(2,1,Math.min(sh.getLastRow()-1,10000),16).getDisplayValues();
 const result=sssM3StrategyRoutingAnalyze_(ledger,rows,c.siteId);result.inventory_run_id=batch.run_id;result.inventory_snapshot='SBM台帳取得時点';return result;
}
// v0.1.156: independently re-read the connected SBM at review time.
// This is a live read-only preflight, not a lock on SBM or permission to issue a referral.
function sssM3StrategyLiveStates_(siteId, candidateIds, managerRows){
 if(!siteId||!Array.isArray(candidateIds)||candidateIds.length>1000||!Array.isArray(managerRows)||managerRows.length>10001)throw Error('SBM最新状態の照合範囲が不正です。');
 const targets=new Set(candidateIds);
 if([...targets].some(id=>!/^A\d{6}$/.test(id)))throw Error('対象記事IDが不正です。');
 const states=new Map(),duplicates=new Set();
 for(const row of managerRows){
  const id=String(row.article_id||'').trim();if(!targets.has(id))continue;
  if(states.has(id))duplicates.add(id);
  else states.set(id,String(row.state||'').trim());
 }
 return Object.fromEntries([...targets].map(id=>[id,duplicates.has(id)?'台帳重複':states.has(id)?states.get(id):'SBM未照合']));
}
function sssM3StrategyLiveApply_(result, live, checkedAt){
 if(!result||result.format!=='S3_M3_STRATEGY_ROUTING_PREFLIGHT_V1'||!live||typeof live!=='object')throw Error('照合結果が不正です。');
 const items=result.items.map(item=>{
  const states=item.article_ids.map(id=>({id,state:Object.prototype.hasOwnProperty.call(live,id)?live[id]:'SBM未照合'}));
  const blocking=states.filter(s=>!['未着手','完了'].includes(s.state));
  const researchStatus=!states.length?'観測記事なし（調査保留）':'読み取り専用調査可（処置は保留）';
  return Object.assign({},item,{states,status:researchStatus,action:'EVIDENCE_REVIEW_ONLY',treatment_blocked:blocking.length>0||!states.length,blocked_article_ids:blocking.map(x=>x.id)});
 });
 return Object.assign({},result,{items,live_checked_at:checkedAt,inventory_snapshot:'参考情報のみ',limitations:['表示状態は確認時に接続先SBMから読み取ったものです。直後に変更される可能性があります','紹介状発行時にはSBMの最新状態を再検証してください','SBMで処理中・不明・重複・未照合でも読み取り専用の追加調査のみ可能です。改善・統合・新記事・紹介状は保留します']});
}
function sssM3StrategyRoutingLivePreview(){
 const c=sssConfig_(),base=sssM3StrategyRoutingPreview();
 if(!base||base.status!=='PROVISIONAL')return base;
 const connection=sssM1FindManagers_();
 if(!connection.complete||connection.candidates.length!==1)throw Error('SBM連携先を一意に確認できません。安全停止しました。');
 const managerId=connection.candidates[0].id;
 sssCheckManagerIdentityForSetup_(managerId,c);
 const sh=SpreadsheetApp.openById(managerId).getSheetByName('記事管理');
 if(!sh||sh.getLastRow()<1||sh.getLastRow()>10001)throw Error('SBM記事台帳の行数が不正です。');
 const values=sh.getRange(1,1,sh.getLastRow(),sh.getLastColumn()).getDisplayValues();
 const articles=sssM1Articles_(values);
 const ids=[...new Set(base.items.flatMap(x=>x.article_ids))];
 const live=sssM3StrategyLiveStates_(c.siteId,ids,articles);
 const out=sssM3StrategyLiveApply_(base,live,new Date().toISOString());
 out.sbm_manager_id=managerId;
 out.research_plan=sssM3StrategyResearchPlan_(out,5);
 out.research_prompt=sssM3StrategyResearchPrompt_(out.research_plan);
 return out;
}

// v0.1.157: build an evidence-only, bounded shortlist from the *live* SBM guard.
// A prior saved review is not a diagnosis, and no item may authorize a referral.
function sssM3StrategyResearchPlan_(liveResult, maxItems){
 if(!liveResult||liveResult.format!=='S3_M3_STRATEGY_ROUTING_PREFLIGHT_V1'||liveResult.status!=='PROVISIONAL'||!liveResult.live_checked_at||liveResult.publication_gate!=='HOLD'||liveResult.content_action!=='NONE')throw Error('SBM最新照合済みの結果が必要です。');
 const limit=Number(maxItems)||5;if(!Number.isInteger(limit)||limit<1||limit>10)throw Error('調査件数の上限が不正です。');
 if(!Array.isArray(liveResult.items)||liveResult.items.length>100)throw Error('候補件数が不正です。');
 const seen=new Set(),eligible=[],held=[];
 for(const item of liveResult.items){
  if(!item||typeof item.query!=='string'||!item.query.trim()||seen.has(item.query))continue;
  seen.add(item.query);
  const ids=item.article_ids||[],states=item.states||[];
  const consistent=Array.isArray(ids)&&Array.isArray(states)&&ids.length===states.length&&ids.every((id,i)=>/^A\d{6}$/.test(id)&&states[i]&&states[i].id===id);
  const researchable=consistent&&ids.length>0;
  const blocked=states.filter(x=>!['未着手','完了'].includes(x.state)).map(x=>x.id);
  const permitted=['ROLE_REVIEW','EXISTING_REVIEW','EVIDENCE_NEEDED','NEW_ARTICLE_RESEARCH'].includes(item.assessment);
  const record={query:item.query,assessment:item.assessment,priority:item.priority,observed_article_ids:ids.slice(),sbm_states:states.map(x=>({id:x.id,state:x.state})),next_step:'READ_ONLY_SEARCH_INTENT_AND_ARTICLE_EVIDENCE_REVIEW',treatment_blocked:true,blocked_article_ids:blocked,decision:'HOLD'};
  if(researchable&&permitted&&item.action==='EVIDENCE_REVIEW_ONLY')eligible.push(record);
  else held.push({query:item.query,reason:!consistent?'記事IDと状態の照合不整合':!ids.length?'観測記事がありません':'確認区分が未承認'});
 }
 const rank={'優先確認':0,'通常確認':1,'経過確認':2};
 eligible.sort((a,b)=>(rank[a.priority]??3)-(rank[b.priority]??3));
 const selected=eligible.slice(0,limit);
 return {format:'S3_M3_STRATEGY_RESEARCH_PLAN_V1',site_id:liveResult.site_id,checked_at:liveResult.live_checked_at,selected,eligible_count:eligible.length,held_count:held.length,held:held.slice(0,20),truncated:eligible.length>limit,publication_gate:'HOLD',content_action:'NONE',limitations:['SBM状態は照合時点の値であり、その後変更される可能性があります。処理中の記事も読み取り専用の調査のみ対象とします','検索意図・SERP・記事本文は未確認です','追加調査専用であり改善・統合・新記事・紹介状の決定ではありません']};
}
function sssM3StrategyResearchPrompt_(plan){
 if(!plan||plan.format!=='S3_M3_STRATEGY_RESEARCH_PLAN_V1'||plan.publication_gate!=='HOLD'||plan.content_action!=='NONE'||!Array.isArray(plan.selected)||plan.selected.length>10)throw Error('調査計画の安全条件が不正です。');
 const data={format:plan.format,site_id:plan.site_id,checked_at:plan.checked_at,selected:plan.selected,limitations:plan.limitations,publication_gate:'HOLD',content_action:'NONE'};
 return ['あなたはS3の検索戦略追加調査担当です。以下の観測情報のみを確定事実とし、検索意図・SERP・本文・検索順位・SBMの現在状態を推測で補わないでください。','検索語ごとに、記事の役割を検証するために必要な追加根拠と確認順序を提案してください。根拠が足りない場合は保留してください。','記事改善・統合・削除・noindex・新記事・紹介状・公開の決定は禁止します。SBM作業状態は確認時点の参考情報であり、処置直前に再確認が必要です。','回答はJSONのみ。format=S3_M3_STRATEGY_RESEARCH_RESPONSE_V1、site_id、publication_gate=HOLD、content_action=NONE、reviews配列（query、observed_article_ids、evidence_needed配列、reason、decision=HOLD）を含め、検索語と記事IDを改変しないでください。','【追加調査対象（S3の確認時点）】',JSON.stringify(data,null,2)].join('\n\n');
}
function sssM3StrategyRoutingDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;color:#202124;padding:20px;line-height:1.6}button{padding:10px 16px;background:#1765ad;color:#fff;border:0;border-radius:5px;cursor:pointer}button:disabled{opacity:.5}table{width:100%;border-collapse:collapse;table-layout:auto}#rows td:nth-child(3){min-width:230px;font-size:12px;line-height:1.5}#rows td:nth-child(4){min-width:125px}#rows td:first-child{min-width:150px}td,th{padding:9px;border-bottom:1px solid #ddd;text-align:left;overflow-wrap:anywhere}th:first-child{width:24%}th:nth-child(2){width:18%}footer{margin-top:20px;border-top:1px solid #ddd;padding-top:12px}footer button{background:white;color:#222;border:1px solid #bbb}</style><h3>保存済み検索戦略とSBM状態を照合</h3><p>保存した精査結果と接続先SBMの現在の作業状態を読み取り専用で照合します。改善・統合・紹介状発行は行いません。</p><button id="run" onclick="run()">保存済み候補を確認</button><p id="status" role="status">開始待ち</p><table><thead><tr><th>検索語</th><th>優先度・判定</th><th>観測記事と台帳状態</th><th>次の対応</th></tr></thead><tbody id="rows"></tbody></table><p id="note"></p><section id="research" hidden><h4>追加調査の候補（最大5件）</h4><p>SBMで処理中の記事も読み取り専用の追加調査は可能です。改善・統合・新記事・紹介状発行は全件保留します。検索意図・本文・SERPは未確認です。</p><div id="researchSummary"></div><button id="buildResearch" onclick="buildResearch()">Claude追加調査依頼文を作成</button> <button id="copyResearch" onclick="copyResearch()" disabled>依頼文をコピー</button><p id="researchStatus" role="status"></p><textarea id="researchPrompt" readonly style="box-sizing:border-box;width:100%;height:200px;resize:vertical"></textarea><h4>Claude追加調査回答の確認</h4><p>JSON回答を貼り付けると画面内で形式と対象記事を照合します。検証後も記事処置は行いません。</p><textarea id="researchAnswer" style="box-sizing:border-box;width:100%;height:160px;resize:vertical" placeholder="ClaudeのJSON回答を貼り付け"></textarea><div><button id="verifyResearch" onclick="verifyResearch()">追加調査回答を検証</button> <span id="researchVerifyStatus" role="status" aria-live="polite"></span> <button id="saveResearch" onclick="saveResearch()" disabled>検証結果をS3に保存</button></div><pre id="researchVerified" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre></section><footer><button onclick="google.script.host.close()">閉じる</button></footer><script>const e=id=>document.getElementById(id);let lastPlan=null;let researchVerified=false;function verifyResearch(){researchVerified=false;e('saveResearch').disabled=true;const status=e('researchVerifyStatus');e('researchVerified').textContent='';try{if(!lastPlan||!lastPlan.plan)throw Error('SBM照合からやり直してください。');const plan=lastPlan.plan;const raw=e('researchAnswer').value.trim();if(!raw||raw.length>150000)throw Error('回答が空、または長すぎます。');const x=JSON.parse(raw);if(!x||x.format!=='S3_M3_STRATEGY_RESEARCH_RESPONSE_V1'||x.site_id!==plan.site_id||x.publication_gate!=='HOLD'||x.content_action!=='NONE'||!Array.isArray(x.reviews)||x.reviews.length!==plan.selected.length)throw Error('形式・サイト・安全条件・件数が一致しません。');const expected=new Map(plan.selected.map(r=>[r.query,r]));if(expected.size!==plan.selected.length)throw Error('検索語が重複しています。');const seen=new Set();for(const r of x.reviews){if(!r||!expected.has(r.query)||seen.has(r.query)||r.decision!=='HOLD'||!Array.isArray(r.observed_article_ids)||!Array.isArray(r.evidence_needed)||r.evidence_needed.length<1||r.evidence_needed.length>20||r.evidence_needed.some(v=>typeof v!=='string'||!v.trim()||v.length>500)||typeof r.reason!=='string'||!r.reason.trim()||r.reason.length>2000)throw Error('検索語・追加根拠・保留判定が不正です。');const ids=expected.get(r.query).observed_article_ids;if(ids.length!==r.observed_article_ids.length||ids.some((v,i)=>v!==r.observed_article_ids[i]))throw Error('記事IDが一致しません。');seen.add(r.query)}status.textContent='形式検証完了（'+x.reviews.length+'件）。すべて追加調査待ちです。';researchVerified=true;e('saveResearch').disabled=false;e('researchVerified').textContent=x.reviews.map(r=>r.query+'：'+r.evidence_needed.join('／')).join('\\n')}catch(err){status.textContent='安全停止：'+String(err&&err.message||err)}}function saveResearch(){if(!researchVerified||!lastPlan||!lastPlan.plan)return;const b=e('saveResearch');b.disabled=true;e('researchVerifyStatus').textContent='SBMを再照合してS3に保存しています…';google.script.run.withSuccessHandler(x=>{e('researchVerifyStatus').textContent=x.status==='SAVED'?'S3に保存しました（'+x.count+'件）':x.status==='ALREADY_SAVED'?'同じ調査結果は保存済みです。':'保存結果を確認してください。';}).withFailureHandler(err=>{e('researchVerifyStatus').textContent='安全停止：'+String(err&&err.message||err);b.disabled=false;}).sssM3ResearchSave(lastPlan.plan,e('researchAnswer').value.trim())}function buildResearch(){if(!lastPlan)return;e('researchPrompt').value=lastPlan.prompt;e('copyResearch').disabled=false;e('researchStatus').textContent='追加調査依頼文を作成しました。'}function copyResearch(){const t=e('researchPrompt');t.focus();t.select();const ok=document.execCommand('copy');e('researchStatus').textContent=ok?'コピーしました！':'コピーできません。Ctrl+Cでコピーしてください。'}function run(){researchVerified=false;e('saveResearch').disabled=true;lastPlan=null;e('research').hidden=true;e('run').disabled=true;e('status').textContent='保存済みデータを照合しています…';google.script.run.withSuccessHandler(x=>{e('run').disabled=false;if(!x||x.status!=='PROVISIONAL'){e('status').textContent='安全停止：'+(x&&x.reason||'結果を確認できません');return}e('status').textContent='SBM照合完了：'+x.count+'件（記事変更なし）';e('note').textContent=x.limitations.join('／');if(x.research_plan&&x.research_plan.format==='S3_M3_STRATEGY_RESEARCH_PLAN_V1'&&x.research_plan.publication_gate==='HOLD'&&x.research_plan.content_action==='NONE'){lastPlan={prompt:x.research_prompt,plan:x.research_plan};e('research').hidden=false;e('researchAnswer').value='';e('researchVerifyStatus').textContent='';e('researchVerified').textContent='';e('researchSummary').textContent='読み取り専用の追加調査候補 '+x.research_plan.selected.length+'件／調査対象外 '+x.research_plan.held_count+'件。処置は全件保留。';e('researchPrompt').value='';e('copyResearch').disabled=true;}const b=e('rows');b.replaceChildren();x.items.forEach(r=>{const tr=document.createElement('tr');[r.query,r.priority+'／'+r.assessment,r.states.map(s=>s.id+'：'+s.state).join('、')||'観測記事なし',r.status].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});b.appendChild(tr)})}).withFailureHandler(err=>{e('run').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3StrategyRoutingLivePreview()}</script></html>`).setWidth(900).setHeight(650);
 SpreadsheetApp.getUi().showModalDialog(html,'保存済み検索戦略の照合（試験）');
}


// v0.1.158: strict evidence-only research response acceptance. Never a treatment decision.
function sssM3StrategyResearchValidate_(plan, answerText){
 if(!plan||plan.format!=='S3_M3_STRATEGY_RESEARCH_PLAN_V1'||plan.publication_gate!=='HOLD'||plan.content_action!=='NONE'||!Array.isArray(plan.selected)||plan.selected.length>10)throw Error('調査計画の安全条件が不正です。');
 if(typeof answerText!=='string'||!answerText.trim()||answerText.length>150000)throw Error('Claude回答の文字数が不正です。');
 let x;try{x=JSON.parse(answerText.trim())}catch(e){throw Error('Claude回答はJSONのみで貼り付けてください。')}
 if(!x||x.format!=='S3_M3_STRATEGY_RESEARCH_RESPONSE_V1'||x.site_id!==plan.site_id||x.publication_gate!=='HOLD'||x.content_action!=='NONE'||!Array.isArray(x.reviews)||x.reviews.length!==plan.selected.length)throw Error('回答形式・サイト・安全条件・件数が一致しません。');
 const expected=new Map(plan.selected.map(r=>[r.query,r]));if(expected.size!==plan.selected.length)throw Error('調査対象の検索語が重複しています。');
 const seen=new Set();const reviews=[];
 for(const r of x.reviews){
  if(!r||typeof r.query!=='string'||!expected.has(r.query)||seen.has(r.query)||r.decision!=='HOLD'||!Array.isArray(r.observed_article_ids)||!Array.isArray(r.evidence_needed)||r.evidence_needed.length<1||r.evidence_needed.length>20||r.evidence_needed.some(v=>typeof v!=='string'||!v.trim()||v.length>500)||typeof r.reason!=='string'||!r.reason.trim()||r.reason.length>2000)throw Error('検索語・保留判定・追加確認事項が不正です。');
  const ids=expected.get(r.query).observed_article_ids;
  if(r.observed_article_ids.length!==ids.length||r.observed_article_ids.some((v,i)=>v!==ids[i]))throw Error('観測記事IDが調査計画と一致しません。');
  seen.add(r.query);reviews.push({query:r.query,observed_article_ids:ids.slice(),evidence_needed:r.evidence_needed.slice(),reason:r.reason,decision:'HOLD'});
 }
 return {format:'S3_M3_STRATEGY_RESEARCH_VALIDATED_V1',site_id:plan.site_id,checked_at:plan.checked_at,count:reviews.length,reviews,publication_gate:'HOLD',content_action:'NONE',status:'VALIDATED_EVIDENCE_ONLY'};
}


// v0.1.160: S3-only research evidence ledger. No SBM writes or treatment.
function sssM3ResearchSave_(plan,answerText,livePlan){
 const verified=sssM3StrategyResearchValidate_(plan,answerText);
 const cfg=sssConfig_();
 if(verified.site_id!==cfg.siteId)throw Error('現在のサイトと追加調査対象が一致しません。');
 if(!livePlan||livePlan.format!=='S3_M3_STRATEGY_RESEARCH_PLAN_V1'||livePlan.site_id!==plan.site_id||livePlan.publication_gate!=='HOLD'||livePlan.content_action!=='NONE'||!Array.isArray(livePlan.selected))throw Error('SBM再照合の結果が不正です。');
 // Compare semantic values, not JSON serialization of client-supplied objects.
 // HtmlService RPC may preserve extra properties or normalize undefined fields.
 const changes=[];
 const original=plan.selected, current=livePlan.selected;
 if(original.length!==current.length)changes.push('候補件数：'+original.length+' → '+current.length);
 for(let i=0;i<original.length;i++){
  const a=original[i],b=current[i];
  if(!a||!b||a.query!==b.query){changes.push('検索語の一致を確認できません（'+(a&&a.query||i)+'）');continue;}
  if(!Array.isArray(a.observed_article_ids)||!Array.isArray(b.observed_article_ids)||!Array.isArray(a.sbm_states)||!Array.isArray(b.sbm_states)){
   changes.push(a.query+'：記事または状態の配列が不正');continue;
  }
  if(a.observed_article_ids.length!==b.observed_article_ids.length||a.sbm_states.length!==a.observed_article_ids.length||b.sbm_states.length!==b.observed_article_ids.length){
   changes.push(a.query+'：記事数・状態数が不一致');continue;
  }
  for(let j=0;j<a.observed_article_ids.length;j++){
   const id=a.observed_article_ids[j], liveId=b.observed_article_ids[j];
   const before=a.sbm_states[j],after=b.sbm_states[j];
   if(id!==liveId||!before||!after||before.id!==id||after.id!==id){changes.push(a.query+'：記事IDの一致を確認できません（'+id+'）');continue;}
   if(typeof before.state!=='string'||typeof after.state!=='string'||before.state!==after.state)changes.push(id+'：'+String(before.state)+' → '+String(after.state));
  }
 }
 if(changes.length)throw Error('SBM記事状態または調査対象が変更されました（'+changes.slice(0,6).join('、')+'）。保存せず停止しました。再照合してください。');
 const canonical=p=>JSON.stringify(p.selected.map(x=>[x.query,x.observed_article_ids,x.sbm_states.map(y=>[y.id,y.state])]));
 const ss=SpreadsheetApp.getActiveSpreadsheet();if(!ss)throw Error('S3のシートが見つかりません。');
 const lock=LockService.getDocumentLock()||LockService.getScriptLock();
 if(!lock.tryLock(10000))throw Error('別の保存処理が実行中です。');
 try{
  const name='S3_追加調査記録';
  const headers=['保存日時','サイトID','SBM確認日時','検索語','観測記事ID','追加確認事項','保留理由','判定','保存キー'];
  let sh=ss.getSheetByName(name);
  if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);}
  else if(sh.getLastColumn()<headers.length||sh.getRange(1,1,1,headers.length).getValues()[0].some((v,i)=>v!==headers[i]))throw Error('追加調査記録の列構成が一致しません。上書きしません。');
  const digest=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify({site:verified.site_id,plan:canonical(plan),reviews:verified.reviews}));
  const key='S3RESEARCH_'+digest.map(x=>('0'+(x&255).toString(16)).slice(-2)).join('');
  const last=sh.getLastRow();
  if(last>1&&sh.getRange(2,9,last-1,1).getValues().some(r=>r[0]===key))return {status:'ALREADY_SAVED',count:verified.count,publication_gate:'HOLD',content_action:'NONE'};
  const now=new Date();const rows=verified.reviews.map(r=>[now,verified.site_id,livePlan.checked_at,r.query,r.observed_article_ids.join(', '),r.evidence_needed.join(' / '),r.reason,'追加根拠待ち',key]);
  if(rows.length)sh.getRange(last+1,1,rows.length,headers.length).setValues(rows);
  return {status:'SAVED',count:rows.length,publication_gate:'HOLD',content_action:'NONE'};
 }finally{lock.releaseLock();}
}
// v0.1.163: recheck the *selected articles*, not a rebuilt and possibly reordered shortlist.
// The research shortlist is a snapshot; only the live SBM article states are mutable.
function sssM3ResearchRecheck_(plan){
 if(!plan||plan.format!=='S3_M3_STRATEGY_RESEARCH_PLAN_V1'||!Array.isArray(plan.selected)||plan.selected.length<1||plan.selected.length>10||plan.publication_gate!=='HOLD'||plan.content_action!=='NONE')throw Error('追加調査計画の安全条件が不正です。');
 const cfg=sssConfig_();if(plan.site_id!==cfg.siteId)throw Error('対象サイトが一致しません。');
 const connection=sssM1FindManagers_();
 if(!connection.complete||connection.candidates.length!==1)throw Error('SBM連携先を一意に確認できません。');
 const managerId=connection.candidates[0].id;
 sssCheckManagerIdentityForSetup_(managerId,cfg);
 const sh=SpreadsheetApp.openById(managerId).getSheetByName('記事管理');
 if(!sh||sh.getLastRow()<1||sh.getLastRow()>10001)throw Error('SBM記事台帳の行数が不正です。');
 const articles=sssM1Articles_(sh.getRange(1,1,sh.getLastRow(),sh.getLastColumn()).getDisplayValues());
 const ids=[...new Set(plan.selected.flatMap(x=>x.observed_article_ids))];
 const live=sssM3StrategyLiveStates_(cfg.siteId,ids,articles);
 const selected=plan.selected.map(x=>Object.assign({},x,{sbm_states:x.observed_article_ids.map(id=>({id,state:live[id]}))}));
 return Object.assign({},plan,{selected,checked_at:new Date().toISOString()});
}
function sssM3ResearchSave(plan,answerText){
 // Verify the answer first; never write until the live SBM guard passes.
 sssM3StrategyResearchValidate_(plan,answerText);
 const livePlan=sssM3ResearchRecheck_(plan);
 return sssM3ResearchSave_(plan,answerText,livePlan);
}



// v0.1.164: Read-only, bounded evidence acquisition. A research plan is NOT a treatment authorization.
// One exact query per RPC to stay within Apps Script quotas. No writes to SBM, Evidence, or articles.
function sssM3ResearchEvidenceCandidates(){
 const c=sssConfig_(),ss=SpreadsheetApp.getActiveSpreadsheet(),sh=ss&&ss.getSheetByName('S3_追加調査記録');
 if(!sh||sh.getLastRow()<2)return {status:'BLOCKED',reason:'保存済みの追加調査回答がありません。',queries:[]};
 const expected=['保存日時','サイトID','SBM確認日時','検索語','観測記事ID','追加確認事項','保留理由','判定','保存キー'];
 if(sh.getLastColumn()<9||sh.getRange(1,1,1,9).getDisplayValues()[0].some((v,i)=>v!==expected[i]))throw Error('追加調査記録の列構成が一致しません。');
 const count=Math.min(500,sh.getLastRow()-1),rows=sh.getRange(sh.getLastRow()-count+1,1,count,9).getDisplayValues(),seen=new Set(),queries=[];
 for(let i=rows.length-1;i>=0;i--){const r=rows[i];if(r[1]!==c.siteId||r[7]!=='追加根拠待ち')continue;const q=String(r[3]||'').trim();if(!q||q.length>500||seen.has(q))continue;seen.add(q);queries.push({query:q,article_ids:String(r[4]||'').split(/\s*,\s*/).filter(Boolean)});if(queries.length>=20)break;}
 return {status:'PROVISIONAL',site_id:c.siteId,queries,publication_gate:'HOLD',content_action:'NONE',limitations:['保存済み追加調査の最新500行から最大20語を表示','検索意図・記事競合・SERP・本文は未確認']};
}
function sssM3ResearchEvidenceCollect(query){
 const q=String(query||'').trim();if(!q||q.length>500)throw Error('検索語が不正です。');
 const candidates=sssM3ResearchEvidenceCandidates();if(candidates.status!=='PROVISIONAL'||!candidates.queries.some(x=>x.query===q))throw Error('保存済み追加調査の検索語ではありません。');
 const c=sssConfig_(),batch=sssM3BatchStatus();if(batch.status!=='COMPLETED')return {status:'BLOCKED',reason:'S3記事台帳が未完成です。'};
 const ref=sssM1CompactRef_(c),period=sssM3GscPlan_(ref);if(!period.available)return {status:'BLOCKED',reason:period.reason};
 const sh=sssM3BatchSheet_();if(batch.processed>5000||sh.getLastRow()!==batch.processed+1)throw Error('記事台帳の件数が一致しません。');
 const data=sh.getRange(2,1,batch.processed,9).getDisplayValues();if(data.some(r=>r[0]!==batch.run_id||r[1]!==c.siteId))throw Error('記事台帳のサイト・実行IDが一致しません。');
 const articles=data.map(r=>({article_id:r[2],url:r[3],title:r[4]}));
 const response=sdscSearchAnalyticsQuery_(c.propertyUri,{startDate:period.start,endDate:period.end,type:'web',dataState:'final',dimensions:['page'],dimensionFilterGroups:[{groupType:'and',filters:[{dimension:'query',operator:'equals',expression:q}]}],rowLimit:100,startRow:0});
 const result=sssM3QueryDeepDiveAnalyze_(response,articles,c.siteId,{start:period.start,end:period.end},q);
 const requested=candidates.queries.find(x=>x.query===q).article_ids;
 const perArticle=requested.map(id=>{const matching=result.rows.filter(r=>r.article_id===id);return {article_id:id,observed_pages:matching.length,impressions:matching.reduce((a,r)=>a+r.impressions,0),clicks:matching.reduce((a,r)=>a+r.clicks,0),position:matching.length?matching.reduce((a,r)=>a+r.position*r.impressions,0)/Math.max(1,matching.reduce((a,r)=>a+r.impressions,0)):null,coverage:matching.length?'OBSERVED_IN_TOP100':'NOT_OBSERVED_IN_SAMPLE'};});
 return {format:'S3_M3_RESEARCH_EVIDENCE_V1',status:'PROVISIONAL',site_id:c.siteId,query:q,period:result.period,source:result.source,returned:result.returned,truncated_possible:result.truncated_possible,classification:result.classification,requested_article_ids:requested,per_article:perArticle,unmatched_pages:result.unresolved_rows,other_observed_article_ids:result.article_ids.filter(id=>!requested.includes(id)),publication_gate:'HOLD',content_action:'NONE',limitations:['検索語に完全一致するGSCページ上位100件のみ。未観測はゼロ実績を意味しません','掲載順位はページ行の表示回数加重平均による参考値で、検索語全体の順位ではありません','本文・SERP・改善履歴はこの段階では取得していません','GSCの期間と数値は再取得時点のものです']};
}
function sssM3ResearchEvidenceDialog(initialQuery){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:20px;line-height:1.6;color:#202124}button,select{padding:9px;border-radius:5px;border:1px solid #bbb}button{background:#1765ad;color:white;cursor:pointer}button:disabled{opacity:.5}select{width:100%;box-sizing:border-box;margin:12px 0}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:8px;text-align:left}details{margin-top:12px}footer{margin-top:18px;border-top:1px solid #ddd;padding-top:12px}footer button{background:white;color:#333}</style><h3>追加調査の証拠を自動収集（試験）</h3><p>保存済みの調査対象から検索語を選択し、GSCのページ別実績を読み取り専用で取得します。1回につき1検索語、最大100ページです。</p><select id="query" disabled><option>保存済み候補を取得中…</option></select><button id="run" onclick="run(false)" disabled>GSC証拠を取得</button><button type="button" id="fresh" onclick="run(true)" disabled>GSCを再取得</button><p id="status" role="status">開始待ち</p><div id="summary"></div><table><thead><tr><th>記事ID</th><th>表示</th><th>クリック</th><th>観測</th></tr></thead><tbody id="rows"></tbody></table><details><summary>未確認事項・技術情報</summary><pre id="technical" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre></details><p>取得結果は画面表示のみ。記事・SBM・Evidence・S3保存済み調査記録を変更しません。</p><footer><button type="button" onclick="backToOverview()">総合診断へ戻る</button><button onclick="google.script.host.close()">閉じる</button></footer><script>const desiredQuery=${JSON.stringify(String(initialQuery||''))};const e=id=>document.getElementById(id);google.script.run.withSuccessHandler(x=>{if(!x||x.status!=='PROVISIONAL'){e('status').textContent='安全停止：'+(x&&x.reason||'候補なし');return}const sel=e('query');sel.replaceChildren();x.queries.forEach(r=>{const o=document.createElement('option');o.value=r.query;o.textContent=r.query;sel.appendChild(o)});if(desiredQuery&&Array.from(sel.options).some(o=>o.value===desiredQuery))sel.value=desiredQuery;sel.disabled=!x.queries.length;e('run').disabled=!x.queries.length;e('status').textContent='保存済み候補 '+x.queries.length+'件。検索語を選んでください。'}).withFailureHandler(err=>{e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3ResearchEvidenceCandidates();function run(force){e('run').disabled=true;e('status').textContent='GSCを照合しています…';google.script.run.withSuccessHandler(x=>{e('run').disabled=false;if(!x||x.status!=='PROVISIONAL'){e('status').textContent='安全停止：'+(x&&x.reason||'取得不可');return}e('status').textContent='取得完了（読み取り専用）／'+(x.cache_notice||'');e('summary').textContent='期間：'+x.period.start+' ～ '+x.period.end+'／取得ページ：'+x.returned+'件'+(x.truncated_possible?'（100件上限）':'');const b=e('rows');b.replaceChildren();x.per_article.forEach(r=>{const tr=document.createElement('tr');[r.article_id,r.impressions,r.clicks,r.coverage==='OBSERVED_IN_TOP100'?'観測あり':'上位100件に未観測'].forEach(v=>{const td=document.createElement('td');td.textContent=String(v);tr.appendChild(td)});b.appendChild(tr)});e('technical').textContent=JSON.stringify({unmatched_pages:x.unmatched_pages,other_observed_article_ids:x.other_observed_article_ids,limitations:x.limitations},null,2)}).withFailureHandler(err=>{e('run').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3ResearchEvidenceCached(e('query').value,!!force)}function backToOverview(){e('status').textContent='総合診断へ戻ります…';google.script.run.withSuccessHandler(()=>google.script.host.close()).withFailureHandler(err=>e('status').textContent='戻れません：'+String(err&&err.message||err)).sssM3IntegratedDialog()}</script></html>`).setWidth(820).setHeight(650);
 SpreadsheetApp.getUi().showModalDialog(html,'追加調査の証拠を自動収集（試験）');
}



// v0.1.165. Read-only, two equal-ish non-overlapping calendar windows.
// This is a comparison of observed page rows, NOT proof of ranking rotation or improvement causality.
function sssM3TimelinePeriods_(start,end){
 const a=Date.parse(start+'T00:00:00Z'),b=Date.parse(end+'T00:00:00Z');
 if(!Number.isFinite(a)||!Number.isFinite(b)||b<a||b-a>400*86400000)throw Error('比較期間が不正です。');
 const n=Math.floor((b-a)/86400000)+1;if(n<2)throw Error('比較には2日以上必要です。');
 const fmt=t=>new Date(t).toISOString().slice(0,10),first=Math.floor(n/2);
 return [{start,end:fmt(a+(first-1)*86400000)},{start:fmt(a+first*86400000),end}];
}
function sssM3TimelineSummarize_(response,articles,siteId,period,query){
 const x=sssM3QueryDeepDiveAnalyze_(response,articles,siteId,period,query);
 const ids=new Map();
 for(const r of x.rows){if(!r.article_id)continue;const old=ids.get(r.article_id)||{article_id:r.article_id,impressions:0,clicks:0,observed_pages:0};old.impressions+=Number(r.impressions)||0;old.clicks+=Number(r.clicks)||0;old.observed_pages++;ids.set(r.article_id,old);}
 return {period,returned:x.returned,truncated_possible:x.truncated_possible,articles:[...ids.values()],unmatched_pages:x.unresolved_rows};
}
function sssM3ResearchTimelineAnalyze_(first,second,requested){
 const m1=new Map(first.articles.map(r=>[r.article_id,r])),m2=new Map(second.articles.map(r=>[r.article_id,r]));
 return requested.map(id=>{const a=m1.get(id),b=m2.get(id);return {article_id:id,first:a||null,second:b||null,observed_first:!!a,observed_second:!!b,observation_change:!a&&b?'後半のみ観測':a&&!b?'前半のみ観測':a&&b?'両期間で観測':'両期間とも標本未観測'};});
}
function sssM3ResearchHistoryRead_(siteId,articleIds){
 const c=sssConfig_();if(c.siteId!==siteId)throw Error('サイトIDが一致しません。');
 const conn=sssM1FindManagers_();if(!conn.complete||conn.candidates.length!==1)return {status:'UNAVAILABLE',reason:'SBM連携先が一意ではありません。',events:[]};
 const id=conn.candidates[0].id;sssCheckManagerIdentityForSetup_(id,c);
 const sh=SpreadsheetApp.openById(id).getSheetByName('改善履歴');
 if(!sh||sh.getLastRow()<2)return {status:'UNAVAILABLE',reason:'改善履歴シートにデータがありません。',events:[]};
 if(sh.getLastRow()>10001||sh.getLastColumn()>120)throw Error('改善履歴の読み取り範囲が上限を超えています。');
 const heads=sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0].map(v=>String(v).trim());
 const idCol=heads.findIndex(h=>['記事ID','article_id','articleId','ArticleID'].includes(h));
 const dateCol=heads.findIndex(h=>['改善日','改善日時','completed_at','実施日','登録日時'].includes(h));
 if(idCol<0||dateCol<0)return {status:'UNAVAILABLE',reason:'記事ID列または改善日列を特定できません。',events:[],detected_headers:heads.filter(Boolean).slice(0,20)};
 const rows=sh.getRange(2,1,sh.getLastRow()-1,Math.max(idCol,dateCol)+1).getDisplayValues(),targets=new Set(articleIds),events=[];
 for(const r of rows){const id=String(r[idCol]||'').trim();if(!targets.has(id))continue;const date=String(r[dateCol]||'').trim();if(date)events.push({article_id:id,date_raw:date});if(events.length>=300)break;}
 return {status:'READ_ONLY',events,source:'SBM改善履歴',date_semantics:'列名からの推定。日付の意味は個別確認が必要',truncated:events.length>=300};
}
function sssM3ResearchTimelineCollect(query){
 const q=String(query||'').trim();const candidates=sssM3ResearchEvidenceCandidates();
 if(candidates.status!=='PROVISIONAL')throw Error('保存済み調査候補を取得できません。');
 const target=candidates.queries.find(x=>x.query===q);if(!target)throw Error('保存済み調査対象外です。');
 const c=sssConfig_(),batch=sssM3BatchStatus();if(batch.status!=='COMPLETED'||batch.processed>5000)throw Error('S3記事台帳が未完成です。');
 const ref=sssM1CompactRef_(c),period=sssM3GscPlan_(ref);if(!period.available)throw Error(period.reason||'GSC期間を取得できません。');
 const windows=sssM3TimelinePeriods_(period.start,period.end);
 const sh=sssM3BatchSheet_();if(sh.getLastRow()!==batch.processed+1)throw Error('記事台帳の件数が一致しません。');
 const rows=sh.getRange(2,1,batch.processed,9).getDisplayValues();if(rows.some(r=>r[0]!==batch.run_id||r[1]!==c.siteId))throw Error('記事台帳のサイト・実行IDが一致しません。');
 const articles=rows.map(r=>({article_id:r[2],url:r[3],title:r[4]}));
 const results=windows.map(w=>{const response=sdscSearchAnalyticsQuery_(c.propertyUri,{startDate:w.start,endDate:w.end,type:'web',dataState:'final',dimensions:['page'],dimensionFilterGroups:[{groupType:'and',filters:[{dimension:'query',operator:'equals',expression:q}]}],rowLimit:100,startRow:0});return sssM3TimelineSummarize_(response,articles,c.siteId,w,q);});
 let history;try{history=sssM3ResearchHistoryRead_(c.siteId,target.article_ids);}catch(err){history={status:'UNAVAILABLE',reason:String(err&&err.message||err),events:[]};}
 return {format:'S3_M3_RESEARCH_TIMELINE_V1',status:'PROVISIONAL',site_id:c.siteId,query:q,windows:results,per_article:sssM3ResearchTimelineAnalyze_(results[0],results[1],target.article_ids),sbm_history:history,publication_gate:'HOLD',content_action:'NONE',limitations:['2期間は日数で二分した比較で、改善日を境にした因果分析ではありません','各期間のGSC検索語完全一致ページ上位100件。未観測はゼロ実績ではありません','記事の入れ替わりはこの集計だけでは証明できません','改善履歴の日時は記録列の値であり公開・改善完了日と一致する保証はありません','記事本文・SERPは未取得。記事処置なし']};
}
function sssM3ResearchTimelineDialog(initialQuery){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:20px;line-height:1.5}select{width:100%;padding:8px}button{padding:9px;margin:10px 0;background:#1765ad;color:white;border:0;border-radius:4px}button:disabled{opacity:.5}table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left}details{margin-top:14px}pre{white-space:pre-wrap;overflow-wrap:anywhere}</style><h3>期間別GSC・SBM履歴を照合（試験）</h3><p>保存済み追加調査から1検索語を選択します。GSCを前半・後半に分けて読み取り専用で比較します。</p><select id="q" disabled><option>候補を取得中…</option></select><button id="go" onclick="run(false)" disabled>期間別証拠を取得</button><button type="button" id="fresh" onclick="run(true)" disabled>GSCを再取得</button><p id="status">開始待ち</p><p id="period"></p><table><thead><tr><th>記事ID</th><th>前半 表示/クリック</th><th>後半 表示/クリック</th><th>観測</th></tr></thead><tbody id="rows"></tbody></table><details><summary>SBM改善履歴（読み取り専用）</summary><pre id="history"></pre></details><details><summary>未確認事項・取得上限</summary><pre id="limits"></pre></details><p>改善効果や記事競合は確定しません。記事・SBM・Evidence・S3記録への書き込みはありません。</p><button type="button" onclick="backToOverview()">総合診断へ戻る</button><button onclick="google.script.host.close()">閉じる</button><script>const desiredQuery=${JSON.stringify(String(initialQuery||''))};const e=id=>document.getElementById(id);google.script.run.withSuccessHandler(x=>{if(!x||x.status!=='PROVISIONAL'){e('status').textContent='候補なし';return}e('q').replaceChildren();x.queries.forEach(r=>{const o=document.createElement('option');o.value=r.query;o.textContent=r.query;e('q').appendChild(o)});if(desiredQuery&&Array.from(e('q').options).some(o=>o.value===desiredQuery))e('q').value=desiredQuery;e('q').disabled=false;e('go').disabled=false;e('fresh').disabled=false;e('status').textContent='候補 '+x.queries.length+'件'}).withFailureHandler(err=>e('status').textContent=String(err&&err.message||err)).sssM3ResearchEvidenceCandidates();function run(force){e('go').disabled=true;e('status').textContent='2期間のGSCとSBM履歴を確認しています…';google.script.run.withSuccessHandler(x=>{e('go').disabled=false;if(!x||x.status!=='PROVISIONAL'){e('status').textContent='取得不可';return}e('status').textContent='取得完了（読み取り専用）／'+(x.cache_notice||'');e('period').textContent=x.windows.map(w=>w.period.start+'～'+w.period.end+'（'+w.returned+'ページ）').join(' ／ ');e('rows').replaceChildren();x.per_article.forEach(r=>{const tr=document.createElement('tr');[r.article_id,r.first?r.first.impressions+' / '+r.first.clicks:'未観測',r.second?r.second.impressions+' / '+r.second.clicks:'未観測',r.observation_change].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});e('rows').appendChild(tr)});e('history').textContent=JSON.stringify(x.sbm_history,null,2);e('limits').textContent=x.limitations.join(' ／ ')}).withFailureHandler(err=>{e('go').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3ResearchTimelineCached(e('q').value,!!force)}function backToOverview(){e('status').textContent='総合診断へ戻ります…';google.script.run.withSuccessHandler(()=>google.script.host.close()).withFailureHandler(err=>e('status').textContent='戻れません：'+String(err&&err.message||err)).sssM3IntegratedDialog()}</script></html>`).setWidth(850).setHeight(650);
 SpreadsheetApp.getUi().showModalDialog(html,'期間別GSC・SBM履歴を照合（試験）');
}


// v0.1.167: an integrated READ-ONLY evidence package. No article-body or SERP claims.
// Metadata comes from the completed S3 batch; historical dates remain unverified.
function sssM3EvidencePackageAssemble_(timeline, metadata){
 if(!timeline||timeline.format!=='S3_M3_RESEARCH_TIMELINE_V1'||timeline.status!=='PROVISIONAL'||timeline.publication_gate!=='HOLD'||timeline.content_action!=='NONE')throw Error('証拠データの安全条件が不正です。');
 if(!Array.isArray(timeline.per_article)||timeline.per_article.length>100||!Array.isArray(metadata))throw Error('記事台帳の形式が不正です。');
 const map=new Map(metadata.map(a=>[a.article_id,a]));
 const events=timeline.sbm_history&&Array.isArray(timeline.sbm_history.events)?timeline.sbm_history.events:[];
 const articles=timeline.per_article.map(r=>{
  const m=map.get(r.article_id)||null;
  return {article_id:r.article_id,title:m?m.title:'',url:m?m.url:'',metadata_status:m?'S3_BATCH_SNAPSHOT':'UNAVAILABLE',first:r.first||null,second:r.second||null,observation_change:r.observation_change,history_dates:events.filter(e=>e.article_id===r.article_id).map(e=>e.date_raw),history_date_semantics:'UNVERIFIED',body_status:'NOT_FETCHED',serp_status:'NOT_FETCHED'};
 });
 return {format:'S3_M3_EVIDENCE_PACKAGE_V1',status:'PROVISIONAL',site_id:timeline.site_id,query:timeline.query,windows:timeline.windows.map(w=>({period:w.period,returned:w.returned,truncated_possible:w.truncated_possible})),history_status:timeline.sbm_history?timeline.sbm_history.status:'UNAVAILABLE',history_date_semantics:'UNVERIFIED',articles,publication_gate:'HOLD',content_action:'NONE',limitations:['GSC各期間上位100ページ。未観測はゼロを意味しません','改善履歴の日付は意味未確定で、改善効果の因果関係を示しません','記事タイトルとURLはS3台帳の取得時点の情報です','本文とSERPは未取得。検索意図・競合・記事の役割は未確定です','記事・SBM・Evidence・保存済み調査記録への書き込みは行いません']};
}
function sssM3EvidencePackageCollect(query){
 const timeline=sssM3ResearchTimelineCollect(query);
 const cfg=sssConfig_(),batch=sssM3BatchStatus();
 if(batch.status!=='COMPLETED'||batch.processed>5000)throw Error('S3記事台帳が未完成です。');
 const sh=sssM3BatchSheet_();
 if(sh.getLastRow()!==batch.processed+1)throw Error('記事台帳の件数が一致しません。');
 const rows=sh.getRange(2,1,batch.processed,5).getDisplayValues();
 if(rows.some(r=>r[0]!==batch.run_id||r[1]!==cfg.siteId))throw Error('記事台帳のサイト・実行IDが一致しません。');
 return sssM3EvidencePackageAssemble_(timeline,rows.map(r=>({article_id:r[2],url:r[3],title:r[4]})));
}
function sssM3EvidencePackageDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:18px;line-height:1.5;color:#222}select{width:100%;padding:8px}button{padding:9px;margin:10px 0;background:#1765ad;color:white;border:0;border-radius:4px}button:disabled{opacity:.5}table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left;vertical-align:top}details{margin-top:10px}summary{cursor:pointer}small{color:#666}pre{white-space:pre-wrap;overflow-wrap:anywhere}a{overflow-wrap:anywhere}</style><h3>追加調査の証拠を統合確認（試験）</h3><p>期間別GSC・SBM履歴・S3記事台帳を読み取り専用で照合します。本文とSERPは未取得です。</p><select id="q" disabled><option>候補を取得中…</option></select><button id="go" disabled onclick="run()">証拠パッケージを作成</button><p id="status">開始待ち</p><p id="period"></p><table><thead><tr><th>記事</th><th>前半 表示/クリック</th><th>後半 表示/クリック</th><th>履歴日付（意味未確認）</th></tr></thead><tbody id="rows"></tbody></table><details><summary>未取得の証拠・安全条件</summary><pre id="limits"></pre></details><button onclick="google.script.host.close()">閉じる</button><script>const e=id=>document.getElementById(id);google.script.run.withSuccessHandler(x=>{if(!x||x.status!=='PROVISIONAL'){e('status').textContent='候補なし';return}e('q').replaceChildren();x.queries.forEach(r=>{const o=document.createElement('option');o.value=r.query;o.textContent=r.query;e('q').appendChild(o)});e('q').disabled=false;e('go').disabled=false;e('status').textContent='候補 '+x.queries.length+'件'}).withFailureHandler(err=>e('status').textContent=String(err&&err.message||err)).sssM3ResearchEvidenceCandidates();function run(){e('go').disabled=true;e('status').textContent='GSC・SBM履歴・記事台帳を照合しています…';google.script.run.withSuccessHandler(x=>{e('go').disabled=false;if(!x||x.status!=='PROVISIONAL'){e('status').textContent='取得不可';return}e('status').textContent='統合完了（読み取り専用）／'+x.articles.length+'記事／履歴：'+x.history_status;e('period').textContent=x.windows.map(w=>w.period.start+'～'+w.period.end).join(' ／ ');e('rows').replaceChildren();x.articles.forEach(r=>{const tr=document.createElement('tr');const vals=[r.article_id+' ／ '+(r.title||'タイトル未取得'),r.first?r.first.impressions+' / '+r.first.clicks:'未観測',r.second?r.second.impressions+' / '+r.second.clicks:'未観測',r.history_dates.length?r.history_dates.join('、'):'記録なし'];vals.forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});e('rows').appendChild(tr)});e('limits').textContent=x.limitations.join('\\n')} ).withFailureHandler(err=>{e('go').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3EvidencePackageCollect(e('q').value)}</script></html>`).setWidth(900).setHeight(660);
 SpreadsheetApp.getUi().showModalDialog(html,'追加調査の証拠を統合確認（試験）');
}



// v0.1.168: bounded, public-URL-only evidence; one article per request.
// Does not claim that stripped HTML is a full or current editorial source.
function sssM3BodyEvidenceExtract_(html){
 const input=String(html||'').slice(0,400000);
 const body=(input.match(/<article\b[^>]*>([\s\S]*?)<\/article\s*>/i)||[])[1]||'';
 const scope=body||((input.match(/<main\b[^>]*>([\s\S]*?)<\/main\s*>/i)||[])[1]||'');
 if(!scope)return {status:'UNAVAILABLE',reason:'article/main領域を特定できません。',headings:[],excerpt:''};
 const decode=x=>String(x).replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g,m=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&nbsp;':' '}[m]||m)).replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)));
 const clean=x=>decode(String(x).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
 const headings=[...scope.matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi)].slice(0,35).map(m=>({level:'H'+m[1],text:clean(m[2]).slice(0,180)})).filter(x=>x.text);
 const excerpt=clean(scope).slice(0,3500);
 return {status:excerpt?'EXTRACTED_PARTIAL':'UNAVAILABLE',headings,excerpt,reason:excerpt?'':'本文テキストを抽出できません。'};
}
function sssM3BodyEvidenceFetchFromArticle_(q,id,a){
 const cfg=sssConfig_();const base=String(cfg.propertyUri||'').match(/^https:\/\/([^\/:?#]+)/i);const url=String(a.url||'').match(/^https:\/\/([^\/:?#]+)(\/entry\/[^?#]*)$/i);
 if(!base||!url||url[1].toLowerCase()!==base[1].toLowerCase())throw Error('公開記事URLが登録サイトと一致しません。');
 const response=UrlFetchApp.fetch(String(a.url),{muteHttpExceptions:true,followRedirects:false,validateHttpsCertificates:true,headers:{'User-Agent':'SIMS-S3-ReadOnly-Evidence/0.1.169'}});
 const code=response.getResponseCode();if(code!==200)return {status:'UNAVAILABLE',reason:'HTTP '+code,article_id:id,url:a.url,publication_gate:'HOLD',content_action:'NONE'};
 const headers=response.getHeaders();const ct=String(headers['Content-Type']||headers['content-type']||'').toLowerCase();
 if(!ct.includes('text/html'))return {status:'UNAVAILABLE',reason:'HTML以外の応答です。',article_id:id,url:a.url,publication_gate:'HOLD',content_action:'NONE'};
 const raw=response.getContentText();if(raw.length>400000) return {status:'UNAVAILABLE',reason:'HTMLがサイズ上限を超えています。',article_id:id,url:a.url,publication_gate:'HOLD',content_action:'NONE'};
 const extracted=sssM3BodyEvidenceExtract_(raw);
 return {format:'S3_M3_BODY_EVIDENCE_V1',article_id:id,url:a.url,query:q,fetch_status:extracted.status,reason:extracted.reason,headings:extracted.headings,excerpt:extracted.excerpt,scope:'PUBLIC_HTML_PARTIAL',publication_gate:'HOLD',content_action:'NONE',limitations:['公開HTMLのarticle/mainから抽出した部分テキストです。全文の網羅性・最新性は保証しません。','検索結果SERPは未取得です。','取得した内容はS3・SBM・Evidenceへ保存しません。']};
}
function sssM3BodyEvidenceFetch(query,articleId){
 const q=String(query||'').trim(),id=String(articleId||'').trim();
 if(!/^A\d{6}$/.test(id))throw Error('記事IDの形式が不正です。');
 const pkg=sssM3EvidencePackageCollect(q);
 const a=pkg.articles.find(x=>x.article_id===id);
 if(!a)throw Error('選択した記事は証拠パッケージにありません。');
 return sssM3BodyEvidenceFetchFromArticle_(q,id,a);
}
function sssM3BodyEvidenceDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:20px;line-height:1.5}select{width:100%;padding:9px;margin:6px 0}button{padding:9px;background:#1765ad;color:white;border:0;border-radius:4px;margin:8px 8px 8px 0}button:disabled{opacity:.5}pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:300px;overflow:auto;background:#f6f7f8;padding:12px}small{color:#555}</style><h3>記事本文の証拠を確認（試験）</h3><p>保存済み調査対象の記事を1件ずつ公開URLから読み取り専用で取得します。記事の処置は行いません。</p><label>検索語<select id="q" disabled><option>候補を取得中…</option></select></label><label>記事<select id="a" disabled><option>検索語を選択してください</option></select></label><button id="go" disabled onclick="run()">公開本文の証拠を取得</button><button id="copy" disabled onclick="copyPrompt()">Claude精査依頼文をコピー</button><p id="status">開始待ち</p><pre id="out"></pre><small>取得テキストは最大3,500文字、H2/H3は最大35件。SERP・本文全文は未検証です。SBM・Evidence・記事は変更しません。</small><script>const e=id=>document.getElementById(id);let pkg=null,body=null;function load(){e('a').disabled=true;e('go').disabled=true;e('status').textContent='記事候補を確認しています…';google.script.run.withSuccessHandler(x=>{pkg=x;e('a').replaceChildren();(x.articles||[]).forEach(r=>{let o=document.createElement('option');o.value=r.article_id;o.textContent=r.article_id+' ／ '+(r.title||'タイトル未取得');e('a').appendChild(o)});e('a').disabled=false;e('go').disabled=false;e('status').textContent='記事を選択してください'}).withFailureHandler(err=>e('status').textContent=String(err.message||err)).sssM3EvidencePackageCollect(e('q').value)}google.script.run.withSuccessHandler(x=>{e('q').replaceChildren();(x.queries||[]).forEach(r=>{let o=document.createElement('option');o.value=r.query;o.textContent=r.query;e('q').appendChild(o)});if(!x.queries||!x.queries.length){e('status').textContent='候補なし';return}e('q').disabled=false;e('q').onchange=load;load()}).withFailureHandler(err=>e('status').textContent=String(err.message||err)).sssM3ResearchEvidenceCandidates();function run(){e('go').disabled=true;e('copy').disabled=true;e('status').textContent='公開HTMLを確認しています…';google.script.run.withSuccessHandler(x=>{e('go').disabled=false;body=x;e('out').textContent=JSON.stringify(x,null,2);e('status').textContent=x.fetch_status==='EXTRACTED_PARTIAL'?'部分本文の取得完了（読み取り専用）':'取得不可：'+(x.reason||'不明');e('copy').disabled=x.fetch_status!=='EXTRACTED_PARTIAL'}).withFailureHandler(err=>{e('go').disabled=false;e('status').textContent='取得停止：'+String(err.message||err)}).sssM3BodyEvidenceFetch(e('q').value,e('a').value)}function copyPrompt(){if(!pkg||!body)return;const prompt='次の検索語・記事について、検索意図と記事の役割を暫定的に評価してください。記事の変更・統合・公開を指示せず、不足する証拠を明記してください。SERP未取得、履歴日付の意味未確定、本文は部分抽出です。\\n\\n'+JSON.stringify({format:'S3_M3_BODY_REVIEW_INPUT_V1',query:pkg.query,article:pkg.articles.find(x=>x.article_id===body.article_id),body_evidence:body,publication_gate:'HOLD',content_action:'NONE'},null,2);navigator.clipboard.writeText(prompt).then(()=>e('status').textContent='Claude精査依頼文をコピーしました').catch(()=>e('status').textContent='コピーできません。ブラウザの権限を確認してください。')}</script></html>`).setWidth(900).setHeight(670);
 SpreadsheetApp.getUi().showModalDialog(html,'記事本文の証拠を確認（試験）');
}


// v0.1.169: bounded sequential body evidence comparison. One GSC/SBM package
// per batch; each public HTML fetch is read-only and fail-closed per article.
function sssM3BodyComparePlan_(pkg,ids){
 if(!pkg||pkg.format!=='S3_M3_EVIDENCE_PACKAGE_V1'||pkg.publication_gate!=='HOLD'||pkg.content_action!=='NONE'||!Array.isArray(pkg.articles))throw Error('証拠パッケージの安全条件が不正です。');
 if(!Array.isArray(ids)||ids.length<2||ids.length>3||new Set(ids).size!==ids.length||ids.some(id=>!/^A\d{6}$/.test(id)))throw Error('比較記事は異なる2〜3件を指定してください。');
 const selected=ids.map(id=>pkg.articles.find(a=>a.article_id===id));
 if(selected.some(a=>!a))throw Error('記事IDが調査対象に含まれていません。');
 return selected;
}
function sssM3BodyCompareCollect(query,ids){
 const pkg=sssM3EvidencePackageCollect(query);
 const selected=sssM3BodyComparePlan_(pkg,ids);
 const bodies=selected.map(a=>{
  try{return sssM3BodyEvidenceFetchFromArticle_(pkg.query,a.article_id,a)}
  catch(err){return {format:'S3_M3_BODY_EVIDENCE_V1',article_id:a.article_id,url:a.url,query:pkg.query,fetch_status:'UNAVAILABLE',reason:String(err&&err.message||err).slice(0,250),headings:[],excerpt:'',publication_gate:'HOLD',content_action:'NONE'};}
 });
 return {format:'S3_M3_BODY_COMPARISON_V1',query:pkg.query,site_id:pkg.site_id,articles:selected.map((a,i)=>({article_id:a.article_id,title:a.title,url:a.url,first:a.first,second:a.second,history_dates:a.history_dates,body:bodies[i]})),limitations:['公開HTMLの部分抽出です。目次や関連記事が混入する可能性があります。','検索結果SERPと本文全文は未確認です。','SBM履歴日付の意味は未確定です。','複数記事の表示は競合・統合の証明ではありません。'],publication_gate:'HOLD',content_action:'NONE',status:'PROVISIONAL'};
}
function sssM3BodyCompareDialog(initialQuery){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:18px;line-height:1.5}select{width:100%;padding:8px;margin:6px 0}button{padding:9px;background:#1765ad;color:white;border:0;border-radius:4px;margin:8px 6px 8px 0}button:disabled{opacity:.5}pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:340px;overflow:auto;background:#f6f7f8;padding:10px}small{color:#555}</style><h3>複数記事の本文を比較（試験）</h3><p>同じ検索語で観測された2〜3記事を、GSC・SBM履歴・公開HTMLの部分本文で読み取り専用比較します。</p><label>検索語<select id="q" disabled><option>候補を取得中…</option></select></label><label>記事1<select id="a" disabled></select></label><label>記事2<select id="b" disabled></select></label><label>記事3（任意）<select id="c" disabled></select></label><button id="go" disabled onclick="run()">比較証拠を取得</button><button id="copy" disabled onclick="copyPrompt()">Claude比較依頼文をコピー</button><p id="status">候補を読み込みます…</p><pre id="out"></pre><hr><h4>Claudeの記事役割判定を検証（処置なし）</h4><p>比較依頼文をClaudeに渡し、指定形式のJSON回答を貼り付けます。検証結果は画面内のみです。</p><textarea id="review" rows="9" style="width:100%;box-sizing:border-box" placeholder="ClaudeのJSON回答を貼り付け"></textarea><button id="check" onclick="checkReview()">役割判定を検証</button><button id="save" disabled onclick="saveReview()">検証済み判定をS3へ保存</button><pre id="reviewOut"></pre><button type="button" onclick="backToOverview()">総合診断へ戻る</button><p><small>最大3記事。本文は部分抽出、SERP未取得、改善履歴日付の意味未確定。記事・SBM・Evidenceへの書き込みはしません。</small><script>
const desiredQuery=${JSON.stringify(String(initialQuery||''))};const e=id=>document.getElementById(id);let result=null,verified=null;e('review').addEventListener('input',()=>{verified=null;e('save').disabled=true});function load(){['a','b','c','go','copy'].forEach(id=>e(id).disabled=true);e('status').textContent='記事候補を取得しています…';google.script.run.withSuccessHandler(x=>{const rows=x.articles||[];['a','b','c'].forEach((id,j)=>{const el=e(id);el.replaceChildren();if(j===2){const o=document.createElement('option');o.value='';o.textContent='選択しない';el.appendChild(o)}rows.forEach(r=>{const o=document.createElement('option');o.value=r.article_id;o.textContent=r.article_id+' ／ '+(r.title||'タイトル未取得');el.appendChild(o)});el.disabled=false});if(rows.length>1){e('b').selectedIndex=1;e('go').disabled=false;e('status').textContent='2〜3記事を選んでください'}else e('status').textContent='比較対象が2記事未満です'}).withFailureHandler(err=>e('status').textContent='候補取得失敗：'+String(err.message||err)).sssM3EvidencePackageCollect(e('q').value)}google.script.run.withSuccessHandler(x=>{e('q').replaceChildren();(x.queries||[]).forEach(r=>{const o=document.createElement('option');o.value=r.query;o.textContent=r.query;e('q').appendChild(o)});if(!x.queries||!x.queries.length){e('status').textContent='候補なし';return}e('q').disabled=false;if(desiredQuery&&Array.from(e('q').options).some(o=>o.value===desiredQuery))e('q').value=desiredQuery;e('q').onchange=load;load()}).withFailureHandler(err=>e('status').textContent='候補取得失敗：'+String(err.message||err)).sssM3ResearchEvidenceCandidates();function run(){verified=null;e('save').disabled=true;const ids=[e('a').value,e('b').value,e('c').value].filter(Boolean);if(new Set(ids).size!==ids.length||ids.length<2){e('status').textContent='異なる2〜3記事を選択してください';return}e('go').disabled=true;e('copy').disabled=true;e('status').textContent='公開本文を取得しています…';google.script.run.withSuccessHandler(x=>{result=x;e('out').textContent=JSON.stringify(x,null,2);e('status').textContent='比較証拠の取得完了（'+x.articles.length+'記事・読み取り専用）';e('go').disabled=false;e('copy').disabled=false}).withFailureHandler(err=>{e('go').disabled=false;e('status').textContent='取得停止：'+String(err.message||err)}).sssM3BodyCompareCollect(e('q').value,ids)}function copyPrompt(){if(!result)return;const prompt='次の複数記事について、検索語に対する記事の役割を証拠ベースで比較してください。SERP未取得、本文は部分抽出、履歴日付の意味未確定です。競合・統合を確定せず、記事の変更・統合・公開は指示しないでください。回答はJSONのみ。形式は {\"format\":\"S3_M3_ROLE_REVIEW_V1\",\"site_id\":\"（証拠と同一）\",\"query\":\"（証拠と同一）\",\"publication_gate\":\"HOLD\",\"content_action\":\"NONE\",\"reviews\":[{\"article_id\":\"A000000\",\"role\":\"GENERAL|SPECIALIST|OVERLAP_SUSPECTED|EVIDENCE_NEEDED\",\"confidence\":\"PROVISIONAL|UNCONFIRMED\",\"reason\":\"根拠と制約\",\"next_evidence\":[\"追加確認\"]}]}。reviewsは比較した全記事を1回ずつ含め、根拠が不十分ならEVIDENCE_NEEDEDを選んでください。\\n\\n'+JSON.stringify(result,null,2);navigator.clipboard.writeText(prompt).then(()=>e('status').textContent='Claude比較依頼文をコピーしました').catch(()=>e('status').textContent='コピーに失敗しました')}function checkReview(){verified=null;e('save').disabled=true;const out=e('reviewOut');out.textContent='';try{if(!result||!Array.isArray(result.articles))throw Error('先に比較証拠を取得してください');let raw=e('review').value.trim();if(raw.startsWith(String.fromCharCode(96,96,96)))raw=raw.replace(/^\x60{3}(?:json)?\s*/i,'').replace(/\s*\x60{3}$/,'');const r=JSON.parse(raw);if(!r||r.format!=='S3_M3_ROLE_REVIEW_V1'||r.publication_gate!=='HOLD'||r.content_action!=='NONE'||r.site_id!==result.site_id||r.query!==result.query)throw Error('形式・サイト・検索語・安全条件が一致しません');const ids=result.articles.map(a=>a.article_id);if(!Array.isArray(r.reviews)||r.reviews.length!==ids.length)throw Error('記事数が一致しません');const seen=new Set();for(const v of r.reviews){if(!v||!ids.includes(v.article_id)||seen.has(v.article_id))throw Error('対象外または重複の記事IDです');seen.add(v.article_id);if(!['GENERAL','SPECIALIST','OVERLAP_SUSPECTED','EVIDENCE_NEEDED'].includes(v.role)||!['PROVISIONAL','UNCONFIRMED'].includes(v.confidence)||typeof v.reason!=='string'||!v.reason.trim()||!Array.isArray(v.next_evidence)||!v.next_evidence.every(x=>typeof x==='string'))throw Error('役割・確信度・根拠・追加確認の形式が不正です')}verified=r;e('save').disabled=false;out.textContent='形式検証OK（'+ids.length+'記事）。暫定判定のみ。保存・記事処置は行いません。\\n'+r.reviews.map(v=>v.article_id+'：'+v.role+'／'+v.confidence+'／'+v.reason).join('\\n')}catch(err){out.textContent='安全停止：'+String(err.message||err)}}function saveReview(){if(!verified||!result)return;e('save').disabled=true;e('reviewOut').textContent='S3専用台帳へ保存しています…';google.script.run.withSuccessHandler(x=>{e('reviewOut').textContent=(x.status==='SAVED'?'S3へ保存しました':'保存済みです')+'（'+x.count+'記事）。処置は保留。';}).withFailureHandler(err=>{e('save').disabled=false;e('reviewOut').textContent='安全停止：'+String(err&&err.message||err)}).sssM3RoleLedgerSave(verified,result)}function backToOverview(){e('status').textContent='総合診断へ戻ります…';google.script.run.withSuccessHandler(()=>google.script.host.close()).withFailureHandler(err=>e('status').textContent='戻れません：'+String(err&&err.message||err)).sssM3IntegratedDialog()}</script></html>`).setWidth(940).setHeight(700);
 SpreadsheetApp.getUi().showModalDialog(html,'複数記事の本文を比較（試験）');
}


// v0.1.171: S3-only provisional role ledger. Never authorizes SBM action.
function sssM3RoleLedgerValidate_(review, comparison, allowedIds){
 if(!review||review.format!=='S3_M3_ROLE_REVIEW_V1'||review.publication_gate!=='HOLD'||review.content_action!=='NONE'||!comparison||comparison.format!=='S3_M3_BODY_COMPARISON_V1'||comparison.publication_gate!=='HOLD'||comparison.content_action!=='NONE'||review.site_id!==comparison.site_id||review.query!==comparison.query)throw Error('比較証拠と回答の安全条件が一致しません。');
 const ids=(comparison.articles||[]).map(a=>a.article_id);
 if(ids.length<2||ids.length>3||new Set(ids).size!==ids.length||!Array.isArray(review.reviews)||review.reviews.length!==ids.length)throw Error('比較記事の件数が不正です。');
 if(!Array.isArray(allowedIds)||ids.some(id=>!allowedIds.includes(id)))throw Error('保存済み調査候補と記事IDが一致しません。');
 const seen=new Set();
 const reviews=review.reviews.map(v=>{
  if(!v||!ids.includes(v.article_id)||seen.has(v.article_id))throw Error('回答の記事IDが不正です。');seen.add(v.article_id);
  if(!['GENERAL','SPECIALIST','OVERLAP_SUSPECTED','EVIDENCE_NEEDED'].includes(v.role)||!['PROVISIONAL','UNCONFIRMED'].includes(v.confidence)||typeof v.reason!=='string'||!v.reason.trim()||v.reason.length>5000||!Array.isArray(v.next_evidence)||v.next_evidence.length>20||v.next_evidence.some(x=>typeof x!=='string'||x.length>1000))throw Error('回答の判定・根拠が不正です。');
  return {article_id:v.article_id,role:v.role,confidence:v.confidence,reason:v.reason,next_evidence:v.next_evidence};
 });
 return {site_id:review.site_id,query:review.query,reviews,article_ids:ids,publication_gate:'HOLD',content_action:'NONE'};
}
function sssM3RoleLedgerSheet_(){
 const ss=SpreadsheetApp.getActiveSpreadsheet();if(!ss)throw Error('S3のスプレッドシートがありません。');
 const name='S3_M3_記事役割判定',heads=['保存日時','サイトID','検索語','記事ID','役割','確信度','根拠','追加証拠','安全判定','保存キー'];
 let sh=ss.getSheetByName(name);
 if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,heads.length).setValues([heads]);sh.setFrozenRows(1);}
 if(sh.getLastColumn()<heads.length||sh.getRange(1,1,1,heads.length).getDisplayValues()[0].some((x,i)=>x!==heads[i]))throw Error('役割判定シートの列定義が一致しません。');
 return sh;
}
function sssM3RoleLedgerSave(review,comparison){
 const cfg=sssConfig_();if(!review||review.site_id!==cfg.siteId)throw Error('サイトIDが一致しません。');
 // The comparison is untrusted client input. Verify the candidate and S3 inventory anew.
 const candidates=sssM3ResearchEvidenceCandidates();const candidate=candidates.queries&&candidates.queries.find(x=>x.query===review.query);
 if(candidates.status!=='PROVISIONAL'||!candidate)throw Error('保存済み調査候補が変更されました。');
 const normalized=sssM3RoleLedgerValidate_(review,comparison,candidate.article_ids);
 const batch=sssM3BatchStatus();if(batch.status!=='COMPLETED'||batch.processed>5000)throw Error('S3記事台帳が未完成です。');
 const inventory=sssM3BatchSheet_();if(inventory.getLastRow()!==batch.processed+1)throw Error('S3記事台帳が変更されました。');
 const rows=inventory.getRange(2,1,batch.processed,5).getDisplayValues(),map=new Map();
 for(const row of rows){if(row[0]!==batch.run_id||row[1]!==cfg.siteId)throw Error('記事台帳のサイト・実行IDが一致しません。');map.set(row[2],{url:row[3],title:row[4]});}
 for(const a of comparison.articles){const actual=map.get(a.article_id);if(!actual||actual.url!==a.url||actual.title!==a.title)throw Error('記事台帳の内容が比較時点と一致しません。');}
 // No SBM status snapshot is interpreted as permission. This is evidence-only.
 const sh=sssM3RoleLedgerSheet_(),key=cfg.siteId+'|'+normalized.query+'|'+normalized.article_ids.slice().sort().join(',');
 const lock=LockService.getDocumentLock();if(!lock||!lock.tryLock(20000))throw Error('保存ロックを取得できません。');
 try{
  const n=sh.getLastRow();if(n>10001)throw Error('役割判定の保存上限に達しました。');
  if(n>1){const existing=sh.getRange(2,10,n-1,1).getDisplayValues().flat();if(existing.includes(key))return {status:'ALREADY_SAVED',count:normalized.reviews.length,publication_gate:'HOLD',content_action:'NONE'};}
  const at=new Date().toISOString();const records=normalized.reviews.map(v=>[at,cfg.siteId,normalized.query,v.article_id,v.role,v.confidence,v.reason,JSON.stringify(v.next_evidence),'HOLD / NONE / PROVISIONAL',key]);
  sh.getRange(n+1,1,records.length,10).setValues(records);
  return {status:'SAVED',count:records.length,publication_gate:'HOLD',content_action:'NONE',sbm_status:'NOT_RECHECKED_READ_ONLY_ONLY'};
 }finally{lock.releaseLock();}
}
function sssM3RoleLedgerPreview(){
 const cfg=sssConfig_(),sh=SpreadsheetApp.getActiveSpreadsheet().getSheetByName('S3_M3_記事役割判定');
 if(!sh||sh.getLastRow()<2)return {status:'EMPTY',items:[],publication_gate:'HOLD',content_action:'NONE'};
 const n=Math.min(sh.getLastRow()-1,300),rows=sh.getRange(sh.getLastRow()-n+1,1,n,10).getDisplayValues();
 return {status:'PROVISIONAL',items:rows.filter(r=>r[1]===cfg.siteId).map(r=>({saved_at:r[0],query:r[2],article_id:r[3],role:r[4],confidence:r[5],decision:'HOLD'})),publication_gate:'HOLD',content_action:'NONE'};
}


// v0.1.172: read-only, fail-closed recheck of provisional role records.
// A saved Claude role never authorizes a treatment or a referral.
function sssM3RoleLiveJoin_(saved, states, checkedAt){
 if(!saved||saved.status!=='PROVISIONAL'||saved.publication_gate!=='HOLD'||saved.content_action!=='NONE'||!Array.isArray(saved.items)||saved.items.length>300)throw Error('保存済み判定が不正です。');
 if(!states||typeof states!=='object'||!checkedAt)throw Error('SBM最新状態を確認できません。');
 const roles=['GENERAL','SPECIALIST','OVERLAP_SUSPECTED','EVIDENCE_NEEDED'], seen=new Set(), items=[];
 for(const x of saved.items){
  if(!x||!/^A\d{6}$/.test(x.article_id)||!x.query||!roles.includes(x.role)||!['PROVISIONAL','UNCONFIRMED'].includes(x.confidence))throw Error('保存済み役割判定の列が不正です。');
  const key=x.query+'|'+x.article_id;if(seen.has(key))throw Error('同一検索語・記事IDの判定が重複しています。');seen.add(key);
  const raw=Object.prototype.hasOwnProperty.call(states,x.article_id)?String(states[x.article_id]):'SBM未照合';
  const classified=sssM3ClassifySbmState_(raw);
  // UNKNOWN and ACTIVE always hold; KNOWN is also only research-eligible, never actionable.
  const review=classified.kind==='ACTIVE'?'SBM処理中：追加調査のみ':classified.kind==='UNKNOWN'?'状態不明：安全保留':'読み取り専用調査可';
  items.push({query:x.query,article_id:x.article_id,role:x.role,confidence:x.confidence,sbm_state:raw,review_status:review,publication_gate:'HOLD',content_action:'NONE'});
 }
 const counts={ACTIVE:0,UNKNOWN:0,KNOWN:0};for(const x of items)counts[sssM3ClassifySbmState_(x.sbm_state).kind]++;
 return {format:'S3_M3_ROLE_LIVE_PREFLIGHT_V1',status:'PROVISIONAL',checked_at:checkedAt,counts,items,publication_gate:'HOLD',content_action:'NONE',limitations:['SBM状態は確認時点の値です。直後に変化する可能性があります。','保存済みのClaude判定は暫定的な調査結果です。SERP・全文・履歴日付の意味は未確定です。','改善・統合・新規記事・紹介状の発行は行いません。']};
}
function sssM3RoleLivePreview(){
 const cfg=sssConfig_(),saved=sssM3RoleLedgerPreview();
 if(saved.status==='EMPTY')return {format:'S3_M3_ROLE_LIVE_PREFLIGHT_V1',status:'EMPTY',items:[],publication_gate:'HOLD',content_action:'NONE'};
 const connection=sssM1FindManagers_();
 if(!connection.complete||connection.candidates.length!==1)throw Error('SBM連携先を一意に確認できません。');
 const managerId=connection.candidates[0].id;sssCheckManagerIdentityForSetup_(managerId,cfg);
 const sh=SpreadsheetApp.openById(managerId).getSheetByName('記事管理');
 if(!sh||sh.getLastRow()<2||sh.getLastRow()>10001||sh.getLastColumn()>100)throw Error('SBM記事台帳の範囲が不正です。');
 const values=sh.getRange(1,1,sh.getLastRow(),sh.getLastColumn()).getDisplayValues();
 const articles=sssM1Articles_(values),ids=[...new Set(saved.items.map(x=>x.article_id))];
 const states=sssM3StrategyLiveStates_(cfg.siteId,ids,articles);
 return sssM3RoleLiveJoin_(saved,states,new Date().toISOString());
}
function sssM3RoleLiveDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;padding:18px;line-height:1.6;color:#222}button{background:#1765ad;color:white;border:0;border-radius:5px;padding:10px 16px}button:disabled{opacity:.5}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;text-align:left;padding:9px;vertical-align:top;overflow-wrap:anywhere}small{color:#555}</style><h3>保存済み記事役割とSBM状態を照合（試験）</h3><p>保存済み暫定判定とSBM記事管理の最新状態を読み取り専用で照合します。処置・紹介状は発行しません。</p><button id="go" onclick="run()">最新状態を照合</button><p id="status" role="status">開始待ち</p><p id="summary"></p><table><thead><tr><th>検索語・記事</th><th>役割</th><th>SBM状態</th><th>調査の扱い</th></tr></thead><tbody id="rows"></tbody></table><p><small id="limits"></small></p><button onclick="google.script.host.close()">閉じる</button><script>const e=id=>document.getElementById(id);function run(){e('go').disabled=true;e('status').textContent='SBMの最新状態を照合しています…';google.script.run.withSuccessHandler(x=>{e('go').disabled=false;e('rows').replaceChildren();if(!x||x.publication_gate!=='HOLD'||x.content_action!=='NONE'){e('status').textContent='安全停止：結果が不正です';return}if(x.status==='EMPTY'){e('status').textContent='保存済み判定がありません';return}if(x.status!=='PROVISIONAL'){e('status').textContent='安全停止：照合できません';return}e('status').textContent='照合完了（'+x.items.length+'記事・処置なし）';e('summary').textContent='SBM処理中 '+x.counts.ACTIVE+'件／状態不明 '+x.counts.UNKNOWN+'件／その他 '+x.counts.KNOWN+'件';x.items.forEach(r=>{const tr=document.createElement('tr');[r.query+' / '+r.article_id,r.role+' / '+r.confidence,r.sbm_state,r.review_status].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});e('rows').appendChild(tr)});e('limits').textContent=x.limitations.join('／')}).withFailureHandler(err=>{e('go').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3RoleLivePreview()}</script></html>`).setWidth(900).setHeight(680);
 SpreadsheetApp.getUi().showModalDialog(html,'保存済み記事役割とSBM状態を照合（試験）');
}



/** v0.1.174: read-only M3 summary + saved roles, independently fail-closed. */
function sssM3IntegratedJoin_(dashboard, roles) {
 if (!roles || roles.publication_gate!=='HOLD' || roles.content_action!=='NONE' || !['EMPTY','PROVISIONAL'].includes(roles.status)) throw Error('記事役割の安全条件を確認できません。');
 if (!dashboard || dashboard.content_action!=='NONE' || !['NOT_READY','READY'].includes(dashboard.status)) throw Error('総合診断の安全条件を確認できません。');
 if (dashboard.status==='READY' && (dashboard.publication_gate!=='HOLD'||!Number.isSafeInteger(dashboard.article_count)||dashboard.article_count<0)) throw Error('総合診断の公開保留条件を確認できません。');
 const entries=roles.status==='EMPTY'?[]:roles.items;
 if (!Array.isArray(entries)||entries.length>300) throw Error('役割照合件数が不正です。');
 const counts={ACTIVE:0,UNKNOWN:0,KNOWN:0};
 const rows=entries.map(r=>{
  if(!r||!/^A\d{6}$/.test(r.article_id)||!['GENERAL','SPECIALIST','OVERLAP_SUSPECTED','EVIDENCE_NEEDED'].includes(r.role)||!['PROVISIONAL','UNCONFIRMED'].includes(r.confidence)||r.publication_gate!=='HOLD'||r.content_action!=='NONE')throw Error('役割照合結果が不正です。');
  const kind=sssM3ClassifySbmState_(r.sbm_state).kind;
  counts[kind]++;
  return {query:r.query,article_id:r.article_id,role:r.role,confidence:r.confidence,sbm_state:r.sbm_state,review_status:r.review_status,kind};
 });
 const priorities=sssM3ResearchPriorities_(rows);
 const researchGaps=sssM3ResearchGaps_(rows);
 return {format:'S3_M3_INTEGRATED_OVERVIEW_V1',status:'READ_ONLY',diagnosis_status:dashboard.status,article_count:dashboard.status==='READY'?dashboard.article_count:null,diagnosis_counts:dashboard.status==='READY'?dashboard.counts:null,diagnosis_reason:dashboard.status==='NOT_READY'?dashboard.reason:'',role_count:rows.length,role_counts:counts,roles:rows,priorities:priorities,priority_scope:'SAVED_ROLE_REVIEWS_ONLY',research_gaps:researchGaps,checked_at:roles.checked_at||'',publication_gate:'HOLD',content_action:'NONE',notice:'診断と役割は暫定評価です。SBM状態は取得時点の値です。記事処置・紹介状発行は行いません。'};
}
function sssM3IntegratedPreview(){
 // The overall diagnostic can be unfinished; role recheck remains independently useful.
 const dashboard=sssM3DashboardData();
 const roles=sssM3RoleLivePreview();
 return sssM3IntegratedJoin_(dashboard,roles);
}
function sssM3IntegratedDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;color:#202124;padding:20px;line-height:1.65}h3{margin-top:0}.lead{font-size:17px;font-weight:600;line-height:1.6}.kpis{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}.kpi{background:#f6f7f9;border-radius:7px;padding:12px 16px;min-width:115px}.kpi b{display:block;font-size:22px}.section{border-top:1px solid #dadce0;padding-top:12px;margin-top:16px}details>summary{cursor:pointer;font-weight:600;padding:8px 0}button{background:#1765ad;color:white;border:0;border-radius:5px;padding:10px 16px;cursor:pointer}button:disabled{opacity:.5}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;border-bottom:1px solid #ddd;padding:8px;overflow-wrap:anywhere}#summary{background:#f6f7f9;padding:12px;margin:12px 0}small{color:#555}footer{margin-top:18px}</style><p>総合診断の集計と、保存済み記事役割のSBM最新状態を一画面で確認します。読み取り専用です。</p><button id="run" onclick="run()">総合診断を開始</button><p id="status" role="status" aria-live="polite">開始待ち</p><section id="diagnosisReader" hidden aria-live="polite"><h4>今回の診断結果</h4><p id="diagnosisHeadline" class="lead"></p><div id="diagnosisKpis" class="kpis"></div><p id="diagnosisExplanation"></p><h4>サイト全体の成長推移</h4><p id="growthTrend">GSCの検証済みデータを照合します。</p><h4>優先調査候補（収益順位ではありません）</h4><div id="growthPriorities"></div><h4>見つかった課題</h4><p id="diagnosisIssues"></p><h4>成長機会の評価</h4><p id="diagnosisOpportunity"></p><h4>S3が次に行うこと</h4><p id="diagnosisNext"></p><p><small id="diagnosisSafety"></small></p></section><div id="readerNext" hidden><p id="readerNextStatus" role="status"></p></div><details class="section" id="technicalDetails"><summary>診断の根拠・記事別の詳細を表示</summary><section id="summary" hidden></section><h4>追加調査の優先順位</h4><p><small>優先順位は調査の順序です。改善の承認やSEO効果の予測ではありません。</small></p><table><thead><tr><th>順番</th><th>検索語・記事</th><th>調査テーマ</th><th>安全条件</th></tr></thead><tbody id="priority"></tbody></table><h4>調査進捗（保存済み判定ベース）</h4><p id="progress">未確認</p><h4>検索語別・未確認証拠の整理</h4><p><small>保存済み役割から作成した確認リストです。証拠取得完了やSEO判断を意味しません。</small></p><div id="gaps"></div><button type="button" id="copyGaps" onclick="copyGaps()" disabled>調査リストをコピー</button><p id="copyStatus" role="status"></p><h4>必要な追加調査</h4><p><small>不足証拠をまとめて確認します。SBMへの処置は行いません。</small></p><div id="next" hidden></div><p id="nextstatus" role="status" aria-live="polite"></p><h4>Claude精査の保存履歴</h4><p><small>保存履歴の集計です。最新の判断・改善優先順位ではありません。下段の従来役割とは別の暫定記録です。SBMの状態は下表で別途確認します。</small></p><p id="reviewStatus" role="status">未確認</p><div id="savedReviews"></div><h4>最新精査とSBM状態による調査順序</h4><p><small>調査順序であり改善優先順位ではありません。処置は保留です。</small></p><p id="latestStatus">未確認</p><div id="latestReviews"></div><h4>過去の暫定役割（参考）</h4><p><small>下表は従来の役割台帳です。新しいClaude精査の EVIDENCE_NEEDED は上の保存履歴に記録されますが、この表を自動上書きしません。双方が異なる場合、最新精査の不足証拠を優先して確認し、役割は確定しません。</small></p><table><thead><tr><th>検索語・記事</th><th>役割</th><th>SBM状態</th><th>扱い</th></tr></thead><tbody id="rows"></tbody></table><p><small id="note"></small></p></details><footer><button onclick="google.script.host.close()">閉じる</button></footer><script>const e=id=>document.getElementById(id);let selectedQuery='';let researchPackage=null;function copyGaps(){if(!researchPackage)return;const t=JSON.stringify(researchPackage,null,2);const box=document.createElement('textarea');box.value=t;box.style.position='fixed';box.style.left='-9999px';document.body.appendChild(box);box.select();const ok=document.execCommand('copy');box.remove();e('copyStatus').textContent=ok?'コピーしました！':'コピーできません。'}function run(){e('run').disabled=true;e('status').textContent='総合診断とSBM状態を確認中…';e('rows').replaceChildren();e('priority').replaceChildren();selectedQuery='';researchPackage=null;e('copyGaps').disabled=true;e('gaps').replaceChildren();e('copyStatus').textContent='';e('nextstatus').textContent='';e('summary').hidden=true;e('diagnosisReader').hidden=true;e('readerNext').hidden=true;e('next').hidden=true;google.script.run.withSuccessHandler(x=>{e('run').disabled=false;if(!x||x.format!=='S3_M3_INTEGRATED_OVERVIEW_V1'||x.status!=='READ_ONLY'||x.publication_gate!=='HOLD'||x.content_action!=='NONE'){e('status').textContent='安全停止：結果が不正です';return}e('status').textContent='統合確認完了（役割 '+x.role_count+'記事・処置なし）';e('latestStatus').textContent='最新精査とSBM状態を照合中…';e('latestReviews').replaceChildren();google.script.run.withSuccessHandler(v=>{if(!v||!['EMPTY','PROVISIONAL'].includes(v.status)||v.publication_gate!=='HOLD'||v.content_action!=='NONE'||!Array.isArray(v.items)){e('latestStatus').textContent='安全停止：照合結果が不正です';return}e('latestStatus').textContent=v.status==='EMPTY'?'精査対象なし':'検索語 '+v.items.length+'件（SBM状態は照合時点）';v.items.forEach((r,i)=>{const p=document.createElement('p');p.textContent=(i+1)+'. '+r.query+'／'+r.stage+'／重複疑い '+r.overlap_suspected+'件／SBM処理中 '+r.sbm_active+'件／状態不明 '+r.sbm_unknown+'件';e('latestReviews').appendChild(p)})}).withFailureHandler(err=>{e('latestStatus').textContent='安全停止：'+String(err&&err.message||err)}).sssM3ReviewLivePriority();e('reviewStatus').textContent='精査記録を読み込み中…';e('savedReviews').replaceChildren();google.script.run.withSuccessHandler(v=>{if(!v||!['EMPTY','PROVISIONAL'].includes(v.status)||v.publication_gate!=='HOLD'||v.content_action!=='NONE'||!Array.isArray(v.items)){e('reviewStatus').textContent='精査記録の安全条件が不一致です';return}e('reviewStatus').textContent=v.status==='EMPTY'?'保存済み精査記録はありません':'保存済み精査記録 '+v.items.length+'検索語（最大30件、履歴の一部）';v.items.forEach(r=>{const d=document.createElement('details');const h=document.createElement('summary');h.textContent=r.query+'／保存記録 '+r.count+'行';d.appendChild(h);const t=document.createElement('p');t.textContent='保存日時（表示値）：'+r.saved_at+'／役割内訳：'+Object.entries(r.roles).map(v=>v[0]+' '+v[1]).join('、')+'。重複保存・過去の精査を含む可能性があります。';d.appendChild(t);e('savedReviews').appendChild(d)})}).withFailureHandler(err=>{e('reviewStatus').textContent='精査記録を確認できません：'+String(err&&err.message||err)}).sssM3ResearchReviewSavedSummary();e('diagnosisReader').hidden=false;e('growthTrend').textContent='GSC推移を照合中…';e('growthPriorities').textContent='調査候補を照合中…';google.script.run.withSuccessHandler(g=>{if(!g||g.format!=='S3_GROWTH_STRATEGY_V1'||g.publication_gate!=='HOLD'||g.content_action!=='NONE'){e('growthTrend').textContent='成長分析の安全条件を確認できません';return}const s=g.site_growth;const fmt=n=>Number(n).toLocaleString('ja-JP');const pct=n=>n===null?'比較不可':(n*100).toFixed(1)+'%';e('growthTrend').textContent=s.status==='READY'?'GSC対象期間：'+s.period.start+' ～ '+s.period.end+'。直近30日：'+(s.last30.status==='READY'?'クリック '+fmt(s.last30.current.clicks)+'（前期比 '+pct(s.last30.clicks_change)+'）、表示 '+fmt(s.last30.current.impressions)+'（前期比 '+pct(s.last30.impressions_change)+'）':'比較期間不足')+'。収益額は未推定。':'成長推移は未判定：'+s.reason;const target=e('growthPriorities');target.replaceChildren();(g.research_priorities||[]).slice(0,5).forEach(r=>{const p=document.createElement('p');p.textContent=r.rank+'位：'+r.query+' ／ '+r.reason+'。'+(r.already_reviewed?'既存精査を再利用。':'追加証拠を確認。');target.appendChild(p)});if(!(g.research_priorities||[]).length)target.textContent='保存済み役割から調査候補は見つかりません。';const note=document.createElement('small');note.textContent='表示順は不足証拠の調査順です。収益改善の実行順ではありません。';target.appendChild(note);e('diagnosisOpportunity').textContent=g.revenue_ranking_reason;e('diagnosisNext').textContent=g.next_action;}).withFailureHandler(err=>{e('growthTrend').textContent='成長分析を取得できません：'+String(err&&err.message||err)}).sssGrowthStrategyPreview();const dc=x.diagnosis_counts||{};const n=x.article_count||0;const monitor=Number(dc.MONITORING||0),review=Number(dc.SEARCH_REVIEW||0),noTrigger=Number(dc.OBSERVED_NO_TRIGGER||0);const ready=x.diagnosis_status==='READY';e('diagnosisHeadline').textContent=ready?'今回の診断では、'+review+'記事に検索面の追加確認が必要です。':'サイト全体の診断データが不足しています。';const cards=[['診断対象',n],['検索面の要確認',review],['モニタリング区分',monitor]];e('diagnosisKpis').replaceChildren();cards.forEach(k=>{const d=document.createElement('div');d.className='kpi';const b=document.createElement('b');b.textContent=String(k[1]);const c=document.createElement('small');c.textContent=k[0];d.append(b,c);e('diagnosisKpis').appendChild(d)});e('diagnosisExplanation').textContent=ready?'今回の判定条件では'+noTrigger+'記事に改善トリガーが見つかりませんでした。ただし「問題なし」を意味しません。'+monitor+'記事はモニタリング区分です。':'診断できない理由：'+String(x.diagnosis_reason||'データ不足');e('diagnosisIssues').textContent=review?'検索意図・記事の役割を確認すべき記事が'+review+'件あります。複数の記事が同じ検索語で表示されても、それだけで競合とは断定できません。':'今回の条件では検索面の追加確認対象はありません。ただし未検出の課題がないことは保証しません。';e('diagnosisOpportunity').textContent='ブログ全体の成長率、検索需要の未開拓領域、収益改善余地は今回の分類結果だけでは判定できません。GSC推移や検索需要などを別途照合する必要があります。';e('diagnosisNext').textContent=review?'S3が不足証拠を調べ、記事の役割を整理します。調査対象はS3が優先順位付けします。':'現在の診断結果を保存し、GSC推移などの成長分析を追加します。';e('diagnosisSafety').textContent='安全条件：記事の修正・統合・公開は行いません。SBM処理中の記事は調査のみです。';e('summary').hidden=false;e('progress').textContent='保存済み記事役割 '+x.role_count+'件／追加証拠は未確定。GSCの短期キャッシュは調査画面で確認できます。';e('next').hidden=x.role_count===0;e('readerNext').hidden=x.role_count===0;if(x.research_gaps&&x.research_gaps.format==='S3_M3_RESEARCH_GAPS_V1'&&x.research_gaps.publication_gate==='HOLD'&&x.research_gaps.content_action==='NONE'&&Array.isArray(x.research_gaps.items)){researchPackage=x.research_gaps;e('copyGaps').disabled=x.research_gaps.items.length===0;const p=document.createElement('p');p.textContent='検索語 '+x.research_gaps.query_count+'件／役割 '+x.research_gaps.article_count+'記事。すべて追加証拠待ち。';e('gaps').appendChild(p);x.research_gaps.items.forEach(g=>{const d=document.createElement('details');const h=document.createElement('summary');h.textContent=g.query+'（'+g.article_count+'記事・'+g.stage+'）';d.appendChild(h);const para=document.createElement('p');para.textContent='記事 '+g.article_ids.join('、')+'／'+g.safety;d.appendChild(para);const ul=document.createElement('ul');g.checks.forEach(c=>{const li=document.createElement('li');li.textContent=c;ul.appendChild(li)});d.appendChild(ul);e('gaps').appendChild(d)})}else{e('gaps').textContent='調査状況を確認できません。'}e('summary').textContent=x.diagnosis_status==='READY'?'総合診断：'+x.article_count+'記事／区分 '+Object.entries(x.diagnosis_counts).map(v=>v[0]+' '+v[1]).join('、'):'総合診断：未完了（'+x.diagnosis_reason+'）。役割の照合結果は表示できます。';x.priorities.forEach((r,i)=>{const tr=document.createElement('tr');[String(i+1),r.query+' / '+r.article_id,r.research_topic,r.safety].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});tr.style.cursor='pointer';tr.title='この検索語を追加調査に指定';tr.onclick=()=>{selectedQuery=r.query;Array.from(e('priority').children).forEach(row=>row.style.background='');tr.style.background='#e8f0fe';e('nextstatus').textContent='調査対象：'+selectedQuery};e('priority').appendChild(tr)});if(x.priorities.length){selectedQuery=x.priorities[0].query;e('priority').firstElementChild.style.background='#e8f0fe';e('nextstatus').textContent='調査対象：'+selectedQuery}e('note').textContent='SBM処理中 '+x.role_counts.ACTIVE+'件／状態不明 '+x.role_counts.UNKNOWN+'件／その他 '+x.role_counts.KNOWN+'件。'+x.notice;x.roles.forEach(r=>{const tr=document.createElement('tr');[r.query+' / '+r.article_id,r.role+' / '+r.confidence,r.sbm_state,r.review_status].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});e('rows').appendChild(tr)})}).withFailureHandler(err=>{e('run').disabled=false;e('status').textContent='安全停止：'+String(err&&err.message||err)}).sssM3IntegratedPreview()}function openResearch(kind){if(!['evidence','timeline','comparison','workspace'].includes(kind))return;const buttons=[...e('next').querySelectorAll('button'),...e('readerNext').querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);e('nextstatus').textContent='追加調査画面を開いています…';e('readerNextStatus').textContent='追加調査画面を開いています…';google.script.run.withSuccessHandler(()=>{google.script.host.close()}).withFailureHandler(err=>{buttons.forEach(b=>b.disabled=false);e('nextstatus').textContent='画面を開けません：'+String(err&&err.message||err);e('readerNextStatus').textContent=e('nextstatus').textContent}).sssM3IntegratedOpenResearch(kind,selectedQuery)}</script>`).setWidth(960).setHeight(700);
 SpreadsheetApp.getUi().showModalDialog(html,'ブログ総合診断');
}



/** v0.1.179: deterministic, read-only research gaps from SAVED roles only. */
function sssM3ResearchGaps_(roles){
 if(!Array.isArray(roles)||roles.length>300)throw Error('役割調査件数が不正です。');
 const grouped=new Map(), seen=new Set();
 roles.forEach(r=>{
  if(!r||typeof r.query!=='string'||!r.query.trim()||r.query.length>500||!/^A\d{6}$/.test(r.article_id)||!['GENERAL','SPECIALIST','OVERLAP_SUSPECTED','EVIDENCE_NEEDED'].includes(r.role)||!['PROVISIONAL','UNCONFIRMED'].includes(r.confidence)||!['ACTIVE','UNKNOWN','KNOWN'].includes(r.kind))throw Error('記事役割の安全条件が不正です。');
  const query=r.query.trim(),key=query+'\u0000'+r.article_id;
  if(seen.has(key))throw Error('同一記事の役割が重複しています。');seen.add(key);
  if(!grouped.has(query))grouped.set(query,[]);grouped.get(query).push(r);
 });
 const items=[...grouped].map(([query,rows])=>{
  const ids=rows.map(r=>r.article_id).sort(),rolesSeen=[...new Set(rows.map(r=>r.role))];
  const overlaps=rows.filter(r=>r.role==='OVERLAP_SUSPECTED').map(r=>r.article_id);
  const active=rows.filter(r=>r.kind==='ACTIVE').map(r=>r.article_id);
  const unknown=rows.filter(r=>r.kind==='UNKNOWN').map(r=>r.article_id);
  const checks=['検索語×記事別のGSC実績と期間を確認','実SERPの検索意図を日時付きで確認','記事本文の重複範囲・固有範囲を確認','内部リンクとcanonical・インデックスを確認','SBM最新状態と改善履歴の意味を再確認'];
  if(rows.length===1)checks[2]='当該記事の本文・検索意図を照合（競合は未判定）';
  if(overlaps.length)checks.unshift('重複疑い記事の本文と専門性を優先比較');
  const safety=active.length||unknown.length?'SBM処理中・状態不明を含むため記事処置は禁止':'証拠不足のため記事処置は禁止';
  return {query,article_ids:ids,article_count:rows.length,roles:rolesSeen,overlap_suspected_ids:overlaps,active_article_ids:active,unknown_article_ids:unknown,checks,stage:'ADDITIONAL_EVIDENCE_REQUIRED',safety,publication_gate:'HOLD',content_action:'NONE'};
 });
 items.sort((a,b)=>Number(b.overlap_suspected_ids.length>0)-Number(a.overlap_suspected_ids.length>0)||b.article_count-a.article_count||a.query.localeCompare(b.query,'ja'));
 return {format:'S3_M3_RESEARCH_GAPS_V1',source:'SAVED_ROLE_REVIEWS_ONLY',status:'PROVISIONAL',publication_gate:'HOLD',content_action:'NONE',query_count:items.length,article_count:roles.length,items,limitations:['役割は暫定。GSC短期キャッシュの有無は完了判定に使用しない','SERP・全文・検索意図の検証完了を意味しない','記事の修正・統合・新記事作成は行わない']};
}
/** v0.1.175: evidence-first research ordering, never a treatment recommendation. */
function sssM3ResearchPriorities_(rows){
 if(!Array.isArray(rows)||rows.length>300)throw Error('追加調査の入力件数が不正です。');
 const seen=new Set();
 return rows.map(r=>{
  if(!r||!/^A\d{6}$/.test(r.article_id)||typeof r.query!=='string'||!r.query.trim()||!['GENERAL','SPECIALIST','OVERLAP_SUSPECTED','EVIDENCE_NEEDED'].includes(r.role)||!['PROVISIONAL','UNCONFIRMED'].includes(r.confidence)||!['ACTIVE','UNKNOWN','KNOWN'].includes(r.kind))throw Error('追加調査の対象が不正です。');
  const key=r.query.trim()+'\u0000'+r.article_id;
  if(seen.has(key))throw Error('追加調査の対象が重複しています。');seen.add(key);
  const topic=r.role==='OVERLAP_SUSPECTED'?'本文の重複範囲・検索意図・SERPを照合':r.role==='EVIDENCE_NEEDED'?'不足する検索意図・本文・SERPを収集':r.role==='GENERAL'?'総合記事としての対象範囲と内部リンクを確認':'専門記事の固有範囲と流入検索語を確認';
  // Unknown or actively managed articles are still read-only research targets.
  const safety=r.kind==='ACTIVE'?'SBM処理中：調査のみ／処置保留':r.kind==='UNKNOWN'?'状態不明：調査のみ／処置保留':'調査のみ／処置保留';
  const weight={OVERLAP_SUSPECTED:0,EVIDENCE_NEEDED:1,GENERAL:2,SPECIALIST:3}[r.role];
  return {query:r.query,article_id:r.article_id,role:r.role,confidence:r.confidence,kind:r.kind,research_topic:topic,safety:safety,sort_weight:weight};
 }).sort((a,b)=>a.sort_weight-b.sort_weight||a.query.localeCompare(b.query,'ja')||a.article_id.localeCompare(b.article_id)).map(({sort_weight,...r})=>r);
}

/** v0.1.176: navigation only; explicit user click, no automatic article actions. */

/** v0.1.178: short-lived read-only evidence cache. Never caches SBM status or decisions. */
function sssM3EvidenceCacheKey_(kind,siteId,query,period){
 if(!['evidence','timeline'].includes(kind)||!siteId||!query||!period||!/^\d{4}-\d{2}-\d{2}$/.test(period.start)||!/^\d{4}-\d{2}-\d{2}$/.test(period.end))throw Error('証拠キャッシュの識別情報が不正です。');
 const raw=kind+'|'+siteId+'|'+query+'|'+period.start+'|'+period.end;
 const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,raw);
 return 'S3M3_'+bytes.map(b=>('0'+(b&255).toString(16)).slice(-2)).join('');
}
function sssM3EvidenceCacheRead_(kind,siteId,query,period){
 const key=sssM3EvidenceCacheKey_(kind,siteId,query,period),raw=CacheService.getScriptCache().get(key);
 if(!raw)return null;
 try{const x=JSON.parse(raw);if(x.kind!==kind||x.site_id!==siteId||x.query!==query||x.period.start!==period.start||x.period.end!==period.end||!x.payload||x.payload.publication_gate!=='HOLD'||x.payload.content_action!=='NONE')return null;return x.payload;}catch(_){return null;}
}
function sssM3EvidenceCachePut_(kind,siteId,query,period,payload){
 if(!payload||payload.publication_gate!=='HOLD'||payload.content_action!=='NONE')return false;
 const value=JSON.stringify({kind,site_id:siteId,query,period,payload});
 if(value.length>85000)return false;
 try{CacheService.getScriptCache().put(sssM3EvidenceCacheKey_(kind,siteId,query,period),value,600);return true;}catch(_){return false;}
}
function sssM3ResearchEvidenceCached(query,forceRefresh){
 const q=String(query||'').trim(),c=sssConfig_(),ref=sssM1CompactRef_(c),period=sssM3GscPlan_(ref);
 if(!period.available)throw Error(period.reason||'GSC期間を取得できません。');
 // Always revalidate candidate and source before using a cache hit.
 const candidates=sssM3ResearchEvidenceCandidates();if(candidates.status!=='PROVISIONAL'||!candidates.queries.some(x=>x.query===q))throw Error('保存済み調査候補に存在しません。');
 const cached=!forceRefresh&&sssM3EvidenceCacheRead_('evidence',c.siteId,q,period);
 if(cached)return Object.assign({},cached,{cache_status:'REUSED',cache_notice:'10分以内のGSC証拠を再利用。最新値が必要なら再取得してください。'});
 const x=sssM3ResearchEvidenceCollect(q);if(x.site_id!==c.siteId||x.query!==q||x.period.start!==period.start||x.period.end!==period.end)throw Error('証拠の期間・サイトが一致しません。');
 sssM3EvidenceCachePut_('evidence',c.siteId,q,period,x);
 return Object.assign({},x,{cache_status:'LIVE',cache_notice:'GSCから取得。10分間のみ再利用可能です。'});
}
function sssM3ResearchTimelineCached(query,forceRefresh){
 const q=String(query||'').trim(),c=sssConfig_(),ref=sssM1CompactRef_(c),period=sssM3GscPlan_(ref);
 if(!period.available)throw Error(period.reason||'GSC期間を取得できません。');
 const candidates=sssM3ResearchEvidenceCandidates();if(candidates.status!=='PROVISIONAL'||!candidates.queries.some(x=>x.query===q))throw Error('保存済み調査候補に存在しません。');
 // The history is not guaranteed current: do not cache it; only GSC evidence is cached.
 const cached=!forceRefresh&&sssM3EvidenceCacheRead_('timeline',c.siteId,q,period);
 if(cached){const history=sssM3ResearchHistoryRead_(c.siteId,cached.per_article.map(x=>x.article_id));return Object.assign({},cached,{sbm_history:history,cache_status:'REUSED',cache_notice:'GSCは10分以内の値を再利用。SBM履歴は再取得しました。'});}
 const x=sssM3ResearchTimelineCollect(q);
 if(x.site_id!==c.siteId||x.query!==q||x.windows[0].period.start!==period.start||x.windows[1].period.end!==period.end)throw Error('期間・サイトが一致しません。');
 const copy=Object.assign({},x);delete copy.sbm_history;
 sssM3EvidenceCachePut_('timeline',c.siteId,q,period,copy);
 return Object.assign({},x,{cache_status:'LIVE',cache_notice:'GSC・SBM履歴を取得しました。'});
}
function sssM3IntegratedResearchRoute_(kind){
 const routes={evidence:'sssM3ResearchEvidenceDialog',timeline:'sssM3ResearchTimelineDialog',comparison:'sssM3BodyCompareDialog',workspace:'sssM3ResearchWorkspaceDialog'};
 if(!Object.prototype.hasOwnProperty.call(routes,kind))throw Error('追加調査の画面指定が不正です。');
 return routes[kind];
}
function sssM3IntegratedOpenResearch(kind,query){
 const q=String(query||'').trim();if(q.length>500)throw Error('検索語が長すぎます。');
 if(q){const c=sssM3ResearchEvidenceCandidates();if(c.status!=='PROVISIONAL'||!c.queries.some(r=>r.query===q))throw Error('保存済み調査候補にない検索語です。再度総合診断してください。');}
 const name=sssM3IntegratedResearchRoute_(kind);
 // No write operation is called. The target dialog still validates its own evidence.
 if(name==='sssM3ResearchEvidenceDialog')sssM3ResearchEvidenceDialog(q);
 else if(name==='sssM3ResearchTimelineDialog')sssM3ResearchTimelineDialog(q);
 else if(name==='sssM3BodyCompareDialog')sssM3BodyCompareDialog(q);
 else if(name==='sssM3ResearchWorkspaceDialog')sssM3ResearchWorkspaceDialog(q);
 return {status:'OPENED',content_action:'NONE'};
}


/** v0.1.180: read-only, sequential research workflow. The client owns progression; each RPC is bounded. */
function sssM3ResearchWorkspacePlan_(candidate,query){
 if(!candidate||candidate.status!=='PROVISIONAL'||candidate.publication_gate!=='HOLD'||candidate.content_action!=='NONE'||!Array.isArray(candidate.queries))throw Error('保存済み調査候補の安全条件が不正です。');
 const q=String(query||'').trim(),r=candidate.queries.find(x=>x.query===q);
 if(!q||q.length>500||!r||!Array.isArray(r.article_ids)||r.article_ids.some(id=>!/^A\d{6}$/.test(id)))throw Error('検索語・記事IDが保存済み候補と一致しません。');
 const ids=[...new Set(r.article_ids)];
 return {format:'S3_M3_RESEARCH_WORKSPACE_PLAN_V1',query:q,site_id:candidate.site_id,article_ids:ids,compare_ids:ids.slice(0,3),steps:['GSC_EXACT_QUERY','GSC_PERIOD_AND_SBM_HISTORY',...(ids.length>=2?['PUBLIC_BODY_PARTIAL']:[])],publication_gate:'HOLD',content_action:'NONE',status:'PROVISIONAL'};
}
function sssM3ResearchWorkspacePlan(query){return sssM3ResearchWorkspacePlan_(sssM3ResearchEvidenceCandidates(),query);}
function sssM3ResearchWorkspaceDialog(initialQuery){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial,sans-serif;color:#202124;padding:20px;line-height:1.6}button{background:#1765ad;color:white;border:0;border-radius:5px;padding:9px 14px;cursor:pointer;margin-right:8px}button:disabled{opacity:.5}select{width:100%;padding:8px;box-sizing:border-box}pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:280px;overflow:auto;background:#f5f6f8;padding:12px}li{margin:8px 0}footer{border-top:1px solid #ddd;margin-top:16px;padding-top:12px}footer button{background:white;color:#222;border:1px solid #bbb}</style><h3>追加調査</h3><p>GSC実績・期間別実績とSBM履歴・公開HTMLの部分本文を順番に読み取り専用で確認します。各工程は個別に終了し、途中失敗でも取得済み結果を表示します。</p><label>検索語<select id="query" disabled><option>候補を読み込み中…</option></select></label><p><button id="run" disabled>不足証拠を収集・確認</button><button id="copy" disabled style="display:none">結果JSONをコピー</button><button id="audit" disabled style="display:none">証拠の充足状況を確認</button><button id="prompt" disabled>Claude精査依頼文をコピー</button></p><p id="status" role="status">開始待ち</p><ol id="steps"></ol><details><summary>証拠の監査結果（詳細）</summary><pre id="auditResult"></pre></details><section id="reviewSection" hidden><h4>Claude精査結果の検証（処置なし）</h4><textarea id="reviewJson" style="width:100%;height:130px;box-sizing:border-box" placeholder="Claude回答JSONを貼り付け"></textarea><p><button id="verifyReview">回答を検証する</button><button id="saveReview" disabled>検証済み結果を保存</button></p><details><summary>検証結果（詳細）</summary><pre id="reviewResult"></pre></details></section><details><summary>収集データ（詳細）</summary><pre id="result"></pre></details><p><small>収集結果は画面内に保持します。検証後に保存ボタンを押した場合のみS3専用精査台帳へ暫定結果を記録します。記事・SBM・Evidenceは変更しません。検索意図・SERP・全文は未確認です。処置は常にHOLDです。</small></p><footer><button id="back">総合診断へ戻る</button><button onclick="google.script.host.close()">閉じる</button></footer><script>const desired=${JSON.stringify(String(initialQuery||''))};const e=id=>document.getElementById(id);let report=null;let audit=null;let busy=false;let verifiedReview=null;function note(t){const li=document.createElement('li');li.textContent=t;e('steps').appendChild(li)}function fail(msg){busy=false;e('run').disabled=false;e('status').textContent='安全停止：'+msg;show()}function show(){if(!report)return;e('result').textContent=JSON.stringify(report,null,2);e('copy').disabled=false;e('audit').disabled=false}google.script.run.withSuccessHandler(x=>{if(!x||x.status!=='PROVISIONAL'||x.publication_gate!=='HOLD'||x.content_action!=='NONE'){fail('保存済み候補を確認できません');return}const sel=e('query');sel.replaceChildren();x.queries.forEach(r=>{const o=document.createElement('option');o.value=r.query;o.textContent=r.query;sel.appendChild(o)});if(desired&&Array.from(sel.options).some(o=>o.value===desired))sel.value=desired;sel.disabled=false;e('run').disabled=false;e('status').textContent='検索語を選んで開始してください。';if(desired&&sel.value===desired){e('status').textContent='保存済み証拠を照合しています…';e('run').click()}}).withFailureHandler(err=>fail(String(err&&err.message||err))).sssM3ResearchEvidenceCandidates();e('run').onclick=()=>{if(busy)return;busy=true;e('run').disabled=true;e('copy').disabled=true;e('audit').disabled=true;e('prompt').disabled=true;audit=null;verifiedReview=null;e('saveReview').disabled=true;e('auditResult').textContent='';e('reviewSection').hidden=true;e('reviewResult').textContent='';e('steps').replaceChildren();e('result').textContent='';const query=e('query').value;report={format:'S3_M3_RESEARCH_WORKSPACE_RESULT_V1',query,publication_gate:'HOLD',content_action:'NONE',status:'PARTIAL',steps:[],limitations:['SERPと検索意図は未検証','本文は公開HTMLの部分抽出','SBM状態と履歴は取得時点の値','記事処置は行わない']};e('status').textContent='調査計画を照合しています…';google.script.run.withSuccessHandler(plan=>{if(!plan||plan.format!=='S3_M3_RESEARCH_WORKSPACE_PLAN_V1'||plan.query!==query||plan.publication_gate!=='HOLD'||plan.content_action!=='NONE'){fail('調査計画の安全条件が不正です');return}report.site_id=plan.site_id;report.article_ids=plan.article_ids;const tasks=[{name:'GSC_EXACT_QUERY',method:'sssM3ResearchEvidenceCached',args:[query,false]},{name:'GSC_PERIOD_AND_SBM_HISTORY',method:'sssM3ResearchTimelineCached',args:[query,false]}];if(plan.compare_ids.length>=2)tasks.push({name:'PUBLIC_BODY_PARTIAL',method:'sssM3BodyCompareCollect',args:[query,plan.compare_ids]});let i=0;const next=()=>{if(i===tasks.length){busy=false;report.status=report.steps.every(x=>x.status==='OK')?'COLLECTED_PARTIAL_EVIDENCE':'PARTIAL';e('status').textContent='照合終了（'+report.steps.filter(x=>x.status==='OK').length+'/'+tasks.length+'工程）。記事処置なし。';e('run').disabled=false;show();e('audit').click();return}const t=tasks[i++];e('status').textContent='証拠を確認しています（'+i+'/'+tasks.length+'）：'+t.name;const ok=x=>{if(!x||x.publication_gate!=='HOLD'||x.content_action!=='NONE'||x.query!==query){report.steps.push({name:t.name,status:'REJECTED',reason:'安全条件・検索語が不一致'});note(t.name+'：安全条件不一致');next();return}report.steps.push({name:t.name,status:'OK',data:x});note(t.name+'：取得完了'+(x.cache_status?'（'+x.cache_status+'）':''));show();next()};const bad=err=>{report.steps.push({name:t.name,status:'FAILED',reason:String(err&&err.message||err).slice(0,300)});note(t.name+'：取得失敗（他の工程を継続）');show();next()};const rpc=google.script.run.withSuccessHandler(ok).withFailureHandler(bad);if(t.method==='sssM3ResearchEvidenceCached')rpc.sssM3ResearchEvidenceCached(...t.args);else if(t.method==='sssM3ResearchTimelineCached')rpc.sssM3ResearchTimelineCached(...t.args);else rpc.sssM3BodyCompareCollect(...t.args)};next()}).withFailureHandler(err=>fail(String(err&&err.message||err))).sssM3ResearchWorkspacePlan(query)};e('audit').onclick=()=>{if(!report||busy)return;const minimal={format:report.format,site_id:report.site_id,query:report.query,article_ids:report.article_ids,publication_gate:report.publication_gate,content_action:report.content_action,steps:report.steps.map(x=>({name:x.name,status:x.status,data:x.status==='OK'?{query:x.data.query,site_id:x.data.site_id,publication_gate:x.data.publication_gate,content_action:x.data.content_action}:undefined}))};e('audit').disabled=true;e('status').textContent='証拠の充足状況を検査しています…';google.script.run.withSuccessHandler(x=>{audit=x;verifiedReview=null;e('saveReview').disabled=true;e('auditResult').textContent=JSON.stringify(x,null,2);e('prompt').disabled=false;e('reviewSection').hidden=false;e('audit').disabled=false;e('status').textContent='証拠監査完了。判定は暫定・処置は保留です。'}).withFailureHandler(err=>{e('audit').disabled=false;e('status').textContent='証拠監査失敗：'+String(err&&err.message||err)}).sssM3ResearchAudit(minimal)};e('prompt').onclick=()=>{if(!audit||!report)return;const prompt='以下のS3読み取り専用証拠について、記事の役割・検索意図の仮説・不足証拠を慎重に精査してください。SERP未取得、部分本文、SBM状態の変動に注意し、統合・修正・公開の指示は出さず、HOLD/NONEのまま返答してください。\\n\\n【証拠監査】\\n'+JSON.stringify(audit,null,2)+'\\n\\n【収集結果】\\n'+JSON.stringify(report,null,2)+'\\n\\n【回答形式】\\n'+JSON.stringify({format:'S3_M3_RESEARCH_REVIEW_V1',site_id:audit.site_id,query:audit.query,publication_gate:'HOLD',content_action:'NONE',reviews:audit.article_ids.map(id=>({article_id:id,role:'EVIDENCE_NEEDED',confidence:'PROVISIONAL',reason:'根拠と制約を記載',next_evidence:['追加調査事項']}))},null,2);const t=document.createElement('textarea');t.value=prompt;t.style.position='fixed';t.style.left='-9999px';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();e('status').textContent=ok?'Claude精査依頼文をコピーしました！':'コピーできません。'};e('verifyReview').onclick=()=>{if(!audit||busy)return;verifiedReview=null;e('saveReview').disabled=true;let obj;try{obj=JSON.parse(e('reviewJson').value)}catch(err){e('reviewResult').textContent='JSONの形式が不正です：'+err.message;return}e('verifyReview').disabled=true;e('reviewResult').textContent='検証中…';google.script.run.withSuccessHandler(x=>{e('verifyReview').disabled=false;e('reviewResult').textContent=JSON.stringify(x,null,2);if(!x||x.format!=='S3_M3_RESEARCH_REVIEW_VALIDATED_V1'||x.site_id!==audit.site_id||x.query!==audit.query||x.publication_gate!=='HOLD'||x.content_action!=='NONE'||x.saved!==false||!Array.isArray(x.reviews)||x.reviews.length!==audit.article_ids.length){e('status').textContent='安全停止：検証結果の契約が不一致です';return}verifiedReview=obj;e('saveReview').disabled=false;e('status').textContent='Claude回答の検証完了（暫定・未保存・処置なし）'}).withFailureHandler(err=>{e('verifyReview').disabled=false;e('reviewResult').textContent='検証拒否：'+String(err&&err.message||err)}).sssM3ResearchReviewValidate(audit,obj)};e('saveReview').onclick=()=>{if(!audit||!verifiedReview||busy)return;e('saveReview').disabled=true;e('status').textContent='調査候補を再照合してS3専用台帳へ保存しています…';google.script.run.withSuccessHandler(x=>{e('reviewResult').textContent=JSON.stringify(x,null,2);e('status').textContent=x&&x.status==='SAVED'?'S3へ暫定精査結果を保存しました。記事処置なし。':x&&x.status==='ALREADY_SAVED'?'同じ精査結果は保存済みです。':'保存応答を確認できません。台帳を確認してください。'}).withFailureHandler(err=>{e('status').textContent='保存を安全停止：'+String(err&&err.message||err);e('saveReview').disabled=false}).sssM3ResearchReviewSave(audit,verifiedReview)};e('copy').onclick=()=>{if(!report)return;const t=document.createElement('textarea');t.value=JSON.stringify(report,null,2);t.style.position='fixed';t.style.left='-9999px';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();e('status').textContent=ok?'コピーしました！':'コピーできません。'};e('back').onclick=()=>{if(busy)return;e('back').disabled=true;google.script.run.withSuccessHandler(()=>google.script.host.close()).withFailureHandler(err=>{e('back').disabled=false;e('status').textContent=String(err&&err.message||err)}).sssM3IntegratedDialog()};</script>`).setWidth(900).setHeight(700);
 SpreadsheetApp.getUi().showModalDialog(html,'追加調査');
}


/** v0.1.181: deterministic evidence audit; NEVER converts partial evidence into a treatment decision. */
function sssM3ResearchAudit_(report){
 if(!report||report.format!=='S3_M3_RESEARCH_WORKSPACE_RESULT_V1'||report.publication_gate!=='HOLD'||report.content_action!=='NONE'||typeof report.query!=='string'||!report.query.trim()||!Array.isArray(report.steps)||!Array.isArray(report.article_ids))throw Error('調査結果の形式・安全条件が不正です。');
 const allowed=['GSC_EXACT_QUERY','GSC_PERIOD_AND_SBM_HISTORY','PUBLIC_BODY_PARTIAL'];
 const seen={};const issues=[];const completed=[];
 report.steps.forEach(step=>{if(!step||!allowed.includes(step.name)||seen[step.name])throw Error('調査工程の重複または不正な工程です。');seen[step.name]=true;if(step.status==='OK'){
  if(!step.data||step.data.query!==report.query||step.data.publication_gate!=='HOLD'||step.data.content_action!=='NONE'||(step.data.site_id&&report.site_id&&step.data.site_id!==report.site_id))throw Error('証拠の検索語・サイト・安全条件が不一致です。');completed.push(step.name);
 }else if(['FAILED','REJECTED'].includes(step.status)){issues.push(step.name+' の取得が未完了');}else throw Error('調査工程の状態が不正です。');});
 if(!seen.GSC_EXACT_QUERY)issues.push('検索語別GSC証拠が未取得');
 if(!seen.GSC_PERIOD_AND_SBM_HISTORY)issues.push('期間別GSCとSBM履歴が未取得');
 if(report.article_ids.length>=2&&!seen.PUBLIC_BODY_PARTIAL)issues.push('記事本文の比較証拠が未取得');
 issues.push('実際のSERP・検索意図は未確認','公開本文は部分取得であり全文確認ではない','SBMの処置直前の最新状態は未照合');
 return {format:'S3_M3_RESEARCH_AUDIT_V1',site_id:report.site_id||'',query:report.query,article_ids:report.article_ids.slice(0,100),completed_steps:completed,missing_evidence:issues,readiness:issues.length>3?'EVIDENCE_INCOMPLETE':'REVIEW_READY_PROVISIONAL',confidence:'PROVISIONAL',publication_gate:'HOLD',content_action:'NONE',next_action:'CLAUDE_REVIEW_ONLY'};
}
function sssM3ResearchAudit(report){return sssM3ResearchAudit_(report);}


/** v0.1.182: bounded, fail-closed Claude research response validation, no persistence or article actions. */
function sssM3ResearchReviewValidate_(audit, response){
 if(!audit||audit.format!=='S3_M3_RESEARCH_AUDIT_V1'||audit.publication_gate!=='HOLD'||audit.content_action!=='NONE'||!audit.query||!Array.isArray(audit.article_ids))throw Error('元の証拠監査が不正です。');
 if(!response||response.format!=='S3_M3_RESEARCH_REVIEW_V1'||response.publication_gate!=='HOLD'||response.content_action!=='NONE'||response.site_id!==audit.site_id||response.query!==audit.query||!Array.isArray(response.reviews))throw Error('Claude回答の契約・サイト・検索語が不一致です。');
 if(!audit.article_ids.length||audit.article_ids.length>20||response.reviews.length!==audit.article_ids.length)throw Error('対象記事数が一致しません。');
 const allowedRoles=['GENERAL','SPECIALIST','OVERLAP_SUSPECTED','EVIDENCE_NEEDED'];
 const known=new Set(audit.article_ids),seen=new Set();const rows=[];
 response.reviews.forEach(r=>{
  if(!r||typeof r.article_id!=='string'||!known.has(r.article_id)||seen.has(r.article_id)||!allowedRoles.includes(r.role)||r.confidence!=='PROVISIONAL'||typeof r.reason!=='string'||!r.reason.trim()||r.reason.length>4000||!Array.isArray(r.next_evidence)||r.next_evidence.length>15||r.next_evidence.some(v=>typeof v!=='string'||v.length>500))throw Error('記事ID・役割・暫定判定・追加証拠が不正です。');
  seen.add(r.article_id);rows.push({article_id:r.article_id,role:r.role,confidence:'PROVISIONAL',reason:r.reason,next_evidence:r.next_evidence.slice()});
 });
 if(audit.article_ids.some(id=>!seen.has(id)))throw Error('対象記事の回答が不足しています。');
 return {format:'S3_M3_RESEARCH_REVIEW_VALIDATED_V1',site_id:audit.site_id,query:audit.query,reviews:rows,missing_evidence:audit.missing_evidence||[],decision:'RESEARCH_ONLY',confidence:'PROVISIONAL',publication_gate:'HOLD',content_action:'NONE',saved:false,limitations:['検索意図・SERP・全文は未検証','SBM状態は処置前に再照合が必要','記事処置・紹介状は作成しない']};
}
function sssM3ResearchReviewValidate(audit,response){return sssM3ResearchReviewValidate_(audit,response);}


/** v0.1.185: save only provisional research reviews in an isolated S3 ledger. */
function sssM3ResearchReviewSave_(audit,response,candidate,cfg,ss,lock){
 const verified=sssM3ResearchReviewValidate_(audit,response);
 if(!cfg||!cfg.siteId||cfg.siteId!==verified.site_id)throw Error('現在のサイトと精査結果が一致しません。');
 if(!candidate||candidate.status!=='PROVISIONAL'||candidate.publication_gate!=='HOLD'||candidate.content_action!=='NONE'||!Array.isArray(candidate.queries))throw Error('最新の調査候補を確認できません。');
 const found=candidate.queries.find(x=>x.query===verified.query);
 if(!found||!Array.isArray(found.article_ids)||found.article_ids.length!==verified.reviews.length||found.article_ids.some(id=>!audit.article_ids.includes(id)))throw Error('調査対象記事が変更されました。保存せず停止します。');
 if(!ss||!lock||!lock.tryLock(10000))throw Error('保存先または保存ロックを確認できません。');
 try{
  const name='S3_M3_精査記録',headers=['保存日時','サイトID','検索語','記事ID','役割','確信度','理由','追加証拠','不足証拠','安全条件','保存キー'];
  let sh=ss.getSheetByName(name);
  if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);}
  else if(sh.getLastColumn()<headers.length||sh.getRange(1,1,1,headers.length).getDisplayValues()[0].some((v,i)=>v!==headers[i]))throw Error('精査記録の列構成が不一致です。上書きしません。');
  const n=sh.getLastRow();if(n>10000||n+verified.reviews.length>10001)throw Error('精査記録の上限に達しました。');
  const key=verified.site_id+'|'+verified.query+'|'+verified.reviews.map(x=>x.article_id+':'+x.role+':'+x.reason+':'+JSON.stringify(x.next_evidence)).sort().join('|');
  if(n>1&&sh.getRange(2,11,n-1,1).getDisplayValues().some(r=>r[0]===key))return {status:'ALREADY_SAVED',count:verified.reviews.length,publication_gate:'HOLD',content_action:'NONE'};
  const at=new Date().toISOString(),rows=verified.reviews.map(x=>[at,verified.site_id,verified.query,x.article_id,x.role,'PROVISIONAL',x.reason,JSON.stringify(x.next_evidence),JSON.stringify(verified.missing_evidence),'HOLD / NONE / RESEARCH_ONLY',key]);
  sh.getRange(n+1,1,rows.length,headers.length).setValues(rows);
  return {status:'SAVED',count:rows.length,publication_gate:'HOLD',content_action:'NONE',limitations:['Claude回答の内容的な真偽は未確認','記事変更・紹介状・SBM更新は行わない']};
 }finally{lock.releaseLock();}
}
function sssM3ResearchReviewSave(audit,response){
 const cfg=sssConfig_(),candidate=sssM3ResearchEvidenceCandidates();
 return sssM3ResearchReviewSave_(audit,response,candidate,cfg,SpreadsheetApp.getActiveSpreadsheet(),LockService.getDocumentLock()||LockService.getScriptLock());
}
function sssM3ResearchReviewSavedSummary(){
 const cfg=sssConfig_(),ss=SpreadsheetApp.getActiveSpreadsheet(),sh=ss&&ss.getSheetByName('S3_M3_精査記録');
 if(!sh||sh.getLastRow()<2)return {status:'EMPTY',items:[],publication_gate:'HOLD',content_action:'NONE'};
 const n=Math.min(sh.getLastRow()-1,500),rows=sh.getRange(sh.getLastRow()-n+1,1,n,11).getDisplayValues(),map=new Map();
 rows.forEach(r=>{if(r[1]!==cfg.siteId||r[9]!=='HOLD / NONE / RESEARCH_ONLY')return;const k=r[2];if(!map.has(k))map.set(k,{query:k,saved_at:r[0],count:0,roles:{GENERAL:0,SPECIALIST:0,OVERLAP_SUSPECTED:0,EVIDENCE_NEEDED:0}});const item=map.get(k);item.count++;if(Object.prototype.hasOwnProperty.call(item.roles,r[4]))item.roles[r[4]]++;});
 return {status:'PROVISIONAL',items:Array.from(map.values()).slice(0,30),publication_gate:'HOLD',content_action:'NONE',note:'保存履歴の集計。最新SBM状態・SERP・本文全文は未検証。処置の優先順位ではない。'};
}


/** v0.1.185: latest complete review per query; incomplete ledger tails never become a recommendation. */
function sssM3ReviewLatestJoin_(saved,live,siteId){
 if(!saved||!Array.isArray(saved.rows)||saved.rows.length>10000||!siteId)throw Error('精査台帳の範囲・サイトが不正です。');
 if(!live||live.status!=='PROVISIONAL'||live.publication_gate!=='HOLD'||live.content_action!=='NONE'||!Array.isArray(live.items))throw Error('SBM照合が未完了です。');
 const allowed=new Set(['GENERAL','SPECIALIST','OVERLAP_SUSPECTED','EVIDENCE_NEEDED']);
 const byQuery=new Map();
 saved.rows.forEach((r,i)=>{
  if(!Array.isArray(r)||r.length<11||r[1]!==siteId)return;
  if(r[9]!=='HOLD / NONE / RESEARCH_ONLY'||!/^A\d{6}$/.test(r[3])||!allowed.has(r[4])||r[5]!=='PROVISIONAL'||!r[10])return;
  const q=String(r[2]);if(!q||q.length>300)return;
  if(!byQuery.has(q))byQuery.set(q,new Map());
  const batches=byQuery.get(q);if(!batches.has(r[10]))batches.set(r[10],{key:r[10],at:r[0],index:i,rows:[]});
  const b=batches.get(r[10]);b.rows.push(r);b.index=Math.max(b.index,i);
 });
 const liveByQuery=new Map();live.items.forEach(r=>{if(!liveByQuery.has(r.query))liveByQuery.set(r.query,new Map());liveByQuery.get(r.query).set(r.article_id,r)});
 const result=[];
 for(const [q,articles] of liveByQuery){
  const batches=Array.from((byQuery.get(q)||new Map()).values()).sort((a,b)=>b.index-a.index);
  const selected=batches.find(b=>b.rows.length===articles.size&&new Set(b.rows.map(r=>r[3])).size===articles.size&&b.rows.every(r=>articles.has(r[3])));
  const statuses=Array.from(articles.values());const active=statuses.filter(r=>sssM3ClassifySbmState_(r.sbm_state).kind==='ACTIVE').length;
  const unknown=statuses.filter(r=>sssM3ClassifySbmState_(r.sbm_state).kind==='UNKNOWN').length;
  const overlap=selected?selected.rows.filter(r=>r[4]==='OVERLAP_SUSPECTED').length:0;
  const stage=!selected?'ADDITIONAL_REVIEW_REQUIRED':active?'SBM_ACTIVE_HOLD':unknown?'SBM_UNKNOWN_HOLD':'RESEARCH_REVIEWED_PROVISIONAL';
  result.push({query:q,article_ids:Array.from(articles.keys()).sort(),reviewed:!!selected,reviewed_at:selected?selected.at:'',overlap_suspected:overlap,sbm_active:active,sbm_unknown:unknown,stage,priority_group:!selected?1:(active||unknown?3:(overlap?2:4)),publication_gate:'HOLD',content_action:'NONE'});
 }
 result.sort((a,b)=>a.priority_group-b.priority_group||a.query.localeCompare(b.query,'ja'));
 return {format:'S3_M3_REVIEW_LIVE_PRIORITY_V1',status:'PROVISIONAL',items:result,checked_at:live.checked_at||'',publication_gate:'HOLD',content_action:'NONE',notice:'優先順位は追加調査の順序のみ。保存履歴とSBM状態を照合。SERP・全文は未確認。記事処置なし。'};
}
function sssM3ReviewLivePriority(){
 const cfg=sssConfig_(),ss=SpreadsheetApp.getActiveSpreadsheet(),sh=ss&&ss.getSheetByName('S3_M3_精査記録');
 const live=sssM3RoleLivePreview();
 if(live.status==='EMPTY')return {format:'S3_M3_REVIEW_LIVE_PRIORITY_V1',status:'EMPTY',items:[],publication_gate:'HOLD',content_action:'NONE'};
 let rows=[];
 if(sh&&sh.getLastRow()>1){if(sh.getLastRow()>10001||sh.getLastColumn()<11)throw Error('精査台帳の範囲が不正です。');rows=sh.getRange(2,1,sh.getLastRow()-1,11).getDisplayValues();}
 return sssM3ReviewLatestJoin_({rows},live,cfg.siteId);
}
