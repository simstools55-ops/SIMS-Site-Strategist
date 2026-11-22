const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/Code.gs','utf8');
const a=src.indexOf('function sssM3StrategyLiveStates_('),b=src.indexOf('function sssM3StrategyRoutingLivePreview()',a);
const ctx={};vm.createContext(ctx);vm.runInContext(src.slice(a,b),ctx);
const live=ctx.sssM3StrategyLiveStates_('s',['A000001','A000002','A000003','A000004'],[
 {article_id:'A000001',state:'モニター中'},{article_id:'A000002',state:'未着手'},
 {article_id:'A000003',state:'完了'},{article_id:'A000003',state:'未着手'}]);
assert.equal(live.A000001,'モニター中');assert.equal(live.A000002,'未着手');
assert.equal(live.A000003,'台帳重複');assert.equal(live.A000004,'SBM未照合');
const base={format:'S3_M3_STRATEGY_ROUTING_PREFLIGHT_V1',items:[
 {article_ids:['A000001','A000002']},{article_ids:['A000002']},{article_ids:['A000003']},{article_ids:[]}],limitations:[]};
const out=ctx.sssM3StrategyLiveApply_(base,live,'now');
assert.equal(out.items[0].status,'読み取り専用調査可（処置は保留）');
assert.equal(out.items[1].status,'読み取り専用調査可（処置は保留）');
assert.equal(out.items[2].status,'読み取り専用調査可（処置は保留）');
assert.equal(out.items[3].status,'観測記事なし（調査保留）');
assert(out.items.every(x=>x.action==='EVIDENCE_REVIEW_ONLY'));assert.equal(out.items[0].treatment_blocked,true);assert.equal(out.items[1].treatment_blocked,false);assert.equal(out.items[2].treatment_blocked,true);
console.log('M3 live SBM preflight OK');
