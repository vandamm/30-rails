import React from "react";
import "./Dice.css";

function Die(props) {
  const { value, onClick } = props;

  return (
    <div className={["die", `die-face-${value}`].join(" ")} onClick={onClick}>
      {value}
    </div>
  );
}

export default function Dice(props) {
  const { roll, dice = [] } = props;

  return (
    <div className="dice-group" onClick={roll}>
      {dice.map((data, i) => (
        <Die key={i} {...data} />
      ))}
    </div>
  );
}

export function getRollResult(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
