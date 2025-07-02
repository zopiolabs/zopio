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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Separator } from '@repo/design-system/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { useState } from 'react';
import { useCrudTranslation } from '../i18n';
import type { FieldDefinition, FieldValue } from '../types';
import { AutoForm } from './AutoForm';

export interface FormSection {
  /**
   * Section title
   */
  title?: string;

  /**
   * Section description
   */
  description?: string;

  /**
   * Field names to include in this section
   */
  fields: string[];

  /**
   * Number of columns for the grid layout (1-4)
   */
  columns?: 1 | 2 | 3 | 4;

  /**
   * Custom CSS class for the section
   */
  className?: string;
}

export interface FormTab {
  /**
   * Tab title
   */
  title: string;

  /**
   * Tab description
   */
  description?: string;

  /**
   * Sections within this tab
   */
  sections: FormSection[];

  /**
   * Custom CSS class for the tab
   */
  className?: string;
}

export interface FormLayout {
  /**
   * Layout type
   */
  type: 'tabs' | 'sections' | 'wizard' | 'accordion' | 'basic';

  /**
   * Tabs configuration (for tabs layout)
   */
  tabs?: FormTab[];

  /**
   * Sections configuration (for sections layout)
   */
  sections?: FormSection[];

  /**
   * Steps configuration (for wizard layout)
   */
  steps?: FormTab[];

  /**
   * Accordion items (for accordion layout)
   */
  accordionItems?: FormSection[];
}

export interface AutoFormLayoutProps {
  /**
   * Form layout configuration
   */
  layout: FormLayout;

  /**
   * Field definitions
   */
  fields: FieldDefinition[];

  /**
   * Form values
   */
  value: Record<string, FieldValue>;

  /**
   * Called when form values change
   */
  onChange: (value: Record<string, FieldValue>) => void;

  /**
   * Form validation errors
   */
  errors?: Record<string, string>;

  /**
   * Called when form is submitted
   */
  onSubmit?: (value: Record<string, FieldValue>) => void;

  /**
   * Whether form is currently submitting
   */
  isSubmitting?: boolean;

  /**
   * Label for submit button
   */
  submitLabel?: string;

  /**
   * Label for reset button
   */
  resetLabel?: string;

  /**
   * Whether to show reset button
   */
  showReset?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;
}

/**
 * AutoFormLayout provides advanced layout options for forms including tabs,
 * sections, wizards, and accordions.
 */
