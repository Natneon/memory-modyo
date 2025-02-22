import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./Card";
import GameOver from "./GameOver";
import PlayerSelection from "./PlayerSelection";

const generateCards = (values) => {
  const cards = [...values, ...values];
  return cards.sort(() => Math.random() - 0.5);
};

function App() {
  const [playerName, setPlayerName] = useState("");
  const [confirmedName, setConfirmedName] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [errors, setErrors] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para manejar la carga de cartas

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const confirmName = () => {
    if (playerName.trim() !== "") {
      setConfirmedName(true);
      localStorage.setItem("playerName", playerName);
      loadCards(); // Cargar las cartas antes de mostrar el tablero
      setShowBoard(true); // Mostrar el tablero después de confirmar el nombre
    }
  };

  const startGame = () => {
    setShowBoard(true);
  };

  const handleSelectPlayer = (choice) => {
    if (choice === "new") {
      localStorage.removeItem("playerName");
      setPlayerName("");
      setConfirmedName(false);
      setShowPlayerSelection(false); // Volver a welcome-box
    } else {
      setConfirmedName(true);
      setShowPlayerSelection(false);
      loadCards(); // Cargar las cartas antes de mostrar el tablero
      setShowBoard(true); // Mostrar el tablero después de cargar las cartas
    }
  };

  const flipCard = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index)) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      checkMatch(newFlippedCards);
    }
  };

  const checkMatch = (flipped) => {
    const [first, second] = flipped;
    if (cards[first] === cards[second]) {
      setMatchedCards([...matchedCards, cards[first]]);
      setCorrect(correct + 1);
    } else {
      setErrors(errors + 1);
      setTimeout(() => setFlippedCards([]), 1000);
      return;
    }
    setFlippedCards([]);
  };

  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length / 2) {
      setGameOver(true);
    }
  }, [matchedCards, cards]);

  const loadCards = () => {
    setLoading(true); // Activar el estado de carga
    fetch(
      "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=10"
    )
      .then((response) => response.json())
      .then((body) => {
        const images = body.entries.map((entry) => entry.fields.image.url);
        setCards(generateCards(images));
        setLoading(false); // Desactivar el estado de carga
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Desactivar el estado de carga en caso de error
      });
  };

  useEffect(() => {
    loadCards(); // Cargar las cartas al iniciar la aplicación
  }, []);

  const resetGame = () => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      setPlayerName(savedName);
      setShowPlayerSelection(true); // Mostrar PlayerSelection si hay un nombre guardado
    } else {
      setPlayerName("");
      setConfirmedName(false); // Mostrar welcome-box si no hay un nombre guardado
    }
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setErrors(0);
    setCorrect(0);
    setGameOver(false);
    setShowBoard(false);
  };

  if (gameOver) {
    return (
      <GameOver
        name={playerName}
        correct={correct}
        errors={errors}
        resetGame={resetGame}
      />
    );
  }

  return (
    <div>
      {showPlayerSelection ? (
        <PlayerSelection
          onSelectPlayer={handleSelectPlayer}
          storedName={playerName}
        />
      ) : !confirmedName ? (
        <div className="welcome-box">
          <h1 className="title">Welcome to Memory!</h1>
          <p className="subtitle">Enter your name to play</p>
          <input
            type="text"
            value={playerName}
            onChange={handleNameChange}
            placeholder="Your Name"
            className="name-input"
          />
          <button
            onClick={confirmName}
            disabled={playerName.trim() === ""}
            className="confirm-button"
          >
            Confirm your name
          </button>
        </div>
      ) : showBoard ? (
        <div className="board-container">
          <h1 className="title"> ¡It's time to play, {playerName}!</h1>
          <div className="scoreboard">
            <p className={correct > 0 ? "correct" : ""}> Correct: {correct}</p>
            <p className={errors > 0 ? "error" : ""}>Fail: {errors}</p>
          </div>
          {loading ? (
            <p>Loading cards...</p> // Mensaje de carga mientras se obtienen las cartas
          ) : (
            <div className="board">
              {cards.map((card, index) => (
                <Card
                  key={index}
                  index={index}
                  value={card}
                  isFlipped={
                    flippedCards.includes(index) || matchedCards.includes(card)
                  }
                  onClick={() => flipCard(index)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="start-game-container">
          <h1 className="title">¡Welcome, {playerName}!</h1>
          <button onClick={startGame} className="start-game-button">
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
