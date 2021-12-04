import {
  PersonData,
  CategoryData,
  NewPersonData,
  NewCategoryData
} from "../types";
import AskerManager from "./AskerManager";
import Visualization from "./Visualisation";
import APIInterface from "./APIInterface";
import Store from "./Store";

class App {
  draw: any;
  askerManager?: AskerManager;
  visualization: Visualization;
  constructor() {
    this.visualization = new Visualization(
      Store.getPersonById,
      Store.getCategoryById
    );
    this.askerManager = undefined;
    APIInterface.getCategories().then((categories) => {
      Store.setCategories(categories);
      categories.forEach((tag) => {
        this.visualization.addTagFilter(tag.name, tag.id);
      });
      APIInterface.getPersons().then((persons) => {
        if (!persons) {
          return;
        }
        Store.setPersons(persons);
        persons.forEach((person) => {
          person.categories.forEach((category) => {
            this.visualization.addPerson(person.id, person.name, category.id);
          });
        });
        this.launchAsk();
      });
    });
  }

  addPerson(data: NewPersonData): Promise<PersonData> {
    console.log("App:AddPerson", data);
    return APIInterface.addPerson(data).then((newPerson) => {
      Store.addPerson(newPerson);
      newPerson.categories.forEach((category) => {
        console.log("adding person for tag", category);
        this.visualization.addPerson(newPerson.id, data.name, category.id);
      });
      return newPerson;
    });
  }

  addTag(data: NewCategoryData): Promise<CategoryData> {
    return APIInterface.addCategory(data).then((newCategory) => {
      Store.addCategory(newCategory);
      console.log("new category", newCategory);
      this.visualization.addTagFilter(newCategory.name, newCategory.id);
      return newCategory;
    });
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
