import React from "react";
import "./GameOver.css";

function GameOver({ name, correct, errors, resetGame }) {
  return (
    <div className="game-over">
      <div className="bye-box">
        <h1 className="title">¡Congratulations, {name}!</h1>
        <p className="subtitle">You have completed the game!</p>
        <div className="score-summary">
          <p className="correct">
            Correct Matches: <span>{correct}</span>
          </p>
          <p className="error">
            Errors: <span>{errors}</span>
          </p>
        </div>
        <button onClick={resetGame} className="play-again-button">
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameOver;
