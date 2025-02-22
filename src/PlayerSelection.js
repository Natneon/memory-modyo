import React from "react";
import "./PlayerSelection.css";

function PlayerSelection({ onSelectPlayer, storedName }) {
  return (
    <div className="player-selection">
      <h1 className="title">Don't Stop the Fun!</h1>
      <p className="subtitle">Choose how you want to play:</p>
      <button
        onClick={() => onSelectPlayer("existing")}
        className="player-button-1"
      >
        Play as {storedName}
      </button>
      <button onClick={() => onSelectPlayer("new")} className="player-button-2">
        Play as a New Player
      </button>
    </div>
  );
}

export default PlayerSelection;
