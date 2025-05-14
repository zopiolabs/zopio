import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { FC } from "react";

interface Props {
  schema: { key: string; type: string }[];
  value?: Record<string, any>;
  onChange?: (updated: Record<string, any>) => void;
}

export const InferForm: FC<Props> = ({ schema, value = {}, onChange }) => {
  return (
    <div className="grid gap-4">
      {schema.map(({ key, type }) => {
        const val = value[key] ?? "";
        const set = (v: any) => onChange?.({ ...value, [key]: v });

        switch (type) {
          case "boolean":
            return <Switch key={key} checked={val} onCheckedChange={set} />;
          case "string":
            return <Input key={key} value={val} onChange={(e) => set(e.target.value)} placeholder={key} />;
          case "number":
            return <Input key={key} type="number" value={val} onChange={(e) => set(Number(e.target.value))} placeholder={key} />;
          default:
            return <Textarea key={key} value={val} onChange={(e) => set(e.target.value)} placeholder={key} />;
        }
      })}
    </div>
  );
};
