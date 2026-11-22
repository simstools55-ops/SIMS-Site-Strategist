const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(__dirname+'/Code.gs','utf8');
const a=code.indexOf('function sssM3StrategyResearchPlan_('),b=code.indexOf('function sssM3StrategyRoutingDialog(){',a);
assert(a>0&&b>a);const ctx={};vm.createContext(ctx);vm.runInContext(code.slice(a,b),ctx);
const base={format:'S3_M3_STRATEGY_ROUTING_PREFLIGHT_V1',status:'PROVISIONAL',site_id:'site',live_checked_at:'2026-11-21T00:00:00Z',publication_gate:'HOLD',content_action:'NONE',items:[
{query:'alpha',assessment:'ROLE_REVIEW',priority:'優先確認',article_ids:['A000001'],states:[{id:'A000001',state:'未着手'}],action:'EVIDENCE_REVIEW_ONLY'},
{query:'beta',assessment:'ROLE_REVIEW',priority:'優先確認',article_ids:['A000002'],states:[{id:'A000002',state:'モニター中'}],action:'EVIDENCE_REVIEW_ONLY'},
{query:'gamma',assessment:'EXISTING_REVIEW',priority:'通常確認',article_ids:['A000003'],states:[{id:'A000003',state:'完了'}],action:'EVIDENCE_REVIEW_ONLY'},
{query:'unknown',assessment:'EVIDENCE_NEEDED',priority:'通常確認',article_ids:[],states:[],action:'EVIDENCE_REVIEW_ONLY'}]};
const plan=ctx.sssM3StrategyResearchPlan_(base,5);
assert.deepStrictEqual(Array.from(plan.selected,x=>x.query),['alpha','beta','gamma']);assert.equal(plan.held_count,1);
assert.equal(plan.content_action,'NONE');assert.equal(plan.publication_gate,'HOLD');
const prompt=ctx.sssM3StrategyResearchPrompt_(plan);assert(prompt.includes('alpha')&&prompt.includes('gamma')&&prompt.includes('beta'));
assert.throws(()=>ctx.sssM3StrategyResearchPlan_({...base,live_checked_at:''},5));
assert.throws(()=>ctx.sssM3StrategyResearchPlan_({...base,content_action:'UPDATE'},5));
assert.throws(()=>ctx.sssM3StrategyResearchPlan_(base,11));
console.log('M3 strategy research tests passed');
