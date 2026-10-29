/**
 * Apple Design Motion & Spring Physics
 * Based on WWDC "Designing Fluid Interfaces" & Emil Kowalski's guidelines:
 * - Damping ratio 1.0 (critically damped): No overshoot, smooth settle.
 * - Under-damped (damping ~0.8 / bounce ~0.15): Reserved only for momentum/flick interactions.
 * - Momentum projection: Exponential decay resting point formula from WWDC 2018 sample code.
 * - Rubberbanding: Soft progressive boundary resistance.
 */

import type { Transition } from "framer-motion";

/**
 * Standard Apple critically damped spring (Damping 1.0, Response ~0.35s)
 * Used for menus, modals, navigation pills, and standard UI transitions.
 */
export const APPLE_SPRING_DEFAULT: Transition = {
    type: "spring",
    bounce: 0,
    duration: 0.35,
};

/**
 * Apple sheet & drawer spring (Damping ~0.85, Response ~0.32s)
 * Responsive with a tiny hint of physical settle.
 */
export const APPLE_SPRING_SHEET: Transition = {
    type: "spring",
    bounce: 0.08,
    duration: 0.32,
};

/**
 * Apple flick & throw spring (Used when release velocity is high)
 */
export const APPLE_SPRING_MOMENTUM: Transition = {
    type: "spring",
    bounce: 0.18,
    duration: 0.4,
};

/**
 * Apple sliding pill indicator spring
 * Critically damped with instant physical settle and zero wobble.
 */
export const APPLE_SPRING_PILL: Transition = {
    type: "spring",
    stiffness: 480,
    damping: 42,
    mass: 0.5,
};

/**
 * Apple tactile press transition
 */
export const APPLE_TAP_TRANSITION: Transition = {
    type: "spring",
    stiffness: 500,
    damping: 30,
    mass: 0.4,
};

/**
 * Projects the resting position of a gesture using Apple's exponential decay function
 * from WWDC "Designing Fluid Interfaces".
 * 
 * @param initialVelocity Velocity in px/s at release
 * @param decelerationRate Deceleration constant (~0.998 for iOS scroll feel, 0.99 for snappier sheets)
 */
export function projectMomentum(initialVelocity: number, decelerationRate = 0.998): number {
    return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

/**
 * Apple rubber-band progressive resistance formula
 * The further past the boundary, the less the element follows.
 *
 * @param overshoot Distance past the boundary (px)
 * @param dimension Dimension of the surface (e.g. window height / width)
 * @param constant Resistance constant (0.55 default in iOS)
 */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
    return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
