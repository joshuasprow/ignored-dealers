import { Transfer, TransferProps } from "antd";
import { useState } from "react";
import { Dealer } from "../../lib/dealers";
import RightTable from "./RightTable";
import LeftTable from "./LeftTable";

type Props = Required<Pick<TransferProps<Dealer>, "dataSource">>;

function filterOption(value: string, option: Dealer) {
  return option.query.includes(value.toLowerCase());
}
export default function DealerTransfer({ dataSource }: Props) {
  const [ignoredTerms, setIgnoredTerms] = useState(new Set<string>());
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const handleChange: TransferProps<Dealer>["onChange"] = (
    nextTargetKeys,
    direction,
    moveKeys,
  ) => {
    if (direction === "right") {
      setTargetKeys(nextTargetKeys);
      return;
    }

    for (const key of moveKeys) {
      ignoredTerms.forEach((value) => {
        if (key.includes(value.toLowerCase())) {
          ignoredTerms.delete(value);
        }
      });
    }

    setTargetKeys(nextTargetKeys);
  };

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
      rowKey={(row) => row.query}
      showSearch
      onChange={handleChange}
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
