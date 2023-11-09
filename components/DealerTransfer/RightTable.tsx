import { Button, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { TransferListProps } from "antd/es/transfer";
import { TransferListBodyProps } from "antd/es/transfer/ListBody";
import { useEffect, useMemo, useState } from "react";
import { Dealer } from "../../lib/dealers";

type Props = Pick<
  TransferListProps<Dealer> & TransferListBodyProps<Dealer>,
  "disabled" | "filteredItems" | "selectedKeys" | "onItemSelect"
> & {
  ignoredTerms: Set<string>;
  onAddTerm: (term: string) => void;
  onRemoveTerm: (term: string) => void;
};

type IgnoredKey = Extract<keyof Dealer, "name" | "phone_number" | "seller_id">;

function ColumnComponent({
  dealer,
  ignoreKey,
  ignoredTerms,
  onAddTerm,
  onRemoveTerm,
}: {
  dealer: Dealer;
  ignoreKey: IgnoredKey;
} & Pick<Props, "ignoredTerms" | "onAddTerm" | "onRemoveTerm">) {
  const term = dealer[ignoreKey];

  return (
    <Button
      size="small"
      type={ignoredTerms.has(term) ? "primary" : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (ignoredTerms.has(term)) {
          onRemoveTerm(term);
        } else {
          onAddTerm(term);
        }
      }}
      style={{
        maxWidth: "30ch",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
      title={dealer[ignoreKey]}
    >
      {dealer[ignoreKey]}
    </Button>
  );
}

export default function RightTable({
  disabled,
  filteredItems,
  ignoredTerms,
  selectedKeys,
  onAddTerm,
  onRemoveTerm,
  onItemSelect,
}: Props) {
  const columns: ColumnsType<Dealer> = [
    {
      title: "ID",
      render: (_, dealer) => (
        <ColumnComponent
          dealer={dealer}
          ignoredTerms={ignoredTerms}
          ignoreKey="seller_id"
          onAddTerm={onAddTerm}
          onRemoveTerm={onRemoveTerm}
        />
      ),
      width: "10ch",
    },
    {
      title: "Name",
      render: (_, dealer) => (
        <ColumnComponent
          dealer={dealer}
          ignoredTerms={ignoredTerms}
          ignoreKey="name"
          onAddTerm={onAddTerm}
          onRemoveTerm={onRemoveTerm}
        />
      ),
      width: "calc(30ch + 1rem)",
    },
    {
      title: "Phone",
      render: (_, dealer) => (
        <ColumnComponent
          dealer={dealer}
          ignoredTerms={ignoredTerms}
          ignoreKey="phone_number"
          onAddTerm={onAddTerm}
          onRemoveTerm={onRemoveTerm}
        />
      ),
      width: "20ch",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredItems}
      onRow={({ search_string }) => ({
        onClick: () => {
          if (disabled) return;

          onItemSelect(search_string, !selectedKeys.includes(search_string));
        },
      })}
      rowKey={(row) => row.search_string}
      rowSelection={{
        getCheckboxProps: (item) => ({
          disabled,
        }),
        onSelect({ search_string }, selected) {
          onItemSelect(search_string, selected);
        },
        selectedRowKeys: selectedKeys,
      }}
      scroll={{ x: "calc(60ch + 1rem)", y: "400px" }}
      size="small"
      style={{ pointerEvents: disabled ? "none" : undefined }}
    />
  );
}
