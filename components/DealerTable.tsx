import { Button, Table, type TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { Dealer } from "../lib/dealers";

type Props = {
  dealers: TableProps<Dealer>["dataSource"];
  ignoredTerms: Set<string>;
  onAddTerm: (term: string) => void;
  onRemoveTerm: (term: string) => void;
};

function ColumnButton({
  hasTitle,
  ignoredTerms,
  value,
  onAddTerm,
  onRemoveTerm,
}: Omit<Props, "dealers"> & {
  hasTitle?: boolean;
  value: Dealer[keyof Dealer];
}) {
  const ignored = ignoredTerms.has(value);
  return (
    <Button
      size="small"
      title={hasTitle ? value : undefined}
      type={ignored ? "primary" : undefined}
      onClick={() => (ignored ? onRemoveTerm(value) : onAddTerm(value))}
    >
      <span
        style={{
          maxWidth: "30ch",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </span>
    </Button>
  );
}

export default function DealerTable({
  dealers,
  ignoredTerms,
  onAddTerm,
  onRemoveTerm,
}: Props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const columns: ColumnsType<Dealer> = [
    {
      title: "ID",
      render: (_, dealer) => (
        <ColumnButton
          ignoredTerms={ignoredTerms}
          value={dealer.seller_id}
          onAddTerm={onAddTerm}
          onRemoveTerm={onRemoveTerm}
        />
      ),
      width: "10ch",
    },
    {
      title: "Name",
      render: (_, dealer) => (
        <ColumnButton
          hasTitle
          ignoredTerms={ignoredTerms}
          value={dealer.name}
          onAddTerm={onAddTerm}
          onRemoveTerm={onRemoveTerm}
        />
      ),
      width: "calc(30ch + 1rem)",
    },
    {
      title: "Phone",
      render: (_, dealer) => (
        <ColumnButton
          ignoredTerms={ignoredTerms}
          value={dealer.phone_number}
          onAddTerm={onAddTerm}
          onRemoveTerm={onRemoveTerm}
        />
      ),
      width: "20ch",
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={dealers}
        rowKey={(row) => row.query}
        scroll={{ x: "calc(60ch + 1rem)", y: "400px" }}
        size="small"
      />
      {JSON.stringify(selectedRowKeys)}
    </>
  );
}
