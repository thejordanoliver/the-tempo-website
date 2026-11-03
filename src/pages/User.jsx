import { useState } from "react";
import { Link } from "../app/router.jsx";
import { Image } from "../components/ui/Image.jsx";
import { State } from "../components/ui/State.jsx";
import { useResource } from "../hooks/useResource.js";
function UserData({ id }) {
  const [version, setVersion] = useState(0);
  const resource = useResource(`/api/users/id/${id}`, version);
  const user = resource.data?.user || resource.data;
  return (
    <>
      <State {...resource} onRetry={() => setVersion((value) => value + 1)} />
      {!resource.loading && !resource.error && user && (
        <>
          <div className="profile-banner">
            <Image src={user.bannerImage || user.banner_image} />
          </div>
          <div className="profile-body">
            <div className="profile-avatar">
              <Image
                src={
                  user.profileImage ||
                  user.profile_image ||
                  user.profileImageUrl
                }
                alt="Profile photo"
              />
            </div>
            <h1>
              {user.fullName || user.full_name || user.username || "Tempo fan"}
            </h1>
            <p>@{user.username}</p>
            <p>{user.bio || "No bio yet."}</p>
            <p>
              {user.followers_count ?? 0} followers ·{" "}
              {user.following_count ?? 0} following
            </p>
          </div>
        </>
      )}
    </>
  );
}
export default function User({ search = "" }) {
  const id = new URLSearchParams(search).get("id");
  return (
    <section className="profile-page react-profile">
      {/^\d+$/.test(id || "") ? (
        <UserData key={id} id={id} />
      ) : (
        <>
          <h1>Fan not found</h1>
          <Link to="/explore/">Back to Explore</Link>
        </>
      )}
    </section>
  );
}
