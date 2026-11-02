import { Link } from "../router.jsx";
import { playerHref } from "../players.js";
export default function PlayerLink({ league, id, children, ...props }) {
  const to = playerHref(league, id);
  return to ? (
    <Link to={to} {...props}>
      {children}
    </Link>
  ) : (
    <span {...props}>{children}</span>
  );
}
