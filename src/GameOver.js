import React from "react";
import "./GameOver.css";

function GameOver({ name }) {
  return (
    <div className="game-over">
      <div className="bye-box">
        <h1 className="title">¡Congratulations, {name}!</h1>
        <p>You have completed the game!</p>
        <button
          onClick={() => window.location.reload()}
          className="play-again-button"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameOver;
