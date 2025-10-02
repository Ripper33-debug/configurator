export type PricingInput = {
  shelterId: string;
  isDeployed: boolean;
  isInteriorView: boolean;
  color: string;
};

export type PricingEstimate = {
  base: number;
  options: { label: string; amount: number }[];
  total: number;
  currency: 'USD';
  note: string;
};

const BASE_PRICES: Record<string, number> = {
  trecc: 145000,
  herconn: 125000,
  'command-posting': 155000
};

function colorAdj(color: string): number {
  // Premium coatings (approx): desert/arctic finish slight uplift
  const normalized = color.toLowerCase();
  if (normalized.includes('b8a082') || normalized.includes('f8f8f8')) return 2500;
  return 0;
}

export function estimatePrice(input: PricingInput): PricingEstimate {
  const base = BASE_PRICES[input.shelterId] ?? 120000;
  const options: { label: string; amount: number }[] = [];

  if (input.isDeployed) options.push({ label: 'Deployed configuration hardware', amount: 3500 });
  if (input.isInteriorView) options.push({ label: 'Interior fit-out package', amount: 9800 });

  const colorDelta = colorAdj(input.color);
  if (colorDelta > 0) options.push({ label: 'Premium coating/finish', amount: colorDelta });

  const total = base + options.reduce((s, o) => s + o.amount, 0);

  return {
    base,
    options,
    total,
    currency: 'USD',
    note: 'Indicative estimate. Final pricing varies by quantity, logistics, and options.'
  };
}


