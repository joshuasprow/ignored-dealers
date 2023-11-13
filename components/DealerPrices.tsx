import { ExportOutlined } from "@ant-design/icons";
import { Button, Col, Modal, Row, Space, Tag } from "antd";
import { useState } from "react";
import usePrices from "../hooks/use-prices";
import { DealerGroup } from "./DealerTable";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
});

export default function DealerPrices({ group }: { group: DealerGroup }) {
  const prices = usePrices().get(group.query);

  const [open, setOpen] = useState(false);

  return (
    <>
      <Space.Compact>
        <Button
          disabled={!prices?.length}
          icon={<ExportOutlined />}
          onClick={() => setOpen(true)}
          size="small"
        />
        <Tag>{prices?.length || 0}</Tag>
      </Space.Compact>

      <Modal
        destroyOnClose
        footer={false}
        open={open}
        onCancel={() => setOpen(false)}
      >
        {prices?.map((p, i) => (
          <Row key={`${p.dealer_query}-${i}`} gutter={[12, 12]}>
            <Col>{dateFormatter.format(new Date(p.searched_at))}</Col>
            <Col>{p.part_code}</Col>
            <Col>{p.ic}</Col>
            <Col>{p.grade}</Col>
            <Col>{p.stock_number}</Col>
            <Col>{p.price}</Col>
          </Row>
        ))}
      </Modal>
    </>
  );
}
