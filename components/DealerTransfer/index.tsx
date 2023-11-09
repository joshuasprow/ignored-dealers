import { Transfer, TransferProps } from "antd";
import { useState } from "react";
import { Dealer } from "../../lib/dealers";
import RightTable from "./RightTable";
import LeftTable from "./LeftTable";

type Props = Required<Pick<TransferProps<Dealer>, "dataSource">>;

function filterOption(value: string, option: Dealer) {
  return option.search_string.includes(value.toLowerCase());
}

function randomIndices(arrayLength: number, count = 20) {
  if (arrayLength < count) {
    count = arrayLength;
  }

  const indices = new Set<number>();

  for (let i = 0; i < count; i++) {
    indices.add(Math.floor(Math.random() * arrayLength));
  }

  return indices;
}

function randomTargetKeys(dataSource: Props["dataSource"]) {
  const indices = randomIndices(dataSource.length);

  return dataSource
    .filter((d, i) => indices.has(i))
    .map((d) => d.search_string);
}

export default function DealerTransfer({ dataSource }: Props) {
  const [ignoredTerms, setIgnoredTerms] = useState(new Set<string>());
  const [targetKeys, setTargetKeys] = useState<string[]>(
    randomTargetKeys(dataSource),
  );

  const handleChange: TransferProps<Dealer>["onChange"] = (
    nextTargetKeys,
    _,
    moveKeys,
  ) => {
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
      rowKey={(row) => row.search_string}
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
