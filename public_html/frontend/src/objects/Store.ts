import { CategoryData, CategoryId, PersonData, PersonId } from "../types";

class Store {
  persons: PersonData[];
  categories: CategoryData[];

  constructor() {
    this.persons = [];
    this.categories = [];
  }

  setPersons(persons: PersonData[]) {
    this.persons = persons;
  }

  addPerson(person: PersonData) {
    this.persons.push(person);
  }

  getPersonById(id: PersonId) {
    return this.persons.find((p) => p.id === id);
  }

  getCategoryById(id: CategoryId) {
    return this.categories.find((c) => c.id === id);
  }

  setCategories(categories: CategoryData[]) {
    this.categories = categories;
  }

  addCategory(category: CategoryData) {
    this.categories.push(category);
  }
}

export default new Store();
