/**
 * SPDX-License-Identifier: MIT
 */

"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Button } from "@repo/design-system/ui/button"
import { Input } from "@repo/design-system/ui/input"
import { Textarea } from "@repo/design-system/ui/textarea"
import { Label } from "@repo/design-system/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/design-system/ui/select"
import { Switch } from "@repo/design-system/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/design-system/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@repo/design-system/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design-system/ui/popover"
import { Calendar } from "@repo/design-system/ui/calendar"
import { format } from "date-fns"
import {
  Type,
  Hash,
  Mail,
  Lock,
  Upload,
  Phone,
  Link,
  ChevronDown,
  Square,
  CheckSquare,
  Circle,
  Calendar as CalendarIcon,
  Eye,
  Download,
  Edit2,
  Trash2,
  X,
  Copy,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react"
import { cn } from "@repo/design-system/lib/utils"

export interface FormComponent {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  description?: string
  visible?: boolean
  columnSpan?: number
  columnStart?: string
  htmlId?: string
  htmlName?: string
  htmlClass?: string
  showLabel?: boolean
  labelPosition?: string
  labelAlignment?: string
  variant?: string
  content?: string
  icon?: string
  value?: string
  checked?: boolean
}

// Component Library
interface ComponentLibraryProps {
  onAddComponent: (type: string, label: string) => void
}

function ComponentLibrary({ onAddComponent }: ComponentLibraryProps) {
  const componentCategories = [
    {
      title: "Typography",
      components: [{ type: "text-block", label: "Text block", icon: Type, description: "WYSIWYG Editor" }],
    },
    {
      title: "Input Fields",
      components: [
        { type: "text", label: "Text", icon: Type, description: "Single line text input" },
        { type: "textarea", label: "Text Area", icon: Type, description: "Multi-line text input" },
        { type: "number", label: "Number", icon: Hash, description: "Input field for numeric values" },
        { type: "email", label: "Email", icon: Mail, description: "Input field for email addresses" },
        { type: "password", label: "Password", icon: Lock, description: "Input field for passwords" },
        { type: "file", label: "File upload", icon: Upload, description: "Input field for file uploads" },
        { type: "tel", label: "Telephone", icon: Phone, description: "Input field for telephone numbers" },
        { type: "url", label: "URL", icon: Link, description: "Input field for URLs" },
        { type: "date", label: "Date Picker", icon: CalendarIcon, description: "Date selection input" },
      ],
    },
    {
      title: "Selection Fields",
      components: [
        { type: "select", label: "Select", icon: ChevronDown, description: "Dropdown select" },
        { type: "checkbox", label: "Checkbox", icon: Square, description: "Checkbox input" },
        { type: "checkbox-group", label: "Checkbox Group", icon: CheckSquare, description: "Group of checkboxes" },
        { type: "radio", label: "Radio Group", icon: Circle, description: "Group of radio buttons" },
        { type: "switch", label: "Switch", icon: Circle, description: "Toggle switch input" },
      ],
    },
    {
      title: "Actions",
      components: [
        { type: "button", label: "Button", icon: Square, description: "Generic button" },
        { type: "submit", label: "Submit Button", icon: CheckSquare, description: "Form submit button" },
        { type: "reset", label: "Reset Button", icon: Square, description: "Form reset button" },
      ],
    },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      {componentCategories.map((category) => (
        <div key={category.title} className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">{category.title}</h3>
          <div className="space-y-2">
            {category.components.map((comp) => (
              <button
                key={comp.type}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-50 border border-gray-200"
                onClick={() => onAddComponent(comp.type, comp.label)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "application/x-formbuilder",
                    JSON.stringify({ kind: "new", type: comp.type, label: comp.label }),
                  )
                }}
              >
                <comp.icon className="w-4 h-4 text-gray-600" />
                <div className="text-left">
                  <div className="text-sm font-medium">{comp.label}</div>
                  <div className="text-xs text-gray-500">{comp.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Form Preview
interface FormPreviewProps {
  /**
   * Form Preview
   */
  components: FormComponent[]
  selectedComponent: FormComponent | null
  onSelectComponent: (component: FormComponent) => void
  onUpdateComponent: (id: string, updates: Partial<FormComponent>) => void
  onRemoveComponent: (id: string) => void
  responsiveMode: "desktop" | "tablet" | "mobile"
}

function FormPreview({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onRemoveComponent,
  responsiveMode,
}: FormPreviewProps) {
  // Build rows for a simple 12-col grid. Two 6-span items share a row.
  const rows = useMemo(() => {
    const r: FormComponent[][] = []
    let buffer: FormComponent[] = []
    for (let i = 0; i < components.length; i++) {
      const c = components[i]
      const span = c.columnSpan ?? 12
      if (span === 6) {
        buffer.push(c)
        if (buffer.length === 2) {
          r.push(buffer)
          buffer = []
        }
      } else {
        if (buffer.length) {
          r.push(buffer)
          buffer = []
        }
        r.push([c])
      }
    }
    if (buffer.length) r.push(buffer)
    return r
  }, [components])
  const renderComponent = (component: FormComponent) => {
    const isSelected = selectedComponent?.id === component.id

    const baseClasses = cn(
      "mb-4 p-2 rounded border-2 transition-colors cursor-pointer relative group",
      isSelected ? "border-blue-500 bg-blue-50" : "border-transparent hover:border-gray-300",
    )

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation()
      onRemoveComponent(component.id)
    }

    const componentContent = (() => {
      switch (component.type) {
        case "text":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <Input className="mt-1" placeholder={component.placeholder} value={component.value || ""} readOnly />
            </>
          )

        case "textarea":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <Textarea className="mt-1" placeholder={component.placeholder} value={component.value || ""} readOnly />
            </>
          )

        case "email":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <Input type="email" className="mt-1" placeholder={component.placeholder} value={component.value || ""} readOnly />
            </>
          )

        case "select":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <Select defaultValue={component.value}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {component.options?.map((option, index) => (
                    <SelectItem key={index} value={option.toLowerCase()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )

        case "date":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <div className="mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !component.value && "text-muted-foreground",
                      )}
                    >
                      {component.value ? (
                        (() => {
                          const d = new Date(component.value)
                          return isNaN(d.getTime()) ? component.value : format(d, "PPP")
                        })()
                      ) : (
                        <span>{component.placeholder || "Pick a date"}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={component.value ? new Date(component.value) : undefined}
                      onSelect={(date: Date | undefined) =>
                        onUpdateComponent(component.id, {
                          value: date ? format(date, "yyyy-MM-dd") : "",
                        })
                      }
                      disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )

        case "switch":
          return (
            <>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{component.label}</Label>
                <Switch checked={component.checked || false} />
              </div>
            </>
          )

        case "button":
          return (
            <>
              <Button variant={(component.variant as any) || "outline"} className="w-full bg-transparent">
                {component.content || component.label}
              </Button>
            </>
          )

        case "submit":
          return (
            <>
              <Button variant={(component.variant as any) || "default"} className="w-full bg-black hover:bg-gray-800">
                {component.content || component.label}
              </Button>
            </>
          )

        case "reset":
          return (
            <>
              <Button variant={(component.variant as any) || "outline"} className="w-full bg-transparent">
                {component.content || component.label}
              </Button>
            </>
          )

        case "number":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <Input type="number" className="mt-1" placeholder={component.placeholder} value={component.value || ""} readOnly />
            </>
          )

        case "password":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <Input type="password" className="mt-1" placeholder={component.placeholder} value={component.value || ""} readOnly />
            </>
          )

        case "file":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <Input type="file" className="mt-1" />
            </>
          )

        case "tel":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <Input type="tel" className="mt-1" placeholder={component.placeholder} value={component.value || ""} readOnly />
            </>
          )

        case "url":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <Input type="url" className="mt-1" placeholder={component.placeholder} value={component.value || ""} readOnly />
            </>
          )

        case "checkbox":
          return (
            <>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4" checked={component.checked || false} readOnly />
                <Label className="text-sm font-medium">{component.label}</Label>
              </div>
            </>
          )

        case "checkbox-group":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <div className="space-y-2 mt-1">
                {(component.options || ["Option 1", "Option 2"]).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <Label className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </>
          )

        case "radio":
          return (
            <>
              <Label className="text-sm font-medium">{component.label}</Label>
              <div className="space-y-2 mt-1">
                {(component.options || ["Option 1", "Option 2"]).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input type="radio" name={`radio-${component.id}`} className="w-4 h-4" />
                    <Label className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </>
          )

        case "text-block":
          return (
            <>
              <div className="prose prose-sm max-w-none">
                <div
                  className="min-h-[100px] p-3 border border-gray-200 rounded bg-gray-50 text-gray-600"
                  contentEditable
                  suppressContentEditableWarning={true}
                >
                  {component.content || "Click to edit text..."}
                </div>
              </div>
            </>
          )

        default:
          return null
      }
    })()

    return (
      <div
        key={component.id}
        className={baseClasses}
        onClick={() => onSelectComponent(component)}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData(
            "application/x-formbuilder",
            JSON.stringify({ kind: "move", id: component.id }),
          )
        }}
      >
        {componentContent}
        {component.description ? (
          <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 hover:bg-red-100 hover:text-red-600"
          onClick={handleDelete}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  const previewWidth =
    responsiveMode === "mobile"
      ? "w-[375px] max-w-full"
      : responsiveMode === "tablet"
        ? "w-[768px] max-w-full"
        : "max-w-2xl w-full"

  return (
    <div
      className="flex-1 bg-gray-50 p-8"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        // Dropping on empty canvas appends to end
        const data = e.dataTransfer.getData("application/x-formbuilder")
        if (!data) return
        try {
          const payload = JSON.parse(data) as
            | { kind: "new"; type: string; label: string }
            | { kind: "move"; id: string }
          ;(window as any).__formbuilder_onCanvasDrop?.(payload)
        } catch {}
      }}
    >
      <div className={cn("mx-auto bg-white rounded-lg shadow-sm p-6", previewWidth)}>
        <div className="space-y-4">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-12 gap-4">
              {row.map((c) => (
                <div
                  key={c.id}
                  className={cn("col-span-12", (c.columnSpan ?? 12) === 6 && "col-span-6")}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const data = e.dataTransfer.getData("application/x-formbuilder")
                    if (!data) return
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                    let position: "before" | "after"
                    if ((c.columnSpan ?? 12) === 12) {
                      // Full-width: use vertical position for intuitive up/down reordering
                      const y = e.clientY
                      position = y - rect.top < rect.height / 2 ? "before" : "after"
                    } else {
                      // Half-width: use horizontal position to decide left/right insertion
                      const x = e.clientX
                      position = x - rect.left < rect.width / 2 ? "before" : "after"
                    }
                    try {
                      const payload = JSON.parse(data) as
                        | { kind: "new"; type: string; label: string }
                        | { kind: "move"; id: string }
                      ;(window as any).__formbuilder_onDropOnTarget?.(payload, c.id, position)
                    } catch {}
                  }}
                >
                  {renderComponent(c)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Properties Panel
interface PropertiesPanelProps {
  selectedComponent: FormComponent | null
  onUpdateComponent: (id: string, updates: Partial<FormComponent>) => void
}

function PropertiesPanel({ selectedComponent, onUpdateComponent }: PropertiesPanelProps) {
  type OpenSections = {
    input: boolean
    labelDescription: boolean
    appearance: boolean
    htmlAttributes: boolean
    validation: boolean
  }

  const [openSections, setOpenSections] = useState<OpenSections>({
    input: true,
    labelDescription: true,
    appearance: true,
    htmlAttributes: false,
    validation: false,
  })

  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-8">
          <p className="text-sm">Select a component to configure its properties</p>
        </div>
      </div>
    )
  }

  const isButtonType = ["button", "submit", "reset"].includes(selectedComponent.type)

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-semibold text-lg mb-4">Properties</h3>

      <div className="space-y-4">
        {/* Input Section */}
        <Collapsible open={openSections.input} onOpenChange={() => toggleSection("input")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Input</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.input ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            {isButtonType && (
              <>
                <div>
                  <Label htmlFor="content" className="text-sm font-medium">
                    Content
                  </Label>
                  <Input
                    id="content"
                    value={selectedComponent.content || ""}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, { content: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="variant" className="text-sm font-medium">
                    Variant
                  </Label>
                  <Select
                    value={selectedComponent.variant || "default"}
                    onValueChange={(value) => onUpdateComponent(selectedComponent.id, { variant: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="ghost">Ghost</SelectItem>
                      <SelectItem value="destructive">Destructive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedComponent.type === "text-block" && (
              <div>
                <Label htmlFor="content" className="text-sm font-medium">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={selectedComponent.content || ""}
                  onChange={(e) => onUpdateComponent(selectedComponent.id, { content: e.target.value })}
                  className="mt-1"
                  rows={4}
                  placeholder="Enter your text content here..."
                />
              </div>
            )}

            {!isButtonType && (
              <>
                <div>
                  <Label htmlFor="value" className="text-sm font-medium">
                    Value
                  </Label>
                  <Input
                    id="value"
                    value={selectedComponent.value || ""}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, { value: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="placeholder" className="text-sm font-medium">
                    Placeholder
                  </Label>
                  <Input
                    id="placeholder"
                    value={selectedComponent.placeholder || ""}
                    onChange={(e) => onUpdateComponent(selectedComponent.id, { placeholder: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={selectedComponent.description || ""}
                onChange={(e) => onUpdateComponent(selectedComponent.id, { description: e.target.value })}
                className="mt-1"
                rows={2}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Label & Description Section */}
        {!isButtonType && (
          <Collapsible open={openSections.labelDescription} onOpenChange={() => toggleSection("labelDescription")}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
              <span className="font-medium">Label & Description</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSections.labelDescription ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-2">
              <div>
                <Label htmlFor="label" className="text-sm font-medium">
                  Label
                </Label>
                <Input
                  id="label"
                  value={selectedComponent.label}
                  onChange={(e) => onUpdateComponent(selectedComponent.id, { label: e.target.value })}
                  className="mt-1"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Appearance Section */}
        <Collapsible open={openSections.appearance} onOpenChange={() => toggleSection("appearance")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Appearance</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.appearance ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            <div>
              <Label htmlFor="width" className="text-sm font-medium">
                Width
              </Label>
              <Select
                value={(selectedComponent.columnSpan ?? 12) === 6 ? "half" : "full"}
                onValueChange={(value) =>
                  onUpdateComponent(selectedComponent.id, { columnSpan: value === "half" ? 6 : 12 })
                }
              >
                <SelectTrigger id="width" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full (100%)</SelectItem>
                  <SelectItem value="half">Half (50%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Validation Section */}
        <Collapsible open={openSections.validation} onOpenChange={() => toggleSection("validation")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
            <span className="font-medium">Validation</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.validation ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="required" className="text-sm font-medium">
                Required
              </Label>
              <Switch
                id="required"
                checked={selectedComponent.required || false}
                onCheckedChange={(checked) => onUpdateComponent(selectedComponent.id, { required: checked })}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {selectedComponent.type === "select" && (
          <div>
            <Label htmlFor="options" className="text-sm font-medium">
              Options (one per line)
            </Label>
            <Textarea
              id="options"
              value={selectedComponent.options?.join("\n") || ""}
              onChange={(e) =>
                onUpdateComponent(selectedComponent.id, {
                  options: e.target.value.split("\n").filter((option) => option.trim()),
                })
              }
              className="mt-1"
              rows={4}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Export Dialog
interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  components: FormComponent[]
  fileName: string
}

function ExportDialog({ isOpen, onClose, components, fileName }: ExportDialogProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const getRequiredComponents = () => {
    const componentTypes = new Set(components.map((comp) => comp.type))
    const requiredComponents = []

    if (
      componentTypes.has("text") ||
      componentTypes.has("email") ||
      componentTypes.has("password") ||
      componentTypes.has("tel") ||
      componentTypes.has("url") ||
      componentTypes.has("number") ||
      componentTypes.has("file")
    ) {
      requiredComponents.push("input")
    }

    if (componentTypes.has("textarea")) {
      requiredComponents.push("textarea")
    }

    if (componentTypes.has("select")) {
      requiredComponents.push("select")
    }

    if (componentTypes.has("button") || componentTypes.has("submit") || componentTypes.has("reset")) {
      requiredComponents.push("button")
    }

    if (componentTypes.has("date")) {
      requiredComponents.push("calendar", "popover")
    }

    if (componentTypes.has("switch")) {
      requiredComponents.push("switch")
    }

    if (componentTypes.has("checkbox") || componentTypes.has("checkbox-group")) {
      requiredComponents.push("checkbox")
    }

    if (componentTypes.has("radio")) {
      requiredComponents.push("radio-group")
    }

    if (components.length > 0) {
      requiredComponents.push("form", "label")
    }

    return requiredComponents.join(" ")
  }

  const generateReactCode = () => {
    const imports = [
      `"use client";`,
      ``,
      `import { Button } from "@/components/ui/button";`,
      `import { Input } from "@/components/ui/input";`,
      `import { Label } from "@/components/ui/label";`,
    ]

    const componentCode = `export default function ${fileName.charAt(0).toUpperCase() + fileName.slice(1)}() {
  return (
    <form className="space-y-6 max-w-md mx-auto p-6">
${components
  .map((comp) => {
    if (["button", "submit", "reset"].includes(comp.type)) {
      return `      <Button type="${comp.type}" variant="${comp.variant || "default"}" className="w-full">
        ${comp.content || comp.label}
      </Button>`
    }

    return `      <div>
        <Label htmlFor="${comp.id}">${comp.label}</Label>
        <Input
          id="${comp.id}"
          type="${comp.type}"
          placeholder="${comp.placeholder || ""}"
          ${comp.required ? "required" : ""}
          className="mt-1"
        />
      </div>`
  })
  .join("\n")}
    </form>
  );
}`

    return [...imports, "", componentCode].join("\n")
  }

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const installCommand = `npx shadcn@latest add ${getRequiredComponents()}`
  const reactCode = generateReactCode()
  const componentName = `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`
  const usageCode = `import ${componentName} from "./${fileName}"\n\n<${componentName} />`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Export Form</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">1. Required shadcn/ui components:</h3>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(installCommand, "install")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
              <div>{installCommand}</div>
            </div>
            {copiedSection === "install" && <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">2. React Code</h3>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(reactCode, "react")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{reactCode}</pre>
            </div>
            {copiedSection === "react" && <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">3. Usage</h3>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(usageCode, "usage")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
              <pre className="whitespace-pre-wrap">{usageCode}</pre>
            </div>
            {copiedSection === "usage" && <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Preview Dialog
interface PreviewDialogProps {
  isOpen: boolean
  onClose: () => void
  components: FormComponent[]
  fileName: string
}

function PreviewDialog({ isOpen, onClose, components, fileName }: PreviewDialogProps) {
  const visibleComponents = useMemo(() => components.filter((comp) => comp.visible !== false), [components])
  const rows = useMemo(() => {
    const r: FormComponent[][] = []
    let buffer: FormComponent[] = []
    for (let i = 0; i < visibleComponents.length; i++) {
      const c = visibleComponents[i]
      const span = c.columnSpan ?? 12
      if (span === 6) {
        buffer.push(c)
        if (buffer.length === 2) {
          r.push(buffer)
          buffer = []
        }
      } else {
        if (buffer.length) {
          r.push(buffer)
          buffer = []
        }
        r.push([c])
      }
    }
    if (buffer.length) r.push(buffer)
    return r
  }, [visibleComponents])
  const renderPreviewComponent = (component: FormComponent) => {
    if (!component.visible) return null

    switch (component.type) {
      case "text":
      case "email":
      case "number":
      case "password":
      case "tel":
      case "url":
        return (
          <div key={component.id} className="mb-4">
            <Label className="text-sm font-medium">{component.label}</Label>
            <Input
              type={component.type}
              className="mt-1"
              placeholder={component.placeholder}
              value={component.value || ""}
              readOnly
            />
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      case "textarea":
        return (
          <div key={component.id} className="mb-4">
            <Label className="text-sm font-medium">{component.label}</Label>
            <Textarea className="mt-1" placeholder={component.placeholder} value={component.value || ""} readOnly />
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      case "select":
        return (
          <div key={component.id} className="mb-4">
            <Label className="text-sm font-medium">{component.label}</Label>
            <Select defaultValue={component.value}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {component.options?.map((option, index) => (
                  <SelectItem key={index} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      case "date":
        return (
          <div key={component.id} className="mb-4">
            <Label className="text-sm font-medium">{component.label}</Label>
            <div className="mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !component.value && "text-muted-foreground",
                    )}
                  >
                    {component.value ? (
                      (() => {
                        const d = new Date(component.value)
                        return isNaN(d.getTime()) ? component.value : format(d, "PPP")
                      })()
                    ) : (
                      <span>{component.placeholder || "Pick a date"}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={component.value ? new Date(component.value) : undefined}
                    disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      case "file":
        return (
          <div key={component.id} className="mb-4">
            <Label className="text-sm font-medium">{component.label}</Label>
            <Input type="file" className="mt-1" />
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      case "checkbox":
        return (
          <div key={component.id} className="mb-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4" checked={component.checked || false} readOnly />
              <Label className="text-sm font-medium">{component.label}</Label>
            </div>
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      case "checkbox-group":
        return (
          <div key={component.id} className="mb-4">
            <Label className="text-sm font-medium">{component.label}</Label>
            <div className="mt-1 space-y-2">
              {(component.options || ["Option 1", "Option 2"]).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="checkbox" className="h-4 w-4" readOnly />
                  <Label className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      case "radio":
        return (
          <div key={component.id} className="mb-4">
            <Label className="text-sm font-medium">{component.label}</Label>
            <div className="mt-1 space-y-2">
              {(component.options || ["Option 1", "Option 2"]).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="radio" name={`preview-radio-${component.id}`} className="h-4 w-4" readOnly />
                  <Label className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      case "switch":
        return (
          <div key={component.id} className="mb-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">{component.label}</Label>
              <Switch checked={component.checked || false} />
            </div>
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      case "text-block":
        return (
          <div key={component.id} className="mb-4">
            <div className="prose prose-sm max-w-none">
              <div className="min-h-[100px] rounded border border-gray-200 bg-gray-50 p-3 text-gray-600" contentEditable suppressContentEditableWarning>
                {component.content || "Click to edit text..."}
              </div>
            </div>
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      case "button":
      case "submit":
      case "reset":
        return (
          <div key={component.id} className="mb-4">
            <Button
              type={component.type as any}
              variant={(component.variant as any) || (component.type === "submit" ? "default" : "outline")}
              className="w-full"
            >
              {component.content || component.label}
            </Button>
            {component.description ? (
              <p className="mt-1 text-gray-500 text-sm">{component.description}</p>
            ) : null}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Preview: {fileName}</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="bg-white p-6 rounded-lg border">
          <form className="space-y-4">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-12 gap-4">
                {row.map((c) => (
                  <div key={c.id} className={cn("col-span-12", (c.columnSpan ?? 12) === 6 && "col-span-6")}>
                    {renderPreviewComponent(c)}
                  </div>
                ))}
              </div>
            ))}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Main Form Builder Component
export default function FormBuilder() {
  const [fileName, setFileName] = useState("generatedForm")
  const [isEditingFileName, setIsEditingFileName] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const [formComponents, setFormComponents] = useState<FormComponent[]>([
    {
      id: "1",
      type: "text",
      label: "Text",
      visible: true,
      columnSpan: 12,
      columnStart: "Auto",
      showLabel: true,
      labelPosition: "Top",
      labelAlignment: "left",
    },
    {
      id: "2",
      type: "email",
      label: "Email",
      visible: true,
      columnSpan: 12,
      columnStart: "Auto",
      showLabel: true,
      labelPosition: "Top",
      labelAlignment: "left",
    },
    {
      id: "3",
      type: "submit",
      label: "Submit",
      content: "Submit",
      variant: "default",
      visible: true,
      columnSpan: 12,
      columnStart: "Auto",
    },
  ])
  const [selectedComponent, setSelectedComponent] = useState<FormComponent | null>(null)

  const addComponent = (type: string, label: string) => {
    const newComponent: FormComponent = {
      id: Date.now().toString(),
      type,
      label,
      placeholder: type === "date" ? "Pick a date" : undefined,
      visible: true,
      columnSpan: 12,
      columnStart: "Auto",
      showLabel: type !== "text-block",
      labelPosition: "Top",
      labelAlignment: "left",
      variant: type === "submit" ? "default" : "outline",
      content:
        type === "button" || type === "submit" || type === "reset"
          ? label
          : type === "text-block"
            ? "This is a text block. Click to edit in the properties panel."
            : undefined,
    }
    setFormComponents([...formComponents, newComponent])
  }

  const updateComponent = (id: string, updates: Partial<FormComponent>) => {
    setFormComponents(formComponents.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp)))
    if (selectedComponent?.id === id) {
      setSelectedComponent({ ...selectedComponent, ...updates })
    }
  }

  const removeComponent = (id: string) => {
    setFormComponents(formComponents.filter((comp) => comp.id !== id))
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
  }

  const handleFileNameSave = () => {
    setIsEditingFileName(false)
  }

  const handleFileNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFileNameSave()
    }
  }

  const [responsiveMode, setResponsiveMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

  // Drag-and-drop helpers exposed to FormPreview via window callbacks
  // This avoids prop-drilling many handlers in this single-file component.
  ;(window as any).__formbuilder_onDropOnTarget = (
    payload: { kind: "new"; type: string; label: string } | { kind: "move"; id: string },
    targetId: string,
    position: "before" | "after",
  ) => {
    // If payload is new and target is full width, split the row into two 6-span items.
    if ((payload as any).kind === "new") {
      const target = formComponents.find((c) => c.id === targetId)
      if (!target) return
      const newComponent: FormComponent = {
        id: Date.now().toString(),
        type: (payload as any).type,
        label: (payload as any).label,
        placeholder: (payload as any).type === "date" ? "Pick a date" : undefined,
        visible: true,
        columnSpan: (target.columnSpan ?? 12) === 12 ? 6 : 12,
        columnStart: "Auto",
        showLabel: (payload as any).type !== "text-block",
        labelPosition: "Top",
        labelAlignment: "left",
        variant: (payload as any).type === "submit" ? "default" : "outline",
        content:
          (payload as any).type === "button" || (payload as any).type === "submit" || (payload as any).type === "reset"
            ? (payload as any).label
            : (payload as any).type === "text-block"
              ? "This is a text block. Click to edit in the properties panel."
              : undefined,
      }

      const updated = [...formComponents]
      const tIdx = updated.findIndex((c) => c.id === targetId)
      if (tIdx === -1) return

      // If target is full width, set both to 6 and insert next to target.
      if ((updated[tIdx].columnSpan ?? 12) === 12) {
        updated[tIdx] = { ...updated[tIdx], columnSpan: 6 }
        const insertIdx = position === "after" ? tIdx + 1 : tIdx
        updated.splice(insertIdx === tIdx ? tIdx : insertIdx, 0, newComponent)
      } else {
        // Target already half width: just insert before/after with half width
        newComponent.columnSpan = 6
        const insertIdx = position === "after" ? tIdx + 1 : tIdx
        updated.splice(insertIdx, 0, newComponent)
      }
      setFormComponents(updated)
      return
    }

    // Move existing component
    const movingId = (payload as any).id as string
    if (!movingId || movingId === targetId) return
    const updated = [...formComponents]
    const fromIdx = updated.findIndex((c) => c.id === movingId)
    const originalToIdx = updated.findIndex((c) => c.id === targetId)
    if (fromIdx === -1 || originalToIdx === -1) return
    const [moved] = updated.splice(fromIdx, 1)

    // Target index after removal shift
    const baseToIdx = originalToIdx - (fromIdx < originalToIdx ? 1 : 0)

    // If dropping onto a full-width target and moved is full width, split into halves
    if ((updated[baseToIdx].columnSpan ?? 12) === 12 && (moved.columnSpan ?? 12) === 12) {
      updated[baseToIdx] = { ...updated[baseToIdx], columnSpan: 6 }
      moved.columnSpan = 6
    }

    const insertIdx = position === "after" ? baseToIdx + 1 : baseToIdx
    updated.splice(insertIdx, 0, moved)
    setFormComponents(updated)
  }

  ;(window as any).__formbuilder_onCanvasDrop = (
    payload: { kind: "new"; type: string; label: string } | { kind: "move"; id: string },
  ) => {
    if ((payload as any).kind === "new") {
      addComponent((payload as any).type, (payload as any).label)
      return
    }
    // Move to end
    const movingId = (payload as any).id as string
    const updated = [...formComponents]
    const fromIdx = updated.findIndex((c) => c.id === movingId)
    if (fromIdx === -1) return
    const [moved] = updated.splice(fromIdx, 1)
    updated.push(moved)
    setFormComponents(updated)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="relative bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <div className="w-3 h-3 border border-white rounded-sm"></div>
            </div>
            <span className="font-semibold">shadcn/Form Builder</span>
          </div>
        </div>

        {/* Centered file name */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {isEditingFileName ? (
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onBlur={handleFileNameSave}
              onKeyPress={handleFileNameKeyPress}
              className="text-sm w-44 text-center"
              autoFocus
            />
          ) : (
            <span
              className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 flex items-center gap-1"
              onClick={() => setIsEditingFileName(true)}
            >
              {fileName}.tsx
              <Edit2 className="w-3 h-3" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 ml-4">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => setIsPreviewMode(true)}>
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            {/* Responsive mode controls */}
            <div className="ml-1 flex items-center rounded-md border border-gray-200 overflow-hidden">
              <Button
                variant={responsiveMode === "desktop" ? "default" : "outline"}
                size="icon"
                className={cn("h-8 w-8", responsiveMode === "desktop" ? "bg-black text-white" : "bg-transparent")}
                onClick={() => setResponsiveMode("desktop")}
                aria-label="Desktop"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={responsiveMode === "tablet" ? "default" : "outline"}
                size="icon"
                className={cn("h-8 w-8", responsiveMode === "tablet" ? "bg-black text-white" : "bg-transparent")}
                onClick={() => setResponsiveMode("tablet")}
                aria-label="Tablet"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={responsiveMode === "mobile" ? "default" : "outline"}
                size="icon"
                className={cn("h-8 w-8", responsiveMode === "mobile" ? "bg-black text-white" : "bg-transparent")}
                onClick={() => setResponsiveMode("mobile")}
                aria-label="Mobile"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" className="gap-2 bg-black hover:bg-gray-800" onClick={() => setShowExportDialog(true)}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <ComponentLibrary onAddComponent={addComponent} />
        <FormPreview
          components={formComponents}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          onUpdateComponent={updateComponent}
          onRemoveComponent={removeComponent}
          responsiveMode={responsiveMode}
        />
        <PropertiesPanel selectedComponent={selectedComponent} onUpdateComponent={updateComponent} />
      </div>

      {/* Dialogs */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        components={formComponents}
        fileName={fileName}
      />

      <PreviewDialog
        isOpen={isPreviewMode}
        onClose={() => setIsPreviewMode(false)}
        components={formComponents}
        fileName={fileName}
      />
    </div>
  )
}
