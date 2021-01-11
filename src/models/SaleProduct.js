import Big from 'big.js';

export default class SaleProduct {
  constructor({ nome, parentId, preco, quantidade, manageStock }) {
    this.name = nome;
    this.parentId = parentId;
    this.price = new Big(preco);
    this.quantity = quantidade;
    this.manageStock = !!manageStock;
  }
}
