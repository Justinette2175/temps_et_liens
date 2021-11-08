import { generateRosacePositions } from "../utils";
import { PersonData, TagData } from "../types";
import Person from "./Person";
import TagsList from "./TagsList";

import RADIUS_BY_ZOOM_LEVEL from "../utils/zoom";

const typedWindow: any = window as any;

const SVG = typedWindow.SVG;

/**
 * Options for sorting
 * View all (position in rows, order by id?)
 * Filiter by catergogy (row )
 */

type DisplayOptions = {
  zoomLevel: number;
};

class SVGVisualization {
  draw: any;
  persons: Array<Person>;
  tagsList: TagsList;
  displayOptions: DisplayOptions;
  filters: Array<TagData["id"]>;
  constructor(displayOptions: DisplayOptions) {
    this.displayOptions = displayOptions;
    this.draw = SVG().addTo("#svg").size(window.innerWidth, window.innerHeight);
    this.persons = [];
    this.tagsList = new TagsList(this.draw, []);
    this.filters = [];
    this.arrange();
  }

  addPerson(data: PersonData) {
    const newPerson = new Person(
      this.draw,
      data,
      { zoomLevel: this.displayOptions.zoomLevel },
      this.handlePersonEndDrag
    );
    this.persons.push(newPerson);
    this.arrange();
  }

  addTag(data: TagData) {
    this.tagsList.addTag(data);
  }

  arrange() {
    const personRadius = RADIUS_BY_ZOOM_LEVEL[this.displayOptions.zoomLevel];
    const gap = 15;
    let row = 0;
    this.persons.forEach((person, i) => {
      const personWidth = personRadius * 2 + gap;
      const willFitInRow = Math.floor(window.innerWidth / personWidth);
      const xPos = personWidth * (i % willFitInRow);
      if (i % willFitInRow == 0) {
        row += 1;
      }
      person.moveTo({
        x: xPos,
        y: row * (personRadius * 2 + gap)
      });
    });
  }

  arrangeBy() {
    const personRadius = RADIUS_BY_ZOOM_LEVEL[this.displayOptions.zoomLevel];
    const gap = 15;
    const categoryNameRadius = 60;

    const rosacePositions = generateRosacePositions(
      categoryNameRadius,
      personRadius,
      this.persons.length,
      gap
    );

    this.persons.forEach((person, i) => {
      person.moveTo({
        x: rosacePositions[i].x + 500 - personRadius,
        y: rosacePositions[i].y + 500 - personRadius
      });
    });
    this.draw
      .circle(categoryNameRadius * 2)
      .y(500 - categoryNameRadius)
      .x(500 - categoryNameRadius);
  }

  handlePersonEndDrag = (draggedPerson: Person) => {
    // const draggedPersonPosition = draggedPerson.getPosition();
    // const draggedPersonData = {
    //   height: draggedPerson.getHeight(),
    //   width: draggedPerson.getWidth(),
    //   x: draggedPersonPosition.x,
    //   y: draggedPersonPosition.y
    // };
    // let draggedOver: Tag | null = null;
    // if (this.tagsList && tagsList.tags) {
    //   tagsList.tags.every((tag) => {
    //     if (tag.isColliding(draggedPersonData)) {
    //       draggedOver = tag;
    //       return false;
    //     }
    //     return true;
    //   });
    // }
  };
}

export default SVGVisualization;
