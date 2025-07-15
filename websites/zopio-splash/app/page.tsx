/**
 * SPDX-License-Identifier: MIT
 */

import type { Metadata } from 'next';
import { Apps } from './components/apps';
import { CallToAction } from './components/cta';
import { Features } from './components/features';
import { Hero } from './components/hero';
import { OpenSource } from './components/open-source';
import { Review } from './components/review';
import { Social } from './components/social';

export const metadata: Metadata = {
  title:
    'From idea to enterprise: Full-Stack business framework designed to build scalable apps',
  description:
    'a full-stack business framework designed to build scalable business apps with Auto UI and plugin extensibility – built on a developer-first',
};

const Home = () => (
  <>
    <Hero />
    <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      <div className="sm:col-span-2">
        <Review />
      </div>
      <div className="sm:col-span-1">
        <OpenSource />
      </div>
    </div>
    <div className="h-8 bg-dashed" />
    <Apps />
    <div className="h-8 bg-dashed" />
    <Features />
    <div className="h-8 bg-dashed" />
    <Social />
    <CallToAction />
  </>
);

export default Home;
