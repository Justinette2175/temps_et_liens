import Matter, {
  Engine,
  Runner,
  Render,
  Composite,
  Bodies,
  Body,
  Mouse,
  MouseConstraint,
  Events
} from "matter-js";
import MatterAttractors from "matter-attractors";

Matter.use(MatterAttractors);

import RADIUS_BY_ZOOM_LEVEL from "../utils/zoom";

export type BodyLabel = {
  tagId: string;
  objectType?: "regular" | "staticDraggable";
};

class MatterVisualization {
  engine: Engine;
  render: Render;
  runner: Runner;
  composite: Composite;
  mouse: Mouse;
  mouseConstraint: MouseConstraint;
  constructor() {
    this.engine = Engine.create({ gravity: { y: 0 } });
    this.render = Render.create({
      element: document.body,
      engine: this.engine,

      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "transparent"
      }
    });
    Render.run(this.render);
    this.composite = Composite.create(this.engine.world);
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
    this.mouse = Mouse.create(this.render.canvas);
    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: this.mouse
    });
    this.setupMouse();
  }

  addBodies(
    bodies:
      | Composite
      | Matter.Body
      | Matter.Constraint
      | Matter.MouseConstraint
      | (Composite | Matter.Body | Matter.Constraint | Matter.MouseConstraint)[]
  ) {
    Composite.add(this.composite, bodies);
  }

  addCircle({
    radius,
    x,
    y,
    options
  }: {
    radius: number;
    x?: number;
    y?: number;
    options: Matter.IBodyDefinition | undefined;
    maxSides?: number | undefined;
  }) {
    const newBody = Bodies.circle(x || 0, y || 0, radius, {
      ...options,
      friction: 0.9,
      collisionFilter: {
        group: 1
      }
    });
    this.addBodies([newBody]);
  }

  addAttractiveCircle({
    radius,
    label,
    x,
    y
  }: {
    radius: number;
    label: string;
    x?: number;
    y: number;
  }) {
    const body = Matter.Bodies.circle(x || 0, y || 0, radius, {
      label,
      plugin: {
        attractors: [
          (bodyA: Matter.Body, bodyB: Matter.Body) => {
            const bodyATagId = this.parseBodyLabel(bodyA.label).tagId;
            const bodyBTagId = this.parseBodyLabel(bodyB.label).tagId;
            if (bodyATagId === bodyBTagId) {
              var force = {
                x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                y: (bodyA.position.y - bodyB.position.y) * 1e-6
              };

              Body.applyForce(bodyB, bodyB.position, force);
            }
          }
        ]
      }
    });
    Matter.Body.setStatic(body, true);
    this.addBodies([body]);
    return { id: body.id, type: body.type };
  }

  getBodyById(id: number) {
    return Composite.get(this.composite, id, "body");
  }

  parseBodyLabel(bodyLabel: string) {
    return JSON.parse(bodyLabel) as unknown as BodyLabel;
  }

  setupMouse() {
    Composite.add(this.composite, this.mouseConstraint);
    Events.on(this.mouseConstraint, "startdrag", (e) => {
      const bodyLabel = this.parseBodyLabel(e.body.label);
      if (bodyLabel.objectType === "staticDraggable") {
        Matter.Body.setStatic(e.body, false);
      }
    });
    Events.on(this.mouseConstraint, "enddrag", (e) => {
      const bodyLabel = this.parseBodyLabel(e.body.label);
      if (bodyLabel.objectType === "staticDraggable") {
        Matter.Body.setStatic(e.body, true);
      }
    });
  }
}

export default MatterVisualization;
