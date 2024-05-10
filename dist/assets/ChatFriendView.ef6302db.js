import{a as i,H as R,Q as z,x as B,o as n,c as V,w as k,g as e,b as r,e as d,f as u,t as p,F as $,A as D,q as T,B as H,n as w}from"./index.8eef5a34.js";import{_ as L}from"./NavBar.1d7fa6fb.js";import{U as C,_ as U}from"./LayoutAuthenticated.ccaeb884.js";import{u as A}from"./socket.0643ffd4.js";import{M as q,ad as E,ac as G,ae as P,af as Q}from"./ServerCall.bf212017.js";import{_ as h}from"./BaseIcon.86eb869a.js";import{L as W}from"./LoadingSpinner.708020bb.js";import{_ as J}from"./BaseButton.060f3a5f.js";import"./alerts.ef7819ba.js";import"./session.f47d2680.js";import"./LoginController.5d91ed5e.js";import"./_plugin-vue_export-helper.cdc0426e.js";const K={class:"h-[90vh]"},O={class:"flex gap-2 items-center mb-[10px]"},X=e("p",{class:"font-semibold text-[23px]"},"Back",-1),Y={key:0,class:"w-full h-full justify-center items-center flex"},Z={key:1,class:"flex h-full w-full shadow-xl"},ee={class:"w-full h-full"},se={class:"w-full h-full flex flex-col"},te={class:"h-[94px] p-[10px] shadow-[1px_1px_10px_1px_#80808012] w-full"},le={class:"h-full"},ae={class:"flex items-center justify-between"},oe={class:"flex items-center gap-4"},ie={class:"w-[70px] h-[70px]"},ne=["src"],re={class:"text-[21px]"},ce={class:"text-[14px]"},de={class:"flex"},ue={key:0,class:"w-full h-full justify-center items-center flex flex-col text-[#8080808a] font-normal text-[25px]"},fe={key:1,class:"w-full h-full overflow-hidden"},pe={class:"h-full p-4 overflow-auto scrolling"},me={class:"text-[#2a2a2bde]"},_e={class:"w-full p-5 rounded-bl-3xl rounded-br-3xl"},he={class:"relative"},ve={class:"flex justify-center items-center"},Re={__name:"ChatFriendView",setup(xe){const f=A(),l=i({}),m=i([]),v=R(),F="https://chgsdev.shareity.com/",x=i(!1),_=i(""),o=i({}),I=i(!1),M=i(localStorage.getItem("userName"));z(async()=>{x.value=!0,o.value=await C.getUserName(M.value),j()}),B(async()=>{await f.socketGet(),l.value=await C.getMyProfile(),g(),N()});const S=s=>{s.preventDefault();let t={idFrom:l.value.id,idTo:parseInt(v.params.id),message:encodeURIComponent(_.value)};f.socket.emit("createMessage",t,a=>{console.log(a),a&&(_.value=""),g()})},g=()=>{let s={userId:l.value.id,friendId:parseInt(v.params.id)};f.socket.emit("findAllMessages",s,t=>{t.map(a=>{a.message=decodeURIComponent(a.message)}),x.value=!1,m.value=t.reverse(),console.log(t),y()})},y=()=>{m.value.length>3&&setTimeout(()=>{const s=document.querySelector(".scrolling");s.scrollTop=s.scrollHeight},5)},j=()=>{let s={userFrom:v.params.id,userTo:l.value.id};f.socket.emit("setMessagesRead",s,t=>{I.value=!0,console.log("get",t)})},N=()=>{f.socket.on("newMessageResived",s=>{y(),g()})};return(s,t)=>(n(),V(U,null,{default:k(()=>[e("div",K,[r(L,{class:"h-full"},{default:k(()=>{var a,b;return[e("div",O,[r(J,{to:"/friends",icon:d(q),color:"info","rounded-full":"",small:""},null,8,["icon"]),X]),x.value?(n(),u("div",Y,[r(W)])):(n(),u("div",Z,[e("div",ee,[e("div",se,[e("div",te,[e("div",le,[e("div",ae,[e("div",oe,[e("div",ie,[e("img",{class:"w-full h-full object-contain rounded-full shadow-lg",src:(a=o.value)!=null&&a.imagen?d(F)+((b=o.value)==null?void 0:b.imagen):"../../assets/social/sinfoto.jpg"},null,8,ne)]),e("div",null,[e("span",re,p(`${o.value.firstName}
                                                    ${o.value.lastName}`),1),e("p",ce," Hi!, I'am "+p(o.value.firstName),1)])]),e("div",de,[r(h,{path:d(E),w:"w-10",h:"h-10",class:"sizeIconClip text-[#8080806e]"},null,8,["path"]),r(h,{path:d(G),w:"w-10",h:"h-10",class:"sizeIconClip text-[#8080806e]"},null,8,["path"])])])])]),m.value.length===0?(n(),u("div",ue,[e("p",null,"Welcome "+p(l.value.firstName),1),e("p",null,"send your first message to "+p(o.value.firstName),1)])):(n(),u("div",fe,[e("div",pe,[(n(!0),u($,null,D(m.value,c=>(n(),u("div",{class:w(["w-full mt-2",l.value.id===c.userFrom.id?"   flex justify-end":"  flex justify-start"])},[e("div",{class:w(["w-[410px] flex",l.value.id===c.userFrom.id?" justify-end":"justify-start"])},[e("div",{class:w(["rounded-[20px] p-[15px] pr-[25px] w-fit",l.value.id===c.userFrom.id?"   bg-blue-400/80 rounded-br":"  bg-gray-200/50 rounded-bl"])},[e("p",me,p(c.message),1)],2)],2)],2))),256))])])),e("form",{onSubmit:S},[e("div",_e,[e("div",he,[e("div",ve,[r(h,{path:d(P),w:"w-10",h:"h-10",class:"absolute left-[6px] sizeIconClip text-[#8080806e] cursor-pointer"},null,8,["path"]),T(e("input",{type:"text",placeholder:"Send Message...",class:"w-full p-[15px] pl-[43px] pr-[56px] rounded-[20px] shadow-lg text-base","onUpdate:modelValue":t[0]||(t[0]=c=>_.value=c)},null,512),[[H,_.value]]),r(h,{path:d(Q),w:"w-10",h:"h-10",class:"absolute right-[12px] sizeIcon text-[#2563eb] cursor-pointer"},null,8,["path"])])])])],32)])])]))]}),_:1})])]),_:1}))}};export{Re as default};
