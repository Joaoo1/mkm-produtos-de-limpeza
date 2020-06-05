import Big from 'big.js';
import { convertTimeStampToString } from '../helpers/FormatDate';

export default class Sale {
  constructor({
    id,
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
    seller,
    sellerUid,
  }) {
    this.id = id;
    this.dataPagamento = dataPagamento
      ? convertTimeStampToString(dataPagamento)
      : '';

    this.dataVenda = dataVenda ? convertTimeStampToString(dataVenda) : '';
    this.idVenda = idVenda;
    this.pago = pago;
    this.valorBruto = new Big(valorBruto);
    this.valorLiquido = new Big(valorLiquido);
    this.valorPago = new Big(valorPago);
    this.valorAReceber = new Big(valorAReceber);
    this.desconto = new Big(desconto);
    this.idCliente = idCliente;
    this.nomeCliente = nomeCliente;
    this.seller = seller;
    if (sellerUid) this.sellerUid = sellerUid;
    this.situation = this.getPaymentSituation();
    if (bairroCliente) this.bairroCliente = bairroCliente;
    if (cidadeCliente) this.cidadeCliente = cidadeCliente;
    if (enderecoCliente) this.cidadeCliente = cidadeCliente;
    if (complementoCliente) this.cidadeCliente = cidadeCliente;
    if (telefone) this.telefone = telefone;
  }

  getPaymentSituation() {
    // Set payment situation
    if (this.pago) {
      return 'PAGO';
    }
    if (parseInt(this.valorPago, 10) > 0) {
      return 'PARCIALMENTE PAGO';
    }
    return 'NÃO PAGO';
  }
}
