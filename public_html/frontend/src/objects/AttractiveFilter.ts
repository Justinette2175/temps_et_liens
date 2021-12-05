import { PositionAndAngle } from "../types";
import Circle from "./Circle";
import $ from "jquery";

class AttractiveFilter {
  localDraw: any;
  circle: Circle;
  name: string;
  id: string;
  constructor(
    draw: any,
    { name, id }: { name: string; id: string },
    positionAndAngle: PositionAndAngle = { x: 0, y: 0, angle: 0 }
  ) {
    this.name = name;
    this.id = id;
    this.localDraw = draw.group();
    this.circle = new Circle(
      draw.group(),
      positionAndAngle.x,
      positionAndAngle.y,
      60,
      { fill: "rgba(255, 255, 255, 0.2)" }
    );
  }

  showName() {
    const element = $("<p>");
    element.append(this.name);
    element.addClass("fixed inline-block text-center");
    element.css("max-width", `${this.circle._r * 2 - 5}px`);
    $("body").append(element);
    const width = element.width() || 0;
    const height = element.height() || 0;
    element.css(
      "transform",
      `translate(${this.circle._x - width / 2}px, ${
        this.circle._y - this.circle._r - height / 2
      }px)`
    );
    console.log("width", width);
  }

  display() {
    this.circle.display();
    this.showName();
  }
}

export default AttractiveFilter;
