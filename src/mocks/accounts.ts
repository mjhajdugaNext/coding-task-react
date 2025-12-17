import type { AccountRecord } from "@/lib/data";

const mockAccounts: AccountRecord[] = [
  { id: "ACT0145W", account_type: "prp", value: 16546.83, currency: "USD" },
  { id: "ACT01CDL", account_type: "prm", value: 7614.65, currency: "PLN" },
  { id: "ACT02P7Z", account_type: "prm", value: 8332.68, currency: "PLN" },
  { id: "ACT02ZN4", account_type: "prp", value: 4074.41, currency: "GBP" },
  { id: "ACT036PF", account_type: "prp", value: 2203.47, currency: "PLN" },
  { id: "ACT03D8W", account_type: "std", value: 11372.1, currency: "GBP" },
  { id: "ACT03YZU", account_type: "std", value: 16845.31, currency: "PLN" },
  { id: "ACT04M4S", account_type: "prm", value: 12951.33, currency: "GBP" },
  { id: "ACT055MK", account_type: "prm", value: 6357.16, currency: "USD" },
  { id: "ACT06KOD", account_type: "prm", value: 17585.68, currency: "PLN" },
];

export default mockAccounts;
