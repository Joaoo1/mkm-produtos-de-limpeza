import cloneDeep from 'lodash.clonedeep';
import SaleProduct from './SaleProduct';
import { convertStringToTimestamp } from '../helpers/FormatDate';

export default class SaleFirestore {
  constructor(sale) {
    const {
      seller,
      sellerUid,
      paymentDate,
      saleDate,
      saleId,
      paid,
      grossValue,
      netValue,
      paidValue,
      discount,
      client,
      products,
    } = cloneDeep(sale);
    this.dataPagamento = paymentDate
      ? convertStringToTimestamp(paymentDate)
      : '';
    this.dataVenda = convertStringToTimestamp(saleDate);
    this.idVenda = saleId;
    this.pago = paid;
    this.valorBruto = grossValue.toFixed(2);
    this.valorLiquido = netValue.toFixed(2);
    this.valorPago = paidValue.toFixed(2);
    this.valorAReceber = netValue.sub(paidValue).toFixed(2);
    this.desconto = discount.toFixed(2);
    if (seller) this.seller = seller;
    if (sellerUid) this.sellerUid = sellerUid;
    this.idCliente = client.id;
    this.nomeCliente = client.name;
    this.enderecoCliente = client.street;
    this.complementoCliente = client.complement;
    this.bairroCliente = client.neighborhood;
    this.cidadeCliente = client.city;
    this.telefone = client.phone;
    this.products = products.map(p => new SaleProduct(p));
  }
}
