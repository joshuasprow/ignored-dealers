import { Space, Tag } from "antd";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useState } from "react";
import DealerTransfer from "../components/DealerTransfer";
import type { Dealer } from "../lib/dealers";

export const getStaticProps: GetStaticProps<{
  dealers: Dealer[];
}> = async () => {
  const res = await fetch("http://localhost:3000/api/dealers");
  const dealers = await res.json();

  return { props: { dealers } };
};

export default function IndexPage({
  dealers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [ignoredTerms, setIgnoredTerms] = useState(new Set<string>());

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
    <Space direction="vertical">
      <DealerTransfer
        dataSource={dealers}
        ignoredTerms={ignoredTerms}
        onAddTerm={handleAddTerm}
        onRemoveTerm={handleRemoveTerm}
      />
      <Space style={{ cursor: "pointer", maxWidth: "90vw" }} wrap>
        {Array.from(ignoredTerms)
          .sort()
          .map((term) => (
            <Tag key={term} onClick={() => handleRemoveTerm(term)}>
              {term}
            </Tag>
          ))}
      </Space>
    </Space>
  );
}
