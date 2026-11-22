const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c=vm.createContext({});vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),c);
const sig=vm.runInContext("sssM3HeaderSignature_(['ArticleID','記事URL','記事タイトル','作業状態'])",c);
const different=vm.runInContext("sssM3HeaderSignature_(['記事URL','ArticleID','記事タイトル','作業状態'])",c);
assert.notStrictEqual(sig,different,'reordered headers must be rejected');
const state={format:'S3_M3_BATCH_V1',site_id:'site',property:'property',manager_id:'manager',next_row:152,total_rows:455,processed:149,header_signature:sig};
const config={siteId:'site',propertyUri:'property'};
assert.doesNotThrow(()=>vm.runInContext('sssM3BatchValidate_('+JSON.stringify(state)+','+JSON.stringify(config)+',"manager")',c));
for(const changes of [{header_signature:null},{processed:500},{next_row:457},{site_id:'other'}]){
 const bad=Object.assign({},state,changes);
 assert.throws(()=>vm.runInContext('sssM3BatchValidate_('+JSON.stringify(bad)+','+JSON.stringify(config)+',"manager")',c));
}
console.log('PASS M3 header fingerprint and checkpoint bounds');
