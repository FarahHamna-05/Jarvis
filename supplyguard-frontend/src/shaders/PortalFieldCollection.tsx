import React from "react";
import {
  FlowField,
  PortalField,
  FluxVortex,
  type NeuformBatchEffectProps,
} from "./neuform-isolated/NeuformBatchEffects";

export type PortalFieldVariant =
  | "flow-field"
  | "portal-field"
  | "flux-vortex"
  | string;

export interface PortalFieldCollectionProps extends NeuformBatchEffectProps {
  variant?: PortalFieldVariant;
}

export function PortalFieldCollection({
  variant = "flow-field",
  ...props
}: PortalFieldCollectionProps) {
  if (variant === "flow-field") {
    return <FlowField {...props} />;
  }
  if (variant === "portal-field") {
    return <PortalField {...props} />;
  }
  if (variant === "flux-vortex") {
    return <FluxVortex {...props} />;
  }
  return <FlowField {...props} />;
}

export default PortalFieldCollection;

