import { Position } from "../types";

class Circle {
  _x: number;
  _y: number;
  _r: number;
  localDraw: any;
  body: any;
  attr: any;
  onToggleMouseOver?: (isMousedOver: boolean) => void;
  onDragToggle?: (dragging: boolean) => void;
  constructor(
    draw: any,
    x: number,
    y: number,
    r: number,
    attr: any = {},
    onToggleMouseOver?: (isMousedOver: boolean) => void,
    onDragToggle?: (dragging: boolean) => void
  ) {
    this.localDraw = draw;
    this._x = x;
    this._y = y;
    this._r = r;
    this.body = undefined;
    this.attr = attr;
    this.onToggleMouseOver = onToggleMouseOver;
    this.onDragToggle = onDragToggle;
  }

  moveTo(position: Position) {
    this._x = position.x;
    this._y = position.y;
    this.moveBodyTo(position);
  }

  moveBodyTo(position: Position) {
    if (this.body) {
      this.body.transform({
        translateX: position.x - this._r,
        translateY: position.y - this._r
      });
    }
  }

  display() {
    if (this.body) {
      this.body.remove();
    }
    this.body = this.localDraw.circle(this._r * 2).attr(this.attr);
    if (this.onToggleMouseOver) {
      this.body.on("mouseover", () =>
        (this.onToggleMouseOver as (isMousedOver: boolean) => void)(true)
      );
      this.body.on("mouseout", () => {
        (this.onToggleMouseOver as (isMousedOver: boolean) => void)(false);
      });
    }
    if (this.onDragToggle) {
      this.body.on("mouseup", () => {
        (this.onDragToggle as (isDragged: boolean) => void)(false);
        this.resetPosition();
      });
      this.body.on("mousedown", () => {
        (this.onDragToggle as (isDragged: boolean) => void)(true);
      });
    }
    this.moveTo({ x: this._x, y: this._y });
  }

  resetPosition() {
    this.moveBodyTo({ x: this._x, y: this._y });
  }

  hide() {
    this.body.remove();
  }
}

export default Circle;
