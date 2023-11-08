import { Button, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { TransferListProps } from "antd/es/transfer";
import { TransferListBodyProps } from "antd/es/transfer/ListBody";
import { useEffect, useMemo, useState } from "react";
import { Dealer } from "../../lib/dealers";

type Props = Pick<
  TransferListProps<Dealer> & TransferListBodyProps<Dealer>,
  "disabled" | "filteredItems" | "selectedKeys" | "onItemSelect"
>;

type RightDealer = Dealer & { ignoredKeys: Set<keyof Dealer> };

function ColumnComponent({
  dealer,
  field,
  onUpdate,
}: {
  dealer: RightDealer;
  field: keyof Dealer;
  onUpdate: (dealer: RightDealer) => void;
}) {
  return (
    <Button
      size="small"
      type={dealer.ignoredKeys.has(field) ? "primary" : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (dealer.ignoredKeys.has(field)) {
          dealer.ignoredKeys.delete(field);
        } else {
          dealer.ignoredKeys.add(field);
        }

        onUpdate({
          ...dealer,
          ignoredKeys: new Set(dealer.ignoredKeys),
        });
      }}
      style={{
        maxWidth: "30ch",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
      title={dealer[field]}
    >
      {dealer[field]}
    </Button>
  );
}

function transformDealers(dealers: Dealer[]) {
  return dealers.map((d) => {
    (d as RightDealer).ignoredKeys = new Set();
    return d as RightDealer;
  });
}

export default function RightTable({
  disabled,
  filteredItems,
  selectedKeys,
  onItemSelect,
}: Props) {
  const [dealers, setDealers] = useState(transformDealers(filteredItems));

  const updateDealer = (dealer: RightDealer) => {
    const index = dealers.findIndex(
      (d) => d.search_string === dealer.search_string,
    );

    if (index < 0) {
      console.warn(`failed to find dealer ${dealer.search_string}`);
      return;
    }

    setDealers((prev) => {
      prev[index] = dealer;
      return [...prev];
    });
  };

  const columns: ColumnsType<RightDealer> = [
    {
      title: "ID",
      render: (_, dealer) => (
        <ColumnComponent
          dealer={dealer}
          field="seller_id"
          onUpdate={updateDealer}
        />
      ),
      width: "10ch",
    },
    {
      title: "Name",
      render: (_, dealer) => (
        <ColumnComponent dealer={dealer} field="name" onUpdate={updateDealer} />
      ),
      width: "calc(30ch + 1rem)",
    },
    {
      title: "Phone",
      render: (_, dealer) => (
        <ColumnComponent
          dealer={dealer}
          field="phone_number"
          onUpdate={updateDealer}
        />
      ),
      width: "20ch",
    },
  ];

  useEffect(() => {
    setDealers(transformDealers(filteredItems));
  }, [filteredItems, setDealers]);

  return (
    <Table
      columns={columns}
      dataSource={dealers}
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
