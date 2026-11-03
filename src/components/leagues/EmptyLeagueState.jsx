import { State } from "../ui/State.jsx";
export default function EmptyLeagueState({
  children = "No results available for this selection.",
}) {
  return <State empty={children} />;
}
