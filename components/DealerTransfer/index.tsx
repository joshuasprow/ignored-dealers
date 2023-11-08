import { Transfer, TransferProps } from "antd";
import { Dealer } from "../../lib/dealers";
import Table from "./Table";

type Props = Pick<
  TransferProps<Dealer>,
  "dataSource" | "targetKeys" | "onChange"
>;

export default function DealerTransfer({
  dataSource,
  targetKeys,
  onChange,
}: Props) {
  return (
    <Transfer<Dealer>
      dataSource={dataSource}
      filterOption={(value, option) =>
        option.search_string.includes(value.toLowerCase())
      }
      rowKey={(row) => row.search_string}
      showSearch
      showSelectAll={false}
      onChange={onChange}
      targetKeys={targetKeys}
    >
      {({ direction, disabled, filteredItems, selectedKeys, onItemSelect }) => (
        <Table
          direction={direction}
          disabled={disabled}
          filteredItems={filteredItems}
          selectedKeys={selectedKeys}
          onItemSelect={onItemSelect}
        />
      )}
    </Transfer>
  );
}
