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
    if (!confirmedName) {
      document.body.classList.add("welcome-background");
    } else {
      document.body.classList.remove("welcome-background");
    }
  }, [confirmedName]);

  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length / 2) {
      setGameOver(true);
    }
  }, [matchedCards, cards]);

  useEffect(() => {
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
    <div>
      {!confirmedName ? (
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
          <h1 className="title"> ¡it's time to play, {playerName}!</h1>
          <div className="scoreboard">
            <p className={correct > 0 ? "correct" : ""}> Correct: {correct}</p>
            <p className={errors > 0 ? "error" : ""}>Fail: {errors}</p>
          </div>
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
