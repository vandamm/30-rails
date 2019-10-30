import React from "react";
import "./Cell.css";

export default function Cell(props) {
  const { value, onClick, selected } = props;

  const hasValue = value === undefined;
  const isActive =
    (selected === props.x || selected === props.y) &&
    (hasValue || props.updated);

  const classes = ["cell", isActive ? "selected" : "", hasValue ? "" : "empty"];

  return (
    <div className={classes.join(" ")} onClick={onClick}>
      {value}
    </div>
  );
}
