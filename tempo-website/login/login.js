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
      document.getElementById("account-name").textContent = `Welcome back, ${data.user.username || username}.`;
      form.hidden = true;
      signedIn.hidden = false;
      setStatus("Signed in for this page session. Reloading or closing this page ends the website session.");
      signOut.focus();
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
    signedIn.hidden = true;
    document.getElementById("account-name").textContent = "";
    signOut.disabled = false;
    setStatus(revoked ? "You’re signed out." : "You’re signed out of this page. The server could not confirm session revocation.");
    document.getElementById("username").focus();
  });
})();
