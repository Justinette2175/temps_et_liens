import uuid from "uuid";

import { Position, TagData } from "../types";
import Tag from "./Tag";

const PADDING = 10;

class TagsList {
  localDraw: any;
  tags: Array<Tag>;
  width: number;
  currentTagTopPos: number;
  nextTagTopPos: number;
  currentTagLeftPos: number;
  relativePosition: Position;

  constructor(draw: any, tagsData: Array<TagData>) {
    this.width = window.innerWidth / 4;
    this.relativePosition = { x: window.innerWidth - this.width, y: 0 };
    this.localDraw = draw;
    this.tags = [];
    this.currentTagTopPos = 0;
    this.nextTagTopPos = 0;
    this.currentTagLeftPos = PADDING;
    tagsData.forEach((t) => this.addTag(t));
  }

  addTag(tagData: TagData) {
    // return new Tag(this.localDraw, tag, this.getPosition.bind(this));
    const tag = new Tag(this.localDraw, tagData, this.relativePosition);
    this.tags.push(tag);
    // const height = tag.getHeight();
    // const width = tag.getWidth();
    // if (this.currentTagLeftPos + width - PADDING < this.width) {
    //   tag.moveTo({
    //     x: this.currentTagLeftPos,
    //     y: this.currentTagTopPos
    //   });
    //   if (this.currentTagTopPos + height + PADDING > this.nextTagTopPos) {
    //     this.nextTagTopPos = this.currentTagTopPos + height + PADDING;
    //   }
    // } else {
    //   this.currentTagTopPos = this.nextTagTopPos;
    //   this.currentTagLeftPos = PADDING;
    //   tag.moveTo({
    //     x: this.currentTagLeftPos,
    //     y: this.currentTagTopPos
    //   });
    // }
    // this.currentTagLeftPos += width + PADDING;
  }
}

export default TagsList;
