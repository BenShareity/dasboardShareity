import{u as N,H as h,a as r,P as O,Q as j,I as E,o as c,c as b,w as t,b as l,g as m,e as u,t as Q,d as L,h as w,f as Z}from"./index.8eef5a34.js";import{M as G,c as H,a1 as W,a2 as U,a3 as z}from"./ServerCall.bf212017.js";import{_ as F}from"./NavBar.1d7fa6fb.js";import{_ as J}from"./CardBox.b1a10a53.js";import{_ as i}from"./FormField.8a5b2723.js";import{_ as s}from"./FormControl.b755056f.js";import{_ as C}from"./FormFilePicker.806059ae.js";import{_ as B}from"./BaseButton.060f3a5f.js";import{_ as K}from"./BaseButtons.7d99a140.js";import{U as T,_ as X}from"./LayoutAuthenticated.ccaeb884.js";/* empty css             */import{Z as Y}from"./vue-datepicker.da2a488d.js";import{U as M}from"./utilityMethods.d9c941ff.js";import{R as ee}from"./RewardController.481794e3.js";import{u as le}from"./alerts.ef7819ba.js";import"./session.f47d2680.js";import"./_plugin-vue_export-helper.cdc0426e.js";import"./BaseIcon.86eb869a.js";import"./LoginController.5d91ed5e.js";const ae={class:"flex justify-between pb-5"},oe={class:"flex gap-2 items-center"},te={class:"font-extrabold"},ie={class:"gap-3"},se={key:4,class:"grid grid-cols-5 gap-5"},de={class:"col-span-3"},ue={class:"col-span-2"},ne={class:"grid grid-cols-1 md:grid-cols-2 gap-5 justify-items-center"},Ie={__name:"CreateRewardView",setup(re){const q=N(),n=h(),S=le(),p=r(),f=r(),v=r({}),I=r(null),$=n.query.id?"Edit":"Create",V=[{id:1,label:"Manual"},{id:2,label:"By Points"},{id:3,label:"By Influenced"}],_=[{id:1,label:"One Day"},{id:2,label:"Two Days"},{id:3,label:"A Week"},{id:4,label:"A Month"},{id:5,label:"Custom"}],g=[{id:1,label:" QR Code"},{id:2,label:"Graphics"},{id:3,label:"UPC Code"},{id:4,label:"LightBeat"}],y=r(!1);r();const e=r({title:"",description:"",stock:"",influenced:"",type:g[0],point:"",sendReward:n.query.point?V[1]:V[0],certainTime:_[0],certainTimeCustom:0});O(async()=>{v.value=await T.getMyProfile(),console.log("estoy aqui",v.value)}),j(()=>{e.value.title=n.query.name,e.value.point=n.query.point,e.value.description=n.query.description},[n.query.id]),console.log("ruta",n),E(()=>{console.log(y.value),y.value=!e.value.title||!e.value.description||!e.value.type||!e.value.stock||!p.value||!f.value});const A=d=>{p.value=d},x=d=>{f.value=d},k=()=>{e.value.stock=e.value.stock.replace(/[^0-9]/g,"")},D=async()=>{let d=v.value.id,a=v.value.rol;console.log(d),a!="admin"&&await T.getCredit(d);let o="";p&&(o=await M.verifyMedia(p.value,"rewards"));let R="";f&&(R=await M.verifyMedia(f.value,"rewards"));let P={title:e.value.title,description:e.value.description,type:e.value.type.label,point:e.value.point,influenced:e.value.influenced,imgBgReward:o,imgBadReward:R,userId:v.value.id,stock:+e.value.stock};console.log("quejesta vaina",e.value.stock),/^([1-9][0-9]?|100)$/gm.test(e.value.stock)?await ee.create(P,"Reward").then(S.createAlert({title:"Reward successfully created!",icon:"$success",text:"the reward has been createds successfully!"}),q.push("/rewards-messages")):(console.log("De 1 a 100 Stock"),I.value="Reward Stock is 1-100")};return(d,a)=>(c(),b(X,null,{default:t(()=>[l(F,null,{default:t(()=>[m("div",ae,[m("div",oe,[l(B,{icon:u(G),to:"/rewards-messages",color:"info","rounded-full":"",small:""},null,8,["icon"]),m("p",te,Q(u($))+" Reward",1)])]),l(J,{"is-form":"",class:"col-span-3",onSubmit:L(D,["prevent"])},{footer:t(()=>[l(K,{class:"justify-end"},{default:t(()=>[l(B,{color:y.value?"infoOpacity":"info",type:"submit",label:"Save",disabled:y.value},null,8,["color","disabled"])]),_:1})]),default:t(()=>[m("div",ie,[l(i,{label:"Reward Name"},{default:t(()=>[l(s,{modelValue:e.value.title,"onUpdate:modelValue":a[0]||(a[0]=o=>e.value.title=o),icon:u(H),required:""},null,8,["modelValue","icon"])]),_:1}),l(i,{label:"Reward Description"},{default:t(()=>[l(s,{modelValue:e.value.description,"onUpdate:modelValue":a[1]||(a[1]=o=>e.value.description=o),icon:u(W),required:""},null,8,["modelValue","icon"])]),_:1}),l(i,{label:"Quantity of stock you want to ship from 1 - 100"},{default:t(()=>[l(s,{modelValue:e.value.stock,"onUpdate:modelValue":a[2]||(a[2]=o=>e.value.stock=o),icon:u(U),onInput:k,placeholder:"Example 10 stock"},null,8,["modelValue","icon"])]),_:1}),e.value.sendReward.id==3?(c(),b(i,{key:0,label:"Influenced"},{default:t(()=>[l(s,{modelValue:e.value.influenced,"onUpdate:modelValue":a[3]||(a[3]=o=>e.value.influenced=o),icon:u(z),onInput:k,placeholder:"Influenced"},null,8,["modelValue","icon"])]),_:1})):w("",!0),e.value.sendReward.id==2||u(n).query.point?(c(),b(i,{key:1,label:"Reward Points"},{default:t(()=>[l(s,{modelValue:e.value.point,"onUpdate:modelValue":a[4]||(a[4]=o=>e.value.point=o),icon:u(U)},null,8,["modelValue","icon"])]),_:1})):w("",!0),l(i,{label:"Send Reward"},{default:t(()=>[l(s,{modelValue:e.value.sendReward,"onUpdate:modelValue":a[5]||(a[5]=o=>e.value.sendReward=o),options:V},null,8,["modelValue"])]),_:1}),e.value.sendReward.id==2?(c(),b(i,{key:2,label:"Select Date"},{default:t(()=>[l(u(Y),{modelValue:d.dateMessage,"onUpdate:modelValue":a[6]||(a[6]=o=>d.dateMessage=o)},null,8,["modelValue"])]),_:1})):w("",!0),e.value.sendReward.id==2||e.value.sendReward.id==3?(c(),b(i,{key:3,label:"After Certain Time"},{default:t(()=>[l(s,{modelValue:e.value.certainTime,"onUpdate:modelValue":a[7]||(a[7]=o=>e.value.certainTime=o),options:_},null,8,["modelValue"])]),_:1})):w("",!0),e.value.certainTime.id==5?(c(),Z("div",se,[m("div",de,[l(i,{label:"After Certain Time Custom"},{default:t(()=>[l(s,{modelValue:e.value.certainTimeCustom,"onUpdate:modelValue":a[8]||(a[8]=o=>e.value.certainTimeCustom=o),type:"number"},null,8,["modelValue"])]),_:1})]),m("div",ue,[l(i,{label:"Time"},{default:t(()=>[l(s,{modelValue:e.value.certainTime,"onUpdate:modelValue":a[9]||(a[9]=o=>e.value.certainTime=o),options:_},null,8,["modelValue"])]),_:1})])])):w("",!0),l(i,{label:"Reward Type"},{default:t(()=>[l(s,{modelValue:e.value.type,"onUpdate:modelValue":a[10]||(a[10]=o=>e.value.type=o),options:g},null,8,["modelValue"])]),_:1}),m("div",ne,[l(i,{label:"Background Image"},{default:t(()=>[l(C,{label:"Upload",modelValue:p.value,"onUpdate:modelValue":A},null,8,["modelValue"])]),_:1}),l(i,{label:"Reward Icon"},{default:t(()=>[l(C,{label:"Upload",modelValue:f.value,"onUpdate:modelValue":x},null,8,["modelValue"])]),_:1})])])]),_:1})]),_:1})]),_:1}))}};export{Ie as default};
