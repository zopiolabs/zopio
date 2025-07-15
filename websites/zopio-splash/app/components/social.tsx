/**
 * SPDX-License-Identifier: MIT
 */

import { Tweet } from 'react-tweet';

const tweets: string[] = [];

export const Social = () => (
  <section className="grid sm:grid-cols-3 sm:divide-x" id="community">
    <div className="hidden bg-dashed sm:block">
      <div className="sticky top-14 p-8" />
    </div>
    <div className="columns-1 gap-4 p-8 sm:col-span-2 md:columns-2">
      {tweets.map((tweet: string, index: number) => (
        <div key={tweet} className={index ? '' : 'sm:-mt-6'}>
          <Tweet id={tweet} />
        </div>
      ))}
    </div>
  </section>
);
