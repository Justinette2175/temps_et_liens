import { BodyLabel, Position, PositionAndAngle } from "../types";
import { Body, World, Bodies } from "matter-js";
import Circle from "./Circle";

class Person {
  name: string;
  id: string;
  filterId: string;
  circle: Circle;
  constructor(
    draw: any,
    { id, name, filterId }: { name: string; id: string; filterId: string },
    positionAndAngle: PositionAndAngle = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      angle: 0
    }
  ) {
    this.name = name;
    this.id = id;
    this.filterId = filterId;
    this.circle = new Circle(
      draw.group(),
      positionAndAngle.x,
      positionAndAngle.y,
      10,
      { fill: "#fff" }
    );
    this.update();
  }

  makeBody(positionAndAngle: PositionAndAngle) {
    const body = Bodies.circle(positionAndAngle.x, positionAndAngle.y, 10, {
      friction: 0.9,
      restitution: 0,
      collisionFilter: {
        group: 1
      },
      label: JSON.stringify({
        filterId: this.filterId,
        bodyType: "regular",
        dataType: "person",
        dataId: this.id
      } as BodyLabel)
    });
    return body;
  }

  moveTo(positionAndAngle: PositionAndAngle) {
    this.circle._x = positionAndAngle.x;
    this.circle._y = positionAndAngle.y;
  }

  display() {
    this.circle.display();
  }

  update() {
    // this.localDraw.transform({
    //   translateX: this.body.position.x - this.getRadius(),
    //   translateY: this.body.position.y - this.getRadius()
    // });
  }
}

export default Person;
