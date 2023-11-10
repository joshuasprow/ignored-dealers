import { ClearOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";

type Props = {
  search: string;
  onSearch: (search: string) => void;
};

export default function DealerSearch({ search, onSearch }: Props) {
  return (
    <Space>
      <Input
        placeholder="Filter Dealers"
        type="text"
        onChange={(event) => onSearch(event.currentTarget.value)}
        style={{ minWidth: "50ch" }}
        value={search}
      />
      <Button
        disabled={!search}
        icon={<ClearOutlined />}
        onClick={() => onSearch("")}
      />
    </Space>
  );
}
