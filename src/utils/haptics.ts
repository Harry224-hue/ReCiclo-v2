/**
 * Apple Design Multimodal Feedback: Haptics Utility
 * Based on WWDC "Designing Audio-Haptic Experiences" & Emil Kowalski's guidelines:
 * - Causality: Fired directly on causal events (selection, snap, camera trigger, success).
 * - Harmony: Synchronous with the visual frame.
 * - Utility: Reserved for meaningful tactile moments.
 */

export type HapticFeedbackType = "selection" | "light" | "medium" | "heavy" | "success" | "warning";

export function triggerHaptic(type: HapticFeedbackType = "selection") {
    if (typeof window === "undefined" || !("vibrate" in navigator)) {
        return;
    }

    try {
        switch (type) {
            case "selection":
                // Micro-tick for tab changes, toggle flips (8ms)
                navigator.vibrate(8);
                break;
            case "light":
                // Light impact for button presses / pill switches (12ms)
                navigator.vibrate(12);
                break;
            case "medium":
                // Tactile feedback for shutter button, dialog triggers (22ms)
                navigator.vibrate(22);
                break;
            case "heavy":
                // Heavier snap feedback (35ms)
                navigator.vibrate(35);
                break;
            case "success":
                // Apple success pattern: gentle double tap
                navigator.vibrate([10, 40, 15]);
                break;
            case "warning":
                // Warning / error pattern
                navigator.vibrate([20, 50, 20]);
                break;
        }
    } catch {
        // Silently ignore if vibrations are blocked by permissions or user settings
    }
}
