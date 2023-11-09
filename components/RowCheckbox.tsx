import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Dealer } from "../lib/dealers";
import { Term, TermKind } from "../lib/terms";

type Props = {
  dealer: Dealer;
  ignoredTerms: Map<string, TermKind>;
  onAddTerm: (term: Term) => void;
  onRemoveTerm: (term: Term) => void;
};

function getCheckboxState(
  ignoredTerms: Props["ignoredTerms"],
  dealer: Props["dealer"],
) {
  const checked =
    ignoredTerms.has(dealer.seller_id) &&
    ignoredTerms.has(dealer.name) &&
    ignoredTerms.has(dealer.phone_number);

  if (checked) {
    return { checked, indeterminate: false };
  }

  return {
    checked,
    indeterminate:
      ignoredTerms.has(dealer.seller_id) ||
      ignoredTerms.has(dealer.name) ||
      ignoredTerms.has(dealer.phone_number),
  };
}

function onMultiple(
  func: Props["onAddTerm"] | Props["onRemoveTerm"],
  terms: Term[],
) {
  for (const term of terms) {
    func(term);
  }
}

export default function RowCheckbox({
  ignoredTerms,
  dealer,
  onAddTerm,
  onRemoveTerm,
}: Props) {
  const { checked, indeterminate } = getCheckboxState(ignoredTerms, dealer);

  const handleChange = (e: CheckboxChangeEvent) => {
    const terms: Term[] = [
      {
        kind: "dealer_seller_id",
        term: dealer.seller_id,
      },
      { kind: "dealer_name", term: dealer.name },
      {
        kind: "dealer_phone_number",
        term: dealer.phone_number,
      },
    ];

    if (e.target.checked) {
      onMultiple(onAddTerm, terms);
    } else {
      onMultiple(onRemoveTerm, terms);
    }
  };

  return (
    <Checkbox
      checked={checked}
      disabled={checked}
      indeterminate={indeterminate}
      onChange={handleChange}
    />
  );
}
