import $ from "jquery";
import {
  PersonData,
  CategoryData,
  NewPersonData,
  NewCategoryData,
  CategoryId,
  PersonId
} from "../types";
import AskerManager from "./AskerManager";
import Visualization from "./Visualisation";
import APIInterface from "./APIInterface";
import Store from "./Store";
import Tag from "./Tag";

class App {
  askerManager?: AskerManager;
  visualization?: Visualization;
  tags: Tag[];
  constructor() {
    this.askerManager = undefined;
    this.tags = [];
    APIInterface.getCategories().then((categories) => {
      Store.setCategories(categories);
      Store.categories.forEach((tag) => {
        const tagWrapper = $("#tags");
        this.tags.push(new Tag(tag, tagWrapper, this.draw.bind(this)));
      });
      APIInterface.getPersons().then((persons) => {
        if (!persons) {
          return;
        }
        Store.setPersons(persons);
        this.draw();
        this.launchAsk();
      });
    });
  }

  draw() {
    if (this.visualization) {
      this.visualization.destroy();
    }

    this.visualization = new Visualization(this.addCategoryToPerson);
    if (
      this.tags.reduce((acc, t) => {
        if (t.selected) acc++;
        return acc;
      }, 0) === 0
    ) {
      this.visualization.addTagFilter("Everyone", "main", {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      });
      Store.persons.forEach((person) => {
        this.visualization?.addPerson(person.id, person.name, "main");
      });
      return;
    }

    this.tags.forEach((t) => {
      if (t.selected) {
        const category = Store.getCategoryById(t.data.id);
        if (category && this.visualization) {
          this.visualization.addTagFilter(category.name, category.id);
        }
      }
    });
    Store.persons.forEach((person) => {
      person.categories.forEach((category) => {
        const tag = this.tags.find((t) => t.data.id === category.id);
        if (tag && tag.selected && this.visualization) {
          this.visualization.addPerson(person.id, person.name, category.id);
        }
      });
    });
  }

  addPerson(data: NewPersonData): Promise<PersonData> {
    return APIInterface.addPerson(data).then((newPerson) => {
      Store.addPerson(newPerson);
      newPerson.categories.forEach((category) => {
        if (this.visualization) {
          this.visualization.addPerson(newPerson.id, data.name, category.id);
        }
      });
      return newPerson;
    });
  }

  addTag(data: NewCategoryData): Promise<CategoryData> {
    return APIInterface.addCategory(data).then((newCategory) => {
      Store.addCategory(newCategory);
      if (this.visualization) {
        this.visualization.addTagFilter(newCategory.name, newCategory.id);
      }
      return newCategory;
    });
  }

  addCategoryToPerson(categoryId: CategoryId, personId: PersonId) {
    console.log("adding tag", categoryId, "to person", personId);
    return APIInterface.addCategoryToPerson(categoryId, personId).then(
      (newId) => {
        console.log("yey added it!", newId);
      }
    );
  }

  closeAsk() {
    this.askerManager = undefined;
  }

  launchAsk() {
    this.askerManager = new AskerManager(
      this.addTag.bind(this),
      this.addPerson.bind(this),
      this.closeAsk.bind(this)
    );
  }
}

export default App;
