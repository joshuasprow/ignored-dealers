import { Table as AntdTable, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { TransferListProps } from "antd/es/transfer";
import { TransferListBodyProps } from "antd/es/transfer/ListBody";
import { Dealer } from "../../lib/dealers";

type Props = Pick<
  TransferListProps<Dealer> & TransferListBodyProps<Dealer>,
  "direction" | "disabled" | "filteredItems" | "selectedKeys" | "onItemSelect"
>;

const COLUMNS: ColumnsType<Dealer> = [
  {
    dataIndex: "seller_id",
    title: "ID",
    width: "10ch",
  },
  {
    dataIndex: "name",
    title: "Name",
    render: (name) => (
      <Tag
        style={{
          maxWidth: "30ch",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        title={name}
      >
        {name}
      </Tag>
    ),
    width: "calc(30ch + 1rem)",
  },
  {
    dataIndex: "phone_number",
    title: "Phone",
    width: "20ch",
  },
];

export default function Table({
  direction,
  disabled,
  filteredItems,
  selectedKeys,
  onItemSelect,
}: Props) {
  return (
    <AntdTable
      columns={direction === "left" ? COLUMNS : COLUMNS}
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
