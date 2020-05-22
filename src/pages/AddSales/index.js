import React, { useState } from 'react';
import { FiArrowLeft, FiUserPlus, FiXCircle } from 'react-icons/fi';
import { AutoComplete } from 'primereact/autocomplete';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { Header, Form, Values } from './styles';
import { PrimaryButton } from '../../styles/button';

export default function AddSales() {
  const [productsSuggestions, setProductSuggestions] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('unpaid');

  // FIXME: Prevent AutoComplete from clearing its values automatically
  const [product, setProduct] = useState('');

  // TODO: Get products name from db for AutoComplete suggestions
  const products = ['Amaciante', 'Desinfetante', 'Sabão liquído'];

  // Setting Autocomplete suggestions
  function suggestsProducts(event) {
    const suggestionResults = products.filter(productSuggestion =>
      productSuggestion.toLowerCase().startsWith(event.query.toLowerCase())
    );

    setProductSuggestions(suggestionResults);
  }

  function addProductToList(event) {
    if (event.keyCode === 13) {
      console.log(event.target.value);
    }
  }

  function test() {
    console.log(paymentMethod);
  }

  return (
    <div className="p-grid p-nogutter">
      <Header className="p-col-12">
        <p>
          <FiArrowLeft size={40} />
          Registrar nova venda
        </p>
        <PrimaryButton onClick={test}>Registrar</PrimaryButton>
      </Header>
      <Form className="p-col-12 p-xl-6">
        <div>
          <p>Produtos</p>
          <AutoComplete
            dropdown
            value={product}
            onChange={e => setProduct(e.target.value)}
            suggestions={productsSuggestions}
            completeMethod={suggestsProducts}
            placeholder="Digite o nome do produto"
            onKeyUp={addProductToList}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th colSpan="4">Produtos Adicionados</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1x</td>
              <td>Desinfetante</td>
              <td>R$20.00</td>
              <td>
                <FiXCircle
                  size={22}
                  color="red"
                  // onClick={() => handleDeleteProduct(product.nome)}
                  onClick={() => {}}
                />
              </td>
            </tr>
            <tr>
              <td>1x</td>
              <td>Desinfetante</td>
              <td>R$20.00</td>
              <td>
                <FiXCircle
                  size={22}
                  color="red"
                  // onClick={() => handleDeleteProduct(product.nome)}
                  onClick={() => {}}
                />
              </td>
            </tr>
            <tr>
              <td>1x</td>
              <td>Desinfetante</td>
              <td>R$20.00</td>
              <td>
                <FiXCircle
                  size={22}
                  color="red"
                  // onClick={() => handleDeleteProduct(product.nome)}
                  onClick={() => {}}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <p>Cliente</p>
          <div className="p-grid p-nogutter p-align-center">
            <input type="text" placeholder="Selecione um cliente" disabled />
            <button type="button">
              <FiUserPlus size="32" color="#fff" />
            </button>
          </div>
        </div>

        <div>
          <p>Formas de pagamento</p>
          <div className="p-grid p-nogutter p-align-center p-justify-between">
            <div>
              <RadioButton
                value="unpaid"
                name="payment"
                onChange={e => setPaymentMethod(e.target.value)}
                checked={paymentMethod === 'unpaid'}
              />
              Não Pago
            </div>
            <div>
              <RadioButton
                value="paid"
                name="payment"
                onChange={e => setPaymentMethod(e.target.value)}
                checked={paymentMethod === 'paid'}
              />
              Pago
            </div>
            <div>
              <RadioButton
                value="partially"
                name="payment"
                onChange={e => setPaymentMethod(e.target.value)}
                checked={paymentMethod === 'partially'}
              />
              Parcialmente pago
            </div>
          </div>
        </div>

        <div className="p-grid">
          <Checkbox />
        </div>
      </Form>
      <Values className="p-col-12 p-xl-6">3</Values>
    </div>
  );
}
