const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(__dirname+'/Code.gs','utf8');
const ctx={console,Map,Set,Number,String,JSON,Math,Error};vm.createContext(ctx);
vm.runInContext(code.slice(code.indexOf('function sssM3ConsolidateJournalRows_'),code.indexOf('function sssM3JournalConsolidationPreview')),ctx);
vm.runInContext(code.slice(code.indexOf('function sssM3RollupFold_'),code.indexOf('function sssM3RollupStart')),ctx);
function batch(start,end,clicks){let r='R',s='S';return [
[r,s,start,end,'ARTICLE','A',clicks,clicks+10,1,'ASSIGNED'],
[r,s,start,end,'UNASSIGNED','',0,0,0,'UNMATCHED_OR_AMBIGUOUS'],
...['EXACT','NORMALIZED','AMBIGUOUS','UNMATCHED','INVALID_URL'].map(k=>[r,s,start,end,'COUNT','',0,0,k==='EXACT'?end-start:0,k]),
[r,s,start,end,'END','',0,0,end-start,'COMMITTED']];}
const one=ctx.sssM3RollupFold_([],batch(0,1,2),'R','S',0);assert.equal(one.articles[0].clicks,2);
const two=ctx.sssM3RollupFold_(one.articles,batch(1,2,3),'R','S',1);assert.equal(two.articles[0].clicks,5);
assert.throws(()=>ctx.sssM3RollupFold_(one.articles,batch(0,1,3),'WRONG','S',1));
assert.throws(()=>ctx.sssM3RollupFold_([{article_id:'A',clicks:1,impressions:0,page_rows:1}],batch(0,1,1),'R','S',0));
console.log('M3 rollup pure tests passed');

assert.throws(()=>ctx.sssM3RollupFold_(one.articles,batch(0,1,3),'R','S',1),/不連続/);
assert.throws(()=>ctx.sssM3RollupFold_(one.articles,batch(2,3,3),'R','S',1),/不連続/);
