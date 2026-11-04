import { State } from "../ui/State.jsx";
export default function EmptyLeagueState({ children = "No results." }) {
  return <State empty={children} />;
}
