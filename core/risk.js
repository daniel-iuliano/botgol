export function canTrade(state, cooldownMs = 60_000) {
  if (state.inPosition) return false;
  if (Date.now() - state.lastTradeTime < cooldownMs) return false;
  return true;
}

export function calculatePositionSize({
  balance,
  price,
  riskPercent,
  slPercent,
  minAmount = 0.0001,
}) {
  const riskAmount = balance * riskPercent;
  const stopDistance = price * slPercent;

  const size = riskAmount / stopDistance;
  return size >= minAmount ? size : null;
}