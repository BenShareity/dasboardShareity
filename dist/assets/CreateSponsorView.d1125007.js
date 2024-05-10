import{H as J,u as k,a as o,r as I,Q as j,I as v,o as q,c as A,w as r,b as s,g,e as i,t as z,d as D,n as y,h as F}from"./index.8eef5a34.js";import{M as H,c as Q,m as W,a0 as U}from"./ServerCall.bf212017.js";import{_ as G}from"./NavBar.1d7fa6fb.js";import{_ as K}from"./CardBox.b1a10a53.js";import{_}from"./FormField.8a5b2723.js";import{_ as h}from"./FormControl.b755056f.js";import{_ as T}from"./FormFilePicker.806059ae.js";import{_ as R}from"./BaseButton.060f3a5f.js";import{_ as X}from"./BaseButtons.7d99a140.js";import{U as Y,_ as Z}from"./LayoutAuthenticated.ccaeb884.js";/* empty css             */import{S as C}from"./SponsorController.56304a20.js";import{r as ee}from"./regex.a06b4297.js";import{U as ae}from"./utilityMethods.d9c941ff.js";import{u as le}from"./alerts.ef7819ba.js";import{R as se}from"./RegisterConstroller.4a580cee.js";import"./session.f47d2680.js";import"./_plugin-vue_export-helper.cdc0426e.js";import"./BaseIcon.86eb869a.js";import"./LoginController.5d91ed5e.js";const oe={class:"flex justify-between pb-5"},re={class:"flex gap-2 items-center"},te={class:"font-extrabold"},ne={class:"grid grid-cols-1 md:grid-cols-2 gap-3"},$e={__name:"CreateSponsorView",setup(ie){const M="https://chgsdev.shareity.com/",u=J(),x=k(),$=o(!1),m=o(),c=le(),p=o(!1),N=o(null),n=o(null),b=o(null),E=o(null),S=o(!1),d=o(!1),V=o(!1),w=o(!1),e=I({name:"",personEmail:"",personName:"",personLastname:"",logo:"",status:!1}),L=o(!1),f=o({}),B=u.query.id?"Edit":"Add",P=l=>{m.value=l};j(async()=>{f.value=await Y.getMyProfile(),console.log(f.value),await C.getById(u.query.id).then(l=>{$.value=!0,e.name=l.name,e.personEmail=l.personEmail,e.personName=l.personName,e.personLastname=l.personLastname,m.value=M+l.logo})},[u.query.id]),v(()=>{if(f.value.rol==="cause"){L.value=!e.name||!e.personEmail||!e.personLastname||!e.personName;return}else L.value=!e.name||!e.personEmail||!e.personLastname||!e.personName}),v(()=>e.name,()=>{e.name?(N.value=null,S.value=!0):(N.value="Required field",S.value=!1)}),v(()=>e.personEmail,async()=>{if(!e.personEmail)n.value="Required field",d.value=!1;else if(!ee.test(e.personEmail.trim()))n.value="Invalid email",d.value=!1;else{let l={email:e.personEmail};try{let a=await se.verifyEmail(l);n.value=null,d.value=!0,console.log("res :>> ",a)}catch(a){console.log(a),n.value=a.message,d.value=!1}}}),v(()=>e.personName,()=>{e.personName?(b.value=null,V.value=!0):(b.value="Required field",V.value=!1)}),v(()=>e.personLastname,()=>{e.personLastname?(E.value=null,w.value=!0):(E.value="Required field",w.value=!1)});const O=async()=>{let l="";if(m.value&&(l=await ae.verifyMedia(m.value,"sponsors")),u.query.id){e.logo=l;let a=JSON.parse(JSON.stringify(e));C.update(u.query.id,a).then(()=>{p.value=!0;try{c.createAlert({title:"Sponsor has been updated!",icon:"$success",text:"the sponsor has been updated successfully!"})}catch{c.createAlert({title:"Error!",icon:"$warning",text:"Error updating sponsor!",color:"red-accent-4"})}}).finally(()=>{p.value=!1,x.push("/sponsors")})}else{e.logo=l;let a=JSON.parse(JSON.stringify(e));C.create(a).then(()=>{if(p.value=!0,f.value.rol==="admin")try{c.createAlert({title:"Sponsor have been succesfully registered!",icon:"$success"})}catch{c.createAlert({title:"Error!",icon:"$warning",text:"Error creating sponsor!",color:"red-accent-4"})}else c.createAlert({title:"Sponsor have been succesfully registered!",icon:"$success",text:"We have successfully invited brand or sponsor, they will get an invitation email to sing up on Shareity!"})}).finally(()=>{p.value=!1,x.push("/sponsors")})}};return(l,a)=>(q(),A(Z,null,{default:r(()=>[s(G,null,{default:r(()=>[g("div",oe,[g("div",re,[s(R,{to:"/sponsors",icon:i(H),color:"info","rounded-full":"",small:""},null,8,["icon"]),g("p",te,z(i(B))+" Sponsor",1)])]),s(K,{"is-form":"",class:"col-span-3",onSubmit:D(O,["prevent"])},{footer:r(()=>[s(X,{class:"justify-end"},{default:r(()=>[s(R,{color:"info",type:"submit",label:"Save",disabled:L.value||n.value,isloading:p.value},null,8,["disabled","isloading"])]),_:1})]),default:r(()=>[g("div",ne,[s(_,{label:"Organization Name",err:N.value},{default:r(()=>[s(h,{modelValue:e.name,"onUpdate:modelValue":a[0]||(a[0]=t=>e.name=t),icon:i(Q),required:"",class:y([S.value?"clase1 green ":""])},null,8,["modelValue","icon","class"])]),_:1},8,["err"]),s(_,{label:"Contact Person Email",err:n.value},{default:r(()=>[s(h,{modelValue:e.personEmail,"onUpdate:modelValue":a[1]||(a[1]=t=>e.personEmail=t),icon:i(W),type:"email",name:"email",required:"",autocomplete:"email",label:"data",class:y([d.value?"clase2 green ":""])},null,8,["modelValue","icon","class"])]),_:1},8,["err"]),s(_,{label:"Contact Person First Name",err:b.value},{default:r(()=>[s(h,{modelValue:e.personName,"onUpdate:modelValue":a[2]||(a[2]=t=>e.personName=t),icon:i(U),class:y([V.value?"clase1 green ":""])},null,8,["modelValue","icon","class"])]),_:1},8,["err"]),s(_,{label:"Contact Person Last Name",err:E.value},{default:r(()=>[s(h,{modelValue:e.personLastname,"onUpdate:modelValue":a[3]||(a[3]=t=>e.personLastname=t),icon:i(U),class:y([w.value?"clase1 green ":""])},null,8,["modelValue","icon","class"])]),_:1},8,["err"]),f.value.rol==="admin"||$.value===!0?(q(),A(_,{key:0,label:"Select Sponsor Logo"},{default:r(()=>[s(T,{modelValue:m.value,"onUpdate:modelValue":P,label:"Upload",mediaClass:"w-52 h-52"},null,8,["modelValue"])]),_:1})):F("",!0)])]),_:1})]),_:1})]),_:1}))}};export{$e as default};
