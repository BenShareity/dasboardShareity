import{j as i,k as t,o as n,f as l,l as o,n as c,g as d,e as u}from"./index.8eef5a34.js";import{g as p,a as g,b as k,c as _}from"./BaseIcon.86eb869a.js";const S={__name:"SectionFullScreen",props:{bg:{type:String,required:!0,validator:e=>["purplePink","pinkRed"].includes(e)}},setup(e){const r=e,s=i(()=>{if(t().darkMode)return p;switch(r.bg){case"purplePink":return _;case"pinkRed":return k;case"blueWhite":return g}return""});return(a,f)=>(n(),l("div",{class:c(["flex min-h-screen items-center justify-center",s.value])},[o(a.$slots,"default",{cardClass:"w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl"})],2))}},m={class:"bg-gray-50 dark:bg-slate-800 dark:text-slate-100"},b={__name:"LayoutGuest",setup(e){const r=t();return(s,a)=>(n(),l("div",{class:c({dark:u(r).darkMode})},[d("div",m,[o(s.$slots,"default")])],2))}};export{b as _,S as a};