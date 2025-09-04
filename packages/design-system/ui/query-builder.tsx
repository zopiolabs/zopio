/**
 * SPDX-License-Identifier: MIT
 */

"use client"

import { useState } from "react"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Checkbox } from "./checkbox"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Label } from "./label"
import { cn } from "../lib/utils"
import { CalendarIcon, ClockIcon, Plus, X } from "lucide-react"
import { Textarea } from "./textarea"
import { Switch } from "./switch"
import { Button } from "./button"

type FieldType =
  | "text"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "multiselect"
  | "date"
  | "datetime"
  | "time"
  | "field"
type Operator = "=" | "between" | "in" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "starts_with" | "ends_with"

interface Rule {
  id: string
  fieldType: FieldType
  operator: Operator
  value: any
}

interface Group {
  id: string
  type: "group"
  logicalOperator: "AND" | "OR"
  isNot: boolean
  children: (Rule | Group)[]
}

type QueryItem = Rule | Group

interface QueryBuilderProps {
  initialItems?: QueryItem[]
  initialLogicalOperator?: "AND" | "OR"
  initialIsNot?: boolean
  selectOptions?: string[]
  multiselectOptions?: string[]
  fieldOptions?: string[]
  onQueryChange?: (items: QueryItem[], logicalOperator: "AND" | "OR", isNot: boolean) => void
  className?: string
}

const fieldTypes: { value: FieldType; label: string }[] = [
  { value: "text", label: "text" },
  { value: "select", label: "select" },
  { value: "checkbox", label: "checkbox" },
  { value: "radio", label: "radio" },
  { value: "textarea", label: "textarea" },
  { value: "multiselect", label: "multiselect" },
  { value: "date", label: "date" },
  { value: "datetime", label: "datetime-local" },
  { value: "time", label: "time" },
  { value: "field", label: "field" },
]

