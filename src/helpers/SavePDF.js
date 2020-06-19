import JsPDF from 'jspdf';
import 'jspdf-autotable';

export default function savePDF(list) {
  const formattedList = list.map(sale => {
    const formattedSale = {
      date: sale.saleDate,
      client: sale.client.name,
      total: sale.netValue.toFixed(2),
      totalPaid: sale.paidValue.toFixed(2),
      totalToReceive: sale.valueToReceive.toFixed(2),
      address: `${sale.client.street}, ${sale.client.complement}.`,
      neighborhood: sale.client.neighborhood,
      clientPhone: sale.client.phone,
    };

    return formattedSale;
  });

  const values = formattedList.map(sale =>
    Object.entries(sale).map(keyValue => keyValue[1])
  );
  // console.log(values);
  const doc = new JsPDF();
  doc.autoTable({
    head: [
      [
        'Data',
        'Nome do Cliente',
        'Valor Total',
        'Valor pago',
        'Valor a Receber',
        'Rua',
        'Bairro',
        'Telefone',
      ],
    ],
    body: [...values],
  });
  doc.save('Relatório de vendas');
}
