import $ from "jquery";
import { NewCategoryData, CategoryData } from "../types";
import Asker from "./Asker";
import Store from "./Store";

class TagAsker extends Asker {
  addTag: (data: NewCategoryData) => void;
  prompt: string;
  onDone: () => void;
  selectTag: (data: CategoryData) => void;

  constructor(
    addTag: (data: NewCategoryData) => void,
    selectTag: (data: CategoryData) => void,
    end: () => void
  ) {
    super();
    this.addTag = addTag;
    this.selectTag = selectTag;
    this.prompt = "Select or create a new a tag";
    this.display();
    this.onDone = end;
  }

  onCreateNew(e: Event) {
    e.preventDefault();
    const name = String($(`#${this.id} input`).val());
    if (!name) {
      return;
    }
    try {
      this.addTag({
        name
      });
    } catch (e: any) {
      this.displayError(e.message);
    }
  }

  onSelectExistingTag(tag: CategoryData) {
    this.selectTag(tag);
  }

  display() {
    $("body").append(`
      <div class="prompt" id="${this.id}">
        <div class="container mx-auto max-w-lg grid gap-6 relative">
          <button class="absolute right-2 top-2 rounded-full bg-transparent hover:bg-transparent">X</button>
          <p class="text-center text-xl">${this.prompt}</p>
          ${
            Store.categories.length > 0
              ? `<div class="flex flex-wrap -my-1 -mx-1">
              ${Store.categories
                .map(
                  (t) =>
                    `<div class="prompt-tag my-1 mx-1 py-1 px-2 rounded-lg bg-green-light hover:bg-green cursor-pointer" data-tag-id="${t.id}">${t.name}</div>`
                )
                .join("")}
            </div>
          `
              : ""
          }
          <p class="text-sm text-center opacity-80">Type a name and press "Enter"</p>
          <form>
            <input name="new-tag" value=""/>
          </form>
          <div class="error"></div>
        </div>
      </div>
    `);

    $(`#${this.id} .prompt-tag`).on("click", (e) => {
      const $domTag = $(e.target);
      const tagId = $domTag.data("tag-id");
      const selectedTag = Store.categories.find(
        (t) => t.id == tagId
      ) as CategoryData;
      this.onSelectExistingTag(selectedTag);
    });

    $(`#${this.id} input`).focus();

    $(`#${this.id} button`).on("click", () => this.onDone());

    $(`#${this.id} form`).on("submit", (e: Event) => {
      this.onCreateNew(e);
    });
  }

  displayError(errorMessage: string) {
    $(`#${this.id} .error`).html(
      `<p class="text-sm text-error">${errorMessage}</p>`
    );
  }
}

export default TagAsker;
