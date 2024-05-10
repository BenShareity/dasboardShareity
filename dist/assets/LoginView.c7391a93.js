import{r as w,a as n,u as V,o as u,c as v,w as s,b as e,n as h,d as y,e as d,f as $,g as l,t as x,h as L}from"./index.8eef5a34.js";import{_ as k}from"./shareity-logo.5aa589ac.js";import{m as C,a as B}from"./ServerCall.bf212017.js";import{_ as S,a as A}from"./LayoutGuest.a706e16b.js";import{_ as E}from"./CardBox.b1a10a53.js";import{_ as N}from"./FormCheckRadio.f7560f81.js";import{_ as c}from"./FormField.8a5b2723.js";import{_ as f}from"./FormControl.b755056f.js";import{_ as p}from"./BaseButton.060f3a5f.js";import{_ as U}from"./BaseButtons.7d99a140.js";import{L as M}from"./LoginController.5d91ed5e.js";import"./BaseIcon.86eb869a.js";import"./_plugin-vue_export-helper.cdc0426e.js";import"./session.f47d2680.js";const R=l("div",null,[l("img",{src:k,alt:"Shareity Logo"})],-1),j={key:0,class:"text-center"},z={class:"mt-2 text-l text-red-600 dark:text-red-400"},D=l("div",null,[l("a",{href:""})],-1),ee={__name:"LoginView",setup(P){const a=w({user:"",pass:"",remember:!0}),m=n(!1),i=n(""),_=V(),b=async()=>{m.value=!0,await M.login(a.user,a.pass).then(t=>{t&&_.push("/dashboard")}).catch(t=>{console.error("Error de la consola",t.response.data.message),i.value=t.response.data.message}).finally(()=>{m.value=!1})};return(t,o)=>(u(),v(S,null,{default:s(()=>[e(A,{bg:"blueWhite"},{default:s(({cardClass:g})=>[e(E,{class:h(`${g} my-8`),"is-form":"",onSubmit:y(b,["prevent"])},{footer:s(()=>[e(U,{type:"flex-col justify-center items-center"},{default:s(()=>[e(p,{type:"submit",color:"info",class:"sm:w-1/2 w-full",label:"Login with Shareity",isLoading:m.value},null,8,["isLoading"]),e(p,{to:"/register",color:"info",outline:"",class:"sm:w-1/2 w-full",label:"Create Account"})]),_:1}),D]),default:s(()=>[R,e(c,{label:"Email"},{default:s(()=>[e(f,{modelValue:a.user,"onUpdate:modelValue":o[0]||(o[0]=r=>a.user=r),icon:d(C),name:"login",autocomplete:"username"},null,8,["modelValue","icon"])]),_:1}),e(c,{label:"Password"},{default:s(()=>[e(f,{modelValue:a.pass,"onUpdate:modelValue":o[1]||(o[1]=r=>a.pass=r),icon:d(B),type:"password",name:"password",autocomplete:"current-password"},null,8,["modelValue","icon"])]),_:1}),i.value?(u(),$("div",j,[l("span",z,x(i.value),1)])):L("",!0),e(N,{modelValue:a.remember,"onUpdate:modelValue":o[2]||(o[2]=r=>a.remember=r),name:"remember",label:"Remember","input-value":!0},null,8,["modelValue"])]),_:2},1032,["class"])]),_:1})]),_:1}))}};export{ee as default};
