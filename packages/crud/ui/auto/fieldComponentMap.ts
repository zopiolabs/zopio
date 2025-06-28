/**
 * Field Component Map
 * Maps entity field types to UI components for form and table rendering
 */
import { forwardRef, useState } from 'react';
import type {} from 'react';

// Import UI components from design-system package
import type { Input } from '@repo/design-system/components/ui/input';
import {} from '@repo/design-system/components/ui/radio-group';
import {} from '@repo/design-system/components/ui/select';

// Import field component props type
import { type FieldComponentProps } from './types';

// Translation hook - replace with actual implementation if available
interface TranslationHook {
  t: (key: string) => string;
}

const useCrudTranslation = (): TranslationHook => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'fields.generic.dropFiles': 'Drop files here',
        'fields.generic.orClickToUpload': 'or click to upload',
        'fields.generic.remove': 'Remove',
        'fields.generic.search': 'Search',
      };
      return translations[key] || key;
    },
  };
};

/**
 * Password input with show/hide functionality
 */
const PasswordInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          ref={ref}
          className={`${className || ''} pr-10`}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? "Hide" : "Show"}
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

/**
 * Email input with validation
 */
const EmailInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, error, ...props }, ref) => {
    const [isValid, setIsValid] = useState(true);

    const validateEmail = (email: string): boolean => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setIsValid(newValue === "" || validateEmail(newValue));
      if (onChange) {
        onChange(newValue);
      }
    };

    return (
      <div className="space-y-2">
        <Input
          type="email"
          ref={ref}
          className={className}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || "Email address"}
          {...props}
        />
        {!isValid && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
EmailInput.displayName = "EmailInput";

/**
 * URL input with validation
 */
const UrlInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, error, ...props }, ref) => {
    const [isValid, setIsValid] = useState(true);

    const validateUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setIsValid(newValue === "" || validateUrl(newValue));
      if (onChange) {
        onChange(newValue);
      }
    };

    return (
      <div className="space-y-2">
        <Input
          type="url"
          ref={ref}
          className={className}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || "https://example.com"}
          {...props}
        />
        {!isValid && <p className="text-red-500 text-xs mt-1">Please enter a valid URL</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
UrlInput.displayName = "UrlInput";

/**
 * Number input with slider
 */
const NumberWithSlider = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, min = 0, max = 100, step = 1, ...props }, ref) => {
    const [numberValue, setNumberValue] = useState<number>(Number(value) || 0);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      setNumberValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    const handleSliderChange = (newValue: number[]) => {
      setNumberValue(newValue[0]);
      if (onChange) {
        onChange(newValue[0]);
      }
    };

    return (
      <div className="space-y-4">
        <Input
          type="number"
          ref={ref}
          className={className}
          value={numberValue}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        <Slider
          value={[numberValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          disabled={disabled}
        />
      </div>
    );
  }
);
NumberWithSlider.displayName = "NumberWithSlider";

/**
 * Phone input with formatting
 */
const PhoneInput = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, placeholder, ...props }, ref) => {
    const formatPhoneNumber = (value: string): string => {
      // Remove all non-numeric characters
      const cleaned = value.replace(/\D/g, '');

      // Format as (XXX) XXX-XXXX
      if (cleaned.length >= 10) {
        return `(${cleaned.slice(0, 3)}) $cleaned.slice(3, 6)-$cleaned.slice(6, 10)`;
      } else if (cleaned.length >= 6) {
        return `(${cleaned.slice(0, 3)}) $cleaned.slice(3, 6)-$cleaned.slice(6)`;
      } else if (cleaned.length >= 3) {
        return `(${cleaned.slice(0, 3)}) $cleaned.slice(3)`;
      }
      return cleaned;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatPhoneNumber(e.target.value);
      if (onChange) {
        onChange(formattedValue);
      }
    };

    return (
      <Input
        type="tel"
        ref={ref}
        className={className}
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder || "(123) 456-7890"}
        {...props}
      />
    );
  }
);
PhoneInput.displayName = "PhoneInput";

/**
 * Radio group component
 */
