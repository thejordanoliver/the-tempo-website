import { useEffect, useState } from "react";

import { Link } from "../app/router.jsx";
import { Image } from "../components/ui/Image.jsx";
import { State } from "../components/ui/State.jsx";
import { useResource } from "../hooks/useResource.js";
import { sessionStore } from "../services/session.js";

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
        <h1>{name}</h1>
        <p className="profile-handle">@{user.username}</p>
        <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
          {user.bio || "No bio yet."}
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
          <p className="small">Email is visible only to you.</p>
        </section>
        {state.error && (
          <State error={state.error} onRetry={() => setVersion((v) => v + 1)} />
        )}
        <div className="profile-actions">
          <Link className="tempo-button outline" to="/support/">
            Support
          </Link>
        </div>
        <p className="profile-app-note">Edit your profile in the Tempo app.</p>
      </div>
    </section>
  );
}
