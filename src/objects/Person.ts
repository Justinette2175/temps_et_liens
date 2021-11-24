import { Position } from "../types";

class Person {
  bodyId: number;
  name: string;
  circle: any;
  localDraw: any;
  constructor(draw: any, bodyId: number, name: string) {
    this.bodyId = bodyId;
    this.name = name;
    this.localDraw = draw.group();
    this.circle = null;
    this.display();
    this.moveTo({ x: 0, y: 0 });
  }

  getAbsolutePosition() {
    return {
      x: this.localDraw.transform().translateX + this.localDraw.x(),
      y: this.localDraw.transform().translateY + this.localDraw.y()
    };
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
    this.circle = this.localDraw
      .circle(radius * 2)
      .attr({ fill: "#fff", x: 0, y: 0 });

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

  moveTo(location: Position) {
    this.localDraw.transform({
      translateX: location.x,
      translateY: location.y
    });
  }
}

export default Person;