export function AutoFormLayout({
  layout,
  fields,
  value,
  onChange,
  errors = {},
  onSubmit,
  isSubmitting = false,
  submitLabel,
  resetLabel,
  showReset = true,
  className = '',
}: AutoFormLayoutProps) {
  const { t } = useCrudTranslation();
  const [activeTab, setActiveTab] = useState<string>('0');
  const [activeStep, setActiveStep] = useState<number>(0);

  // Filter fields to only include those specified in a section
  const getFieldsForSection = (section: FormSection): FieldDefinition[] => {
    return fields.filter((field) => section.fields.includes(field.name));
  };

  // Render basic layout (single column of fields)
  const renderBasicLayout = () => {
    return (
      <AutoForm
        fields={fields}
        value={value}
        onChange={onChange}
        errors={errors}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
        resetLabel={resetLabel}
        showReset={showReset}
        className={className}
      />
    );
  };

  // Render sections layout
  const renderSectionsLayout = () => {
    if (!layout.sections || layout.sections.length === 0) {
      return renderBasicLayout();
    }

    return (
      <div className={className}>
        {layout.sections.map((section, index) => (
          <Card key={section.title || `section-${index}`} className="mb-6">
            {section.title && (
              <CardHeader>
                <CardTitle>
                  {t(`form.sections.${section.title}`, {
                    defaultValue: section.title,
                  })}
                </CardTitle>
                {section.description && (
                  <CardDescription>
                    {t(`form.sections.${section.title}.description`, {
                      defaultValue: section.description,
                    })}
                  </CardDescription>
                )}
              </CardHeader>
            )}
            <CardContent>
              <AutoForm
                fields={getFieldsForSection(section)}
                value={value}
                onChange={onChange}
                errors={errors}
                className={section.className}
                layout={{
                  sections: [{ ...section, columns: section.columns || 1 }],
                }}
              />
            </CardContent>
          </Card>
        ))}

        {onSubmit && (
          <div className="mt-6 flex justify-end space-x-2">
            {showReset && (
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
                onClick={() => onChange({})}
                disabled={isSubmitting}
              >
                {t('form.reset', { defaultValue: resetLabel || 'Reset' })}
              </button>
            )}

            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 font-medium text-sm text-white hover:bg-primary/90"
              onClick={() => onSubmit(value)}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('form.submitting')
                : t('form.submit', { defaultValue: submitLabel || 'Submit' })}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render tabs layout
  const renderTabsLayout = () => {
    if (!layout.tabs || layout.tabs.length === 0) {
      return renderBasicLayout();
    }

    return (
      <div className={className}>
        <Tabs defaultValue="0" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {layout.tabs.map((tab, index) => (
              <TabsTrigger
                key={tab.title || `tab-${index}`}
                value={index.toString()}
              >
                {t(`form.tabs.${tab.title}`, { defaultValue: tab.title })}
              </TabsTrigger>
            ))}
          </TabsList>

          {layout.tabs.map((tab, index) => (
            <TabsContent
              key={tab.title || `tab-content-${index}`}
              value={index.toString()}
              className={tab.className}
            >
              {tab.description && (
                <p className="mb-4 text-gray-500 text-sm">
                  {t(`form.tabs.${tab.title}.description`, {
                    defaultValue: tab.description,
                  })}
                </p>
              )}

              {tab.sections.map((section, sectionIndex) => (
                <div
                  key={section.title || `section-${sectionIndex}`}
                  className="mb-6"
                >
                  {section.title && (
                    <>
                      <h3 className="mb-2 font-medium text-lg">
                        {t(`form.sections.${section.title}`, {
                          defaultValue: section.title,
                        })}
                      </h3>
                      {section.description && (
                        <p className="mb-3 text-gray-500 text-sm">
                          {t(`form.sections.${section.title}.description`, {
                            defaultValue: section.description,
                          })}
                        </p>
                      )}
                      <Separator className="mb-4" />
                    </>
                  )}

                  <AutoForm
                    fields={getFieldsForSection(section)}
                    value={value}
                    onChange={onChange}
                    errors={errors}
                    className={section.className}
                    layout={{
                      sections: [{ ...section, columns: section.columns || 1 }],
                    }}
                  />
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {onSubmit && (
          <div className="mt-6 flex justify-end space-x-2">
            {showReset && (
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
                onClick={() => onChange({})}
                disabled={isSubmitting}
              >
                {t('form.reset', { defaultValue: resetLabel || 'Reset' })}
              </button>
            )}

            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 font-medium text-sm text-white hover:bg-primary/90"
              onClick={() => onSubmit(value)}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('form.submitting')
                : t('form.submit', { defaultValue: submitLabel || 'Submit' })}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render wizard layout
  const renderWizardLayout = () => {
    if (!layout.steps || layout.steps.length === 0) {
      return renderBasicLayout();
    }

    const currentStep = layout.steps[activeStep];
    const isFirstStep = activeStep === 0;
    const isLastStep = activeStep === layout.steps.length - 1;

    return (
      <div className={className}>
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold text-xl">
              {t(`form.steps.${currentStep.title}`, {
                defaultValue: currentStep.title,
              })}
            </h2>
            <span className="text-gray-500 text-sm">
              {t('form.wizard.step', {
                current: activeStep + 1,
                total: layout.steps.length,
              })}
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-primary"
              style={{
                width: `${((activeStep + 1) / layout.steps.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {currentStep.description && (
          <p className="mb-4 text-gray-500 text-sm">
            {t(`form.steps.${currentStep.title}.description`, {
              defaultValue: currentStep.description,
            })}
          </p>
        )}

        {currentStep.sections.map((section, sectionIndex) => (
          <div
            key={section.title || `section-${sectionIndex}`}
            className="mb-6"
          >
            {section.title && (
              <>
                <h3 className="mb-2 font-medium text-lg">
                  {t(`form.sections.${section.title}`, {
                    defaultValue: section.title,
                  })}
                </h3>
                {section.description && (
                  <p className="mb-3 text-gray-500 text-sm">
                    {t(`form.sections.${section.title}.description`, {
                      defaultValue: section.description,
                    })}
                  </p>
                )}
                <Separator className="mb-4" />
              </>
            )}

            <AutoForm
              fields={getFieldsForSection(section)}
              value={value}
              onChange={onChange}
              errors={errors}
              className={section.className}
              layout={{
                sections: [{ ...section, columns: section.columns || 1 }],
              }}
            />
          </div>
        ))}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className={`rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 ${
              isFirstStep ? 'invisible' : ''
            }`}
            onClick={() => setActiveStep(activeStep - 1)}
            disabled={isFirstStep || isSubmitting}
          >
            {t('form.wizard.previous', { defaultValue: 'Previous' })}
          </button>

          <div className="flex space-x-2">
            {showReset && (
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
                onClick={() => {
                  onChange({});
                  setActiveStep(0);
                }}
                disabled={isSubmitting}
              >
                {t('form.reset', { defaultValue: resetLabel || 'Reset' })}
              </button>
            )}

            {isLastStep && onSubmit ? (
              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 font-medium text-sm text-white hover:bg-primary/90"
                onClick={() => onSubmit(value)}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t('form.submitting')
                  : t('form.submit', { defaultValue: submitLabel || 'Submit' })}
              </button>
            ) : (
              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 font-medium text-sm text-white hover:bg-primary/90"
                onClick={() => setActiveStep(activeStep + 1)}
                disabled={isSubmitting}
              >
                {t('form.wizard.next', { defaultValue: 'Next' })}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render accordion layout
  const renderAccordionLayout = () => {
    if (!layout.accordionItems || layout.accordionItems.length === 0) {
      return renderBasicLayout();
    }

    return (
      <div className={className}>
        {layout.accordionItems.map((section, index) => (
          <Card key={section.title || `accordion-${index}`} className="mb-4">
            <CardHeader>
              <CardTitle>
                {t(`form.sections.${section.title}`, {
                  defaultValue: section.title || `Section ${index + 1}`,
                })}
              </CardTitle>
              {section.description && (
                <CardDescription>
                  {t(`form.sections.${section.title}.description`, {
                    defaultValue: section.description,
                  })}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <AutoForm
                fields={getFieldsForSection(section)}
                value={value}
                onChange={onChange}
                errors={errors}
                className={section.className}
                layout={{
                  sections: [{ ...section, columns: section.columns || 1 }],
                }}
              />
            </CardContent>
          </Card>
        ))}

        {onSubmit && (
          <div className="mt-6 flex justify-end space-x-2">
            {showReset && (
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
                onClick={() => onChange({})}
                disabled={isSubmitting}
              >
                {t('form.reset', { defaultValue: resetLabel || 'Reset' })}
              </button>
            )}

            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 font-medium text-sm text-white hover:bg-primary/90"
              onClick={() => onSubmit(value)}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('form.submitting')
                : t('form.submit', { defaultValue: submitLabel || 'Submit' })}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render appropriate layout based on type
  switch (layout.type) {
    case 'tabs':
      return renderTabsLayout();
    case 'sections':
      return renderSectionsLayout();
    case 'wizard':
      return renderWizardLayout();
    case 'accordion':
      return renderAccordionLayout();
    case 'basic':
    default:
      return renderBasicLayout();
  }
}
