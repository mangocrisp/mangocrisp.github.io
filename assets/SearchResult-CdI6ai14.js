import{u as U,f as se,g as te,h as Y,i as ae,P as le,t as re,j as ue,k as D,l as k,m as ie,w as M,n as t,p as oe,R as $,q as ne,s as ce,v as ve,C as pe,x as de,y as he,z as ye,A as me,B as ge,D as q,E as fe,F as Ee,G as He,H as j,I,J as Ae}from"./app-aSa0miLM.js";const Re=["/","/intro.html","/pageBasicTemplate.html","/code/","/note/","/reference/","/reference/aboutSite.html","/reference/gitPages.html","/ware/","/ware/soft/","/ware/soft/rabbitmq.html","/404.html","/category/","/category/%E5%8F%82%E8%80%83/","/category/%E8%BD%AF%E7%A1%AC%E4%BB%B6%E7%9F%A5%E8%AF%86/","/tag/","/tag/%E7%9F%A5%E8%AF%86/","/tag/%E5%88%86%E4%BA%AB/","/tag/%E8%BD%AF%E4%BB%B6%E7%9F%A5%E8%AF%86/","/tag/%E8%BD%AF%E4%BB%B6%E5%AE%89%E8%A3%85/","/tag/centos/","/tag/rabbitmq/","/article/","/star/","/timeline/"],we="SEARCH_PRO_QUERY_HISTORY",g=U(we,[]),ke=()=>{const{queryHistoryCount:a}=q,l=a>0;return{enabled:l,queryHistory:g,addQueryHistory:r=>{l&&(g.value=Array.from(new Set([r,...g.value.slice(0,a-1)])))},removeQueryHistory:r=>{g.value=[...g.value.slice(0,r),...g.value.slice(r+1)]}}},L=a=>Re[a.id]+("anchor"in a?`#${a.anchor}`:""),qe="SEARCH_PRO_RESULT_HISTORY",{resultHistoryCount:_}=q,f=U(qe,[]),Be=()=>{const a=_>0;return{enabled:a,resultHistory:f,addResultHistory:l=>{if(a){const r={link:L(l),display:l.display};"header"in l&&(r.header=l.header),f.value=[r,...f.value.slice(0,_-1)]}},removeResultHistory:l=>{f.value=[...f.value.slice(0,l),...f.value.slice(l+1)]}}},Fe=a=>{const l=pe(),r=Y(),B=de(),i=D(0),A=k(()=>i.value>0),h=he([]);return ye(()=>{const{search:y,terminate:F}=me(),E=ge(c=>{const H=c.join(" "),{searchFilter:Q=d=>d,splitWord:x,suggestionsFilter:P,...m}=l.value;H?(i.value+=1,y(c.join(" "),r.value,m).then(d=>Q(d,H,r.value,B.value)).then(d=>{i.value-=1,h.value=d}).catch(d=>{console.warn(d),i.value-=1,i.value||(h.value=[])})):h.value=[]},q.searchDelay-q.suggestDelay);M([a,r],([c])=>E(c),{immediate:!0}),fe(()=>{F()})}),{isSearching:A,results:h}};var xe=se({name:"SearchResult",props:{queries:{type:Array,required:!0},isFocusing:Boolean},emits:["close","updateQuery"],setup(a,{emit:l}){const r=te(),B=Y(),i=ae(le),{enabled:A,addQueryHistory:h,queryHistory:y,removeQueryHistory:F}=ke(),{enabled:E,resultHistory:c,addResultHistory:H,removeResultHistory:Q}=Be(),x=A||E,P=re(a,"queries"),{results:m,isSearching:d}=Fe(P),u=ue({isQuery:!0,index:0}),v=D(0),p=D(0),T=k(()=>x&&(y.value.length>0||c.value.length>0)),S=k(()=>m.value.length>0),b=k(()=>m.value[v.value]||null),z=()=>{const{isQuery:e,index:s}=u;s===0?(u.isQuery=!e,u.index=e?c.value.length-1:y.value.length-1):u.index=s-1},G=()=>{const{isQuery:e,index:s}=u;s===(e?y.value.length-1:c.value.length-1)?(u.isQuery=!e,u.index=0):u.index=s+1},J=()=>{v.value=v.value>0?v.value-1:m.value.length-1,p.value=b.value.contents.length-1},V=()=>{v.value=v.value<m.value.length-1?v.value+1:0,p.value=0},K=()=>{p.value<b.value.contents.length-1?p.value+=1:V()},N=()=>{p.value>0?p.value-=1:J()},C=e=>e.map(s=>Ae(s)?s:t(s[0],s[1])),W=e=>{if(e.type==="customField"){const s=Ee[e.index]||"$content",[o,w=""]=He(s)?s[B.value].split("$content"):s.split("$content");return e.display.map(n=>t("div",C([o,...n,w])))}return e.display.map(s=>t("div",C(s)))},R=()=>{v.value=0,p.value=0,l("updateQuery",""),l("close")},X=()=>A?t("ul",{class:"search-pro-result-list"},t("li",{class:"search-pro-result-list-item"},[t("div",{class:"search-pro-result-title"},i.value.queryHistory),y.value.map((e,s)=>t("div",{class:["search-pro-result-item",{active:u.isQuery&&u.index===s}],onClick:()=>{l("updateQuery",e)}},[t(j,{class:"search-pro-result-type"}),t("div",{class:"search-pro-result-content"},e),t("button",{class:"search-pro-remove-icon",innerHTML:I,onClick:o=>{o.preventDefault(),o.stopPropagation(),F(s)}})]))])):null,Z=()=>E?t("ul",{class:"search-pro-result-list"},t("li",{class:"search-pro-result-list-item"},[t("div",{class:"search-pro-result-title"},i.value.resultHistory),c.value.map((e,s)=>t($,{to:e.link,class:["search-pro-result-item",{active:!u.isQuery&&u.index===s}],onClick:()=>{R()}},()=>[t(j,{class:"search-pro-result-type"}),t("div",{class:"search-pro-result-content"},[e.header?t("div",{class:"content-header"},e.header):null,t("div",e.display.map(o=>C(o)).flat())]),t("button",{class:"search-pro-remove-icon",innerHTML:I,onClick:o=>{o.preventDefault(),o.stopPropagation(),Q(s)}})]))])):null;return ie("keydown",e=>{if(a.isFocusing){if(S.value){if(e.key==="ArrowUp")N();else if(e.key==="ArrowDown")K();else if(e.key==="Enter"){const s=b.value.contents[p.value];h(a.queries.join(" ")),H(s),r.push(L(s)),R()}}else if(E){if(e.key==="ArrowUp")z();else if(e.key==="ArrowDown")G();else if(e.key==="Enter"){const{index:s}=u;u.isQuery?(l("updateQuery",y.value[s]),e.preventDefault()):(r.push(c.value[s].link),R())}}}}),M([v,p],()=>{var e;(e=document.querySelector(".search-pro-result-list-item.active .search-pro-result-item.active"))==null||e.scrollIntoView(!1)},{flush:"post"}),()=>t("div",{class:["search-pro-result-wrapper",{empty:a.queries.length?!S.value:!T.value}],id:"search-pro-results"},a.queries.length?d.value?t(oe,{hint:i.value.searching}):S.value?t("ul",{class:"search-pro-result-list"},m.value.map(({title:e,contents:s},o)=>{const w=v.value===o;return t("li",{class:["search-pro-result-list-item",{active:w}]},[t("div",{class:"search-pro-result-title"},e||i.value.defaultTitle),s.map((n,ee)=>{const O=w&&p.value===ee;return t($,{to:L(n),class:["search-pro-result-item",{active:O,"aria-selected":O}],onClick:()=>{h(a.queries.join(" ")),H(n),R()}},()=>[n.type==="text"?null:t(n.type==="title"?ne:n.type==="heading"?ce:ve,{class:"search-pro-result-type"}),t("div",{class:"search-pro-result-content"},[n.type==="text"&&n.header?t("div",{class:"content-header"},n.header):null,t("div",W(n))])])})])})):i.value.emptyResult:x?T.value?[X(),Z()]:i.value.emptyHistory:i.value.emptyResult)}});export{xe as default};
