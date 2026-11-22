const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(__dirname+'/S3_SBM_Strategy_Bridge.gs','utf8');const ctx=vm.createContext({});vm.runInContext(code,ctx);
const proposal={format:'S3_SBM_STRATEGY_PROPOSAL_V1',site_id:'site-a',items:[{proposal_id:'S3-A000026-12345678',article_id:'A000026',query:'test'}]};
const fb={format:'SBM_S3_FEEDBACK_V1',site_id:'site-a',status:'RECONCILED_HOLD',publication_gate:'HOLD',content_action:'NONE',items:[{proposal_id:'S3-A000026-12345678',article_id:'A000026',query:'test',decision:'HOLD',execution_allowed:false}]};
assert.equal(ctx.sssStrategyFeedbackValidate_(fb,proposal).ok,true);
for(const change of [{site_id:'other'},{status:'APPROVED'},{items:[]},{items:[{...fb.items[0],execution_allowed:true}]}])assert.throws(()=>ctx.sssStrategyFeedbackValidate_({...fb,...change},proposal));
console.log('PASS S3 feedback 5 checks');
