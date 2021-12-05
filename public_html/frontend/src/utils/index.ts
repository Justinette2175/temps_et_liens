import { Dimensions } from "../types";

export const getRandomScreenPosition = (
  radius: number,
  minDistanceFromEdge: number = 0,
  screenDimensions: Dimensions
) => {
  return {
    x: randomBetween(
      radius + minDistanceFromEdge,
      screenDimensions.w - radius - minDistanceFromEdge
    ),
    y: randomBetween(
      radius + minDistanceFromEdge,
      screenDimensions.h - radius - minDistanceFromEdge
    )
  };
};

const randomBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const distanceBetween = (
  pointA: { x: number; y: number },
  pointB: { x: number; y: number }
) => {
  return Math.sqrt(
    Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
  );
};

export const isNonOverlappingCircleScreenPosition = (
  existingCircles: {
    x: number;
    y: number;
    r: number;
  }[],
  x: number,
  y: number,
  r: number
) => {
  let isValid = true;
  for (let i = 0; i < existingCircles.length; i++) {
    const circle = existingCircles[i];
    if (
      distanceBetween({ x, y }, { x: circle.x, y: circle.y }) <
      r + circle.r
    ) {
      isValid = false;
      break;
    }
  }
  return isValid;
};

export const getNonOverlappingCirclePosition = (
  existingCircles: {
    x: number;
    y: number;
    r: number;
  }[],
  r: number,
  spaceBetweenItems: number = 0,
  screenDimensions: Dimensions
) => {
  let trials = 0;
  const tryOnce: any = () => {
    const testPosition = getRandomScreenPosition(r, 50, screenDimensions);
    if (
      !isNonOverlappingCircleScreenPosition(
        existingCircles,
        testPosition.x,
        testPosition.y,
        r + spaceBetweenItems
      )
    ) {
      if (trials < 500) {
        trials++;
        return tryOnce();
      } else {
        return undefined;
      }
    }
    return testPosition;
  };
  return tryOnce();
};

export const getClosestValidPosition = (
  existingCircles: {
    x: number;
    y: number;
    r: number;
  }[],
  circleToSurround: {
    x: number;
    y: number;
    r: number;
  },
  r: number
) => {
  let trials = 0;
  let radiusLevel = 0;
  const tryOnce: any = () => {
    const randomRadianAngle = randomBetween(0, 2 * Math.PI);
    const relativeOrthoPos = convertRadiansToOrtho(
      circleToSurround.r + r + radiusLevel * 2 * r,
      randomRadianAngle
    );
    const testPosition = {
      x: circleToSurround.x + relativeOrthoPos.x,
      y: circleToSurround.y + relativeOrthoPos.y
    };
    if (
      !isNonOverlappingCircleScreenPosition(
        existingCircles,
        testPosition.x,
        testPosition.y,
        r
      )
    ) {
      if (trials < 500) {
        trials++;
        return tryOnce();
      } else {
        trials = 0;
        radiusLevel++;
        return tryOnce();
      }
    }
    return testPosition;
  };
  return tryOnce();
};

export const convertRadiansToOrtho = (radius: number, angle: number) => {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  };
};

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
