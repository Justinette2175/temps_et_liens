import $ from "jquery";
import { CategoryId, PersonId, PrompterContext } from "../types";
import { PromptText, PromptData } from "../utils/prompts";

class Prompt {
  id: string;
  data: PromptData;
  onNextPrompt: (nextPromptId: string) => void;
  onClose: () => void;
  onAddPersonWithCategories: (
    personName: PersonId,
    categoryNames?: CategoryId[]
  ) => Promise<void>;
  onAddCategoryAndMakeLocalCategory: (categoryName: string) => Promise<void>;
  context: PrompterContext;
  constructor(
    id: string,
    prompt: PromptData,
    context: PrompterContext,
    onNextPrompt: (nextPromptId: string) => void,
    onClose: () => void,
    onAddPersonWithCategories: (
      personName: string,
      categoryNames?: CategoryId[]
    ) => Promise<void>,
    onAddCategoryAndMakeLocalCategory: (categoryName: string) => Promise<void>
  ) {
    this.id = id;
    this.data = prompt;
    this.context = context;
    this.onNextPrompt = onNextPrompt;
    this.onClose = onClose;
    this.onAddPersonWithCategories = onAddPersonWithCategories;
    this.onAddCategoryAndMakeLocalCategory = onAddCategoryAndMakeLocalCategory;
    this.display();
  }

  display() {
    const $wrapper = $(`<div class="prompt pt-48" id="${this.id}"></div>`);
    const $content = $(
      ` <div class="container mx-auto max-w-lg grid gap-6 rounded-lg shadow-lg px-12 pb-12 pt-6"></div>`
    );
    const $closeBtnWrapper = $('<div class="flex justify-end"></div>');
    const $closeBtn = $("<button>X</button>");
    $closeBtn.on("click", () => {
      this.onClose();
    });
    $closeBtnWrapper.append($closeBtn);
    $content.append($closeBtnWrapper);

    if (this.data.text) {
      this.data.text.forEach((promptText) => {
        const contentParameters = /(?<='${').*?(?='}')/g;
        const $el = $(promptText.tag);
        $el.append(promptText.content);
        $content.append($el);
      });
    }

    if (this.data.actions) {
      this.addActionsToContent($content);
    }

    $wrapper.append($content);
    $("#prompts").append($wrapper);
  }

  clear() {
    $("#prompts").empty();
  }

  addActionsToContent($content: JQuery<HTMLElement>) {
    this.data.actions.forEach((action) => {
      // Handle Button action
      if (action.type === "button") {
        const $button = $(`<button class="app-secondary-button"></button>`);
        $button.append(action.params.text);
        $button.on("click", () => {
          const nextPromptId = action.params?.onDo?.nextPromptId;
          if (nextPromptId === "") {
            this.onClose();
          } else if (action.params?.onDo?.nextPromptId) {
            this.onNextPrompt(action.params?.onDo?.nextPromptId);
          }
        });
        $content.append($button);
      }

      // Handle Button action
      if (action.type === "input") {
        const $wrapper = $('<div class="grid gap-3">');
        const $form = $(`
          <form>
          </form>
        `);

        const $grid = $(
          `<div class="grid gap-4 grid-cols-4 content-center"></grid>`
        );
        const $inputGrid = $(`<div class="col-span-3"></grid>`);
        const $input = $(`<input>`);
        $inputGrid.append($input);
        $grid.append($inputGrid);
        const $buttonGrid = $(
          `<div class="col-span-1"><button class="app-button" type="submit">Save</button></div>`
        );
        $grid.append($buttonGrid);
        $form.append($grid);
        $input.focus();
        $form.on("submit", (e: Event) => {
          e.preventDefault();
          const actionName = action.params?.onDo?.name;
          const value = String($input.val() || "");
          if (!value) {
            return;
          }
          $input.val("");
          let promise: () => Promise<void>;
          if (actionName === "addCategoryAndMakeLocalCategory") {
            promise = () => this.onAddCategoryAndMakeLocalCategory(value);
          } else if (actionName === "addPersonWithCategories") {
            promise = () =>
              this.onAddPersonWithCategories(
                value,
                action.params?.onDo?.categoryNames || []
              );
          } else {
            promise = () => Promise.resolve();
          }
          promise().then(() => {
            $input.focus();
            if (action.params?.onDo?.nextPromptId) {
              this.onNextPrompt(action.params?.onDo?.nextPromptId);
            }
          });
        });
        $wrapper.append($form);
        $content.append($wrapper);
      }

      // Handle timeout action
      if (action.type === "timeout" && action.params.time) {
        const timeout = window.setTimeout(() => {
          if (action.params.onDo?.nextPromptId) {
            this.onNextPrompt(action.params.onDo?.nextPromptId);
            window.clearTimeout(timeout);
          }
        }, action.params.time);
      }
    });
  }
}

export default Prompt;
