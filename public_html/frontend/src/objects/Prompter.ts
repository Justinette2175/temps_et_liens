import { CategoryData, CategoryId, PersonData } from "../types";
import { PromptData } from "../utils/prompts";
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

  onAddPersonWithCategories(personName: string, categories?: CategoryId[]) {
    return this.addPerson(
      personName,
      categories?.[0] === "___localCategory" && this.context.categories
        ? this.context.categories.map((c) => c.id)
        : []
    ).then(() => {
      return;
    });
  }

  onAddCategoryAndMakeLocalCategory(categoryName: string) {
    console.log("adding person", categoryName);
    return this.addCategory(categoryName).then((category: CategoryData) => {
      this.context.categories = [category];
    });
  }
}

export default Prompter;
