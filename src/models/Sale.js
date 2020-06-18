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
    this.paidValue = new Big(valorPago);
    this.valueToReceive = new Big(valorAReceber);
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
  }

  getPaymentSituation() {
    if (this.pago) {
      return 'PAGO';
    }
    if (parseInt(this.valorPago, 10) > 0) {
      return 'PARCIALMENTE PAGO';
    }
    return 'NÃO PAGO';
  }
}
