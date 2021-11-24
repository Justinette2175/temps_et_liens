import { PersonData, TagData, PositionAndAngle } from "../types";
import MatterVisualization, { BodyLabel } from "./MatterVisualization";
import $ from "jquery";
import SVGVisualization from "./SVGVisualization";

type DisplayOptions = {
  zoomLevel: number;
};

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
  matterVisualization: MatterVisualization;
  SVGVisualization: SVGVisualization;
  graphicalTagFilters: Array<GraphicalTagFilter>;
  graphicalPersonInstances: Array<GraphicalPersonInstance>;
  getStoredPersonById: (id: string) => PersonData | undefined;
  getStoredTagById: (id: string) => TagData | undefined;

  constructor(
    getStoredPersonById: (id: string) => PersonData | undefined,
    getStoredTagById: (id: string) => TagData | undefined
  ) {
    this.matterVisualization = new MatterVisualization(
      this.updateInstancesPositionsAndAngles.bind(this)
    );
    this.SVGVisualization = new SVGVisualization();
    this.graphicalTagFilters = [];
    this.graphicalPersonInstances = [];
    this.getStoredPersonById = getStoredPersonById;
    this.getStoredTagById = getStoredTagById;
  }

  addPerson(id: string, name: string, tagId: string = "main") {
    const { bodyId, position } = this.matterVisualization.addPerson(id, tagId);
    this.graphicalPersonInstances.push({
      bodyId,
      personId: id,
      tagId,
      position
    });
    this.SVGVisualization.addPerson(bodyId, name);
  }

  addTagFilter(tagId: string, tagName: string) {
    const { bodyId, bodyType, position } =
      this.matterVisualization.addTagFilter(tagId);
    this.graphicalTagFilters.push({
      name: tagName,
      tagId,
      bodyId,
      bodyType,
      position
    });
  }

  getGraphicalPersonInstancesByPersonIdAndTagId(
    personId: string,
    tagId?: string
  ) {
    return this.graphicalPersonInstances.filter((person) => {
      return (
        personId === person.personId && (tagId ? person.tagId === tagId : true)
      );
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

  hideInfo() {}

  handlePersonHover(personId: string, position: { x: number; y: number }) {
    const data = this.getStoredPersonById(personId);
    if (data) {
      this.displayInfo<PersonData>(data, position);
    }
  }

  handleTagFilterHover(tagId: string, position: { x: number; y: number }) {
    const data = this.getStoredTagById(tagId);
    if (data) {
      this.displayInfo<TagData>(data, position);
    }
  }

  updateInstancesPositionsAndAngles() {
    const newInstances: GraphicalPersonInstance[] = [];
    this.graphicalPersonInstances.forEach((personInstance) => {
      const newPosition =
        this.matterVisualization.getBodyPositionAndAngleByBodyId(
          personInstance.bodyId
        );
      newInstances.push({ ...personInstance, position: newPosition });
    });
    this.graphicalPersonInstances = newInstances;
    this.SVGVisualization.updatePersonsPositions(
      this.graphicalPersonInstances.map((p) => ({
        bodyId: p.bodyId,
        positionAndAngle: p.position
      }))
    );
  }
}

export default Visualization;
