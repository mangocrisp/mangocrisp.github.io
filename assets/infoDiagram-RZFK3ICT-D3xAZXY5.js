import{_ as e,l as o,J as i,j as n,K as p}from"./mermaid.core-CznAo-uv.js";import{p as g}from"./gitGraph-YCYPL57B-DE1BgPzQ.js";import"./app-B1CutrjV.js";import"./commonjsHelpers-Cpj98o6Y.js";import"./transform-B023kV5i.js";import"./baseUniq-DF1HKlYw.js";import"./basePickBy-Yeex65JY.js";import"./clone-u_GcY1Vu.js";var m={parse:e(async r=>{const a=await g("info",r);o.debug(a)},"parse")},v={version:p},d=e(()=>v.version,"getVersion"),c={getVersion:d},l=e((r,a,s)=>{o.debug(`rendering info diagram
`+r);const t=i(a);n(t,100,400,!0),t.append("g").append("text").attr("x",100).attr("y",40).attr("class","version").attr("font-size",32).style("text-anchor","middle").text(`v${s}`)},"draw"),f={draw:l},E={parser:m,db:c,renderer:f};export{E as diagram};
