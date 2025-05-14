import type { FC } from "react";
import { Table } from "@/components/ui/table";

interface Props {
  schema: { key: string; type: string }[];
  data: Record<string, any>[];
}

export const InferTable: FC<Props> = ({ schema, data }) => {
  return (
    <Table>
      <Table.Header>
        {schema.map((field) => (
          <Table.Head key={field.key}>{field.key}</Table.Head>
        ))}
      </Table.Header>
      <Table.Body>
        {data.map((row, idx) => (
          <Table.Row key={idx}>
            {schema.map((field) => (
              <Table.Cell key={field.key}>{String(row[field.key])}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
