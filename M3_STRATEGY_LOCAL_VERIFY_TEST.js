const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(__dirname+'/Code.gs','utf8');const start=code.indexOf('function sssM3StrategyDialog(){');const end=code.indexOf('function sssM3StrategyHandoffBuild_',start);assert(start>=0&&end>start);
const source=code.slice(start,end);const script=source.match(/<script>([\s\S]*?)<\/script>/);assert(script);new vm.Script(script[1]);
const m=script[1].match(/function sssM3StrategyValidateLocal_\([\s\S]*?\n}\nfunction verifyAnswer/);assert(m);const ctx={};vm.createContext(ctx);vm.runInContext(m[0].replace(/\nfunction verifyAnswer$/,''),ctx);
const payload={format:'S3_M3_STRATEGY_HANDOFF_INPUT_V1',site_id:'site123',results:[{query:'query',article_ids:['A000001','A000002']}]};
const answer={format:'S3_M3_STRATEGY_CLAUDE_RESPONSE_V1',site_id:'site123',publication_gate:'HOLD',content_action:'NONE',reviews:[{query:'query',assessment:'ROLE_REVIEW',confidence:'PROVISIONAL',observed_article_ids:['A000001','A000002'],reason:'追加確認',next_evidence:['本文']}]};
assert.strictEqual(ctx.sssM3StrategyValidateLocal_(payload,JSON.stringify(answer)).status,'REVIEWED');
for(const change of [x=>x.site_id='wrong',x=>x.publication_gate='PASS',x=>x.reviews[0].observed_article_ids=['A000001','A000003'],x=>x.reviews[0].query='other']){const x=JSON.parse(JSON.stringify(answer));change(x);assert.throws(()=>ctx.sssM3StrategyValidateLocal_(payload,JSON.stringify(x)))}
assert.throws(()=>ctx.sssM3StrategyValidateLocal_(payload,'not json'));console.log('M3 local verification passed');
