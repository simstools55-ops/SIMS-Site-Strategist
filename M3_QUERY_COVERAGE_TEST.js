const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(__dirname+'/Code.gs','utf8');const begin=source.indexOf('function sssM3QueryTokens_');const end=source.indexOf('function sssM3SiteQueryCoveragePilot(){');const ctx={Set,Map,String,Number,Error,Array};vm.createContext(ctx);vm.runInContext(source.slice(begin,end),ctx);
const f=ctx.sssM3QueryCoverageHints_;
const a=[{article_id:'A0001',title:'Chrome 太字の直し方'},{article_id:'A0002',title:'Notion パスワード管理'}];
const r=f([{query:'Chrome 太字'},{query:'Notion 重い'},{query:'未知テーマ'}],a);
assert.equal(r.query_count,3);assert.equal(r.results[0].candidates[0].article_id,'A0001');assert.equal(r.results[1].candidates[0].article_id,'A0002');assert.equal(r.results[2].coverage_hint,'NO_TITLE_SIMILARITY_IN_SAMPLE');assert.equal(r.results[2].content_action,'NONE');assert.equal(r.publication_gate,'HOLD');
assert.throws(()=>f([{query:'ABC'},{query:'ａｂｃ'}],a));assert.throws(()=>f([{query:'x'}],[a[0],a[0]]));
console.log('M3 query-title coverage tests passed');
