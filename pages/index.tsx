import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

export const getStaticProps: GetStaticProps<{
  data: [];
}> = async (context) => {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const data = await res.json();
  return { props: { data } };
};

export default function IndexPage({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      Hello World. <Link href="/about">About</Link>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
