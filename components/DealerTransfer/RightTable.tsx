import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { TransferListProps } from "antd/es/transfer";
import { TransferListBodyProps } from "antd/es/transfer/ListBody";
import { Dealer } from "../../lib/dealers";

type Props = Pick<
  TransferListProps<Dealer> & TransferListBodyProps<Dealer>,
  "disabled" | "filteredItems" | "selectedKeys" | "onItemSelect"
>;

function NameColumn({ dealer }: { dealer: Dealer }) {
  return (
    <Tag
      style={{
        maxWidth: "30ch",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
      title={dealer.name}
    >
      {dealer.name}
    </Tag>
  );
}

export default function RightTable({
  disabled,
  filteredItems,
  selectedKeys,
  onItemSelect,
}: Props) {
  const columns: ColumnsType<Dealer> = [
    {
      dataIndex: "seller_id",
      title: "ID",
      width: "10ch",
    },
    {
      title: "Name",
      render: (_, dealer) => <NameColumn dealer={dealer} />,
      width: "calc(30ch + 1rem)",
    },
    {
      dataIndex: "phone_number",
      title: "Phone",
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
        hideSelectAll: true,
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
