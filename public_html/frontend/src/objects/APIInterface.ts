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

type APIPerson = {
  categories_ids: string;
  person_name: string;
  person_id: PersonId;
  categories_names: string;
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

  getPersons() {
    return fetch(devURL + "getPersons.php")
      .then((res) => {
        if (!res || res.status !== 200) {
          return;
        }
        return res.json() as unknown as APIPerson[];
      })
      .then((apiPersons) => {
        return apiPersons?.map((apiPerson) => {
          const personCategoriesIds = apiPerson.categories_ids
            ? apiPerson.categories_ids.split(",")
            : [];
          const personCategoriesNames = apiPerson.categories_names
            ? apiPerson.categories_names.split(",")
            : [];
          return {
            name: apiPerson.person_name,
            id: apiPerson.person_id,
            categories: personCategoriesIds.map((id, index) => ({
              id,
              name: personCategoriesNames[index]
            }))
          };
        }) as PersonData[];
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
      .then((p: APICategory) => p);
  }
}

export default new APIInterface();
