/** World-space model `<group position>` after Enter (camera rest → this pose). */
export const HOME_MODEL_REST_POSITION: [number, number, number] = [
  0, 37.5, -137,
];

/** Camera eases to splash rest `(0, 2.5, 28)` after Enter (before model moves). */
export const HOME_CAMERA_ENTER_LERP_MS = 1600;

/** Model eases from origin to `HOME_MODEL_REST_POSITION` after camera finishes. */
export const HOME_MODEL_TO_REST_LERP_MS = 1600;

/** Full Enter sequence; footer/header reveal should match this total. */
export const HOME_ENTER_SEQUENCE_MS =
  HOME_CAMERA_ENTER_LERP_MS + HOME_MODEL_TO_REST_LERP_MS;
