const fs=require('fs'),vm=require('vm'),assert=require('assert');const c=vm.createContext({});vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),c);vm.runInContext(`
function check(x){if(!x)throw Error('adapter assertion')}
const parser=(s,d)=>s.split('\\n').map(l=>l.split(d));
let rows=sssM2ImportKeywords_('説明\\nKeyword\\tAvg. monthly searches\\tCompetition\\nコシアブラ 増やし方\\t100～1,000\\tHigh\\nzero\\t0\\tLow\\nunknown\\t\\tLow','test.tsv',parser);
check(rows.length===3&&rows[0].demand.volume.max===1000&&rows[1].demand.volume.status==='ZERO'&&rows[2].demand.volume.status==='UNKNOWN');
check(sssM2ImportKeywords_('キーワード,月間検索数\\nfoo,100','test.csv',parser)[0].demand.volume.min===100);
let records=Array.from({length:454},(_,i)=>({article_id:String(i),title:i===453?'コシアブラ 増やし方':'別主題',match_status:i===453?'SBM_ONLY':'MATCHED'}));
let x=sssM2InventoryCandidates_('コシアブラ 増やし方',{records},20);check(x.scanned===454&&x.hit_count===1&&x.candidates[0].article_id==='453'&&x.ownership==='UNCONFIRMED');
`,c);console.log('PASS M2 adapters (mock CSV parser)');
