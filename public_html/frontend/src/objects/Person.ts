import { BodyLabel, Position, PositionAndAngle } from "../types";
import { Body, World, Bodies } from "matter-js";
import Circle from "./Circle";
import PersonLabel from "./PersonLabel";

class Person {
  name: string;
  id: string;
  categoryId: string;
  circle: Circle;
  personLabel: PersonLabel;
  onToggleMouseOver?: (isMousedOver: boolean) => void;
  onDrag?: () => void;
  constructor(
    draw: any,
    data: { name: string; id: string; categoryId: string },
    position: Position = { x: 0, y: 0 },
    onToggleMouseOver?: (isMousedOver: boolean) => void,
    onDragToggle?: (dragging: boolean) => void
  ) {
    this.name = data.name;
    this.id = data.id;
    this.categoryId = data.categoryId;
    this.onToggleMouseOver = onToggleMouseOver;
    this.circle = new Circle(
      draw.group(),
      position.x,
      position.y,
      14,
      { fill: "#fff" },
      this.handleToggleMouseOver.bind(this),
      (dragging: boolean) => {
        if (onDragToggle) {
          onDragToggle(dragging);
        }
      }
    );
    this.personLabel = new PersonLabel(data, {
      x: this.circle._x,
      y: this.circle._y
    });
    this.update();
  }

  handleToggleMouseOver(isMousedOver: boolean) {
    if (isMousedOver) {
      this.personLabel.show();
    } else {
      this.personLabel.hide();
    }
    if (this.onToggleMouseOver) {
      this.onToggleMouseOver(isMousedOver);
    }
  }

  moveTo(position: Position) {
    this.circle.moveTo(position);
    this.personLabel.moveTo(position);
  }

  display() {
    this.circle.display();
  }

  toggleActive(isActive: boolean) {
    this.circle.body.attr({ fill: isActive ? "#aa0000" : "#ffffff" });
  }

  update() {
    // this.localDraw.transform({
    //   translateX: this.body.position.x - this.getRadius(),
    //   translateY: this.body.position.y - this.getRadius()
    // });
  }
}

export default Person;
