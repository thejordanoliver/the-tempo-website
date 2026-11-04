import { useState } from "react";
import { Link } from "../../app/router.jsx";
import { favoriteLeagues } from "../../data/leagues/favoriteLeagues.js";
import {
  createWidget,
  WIDGETS,
  GAME_LEAGUES,
} from "../../data/explore/explore.js";
import useExploreBoard from "../../hooks/useExploreBoard.js";
import Icon from "../ui/Icon.jsx";
import ThemeSource from "../ui/ThemeSource.jsx";
import { State } from "../ui/State.jsx";
import ExploreWidgetContent from "./ExploreWidgetContent.jsx";

const primaryTypes = ["favorite_games", "standings", "college_polls"];
const personalTypes = ["favorite_games", "favorite_teams", "my_picks"];
const sectionIcons = {
  favorite_games: "scoreboard",
  favorite_teams: "heart",
  my_picks: "checkmark-circle",
  standings: "podium",
  college_polls: "school",
  create_post: "chatbubbles",
};

function LeagueDirectory() {
  return (
    <section
      className="dashboard-leagues"
      aria-labelledby="dashboard-leagues-title"
    >
      <div className="dashboard-section-heading">
        <div>
          <h3 id="dashboard-leagues-title">Leagues</h3>
        </div>
        <Icon name="open" size={18} />
      </div>
      <div className="dashboard-league-links">
        {["nba", "nfl", "mlb", "nhl", "cfb", "mcbb"].map((key) => {
          const league = favoriteLeagues[key];
          return (
            <Link key={key} to={`/league/?league=${key}`}>
              <picture>
                <ThemeSource srcSet={league.logoDark || league.logo} />
                <img src={league.logo} alt="" loading="lazy" />
              </picture>
              <span>{league.label}</span>
              <Icon name="chevron-forward" size={14} />
            </Link>
          );
        })}
      </div>
      <Link className="dashboard-directory-all" to="/leagues/">
        All leagues <Icon name="arrow-forward" size={16} />
      </Link>
    </section>
  );
}

export default function ExploreBoard({ userId }) {
  const board = useExploreBoard(userId);
  const [customizing, setCustomizing] = useState(false);
  const disabled = !board.ready || board.pending || Boolean(board.error);
  const change = (id, patch) =>
    board.save(
      board.widgets.map((widget) =>
        widget.id === id ? { ...widget, ...patch } : widget,
      ),
    );
  const visibleWidgets = board.widgets.filter(
    (widget) => userId || !personalTypes.includes(widget.type),
  );
  const primary = visibleWidgets.filter((widget) =>
    primaryTypes.includes(widget.type),
  );
  const secondary = visibleWidgets.filter(
    (widget) => !primaryTypes.includes(widget.type),
  );
  const options = Object.entries(WIDGETS).filter(
    ([type]) => userId || !personalTypes.includes(type),
  );
  const renderSection = (widget) => {
    return (
      <article
        key={widget.id}
        className={`dashboard-panel dashboard-panel-${widget.type}`}
        aria-labelledby={`dashboard-title-${widget.id}`}
      >
        <header className="dashboard-panel-heading">
          <div className="dashboard-panel-title">
            <span className="dashboard-panel-icon">
              <Icon name={sectionIcons[widget.type]} size={21} />
            </span>
            <div>
              <h3 id={`dashboard-title-${widget.id}`}>{widget.title}</h3>
            </div>
          </div>
          {widget.type === "favorite_games" && (
            <details className="dashboard-settings">
              <summary aria-label="Favorite Games league settings">
                <Icon name="settings" size={18} />
                <span>Leagues</span>
              </summary>
              <fieldset disabled={disabled}>
                <legend>Show games from</legend>
                {GAME_LEAGUES.map((league) => {
                  const selected = widget.favoriteGameLeagues || GAME_LEAGUES;
                  return (
                    <label key={league}>
                      <input
                        type="checkbox"
                        checked={selected.includes(league)}
                        disabled={
                          disabled ||
                          (selected.length === 1 && selected.includes(league))
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
            </details>
          )}
        </header>
        <div className="dashboard-panel-body">
          <ExploreWidgetContent
            widget={widget}
            userId={userId}
            change={(patch) => change(widget.id, patch)}
            disabled={disabled}
          />
        </div>
      </article>
    );
  };
  return (
    <section
      className="explore-dashboard"
      aria-labelledby="explore-board-title"
    >
      <header className="explore-board-heading">
        <div>
          <h2 id="explore-board-title">Dashboard</h2>
        </div>
        <div className="dashboard-customize-action">
          <span className="dashboard-save-status" role="status">
            {board.pending ? "Saving…" : ""}
          </span>
          <button
            type="button"
            className="dashboard-link-button"
            disabled={disabled}
            aria-label={
              customizing ? "Done customizing" : "Customize dashboard"
            }
            aria-expanded={customizing}
            aria-controls="dashboard-customize"
            onClick={() => setCustomizing((value) => !value)}
          >
            <Icon name={customizing ? "close" : "settings"} size={18} />
            {customizing ? "Done" : "Customize"}
          </button>
        </div>
      </header>
      <State loading={!board.ready && !board.error} error={board.error} />
      {board.error && (
        <div className="explore-actions">
          {board.ready && !board.conflict && (
            <button
              type="button"
              className="dashboard-link-button"
              onClick={() => board.save()}
            >
              Retry save
            </button>
          )}
          <button
            type="button"
            className="dashboard-link-button"
            onClick={board.reload}
          >
            {board.ready ? "Discard edits and reload" : "Reload settings"}
          </button>
        </div>
      )}
      {customizing && (
        <section
          id="dashboard-customize"
          className="dashboard-customize"
          aria-labelledby="dashboard-customize-title"
        >
          <div>
            <h3 id="dashboard-customize-title">Sections</h3>
            <p>
              {userId ? "Saved to your account." : "Saved in this browser."}
            </p>
          </div>
          <div className="dashboard-section-options">
            {options.map(([type, option]) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={board.widgets.some((widget) => widget.type === type)}
                  disabled={disabled}
                  onChange={(event) =>
                    board.save(
                      event.target.checked
                        ? [...board.widgets, createWidget(type)]
                        : board.widgets.filter(
                            (widget) => widget.type !== type,
                          ),
                    )
                  }
                />
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
              </label>
            ))}
          </div>
        </section>
      )}
      <div className="dashboard-columns">
        <div className="dashboard-primary">
          {board.ready && primary.map(renderSection)}
          {board.ready && !primary.length && (
            <div className="dashboard-empty">
              <Icon name="scoreboard" size={32} />
              <h3>No sections selected</h3>
              <button
                type="button"
                className="tempo-button outline"
                disabled={disabled}
                onClick={() => setCustomizing(true)}
              >
                Choose sections
              </button>
            </div>
          )}
        </div>
        <aside className="dashboard-sidebar" aria-label="Your sports shortcuts">
          {!userId && (
            <section className="dashboard-personalize">
              <span className="dashboard-personalize-icon">
                <Icon name="heart" size={25} />
              </span>
              <h3>Make it yours</h3>
              <p>Save favorites and track picks.</p>
              <Link
                className="tempo-button"
                to="/login/"
                aria-label="Sign in to personalize"
              >
                Sign in <Icon name="arrow-forward" size={18} />
              </Link>
            </section>
          )}
          {board.ready && secondary.map(renderSection)}
          <LeagueDirectory />
        </aside>
      </div>
    </section>
  );
}
