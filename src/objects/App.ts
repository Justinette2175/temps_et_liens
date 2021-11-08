import { PersonData, TagData } from "../types";
import AskerManager from "./AskerManager";
import SVGVisualization from "./SVGVisualization";

const typedWindow: any = window as any;

const SVG = typedWindow.SVG;

class App {
  draw: any;
  askerManager?: AskerManager;
  SVGVisualization?: SVGVisualization;
  constructor() {
    this.SVGVisualization = new SVGVisualization({ zoomLevel: 2 });
    this.draw = SVG().addTo("#svg").size(window.innerWidth, window.innerHeight);
    this.askerManager = undefined;

    this.getStored<PersonData>("persons").forEach((person) => {
      if (!this.SVGVisualization) {
        return;
      }
      this.SVGVisualization.addPerson(person);
    });
    this.getStored<TagData>("tags").forEach((tag) => {
      if (!this.SVGVisualization) {
        return;
      }
      this.SVGVisualization.addTag(tag);
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
    if (this.SVGVisualization) {
      this.SVGVisualization.addPerson(data);
    }
  }

  addTag(data: TagData) {
    const existingTags = this.getStored<TagData>("tags");
    if (existingTags.find((t) => t.name === data.name)) {
      throw new Error("This tag already exists");
    }
    this.storeTag(data);
    if (this.SVGVisualization) {
      this.SVGVisualization.addTag(data);
    }
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
