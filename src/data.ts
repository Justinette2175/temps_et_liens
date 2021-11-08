import { TagData, TagTypeData, PersonData } from "./types";

export const TAG_TYPES: Array<TagTypeData> = [
  {
    id: "1",
    name: "stage"
  },
  {
    id: "2",
    name: "relationship"
  }
];

export const INITIAL_TAGS: Array<TagData> = [
  { id: "1", name: "Kindergarten", type: TAG_TYPES[0] },
  {
    id: "2",
    name: "Ecole  ODS",
    type: TAG_TYPES[0]
  },
  {
    id: "3",
    name: "Holidays",
    type: TAG_TYPES[0]
  },
  {
    id: "4",
    name: "High School",
    type: TAG_TYPES[0]
  },
  {
    id: "5",
    name: "St Paul's",
    type: TAG_TYPES[0]
  },
  {
    id: "6",
    name: "EABJM",
    type: TAG_TYPES[0]
  },
  {
    id: "8",
    name: "McGill",
    type: TAG_TYPES[0]
  },
  {
    id: "7",
    name: "Family",
    type: TAG_TYPES[1]
  }
];

export const INITIAL_PERSONS: Array<PersonData> = [
  {
    id: "1",
    name: "Emmanuelle Germain",
    tags: [INITIAL_TAGS[6]]
  },
  {
    id: "2",
    name: "Noe Chapolard",
    tags: [INITIAL_TAGS[6], INITIAL_TAGS[4], INITIAL_TAGS[2]]
  },
  {
    id: "3",
    name: "Pascal Gagnepain",
    tags: [INITIAL_TAGS[6]]
  },
  {
    id: "4",
    name: "Cyrille Goldstein",
    tags: [INITIAL_TAGS[7]]
  }
];
