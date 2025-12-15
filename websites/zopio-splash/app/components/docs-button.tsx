/**
 * SPDX-License-Identifier: MIT
 */

import { twMerge } from "tailwind-merge";

type DocsButtonProps = {
  className?: string;
};

export const DocsButton = ({ className }: DocsButtonProps) => (
  <a
    className={twMerge(
      "inline-flex shrink-0 items-center justify-center rounded-md bg-orange-500 px-4 py-2.5 font-semibold text-sm text-white shadow-sm hover:bg-orange-600",
      className
    )}
    href="https://docs.zopio.dev/"
  >
    Read the docs
  </a>
);
