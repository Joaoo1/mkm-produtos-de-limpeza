export default function FormatSale(sale) {
  // Converting timestamp to date
  const date = sale.dataVenda.toDate();
  const FormattedDate = Intl.DateTimeFormat('pt-BR').format(date);
  sale.dataVenda = FormattedDate;

  // Set payment situation
  if (sale.pago) {
    sale.situation = 'PAGO';
  } else if (parseInt(sale.valorPago, 10) > 0) {
    sale.situation = 'PARCIALMENTE PAGO';
  } else {
    sale.situation = 'NÃO PAGO';
  }

  return sale;
}
