import { CategoryData, CategoryId, PersonData } from "../types";
import { PromptData } from "../utils/prompts";
import Store from "./Store";
import Prompt from "./Prompt";

export type PrompterContext = {
  categories?: CategoryData[];
};

class Prompter {
  promptData: Record<string, PromptData>;
  currentPrompt?: Prompt;
  addCategory: (categoryName: string) => Promise<CategoryData>;
  addPerson: (
    personName: string,
    categories: CategoryId[]
  ) => Promise<PersonData>;
  context: PrompterContext;
  close: () => void;

  constructor(
    promptData: Record<string, PromptData>,
    currentPromptId: string,
    addCategory: (categoryName: string) => Promise<CategoryData>,
    addPerson: (
      personName: string,
      categories: CategoryId[]
    ) => Promise<PersonData>,
    close: () => void,
    context: PrompterContext = {}
  ) {
    this.promptData = promptData;
    this.context = context;
    this.currentPrompt = undefined;
    this.addCategory = addCategory;
    this.addPerson = addPerson;
    this.close = close;
    this.launchAt(currentPromptId);
  }

  launchAt(promptId: string) {
    this.onNextPrompt(promptId);
  }

  onNextPrompt(nextPromptId: string) {
    if (this.currentPrompt) {
      this.currentPrompt.clear();
    }
    const data = this.promptData[nextPromptId];
    this.currentPrompt = new Prompt(
      nextPromptId,
      data,
      this.onNextPrompt.bind(this),
      this.onClose.bind(this),
      this.onAddPersonWithCategories.bind(this),
      this.onAddCategoryAndMakeLocalCategory.bind(this)
    );
  }

  onClose() {
    if (this.currentPrompt) {
      this.currentPrompt.clear();
      this.currentPrompt = undefined;
    }
    if (this.close) {
      this.close();
    }
  }

  onAddPersonWithCategories(
    personName: string,
    categoryNames?: string[]
  ): Promise<void> {
    console.log("category names", categoryNames);
    const categoryIds: string[] = [];
    const missingCategoriesNames: string[] = [];
    let addLocalCategories = false;
    (categoryNames || []).forEach((cName) => {
      if (cName === "___localCategory") {
        addLocalCategories = true;
        return;
      }
      const existingCategory = Store.getCategoryByName(cName);
      console.log("existing ccategory", existingCategory);

      if (existingCategory) {
        categoryIds.push(existingCategory.id);
        return;
      }
      missingCategoriesNames.push(cName);
    });

    console.log("missing categories", missingCategoriesNames);

    const promises = missingCategoriesNames.map((cName) => {
      return this.addCategory(cName);
    });
    console.log("new categories");

    return Promise.all(promises).then((newCategories) => {
      let personCategoryIds = [
        ...categoryIds,
        ...newCategories.map((c) => c.id)
      ];
      console.log("should add local");
      if (addLocalCategories && this.context.categories) {
        console.log("add local ccategories", this.context.categories);
        personCategoryIds = [
          ...personCategoryIds,
          ...this.context.categories.map((c) => c.id)
        ];
      }
      console.log("personCategoryIds", personCategoryIds);
      return this.addPerson(personName, personCategoryIds).then(
        () => undefined
      );
    });
  }

  onAddCategoryAndMakeLocalCategory(categoryName: string) {
    return this.addCategory(categoryName).then((category: CategoryData) => {
      console.log("adding category to local context");
      this.context.categories = [category];
      console.log("this.content", this.context.categories);
    });
  }
}

export default Prompter;
