/** World-space model `<group position>` after Enter (camera rest → this pose). */
export const HOME_MODEL_REST_POSITION: [number, number, number] = [0, 23, -60];

/** Uniform `<group scale>` when model settles at `HOME_MODEL_REST_POSITION`. */
export const HOME_MODEL_REST_SCALE = 0.42;

/** Camera eases to splash rest `(0, 2.5, 28)` after Enter (before model moves). */
export const HOME_CAMERA_ENTER_LERP_MS = 1600;

/** Model eases from origin to `HOME_MODEL_REST_POSITION` (runs in parallel with camera enter). */
export const HOME_MODEL_TO_REST_LERP_MS = 1600;

/** Full Enter sequence wall time (camera + model tweens run together). */
export const HOME_ENTER_SEQUENCE_MS = Math.max(
  HOME_CAMERA_ENTER_LERP_MS,
  HOME_MODEL_TO_REST_LERP_MS
);
