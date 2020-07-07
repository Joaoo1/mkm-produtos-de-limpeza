export default class SaleProductFirestore {
  constructor({ id, manageStock, name, price, quantity, parentId }) {
    this.add_date = new Date();
    this.parentId = id || parentId;
    this.manageStock = manageStock;
    this.nome = name;
    this.preco = price.toFixed(2);
    this.quantidade = quantity;
  }
}
