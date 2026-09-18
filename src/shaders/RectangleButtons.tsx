import React from "react";
import {
  GlassmorphismCta,
  type NeuformIsolatedEffectProps,
} from "./neuform-isolated/NeuformIsolatedEffects";

export type RectangleButtonsVariant =
  | "glassmorphism-cta"
  | string;

export interface RectangleButtonsProps extends NeuformIsolatedEffectProps {
  variant?: RectangleButtonsVariant;
}

export function RectangleButtons({
  variant = "glassmorphism-cta",
  ...props
}: RectangleButtonsProps) {
  if (variant === "glassmorphism-cta") {
    return <GlassmorphismCta {...props} />;
  }
  return <GlassmorphismCta {...props} />;
}

export default RectangleButtons;
