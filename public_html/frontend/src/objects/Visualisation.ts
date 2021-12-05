import { PersonData, CategoryData, PositionAndAngle } from "../types";
import {
  getNonOverlappingCirclePosition,
  getClosestValidPosition
} from "../utils";
import Person from "./Person";
import $ from "jquery";
import AttractiveFilter from "./AttractiveFilter";

const typedWindow: any = window as any;

const SPACE_BETWEEN_CATEGORY_AND_PERSON = 5;
const SPACE_BETWEEN_CATEGORIES = 200;
const SPACE_BETWEEN_PERSONS = 2;

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
  draw: any;
  persons: Person[];
  attractiveFilters: AttractiveFilter[];
  constructor(
    getStoredPersonById: (id: string) => PersonData | undefined,
    getStoredTagById: (id: string) => CategoryData | undefined
  ) {
    this.graphicalTagFilters = [];
    this.graphicalPersonInstances = [];
    this.getStoredPersonById = getStoredPersonById;
    this.getStoredTagById = getStoredTagById;
    this.draw = SVG().addTo("#svg").size(window.innerWidth, window.innerHeight);
    this.persons = [];
    this.attractiveFilters = [];
  }

  addPerson(id: string, name: string, tagId: string = "main") {
    const newPerson = new Person(this.draw, {
      name,
      id,
      filterId: tagId
    });
    const categoryVisual = this.attractiveFilters.find((f) => f.id === tagId);
    const personsInCategoryVisuals = this.persons.filter(
      (p) => p.filterId === tagId
    );
    if (!categoryVisual) {
      return;
    }

    const position = getClosestValidPosition(
      personsInCategoryVisuals.map((i) => ({
        x: i.circle._x,
        y: i.circle._y,
        r: i.circle._r + SPACE_BETWEEN_PERSONS
      })),
      {
        x: categoryVisual.circle._x,
        y: categoryVisual.circle._y,
        r: categoryVisual.circle._r + SPACE_BETWEEN_CATEGORY_AND_PERSON
      },
      newPerson.circle._r
    );
    newPerson.circle.moveTo(position.x, position.y);
    newPerson.display();
    this.persons.push(newPerson);
  }

  addTagFilter(tagName: string, id: string) {
    const newAttractiveFilter = new AttractiveFilter(this.draw, {
      name: tagName,
      id
    });
    const position = getNonOverlappingCirclePosition(
      [
        ...this.attractiveFilters.map((f) => ({
          x: f.circle._x,
          r: f.circle._r,
          y: f.circle._y
        }))
      ],
      newAttractiveFilter.circle._r,
      SPACE_BETWEEN_CATEGORIES
    );
    if (!position) {
      console.log("could not get a good position");
    } else {
      newAttractiveFilter.circle.moveTo(position.x, position.y);
      newAttractiveFilter.display();
      this.attractiveFilters.push(newAttractiveFilter);
    }
  }

  update() {}

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
