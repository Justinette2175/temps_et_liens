import { PersonData, CategoryData, PositionAndAngle } from "../types";
import Person from "./Person";
import $, { timers } from "jquery";
import Matter, { Engine, Runner, Events, World } from "matter-js";
import AttractiveFilter from "./AttractiveFilter";
import Boundary from "./Boundary";

const typedWindow: any = window as any;

const SVG = typedWindow.SVG;

type GraphicalPersonInstance = {
  bodyId: number;
  personId: string;
  tagId: string;
  position: PositionAndAngle;
};

type GraphicalTagFilter = {
  bodyId: number;
  position: PositionAndAngle;
  tagId: string;
  name: string;
  bodyType: string;
};

class Visualization {
  graphicalTagFilters: Array<GraphicalTagFilter>;
  graphicalPersonInstances: Array<GraphicalPersonInstance>;
  getStoredPersonById: (id: string) => PersonData | undefined;
  getStoredTagById: (id: string) => CategoryData | undefined;
  engine: Engine;
  runner: Runner;
  draw: any;
  persons: Person[];
  attractiveFilters: AttractiveFilter[];
  filtersConstraints: Matter.Constraint[];
  boundaries: {
    top: Boundary;
    right: Boundary;
    bottom: Boundary;
    left: Boundary;
  };
  constructor(
    getStoredPersonById: (id: string) => PersonData | undefined,
    getStoredTagById: (id: string) => CategoryData | undefined
  ) {
    this.graphicalTagFilters = [];
    this.graphicalPersonInstances = [];
    this.filtersConstraints = [];
    this.getStoredPersonById = getStoredPersonById;
    this.getStoredTagById = getStoredTagById;
    this.engine = Engine.create({ gravity: { y: 0 } });
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
    Events.on(this.runner, "afterUpdate", this.update.bind(this));
    this.draw = SVG().addTo("#svg").size(window.innerWidth, window.innerHeight);
    this.persons = [];
    this.attractiveFilters = [];
    this.boundaries = {
      top: new Boundary(
        this.engine.world,
        this.draw,
        0,
        0,
        window.innerWidth,
        300
      ),
      right: new Boundary(
        this.engine.world,
        this.draw,
        window.innerWidth,
        0,
        300,
        window.innerHeight
      ),
      bottom: new Boundary(
        this.engine.world,
        this.draw,
        0,
        window.innerHeight,
        window.innerWidth,
        300
      ),
      left: new Boundary(
        this.engine.world,
        this.draw,
        0,
        0,
        300,
        window.innerHeight
      )
    };
  }

  addPerson(id: string, name: string, tagId: string = "main") {
    const newPerson = new Person(this.draw, this.engine.world, {
      name,
      id,
      filterId: tagId
    });
    this.persons.push(newPerson);
  }

  addTagFilter(tagName: string, id: string) {
    const newAttractiveFilter = new AttractiveFilter(
      this.draw,
      this.engine.world,
      { name: tagName, id }
    );
    if (this.attractiveFilters.length > 0) {
      const newConstraint = Matter.Constraint.create({
        bodyA: newAttractiveFilter.body,
        bodyB: this.attractiveFilters[this.attractiveFilters.length - 1].body,
        length: 300,
        stiffness: 0.2
      });
      World.add(this.engine.world, newConstraint);
      this.filtersConstraints.push(newConstraint);
    }
    // this.attractiveFilters.forEach((filter) => {
    // });
    this.attractiveFilters.push(newAttractiveFilter);
  }

  update() {
    this.persons.forEach((p) => {
      p.update();
    });
    this.attractiveFilters.forEach((f) => {
      f.update();
    });
  }

  displayInfo<DataType>(data: DataType, position: { x: number; y: number }) {
    $("#info").append(`
      <div class="info-window" style="transform: translate(${position.x}px, ${
      position.y
    }px)">
        ${JSON.stringify(data)}
      </div>  
    `);
  }

  handlePersonHover(personId: string, position: { x: number; y: number }) {
    const personData = this.getStoredPersonById(personId);
    if (personData) {
      this.displayInfo<PersonData>(personData, position);
    }
  }

  handleTagFilterHover(tagId: string, position: { x: number; y: number }) {
    const categoryData = this.getStoredPersonById(tagId);
    if (categoryData) {
      this.displayInfo<CategoryData>(categoryData, position);
    }
  }
}

export default Visualization;
