export function needsFxWarning(positionCurrency?: string, portfolioCurrency = "EUR") {
  return Boolean(positionCurrency && positionCurrency !== portfolioCurrency);
}
