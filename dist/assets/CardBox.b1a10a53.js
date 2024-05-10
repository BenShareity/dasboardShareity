import{o as t,f as r,l as a,n as u,m as _,j as c,c as i,w as l,F as b,b as B,h as g,p as C}from"./index.8eef5a34.js";import{_ as x}from"./_plugin-vue_export-helper.cdc0426e.js";const y={__name:"CardBoxComponentBody",props:{noPadding:Boolean},setup(o){return(n,s)=>(t(),r("div",{class:u(["flex-1",{"p-6":!o.noPadding}])},[a(n.$slots,"default")],2))}},k={},v={class:"px-6 pb-6"};function $(o,n){return t(),r("footer",v,[a(o.$slots,"default")])}const w=x(k,[["render",$]]),L={__name:"CardBox",props:{rounded:{type:String,default:"rounded-2xl"},flex:{type:String,default:"flex-col"},hasComponentLayout:Boolean,hasTable:Boolean,isForm:Boolean,isHoverable:Boolean,isModal:Boolean},emits:["submit"],setup(o,{emit:n}){const s=o,m=n,d=_(),f=c(()=>d.footer&&!!d.footer()),p=c(()=>{const e=[s.rounded,s.flex,s.isModal?"dark:bg-slate-900":"dark:bg-slate-900/70"];return s.isHoverable&&e.push("hover:shadow-lg transition-shadow duration-500"),e}),h=e=>{m("submit",e)};return(e,F)=>(t(),i(C(o.isForm?"form":"div"),{class:u([p.value,"bg-white flex shadow-lg"]),onSubmit:h},{default:l(()=>[o.hasComponentLayout?a(e.$slots,"default",{key:0}):(t(),r(b,{key:1},[B(y,{"no-padding":o.hasTable},{default:l(()=>[a(e.$slots,"default")]),_:3},8,["no-padding"]),f.value?(t(),i(w,{key:0},{default:l(()=>[a(e.$slots,"footer")]),_:3})):g("",!0)],64))]),_:3},40,["class"]))}};export{L as _};
