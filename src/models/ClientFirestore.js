import cloneDeep from 'lodash.clonedeep';

export default class ClientFirestore {
  constructor(client) {
    const { name, street, complement, neighborhood, city, phone } = cloneDeep(
      client
    );
    this.nome = name;
    this.endereco = street;
    this.complemento = complement;
    this.bairro = neighborhood;
    this.cidade = city;
    this.telefone = phone;
  }
}
