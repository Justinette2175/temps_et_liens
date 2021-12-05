import $ from "jquery";
import { PersonData, Position } from "../types";

class PersonLabel {
  data: Partial<PersonData>;
  parentPosition: Position;
  $element?: JQuery<HTMLElement>;
  constructor(data: Partial<PersonData>, parentPosition: Position) {
    this.data = data;
    this.parentPosition = parentPosition;
  }

  show() {
    const $list =
      this.data.categories?.map((c) => {
        `<li>${c.name}</li>`;
      }) || [];
    this.$element = $(`<div class="rounded-full bg-white p-2">
      <p>${this.data.name}</p>
      <ul>
      ${$list.join("")}
      </ul>
    </div>`);
    this.moveTo();
    const $hovers = $("#hovers");
    $hovers.empty();
    $hovers.append(this.$element);
  }

  moveTo(newPosition?: Position) {
    if (newPosition) {
      this.parentPosition = newPosition;
    }
    if (this.$element) {
      this.$element.css(
        "transform",
        `translate(${this.parentPosition.x}px, ${this.parentPosition.y}px)`
      );
    }
  }

  hide() {
    if (this.$element) {
      this.$element?.remove();
    }
  }
}

export default PersonLabel;
