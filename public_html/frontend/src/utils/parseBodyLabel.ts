import { BodyLabel } from "../types";

export const parseBodyLabel = (bodyLabel: string) => {
  try {
    return JSON.parse(bodyLabel) as unknown as BodyLabel;
  } catch (e) {
    return {} as BodyLabel;
  }
};
