import Matter from "matter-js";
import { PersonData, TagData } from "../types";
import AskerManager from "./AskerManager";
import Visualization from "./Visualisation";

const typedWindow: any = window as any;

const SVG = typedWindow.SVG;

class App {
  draw: any;
  askerManager?: AskerManager;
  visualization: Visualization;
  constructor() {
    this.visualization = new Visualization(
      this.getStoredPersonById.bind(this),
      this.getStoredTagById.bind(this)
    );
    this.askerManager = undefined;

    this.getStored<TagData>("tags").forEach((tag) => {
      this.visualization.addTagFilter(tag.id, tag.name);
    });
    this.getStored<PersonData>("persons").forEach((person) => {
      person.tags.forEach((tag) => {
        this.visualization.addPerson(person.id, person.name, tag.id);
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
      console.log("adding person for tag", tag);
      this.visualization.addPerson(data.id, data.name, tag.id);
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

  getStoredPersonById(id: string) {
    return this.getStored<PersonData>("persons").find(
      (person) => person.id === id
    );
  }

  getStoredTagById(id: string) {
    return this.getStored<TagData>("tags").find((person) => person.id === id);
  }
}

export default App;
