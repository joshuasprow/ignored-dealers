import { AutoComplete, Input, Select, Space, type SelectProps } from "antd";
import { DefaultOptionType } from "antd/es/select";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useState } from "react";
import type { Dealer } from "../lib/dealers";

export const getStaticProps: GetStaticProps<{
  dealers: Dealer[];
}> = async () => {
  const res = await fetch("http://localhost:3000/api/dealers");
  const dealers = await res.json();

  return { props: { dealers } };
};

const getRandomInt = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const searchResult = (query: string) =>
  new Array(getRandomInt(5))
    .join(".")
    .split(".")
    .map((_, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              Found {query} on{" "}
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      };
    });

type SearchCounts<K extends DealerKind> = {
  [kind in Exclude<DealerKind, K>]: Dealer[kind][];
} & { [kind in K]: Dealer[kind] };

const dealerSearchResults = <K extends DealerKind>(
  dealers: Dealer[],
  kind: K,
  query: string,
) => {
  const filtered = dealers.filter((dealer) =>
    dealer[kind].toLowerCase().includes(query.toLowerCase()),
  );

  const notKinds = DEALER_KINDS.filter(
    (k): k is Exclude<DealerKind, K> => k !== kind,
  );

  const counts: Map<Dealer[K], SearchCounts<K>> = new Map();

  for (const d of filtered) {
    let c = counts.get(d[kind]);

    if (c) {
      for (const k of notKinds) {
        c[k] = c[k].concat(d[k]);
      }

      counts.set(d[kind], c);

      continue;
    }

    const p: Partial<SearchCounts<K>> = {};

    p[kind] = d[kind];

    for (const k of notKinds) {
      p[k] = (p[k] || []).concat(d[k]);
    }

    counts.set(d[kind], p);
  }

  const results: SelectProps["options"] = [];

  for (const c of Array.from(counts.values())) {
    results.push({
      value: c[kind],
      label: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.1rem",
          }}
        >
          <strong>{c[kind]}</strong>
          {notKinds.map((k) => (
            <span key={k} style={{ paddingLeft: "0.25rem" }}>
              {`${k.replaceAll("_", " ")}s: ${c[k].length}`}
            </span>
          ))}
        </div>
      ),
    });
  }

  return results;
};

const DEALER_KINDS = ["name", "phone_number", "seller_id"] as const;
type DealerKind = (typeof DEALER_KINDS)[number];

const dealerKindOptions = DEALER_KINDS.map((kind) => ({
  label: kind,
  value: kind,
}));

function KindSelect({
  kind,
  onChange,
}: {
  kind: DealerKind;
  onChange: (kind: DealerKind) => void;
}) {
  return (
    <Select
      onChange={onChange}
      options={dealerKindOptions}
      size="small"
      value={kind}
    />
  );
}

export default function IndexPage({
  dealers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [kind, setKind] = useState<DealerKind>("name");
  const [options, setOptions] = useState<SelectProps<Dealer>["options"]>([]);

  const handleSearch = (value: string) => {
    setOptions(value ? dealerSearchResults(dealers, kind, value) : []);
  };

  const onSelect = (value: string) => {
    console.log("onSelect", value);
  };

  return (
    <Space direction="vertical">
      <KindSelect kind={kind} onChange={setKind} />
      <AutoComplete
        popupMatchSelectWidth={352}
        style={{ width: 400 }}
        options={options}
        onSelect={onSelect}
        onSearch={handleSearch}
        size="small"
      >
        <Input.Search size="small" placeholder="input here" />
      </AutoComplete>
    </Space>
  );
}
