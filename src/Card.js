import React from "react";
import "./Card.css";

function Card({ value, isFlipped, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      {isFlipped ? (
        <div className="card-face">
          <img src={value}></img>
        </div>
      ) : (
        <div className="card-back"></div>
      )}
    </div>
  );
}

export default Card;
