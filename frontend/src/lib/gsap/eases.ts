/** Named ease + duration constants. Import everywhere for consistency. */

export const EASE = {
  reveal:  "uc.reveal",
  hero:    "uc.hero",
  snap:    "uc.snap",
  lift:    "uc.lift",
  page:    "uc.page",
  text:    "uc.text",
  power3:  "power3.out",
  expo:    "expo.out",
  back:    "back.out(1.4)",
  none:    "none",
} as const;

export const DUR = {
  instant:   0.15,
  fast:      0.3,
  base:      0.55,
  medium:    0.75,
  slow:      1.0,
  cinematic: 1.4,
} as const;

export const STAGGER = {
  tight:  0.04,
  base:   0.07,
  wide:   0.12,
  chars:  0.02,
  words:  0.05,
  lines:  0.08,
} as const;
