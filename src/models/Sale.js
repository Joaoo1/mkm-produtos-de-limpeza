import Big from 'big.js';
import { convertTimeStampToString } from '../helpers/FormatDate';

export default class Sale {
  constructor({
    id,
    seller,
    sellerUid,
    dataPagamento,
    dataVenda,
    idVenda,
    pago,
    valorBruto,
    valorLiquido,
    valorPago,
    valorAReceber,
    desconto,
    idCliente,
    nomeCliente,
    complementoCliente,
    bairroCliente,
    cidadeCliente,
    enderecoCliente,
    telefone,
    products,
  }) {
    if (id) this.id = id;
    this.paymentDate = dataPagamento
      ? convertTimeStampToString(dataPagamento)
      : '';

    this.saleDate = dataVenda ? convertTimeStampToString(dataVenda) : '';
    this.saleId = idVenda;
    this.paid = pago;
    this.grossValue = new Big(valorBruto);
    this.netValue = new Big(valorLiquido);
    this.paidValue = (function () {
      if (valorPago) return new Big(valorPago);
      if (pago) return new Big(valorLiquido);
      return new Big(0);
    })();
    this.valueToReceive = valorAReceber
      ? new Big(valorAReceber)
      : new Big(valorLiquido).sub(this.paidValue);
    this.discount = new Big(desconto);
    this.situation = this.getPaymentSituation();
    if (seller) this.seller = seller;
    if (sellerUid) this.sellerUid = sellerUid;
    this.client = {
      id: idCliente,
      name: nomeCliente,
      neighborhood: bairroCliente || '',
      city: cidadeCliente || '',
      street: enderecoCliente || '',
      complement: complementoCliente || '',
      phone: telefone || '',
    };
    this.products = products;
  }

  getPaymentSituation() {
    if (this.paid) {
      return 'PAGO';
    }
    if (this.paidValue.gt(new Big(0))) {
      return 'PARCIALMENTE PAGO';
    }
    return 'NÃO PAGO';
  }
}
