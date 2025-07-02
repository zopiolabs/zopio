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
interface ComponentOptions {
  withI18n?: boolean;
}

export default function componentTemplate(
  name: string,
  options: ComponentOptions = {}
): string {
  const { withI18n = false } = options;

  if (withI18n) {
    return `'use client';

import { useTranslations } from 'next-intl';

interface ${name}Props {
  className?: string;
}

export default function ${name}({ className }: ${name}Props) {
  const t = useTranslations('${name.toLowerCase()}');
  
  return (
    <div className={className}>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
    </div>
  );
}
`;
  }

  return `'use client';

interface ${name}Props {
  className?: string;
}

export default function ${name}({ className }: ${name}Props) {
  return (
    <div className={className}>
      <h2>${name}</h2>
      <p>Description goes here</p>
    </div>
  );
}
`;
}
