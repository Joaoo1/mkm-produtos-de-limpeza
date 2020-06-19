import cloneDeep from 'lodash.clonedeep';

export default class ProductFirestore {
  constructor(product) {
    const { newName, price, currentStock, manageStock } = cloneDeep(product);
    this.nome = newName;
    this.preco = price.toFixed(2);
    this.currentStock = Number(currentStock);
    this.manageStock = manageStock;
    if (!manageStock) {
      this.currentStock = 0;
    }
  }
}
