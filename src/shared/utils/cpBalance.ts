export function extractCpBalance(payload: any): number | null {
  if (!payload || typeof payload !== 'object') return null;

  const candidates = [
    payload.totalXp,
    payload.totalCp,
    payload.xp,
    payload.cp,
    payload.balance,
    payload.cpBalance,
    payload.cpPoints,
    payload.tokenBalance,
    payload.cpTokenBalance,
    payload.availableBalance,
    payload.wallet?.totalXp,
    payload.wallet?.totalCp,
    payload.wallet?.balance,
    payload.wallet?.cpBalance,
    payload.wallet?.tokenBalance,
    payload.data?.totalXp,
    payload.data?.totalCp,
    payload.data?.balance,
    payload.data?.cpBalance,
    payload.data?.cpPoints,
    payload.data?.tokenBalance,
    payload.balances?.cp,
    payload.balances?.token,
    payload.account?.balance,
  ];

  for (const value of candidates) {
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return null;
}
