import TagAsker from "./TagAsker";
import PersonAsker from "./PersonAsker";

import { PersonData, TagData } from "../types";

class AskerManager {
  asker?: TagAsker | PersonAsker;
  createTag: (data: TagData) => void;
  createPerson: (data: PersonData) => void;
  close: () => void;
  existingTags: Array<TagData>;
  constructor(
    createTag: (data: TagData) => void,
    createPerson: (data: PersonData) => void,
    close: () => void,
    existingTags?: Array<TagData>
  ) {
    this.createTag = createTag;
    this.createPerson = createPerson;
    this.existingTags = existingTags || [];
    this.close = close;
    this.asker = new TagAsker(
      this.onCreateTag.bind(this),
      this.onSelectTag.bind(this),
      this.onClose.bind(this),
      this.existingTags
    );
  }

  unsetCurrentAsker() {
    if (this.asker) {
      this.asker.unset();
    }
  }

  onCreateTag(data: TagData) {
    this.existingTags.push(data);
    this.createTag(data);
    this.onSelectTag(data);
  }

  onSelectTag(data: TagData) {
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
      this.onClose.bind(this),
      this.existingTags
    );
  }
}

export default AskerManager;
