import{M as F,I as k}from"./ServerCall.bf212017.js";import{_ as T}from"./NavBar.1d7fa6fb.js";import{_ as W}from"./CardBox.b1a10a53.js";import{_ as E}from"./CardBoxWidget.2a1575f3.js";import{_ as d}from"./BaseButton.060f3a5f.js";import{U as G,_ as O}from"./LayoutAuthenticated.ccaeb884.js";import{_ as Q}from"./_plugin-vue_export-helper.cdc0426e.js";import{C}from"./ChallengeController.31bb59b5.js";import{a as t,j as R,I as Y,P as z,u as H,x as J,M as K,o as r,c as g,w as c,b as n,g as a,e as m,f,h as v,F as X,A as Z,t as I,W as ee,S as oe,U as te}from"./index.8eef5a34.js";import{L as ae}from"./LoadingSpinner.708020bb.js";import{u as se}from"./session.f47d2680.js";import{_ as le}from"./FormField.8a5b2723.js";import{_ as ne}from"./FormControl.b755056f.js";import{u as re}from"./alerts.ef7819ba.js";import"./numeral.3c5f875f.js";import"./BaseIcon.86eb869a.js";import"./BaseLevel.c2afcd4c.js";import"./PillTag.2f043243.js";import"./LoginController.5d91ed5e.js";const A=p=>(oe("data-v-2c78de81"),p=p(),te(),p),ie={class:"flex justify-between pb-5"},ce={class:"flex gap-2 items-center"},ue=A(()=>a("p",{class:"lg:text-xl text-lg"},"Campaigns",-1)),de={class:"flex gap-2 items-center edit-search"},me={key:0,class:"grid min-w-[50%] gap-6 mb-6"},fe={key:1,class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"},pe={class:"flex justify-between mb-2"},_e={class:"font-extrabold text-lg"},ge={class:"flex grid-cols-3"},ve=["src"],he={class:"text-sm font-light col-span-2"},xe={class:"flex flex-col"},ye=A(()=>a("div",{class:"flex flex-row justify-around"},null,-1)),Ce={class:"flex justify-end gap-3"},be={key:2,class:"flex justify-center h-10"},we={key:3,class:"flex align-center justify-center h-screen"},Se={__name:"CampaignsView",setup(p){se();const $="https://chgsdev.shareity.com/",l=t([]),V=re();t([]);const i=t(Boolean);t({});const B=t(""),D=R(()=>j()),M=t({});t(null),t(!1);let _=t(18);const u=t(""),h=t(0),x=t(!0),b=t(!1);function j(){return l.value.filter(o=>o.name.includes(B.value))}Y(u,async(o,e)=>{o?L():S()});const L=async()=>{u||console.log("se acabo la busqueda :>> "),l.value=[];let o={search:u.value,items:_.value};const e=await C.getData(o);console.log("cris",e),l.value=e.page,x.value=!1};z(async()=>{M.value=await G.getMyProfile(),i.value=!0});const N=H();function w(o,e,y){localStorage.setItem("shareMessage",e),N.push({name:y,query:{id:o}})}function U(){V.createAlert({title:"It has not yet been approved",color:"error",icon:"$warning",text:b.value})}const P=async()=>{if(l.value.length>=18){h.value++;let o={page:h.value,items:_.value};console.log("pages.value :>> ",h.value),console.log("itemsScroll.value :>> ",_.value);try{await C.getChallengeDashboard(o).then(e=>{console.log("data :>> ",e),l.value=[...l.value,...e.page],console.log("causes.value :>> ",l.value)})}catch(e){console.log("error :>> ",e)}}},S=async()=>{i.value=!0,x.value=!0;let o={page:1,items:_.value};try{await C.getChallengeDashboard(o).then(e=>{l.value=e.page,i.value=!1})}catch(e){console.log("error :>> ",e)}};return J(()=>{S()}),(o,e)=>{const y=K("CardBoxComponentTitle");return r(),g(O,null,{default:c(()=>[n(T,null,{default:c(()=>[a("div",ie,[a("div",ce,[n(d,{to:"/dashboard",icon:m(F),color:"info","rounded-full":"",small:""},null,8,["icon"]),ue]),a("div",de,[n(le,null,{default:c(()=>[n(ne,{modelValue:u.value,"onUpdate:modelValue":e[0]||(e[0]=s=>u.value=s),icon:o.mdiAccountBox,value:"Search"},null,8,["modelValue","icon"])]),_:1}),b.value?(r(),g(d,{key:0,onClick:U,class:"mr-5",label:"Add Challenge",color:"info",icon:m(k)},null,8,["icon"])):(r(),g(d,{key:1,class:"mr-5",label:"Add Challenge",color:"info",icon:m(k),to:"/campaigns/form/0"},null,8,["icon"]))])]),!i.value&&l.value.length<0?(r(),f("div",me,[n(E,{icon:o.mdiCartOutline,label:"It seems that there are no campaigns related to you yet :(",content:'You can create a challenge by clicking on the "+ Add Challenge" button!'},null,8,["icon"])])):v("",!0),!i.value&&l.value.length>0?(r(),f("div",fe,[(r(!0),f(X,null,Z(D.value,s=>(r(),g(W,{key:s.id},{footer:c(()=>[a("div",xe,[ye,a("div",Ce,[n(d,{class:"mt-3 text-lg font-bold",small:"",label:"Show Info",color:"success",onClick:q=>w(s.id,s.shareMessageShort,"campaigns/info")},null,8,["onClick"]),n(d,{class:"mt-3 text-lg font-bold italic",small:"",label:"Go Live",color:"info",onClick:q=>w(s.id,s.shareMessageShort,"presentation")},null,8,["onClick"])])])]),default:c(()=>[n(y,{title:"With title & icon"},{default:c(()=>[a("div",pe,[a("p",_e,I(s.name),1)])]),_:2},1024),a("div",ge,[a("img",{class:"col-span-1 mr-3",src:m($)+s.badge,style:{height:"64px",width:"64px"}},null,8,ve),a("p",he,I(s.description),1)])]),_:2},1024))),128))])):v("",!0),!i.value&&x.value?(r(),f("div",be,[n(m(ee),{onInfinite:e[1]||(e[1]=s=>P())})])):v("",!0),i.value?(r(),f("div",we,[n(ae)])):v("",!0)]),_:1})]),_:1})}}},Oe=Q(Se,[["__scopeId","data-v-2c78de81"]]);export{Oe as default};