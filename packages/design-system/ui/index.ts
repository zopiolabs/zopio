/**
 * SPDX-License-Identifier: MIT
 */

// Export all UI components
export * from './accordion';
export * from './action-button';
export * from './alert-dialog';
export * from './alert';
export * from './announcement';
export * from './aspect-ratio';
export * from './avatar-carousel';
export * from './avatar-stack';
export * from './avatar';
export * from './draggable-avatar';
export * from './global-draggable-avatar';
export * from './badge';
export * from './banner';
export * from './breadcrumb';
export * from './button';
export * from './button-group';
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  daysForLocale,
  monthsForLocale,
  useCalendarMonth,
  useCalendarYear,
  // Exclude Status type to avoid conflict
} from './calendar-view';

export {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
  daysForLocale,
  monthsForLocale,
  useCalendarMonth,
  useCalendarYear,
};
export * from './calendar';
export * from './card';
export * from './carousel';
export * from './chart';
export * from './chat-avatar-demo';
export * from './chat-bubble-integration';
export * from './chat-comparison-demo';
export * from './chat-window';
export * from './checkbox';
export * from './choicebox';
export * from './code-block';
export * from './collapsible';
export * from './color-palette';
export * from './color-picker';
export * from './comparison';
export * from './combobox';
export * from './command';
export * from './context-menu';
export * from './credit-card';
export * from './cursor';
export * from './dialog-stack';
export * from './dialog';
export * from './display-cards';
export * from './drawer';
export * from './dropdown-menu';
export * from './dropzone';
export * from './enhanced-button';
export * from './expandable-card';
import { FloatingActionPanelRoot } from './floating-action-panel';
export { FloatingActionPanelRoot };
export * from './form';
export * from './glimpse';
export * from './hero-badge';
export * from './hero';
export * from './hover-card';
export * from './image-crop';
export * from './image-zoom';
export * from './icon';
export * from './input-otp';
export * from './input';
export * from './kanban';
export * from './kbd';
export * from './label';
export * from './list';
export * from './listbox';
export * from './marquee';
export * from './menu';
export * from './menubar';
export * from './mini-calendar';
export * from './mode-toggle';
export * from './multiple-selector';
export * from './navbar';
export * from './navigation-menu';
export * from './new-gantt/GanttFeatureItem';
export * from './new-gantt/GanttHeader';
export * from './new-gantt/GanttMarker';
export * from './new-gantt/GanttProvider';
export * from './new-gantt/GanttSidebar';
export * from './new-gantt/GanttTimeline';
export * from './new-gantt/context';
export * from './new-gantt/explain';
export * from './pagination';
export * from './pill';
export * from './popover';
export * from './pricing';
export * from './progress';
export * from './progress-with-value';
export * from './enhanced-progress';
export * from './project-status-card';
export * from './qr-code';
export * from './radio-group';
export * from './rating';
export * from './resizable';
export * from './sandbox';
export * from './scroll-area';
export * from './select';
export * from './separator';
export * from './sheet';
export * from './sidebar';
export * from './skeleton';
export * from './slider';
export * from './snippet';
import { Toaster as SonnerToaster } from './sonner';
export { SonnerToaster };
export * from './spinner';
import { Status as StatusComponent } from './status';
export { StatusComponent };
export * from './status-badge';
export * from './switch';
export * from './table';
export * from './tabs';
export * from './tags';
export * from './textarea';
export * from './theme-switcher';
export * from './ticker';
export * from './toast';
import { Toaster as DefaultToaster } from './toaster';
export { DefaultToaster };
export * from './toggle-group';
export * from './toggle';
export * from './tooltip';
export * from './typography';
export * from './use-toast';
export * from './video-player';
export * from './relative-time';
export * from './timeline';
export * from './tweet-card';
export * from './typewriter';
export * from './responsive-modal';
export * from './open-source';
export * from './logo-carousel';
export * from './word-reveal';
export * from './number-flow';
export * from './number-counter';
export * from './flow';
// Explicitly re-export from number-flow-barvian to avoid naming conflicts
import {
  NumberFlowBarvian,
  NumberFlowBarvianGroup,
  continuous,
  useCanAnimate,
  // Avoid re-exporting conflicting types
  type Plugin,
  type NumberFlowBarvianProps
} from './number-flow-barvian';

export {
  NumberFlowBarvian,
  NumberFlowBarvianGroup,
  continuous,
  useCanAnimate,
  type Plugin,
  type NumberFlowBarvianProps
};
import {
  PopoverRoot,
  PopoverTrigger as InteractivePopoverTrigger,
  PopoverContent as InteractivePopoverContent,
  PopoverForm,
  PopoverLabel,
  PopoverTextarea,
  PopoverFooter,
  PopoverCloseButton,
  PopoverSubmitButton,
  PopoverHeader,
  PopoverBody,
  PopoverButton
} from './interactive-popover';

export {
  PopoverRoot,
  InteractivePopoverTrigger,
  InteractivePopoverContent,
  PopoverForm,
  PopoverLabel,
  PopoverTextarea,
  PopoverFooter,
  PopoverCloseButton,
  PopoverSubmitButton,
  PopoverHeader,
  PopoverBody,
  PopoverButton
};
