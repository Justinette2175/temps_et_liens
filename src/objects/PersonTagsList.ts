import { Position, TagData } from "../types";
import { convertRadiansToOrtho } from "../utils";
import Tag from "./Tag";

class PersonTagsList {
  localDraw: any;
  tags: Array<Tag>;
  relativePosition: Position;

  constructor(draw: any, tagsData: Array<TagData>, relativePosition: Position) {
    this.tags = [];
    this.localDraw = draw.group();
    this.relativePosition = relativePosition;
    tagsData.forEach((t, i) => this.addTag(t, i));
  }

  getAbsolutePosition() {
    return {
      x: this.localDraw.transform().translateX + this.localDraw.x(),
      y: this.localDraw.transform().translateY + this.localDraw.y()
    };
  }

  addTag(tagData: TagData, indexPosition?: number) {
    const tag = new Tag(this.localDraw, tagData);
    const index = indexPosition || this.tags.length;
    const angle = index * (Math.PI / 6);
    const orthoPosition = convertRadiansToOrtho(100, angle);
    tag.moveTo({
      x: orthoPosition.x,
      y: orthoPosition.y
    });
    this.tags.push(tag);
  }
}

export default PersonTagsList;
