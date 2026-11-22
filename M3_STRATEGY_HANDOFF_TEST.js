const assert=require('assert');const vm=require('vm');vm.runInThisContext(require('fs').readFileSync(__dirname+'/Code.gs','utf8').split('function sssM3StrategyHandoffBuild_(').pop().replace(/^/,'function sssM3StrategyHandoffBuild_('));
const row={query:'youtube 自動再生 オフ',impressions:48000,clicks:120,observed_pages:10,article_ids:['A000015','A000026'],category:'ROLE_REVIEW',reason:'複数記事を観測',publication_gate:'HOLD',content_action:'NONE'};
const p={format:'S3_M3_STRATEGY_HANDOFF_INPUT_V1',site_id:'a1a12e5329f860bde86e',period:{start:'2025-10-28',end:'2026-10-27'},results:[row]};
const r=sssM3StrategyHandoffBuild_(p);assert.equal(r.status,'READY');assert.equal(r.query_count,1);assert.equal(r.publication_gate,'HOLD');assert(r.prompt.includes('A000026'));assert(r.prompt.includes('検索意図'));assert(r.prompt.includes('S3_M3_STRATEGY_CLAUDE_RESPONSE_V1'));
assert.throws(()=>sssM3StrategyHandoffBuild_({...p,results:[row,row]}));assert.throws(()=>sssM3StrategyHandoffBuild_({...p,results:[{...row,content_action:'PUBLISH'}]}));assert.throws(()=>sssM3StrategyHandoffBuild_({...p,results:[{...row,article_ids:['A000015','A000015']}]}));assert.throws(()=>sssM3StrategyHandoffBuild_({...p,results:[{...row,clicks:48001}]}));assert.throws(()=>sssM3StrategyHandoffBuild_({...p,period:{start:'2026-10-28',end:'2025-10-27'}}));
console.log('M3_STRATEGY_HANDOFF_TEST OK');

const good={format:'S3_M3_STRATEGY_CLAUDE_RESPONSE_V1',site_id:p.site_id,publication_gate:'HOLD',content_action:'NONE',reviews:[{query:row.query,assessment:'ROLE_REVIEW',confidence:'UNCONFIRMED',observed_article_ids:row.article_ids,reason:'本文とSERPは未確認',next_evidence:['検索意図を確認']} ]};
assert.equal(sssM3StrategyHandoffValidate_(p,JSON.stringify(good)).status,'REVIEWED');
assert.throws(()=>sssM3StrategyHandoffValidate_(p,JSON.stringify({...good,publication_gate:'PASS'})));
assert.throws(()=>sssM3StrategyHandoffValidate_(p,JSON.stringify({...good,reviews:[{...good.reviews[0],observed_article_ids:['A000015']}]})));
assert.throws(()=>sssM3StrategyHandoffValidate_(p,'not json'));
console.log('M3_STRATEGY_RESPONSE_VALIDATION OK');
