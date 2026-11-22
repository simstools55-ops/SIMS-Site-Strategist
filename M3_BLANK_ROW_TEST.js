const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/Code.gs','utf8');const c=vm.createContext({});vm.runInContext(src,c);
vm.runInContext(`
const h=['ArticleID','記事URL','記事タイトル','作業状態'];
const a=sssM1Articles_([h,['A1','https://example.com/a','a','未着手'],['','','',''],['A2','https://example.com/b','b','完了']]);
if(a.length!==2||a[0].source_row!==2||a[1].source_row!==4)throw Error('blank-row source offset');
const st={format:'S3_M3_BATCH_V1',site_id:'s',property:'p',manager_id:'m',next_row:5,total_rows:10,processed:2,scanned_rows:3,header_signature:'12345678'};
sssM3BatchValidate_(st,{siteId:'s',propertyUri:'p'},'m');
let rejected=false;try{sssM3BatchValidate_({...st,scanned_rows:2},{siteId:'s',propertyUri:'p'},'m')}catch(e){rejected=true}if(!rejected)throw Error('inconsistent cursor accepted');
`,c);
assert(src.includes('s.scanned_rows=s.next_row-2'));
assert(src.includes("台帳走査："));
console.log('PASS M3 blank-row cursor, scanned vs processed, checkpoint consistency');
