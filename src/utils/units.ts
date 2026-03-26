/** Convert Celsius to Fahrenheit. */
export function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

/** Convert km/h to mph. */
export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

/** Convert millimeters to inches (1 decimal). */
export function mmToInches(mm: number): number {
  return Math.round(mm * 0.0393701 * 10) / 10;
}

/** Convert centimeters to inches (1 decimal). */
export function cmToInches(cm: number): number {
  return Math.round(cm * 0.393701 * 10) / 10;
}

/** Convert meters to feet (whole number). */
export function metersToFeet(m: number): number {
  return Math.round(m * 3.28084);
}

/**
 * Convert wind direction in degrees (0-360) to a cardinal string.
 * 0/360 = N, 90 = E, 180 = S, 270 = W.
 */
export function degreesToCardinal(deg: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16;
  return directions[index];
}
