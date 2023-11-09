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
      render: (_, dealer) => (
        <span
          style={{
            color: ignoredTerms.has(dealer.seller_id) ? "red" : undefined,
          }}
        >
          {dealer.seller_id}
        </span>
      ),
      width: "10ch",
    },
    {
      title: "Name",
      render: (_, dealer) => (
        <span
          style={{
            color: ignoredTerms.has(dealer.name) ? "red" : undefined,
          }}
        >
          {dealer.name}
        </span>
      ),
      width: "calc(30ch + 1rem)",
    },
    {
      title: "Phone",
      render: (_, dealer) => (
        <span
          style={{
            color: ignoredTerms.has(dealer.phone_number) ? "red" : undefined,
          }}
        >
          {dealer.phone_number}
        </span>
      ),
      width: "20ch",
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(row) => row.query}
        rowSelection={{
          getCheckboxProps: (item) => ({}),
          onSelect(dealer, selected) {
            if (selected) {
              onAddTerm(dealer.name);
              onAddTerm(dealer.phone_number);
              onAddTerm(dealer.seller_id);
            } else {
              onRemoveTerm(dealer.name);
              onRemoveTerm(dealer.phone_number);
              onRemoveTerm(dealer.seller_id);
            }

            setSelectedRowKeys((prev) => {
              if (selected) return [...prev, dealer.query];

              const index = prev.findIndex((p) => p === dealer.query);

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
      {JSON.stringify(selectedRowKeys)}
    </>
  );
}
