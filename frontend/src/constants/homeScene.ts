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

/** Number of placeholder panels on the photo ring (XZ circle). */
export const HOME_PHOTO_RING_COUNT = 12;

/** Ring radius in world units (panels sit on this circle). */
export const HOME_PHOTO_RING_RADIUS = 10;

/** Grey placeholder panel size (plane). */
export const HOME_PHOTO_RING_PANEL_WIDTH = 3.2;
export const HOME_PHOTO_RING_PANEL_HEIGHT = 4.1;

/**
 * Parent group position at t=0; lerps to origin with the model rest tween.
 * +Z moves the ring toward the camera so it eases back into the orbit target.
 */
export const HOME_PHOTO_RING_ENTER_OFFSET: [number, number, number] = [
  0, 0, 44,
];

/** Vertical offset of the ring layout (world Y). */
export const HOME_PHOTO_RING_Y = 0;

/** Continuous rotation of the ring about Y (radians per second). */
export const HOME_PHOTO_RING_ROTATE_RAD_PER_SEC = 0.05;

/** Panel transparency (1 = opaque). See-through so opposite side of the ring stays visible. */
export const HOME_PHOTO_RING_PANEL_OPACITY = 0.55;

/**
 * Adds to scroll angular velocity (rad/s) per browser wheel `deltaY`.
 * Velocity drives rotation and decays via {@link HOME_PHOTO_RING_SCROLL_FRICTION}.
 */
export const HOME_PHOTO_RING_SCROLL_IMPULSE_PER_WHEEL_UNIT = 0.014;

/** Exponential velocity damping per second (higher = coast ends sooner). */
export const HOME_PHOTO_RING_SCROLL_FRICTION = 3.8;

/** Clamp scroll-driven angular velocity (rad/s) after impulse. */
export const HOME_PHOTO_RING_SCROLL_MAX_RAD_PER_SEC = 14;

/** Uniform scale when a panel is hovered (slight pop-out). */
export const HOME_PHOTO_RING_PANEL_HOVER_SCALE = 1.1;

/** Exponential smoothing for hover scale (higher = snappier). */
export const HOME_PHOTO_RING_PANEL_HOVER_LERP = 14;

/** Delay before clearing hover when pointer leaves (reduces flicker between adjacent panels). */
export const HOME_PHOTO_RING_HOVER_LEAVE_MS = 45;
