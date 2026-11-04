import Icon from "../ui/Icon.jsx";
import { favoriteLeagues } from "../../data/leagues/favoriteLeagues.js";
import { useState } from "react";
import {
  createWidget,
  WIDGETS,
  GAME_LEAGUES,
} from "../../data/explore/explore.js";
import useExploreBoard from "../../hooks/useExploreBoard.js";
import { State } from "../ui/State.jsx";
import ExploreWidgetContent from "./ExploreWidgetContent.jsx";
export default function ExploreBoard({ userId }) {
  const board = useExploreBoard(userId),
    [editing, setEditing] = useState(false),
    [adding, setAdding] = useState(false),
    [settings, setSettings] = useState(null),
    [draggedId, setDraggedId] = useState(null);
  const disabled = !board.ready || board.pending || Boolean(board.error);
  const change = (id, patch) =>
    board.save(
      board.widgets.map((widget) =>
        widget.id === id ? { ...widget, ...patch } : widget,
      ),
    );
  const move = (index, direction) => {
    const widgets = [...board.widgets];
    [widgets[index], widgets[index + direction]] = [
      widgets[index + direction],
      widgets[index],
    ];
    board.save(widgets);
  };
  return (
    <section aria-labelledby="explore-board-title">
      <header className="explore-board-heading">
        <div>
          <p className="eyebrow">Make it yours</p>
          <h2 id="explore-board-title">Your Explore board</h2>
        </div>
        <div className="explore-actions">
          <button
            type="button"
            className="tempo-button outline"
            disabled={disabled}
            aria-expanded={adding}
            onClick={() => setAdding((value) => !value)}
          >
            Add widget
          </button>
          <button
            type="button"
            className="tempo-button outline"
            disabled={disabled}
            aria-pressed={editing}
            onClick={() => setEditing((value) => !value)}
          >
            {editing ? "Done" : "Edit board"}
          </button>
        </div>
      </header>
      <State loading={!board.ready && !board.error} error={board.error} />
      {board.pending && <p role="status">Saving widget settings…</p>}
      {board.error && (
        <div className="explore-actions">
          {board.ready && !board.conflict && (
            <button
              type="button"
              className="tempo-button outline"
              onClick={() => board.save()}
            >
              Retry save
            </button>
          )}
          <button
            type="button"
            className="tempo-button outline"
            onClick={board.reload}
          >
            {board.ready
              ? "Discard edits and reload account settings"
              : "Retry loading settings"}
          </button>
        </div>
      )}
      {adding && (
        <section className="explore-widget-catalog" aria-label="Add a widget">
          {Object.entries(WIDGETS).map(([type, option]) => (
            <button
              type="button"
              key={type}
              disabled={
                disabled || board.widgets.some((widget) => widget.type === type)
              }
              onClick={() => {
                board.save([...board.widgets, createWidget(type)]);
                setAdding(false);
              }}
            >
              <strong>{option.title}</strong>
              <span>{option.description}</span>
              <small>
                {board.widgets.some((widget) => widget.type === type)
                  ? "Added"
                  : "Add to board"}
              </small>
            </button>
          ))}
        </section>
      )}
      {board.ready && (
        <div
          className={`explore-board${editing ? " is-editing" : ""}${!userId ? " is-guest" : ""}`}
        >
          {board.widgets.map((widget, index) => (
            <article
              key={widget.id}
              draggable={editing && !disabled}
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", widget.id);
                setDraggedId(widget.id);
              }}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={(event) => {
                if (editing && !disabled && draggedId) event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (
                  !editing ||
                  disabled ||
                  !draggedId ||
                  draggedId === widget.id
                )
                  return;
                const next = [...board.widgets];
                const from = next.findIndex((item) => item.id === draggedId);
                if (from < 0) return;
                const [moved] = next.splice(from, 1);
                next.splice(index, 0, moved);
                setDraggedId(null);
                board.save(next);
              }}
              className={`explore-widget explore-widget-${widget.size}`}
              data-widget-type={widget.type}
              aria-labelledby={`widget-${widget.id}`}
            >
              <header>
                <h3 id={`widget-${widget.id}`}>{widget.title}</h3>
                {["favorite_games", "favorite_teams", "college_polls"].includes(
                  widget.type,
                ) && (
                  <button
                    type="button"
                    className="explore-settings-button"
                    aria-label={`Settings for ${widget.title}`}
                    aria-expanded={settings === widget.id}
                    onClick={() =>
                      setSettings(settings === widget.id ? null : widget.id)
                    }
                  >
                    <Icon name="settings" size={18} />
                  </button>
                )}
                {editing && (
                  <div className="explore-edit-controls">
                    <button
                      type="button"
                      disabled={disabled || index === 0}
                      aria-label={`Move ${widget.title} earlier`}
                      onClick={() => move(index, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={disabled || index === board.widgets.length - 1}
                      aria-label={`Move ${widget.title} later`}
                      onClick={() => move(index, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      aria-label={`Remove ${widget.title}`}
                      onClick={() =>
                        board.save(
                          board.widgets.filter(
                            (value) => value.id !== widget.id,
                          ),
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                )}
              </header>
              {editing && widget.type !== "create_post" && (
                <label className="explore-widget-filter">
                  Widget size
                  <select
                    disabled={disabled}
                    value={widget.size}
                    onChange={(event) =>
                      change(widget.id, { size: event.target.value })
                    }
                  >
                    {["small", "medium", "large"].map((size) => (
                      <option key={size} value={size}>
                        {size[0].toUpperCase() + size.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {settings === widget.id && (
                <label className="explore-autoplay">
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={
                      widget[
                        {
                          favorite_games: "favoriteGamesAutoPlay",
                          favorite_teams: "favoriteTeamsAutoPlay",
                          college_polls: "collegePollAutoPlay",
                        }[widget.type]
                      ] !== false
                    }
                    onChange={(event) =>
                      change(widget.id, {
                        [{
                          favorite_games: "favoriteGamesAutoPlay",
                          favorite_teams: "favoriteTeamsAutoPlay",
                          college_polls: "collegePollAutoPlay",
                        }[widget.type]]: event.target.checked,
                      })
                    }
                  />
                  Auto-play slides
                </label>
              )}
              {(editing || settings === widget.id) &&
                widget.type === "favorite_games" && (
                  <fieldset
                    className="explore-league-options"
                    disabled={disabled}
                  >
                    <legend>Game leagues</legend>
                    {GAME_LEAGUES.map((league) => {
                      const selected =
                        widget.favoriteGameLeagues || GAME_LEAGUES;
                      return (
                        <label key={league}>
                          <input
                            type="checkbox"
                            checked={selected.includes(league)}
                            disabled={
                              disabled ||
                              (selected.length === 1 &&
                                selected.includes(league))
                            }
                            onChange={(event) =>
                              change(widget.id, {
                                favoriteGameLeagues: event.target.checked
                                  ? [...selected, league]
                                  : selected.filter((id) => id !== league),
                              })
                            }
                          />
                          {favoriteLeagues[league].label}
                        </label>
                      );
                    })}
                  </fieldset>
                )}
              <div
                className="explore-widget-body"
                inert={editing ? true : undefined}
              >
                <ExploreWidgetContent
                  widget={widget}
                  userId={userId}
                  change={(patch) => change(widget.id, patch)}
                  disabled={disabled || editing}
                />
              </div>
            </article>
          ))}
        </div>
      )}
      {board.ready && !board.widgets.length && (
        <State empty="Your board is empty. Add a widget to get started." />
      )}
    </section>
  );
}
