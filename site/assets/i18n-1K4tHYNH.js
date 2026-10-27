(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))l(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function e(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function l(a){if(a.ep)return;a.ep=!0;const n=e(a);fetch(a.href,n)}})();const y="modulepreload",w=function(t){return"/"+t},p={},S=function(s,e,l){let a=Promise.resolve();if(e&&e.length>0){let i=function(o){return Promise.all(o.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),b=c?.nonce||c?.getAttribute("nonce");a=i(e.map(o=>{if(o=w(o),o in p)return;p[o]=!0;const d=o.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${u}`))return;const r=document.createElement("link");if(r.rel=d?"stylesheet":y,d||(r.as="script"),r.crossOrigin="",r.href=o,b&&r.setAttribute("nonce",b),document.head.appendChild(r),d)return new Promise((g,m)=>{r.addEventListener("load",g),r.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${o}`)))})}))}function n(i){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=i,window.dispatchEvent(c),!c.defaultPrevented)throw i}return a.then(i=>{for(const c of i||[])c.status==="rejected"&&n(c.reason);return s().catch(n)})};function E(t,s){t.innerHTML=`
  <div class="app">
    <header class="top">
      <a class="brand" href="../../index.html"><span class="logo" aria-hidden="true"></span><span><b>${s.name}</b><small>${s.lab}</small></span></a>
      <div class="top-actions">
        <button type="button" class="ic" data-act="lang" aria-label="language"></button>
        <button type="button" class="ic" data-act="sound" aria-label="sound"></button>
        <button type="button" class="ic" data-act="big" aria-label="big screen"></button>
        <button type="button" class="ic" data-act="full" aria-label="fullscreen"></button>
        <button type="button" class="ic drawer-btn" data-act="drawer" aria-label="panel"></button>
      </div>
    </header>
    <nav class="nav"><div class="nav-h" data-t="nav"></div><ol class="lessons"></ol><div class="keys"></div></nav>
    <main class="center">
      <section class="stage">
        <canvas class="gl"></canvas>
        <div class="lbl-root"></div>
        <div class="lesson-tag"><small></small><h1></h1><em></em></div>
        <div class="readouts" aria-live="off"></div>
        <div class="views"></div>
        <div class="inset-frame" hidden><div class="inset-h"><span></span><button type="button" class="inset-x" aria-label="expand">⤢</button></div><div class="inset-lbl"></div></div>
        <div class="badge" hidden></div>
        <div class="timebar"></div>
        <div class="loading"><div class="spin"></div><p></p><i><b></b></i></div>
        <div class="debug" hidden></div>
      </section>
      <section class="dock">
        <div class="dock-h"><div class="tabs" role="tablist"></div><div class="dock-act"></div></div>
        <div class="dock-body"><div class="chart-box"></div><div class="table-box" hidden></div></div>
      </section>
    </main>
    <aside class="side">
      <div class="side-h"><span class="no"></span><div><h2></h2><em></em></div></div>
      <div class="predict" hidden></div>
      <article class="content"></article>
      <ol class="steps"></ol>
      <div class="setup"><div class="setup-h" data-t="setup"></div><div class="controls"></div></div>
    </aside>
  </div>`;const e=l=>t.querySelector(l);return{app:e(".app"),nav:e(".lessons"),navHead:e(".nav-h"),keys:e(".keys"),stage:e(".stage"),canvas:e("canvas.gl"),lblRoot:e(".lbl-root"),tag:e(".lesson-tag"),readouts:e(".readouts"),views:e(".views"),inset:e(".inset-frame"),insetLbl:e(".inset-lbl"),badge:e(".badge"),timebar:e(".timebar"),loading:e(".loading"),debug:e(".debug"),tabs:e(".tabs"),dockAct:e(".dock-act"),chartBox:e(".chart-box"),tableBox:e(".table-box"),sideHead:e(".side-h"),predict:e(".predict"),content:e(".content"),steps:e(".steps"),setupHead:e(".setup-h"),controls:e(".controls"),btn:l=>e(`[data-act="${l}"]`)}}const h={get(t){try{return localStorage.getItem(t)}catch{return null}},set(t,s){try{localStorage.setItem(t,s)}catch{}}};function L(){const t=new URLSearchParams(location.search).get("lang");if(t==="en"||t==="zh"||t==="zh-CN")return t==="en"?"en":"zh";const s=h.get("newton.lang");return s==="en"||s==="zh"?s:navigator.language?.startsWith("zh")?"zh":"en"}let v=L();const f=new Set,P=()=>v;function k(t){v=t,h.set("newton.lang",t),document.documentElement.lang=t==="zh"?"zh-CN":"en",f.forEach(s=>s(t))}const x=t=>f.add(t),z=(t,s)=>({zh:t,en:s}),N=t=>typeof t=="string"?t:t[v];export{z as T,S as _,h as a,E as c,P as g,x as o,k as s,N as t};
