/** Route change: previous project exits, then next enters (AnimatePresence `wait`) */
export const PROJECT_PAGE_ROUTE_TRANSITION_S = 0.38;

/** Fade-in for title, gallery images, and copy — independent of surface colour transition */
export const PROJECT_CONTENT_FADE_DURATION_S = 0.88;
export const PROJECT_CONTENT_STAGGER_STEP_S = 0.2;
export const PROJECT_TITLE_FADE_DELAY_S = 0.2;
/** First image starts after title begins */
export const PROJECT_IMAGE_BASE_DELAY_S = 0.14;
/** Brief / approach / results FadeBox base stagger (seconds) */
export const PROJECT_COPY_FADE_DELAYS_S = [0.42, 0.56, 0.72] as const;
