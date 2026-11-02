import Icon from "./Icon.jsx";
import "./GameDatePicker.css";
export function shiftGameDate(value, days) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return `${String(date.getUTCFullYear()).padStart(4, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
export default function GameDatePicker({ date, onChange }) {
  return (
    <div className="game-date-label">
      <label htmlFor="game-date">Game date</label>
      <div className="game-date-controls">
        <button
          type="button"
          className="game-date-chevron"
          aria-label="Previous day"
          onClick={() => onChange(shiftGameDate(date, -1))}
        >
          <Icon name="chevron-back" size={24} />
        </button>
        <input
          type="date"
          id="game-date"
          required
          value={date}
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
        />
        <button
          type="button"
          className="game-date-chevron"
          aria-label="Next day"
          onClick={() => onChange(shiftGameDate(date, 1))}
        >
          <Icon name="chevron-forward" size={24} />
        </button>
      </div>
    </div>
  );
}
