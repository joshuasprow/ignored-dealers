import { Transfer, TransferProps } from "antd";
import { useState } from "react";
import { Dealer } from "../../lib/dealers";
import RightTable from "./RightTable";
import LeftTable from "./LeftTable";

type Props = Pick<TransferProps<Dealer>, "dataSource">;

function filterOption(value: string, option: Dealer) {
  return option.search_string.includes(value.toLowerCase());
}

export default function DealerTransfer({ dataSource }: Props) {
  const [ignoredTerms, setIgnoredTerms] = useState(new Set<string>());
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const handleAddTerm = (term: string) =>
    setIgnoredTerms((prev) => {
      prev.add(term);
      return new Set(prev);
    });

  const handleRemoveTerm = (term: string) =>
    setIgnoredTerms((prev) => {
      prev.delete(term);
      return new Set(prev);
    });

  return (
    <Transfer<Dealer>
      dataSource={dataSource}
      filterOption={filterOption}
      rowKey={(row) => row.search_string}
      showSearch
      onChange={setTargetKeys}
      targetKeys={targetKeys}
    >
      {({ direction, disabled, filteredItems, selectedKeys, onItemSelect }) =>
        direction === "left" ? (
          <LeftTable
            disabled={disabled}
            filteredItems={filteredItems}
            selectedKeys={selectedKeys}
            onItemSelect={onItemSelect}
          />
        ) : (
          <RightTable
            disabled={disabled}
            filteredItems={filteredItems}
            ignoredTerms={ignoredTerms}
            selectedKeys={selectedKeys}
            onAddTerm={handleAddTerm}
            onRemoveTerm={handleRemoveTerm}
            onItemSelect={onItemSelect}
          />
        )
      }
    </Transfer>
  );
}
