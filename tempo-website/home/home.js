"use strict";
(() => {
  const API = "http://192.168.1.225:4000";
  const $ = id => document.getElementById(id);
  const endpoints = {nba:"basketball/nba",nfl:"football/nfl",mlb:"baseball",nhl:"hockey"};
  let token = null, league = "nba", expired = () => {}, epoch = 0;
  let gamesRequest, newsRequest;
  const element = (tag, text, className) => { const node=document.createElement(tag); if(text!=null)node.textContent=String(text);if(className)node.className=className;return node; };
  const safeURL = value => {try{const url=new URL(value, API);return value && ["http:","https:"].includes(url.protocol)?url.href:null;}catch{return null;}};
  function image(value, alt) {const url=safeURL(value);if(!url)return null;const img=element("img");img.src=url;img.alt=alt;img.loading="lazy";img.referrerPolicy="no-referrer";img.onerror=()=>img.remove();return img;}
  function empty(id, text) {$(id).replaceChildren(element("p",text,"home-empty"));}
  async function request(path, controller) {const response=await window.TempoSession.request(path,{signal:controller.signal,cache:"no-store",credentials:"omit"});if(response.status===401||response.status===403){expired();throw new Error("Session expired");}if(!response.ok)throw new Error("Request failed");return response.json();}
  function teamRow(team, pregame) {const row=element("div",null,"game-team");const logo=image(team?.logo,"");if(logo)row.append(logo);row.append(element("span",team?.shortName||team?.name||team?.code||"TBD","team-name"),element("strong",pregame?"—":team?.score??"—"));return row;}
  async function games() {
    if(!token)return;
    gamesRequest?.abort();const controller=new AbortController();gamesRequest=controller;const version=epoch;
    const timer=setTimeout(()=>controller.abort(),15000);$("refresh-games").disabled=true;$("games-status").textContent="Loading games…";$("home-games").replaceChildren();
    try{const date=$("game-date").value.replaceAll("-","");const data=await request(`/api/games/${endpoints[league]}?date=${encodeURIComponent(date)}`,controller);if(controller.signal.aborted||version!==epoch)return;
      if(!Array.isArray(data.games))throw new Error("Invalid games response");
      for(const game of data.games){const card=element("article",null,"game-card");const pre=game.status?.state==="pre";let detail=game.status?.shortDetail||game.status?.detail||game.status?.description||"Scheduled";if(pre&&game.date){const start=new Date(game.date);if(!Number.isNaN(start.valueOf()))detail=start.toLocaleString(undefined,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});}card.append(element("p",detail,"game-status"),teamRow(game.away,pre),teamRow(game.home,pre));const venue=game.venue?.name||game.venueName?.name;if(venue)card.append(element("p",venue,"game-venue"));const link=element("a","Game details →","game-detail-link");link.href=`../game/?league=${encodeURIComponent(league)}&id=${encodeURIComponent(game.id)}`;card.append(link);$("home-games").append(card);}
      if(!data.games.length)empty("home-games","No games scheduled for this league and date.");$("games-status").textContent=`${league.toUpperCase()} · Updated ${new Date().toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})}`;
    }catch{if(version===epoch&&gamesRequest===controller){empty("home-games","Could not load games. Check your connection and try Refresh games.");$("games-status").textContent="Games unavailable.";}}finally{clearTimeout(timer);if(gamesRequest===controller)$("refresh-games").disabled=false;}
  }
  async function news(){if(!token)return;newsRequest?.abort();const controller=new AbortController();newsRequest=controller;const version=epoch;const timer=setTimeout(()=>controller.abort(),20000);$("refresh-news").disabled=true;$("news-status").textContent="Loading your feed…";$("home-articles").replaceChildren();
    try{const data=await request("/api/feed/for-you?newsLimit=12&postsLimit=1",controller);if(controller.signal.aborted||version!==epoch)return;if(!data.success||!Array.isArray(data.articles))throw new Error("Invalid feed response");
      for(const article of data.articles){const card=element("article",null,"news-card");const img=image(article.image,"");if(img)card.append(img);const body=element("div",null,"news-card-body");body.append(element("p",article.sport?.toUpperCase()||"NEWS","small"));const title=element("h3");const link=element("a",article.headline||"Read story");link.href=`../article/?id=${encodeURIComponent(article.id)}`;title.append(link);body.append(title);if(article.description)body.append(element("p",article.description));card.append(body);$("home-articles").append(card);}
      if(!data.articles.length)empty("home-articles","No stories available right now. Try refreshing later.");$("news-status").textContent=data.favoriteLeagues?.length?"Stories based on your favorite leagues.":"Stories from around the sports world.";
    }catch{if(version===epoch&&newsRequest===controller){empty("home-articles","Could not load news. Check your connection and try Refresh news.");$("news-status").textContent="Feed unavailable.";}}finally{clearTimeout(timer);if(newsRequest===controller)$("refresh-news").disabled=false;}}
  for(const button of document.querySelectorAll("[data-league]"))button.addEventListener("click",()=>{league=button.dataset.league;for(const item of document.querySelectorAll("[data-league]"))item.setAttribute("aria-pressed",String(item===button));void games();});
  $("game-date").addEventListener("change",()=>{if($("game-date").value)void games();});$("refresh-games").addEventListener("click",games);$("refresh-news").addEventListener("click",news);
  window.TempoHome={start(accessToken,user,onExpired){token=accessToken;expired=onExpired;epoch++;const now=new Date();$("game-date").value=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;$("home-greeting").textContent=`Welcome back, ${user.fullName||user.username||"Tempo fan"}.`;void games();void news();},stop(){token=null;epoch++;gamesRequest?.abort();newsRequest?.abort();for(const id of ["home-greeting","games-status","news-status"])$(id).textContent="";$("home-games").replaceChildren();$("home-articles").replaceChildren();}};
})();
