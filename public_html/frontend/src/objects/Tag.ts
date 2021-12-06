import { Position, CategoryData } from "../types";
import $ from "jquery";

const COMMON_CLASSES =
  "my-1 mx-1 inline-block rounded-full border-0 text-base px-2 py-1 font-bold transition duration-200 bg-grey-light";

class Tag {
  localDraw: any;
  data: CategoryData;
  $viewToggle: JQuery<HTMLElement>;
  $selectedToggle: JQuery<HTMLElement>;
  element: JQuery<HTMLElement>;
  parent: JQuery<HTMLElement>;
  visible: boolean;
  selected: boolean;
  onClick: (newVisibility: boolean) => void;
  constructor(
    data: CategoryData,
    parent: JQuery<HTMLElement>,
    onClick: (newVisibility: boolean) => void,
    visible: boolean = false,
    selected: boolean = false
  ) {
    this.data = data;
    this.parent = parent;
    this.visible = visible;
    this.selected = selected;
    [this.element, this.$viewToggle, this.$selectedToggle] = this.display();
    this.updateVisibleStyle();
    this.updateSelectedStyle();
    this.onClick = onClick;
  }

  updateSelectedStyle() {
    if (this.selected && this.$selectedToggle) {
      this.$selectedToggle?.empty();
      this.$selectedToggle?.append('<i class="far fa-check-square"></i>');
    } else {
      this.$selectedToggle?.empty();
      this.$selectedToggle?.append('<i class="far fa-square"></i>');
    }
  }

  updateVisibleStyle() {
    if (this.visible && this.$viewToggle) {
      this.$viewToggle?.empty();
      this.$viewToggle?.append('<i class="far fa-eye"></i>');
    } else {
      this.$viewToggle?.empty();
      this.$viewToggle?.append('<i class="far fa-eye-slash"></i>');
    }
  }

  display() {
    const $element = $(
      `<div data-tag-id="${this.data.id}" class="${COMMON_CLASSES}">${this.data.name}</div>`
    );
    const $viewToggle = $('<button class="mx-1"></button>');
    const $selectedToggle = $('<button class="mx-1"></button>');
    $viewToggle.on("click", () => {
      this.visible = !this.visible;
      this.updateVisibleStyle();
      this.onClick(this.visible);
    });
    $selectedToggle.on("click", () => {
      this.selected = !this.selected;
      this.updateSelectedStyle();
      // this.onClick(this.visible);
    });
    $element.prepend($viewToggle);
    $element.prepend($selectedToggle);
    this.parent.append($element);
    return [$element, $viewToggle, $selectedToggle];
  }
}
export default Tag;
