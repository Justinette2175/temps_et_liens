import Matter from "matter-js";
import { PersonData, TagData } from "../types";
import AskerManager from "./AskerManager";
import MatterVisualization from "./MatterVisualization";
import SVGVisualization from "./SVGVisualization";
import Visualization from "./Visualisation";

const typedWindow: any = window as any;

const SVG = typedWindow.SVG;

class App {
  draw: any;
  askerManager?: AskerManager;
  // SVGVisualization?: SVGVisualization;
  visualization: Visualization;
  constructor() {
    // this.SVGVisualization = new SVGVisualization({ zoomLevel: 2 });
    this.visualization = new Visualization({ zoomLevel: 2 });
    this.askerManager = undefined;

    this.getStored<TagData>("tags").forEach((tag) => {
      this.visualization.addTagFilter(tag.id, tag.name);
    });
    this.getStored<PersonData>("persons").forEach((person) => {
      person.tags.forEach((tag) => {
        this.visualization.addPerson(tag.id);
      });
    });
    this.launchAsk();
  }

  getStored<DataType>(key: "persons" | "tags") {
    const stored = window.localStorage.getItem(key) as string;
    if (stored) {
      return JSON.parse(stored) as unknown as Array<DataType>;
    }
    return [];
  }

  storePerson(data: PersonData) {
    const currentPersons = this.getStored<PersonData>("persons");
    currentPersons.push(data);
    window.localStorage.setItem("persons", JSON.stringify(currentPersons));
  }

  storeTag(data: TagData) {
    const currentTags = this.getStored<TagData>("tags");
    currentTags.push(data);
    window.localStorage.setItem("tags", JSON.stringify(currentTags));
  }

  addPerson(data: PersonData) {
    this.storePerson(data);
    data.tags.forEach((tag) => {
      this.visualization.addPerson(tag.id);
    });
  }

  addTag(data: TagData) {
    const existingTags = this.getStored<TagData>("tags");
    if (existingTags.find((t) => t.name === data.name)) {
      throw new Error("This tag already exists");
    }
    this.storeTag(data);
    this.visualization.addTagFilter(data.id, data.name);
  }

  closeAsk() {
    this.askerManager = undefined;
  }

  launchAsk() {
    this.askerManager = new AskerManager(
      this.addTag.bind(this),
      this.addPerson.bind(this),
      this.closeAsk.bind(this),
      this.getStored<TagData>("tags")
    );
  }
}

export default App;
