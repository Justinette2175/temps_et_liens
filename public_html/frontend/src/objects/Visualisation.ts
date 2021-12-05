import {
  PersonData,
  CategoryData,
  PositionAndAngle,
  CategoryId,
  PersonId
} from "../types";
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
  draw: any;
  persons: Person[];
  attractiveFilters: AttractiveFilter[];
  ondragPersonOnCategory: (categoryId: CategoryId, personId: PersonId) => void;
  draggedPerson?: Person;
  constructor(
    ondragPersonOnCategory: (categoryId: CategoryId, personId: PersonId) => void
  ) {
    this.graphicalTagFilters = [];
    this.graphicalPersonInstances = [];
    this.draw = SVG().addTo("#svg").size(window.innerWidth, window.innerHeight);
    this.persons = [];
    this.attractiveFilters = [];
    this.ondragPersonOnCategory = ondragPersonOnCategory;
    this.setupListeners();
  }

  setupListeners() {
    $(document).on("mousemove", (e) => {
      if (this.draggedPerson) {
        this.draggedPerson.circle.moveBodyTo({ x: e.pageX, y: e.pageY });
      }
    });
    $(document).on("mouseup", (e) => {
      if (this.draggedPerson) {
        e.preventDefault();
        const categoryId = $(e.target).data("tag-id");
        this.ondragPersonOnCategory(categoryId, this.draggedPerson.id);
        this.draggedPerson.circle.resetPosition();
        this.draggedPerson = undefined;
      }
    });
  }

  addPerson(id: string, name: string, categoryId: string = "main") {
    const newPerson = new Person(
      this.draw,
      {
        name,
        id,
        categoryId
      },
      undefined,
      (isMousedOver: boolean) => {
        this.persons.forEach((p) => {
          if (p.id === id) {
            p.toggleActive(isMousedOver);
          }
        });
      },
      (dragging: boolean) => {
        if (dragging) {
          this.draggedPerson = newPerson;
        } else {
          this.draggedPerson = undefined;
        }
      }
    );
    const categoryVisual = this.attractiveFilters.find(
      (f) => f.id === categoryId
    );
    const personsInCategoryVisuals = this.persons.filter(
      (p) => p.categoryId === categoryId
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
    newPerson.moveTo(position);
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
      newAttractiveFilter.circle.moveTo({ x: position.x, y: position.y });
      newAttractiveFilter.display();
      this.attractiveFilters.push(newAttractiveFilter);
    }
  }

  updateCategoryVisibility(categoryId: CategoryId, newVisible: boolean) {
    this.attractiveFilters.forEach((f) => {
      if (f.id === categoryId) {
        if (newVisible) {
          f.display();
        } else {
          f.hide();
        }
      }
    });
  }

  destroy() {
    $("#info").empty();
    $("#svg").empty();
    this.draw.clear();
  }
}

export default Visualization;
