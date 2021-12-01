import { BodyLabel, Position, PositionAndAngle } from "../types";
import { Body, World, Bodies } from "matter-js";

class Person {
  body: Body;
  name: string;
  circle: any;
  localDraw: any;
  id: string;
  filterId: string;
  constructor(
    draw: any,
    world: World,
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
    this.localDraw = draw.group();
    this.circle = null;
    this.body = this.makeBody(positionAndAngle);
    World.add(world, this.body);
    this.display();
    this.update();
  }

  makeBody(positionAndAngle: PositionAndAngle) {
    const body = Bodies.circle(positionAndAngle.x, positionAndAngle.y, 10, {
      friction: 0.9,
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

  getRadius() {
    return 10;
  }

  getHeight() {
    return this.getRadius() * 2;
  }

  getWidth() {
    return this.getRadius() * 2;
  }

  display() {
    const radius = this.getRadius();
    this.circle = this.localDraw.circle(radius * 2).attr({ fill: "#fff" });
    this.localDraw
      .text((add: any) => {
        add
          .tspan(
            this.name
              .split(" ")
              .map((c) => c.charAt(0))
              .join("")
          )
          .newLine();
      })
      .attr({ width: radius * 2 });
  }

  update() {
    this.localDraw.transform({
      translateX: this.body.position.x - this.getRadius(),
      translateY: this.body.position.y - this.getRadius()
    });
  }
}

export default Person;
