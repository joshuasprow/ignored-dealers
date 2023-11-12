import { Badge, Button, Modal, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { PropsWithChildren, useState } from "react";
import useDealerPrices from "../hooks/use-dealer-prices";
import { Dealer } from "../lib/dealers";
import { TermKind } from "../lib/terms";
import DealerGroupToggle from "./DealerGroupToggle";
import DealerTermToggle from "./DealerTermToggle";
import {
  DollarCircleFilled,
  DollarCircleOutlined,
  DollarOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { presetPrimaryColors } from "@ant-design/colors";

type Props = {
  dealers: Dealer[];
  showIgnored: boolean;
  terms: Map<string, TermKind>;
};

export type DealerGroup = {
  kind: "name";
  name: string;
  query: string;
  locations: Set<string>;
  seller_ids: Set<string>;
  phone_numbers: Set<string>;
};

function groupDealersByName(dealers: Dealer[]) {
  const groups = new Map<string, DealerGroup>();

  for (const dealer of dealers) {
    let group = groups.get(dealer.name);

    if (group) {
      group.seller_ids.add(dealer.seller_id);
      group.phone_numbers.add(dealer.phone_number);
    } else {
      group = {
        kind: "name",
        name: dealer.name,
        query: dealer.query,
        locations: new Set([dealer.location]),
        seller_ids: new Set([dealer.seller_id]),
        phone_numbers: new Set([dealer.phone_number]),
      };
    }

    groups.set(dealer.name, group);
  }

  return Array.from(groups.values());
}

function Cell(props: PropsWithChildren & { className?: string }) {
  return (
    <td className={props.className} style={{ verticalAlign: "top" }}>
      {props.children}
    </td>
  );
}

function DealerPrices({ group }: { group: DealerGroup }) {
  const prices = useDealerPrices(group.query);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Space.Compact>
        <Button
          icon={<ExportOutlined />}
          onClick={() => setOpen(true)}
          size="small"
        />
        <Tag>{prices.length}</Tag>
      </Space.Compact>

      <Modal
        destroyOnClose
        footer={false}
        open={open}
        onCancel={() => setOpen(false)}
      >
        {prices.map((p) => p.dealer_query).join(", ")}
      </Modal>
    </>
  );
}

export default function DealerTable({ dealers, showIgnored, terms }: Props) {
  const groups = groupDealersByName(dealers);

  const columns: ColumnsType<DealerGroup> = [
    {
      dataIndex: "name",
      title: "Name",
      width: "40ch",
      render: (_, group) => (
        <DealerGroupToggle
          group={group}
          showIgnored={showIgnored}
          terms={terms}
        />
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      dataIndex: "locations",
      title: "Locations",
      width: 128,
      render: (_, group) =>
        Array.from(group.locations).map((location) => (
          <Tag
            key={location}
            bordered={false}
            style={{
              maxWidth: "18ch",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textAlign: "center",
              textOverflow: "ellipsis",
              width: "100%",
            }}
            title={location}
          >
            {location}
          </Tag>
        )),
    },
    {
      dataIndex: "seller_ids",
      title: "IDs",
      width: 64,
      render: (_, group) => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {Array.from(group.seller_ids).map((seller_id) => (
            <DealerTermToggle
              key={seller_id}
              showIgnored={showIgnored}
              terms={terms}
              term={{ kind: "dealer_seller_id", term: seller_id }}
            />
          ))}
        </div>
      ),
    },
    {
      dataIndex: "phone_numbers",
      title: "Phone #s",
      width: "16ch",
      render: (_, group) => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {Array.from(group.phone_numbers).map((phone_number) => (
            <DealerTermToggle
              key={phone_number}
              hasTitle
              showIgnored={showIgnored}
              terms={terms}
              term={{ kind: "dealer_phone_number", term: phone_number }}
            />
          ))}
        </div>
      ),
    },
    {
      key: "prices",
      title: "Prices",
      width: "6ch",
      render: (_, group) => {
        return <DealerPrices group={group} />;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      components={{ body: { cell: Cell } }}
      dataSource={groups}
      rowKey={(row) => row.query}
      scroll={{ y: "75vh" }}
      size="small"
      style={{ maxWidth: 768 }}
      pagination={{ pageSize: 50 }}
    />
  );
}