const RadioGroupComponent = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, options = [], ...props }, ref) => {
    const handleValueChange = (newValue: string) => {
      if (onChange) {
        onChange(newValue);
      }
    };

    return (
      <RadioGroup
        value={String(value || "")}
        onValueChange={handleValueChange}
        disabled={disabled}
        className={className}
        {...props}
      >
        <div className="space-y-2" ref={ref}>
          {options.map((option) => (
            <div key={String(option.value)} className="flex items-center space-x-2">
              <RadioGroupItem
                id={`$props.id || 'radio'-$option.value`}
                value={String(option.value)}
                disabled={option.disabled || disabled}
              />
              <Label htmlFor={`$props.id || 'radio'-$option.value`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    );
  }
);
RadioGroupComponent.displayName = "RadioGroupComponent";

/**
 * Checkbox group component
 */
const CheckboxGroup = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, options = [], ...props }, ref) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(
      Array.isArray(value) ? value.map(String) : []
    );

    const handleChange = (option: FieldOption) => {
      const optionValue = String(option.value);
      let newValues: string[];

      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter(val => val !== optionValue);
      } else {
        newValues = [...selectedValues, optionValue];
      }

      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };

    return (
      <div className="space-y-2" ref={ref}>
        {options.map((option) => (
          <div key={String(option.value)} className="flex items-center space-x-2">
            <Checkbox
              id={`$props.id || 'checkbox'-$option.value`}
              checked={selectedValues.includes(String(option.value))}
              onCheckedChange={() => handleChange(option)}
              disabled={option.disabled || disabled}
            />
            <Label htmlFor={`$props.id || 'checkbox'-$option.value`}>{option.label}</Label>
          </div>
        ))}
      </div>
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";

/**
 * File upload component
 */
const FileUpload = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, multiple, accept, ...props }, ref) => {
    const { t } = useCrudTranslation();
    const [files, setFiles] = useState<File[]>(value instanceof FileList ? Array.from(value) : []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setFiles(newFiles);
        if (onChange) {
          onChange(multiple ? newFiles : newFiles[0]);
        }
      }
    };

    const removeFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      if (onChange) {
        onChange(multiple ? newFiles : newFiles[0] || null);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center w-full">
          <label htmlFor={props.id || 'file-upload'} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">{t('fields.generic.dropFiles')}</p>
              <p className="text-xs text-gray-500">{t('fields.generic.orClickToUpload')}</p>
            </div>
            <input
              id={props.id || 'file-upload'}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
              multiple={multiple}
              accept={accept}
              ref={ref}
              {...props}
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={`$file.name-$index`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span className="text-sm truncate max-w-xs">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                  >
                    {t('fields.generic.remove')}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";

/**
 * Rich text editor component (simplified version)
 */
const RichTextEditor = forwardRef<HTMLTextAreaElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, rows = 5, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex space-x-1 mb-2 bg-gray-100 p-1 rounded">
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Bold</Button>
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Italic</Button>
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Underline</Button>
          <Button type="button" variant="ghost" size="sm" disabled={disabled}>Link</Button>
        </div>
        <Textarea
          ref={ref}
          className={className}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          rows={rows}
          {...props}
        />
      </div>
    );
  }
);
RichTextEditor.displayName = "RichTextEditor";

/**
 * Multi-select component
 */
const MultiSelect = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, options = [], ...props }, ref) => {
    const { t } = useCrudTranslation();
    const [selectedValues, setSelectedValues] = useState<string[]>(
      Array.isArray(value) ? value.map(String) : []
    );
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (option: FieldOption) => {
      const optionValue = String(option.value);
      let newValues: string[];

      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter(val => val !== optionValue);
      } else {
        newValues = [...selectedValues, optionValue];
      }

      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };

    const removeValue = (value: string) => {
      const newValues = selectedValues.filter(val => val !== value);
      setSelectedValues(newValues);
      if (onChange) {
        onChange(newValues);
      }
    };

    return (
      <div className="space-y-2" ref={ref}>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedValues.map(value => {
            const option = options.find(o => String(o.value) === value);
            return (
              <span key={value} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center" role="button">
                {option?.label}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => removeValue(value)}
                  disabled={disabled}
                >
                  ×
                </Button>
              </span>
            );
          })}
        </div>

        <Input
          type="text"
          placeholder={t('fields.generic.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
          className="mb-2"
        />

        <div className="border rounded max-h-60 overflow-y-auto">
          {filteredOptions.map(option => (
            <div key={String(option.value)} className="flex items-center p-2 hover:bg-gray-100">
              <Checkbox
                id={`$props.id || 'multiselect'-$option.value`}
                checked={selectedValues.includes(String(option.value))}
                onCheckedChange={() => handleChange(option)}
                disabled={option.disabled || disabled}
              />
              <Label htmlFor={`$props.id || 'multiselect'-$option.value`} className="ml-2">{option.label}</Label>
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className="p-2 text-center text-gray-500">No options found</div>
          )}
        </div>
      </div>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

/**
 * JSON editor component
 */
const JsonEditor = forwardRef<HTMLTextAreaElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, error, ...props }, ref) => {
    const [jsonError, setJsonError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      try {
        if (newValue.trim()) {
          JSON.parse(newValue);
          setJsonError(null);
        } else {
          setJsonError(null);
        }
      } catch (e) {
        setJsonError("Invalid JSON format");
      }

      if (onChange) {
        onChange(newValue);
      }
    };

    const jsonString = useMemo(() => {
      try {
        return JSON.stringify(value || {}, null, 2);
      } catch (e) {
        return '';
      }
    }, [value]);

    return (
      <div className="space-y-2">
        <Textarea
          ref={ref}
          className={`font-mono $className || ''`}
          value={jsonString}
          onChange={handleChange}
          disabled={disabled}
          rows={10}
          {...props}
        />
        {jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
JsonEditor.displayName = "JsonEditor";

/**
 * Color picker component
 */
const ColorPicker = forwardRef<HTMLInputElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, ...props }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <Input
          type="color"
          ref={ref}
          className={`w-12 h-12 p-1 $className || ''`}
          value={value || "#000000"}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <Input
          type="text"
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

/**
 * Date picker component
 */
const DatePicker = forwardRef<HTMLDivElement, FieldComponentProps>(
  ({ className, onChange, value, disabled, ...props }, ref) => {
    const [date, setDate] = useState<Date | undefined>(
      value instanceof Date ? value : value ? new Date(value) : undefined
    );

    const handleSelect = (newDate: Date | undefined) => {
      setDate(newDate);
      if (onChange) {
        onChange(newDate);
      }
    };

    return (
      <div ref={ref} className={className}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";

/**
 * Map of field types to components
 */
export const fieldComponentMap: Record<string, React.ComponentType<FieldComponentProps>> = {
  string: Input,
  number: NumberWithSlider,
  boolean: Switch,
  date: DatePicker,
  enum: RadioGroupComponent,
  relation: Select,
  text: Textarea,
  file: FileUpload,
  richtext: RichTextEditor,
  multiselect: MultiSelect,
  json: JsonEditor,
  color: ColorPicker,
  password: PasswordInput,
  email: EmailInput,
  url: UrlInput,
  phone: PhoneInput,
  checkbox: CheckboxGroup,
};

