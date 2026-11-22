const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('Code.gs','utf8');
assert(src.includes(".addItem('総合診断を開く', 'sssM3IntegratedDialog')"));
assert(src.includes("S3_SHOW_DEV_MENU"));
assert(!src.includes('onclick="openResearch(\'workspace\')">不足証拠を確認する'));
assert(src.includes('過去の暫定役割（参考）'));
assert(src.includes("x.format!=='S3_M3_RESEARCH_REVIEW_VALIDATED_V1'"));
assert(src.includes("x.site_id!==audit.site_id||x.query!==audit.query"));
assert(src.includes("x.publication_gate!=='HOLD'||x.content_action!=='NONE'"));
let html='';const HtmlService={createHtmlOutput(h){html=h;return {setWidth(){return this},setHeight(){return this}}}};
const SpreadsheetApp={getUi(){return {showModalDialog(){}}}};
for(const fn of ['sssM3IntegratedDialog','sssM3ResearchWorkspaceDialog']){
 const start=src.indexOf('function '+fn+'(');assert(start>=0);
 const next=src.indexOf('\nfunction ',start+15);const fragment=src.slice(start,next<0?undefined:next);
 html='';vm.runInNewContext(fragment+';'+fn+'();',{HtmlService,SpreadsheetApp});
 const match=html.match(/<script>([\s\S]*?)<\/script>/);assert(match,fn+' script missing');new vm.Script(match[1]);
}
console.log('M3 operational menu, distinction, save guard and both rendered dialogs: PASS');
