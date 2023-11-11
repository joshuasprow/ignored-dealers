import { Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { PropsWithChildren } from "react";
import { Dealer } from "../lib/dealers";
import { TermKind } from "../lib/terms";
import DealerTermToggle from "./DealerTermToggle";
import DealerGroupToggle from "./DealerGroupToggle";

type Props = {
  dealers: Dealer[];
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

function Cell(props: PropsWithChildren) {
  return <td style={{ verticalAlign: "top" }}>{props.children}</td>;
}

export default function DealerTable({ dealers, terms }: Props) {
  const groups = groupDealersByName(dealers);

  const columns: ColumnsType<DealerGroup> = [
    {
      dataIndex: "name",
      title: "Name",
      width: "40ch",
      render: (_, group) => <DealerGroupToggle terms={terms} group={group} />,
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
      render: (_, group) =>
        Array.from(group.seller_ids).map((seller_id) => (
          <DealerTermToggle
            key={seller_id}
            terms={terms}
            term={{ kind: "dealer_seller_id", term: seller_id }}
          />
        )),
    },
    {
      dataIndex: "phone_numbers",
      title: "Phone #s",
      width: "16ch",
      render: (_, group) =>
        Array.from(group.phone_numbers).map((phone_number) => (
          <DealerTermToggle
            key={phone_number}
            hasTitle
            terms={terms}
            term={{ kind: "dealer_phone_number", term: phone_number }}
          />
        )),
    },
  ];

  return (
    <Table
      columns={columns}
      components={{ body: { cell: Cell } }}
      dataSource={groups}
      rowKey={(row) => row.query}
      scroll={{ y: "75dvh" }}
      size="small"
      style={{ maxWidth: 768 }}
      pagination={{ pageSize: 50 }}
    />
  );
}
