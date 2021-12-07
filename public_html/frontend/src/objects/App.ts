import $ from "jquery";
import {
  PersonData,
  CategoryData,
  NewPersonData,
  NewCategoryData,
  CategoryId,
  PersonId
} from "../types";
import Visualization from "./Visualisation";
import APIInterface from "./APIInterface";
import Store from "./Store";
import Tag from "./Tag";
import Prompter, { PrompterContext } from "./Prompter";
import {
  introPrompts,
  addCategoryPrompts,
  addPersonPrompts,
  PromptData
} from "../utils/prompts";
class App {
  prompter?: Prompter;
  visualization?: Visualization;
  tags: Tag[];
  constructor() {
    this.prompter = undefined;
    this.tags = [];
    this.setupMenu();
    APIInterface.getCategories().then((categories) => {
      Store.setCategories(categories);
      Store.categories.forEach((tag) => {
        const tagWrapper = $("#tags");
        this.tags.push(new Tag(tag, tagWrapper, this.draw.bind(this)));
      });
      APIInterface.getPersons().then((persons) => {
        console.log("persons", persons);
        if (!persons) {
          return;
        }
        Store.setPersons(persons);
        this.draw();
        this.launchAsk();
        this.setupAddPersonButtonClick();
        this.setupAddCategoryButtonClick();
      });
    });
  }

  noTagsSelected() {
    return (
      this.tags.reduce((acc, t) => {
        if (t.visible) acc++;
        return acc;
      }, 0) === 0
    );
  }

  drawPerson(person: PersonData) {
    if (this.noTagsSelected()) {
      this.visualization?.addPerson(person.id, person.name, "main");
    } else {
      person.categories.forEach((category) => {
        const tag = this.tags.find((t) => t.data.id === category.id);
        if (tag && tag.visible && this.visualization) {
          this.visualization.addPerson(person.id, person.name, category.id);
        }
      });
    }
  }

  draw() {
    if (this.visualization) {
      this.visualization.destroy();
    }

    this.visualization = new Visualization(this.addCategoryToPerson.bind(this));
    if (this.noTagsSelected()) {
      this.visualization.addTagFilter("Everyone", "main", {
        x: this.visualization.dimensions.w / 2,
        y: this.visualization.dimensions.h / 2
      });
    }

    this.tags.forEach((t) => {
      if (t.visible) {
        const category = Store.getCategoryById(t.data.id);
        if (category && this.visualization) {
          this.visualization.addTagFilter(category.name, category.id);
        }
      }
    });

    Store.persons.forEach((person) => {
      this.drawPerson(person);
    });
  }

  addPerson(data: NewPersonData): Promise<PersonData> {
    return APIInterface.addPerson(data).then((newPerson) => {
      Store.addPerson(newPerson);
      this.drawPerson(newPerson);
      return newPerson;
    });
  }

  addTag(data: NewCategoryData): Promise<CategoryData> {
    return APIInterface.addCategory(data).then((newCategory) => {
      Store.addCategory(newCategory);
      const tagWrapper = $("#tags");
      const newTag = new Tag(newCategory, tagWrapper, this.draw.bind(this));
      this.tags.push(newTag);

      if (this.visualization && newTag.visible) {
        this.visualization.addTagFilter(newCategory.name, newCategory.id);
      }
      return newCategory;
    });
  }

  addCategoryToPerson(categoryId: CategoryId, personId: PersonId) {
    return APIInterface.addCategoryToPerson(categoryId, personId).then(
      (newPerson) => {
        Store.updatePerson(newPerson);
        if (this.visualization) {
          this.visualization.addPerson(
            newPerson.id,
            newPerson.name,
            categoryId
          );
        }
      }
    );
  }

  closeAsk() {
    this.prompter = undefined;
  }

  makePrompterWithPrompts(
    p: Record<string, PromptData>,
    initialPromptId: string,
    context?: PrompterContext
  ) {
    this.prompter = new Prompter(
      p,
      initialPromptId,
      (name: string) => {
        return this.addTag({ name });
      },
      (name: string, categories: CategoryId[]) => {
        return this.addPerson({ name, categories });
      },
      () => {
        this.prompter = undefined;
      },
      context
    );
  }

  launchAsk() {
    this.makePrompterWithPrompts(introPrompts, "intro");
  }

  setupMenu() {
    $("#logout-btn").on("click", () => {
      console.log("cliked");
      APIInterface.logout();
    });
  }

  setupAddCategoryButtonClick() {
    const $addCategoryButton = $(
      `<button class="app-button mx-1"><i class="fas fa-plus"></i></button>`
    );

    $addCategoryButton.on("click", () => {
      this.makePrompterWithPrompts(addCategoryPrompts, "addCategory");
    });
    const $wrapper = $("#app-buttons");
    $wrapper.prepend($addCategoryButton);
  }

  setupAddPersonButtonClick() {
    const $addPersonButton = $(
      `<button class="app-button mx-1"><i class="fas fa-user-plus"></i></button>`
    );
    $addPersonButton.on("click", () => {
      this.makePrompterWithPrompts(addPersonPrompts, "addPerson");
    });
    const $wrapper = $("#app-buttons");
    $wrapper.prepend($addPersonButton);
  }
}

export default App;
