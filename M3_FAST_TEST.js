const fs=require('fs'),vm=require('vm'),c=vm.createContext({});
vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),c);
vm.runInContext(`const r=sssM3QuickSummarize_([{article_id:'A1',url:'u',state:'未着手'},{article_id:'A1',url:'',state:'モニター中'},{article_id:'',url:'x',state:'未着手'}],'test','NO_EVIDENCE');if(r.articles!==3||r.states['未着手']!==2||r.duplicateIds[0]!=='A1'||r.missingId!==1||r.missingUrl!==1||r.gsc!=='NOT_LOADED')throw Error('fast snapshot mismatch');`,c);
const src=fs.readFileSync(__dirname+'/Code.gs','utf8');const f=src.slice(src.indexOf('function sssM3RunPreview(){'),src.indexOf('function sssM3Preview(){'));if(/sssM1Load_\(|sssM2LoadQueryEvidence_\(|Utilities\.unzip\(/.test(f))throw Error('heavy evidence path in fast preview');
console.log('PASS M3 fast snapshot / no ZIP in preview');
