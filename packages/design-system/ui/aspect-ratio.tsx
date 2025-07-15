/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>): React.JSX.Element {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
