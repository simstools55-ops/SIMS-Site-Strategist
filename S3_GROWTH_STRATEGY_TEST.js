const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('S3_Growth_Strategy.gs','utf8');new vm.Script(src);
const ctx={};vm.createContext(ctx);vm.runInContext(src,ctx);
const rows=Array.from({length:60},(_,i)=>({clicks:i<30?10:20,impressions:100,position:5}));
const c=ctx.sssGrowthCompare_(rows,30);assert.equal(c.status,'READY');assert.equal(c.clicks_change,1);assert.equal(c.current.clicks,600);assert.equal(ctx.sssGrowthCompare_(rows,90).status,'INSUFFICIENT');
const ranked=ctx.sssGrowthRank_({items:[{query:'a',article_count:3,article_ids:['A000001'],overlap_suspected_ids:['A000001'],active_article_ids:[],unknown_article_ids:[]},{query:'b',article_count:1,article_ids:['A000002'],overlap_suspected_ids:[],active_article_ids:[],unknown_article_ids:[]}]},{items:[{query:'a',count:3}]});
assert.equal(ranked.length,2);assert(ranked.every(x=>x.publication_gate==='HOLD'&&x.content_action==='NONE'));assert(ranked.find(x=>x.query==='a').already_reviewed);
assert(!fs.readFileSync('Code.gs','utf8').includes('onclick="openResearch(\'workspace\')">不足証拠を確認する'));
console.log('Growth analysis, evidence ranking, HOLD/NONE, no production manual research: PASS');
