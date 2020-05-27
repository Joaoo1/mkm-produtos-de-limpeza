export default class Sale {
  constructor({
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
    this.dataPagamento = dataPagamento;
    this.dataVenda = dataVenda;
    this.idVenda = idVenda;
    this.pago = pago;
    this.valorBruto = valorBruto;
    this.valorLiquido = valorLiquido;
    this.valorPago = valorPago;
    this.valorAReceber = valorAReceber;
    this.desconto = desconto;
    this.idCliente = idCliente;
    this.nomeCliente = nomeCliente;
    this.bairroCliente = bairroCliente;
    this.cidadeCliente = cidadeCliente;
    this.enderecoCliente = enderecoCliente;
    this.complementoCliente = complementoCliente;
    this.telefone = telefone;
    this.seller = seller;
    this.sellerUid = sellerUid;
  }

  static finishSale(s) {
    const sale = new Sale(s);
    sale.valorAReceber = '0.00';
    sale.valorPago = sale.valorLiquido;
    sale.pago = true;

    // TODO: Delete useless fields
    return sale;
  }
}
