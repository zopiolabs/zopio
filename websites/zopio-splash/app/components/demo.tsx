/**
 * SPDX-License-Identifier: MIT
 */

import Balancer from "react-wrap-balancer";
import { Video } from "./video";

export const Demo = () => (
  <section className="grid grid-cols-3" id="demo">
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center gap-2 text-neutral-500">
        <small>CLI Installation</small>
      </div>
      <h2 className="font-bold text-4xl tracking-tight">
        <Balancer>Get from zero to production in minutes.</Balancer>
      </h2>
      <p className="text-neutral-500">
        Getting started is as easy as running a single command.
      </p>
    </div>
    <div className="col-span-2">
      <Video
        aspectRatio="3440 / 2160"
        controls={false}
        loop={true}
        muted={true}
        playing={true}
        url="https://youtu.be/4LRXL6l-FS5"
      />
    </div>
  </section>
);
