import { v4 as uuid } from "uuid";
import $ from "jquery";

import { PersonData, TagData } from "../types";
import Asker from "./Asker";

class PersonAsker extends Asker {
  createPerson: (data: PersonData) => void;
  onEnd: () => void;
  prompt: string;
  tagData?: TagData;
  addedNames: Array<string>;
  constructor(
    createPerson: (data: PersonData) => void,
    end: () => void,
    tagData?: TagData
  ) {
    super();
    this.createPerson = createPerson;
    this.onEnd = end;
    this.addedNames = [];
    this.prompt = tagData
      ? `What people do you remember and associate with '${tagData?.name}'?`
      : "What people do you remember?";
    this.tagData = tagData;
    this.display();
  }

  onSubmit(e: Event) {
    const tags = [];
    if (this.tagData) {
      tags.push(this.tagData);
    }
    const name = String($(`#${this.id} input`).val());
    if (!name) {
      return;
    }
    this.createPerson({
      name: name || "",
      id: uuid(),
      tags
    });
    this.addedNames.push(name);
    this.updateAddedNamesDisplay();
  }

  updateAddedNamesDisplay() {
    const string = this.addedNames.join(", ");
    const container = $(`#${this.id} .added`);
    if (container) {
      container.text(`Added ${string}.`);
    }
  }

  display() {
    $("body").append(`
      <div class="prompt" id="${this.id}">
        <div class="container mx-auto max-w-lg grid gap-6">
          <p class="text-center text-xl">${this.prompt}</p>
          <p class="text-sm text-center opacity-60">Type a name and press "Enter"</p>
          <div class="grid gap-3">
            <form>
              <input name="new-person" value=""/>
            </form>
            <p class="opacity-75"></p>
          </div>
          <button>Done with this category</button>
        </div>
      </div>
    `);

    const input = $(`#${this.id} input`);
    input.focus();

    $(`#${this.id} form`).on("submit", (e: Event) => {
      e.preventDefault();
      this.onSubmit(e);
      input.val("");
      input.focus();
    });

    $(`#${this.id} button`).on("click", () => {
      this.onEnd();
    });
  }
}

export default PersonAsker;
