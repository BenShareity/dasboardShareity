import{M as j,I as E,Q as I,U as P}from"./ServerCall.bf212017.js";import{_ as S}from"./NavBar.1d7fa6fb.js";import{_ as L}from"./CardBox.b1a10a53.js";import{_ as U}from"./LayoutAuthenticated.ccaeb884.js";import{_ as u}from"./BaseButton.060f3a5f.js";import{F as v}from"./FaqController.b72c24d6.js";import"./ChallengeController.31bb59b5.js";import{u as K}from"./alerts.ef7819ba.js";import{u as O,a as _,Q as R,P as z,M as l,o as r,c as y,w as a,b as t,g as e,e as m,K as d,f as i,F as x,A as k,h as w,t as g}from"./index.8eef5a34.js";import"./session.f47d2680.js";import"./_plugin-vue_export-helper.cdc0426e.js";import"./BaseIcon.86eb869a.js";import"./LoginController.5d91ed5e.js";const G={class:"flex justify-between pb-5"},H={class:"flex gap-2 items-center"},J=e("p",{class:"font-extrabold"},"FAQ",-1),W={class:"flex gap-2 items-center"},X=e("b",null,"Delete",-1),Y={key:0,class:"p-3 bg-gray-100/50 dark:bg-slate-800"},Z={class:"relative overflow-x-auto shadow-md sm:rounded-lg"},ee={class:"table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400"},te=e("thead",{class:"text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"},[e("tr",null,[e("th",{scope:"col",class:"w-25 px-6 py-3"},[e("div",{class:"flex items-center"},"Question")]),e("th",{scope:"col",class:"w-30 px-6 py-3"},[e("div",{class:"flex items-center"},"Answer")]),e("th",{scope:"col",class:"col-auto px-6 py-3"},[e("span",{class:"text-center"},"Actions")])])],-1),se={class:"px-6 py-4"},oe={class:"px-6 py-4"},ae={class:"before:hidden lg:w-1 whitespace-nowrap"},le=e("div",{class:"p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800"},null,-1),ne=!1,xe={__name:"FaQView",setup(re){const C=O(),p=_([]),c=_(!1),h=_([]);_(!1);const A=K();R(async()=>{await v.getAll().then(o=>{p.value=o})}),z(async()=>{});async function F(o){await v.delete(o).then(()=>{A.createAlert({title:"FAQ deletd!",icon:"$warning",color:"red",text:"the FAQ has been Deleted successfully!"}),v.getAll().then(n=>{p.value=n,c.value=!1})})}function Q(o){C.push({name:"createfaq",query:{id:o.id,question:o.question,answer:o.answer}})}return(o,n)=>{const $=l("v-card-title"),B=l("v-card-text"),V=l("v-spacer"),b=l("v-btn"),D=l("v-card-actions"),q=l("v-card"),M=l("v-dialog"),N=l("TableCheckboxCell"),T=l("BaseButtons");return r(),y(U,null,{default:a(()=>[t(S,null,{default:a(()=>[e("div",G,[e("div",H,[t(u,{to:"/dashboard",icon:m(j),color:"info","rounded-full":"",small:""},null,8,["icon"]),J]),e("div",W,[t(u,{class:"mr-5",label:"Add FAQ",color:"info",icon:m(E),to:"/createfaq"},null,8,["icon"])])]),t(L,{class:"mb-6 m","has-table":""},{default:a(()=>[e("div",null,[t(M,{modelValue:c.value,"onUpdate:modelValue":n[2]||(n[2]=s=>c.value=s),width:"auto"},{default:a(()=>[t(q,null,{default:a(()=>[t($,{class:"text-h5"},{default:a(()=>[d(" Delete ")]),_:1}),t(B,null,{default:a(()=>[d("Are you sure you want to "),X,d(" this FAQ?")]),_:1}),t(D,null,{default:a(()=>[t(V),t(b,{color:"red",variant:"text",onClick:n[0]||(n[0]=s=>c.value=!1)},{default:a(()=>[d(" Cancel ")]),_:1}),t(b,{color:"green-darken-1",variant:"text",onClick:n[1]||(n[1]=s=>F(o.selectedId))},{default:a(()=>[d(" Ok ")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),h.value.length?(r(),i("div",Y,[(r(!0),i(x,null,k(h.value,s=>(r(),i("span",{key:s.id,class:"inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"},g(s.name),1))),128))])):w("",!0),e("div",Z,[e("table",ee,[te,e("tbody",null,[(r(!0),i(x,null,k(p.value,s=>(r(),i("tr",{key:s.id,class:"bg-white border-b dark:bg-gray-800 dark:border-gray-700"},[ne?(r(),y(N,{key:0,onChecked:f=>o.checked(f,s)},null,8,["onChecked"])):w("",!0),e("td",se,g(`${s.question}`),1),e("td",oe,g(s.answer),1),e("td",ae,[t(T,{type:"justify-start lg:justify-end","no-wrap":""},{default:a(()=>[t(u,{color:"danger",icon:m(I),small:"",onClick:f=>{c.value=!0,o.selectedId=s.id}},null,8,["icon","onClick"]),t(u,{class:"ml-5",color:"info",icon:m(P),small:"",onClick:f=>Q(s)},null,8,["icon","onClick"])]),_:2},1024)])]))),128))])])]),le])]),_:1})]),_:1})]),_:1})}}};export{xe as default};
