const rad = (x: number) => {
  return (x * Math.PI) / 180;
};

interface Coordinate {
  lat: number;
  long: number;
}

export const getDistance = (p1: Coordinate, p2: Coordinate) => {
  const R = 6378137;
  const dLat = rad(p2.lat - p1.lat);
  const dLong = rad(p2.long - p1.long);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) *
      Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // atan is the general form of inverse tangent that gets a value and returns the
  // associated angle in radian. But atan2 gets two values of y and x and assumes a complex
  // number as x + iy and returns its phase.

  // The atan2 function calculates one unique arc tangent value from two variables y and x,
  //  where the signs of both arguments are used to determine the quadrant of the result,
  //  thereby selecting the desired branch of the arc tangent of y/x, e.g., atan2(1, 1) =
  //  π/4 and atan2(−1, −1) = −3π/4.

  const d = R * c;
  return d; // returns the distance in meter
};
