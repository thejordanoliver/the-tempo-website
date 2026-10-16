"use strict";
(() => {
  const API = "http://192.168.1.225:4000", KEY = "tempo.web.session.v1";
  let session = null, pending = null, generation = 0;
  try { const saved=JSON.parse(sessionStorage.getItem(KEY)||"null");if(saved&&typeof saved.accessToken==="string"&&typeof saved.refreshToken==="string"&&saved.user?.id!=null)session=saved; } catch { /* Storage may be unavailable. */ }
  function save(value) { session=value;try{if(value)sessionStorage.setItem(KEY,JSON.stringify(value));else sessionStorage.removeItem(KEY);}catch{/* Current page still works. */} }
  function clear() { generation++;save(null); }
  async function invalidAccess(response) {
    if(response.status===401)return true;
    if(response.status!==403)return false;
    const data=await response.clone().json().catch(()=>({}));
    return data.code==="ACCESS_TOKEN_INVALID";
  }
  async function request(path, options={}) {
    if(!path.startsWith("/api/"))throw new Error("Invalid API path");
    const version=generation;
    const send=()=>fetch(API+path,{...options,headers:{...options.headers,...(session?{Authorization:`Bearer ${session.accessToken}`}:{})},credentials:"omit",cache:"no-store",signal:options.signal||AbortSignal.timeout(20000)});
    let response=await send();
    if(await invalidAccess(response)&&session){
      if(!pending){const previous=session.refreshToken;pending=(async()=>{const refresh=await fetch(API+"/api/refresh",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refreshToken:previous}),signal:AbortSignal.timeout(15000),credentials:"omit",cache:"no-store"});if(version!==generation)throw new Error("Session changed");if(!refresh.ok){if(refresh.status===401||refresh.status===403){clear();window.dispatchEvent(new Event("tempo:signed-out"));}throw new Error("Session refresh failed");}const data=await refresh.json();if(typeof data.accessToken!=="string"||typeof data.refreshToken!=="string")throw new Error("Invalid session response");if(version===generation&&session?.refreshToken===previous)save({...session,accessToken:data.accessToken,refreshToken:data.refreshToken});})();pending.finally(()=>{pending=null;}).catch(()=>{});}
      await pending;
      if(version!==generation||!session)throw new Error("Session ended");response=await send();
      if(await invalidAccess(response)){clear();window.dispatchEvent(new Event("tempo:signed-out"));}
    }
    return response;
  }
  window.TempoSession={get:()=>session,set(value){generation++;save(value);},clear,request,API};
  // Restore the signed-in destination on informational pages as well.
  if(session){for(const link of document.querySelectorAll('a[href]')){const url=new URL(link.href,location.href);if(url.origin===location.origin&&url.pathname.endsWith("/login/")){link.href=new URL("home/",document.currentScript.src).href;link.textContent="Home";}}}
})();
