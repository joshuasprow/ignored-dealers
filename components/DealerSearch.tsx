import { CloseOutlined } from "@ant-design/icons";
import { Button, Input, Space, Switch } from "antd";

type Props = {
  search: string;
  showIgnored: boolean;
  onSearch: (search: string) => void;
  onShowIgnored: (show: boolean) => void;
};

export default function DealerSearch({
  search,
  showIgnored,
  onSearch,
  onShowIgnored,
}: Props) {
  return (
    <Space>
      <Switch
        checked={showIgnored}
        checkedChildren="ignored"
        unCheckedChildren="all"
        onChange={onShowIgnored}
      />
      <Input
        placeholder="Filter Dealers"
        type="text"
        onChange={(event) => onSearch(event.currentTarget.value)}
        style={{ minWidth: "50ch" }}
        value={search}
      />
      <Button
        disabled={!search}
        icon={<CloseOutlined />}
        onClick={() => onSearch("")}
      />
    </Space>
  );
}
