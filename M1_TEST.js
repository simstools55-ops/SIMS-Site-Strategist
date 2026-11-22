const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx=vm.createContext({console});vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),ctx);
vm.runInContext(`
const scope=sssP72PropertyScope_('https://example.com/');
const rows=Array.from({length:300},(_,i)=>({article_id:'A'+i,url:'https://example.com/'+i}));
const pages=new Map(rows.slice(0,245).map(a=>[a.url,{365:{clicks:0}}]));
let result=sssM1Join_(rows,pages,scope);
if(result.records.length!==300||result.counts.MATCHED!==245||result.counts.SBM_ONLY!==55||result.records[299].metrics!==null)throw Error('300 article reconciliation');
const extra=[{article_id:'dup',url:'https://example.com/A'},{article_id:'dup',url:'https://example.com/a'},{article_id:'x',url:'https://other.com/a'},{article_id:'y',url:''},{article_id:'z',url:'https://example.com/q?x=1'}];
result=sssM1Join_(extra,new Map([['https://example.com/q',{}]]),scope);
if(result.counts.AMBIGUOUS!==2||result.counts.OUT_OF_SCOPE!==1||result.counts.INVALID_URL!==1||result.counts.MATCHED!==1||result.gscOnly.length!==0)throw Error('edge cases');
const parsed=sssM1Articles_([['ArticleID','記事URL','H1タイトル','作業状態'],['A1','https://example.com/','title','未着手'],['','','','']]);
if(parsed.length!==1||parsed[0].published_at!==null)throw Error('table parser');
`,ctx);console.log('PASS: inventory 300/245/55, duplicate IDs, scope, invalid URL, query normalization, empty rows');
