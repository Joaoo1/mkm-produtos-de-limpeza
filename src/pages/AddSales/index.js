import React, { useState, useEffect, useRef } from 'react';
import Big from 'big.js';

import {
  FiArrowLeft,
  FiUserPlus,
  FiXCircle,
  FiX,
  FiPlus,
  FiMinus,
} from 'react-icons/fi';
import { AutoComplete } from 'primereact/autocomplete';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Growl } from 'primereact/growl';

import { Header, Form, Values } from './styles';
import { PrimaryButton } from '../../styles/button';
import { SelectClientModal } from '../../styles/modal';

import ClientController from '../../controllers/ClientController';
import ProductController from '../../controllers/ProductController';
import SaleController from '../../controllers/SaleController';

import { errorMsg } from '../../helpers/Growl';

export default function AddSales() {
  const growl = useRef(null);

  SelectClientModal.setAppElement('#root');
  const [selectClientModalIsOpen, setSelectClientModalOpen] = useState(false);
  const [productsSuggestions, setProductSuggestions] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  const [sale, setSale] = useState({
    paymentMethod: 'unpaid',
    hasDiscount: false,
    products: [],
    client: { nome: '' },
    total: new Big('0'),
  });

  const [values, setValues] = useState({
    totalProducts: new Big('0.00'),
    totalPaid: new Big('0.00'),
    discount: new Big('0.00'),
  });

  // Prevent AutoComplete from clearing its values automatically
  const [product, setProduct] = useState({ nome: '', quantidade: 1 });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const products = await ProductController.index();
      setProducts(products);
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const newTotal = values.totalProducts
      .minus(values.discount)
      .minus(values.totalPaid);

    setSale({ ...sale, total: newTotal });
    // eslint-disable-next-line
  }, [values]);

  // Setting Autocomplete suggestions
  function suggestsProducts(event) {
    const suggestionResults = products.filter(productSuggestion =>
      productSuggestion.nome.toLowerCase().startsWith(event.query.toLowerCase())
    );

    const results = suggestionResults.map(product => product.nome);
    setProductSuggestions(results);
  }

  function incrementTotal(preco, quantidade) {
    const newTotal = preco.mul(quantidade).plus(values.totalProducts);
    setValues({ ...values, totalProducts: newTotal });
  }

  function addProductToList(event) {
    // checks if enter was pressed
    if (event.keyCode === 13) {
      for (let i = 0; i < products.length; i++) {
        if (products[i].nome.includes(event.target.value)) {
          // checking if the user entered an invalid number
          if (product.quantidade.length === 0 || product.quantidade < 1) {
            product.quantidade = 1;
          }
          incrementTotal(products[i].preco, product.quantidade);
          sale.products.push({
            ...products[i],
            quantidade: product.quantidade,
          });
          setProduct({ nome: '', quantidade: 1 });
          return;
        }
      }

      errorMsg(growl, 'Produto não existe');
    }
  }

  function validateSale() {
    if (sale.products.length === 0) {
      errorMsg(growl, 'Venda sem produto adicionado');
      return false;
    }

    if (!sale.client.id || sale.client.nome.length === 0) {
      errorMsg(growl, 'Selecione um cliente');
      return false;
    }

    if (
      sale.paymentMethod === 'partially' &&
      values.totalPaid.eq(new Big('0.00'))
    ) {
      errorMsg(growl, 'Informe o valor pago');
      return false;
    }

    return true;
  }

  function addSale() {
    if (validateSale()) {
      SaleController.create({ ...sale, ...values });
    }
  }

  function handleRemoveQtt() {
    if (product.quantidade > 1) {
      setProduct({ ...product, quantidade: product.quantidade - 1 });
    }
  }

  function handleAddQtt() {
    setProduct({ ...product, quantidade: product.quantidade + 1 });
  }

  function handleDeleteProduct(index) {
    const deletedProduct = sale.products[index];
    const subtract = deletedProduct.preco.mul(deletedProduct.quantidade);
    const newTotal = sale.total.sub(subtract);
    const newTotalProducts = values.totalProducts.sub(subtract);
    setValues({ ...values, totalProducts: newTotalProducts });
    setSale({
      ...sale,
      products: sale.products.filter((product, idx) => idx !== index),
      total: newTotal,
    });
  }

  async function toogleSelectClientModal() {
    setSelectClientModalOpen(!selectClientModalIsOpen);
    if (clients.length === 0) {
      const clients = await ClientController.index();
      setClients(clients);
      setFilteredClients(clients);
    }
  }

  function selectClient(index) {
    setSale({ ...sale, client: filteredClients[index] });
    toogleSelectClientModal();
  }

  function filterClientList(event) {
    setFilteredClients(
      clients.filter(client =>
        client.nome.toLowerCase().includes(event.target.value)
      )
    );
  }

  function toggleDiscount(event) {
    setSale({ ...sale, hasDiscount: event.checked });
    if (!event.checked) {
      setValues({ ...values, discount: new Big('0') });
      document.getElementById('discount').value = '';
    }
  }

  function changeDiscount(event) {
    if (
      event.target.value.length === 0 ||
      Number.isNaN(Number(event.target.value))
    ) {
      setValues({ ...values, discount: new Big('0') });
    } else {
      setValues({ ...values, discount: new Big(event.target.value) });
    }
  }

  function handleRadioCheck(event) {
    setSale({ ...sale, paymentMethod: event.target.value });
    setValues({ ...values, totalPaid: new Big(0) });
  }

  function changeTotalPaid(event) {
    if (
      event.target.value.length === 0 ||
      Number.isNaN(Number(event.target.value))
    ) {
      setValues({ ...values, totalPaid: new Big('0') });
    } else {
      setValues({ ...values, totalPaid: new Big(event.target.value) });
    }
  }

  return (
    <>
      <Growl ref={growl} />
      <SelectClientModal
        isOpen={selectClientModalIsOpen}
        onRequestClose={toogleSelectClientModal}
        closeTimeoutMS={450}
        overlayClassName="modal-overlay"
      >
        <header className="p-grid  p-justify-between">
          <h2>Selecione um cliente</h2>
          <FiX size={28} onClick={toogleSelectClientModal} />
        </header>
        <hr />
        <InputText
          placeholder="Digite o nome do cliente"
          width={200}
          onChange={filterClientList}
        />
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, idx) => {
              return (
                <tr key={client.id} onClick={() => selectClient(idx)}>
                  <td>{client.nome}</td>
                  <td>{client.cidade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SelectClientModal>
      <div className="p-grid">
        <Header className="p-col-12">
          <p>
            <FiArrowLeft size={40} />
            Registrar nova venda
          </p>
          <PrimaryButton onClick={addSale}>Registrar</PrimaryButton>
        </Header>

        <Form className="p-col-12 p-xl-6">
          <div>
            <h4>Produtos</h4>
            <div className="p-grid p-nogutter">
              <AutoComplete
                id="products"
                dropdown
                value={product.nome}
                onChange={e => setProduct({ ...product, nome: e.target.value })}
                suggestions={productsSuggestions}
                completeMethod={suggestsProducts}
                placeholder="Digite o nome do produto"
                onKeyUp={addProductToList}
              />
              <button type="button" className="quantity" onClick={handleAddQtt}>
                <FiPlus color="white" size={24} />
              </button>
              <InputText
                id="quantity"
                value={product.quantidade}
                keyfilter="int"
                onChange={e =>
                  setProduct({ ...product, quantidade: e.target.value })
                }
              />
              <button
                type="button"
                className="quantity"
                onClick={handleRemoveQtt}
              >
                <FiMinus color="white" size={24} />
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th colSpan="4">Produtos Adicionados</th>
              </tr>
            </thead>
            <tbody>
              {sale.products.map((product, idx) => {
                return (
                  <tr key={product.id}>
                    <td>{`${product.quantidade}x`}</td>
                    <td>{product.nome}</td>
                    <td>{`R$${product.preco.toFixed(2)}`}</td>
                    <td>
                      <FiXCircle
                        size={22}
                        color="red"
                        onClick={() => handleDeleteProduct(idx)}
                        title="Excluir produto"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div>
            <h4>Cliente</h4>
            {/* TODO: Find out why div is getting so height */}
            <div className="p-grid p-nogutter">
              <InputText
                id="clients"
                value={sale.client.nome}
                placeholder="Selecione um cliente"
                disabled
              />
              <button type="button" onClick={() => toogleSelectClientModal()}>
                <FiUserPlus size="32" color="#fff" />
              </button>
            </div>
          </div>
          <div>
            <h4>Formas de pagamento</h4>
            <div className="p-grid p-align-center p-nogutter">
              <label>
                <RadioButton
                  value="unpaid"
                  name="payment"
                  onChange={handleRadioCheck}
                  checked={sale.paymentMethod === 'unpaid'}
                />
                Não Pago
              </label>
              <label>
                <RadioButton
                  value="paid"
                  name="payment"
                  onChange={handleRadioCheck}
                  checked={sale.paymentMethod === 'paid'}
                />
                Pago
              </label>
              <label>
                <RadioButton
                  value="partially"
                  name="payment"
                  onChange={handleRadioCheck}
                  checked={sale.paymentMethod === 'partially'}
                />
                Parcialmente pago
              </label>
            </div>
            {sale.paymentMethod === 'partially' ? (
              <InputText
                placeholder="Digite o valor pago"
                onChange={changeTotalPaid}
              />
            ) : null}
          </div>
          <div>
            <label className="p-grid p-nogutter">
              <Checkbox
                inputId="cb1"
                value="discount"
                checked={sale.hasDiscount}
                onChange={toggleDiscount}
              />
              Conceder desconto
            </label>
            <InputText
              id="discount"
              disabled={!sale.hasDiscount}
              keyfilter="pnum"
              onChange={changeDiscount}
            />
          </div>
        </Form>

        <Values className="p-col-12 p-xl-6">
          <table>
            <tbody>
              <tr>
                <td>
                  <p>Produtos:</p>
                </td>
                <td>{`R$${values.totalProducts.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td>
                  <p>Valor Pago:</p>
                </td>
                <td>{`R$${values.totalPaid.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td>
                  <p>Desconto:</p>
                </td>
                <td>{`R$${values.discount.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <hr />
                </td>
              </tr>
              <tr>
                <td>
                  <p>Total:</p>
                </td>
                <td>{`R$${sale.total.toFixed(2)}`}</td>
              </tr>
            </tbody>
          </table>
        </Values>
      </div>
    </>
  );
}
