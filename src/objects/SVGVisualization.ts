import { PersonData, PositionAndAngle } from "../types";
import Person from "./Person";

const typedWindow: any = window as any;

const SVG = typedWindow.SVG;

class SVGVisualization {
  draw: any;
  persons: Record<number, Person>;
  constructor() {
    this.draw = SVG().addTo("#svg").size(window.innerWidth, window.innerHeight);
    this.persons = {};
  }

  addPerson(bodyId: number, name: string) {
    const newPerson = new Person(this.draw, bodyId, name);
    this.persons[bodyId] = newPerson;
  }

  updatePersonsPositions(
    newPersonPositions: Array<{
      bodyId: number;
      positionAndAngle: PositionAndAngle;
    }>
  ) {
    newPersonPositions.forEach((person) => {
      const SVGPerson = this.persons[person.bodyId];
      SVGPerson.moveTo({
        x: person.positionAndAngle.x,
        y: person.positionAndAngle.y
      });
    });
  }
}

export default SVGVisualization;
