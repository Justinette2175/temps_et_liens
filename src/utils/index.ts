export const getRandomScreenPosition = (
  objectWidth: number,
  objectHeight: number
) => {
  return {
    x: Math.random() * (window.innerWidth - (objectWidth || 0)),
    y: Math.random() * (window.innerHeight - (objectHeight || 0))
  };
};

export const convertRadiansToOrtho = (radius: number, angle: number) => {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  };
};

class Base {
  base: boolean;
  constructor() {
    this.base = true;
  }
}

export const generateRosacePositions = (
  centerElementRadius: number,
  elementRadius: number,
  numberOfItems: number,
  gap: number
) => {
  const positions = [];
  let angle =
    2 *
    Math.asin(
      (elementRadius + gap / 2) / (centerElementRadius + elementRadius + gap)
    );
  let canFitAtRadius = Math.floor((2 * Math.PI) / angle);
  let lineStartingElementIndex = 0;
  let lineIndex = 0;
  for (let i = 0; i < numberOfItems; i++) {
    const newLine: boolean = i - lineStartingElementIndex > canFitAtRadius - 1;
    if (newLine) {
      lineStartingElementIndex = i;
      angle =
        2 *
        Math.asin(
          (elementRadius + gap / 2) /
            (centerElementRadius + elementRadius + gap * (lineIndex + 1))
        );
      canFitAtRadius = Math.floor((2 * Math.PI) / angle);
    }
    const orthoPosition = convertRadiansToOrtho(
      centerElementRadius +
        (elementRadius + gap) * (Math.floor(i / canFitAtRadius) + 1),
      angle * i
    );
    positions.push(orthoPosition);
  }
  return positions;
};
