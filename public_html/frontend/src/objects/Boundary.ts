import { World, Bodies } from "matter-js";

class Boundary {
  localDraw: any;
  constructor(
    world: World,
    draw: any,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    this.localDraw = draw;
    const boundary = Bodies.rectangle(x, y, w, h, {
      isStatic: true
    });
    World.add(world, boundary);
  }

  display() {
    this.localDraw.rect();
  }
}

export default Boundary;
