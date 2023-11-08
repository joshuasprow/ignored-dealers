import { Transfer, TransferProps } from "antd";
import { useState } from "react";
import { Dealer } from "../../lib/dealers";
import Table from "./Table";

type Props = Pick<TransferProps<Dealer>, "dataSource">;

function filterOption(value: string, option: Dealer) {
  return option.search_string.includes(value.toLowerCase());
}

export default function DealerTransfer({ dataSource }: Props) {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  return (
    <Transfer<Dealer>
      dataSource={dataSource}
      filterOption={filterOption}
      rowKey={(row) => row.search_string}
      showSearch
      showSelectAll={false}
      onChange={setTargetKeys}
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
