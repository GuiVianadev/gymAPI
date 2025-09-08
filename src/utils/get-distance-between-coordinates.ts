export type Coordinate = {
  latitude: number;
  longitude: number;
};

const DEGREES_TO_RADIANS = 180;
const NAUTICAL_MILES_TO_STATUTE_MILES = 1.1515;
const MILES_TO_KILOMETERS = 1.609_344;

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate
) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0;
  }

  const fromRadian = (Math.PI * from.latitude) / DEGREES_TO_RADIANS;
  const toRadian = (Math.PI * to.latitude) / DEGREES_TO_RADIANS;

  const theta = from.longitude - to.longitude;
  const radTheta = (Math.PI * theta) / DEGREES_TO_RADIANS;

  let dist =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * DEGREES_TO_RADIANS) / Math.PI;
  dist = dist * 60 * NAUTICAL_MILES_TO_STATUTE_MILES;
  dist *= MILES_TO_KILOMETERS;

  return dist;
}
