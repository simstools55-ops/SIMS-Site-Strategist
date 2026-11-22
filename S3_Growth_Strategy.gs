/** S3 v0.1.192 — M4/M5 read-only growth strategy; no SBM mutations. */
function sssGrowthAggregate_(rows){
  const c=rows.reduce((s,r)=>s+Number(r.clicks||0),0),i=rows.reduce((s,r)=>s+Number(r.impressions||0),0);
  const p=rows.reduce((s,r)=>s+Number(r.position||0)*Number(r.impressions||0),0);
  return {days:rows.length,clicks:c,impressions:i,ctr:i?c/i:null,position:i?p/i:null};
}
function sssGrowthCompare_(rows,n){
  if(rows.length<n*2)return {status:'INSUFFICIENT',required_days:n*2,available_days:rows.length};
  const previous=sssGrowthAggregate_(rows.slice(-2*n,-n)),current=sssGrowthAggregate_(rows.slice(-n));
  const delta=(a,b)=>b?((a-b)/b):null;
  return {status:'READY',days:n,current,previous,clicks_change:delta(current.clicks,previous.clicks),impressions_change:delta(current.impressions,previous.impressions),ctr_change:current.ctr!==null&&previous.ctr!==null?current.ctr-previous.ctr:null};
}
function sssGrowthSiteEvidence_(){
  try{
    const verified=sssVerifyMergedDailyEvidence(true);
    if(!verified||!verified.ok||verified.missingDays!==0)return {status:'UNAVAILABLE',reason:'検証済みの連続日別GSCデータがありません'};
    const blobs=Utilities.unzip(DriveApp.getFileById(verified.fileId).getBlob());
    const csvBlob=blobs.filter(b=>b.getName()==='site_daily.csv')[0];
    if(!csvBlob)return {status:'UNAVAILABLE',reason:'日別データが見つかりません'};
    const csv=Utilities.parseCsv(csvBlob.getDataAsString('UTF-8'));
    const rows=csv.slice(1).map(r=>({date:sssEvidenceDateKey_(r[0]),clicks:Number(r[1]),impressions:Number(r[2]),position:Number(r[4])})).filter(r=>/^\d{4}-\d{2}-\d{2}$/.test(r.date)&&Number.isFinite(r.clicks)&&Number.isFinite(r.impressions)&&Number.isFinite(r.position)&&r.clicks>=0&&r.impressions>=0).sort((a,b)=>a.date.localeCompare(b.date));
    if(!rows.length)return {status:'UNAVAILABLE',reason:'有効な日別データがありません'};
    return {status:'READY',source:verified.fileName,period:{start:rows[0].date,end:rows[rows.length-1].date},last30:sssGrowthCompare_(rows,30),last90:sssGrowthCompare_(rows,90),last365:sssGrowthAggregate_(rows.slice(-365)),limitations:['季節性・検索意図・収益データを未補正','GSC流入は収益そのものではありません']};
  }catch(e){return {status:'UNAVAILABLE',reason:String(e&&e.message||e).slice(0,250)};}
}
function sssGrowthRank_(gaps,reviewSummary){
  const saved={};
  (reviewSummary&&reviewSummary.items||[]).forEach(r=>{if(r&&typeof r.query==='string')saved[r.query]=Number(r.count||0);});
  return (gaps&&gaps.items||[]).map(g=>{
    const overlap=(g.overlap_suspected_ids||[]).length;
    const active=(g.active_article_ids||[]).length;
    const unknown=(g.unknown_article_ids||[]).length;
    const reviewed=Number(saved[g.query]||0)>0;
    // Evidence-triage ranking, deliberately NOT a monetary uplift score.
    const score=Math.min(100,20+Math.min(30,g.article_count*10)+Math.min(20,overlap*20)+Math.min(15,active*5)+Math.min(15,unknown*5)-(reviewed?15:0));
    const reasons=[g.article_count+'記事が関連',overlap?'重複疑い '+overlap+'記事':'検索意図の照合が必要',reviewed?'保存済み精査あり（再利用）':'保存済み精査の確認が必要'];
    return {query:g.query,article_ids:g.article_ids,score,priority_kind:'EVIDENCE_TRIAGE',reason:reasons.join('／'),already_reviewed:reviewed,sbm_active:active,sbm_unknown:unknown,recommended_route:'SBM_REVIEW_ONLY',execution_gate:'HOLD',publication_gate:'HOLD',content_action:'NONE'};
  }).sort((a,b)=>b.score-a.score||a.query.localeCompare(b.query,'ja')).map((r,i)=>Object.assign({rank:i+1},r));
}
function sssGrowthStrategyPreview(){
  const overview=sssM3IntegratedPreview();
  if(!overview||overview.publication_gate!=='HOLD'||overview.content_action!=='NONE')throw Error('総合診断の安全条件が不一致です');
  let saved={items:[]};try{saved=sssM3ResearchReviewSavedSummary();}catch(e){}
  return {format:'S3_GROWTH_STRATEGY_V1',status:'READ_ONLY',site_growth:sssGrowthSiteEvidence_(),research_priorities:sssGrowthRank_(overview.research_gaps,saved),revenue_ranking_status:'NOT_ESTIMABLE',revenue_ranking_reason:'検索語別の期間比較・競合・収益性が未検証のため、収益増加額や改善順位は断定しません。',next_action:'不足証拠はS3側で調査計画を作成。処置の提案はSBM経由とし、モニター中の前倒し改善はSBM承認ゲートで判断します。',publication_gate:'HOLD',content_action:'NONE'};
}
