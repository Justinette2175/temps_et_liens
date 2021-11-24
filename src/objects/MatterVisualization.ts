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
  filterId?: string;
  bodyType?: "regular" | "staticDraggable";
  dataType?: "person" | "tag";
  dataId: string;
};

class MatterVisualization {
  engine: Engine;
  render: Render;
  runner: Runner;
  composite: Composite;
  mouse: Mouse;
  mouseConstraint: MouseConstraint;
  constructor(afterUpdate: () => void) {
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
    Events.on(this.runner, "afterUpdate", afterUpdate);
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

  addPerson(personId: string, tagId: string) {
    const labelObject: BodyLabel = {
      filterId: tagId,
      bodyType: "regular",
      dataType: "person",
      dataId: personId
    };
    return this.addCircle({
      radius: 10,
      options: { label: JSON.stringify(labelObject) }
    });
  }

  addTagFilter(tagId: string) {
    const labelObject: BodyLabel = {
      bodyType: "staticDraggable",
      dataType: "tag",
      dataId: tagId
    };
    console.log("tag filter", labelObject);
    return this.addAttractiveCircle({
      radius: 60,
      label: JSON.stringify(labelObject),
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
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
    const body = Bodies.circle(x || 0, y || 0, radius, {
      ...options,
      friction: 0.9,
      collisionFilter: {
        group: 1
      }
    });
    this.addBodies([body]);
    return {
      bodyId: body.id,
      position: {
        ...body.position,
        angle: body.angle
      }
    };
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
            const bodyATagId = this.parseBodyLabel(bodyA.label).dataId;
            const bodyBTagId = this.parseBodyLabel(bodyB.label).filterId;
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
    return {
      bodyId: body.id,
      bodyType: body.type,
      position: {
        ...body.position,
        angle: body.angle
      }
    };
  }

  getBodyPositionAndAngleByBodyId(id: number) {
    const body = Composite.get(this.composite, id, "body") as Body;
    return {
      ...body.position,
      angle: body.angle
    };
  }

  getBodyByBodyId(id: number) {
    return Composite.get(this.composite, id, "body");
  }

  parseBodyLabel(bodyLabel: string) {
    return JSON.parse(bodyLabel) as unknown as BodyLabel;
  }

  setupMouse() {
    Composite.add(this.composite, this.mouseConstraint);
    Events.on(this.mouseConstraint, "startdrag", (e) => {
      const bodyLabel = this.parseBodyLabel(e.body.label);
      if (bodyLabel.bodyType === "staticDraggable") {
        Matter.Body.setStatic(e.body, false);
      }
    });
    Events.on(this.mouseConstraint, "enddrag", (e) => {
      const bodyLabel = this.parseBodyLabel(e.body.label);
      if (bodyLabel.bodyType === "staticDraggable") {
        Matter.Body.setStatic(e.body, true);
      }
    });
  }
}

export default MatterVisualization;
