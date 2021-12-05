const devURL = "http://localhost:3000/code/public_html/";

import {
  CategoryId,
  CategoryData,
  PersonData,
  PersonId,
  NewPersonData,
  NewCategoryData
} from "../types";

type APICategory = {
  name: string;
  id: CategoryId;
};

class APIInterface {
  constructor() {}

  getCategories() {
    return fetch(devURL + "getCategories.php")
      .then((res) => {
        if (!res || res.status !== 200) {
          return;
        }
        return res.json();
      })
      .then((apiCategories) => {
        return apiCategories as unknown as CategoryData[];
      });
  }

  getPersons(id?: string) {
    return fetch(devURL + `getPersons.php${id ? "?id=" + id : ""}`)
      .then((res) => {
        if (!res || res.status !== 200) {
          return;
        }
        console.log("res", res);
        return res.json();
      })
      .then((apiPersons) => {
        console.log("persons", apiPersons);
        return apiPersons as unknown as PersonData[];
      });
  }

  getPersonsInCategory(categoryId: CategoryId) {
    fetch(devURL + `getAllPersonsInCategory.php?categoryId=${categoryId}`)
      .then((res) => {
        if (!res || res.status !== 200) {
          return;
        }
        return res.json();
      })
      .then((stuff) => {
        console.log(stuff);
      });
  }

  getCategoriesForPerson(personId: PersonId) {
    fetch(devURL + `getAllCategoriesForPerson.php?personId=${personId}`)
      .then((res) => {
        if (!res || res.status !== 200) {
          return;
        }
        return res.json();
      })
      .then((stuff) => {
        console.log(stuff);
      });
  }

  addPerson(newPerson: NewPersonData): Promise<PersonData> {
    const formData = new FormData();
    formData.append("name", newPerson.name);
    if (newPerson.category) {
      formData.append("category", newPerson.category);
    }
    return fetch(devURL + "newPerson.php", {
      method: "POST",
      body: formData,
      mode: "cors"
    })
      .then((res) => {
        if (!res || res.status !== 200) {
          console.log("Error: ", res.json());
          return;
        }
        return res.json();
      })
      .then((p: PersonData) => {
        return { ...p };
      });
  }

  addCategory(newCategory: NewCategoryData): Promise<CategoryData> {
    const formData = new FormData();
    formData.append("name", newCategory.name);
    return fetch(devURL + "newCategory.php", {
      method: "POST",
      body: formData,
      mode: "cors"
    })
      .then((res) => {
        if (!res || res.status !== 200) {
          return;
        }
        return res.json();
      })
      .then((p: APICategory) => p);
  }

  addCategoryToPerson(catgoryId: CategoryId, personId: PersonId) {
    const formData = new FormData();
    formData.append("category_id", catgoryId);
    formData.append("person_id", personId);
    return fetch(devURL + "addCategoryToPerson.php", {
      method: "POST",
      body: formData,
      mode: "cors"
    })
      .then((res) => {
        if (!res || res.status !== 200) {
          return;
        }
        return res.json();
      })
      .then(() => {
        return this.getPersons(personId);
      })
      .then((persons) => persons[0]);
  }

  logout() {
    return fetch(devURL + "logout.php");
  }
}

export default new APIInterface();
