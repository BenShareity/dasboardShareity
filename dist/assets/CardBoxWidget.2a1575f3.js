import{_ as d}from"./CardBox.b1a10a53.js";import"./numeral.3c5f875f.js";import{_ as m}from"./BaseIcon.86eb869a.js";import{_ as c}from"./BaseLevel.c2afcd4c.js";import{h as f,i as y,j as p}from"./ServerCall.bf212017.js";import{_ as g}from"./PillTag.2f043243.js";import{j as h,o as l,c as n,w as a,b as i,h as u,g as o,K as _,t as s}from"./index.8eef5a34.js";import{_ as x}from"./BaseButton.060f3a5f.js";const S={__name:"PillTagTrend",props:{trend:{type:String,required:!0},trendType:{type:String,default:null},small:Boolean},setup(e){const t=e,r=h(()=>t.trendType==="up"?{icon:f,style:"success"}:t.trendType==="down"?{icon:y,style:"danger"}:t.trendType==="alert"?{icon:p,style:"warning"}:{style:"info"});return(k,w)=>(l(),n(g,{label:e.trend,color:r.value.style,icon:r.value.icon,small:e.small},null,8,["label","color","icon","small"]))}},b={class:"text-lg leading-tight text-gray-500 dark:text-slate-400"},T={class:"text-lg leading-tight text-gray-500 dark:text-slate-400"},P={__name:"CardBoxWidget",props:{number:{type:String,default:null},prefix:{type:String,default:null},suffix:{type:String,default:null},icon:{type:String,default:null},label:{type:String,default:null},color:{type:String,default:null},trend:{type:String,default:null},trendType:{type:String,default:null},content:{type:String,default:null}},setup(e){return(t,r)=>(l(),n(d,null,{default:a(()=>[e.trend?(l(),n(c,{key:0,class:"mb-3",mobile:""},{default:a(()=>[i(S,{trend:e.trend,"trend-type":e.trendType,small:""},null,8,["trend","trend-type"]),i(x,{icon:t.mdiPencilBoxMultiple,"icon-w":"w-4","icon-h":"h-4",color:"lightDark",small:""},null,8,["icon"])]),_:1})):u("",!0),i(c,{mobile:""},{default:a(()=>[o("div",null,[o("h3",b,[_(s(e.label)+" "+s(e.icon)+" ",1),e.icon?(l(),n(m,{key:0,path:e.icon,size:40},null,8,["path"])):u("",!0)]),o("h1",T,s(e.content),1)])]),_:1})]),_:1}))}};export{P as _};