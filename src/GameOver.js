import React from "react";
import "./GameOver.css";

function GameOver({ name }) {
  return (
    <div className="game-over">
      <h1>¡Felicidades, {name}!</h1>
      <p>¡Has completado el juego!</p>
      <button onClick={() => window.location.reload()}>Jugar de nuevo</button>
    </div>
  );
}

export default GameOver;
