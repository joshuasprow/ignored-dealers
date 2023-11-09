import type { GetStaticProps, InferGetStaticPropsType } from "next";
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
  return <DealerTransfer dataSource={dealers} />;
}