const operators: { value: Operator; label: string }[] = [
  { value: "=", label: "=" },
  { value: "between", label: "between" },
  { value: "in", label: "in" },
  { value: "!=", label: "!=" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
  { value: ">=", label: ">=" },
  { value: "<=", label: "<=" },
  { value: "contains", label: "contains" },
  { value: "starts_with", label: "starts with" },
  { value: "ends_with", label: "ends with" },
]

const defaultSelectOptions = ["Option 1", "Option 2", "Option 3", "Option 4"]
const defaultMultiselectOptions = ["option1", "option2", "option3"]
const defaultFieldOptions = ["field", "name", "email", "status"]

export function QueryBuilder({
  initialItems = [{ id: "1", fieldType: "text", operator: "=", value: "" }],
  initialLogicalOperator = "AND",
  initialIsNot = false,
  selectOptions = defaultSelectOptions,
  multiselectOptions = defaultMultiselectOptions,
  fieldOptions = defaultFieldOptions,
  onQueryChange,
  className,
}: QueryBuilderProps) {
  const [logicalOperator, setLogicalOperator] = useState<"AND" | "OR">(initialLogicalOperator)
  const [isNot, setIsNot] = useState(initialIsNot)
  const [items, setItems] = useState<QueryItem[]>(initialItems)

  const handleQueryChange = (newItems: QueryItem[], newLogicalOperator?: "AND" | "OR", newIsNot?: boolean) => {
    const updatedLogicalOperator = newLogicalOperator ?? logicalOperator
    const updatedIsNot = newIsNot ?? isNot

    if (onQueryChange) {
      onQueryChange(newItems, updatedLogicalOperator, updatedIsNot)
    }
  }

  const addRule = () => {
    const newRule: Rule = {
      id: Date.now().toString(),
      fieldType: "text",
      operator: "=",
      value: "",
    }
    const newItems = [...items, newRule]
    setItems(newItems)
    handleQueryChange(newItems)
  }

  const addGroup = () => {
    const newGroup: Group = {
      id: Date.now().toString(),
      type: "group",
      logicalOperator: "AND",
      isNot: false,
      children: [
        {
          id: (Date.now() + 1).toString(),
          fieldType: "text",
          operator: "=",
          value: "",
        },
      ],
    }
    const newItems = [...items, newGroup]
    setItems(newItems)
    handleQueryChange(newItems)
  }

  const removeItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id)
    setItems(newItems)
    handleQueryChange(newItems)
  }

  const updateItem = (id: string, updates: Partial<Rule | Group>) => {
    const newItems = items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    setItems(newItems)
    handleQueryChange(newItems)
  }

  const addRuleToGroup = (groupId: string) => {
    const newRule: Rule = {
      id: Date.now().toString(),
      fieldType: "text",
      operator: "=",
      value: "",
    }

    const newItems = items.map((item) => {
      if (item.id === groupId && "type" in item && item.type === "group") {
        return {
          ...item,
          children: [...item.children, newRule],
        }
      }
      return item
    })

    setItems(newItems)
    handleQueryChange(newItems)
  }

  const removeRuleFromGroup = (groupId: string, ruleId: string) => {
    const newItems = items.map((item) => {
      if (item.id === groupId && "type" in item && item.type === "group") {
        return {
          ...item,
          children: item.children.filter((child) => child.id !== ruleId),
        }
      }
      return item
    })

    setItems(newItems)
    handleQueryChange(newItems)
  }

  const updateRuleInGroup = (groupId: string, ruleId: string, updates: Partial<Rule>) => {
    const newItems = items.map((item) => {
      if (item.id === groupId && "type" in item && item.type === "group") {
        return {
          ...item,
          children: item.children.map((child) => (child.id === ruleId ? { ...child, ...updates } : child)),
        }
      }
      return item
    })

    setItems(newItems)
    handleQueryChange(newItems)
  }

  const renderValueInput = (rule: Rule) => {
    switch (rule.fieldType) {
      case "text":
        if (rule.operator === "between") {
          return (
            <div className="flex gap-2">
              <Input
                value={rule.value?.from || ""}
                onChange={(e) =>
                  updateItem(rule.id, {
                    value: { ...rule.value, from: e.target.value },
                  })
                }
                className="w-20"
              />
              <Input
                value={rule.value?.to || ""}
                onChange={(e) =>
                  updateItem(rule.id, {
                    value: { ...rule.value, to: e.target.value },
                  })
                }
                className="w-20"
              />
            </div>
          )
        }
        return (
          <Input
            value={rule.value || ""}
            onChange={(e) => updateItem(rule.id, { value: e.target.value })}
            className="w-32"
          />
        )

      case "select":
        if (rule.operator === "between") {
          return (
            <div className="flex gap-2">
              <Select
                value={rule.value?.from}
                onValueChange={(value) => updateItem(rule.id, { value: { ...rule.value, from: value } })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={rule.value?.to}
                onValueChange={(value) => updateItem(rule.id, { value: { ...rule.value, to: value } })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        }
        return (
          <Select value={rule.value} onValueChange={(value) => updateItem(rule.id, { value })}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return <Checkbox checked={rule.value} onCheckedChange={(checked) => updateItem(rule.id, { value: checked })} />

      case "radio":
        return (
          <RadioGroup
            value={rule.value}
            onValueChange={(value) => updateItem(rule.id, { value })}
            className="flex gap-4"
          >
            {["Default", "Option A", "Option B", "Option C"].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${rule.id}-${index}`} />
                <Label htmlFor={`${rule.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "textarea":
        return (
          <Textarea
            value={rule.value || ""}
            onChange={(e) => updateItem(rule.id, { value: e.target.value })}
            className="w-64 h-20"
          />
        )

      case "multiselect":
        return (
          <div className="flex gap-2 flex-wrap">
            {multiselectOptions.map((option) => (
              <div
                key={option}
                className={cn(
                  "px-3 py-1 rounded-md text-sm border cursor-pointer transition-colors",
                  rule.value?.includes(option)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border",
                )}
                onClick={() => {
                  const currentValues = rule.value || []
                  const newValues = currentValues.includes(option)
                    ? currentValues.filter((v: string) => v !== option)
                    : [...currentValues, option]
                  updateItem(rule.id, { value: newValues })
                }}
              >
                {option}
                {rule.value?.includes(option) && <X className="h-3 w-3 ml-1 inline" />}
              </div>
            ))}
          </div>
        )

      case "date":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={rule.value || ""}
              onChange={(e) => updateItem(rule.id, { value: e.target.value })}
              className="w-40"
            />
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )

      case "datetime":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="datetime-local"
              value={rule.value || ""}
              onChange={(e) => updateItem(rule.id, { value: e.target.value })}
              className="w-48"
            />
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )

      case "time":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={rule.value || ""}
              onChange={(e) => updateItem(rule.id, { value: e.target.value })}
              className="w-32"
            />
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )

      case "field":
        return (
          <div className="flex gap-2">
            <Select
              value={rule.value?.field}
              onValueChange={(value) => updateItem(rule.id, { value: { ...rule.value, field: value } })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={rule.value?.comparison}
              onValueChange={(value) => updateItem(rule.id, { value: { ...rule.value, comparison: value } })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">text</SelectItem>
                <SelectItem value="number">number</SelectItem>
                <SelectItem value="date">date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      default:
        return null
    }
  }

  const renderGroup = (group: Group) => {
    return (
      <div key={group.id} className="border-l-2 border-primary/20 pl-4 ml-4 space-y-3">
        <div className="flex items-center gap-3 p-2 bg-primary/5 rounded-md">
          <Select
            value={group.logicalOperator}
            onValueChange={(value: "AND" | "OR") => updateItem(group.id, { logicalOperator: value })}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Switch checked={group.isNot} onCheckedChange={(checked) => updateItem(group.id, { isNot: checked })} />
            <span className="text-sm">Not</span>
          </div>

          <Button variant="outline" size="sm" onClick={() => addRuleToGroup(group.id)}>
            <Plus className="h-4 w-4 mr-1" />
            Rule
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(group.id)}
            className="text-muted-foreground hover:text-destructive ml-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {group.children.map((child, index) => (
          <div key={child.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
            <span className="text-sm text-muted-foreground w-4">{index + 1}</span>

            {'fieldType' in child && (
              <Select
                value={child.fieldType}
                onValueChange={(value: FieldType) => updateRuleInGroup(group.id, child.id, { fieldType: value })}
              >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>
            )}

            {'operator' in child && (
              <Select
                value={child.operator}
                onValueChange={(value: Operator) => updateRuleInGroup(group.id, child.id, { operator: value })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {'operator' in child && (
              <div className="flex-1">{renderValueInputForGroup(child as Rule, group.id)}</div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeRuleFromGroup(group.id, child.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    )
  }

  const renderValueInputForGroup = (rule: Rule, groupId: string) => {
    const updateRuleValue = (updates: Partial<Rule>) => {
      updateRuleInGroup(groupId, rule.id, updates)
    }

    switch (rule.fieldType) {
      case "text":
        if (rule.operator === "between") {
          return (
            <div className="flex gap-2">
              <Input
                value={rule.value?.from || ""}
                onChange={(e) =>
                  updateRuleValue({
                    value: { ...rule.value, from: e.target.value },
                  })
                }
                className="w-20"
              />
              <Input
                value={rule.value?.to || ""}
                onChange={(e) =>
                  updateRuleValue({
                    value: { ...rule.value, to: e.target.value },
                  })
                }
                className="w-20"
              />
            </div>
          )
        }
        return (
          <Input
            value={rule.value || ""}
            onChange={(e) => updateRuleValue({ value: e.target.value })}
            className="w-32"
          />
        )

      case "select":
        if (rule.operator === "between") {
          return (
            <div className="flex gap-2">
              <Select
                value={rule.value?.from}
                onValueChange={(value) => updateRuleValue({ value: { ...rule.value, from: value } })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={rule.value?.to}
                onValueChange={(value) => updateRuleValue({ value: { ...rule.value, to: value } })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        }
        return (
          <Select value={rule.value} onValueChange={(value) => updateRuleValue({ value })}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return <Checkbox checked={rule.value} onCheckedChange={(checked) => updateRuleValue({ value: checked })} />

      case "textarea":
        return (
          <Textarea
            value={rule.value || ""}
            onChange={(e) => updateRuleValue({ value: e.target.value })}
            className="w-64 h-20"
          />
        )

      case "radio":
        return (
          <RadioGroup value={rule.value} onValueChange={(value) => updateRuleValue({ value })} className="flex gap-4">
            {["Default", "Option A", "Option B", "Option C"].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${groupId}-${rule.id}-${index}`} />
                <Label htmlFor={`${groupId}-${rule.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "multiselect":
        return (
          <div className="flex gap-2 flex-wrap">
            {multiselectOptions.map((option) => (
              <div
                key={option}
                className={cn(
                  "px-3 py-1 rounded-md text-sm border cursor-pointer transition-colors",
                  rule.value?.includes(option)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted border-border",
                )}
                onClick={() => {
                  const currentValues = rule.value || []
                  const newValues = currentValues.includes(option)
                    ? currentValues.filter((v: string) => v !== option)
                    : [...currentValues, option]
                  updateRuleValue({ value: newValues })
                }}
              >
                {option}
                {rule.value?.includes(option) && <X className="h-3 w-3 ml-1 inline" />}
              </div>
            ))}
          </div>
        )

      case "date":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={rule.value || ""}
              onChange={(e) => updateRuleValue({ value: e.target.value })}
              className="w-40"
            />
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )

      case "datetime":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="datetime-local"
              value={rule.value || ""}
              onChange={(e) => updateRuleValue({ value: e.target.value })}
              className="w-48"
            />
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )

      case "time":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="time"
              value={rule.value || ""}
              onChange={(e) => updateRuleValue({ value: e.target.value })}
              className="w-32"
            />
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )

      case "field":
        return (
          <div className="flex gap-2">
            <Select
              value={rule.value?.field}
              onValueChange={(value) => updateRuleValue({ value: { ...rule.value, field: value } })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={rule.value?.comparison}
              onValueChange={(value) => updateRuleValue({ value: { ...rule.value, comparison: value } })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">text</SelectItem>
                <SelectItem value="number">number</SelectItem>
                <SelectItem value="date">date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      default:
        return (
          <Input
            value={rule.value || ""}
            onChange={(e) => updateRuleValue({ value: e.target.value })}
            className="w-32"
          />
        )
    }
  }

  const handleLogicalOperatorChange = (value: "AND" | "OR") => {
    setLogicalOperator(value)
    handleQueryChange(items, value, isNot)
  }

  const handleIsNotChange = (checked: boolean) => {
    setIsNot(checked)
    handleQueryChange(items, logicalOperator, checked)
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto p-6 bg-card rounded-lg border", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={logicalOperator} onValueChange={handleLogicalOperatorChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AND">AND</SelectItem>
            <SelectItem value="OR">OR</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Switch checked={isNot} onCheckedChange={handleIsNotChange} />
          <span className="text-sm">Not</span>
        </div>

        <Button variant="outline" size="sm" onClick={addRule}>
          <Plus className="h-4 w-4 mr-1" />
          Rule
        </Button>

        <Button variant="outline" size="sm" onClick={addGroup}>
          <Plus className="h-4 w-4 mr-1" />
          Group
        </Button>
      </div>

      {/* Rules and Groups */}
      <div className="space-y-3">
        {items.map((item, index) => {
          if ("type" in item && item.type === "group") {
            return renderGroup(item)
          }

          const rule = item as Rule
          return (
            <div key={rule.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
              <span className="text-sm text-muted-foreground w-4">{index + 1}</span>

              <Select
                value={rule.fieldType}
                onValueChange={(value: FieldType) => updateItem(rule.id, { fieldType: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={rule.operator}
                onValueChange={(value: Operator) => updateItem(rule.id, { operator: value })}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex-1">{renderValueInput(rule)}</div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(rule.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
