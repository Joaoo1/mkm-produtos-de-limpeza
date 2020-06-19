export default class SaleProductFirestore {
  constructor({ id, manageStock, name, price, quantity }) {
    this.add_date = new Date();
    this.parentId = id;
    this.manageStock = manageStock;
    this.nome = name;
    this.preco = price.toFixed(2);
    this.quantidade = quantity;
  }
}
