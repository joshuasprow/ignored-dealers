import { Button, Modal, Space, Tag, Transfer, TransferProps } from "antd";
import { useState } from "react";
import { Dealer } from "../../lib/dealers";
import LeftTable from "./LeftTable";
import RightTable from "./RightTable";
import { UnorderedListOutlined } from "@ant-design/icons";

type Props = Required<Pick<TransferProps<Dealer>, "dataSource">> & {
  ignoredTerms: Set<string>;
  onAddTerm: (term: string) => void;
  onRemoveTerm: (term: string) => void;
};

function filterOption(value: string, option: Dealer) {
  return option.query.includes(value.toLowerCase());
}
export default function DealerTransfer({
  dataSource,
  ignoredTerms,
  onAddTerm,
  onRemoveTerm,
}: Props) {
  const [termsModalOpen, setTermsModalOpen] = useState(false);
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

  return (
    <>
      <Transfer<Dealer>
        dataSource={dataSource}
        filterOption={filterOption}
        rowKey={(row) => row.query}
        showSearch
        onChange={handleChange}
        titles={[
          "All Terms",
          <Space>
            <span>Ignored Terms</span>
            <Button
              disabled={ignoredTerms.size === 0}
              type="text"
              icon={<UnorderedListOutlined />}
              onClick={() => setTermsModalOpen(true)}
            />
          </Space>,
        ]}
        targetKeys={targetKeys}
      >
        {({
          direction,
          disabled,
          filteredItems,
          selectedKeys,
          onItemSelect,
        }) =>
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
              onAddTerm={onAddTerm}
              onRemoveTerm={onRemoveTerm}
              onItemSelect={onItemSelect}
            />
          )
        }
      </Transfer>

      <Modal
        footer={false}
        onCancel={() => setTermsModalOpen(false)}
        open={termsModalOpen}
      >
        <Space direction="vertical">
          {Array.from(ignoredTerms.values()).map((term) => (
            <Tag key={term}>{term}</Tag>
          ))}
        </Space>
      </Modal>
    </>
  );
}
