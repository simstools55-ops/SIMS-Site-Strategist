/** S3 v0.1.194: read-only strategy-to-SBM proposal contract. */
function sssStrategyProposalBuild_(siteId, growth, overview, issuedAt){
 if(!siteId||typeof siteId!=='string'||siteId.length>200)throw Error('サイト識別子が不正です');
 if(!growth||growth.format!=='S3_GROWTH_STRATEGY_V1'||growth.publication_gate!=='HOLD'||growth.content_action!=='NONE')throw Error('成長分析が未検証です');
 if(!overview||overview.format!=='S3_M3_INTEGRATED_OVERVIEW_V1'||overview.publication_gate!=='HOLD'||overview.content_action!=='NONE')throw Error('記事照合が未検証です');
 const byArticle={};(overview.roles||[]).forEach(r=>{if(r&&/^A\d{6}$/.test(r.article_id))byArticle[r.article_id]=r;});
 const items=[];const seen={};
 (growth.research_priorities||[]).slice(0,50).forEach(q=>{
  (q.article_ids||[]).forEach(id=>{
   if(!/^A\d{6}$/.test(id)||!byArticle[id])return;
   const r=byArticle[id],key=q.query+'|'+id;if(seen[key])return;seen[key]=true;
   const active=r.kind==='ACTIVE',unknown=r.kind==='UNKNOWN';
   const route=r.role==='OVERLAP_SUSPECTED'?'DOCTOR_ROLE_REVIEW':'DOCTOR_EVIDENCE_REVIEW';
   const priority=Math.max(0,Math.min(100,Number(q.score||0)-(unknown?10:0)));
   items.push({proposal_id:'S3-'+id+'-'+sssBridgeKey_(q.query),article_id:id,query:q.query,priority_score:priority,priority_basis:'調査優先度（収益期待値ではない）',recommendation:route,article_role:r.role,sbm_state_snapshot:r.sbm_state,monitoring_conflict:active,unknown_state:unknown,benefits:['検索意図と記事の役割を精査し、改善機会を見落とさない'],risks:[active?'現在のモニタリングの比較可能性を損なう可能性':'実行前に最新のSBM状態を再照合する必要', 'SERP・本文・収益データが不足する場合、改善効果を確約できない'],evidence_status:'PROVISIONAL',execution_gate:'SBM_REVIEW_REQUIRED',publication_gate:'HOLD',content_action:'NONE'});
  });
 });
 items.sort((a,b)=>b.priority_score-a.priority_score||a.proposal_id.localeCompare(b.proposal_id));
 items.forEach((x,i)=>x.rank=i+1);
 return {format:'S3_SBM_STRATEGY_PROPOSAL_V1',source:'S3',site_id:siteId,issued_at:issuedAt||'',status:'PROPOSAL_ONLY',ranking_kind:'EVIDENCE_TRIAGE_NOT_REVENUE',items:items.slice(0,100),publication_gate:'HOLD',content_action:'NONE',note:'SBMが最新状態を照合し、承認・保留・却下を決定。直接の診断依頼・記事修正・公開は不可。'};
}
function sssBridgeKey_(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');}
function sssStrategyProposalPreview(){const cfg=sssConfig_();return sssStrategyProposalBuild_(cfg.siteId,sssGrowthStrategyPreview(),sssM3IntegratedPreview(),new Date().toISOString());}
function sssStrategyProposalDialog(){
 const html=HtmlService.createHtmlOutput(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>body{font:14px Arial;padding:18px;line-height:1.6}button{padding:9px;margin:5px}pre{white-space:pre-wrap;max-height:260px;overflow:auto;background:#f6f7f9;padding:10px}</style><h3>SBM向け戦略提案（試験用）</h3><p>収益順位ではなく、証拠精査の候補です。SBMへの自動登録や記事処置は行いません。</p><button onclick="run()">提案を作成</button><button id="copy" disabled onclick="copy()">SBM受付用JSONをコピー</button><p id="status">開始待ち</p><pre id="out"></pre><button onclick="google.script.host.close()">閉じる</button><script>let payload='';function run(){document.getElementById('status').textContent='分析中…';google.script.run.withSuccessHandler(v=>{payload=JSON.stringify(v,null,2);document.getElementById('out').textContent='候補 '+v.items.length+'件。収益順位は未算定。\n'+v.items.slice(0,8).map(x=>x.rank+'. '+x.article_id+' '+x.query+'／'+x.recommendation).join('\n');document.getElementById('copy').disabled=!v.items.length;document.getElementById('status').textContent='提案作成完了（処置なし）';}).withFailureHandler(e=>{document.getElementById('status').textContent=String(e.message||e)}).sssStrategyProposalPreview()}function copy(){const t=document.createElement('textarea');t.value=payload;document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();document.getElementById('status').textContent=ok?'コピーしました！':'コピーできません';}</script>`).setWidth(700).setHeight(600);SpreadsheetApp.getUi().showModalDialog(html,'SBM向け戦略提案');}

/** S3 feedback contract: informational only; no persistent changes. */
function sssStrategyFeedbackValidate_(feedback, proposal){
 if(!feedback||feedback.format!=='SBM_S3_FEEDBACK_V1'||feedback.status!=='RECONCILED_HOLD'||feedback.publication_gate!=='HOLD'||feedback.content_action!=='NONE'||!Array.isArray(feedback.items))throw Error('SBM照合結果の安全条件が不正です');
 if(!proposal||proposal.format!=='S3_SBM_STRATEGY_PROPOSAL_V1'||feedback.site_id!==proposal.site_id)throw Error('SBM照合結果のサイトが一致しません');
 const expected={};proposal.items.forEach(x=>{if(expected[x.proposal_id])throw Error('提案IDが重複しています');expected[x.proposal_id]=x;});
 if(feedback.items.length!==proposal.items.length)throw Error('照合件数が一致しません');
 const seen={};feedback.items.forEach(x=>{const p=expected[x.proposal_id];if(!p||seen[x.proposal_id]||x.article_id!==p.article_id||x.query!==p.query||x.decision!=='HOLD'||x.execution_allowed!==false)throw Error('照合結果が提案と一致しません');seen[x.proposal_id]=true;});
 return {ok:true,site_id:feedback.site_id,checked:feedback.items.length,all_hold:true,summary:feedback.summary||{},message:'SBM最新状態の照合結果を確認しました。処置・保存は行いません'};
}
