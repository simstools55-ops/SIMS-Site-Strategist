const fs=require('fs'),vm=require('vm');const c=vm.createContext({});vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),c);vm.runInContext(`
function check(x){if(!x)throw Error('query assertion')}
const scope=sssP72PropertyScope_('https://example.com/');
const url='https://example.com/a';const inventory={records:[{article_id:'1',title:'コシアブラ 増やし方',canonical_key:sssM1UrlInfo_(url,scope).key,match_status:'MATCHED'}]};
const rows=[['page','query','clicks','impressions','ctr','position'],[url,'コシアブラ 増やし方','0','1','0','10'],[url+'#a','コシアブラ 増やし方','0','2','0','11'],['https://other.com/a','コシアブラ 増やし方','0','1','0','10']];
const e=sssM2QueryEvidence_(rows,inventory,{days:365},scope,{rowCount:3});const s=sssM2OwnershipSignals_('コシアブラ 増やし方',inventory,e);check(s.observed.length===2&&s.observed[0].impressions===1&&e.ignored===1&&s.ownership==='UNCONFIRMED');check(sssM2OwnershipSignals_('unknown',inventory,e).observation_status==='NOT_OBSERVED');check(sssM2OwnershipSignals_('unknown',inventory,null).observation_status==='UNAVAILABLE');check(sssM2SerpGrade_('TOP10',false)==='GREEN'&&sssM2SerpGrade_('OUT',false)==='RED'&&sssM2SerpGrade_('',false)==='UNCONFIRMED'&&sssM2SerpGrade_('TOP10',true)==='BLOCK');
`,c);console.log('PASS M2 query signals and SERP bands');
