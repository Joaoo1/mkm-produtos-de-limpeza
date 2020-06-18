import JsPDF from 'jspdf';
import 'jspdf-autotable';

export default function savePDF(list) {
  const formattedList = list.map(sale => {
    const street = sale.enderecoCliente || '';
    const complement = sale.complementoCliente || '';
    const address = `${street}, ${complement}.`;
    const formattedSale = {
      date: sale.dataVenda || '',
      client: sale.nomeCliente || '',
      total: sale.valorLiquido ? sale.valorLiquido.toFixed(2) : '',
      totalPaid: sale.valorPago ? sale.valorPago.toFixed(2) : '',
      totalToReceive: sale.valorAReceber ? sale.valorAReceber.toFixed(2) : '',
      address,
      neighborhood: sale.bairroCliente || '',
      clientPhone: sale.telefone || '',
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
