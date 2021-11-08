import { v4 as uuid } from "uuid";
import $ from "jquery";

class Asker {
  id: string;
  constructor() {
    this.id = uuid();
  }

  unset() {
    $(`#${this.id}`).remove();
  }
}

export default Asker;
