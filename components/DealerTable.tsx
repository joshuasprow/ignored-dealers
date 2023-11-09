import { Button, Table, type TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { Dealer } from "../lib/dealers";

type Props = Pick<TableProps<Dealer>, "dataSource"> & {
  ignoredTerms: Set<string>;
  onAddTerm: (term: string) => void;
  onRemoveTerm: (term: string) => void;
};

export default function DealerTable({
  dataSource,
  ignoredTerms,
  onAddTerm,
  onRemoveTerm,
}: Props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const columns: ColumnsType<Dealer> = [
    {
      title: "ID",
      render: (_, dealer) => dealer.seller_id,
      width: "10ch",
    },
    {
      title: "Name",
      render: (_, dealer) => dealer.name,
      width: "calc(30ch + 1rem)",
    },
    {
      title: "Phone",
      render: (_, dealer) => dealer.phone_number,
      width: "20ch",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={(row) => row.query}
      rowSelection={{
        getCheckboxProps: (item) => ({}),
        onSelect({ query }, selected) {
          setSelectedRowKeys((prev) => {
            if (selected) return [...prev, query];

            const index = prev.findIndex((p) => p === query);

            if (index < 0) return prev;

            prev.splice(index, 1);

            return [...prev];
          });
        },
        selectedRowKeys,
      }}
      scroll={{ x: "calc(60ch + 1rem)", y: "400px" }}
      size="small"
    />
  );
}
