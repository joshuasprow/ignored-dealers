import { Checkbox, Typography } from "antd";
import useTerms from "../hooks/use-terms";
import { Term, TermKind } from "../lib/terms";
import { DealerGroup } from "./DealerTable";

type Props = {
  group: DealerGroup;
  terms: Map<string, TermKind>;
};

function combineGroupTerms(group: DealerGroup): Term[] {
  const terms: Term[] = [{ kind: "dealer_name", term: group.name }];

  for (const location of group.locations) {
    terms.push({ kind: "dealer_location", term: location });
  }

  for (const seller_id of group.seller_ids) {
    terms.push({ kind: "dealer_seller_id", term: seller_id });
  }

  for (const phone_number of group.phone_numbers) {
    terms.push({ kind: "dealer_phone_number", term: phone_number });
  }

  return terms;
}

function isCheckedState(terms: Props["terms"], dealer: Props["group"]) {
  if (!terms.has(dealer.name)) return false;

  for (const location of dealer.locations) {
    if (!terms.has(location)) return false;
  }

  for (const seller_id of dealer.seller_ids) {
    if (!terms.has(seller_id)) return false;
  }

  for (const phone_number of dealer.phone_numbers) {
    if (!terms.has(phone_number)) return false;
  }

  return true;
}

function isIndeterminateState(terms: Props["terms"], dealer: Props["group"]) {
  if (terms.has(dealer.name)) return true;

  for (const seller_id of dealer.seller_ids) {
    if (terms.has(seller_id)) return true;
  }

  for (const phone_number of dealer.phone_numbers) {
    if (terms.has(phone_number)) return true;
  }

  return false;
}

function getCheckboxState(terms: Props["terms"], dealer: Props["group"]) {
  const checked = isCheckedState(terms, dealer);

  if (checked) {
    return { checked, indeterminate: false };
  }

  return {
    checked,
    indeterminate: isIndeterminateState(terms, dealer),
  };
}

export default function RowCheckbox({ terms, group }: Props) {
  const { add, remove, loading } = useTerms();

  const { checked, indeterminate } = getCheckboxState(terms, group);

  const all = combineGroupTerms(group);

  const handleChange = () => {
    if (checked) {
      remove(all);
    } else {
      add(all);
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
      <Checkbox
        disabled={loading}
        checked={checked}
        indeterminate={indeterminate}
        onChange={handleChange}
      />
      <Typography.Text>{group.name}</Typography.Text>
    </div>
  );
}
