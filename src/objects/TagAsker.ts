import $ from "jquery";
import { TagData } from "../types";
import Asker from "./Asker";
import { v4 as uuid } from "uuid";

class TagAsker extends Asker {
  addTag: (data: TagData) => void;
  prompt: string;
  onDone: () => void;
  existingTags: Array<TagData>;
  selectTag: (data: TagData) => void;

  constructor(
    addTag: (data: TagData) => void,
    selectTag: (data: TagData) => void,
    end: () => void,
    existingTags?: Array<TagData>
  ) {
    super();
    this.addTag = addTag;
    this.selectTag = selectTag;
    this.prompt = "Select or create a new a tag";
    this.existingTags = existingTags || [];
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
        name,
        id: uuid(),
        type: { id: "2", name: "stage" }
      });
    } catch (e: any) {
      this.displayError(e.message);
    }
  }

  onSelectExistingTag(tag: TagData) {
    this.selectTag(tag);
  }

  display() {
    $("body").append(`
      <div class="prompt" id="${this.id}">
        <div class="container mx-auto max-w-lg grid gap-6 relative">
          <button class="absolute right-2 top-2 rounded-full bg-transparent hover:bg-transparent">X</button>
          <p class="text-center text-xl">${this.prompt}</p>
          ${
            this.existingTags.length > 0
              ? `<div class="flex flex-wrap -my-1 -mx-1">
              ${this.existingTags
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
      console.log("clicked");
      const $domTag = $(e.target);
      const tagId = $domTag.data("tag-id");
      const selectedTag = this.existingTags.find(
        (t) => t.id === tagId
      ) as TagData;
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
