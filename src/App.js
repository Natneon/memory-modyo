import React, { useState, useEffect } from "react";
import "./App.css";
import Card from "./Card";
import GameOver from "./GameOver";

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
  const [loadingAnimalImages, setLoadingAnimalImages] = useState([]);

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const confirmName = () => {
    if (playerName.trim() !== "") {
      setConfirmedName(true);
    }
  };

  const startGame = () => {
    setShowBoard(true);
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

  useEffect(() => {
    console.log("hola");
    fetch(
      "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=10"
    )
      .then((response) => {
        return response.json();
      })
      .then((body) => {
        console.log("body", body);
        const images = body.entries.map((entry) => {
          return entry.fields.image.url;
        });
        setCards(generateCards(images));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (gameOver) {
    return <GameOver name={playerName} />;
  }

  return (
    <div className="game-container">
      {!confirmedName ? (
        <div className="welcome-box">
          <h1 className="title">Bienvenido a Memory by Modyo</h1>
          <p className="subtitle">Introduce tu nombre para jugar</p>
          <input
            type="text"
            value={playerName}
            onChange={handleNameChange}
            placeholder="Tu nombre"
            className="name-input"
          />
          <button
            onClick={confirmName}
            disabled={playerName.trim() === ""}
            className="confirm-button"
          >
            Confirmar nombre
          </button>
        </div>
      ) : showBoard ? (
        <div>
          <h1>¡Bienvenido, {playerName}!</h1>
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
          <div className="scoreboard">
            <p>Aciertos: {correct}</p>
            <p>Errores: {errors}</p>
          </div>
        </div>
      ) : (
        <div className="start-game-container">
          <h1>¡Bienvenido, {playerName}!</h1>
          <button onClick={startGame} className="start-game-button">
            Empezar juego
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
