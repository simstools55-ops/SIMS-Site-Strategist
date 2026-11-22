const fs=require('fs'),vm=require('vm'),assert=require('assert');
const c=vm.createContext({});vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),c);
const a=c.sssM3EvidencePlan_({end:'2026-10-27',id:'c'},{end:'2026-10-28',id:'d',status:'VERIFIED'});
assert.equal(a.selected.mode,'DETAILED');assert.equal(a.zip_expansion_bounded,false);
assert.equal(c.sssM3EvidencePlan_(null,null).next_step,'VERIFY_EVIDENCE_FIRST');
assert.equal(c.sssM3EvidencePlan_({end:'2026-10-29',id:'c'},{end:'2026-10-28',id:'d',status:'VERIFIED'}).selected.mode,'COMPACT');
console.log('PASS M3 evidence selection and atomic-ZIP safety limitation');
