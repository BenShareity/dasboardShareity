import{a as f,j as M,I as R,Q as I,o as h,c as V,w as s,b as e,g as d,l as Y,d as S,e as t,f as L,h as H,K}from"./index.8eef5a34.js";import{S as N,c as y,v as Q,an as W,Y as z,ao as T}from"./ServerCall.bf212017.js";import{U as F}from"./UserAvatar.c36b30eb.js";import{_ as G}from"./NavBar.1d7fa6fb.js";import{_ as P}from"./CardBox.b1a10a53.js";import{_ as m}from"./FormField.8a5b2723.js";import{_ as c}from"./FormControl.b755056f.js";import{_ as J}from"./FormFilePicker.806059ae.js";import{_ as $}from"./BaseButton.060f3a5f.js";import{_ as A}from"./BaseButtons.7d99a140.js";import{_ as O,U as X}from"./LayoutAuthenticated.ccaeb884.js";import{S as Z}from"./SectionTitleLineWithButton.86ee8bbb.js";import{u as ee}from"./alerts.ef7819ba.js";import{_ as ae}from"./BaseLevel.c2afcd4c.js";import"./_plugin-vue_export-helper.cdc0426e.js";import"./session.f47d2680.js";import"./BaseIcon.86eb869a.js";import"./LoginController.5d91ed5e.js";const U={updateDataUser:async n=>{try{return(await N.post("/user/update/",{id:n.id,firstName:n.firstName,lastName:n.lastName,username:n.username,bio:n.bio,email:n.email,gender:n.gender})).data}catch(u){console.log(u)}},updatePassUser:async n=>{try{return(await N.put("/auth/password/",{password:n.newPassword})).data}catch(u){console.log(u)}},userAvatar:async n=>{let u=new FormData;u.append("file",n.file),u.append("id",n.id);try{const p=await N.post("/user/update-photo",u);return console.log("response",p.data),p}catch(p){throw p}}},le={class:"flex items-center"},te=d("div",{class:"text w-[600px] h-full"},[d("div",{class:"space-y-3 text-center"},[d("div",{class:"flex justify-center md:block"}),d("h1",{class:"text-2xl"},[K(" Howdy, "),d("b",null,"Edit your profile settings!")])])],-1),se={class:"grid grid-cols-1 lg:grid-cols-2 gap-6"},oe={class:"grid grid-cols-2 gap-2"},re={class:"grid grid-cols-2 gap-2"},ie={class:"grid grid-cols-2 gap-2"},ne={class:"flex flex-col justify-center h-100"},ue={key:0,style:{color:"red"}},$e={__name:"ProfileView",setup(n){const u="https://chgsdev.shareity.com/",p=ee();let r=f({});const v=f(),o=f({}),w=f({}),_=f(!1),g=f(!1);f(!1);const q=M(()=>w.value.imagen?u+w.value.imagen:u+"default/user_default.png"),x=i=>{if(i.target.value){if(!r.value.lastName||!r.value.firstName){_.value=!1;return}_.value=!0;return}};R(()=>{var i,a,l,b;if(v.value&&(_.value=!0),!r.value.lastName||!r.value.firstName){_.value=!1;return}if(!(!((i=o==null?void 0:o.value)!=null&&i.password_confirmation)&&!((a=o==null?void 0:o.value)!=null&&a.newPassword)))if(((l=o==null?void 0:o.value)==null?void 0:l.password_confirmation)===((b=o==null?void 0:o.value)==null?void 0:b.newPassword)){g.value=!0;return}else g.value=!1}),I(async()=>{const{id:i,firstName:a,lastName:l,email:b,username:j,rol:B,bio:E,imagen:de}=w.value=await X.getMyProfile();r.value={id:i,firstName:a,lastName:l,email:b,username:j,rol:B,bio:E}});const k=()=>{U.updateDataUser(r.value).then(()=>{p.createAlert({title:"Data updated!",icon:"$success",text:"The data has been updated successfully!"})}),v.value&&C()},C=async()=>{const i=w.value.id;await U.userAvatar({id:i,file:v.value})},D=()=>{try{U.updatePassUser(o.value).then(()=>{p.createAlert({title:"Data updated!",icon:"$success",text:"The data has been updated successfully!"}),console.log("aquistoypapa",o.value)}).catch(i=>{p.createAlert({title:"Error while updating",color:"danger",text:i.response.data.message}),console.error("error",i)})}catch{}};return(i,a)=>(h(),V(O,null,{default:s(()=>[e(G,null,{default:s(()=>[e(Z,{title:"Profile",main:""}),e(P,{class:"mb-5"},{default:s(()=>[e(ae,{type:"flex justify-around lg:justify-center"},{default:s(()=>[d("div",le,[e(F,{avatar:q.value},{default:s(()=>[Y(i.$slots,"default")]),_:3},8,["avatar"])]),te]),_:3})]),_:3}),d("div",se,[e(P,{"is-form":"",onSubmit:S(k,["prevent"])},{footer:s(()=>[e(A,null,{default:s(()=>[e($,{color:"info",type:"submit",label:"Save",class:"mr-2",disabled:!_.value},null,8,["disabled"])]),_:1})]),default:s(()=>[e(m,{label:"Profile Picture",help:"Max 500kb"},{default:s(()=>[e(J,{modelValue:v.value,"onUpdate:modelValue":a[0]||(a[0]=l=>v.value=l),label:"Upload"},null,8,["modelValue"])]),_:1}),d("div",oe,[e(m,{label:"First Name",help:"Required. Your name"},{default:s(()=>[e(c,{onInput:x,modelValue:t(r).firstName,"onUpdate:modelValue":a[1]||(a[1]=l=>t(r).firstName=l),icon:t(y),name:"FirstName",required:"",autocomplete:"FirstName"},null,8,["modelValue","icon"])]),_:1}),e(m,{label:"Last Name",help:"Required. Your name"},{default:s(()=>[e(c,{onInput:x,modelValue:t(r).lastName,"onUpdate:modelValue":a[2]||(a[2]=l=>t(r).lastName=l),icon:t(y),name:"lastName",required:"",autocomplete:"lastName"},null,8,["modelValue","icon"])]),_:1})]),d("div",re,[e(m,{label:"Phone",help:"This field can't be edited"},{default:s(()=>[e(c,{modelValue:t(r).phone,"onUpdate:modelValue":a[3]||(a[3]=l=>t(r).phone=l),icon:t(Q),type:"phone",name:"phone",autocomplete:"Phone",disabled:""},null,8,["modelValue","icon"])]),_:1}),e(m,{label:"User Type",help:"This field can't be edited"},{default:s(()=>[e(c,{modelValue:t(r).rol,"onUpdate:modelValue":a[4]||(a[4]=l=>t(r).rol=l),icon:t(W),type:"rol",name:"rol",autocomplete:"rol",disabled:""},null,8,["modelValue","icon"])]),_:1})]),d("div",ie,[e(m,{label:"Email",help:"This field can't be edited"},{default:s(()=>[e(c,{modelValue:t(r).email,"onUpdate:modelValue":a[5]||(a[5]=l=>t(r).email=l),icon:t(z),type:"email",name:"email",required:"",autocomplete:"email",disabled:""},null,8,["modelValue","icon"])]),_:1}),t(r).username!=""?(h(),V(m,{key:0,label:"Username",help:"This field can't be edited"},{default:s(()=>[e(c,{modelValue:t(r).username,"onUpdate:modelValue":a[6]||(a[6]=l=>t(r).username=l),icon:t(y),type:"username",name:"username",autocomplete:"username",disabled:""},null,8,["modelValue","icon"])]),_:1})):(h(),V(m,{key:1,label:"Username",help:"This field can't be edited"},{default:s(()=>[e(c,{value:"This user does not have a username",icon:t(y),type:"username",name:"username",autocomplete:"username"},null,8,["icon"])]),_:1}))])]),_:1}),e(P,{"is-form":"",onSubmit:S(D,["prevent"])},{footer:s(()=>[e(A,null,{default:s(()=>[e($,{type:"submit",color:"info",label:"Save",class:"mr-2",disabled:!g.value},null,8,["disabled"])]),_:1})]),default:s(()=>[d("div",ne,[e(m,{label:"New password",help:"Required. New password"},{default:s(()=>[e(c,{modelValue:o.value.newPassword,"onUpdate:modelValue":a[7]||(a[7]=l=>o.value.newPassword=l),icon:t(T),name:"newPassword",type:"password",required:"",autocomplete:"new-password"},null,8,["modelValue","icon"])]),_:1}),e(m,{label:"Confirm password",help:"Required. New password one more time"},{default:s(()=>[e(c,{modelValue:o.value.password_confirmation,"onUpdate:modelValue":a[8]||(a[8]=l=>o.value.password_confirmation=l),icon:t(T),name:"password_confirmation",type:"password",required:"",autocomplete:"new-password"},null,8,["modelValue","icon"])]),_:1}),o.value.newPassword!=o.value.password_confirmation?(h(),L("span",ue,"Passwords don't match!")):H("",!0)])]),_:1})])]),_:3})]),_:3}))}};export{$e as default};