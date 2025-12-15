/**
 * SPDX-License-Identifier: MIT
 */

import { cn } from "@repo/design-system/lib/utils";

function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-accent", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
