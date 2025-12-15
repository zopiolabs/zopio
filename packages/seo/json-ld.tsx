/**
 * SPDX-License-Identifier: MIT
 */

import type { FC } from "react";
import type { Thing, WithContext } from "schema-dts";

type JsonLdProps = {
  code: WithContext<Thing>;
};

export const JsonLd: FC<JsonLdProps> = ({ code }) => (
  <script type="application/ld+json">{JSON.stringify(code)}</script>
);

export * from "schema-dts";
