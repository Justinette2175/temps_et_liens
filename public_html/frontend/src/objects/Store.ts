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

  updatePerson(person: PersonData) {
    const index = this.persons.findIndex((p) => p.id === person.id);
    this.persons.splice(index, 1, person);
  }

  getPersonById(id: PersonId) {
    return this.persons.find((p) => p.id === id);
  }

  getCategoryByName(name: string) {
    return this.categories.find((c) => c.name === name);
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
