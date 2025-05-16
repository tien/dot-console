export const nativeAmountFields = [
  ["Balances", "force_set_balance", "new_free"],
  ["Balances", "force_transfer", "value"],
  ["Balances", "force_unreserved", "amount"],
  ["Balances", "transfer_allow_death", "value"],
  ["Balances", "transfer_keep_alive", "value"],
  ["Bounties", "propose_bounty", "value"],
  ["Bounties", "propose_curator", "fee"],
  ["ChildBounties", "add_child_bounty", "value"],
  ["ChildBounties", "propose_curator", "fee"],
] as const;
