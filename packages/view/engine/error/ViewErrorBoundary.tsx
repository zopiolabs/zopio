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
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useViewTranslations } from '../../i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for catching and displaying view rendering errors
 */
class ErrorBoundaryComponent extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('View rendering error:', error, errorInfo);
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // If a custom fallback is provided, use it
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error);
        }
        return fallback;
      }

      // Default error UI
      return (
        <div className="rounded-md border border-red-500 bg-red-50 p-4">
          <h3 className="mb-2 font-semibold text-lg text-red-700">
            View Rendering Error
          </h3>
          <p className="mb-2 text-red-600 text-sm">
            An error occurred while rendering this view.
          </p>
          <details className="text-xs">
            <summary className="mb-1 cursor-pointer font-medium">
              Error details
            </summary>
            <pre className="overflow-auto rounded border border-red-200 bg-white p-2">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        </div>
      );
    }

    return children;
  }
}

/**
 * Wrapper component that provides translations to the error message
 */
export function ViewErrorBoundary({
  children,
  fallback,
}: ErrorBoundaryProps): JSX.Element {
  const t = useViewTranslations();

  const defaultFallback = (error: Error) => (
    <div className="rounded-md border border-red-500 bg-red-50 p-4">
      <h3 className="mb-2 font-semibold text-lg text-red-700">
        {t('error.title')}
      </h3>
      <p className="mb-2 text-red-600 text-sm">{t('error.renderingFailed')}</p>
      <details className="text-xs">
        <summary className="mb-1 cursor-pointer font-medium">
          {t('error.details')}
        </summary>
        <pre className="overflow-auto rounded border border-red-200 bg-white p-2">
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      </details>
    </div>
  );

  return (
    <ErrorBoundaryComponent fallback={fallback || defaultFallback}>
      {children}
    </ErrorBoundaryComponent>
  );
}
