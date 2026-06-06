/**
 * GSAP Configuration — Unity Consult Motion System
 * Register all plugins once, define brand eases.
 * Import this file ONCE in the root provider.
 */
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomBounce } from "gsap/CustomBounce";
import { CustomWiggle } from "gsap/CustomWiggle";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";
import { Draggable } from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Observer } from "gsap/Observer";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";

let registered = false;

export function registerGSAP() {
  if (registered || typeof window === "undefined") return;
  registered = true;

  gsap.registerPlugin(
    CustomEase, CustomBounce, CustomWiggle,
    RoughEase, ExpoScaleEase, SlowMo,
    Draggable, DrawSVGPlugin, Flip, InertiaPlugin,
    MotionPathPlugin, MorphSVGPlugin, Observer,
    ScrambleTextPlugin, ScrollTrigger, ScrollToPlugin,
    SplitText, TextPlugin,
  );

  // ── Brand custom eases ──────────────────────────────────────
  CustomEase.create("uc.reveal", "M0,0 C0.08,0 0.06,0.94 1,1");   // smooth deceleration
  CustomEase.create("uc.hero",   "M0,0 C0.14,0 0.08,1 1,1");      // slow start decisive finish
  CustomEase.create("uc.snap",   "M0,0 C0.25,0.46 0.45,0.94 1,1"); // snappy hover-out
  CustomEase.create("uc.lift",   "M0,0 C0.16,0 0,1 1,1");          // card lift
  CustomEase.create("uc.page",   "M0,0 C0.4,0 0.2,1 1,1");         // page transition
  CustomEase.create("uc.text",   "M0,0 C0.05,0 0.06,1 1,1");       // editorial text

  gsap.defaults({ ease: "uc.reveal", overwrite: "auto" });

  ScrollTrigger.defaults({
    toggleActions: "play none none none",
    start: "top 88%",
  });
}

export {
  gsap, ScrollTrigger, SplitText,
  Draggable, InertiaPlugin, Flip,
  DrawSVGPlugin, Observer, MorphSVGPlugin,
  CustomEase, ScrambleTextPlugin,
};
