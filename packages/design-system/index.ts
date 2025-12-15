/**
 * SPDX-License-Identifier: MIT
 */

/**
 * Main entry point for the design system
 *
 * This file re-exports all components, utilities, and providers
 * from the design system package in a clean and organized way.
 */

// Re-export colors as a namespace to avoid naming conflicts
export * as colors from "./lib/colors";
export * from "./lib/fonts";
// Re-export utility functions and libraries
export * from "./lib/utils";
// Re-export all providers
export * from "./providers";
// Re-export all UI components
export * from "./ui";
