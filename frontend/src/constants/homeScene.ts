/** Camera eases to splash rest `(0, 2.5, 28)` after Enter (before model moves). */
export const HOME_CAMERA_ENTER_LERP_MS = 1600;

/** Photo ring eases from `HOME_PHOTO_RING_ENTER_OFFSET` to origin (parallel with camera enter). */
export const HOME_MODEL_TO_REST_LERP_MS = 1600;

/** Full Enter sequence wall time (camera + ring enter tweens run together). */
export const HOME_ENTER_SEQUENCE_MS = Math.max(
  HOME_CAMERA_ENTER_LERP_MS,
  HOME_MODEL_TO_REST_LERP_MS
);

/** Pink guide torus: major radius (centerline of the circle in the XZ plane). */
export const HOME_PHOTO_RING_RADIUS = 13;

/** Torus tube radius (pink ring thickness). */
export const HOME_PHOTO_RING_GUIDE_THICKNESS = 0.006;

/** Pink outline color for the ring guide (`meshBasicMaterial`). */
export const HOME_PHOTO_RING_GUIDE_COLOR = '#f472b6';

/**
 * Panels orbit at guide radius + tube + this gap so images sit outside the pink ring
 * (centerline was cutting through planes).
 */
export const HOME_PHOTO_RING_PANEL_OUTSET = 0.08;

/** Max plane size (grey placeholders + contain-fit box for photos). */
export const HOME_PHOTO_RING_PANEL_WIDTH = 4;
export const HOME_PHOTO_RING_PANEL_HEIGHT = 5.1;

/**
 * Parent group position at t=0; lerps to origin with the model rest tween.
 * +Z moves the ring toward the camera so it eases back into the orbit target.
 */
export const HOME_PHOTO_RING_ENTER_OFFSET: [number, number, number] = [
  0, 0, 54,
];

/** Ring group Y — lifts the layout so the forward panel reads nearer screen center (camera looks slightly down at origin). */
export const HOME_PHOTO_RING_Y = 1.35;

/** Continuous rotation of the ring about Y (radians per second). */
export const HOME_PHOTO_RING_ROTATE_RAD_PER_SEC = 0.05;

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

/**
 * Horizontal half-span of the ring layout at scale 1 (world units): orbit radius plus worst-case
 * half-panel reach with hover scale — used to fit the ring within the view frustum width.
 */
export const HOME_PHOTO_RING_LAYOUT_HALF_SPAN =
  HOME_PHOTO_RING_RADIUS +
  HOME_PHOTO_RING_GUIDE_THICKNESS +
  HOME_PHOTO_RING_PANEL_OUTSET +
  (HOME_PHOTO_RING_PANEL_WIDTH / 2) * HOME_PHOTO_RING_PANEL_HOVER_SCALE;

/** Target fraction of visible half-width for the layout half-span (inset from horizontal edges). */
export const HOME_PHOTO_RING_VIEWPORT_PADDING = 0.92;

/**
 * Floor for responsive ring scale (1 = reference desktop size). Below this, panels feel too small.
 * Very narrow viewports may clip horizontally slightly instead of shrinking further.
 */
export const HOME_PHOTO_RING_VIEWPORT_MIN_SCALE = 0.62;

/** Exponential smoothing for hover scale (higher = snappier). */
export const HOME_PHOTO_RING_PANEL_HOVER_LERP = 14;

/** Delay before clearing hover when pointer leaves (reduces flicker between adjacent panels). */
export const HOME_PHOTO_RING_HOVER_LEAVE_MS = 45;

/** How fast the ring spins when a footer list item is hovered (higher = snappier). */
export const HOME_PHOTO_RING_LIST_FOCUS_LERP = 5;

/** Delay before clearing list-driven focus when leaving a link (matches ring hover feel). */
export const HOME_PHOTO_RING_LIST_FOCUS_LEAVE_MS = 45;

/** Exit: non-selected photo panels fade out (stage 1). */
export const HOME_PHOTO_RING_EXIT_OTHERS_MS = 420;

/** Exit: selected panel fades after stage 1, then navigation runs. */
export const HOME_PHOTO_RING_EXIT_SELECTED_MS = 380;

/** Footer fades out when leaving Home for a project (`motion` duration in seconds). */
export const HOME_FOOTER_EXIT_FADE_DURATION_S = 0.48;

/** Exit: ring rotates until the chosen panel faces forward; then fades begin. */
export const HOME_PHOTO_RING_EXIT_ALIGN_EPSILON_RAD = 0.022;
