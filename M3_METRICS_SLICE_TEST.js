const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx=vm.createContext({Map,Set});vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),ctx);
const m=ctx.sssM3MatchPageRows_([{article_id:'A1',url:'https://example.com/a'},{article_id:'A2',url:'https://example.com/b'},{article_id:'A3',url:'https://example.com/b/'}],[{url:'https://example.com/a',clicks:2,impressions:10},{url:'https://example.com/a?x=1',clicks:1,impressions:4},{url:'https://example.com/b',clicks:0,impressions:8},{url:'https://example.com/other',clicks:1,impressions:3}]);
const r=ctx.sssM3AggregateMatchSlice_(m);
assert.equal(r.articles.length,1);assert.equal(r.articles[0].article_id,'A1');assert.equal(r.articles[0].clicks,3);assert.equal(r.articles[0].impressions,14);
assert.equal(r.unassigned.impressions,11);assert.equal(r.counts.AMBIGUOUS,1);assert.equal(r.counts.UNMATCHED,1);assert.equal(r.content_action,'NONE');
assert.throws(()=>ctx.sssM3AggregateMatchSlice_({format:'S3_M3_PAGE_MATCH_V1',rows:[{status:'EXACT',article_id:'A1',clicks:9,impressions:2}]}));
console.log('PASS M3 bounded metrics aggregation');
