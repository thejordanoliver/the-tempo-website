"use strict";
(() => {
  const API_URL = "http://192.168.1.225:4000";
  const form = document.getElementById("login-form");
  const fields = document.getElementById("credentials");
  const status = document.getElementById("login-status");
  const submit = form.querySelector('button[type="submit"]');
  const signedIn = document.getElementById("signed-in");
  const signOut = document.getElementById("sign-out");
  const toggle = document.getElementById("toggle-password");
  toggle.addEventListener("click", () => {
    const password = document.getElementById("password");
    const show = password.type === "password";
    password.type = show ? "text" : "password";
    toggle.textContent = show ? "Hide" : "Show";
    toggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
    toggle.setAttribute("aria-pressed", String(show));
  });
  // Keep credentials and tokens out of browser persistence.
  let refreshToken = null;
  let accessToken = null;
  let refreshController = null;
  const loginLayout = document.querySelector(".login-layout");
  const profileStatus = document.getElementById("profile-status");
  const refreshButton = document.getElementById("refresh-profile");
  function setImage(id, value) {
    const image = document.getElementById(id);
    let url;
    try { url = new URL(value, API_URL); } catch { url = null; }
    if (!value || !url || !["http:", "https:"].includes(url.protocol)) {
      image.hidden = true; image.removeAttribute("src"); return;
    }
    image.referrerPolicy = "no-referrer";
    image.onerror = () => { image.hidden = true; };
    image.src = url.href;
    image.hidden = false;
  }
  function renderProfile(user) {
    const name = user.fullName || user.full_name || user.username || "Tempo fan";
    document.getElementById("profile-name").textContent = name;
    document.getElementById("account-name").textContent = `@${user.username || ""}`;
    document.getElementById("profile-username").textContent = user.username || "—";
    document.getElementById("profile-email").textContent = user.email || "Not provided";
    document.getElementById("profile-bio").textContent = user.bio || "No bio yet. Add one in the Tempo app.";
    document.getElementById("profile-initials").textContent = name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
    const joined = new Date(user.createdAt || user.created_at || "");
    document.getElementById("profile-joined").textContent = Number.isNaN(joined.valueOf()) ? "" : `Joined ${joined.toLocaleDateString(undefined, {month:"long",year:"numeric"})}`;
    setImage("profile-image", user.profileImage || user.profile_image);
    setImage("profile-banner-image", user.bannerImage || user.banner_image);
  }
  async function refreshProfile() {
    if (!accessToken) return;
    refreshButton.disabled = true;
    profileStatus.textContent = "Refreshing your profile…";
    refreshController = new AbortController();
    const timer = setTimeout(() => refreshController?.abort(), 15000);
    try {
      const response = await fetch(`${API_URL}/api/users/me`, {headers:{Authorization:`Bearer ${accessToken}`}, signal:refreshController.signal, credentials:"omit", cache:"no-store"});
      if (response.status === 401 || response.status === 403) {
        document.getElementById("sign-out").click();
        return;
      }
      if (!response.ok) throw new Error("Profile request failed");
      const user = await response.json();
      if (!accessToken) return;
      renderProfile(user);
      profileStatus.textContent = "Your profile is up to date.";
    } catch {
      if (accessToken) profileStatus.textContent = "Could not refresh your profile. Check your connection and try again.";
    } finally { clearTimeout(timer); refreshButton.disabled = false; }
  }
  refreshButton.addEventListener("click", refreshProfile);
  const setStatus = (message) => { status.textContent = message; };
  if (location.protocol === "https:") {
    fields.disabled = true;
    setStatus("Web sign-in is not available yet. Please use the Tempo mobile app to access your account.");
    return;
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (fields.disabled || !form.reportValidity()) return;
    const username = document.getElementById("username").value.trim();
    const passwordField = document.getElementById("password");
    if (!username) { setStatus("Enter your username."); return; }
    fields.disabled = true;
    submit.textContent = "Signing in…";
    setStatus("Signing in…");
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: passwordField.value }),
        signal: AbortSignal.timeout(15000),
        credentials: "omit",
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(response.status === 429 ? "Too many sign-in attempts. Please try again later." : response.status === 401 ? "Incorrect username or password." : "Sign-in failed. Please try again.");
        return;
      }
      if (!data.user || typeof data.accessToken !== "string" || typeof data.refreshToken !== "string") {
        setStatus("The server returned an incomplete sign-in response. Please try again.");
        return;
      }
      refreshToken = data.refreshToken;
      accessToken = data.accessToken;
      renderProfile(data.user);
      loginLayout.hidden = true;
      signedIn.hidden = false;
      const profileUrl = new URL("../profile/", location.href);
      history.replaceState(null, "", profileUrl.pathname);
      document.title = "Your Profile | Tempo Sports";
      const navAccount = document.querySelector('nav a[aria-current="page"]');
      if (navAccount) { navAccount.textContent = "Profile"; navAccount.href = profileUrl.pathname; }
      document.getElementById("profile-name").focus();
      void refreshProfile();
    } catch {
      setStatus("Cannot reach the local Tempo backend. Check that it is running at 192.168.1.225:4000 and that this device is on the same network.");
    } finally {
      passwordField.value = "";
      passwordField.type = "password";
      toggle.textContent = "Show";
      toggle.setAttribute("aria-label", "Show password");
      toggle.setAttribute("aria-pressed", "false");
      fields.disabled = false;
      submit.textContent = "Sign in";
    }
  });
  signOut.addEventListener("click", async () => {
    signOut.disabled = true;
    const token = refreshToken;
    refreshToken = null;
    accessToken = null;
    refreshController?.abort();
    let revoked = false;
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token }), signal: AbortSignal.timeout(10000),
        credentials: "omit", cache: "no-store",
      });
      revoked = response.ok;
    } catch { /* Always clear the local page session. */ }
    form.reset();
    form.hidden = false;
    loginLayout.hidden = false;
    history.replaceState(null, "", new URL("../login/", location.href).pathname);
    document.title = "Sign In | Tempo Sports";
    const navAccount = document.querySelector('nav a[aria-current="page"]');
    if (navAccount) { navAccount.textContent = "Sign in"; navAccount.href = new URL("../login/", location.href).pathname; }
    signedIn.hidden = true;
    for (const id of ["account-name", "profile-name", "profile-email", "profile-username", "profile-bio", "profile-joined", "profile-initials", "profile-status"]) document.getElementById(id).textContent = "";
    setImage("profile-image", null); setImage("profile-banner-image", null);
    signOut.disabled = false;
    setStatus(revoked ? "You’re signed out." : "You’re signed out of this page. The server could not confirm session revocation.");
    document.getElementById("username").focus();
  });
})();
