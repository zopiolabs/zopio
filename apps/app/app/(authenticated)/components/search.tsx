/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { ArrowRightIcon, SearchIcon } from 'lucide-react';

export const Search = () => (
  <form action="/search" className="flex items-center gap-2 px-4">
    <div className="relative">
      <div className="absolute top-px bottom-px left-px flex h-8 w-8 items-center justify-center">
        <SearchIcon size={16} className="text-muted-foreground" />
      </div>
      <Input
        type="text"
        name="q"
        placeholder="Search"
        className="h-auto bg-background py-1.5 pr-3 pl-8 text-xs"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-px right-px bottom-px h-8 w-8"
      >
        <ArrowRightIcon size={16} className="text-muted-foreground" />
      </Button>
    </div>
  </form>
);
