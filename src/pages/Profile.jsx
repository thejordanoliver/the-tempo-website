import { useEffect, useState } from "react";
import { Link } from "../router.jsx";
import { Image, State, useResource } from "../components.jsx";
import { sessionStore } from "../session.js";
export default function Profile({ user, onLogout }) {
  const [version, setVersion] = useState(0);
  const state = useResource("/api/users/me", version);
  useEffect(() => {
    if (state.data?.id != null) sessionStore.setUser(state.data);
  }, [state.data]);
  const name = user.fullName || user.full_name || user.username || "Tempo fan",
    joined = new Date(user.createdAt || user.created_at || "");
  return (
    <section className="profile-page react-profile">
      <div className="profile-banner">
        <Image src={user.bannerImage || user.banner_image} />
      </div>
      <div className="profile-body">
        <div className="profile-top">
          <div className="profile-avatar">
            <span aria-hidden="true">
              {name
                .split(/\s+/)
                .slice(0, 2)
                .map((s) => s[0])
                .join("")
                .toUpperCase()}
            </span>
            <Image
              src={user.profileImage || user.profile_image}
              alt="Your profile photo"
            />
          </div>
          <button className="tempo-button outline" onClick={onLogout}>
            Sign out
          </button>
        </div>
        <p className="eyebrow">Your Tempo profile</p>
        <h1>{name}</h1>
        <p className="profile-handle">@{user.username}</p>
        <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {user.bio || "No bio yet. Add one in the Tempo app."}
        </p>
        {!Number.isNaN(joined.valueOf()) && (
          <p className="small">
            Joined{" "}
            {joined.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <section className="profile-details">
          <h2>Account details</h2>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{user.email || "Not provided"}</dd>
            </div>
            <div>
              <dt>Username</dt>
              <dd>{user.username || "—"}</dd>
            </div>
          </dl>
          <p className="small">Only you can see your email on this page.</p>
        </section>
        {state.error && (
          <State error={state.error} onRetry={() => setVersion((v) => v + 1)} />
        )}
        <div className="profile-actions">
          <button
            className="tempo-button"
            disabled={state.loading}
            onClick={() => setVersion((v) => v + 1)}
          >
            {state.loading ? "Refreshing…" : "Refresh profile"}
          </button>
          <Link className="tempo-button outline" to="/support/">
            Help &amp; support
          </Link>
        </div>
        <p className="profile-app-note">
          Update your profile in the Tempo app. Your changes will appear here
          when you refresh.
        </p>
      </div>
    </section>
  );
}
