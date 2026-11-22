// Run with: node S3_FULL_REGRESSION_RUNNER.js
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert');
const root=__dirname,version=fs.readFileSync(path.join(root,'VERSION'),'utf8').trim();
const source=fs.readFileSync(path.join(root,'Code.gs'),'utf8');
const identity=JSON.parse(fs.readFileSync(path.join(root,'PRODUCT_IDENTITY.json'),'utf8'));
assert(source.includes("const SSS_VERSION = '"+version+"';"),'Runtime version mismatch');
assert.equal(identity.version,version,'Product identity mismatch');
const tests=fs.readdirSync(root).filter(x=>x.endsWith('TEST.js')).sort();
let pass=0;const failures=[];
for(const test of tests){const r=cp.spawnSync(process.execPath,[path.join(root,test)],{cwd:root,encoding:'utf8',timeout:30000});if(r.status===0)pass++;else failures.push({test,error:(r.stderr||r.stdout||'timeout').slice(0,700)});}
console.log(JSON.stringify({version,tests:tests.length,passed:pass,failed:failures.length,failures},null,2));
if(failures.length)process.exitCode=1;
