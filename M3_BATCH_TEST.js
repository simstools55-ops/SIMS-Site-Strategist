const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c=vm.createContext({});vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),c);
vm.runInContext(`const s={format:'S3_M3_BATCH_V1',site_id:'x',property:'p',manager_id:'m',next_row:2,total_rows:455,processed:0,header_signature:'12345678'};sssM3BatchValidate_(s,{siteId:'x',propertyUri:'p'},'m');let bad=false;try{sssM3BatchValidate_({...s,site_id:'other'},{siteId:'x',propertyUri:'p'},'m')}catch(e){bad=true}if(!bad)throw Error('site isolation');bad=false;try{sssM3BatchValidate_({...s,next_row:457},{siteId:'x',propertyUri:'p'},'m')}catch(e){bad=true}if(!bad)throw Error('cursor bounds');`,c);
const source=fs.readFileSync(__dirname+'/Code.gs','utf8');const f=source.slice(source.indexOf('function sssM3BatchContinue(){'),source.indexOf('function sssM3BatchStatus(){'));
assert(f.includes('Math.min(75,'));assert(!/Utilities\.unzip|sssM1Load_\(/.test(f));
console.log('PASS M3 batch validation, cursor bounds and no ZIP expansion');
