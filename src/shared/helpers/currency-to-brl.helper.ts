export function currencyToBRL(value: number, withDollarSigh = true): string {
  const config = withDollarSigh
    ? { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }
    : { minimumFractionDigits: 2 };
  return new Intl.NumberFormat('pt-BR', config).format(value || 0);
}
