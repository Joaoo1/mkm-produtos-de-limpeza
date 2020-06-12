import Big from 'big.js';
import cloneDeep from 'lodash.clonedeep';

export default class Product {
  constructor(product) {
    if (!product) {
      this.nome = '';
      this.newName = '';
      this.preco = new Big('0');
      this.manageStock = false;
      this.currentStock = 0;
    } else {
      const p = cloneDeep(product);
      this.id = p.id ? p.id : '';
      this.nome = p.nome ? p.nome : '';
      if (p.newName) {
        this.newName = p.newName;
      } else {
        this.newName = p.nome;
      }
      this.preco = p.preco ? new Big(p.preco) : new Big(0);
      this.manageStock = p.manageStock ? p.manageStock : false;
      this.currentStock = p.currentStock ? p.currentStock : 0;
    }
  }

  formatFromFirestore() {
    this.preco = new Big(this.preco);
    this.newName = this.nome;
  }

  formatToFirestore() {
    this.preco = this.preco.toFixed(2);
    this.nome = this.newName;
    // Product document don't need a field with itself id.
    delete this.id;
    delete this.newName;
    if (!this.manageStock) {
      this.currentStock = 0;
    }
  }
}
