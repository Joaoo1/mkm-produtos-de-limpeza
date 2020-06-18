import Big from 'big.js';

export default class Product {
  constructor({ id, nome, preco, currentStock, manageStock }) {
    this.id = id;
    this.name = nome;
    this.newName = nome;
    this.price = new Big(preco);
    this.currentStock = currentStock || 0;
    this.manageStock = manageStock;
  }
}
