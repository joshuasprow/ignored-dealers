import { CloseOutlined } from "@ant-design/icons";
import { Button, Input, Switch } from "antd";

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
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Switch
        checked={showIgnored}
        checkedChildren="Ignored"
        unCheckedChildren="All"
        style={{ marginRight: "auto" }}
        onChange={onShowIgnored}
      />
      <Input
        placeholder="Filter Dealers"
        style={{ marginLeft: "auto", width: "50ch" }}
        type="text"
        value={search}
        onChange={(event) => onSearch(event.currentTarget.value)}
      />
      <Button
        disabled={!search}
        icon={<CloseOutlined />}
        onClick={() => onSearch("")}
      />
    </div>
  );
}
