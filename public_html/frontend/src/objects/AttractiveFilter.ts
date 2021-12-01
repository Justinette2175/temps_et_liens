import Matter, { Bodies, Body, World } from "matter-js";
import MatterAttractors from "matter-attractors";
import { PositionAndAngle } from "../types";
import { parseBodyLabel } from "../utils/parseBodyLabel";

Matter.use(MatterAttractors);

class AttractiveFilter {
  body: Body;
  localDraw: any;
  circle: any;
  name: string;
  id: string;
  constructor(
    draw: any,
    world: World,
    { name, id }: { name: string; id: string },
    positionAndAngle: PositionAndAngle = { x: 0, y: 0, angle: 0 }
  ) {
    this.name = name;
    this.id = id;
    this.localDraw = draw.group();
    this.circle = null;
    this.body = this.makeBody(positionAndAngle);
    World.add(world, this.body);
    this.display();
    this.update();
  }

  makeBody(positionAndAngle: PositionAndAngle) {
    const body = Bodies.circle(
      positionAndAngle.x || window.innerWidth / 2,
      positionAndAngle.y || window.innerHeight / 2,
      this.getRadius(),
      {
        label: JSON.stringify({
          bodyType: "staticDraggable",
          dataType: "tag",
          dataId: this.id
        }),
        plugin: {
          attractors: [
            (bodyA: Body, bodyB: Body) => {
              if (bodyA.label && bodyB.label) {
                const bodyATagId = parseBodyLabel(bodyA.label).dataId;
                const bodyBTagId = parseBodyLabel(bodyB.label).filterId;
                if (bodyATagId === bodyBTagId) {
                  var force = {
                    x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                    y: (bodyA.position.y - bodyB.position.y) * 1e-6
                  };
                  Body.applyForce(bodyB, bodyB.position, force);
                }
              }
            }
          ]
        }
      }
    );
    // Matter.Body.setStatic(body, true);
    return body;
  }

  getRadius() {
    return 100;
  }

  display() {
    const radius = this.getRadius();
    this.circle = this.localDraw.circle(radius * 2).attr({ fill: "#fff" });
    this.localDraw
      .text((add: any) => {
        add.tspan(this.name).newLine();
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

export default AttractiveFilter;
