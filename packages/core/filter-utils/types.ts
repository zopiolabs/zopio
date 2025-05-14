export interface ConditionalFilter {
  field: string;
  operator: string;
  value: string | number | boolean | Date | null | Array<string | number | boolean | Date>;
  condition?: boolean;
}
