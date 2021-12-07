import TagAsker from "./TagAsker";
import PersonAsker from "./PersonAsker";

import {
  NewCategoryData,
  NewPersonData,
  CategoryData,
  CategoryId,
  PersonData
} from "../types";

class AskerManager {
  asker?: TagAsker | PersonAsker;
  createTag: (data: NewCategoryData) => Promise<CategoryData>;
  createPerson: (data: NewPersonData) => Promise<PersonData>;
  close: () => void;
  constructor(
    createTag: (data: NewCategoryData) => Promise<CategoryData>,
    createPerson: (data: NewPersonData) => Promise<PersonData>,
    close: () => void
  ) {
    this.createTag = createTag;
    this.createPerson = createPerson;
    this.close = close;

    this.asker = new TagAsker(
      this.onCreateTag.bind(this),
      this.onSelectTag.bind(this),
      this.onClose.bind(this)
    );
  }

  unsetCurrentAsker() {
    if (this.asker) {
      this.asker.unset();
    }
  }

  onCreateTag(data: NewCategoryData) {
    this.createTag(data).then((newCategory) => {
      this.onSelectTag(newCategory);
    });
  }

  onSelectTag(data: CategoryData) {
    this.unsetCurrentAsker();
    this.asker = new PersonAsker(
      this.createPerson.bind(this),
      this.onCreatePersonDone.bind(this),
      data
    );
  }

  onClose() {
    this.unsetCurrentAsker();
    this.close();
  }

  onCreatePersonDone() {
    this.unsetCurrentAsker();
    this.asker = new TagAsker(
      this.onCreateTag.bind(this),
      this.onSelectTag.bind(this),
      this.onClose.bind(this)
    );
  }
}

export default AskerManager;
