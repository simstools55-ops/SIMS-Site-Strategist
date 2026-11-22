const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c=vm.createContext({Map,Set});vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),c);
const articles=[{article_id:'A1',url:'https://example.com/entry/a'},{article_id:'A2',url:'https://example.com/entry/b'},
 {article_id:'A3',url:'https://example.com/entry/b/'},{article_id:'A4',url:''}];
const pages=[{url:'https://example.com/entry/a',clicks:2,impressions:10},
 {url:'https://example.com/entry/a?utm=1',clicks:0,impressions:4},
 {url:'https://example.com/entry/b',clicks:0,impressions:5},
 {url:'https://example.com/entry/other',clicks:0,impressions:3},
 {url:'javascript:alert(1)',clicks:0,impressions:0}];
const r=c.sssM3MatchPageRows_(articles,pages);
assert.equal(r.counts.EXACT,1);assert.equal(r.counts.NORMALIZED,1);
assert.equal(r.counts.AMBIGUOUS,1);assert.equal(r.counts.UNMATCHED,1);
assert.equal(r.counts.INVALID_URL,1);
assert.equal(r.rows[2].article_id,null);assert.equal(r.content_action,'NONE');
assert.equal(r.invalid_articles.length,1);
console.log('PASS M3 conservative page ownership matching');
