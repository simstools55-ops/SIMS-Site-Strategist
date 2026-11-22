const fs=require('fs'),vm=require('vm');const c=vm.createContext({});vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),c);vm.runInContext(`
function check(x){if(!x)throw Error('screen assertion')}
const inv={site_id:'s',run_id:'r',records:[{article_id:'1',title:'LINE 通知',url:'https://example.com/a',match_status:'MATCHED'},{article_id:'2',title:'スマホ設定',url:'https://example.com/b',match_status:'SBM_ONLY'},{article_id:'3',title:'Claude',match_status:'AMBIGUOUS'}]};
const ev={index:new Map([['line 通知',[{article_id:'2',impressions:1}]]]),period:{days:365}};const r=sssM2Screen_('LINE 通知',inv,ev);check(r.candidates.length===2&&r.risk==='MULTIPLE_ARTICLES_REVIEW'&&r.skipped===1&&r.publication_gate==='HOLD');check(sssM2Screen_('unknown',inv,null).risk==='NO_SIGNAL_NOT_CONFIRMED');check(sssM2Screen_('unknown',inv,null).observation_status==='UNAVAILABLE');
`,c);console.log('PASS M2 integrated screening');
