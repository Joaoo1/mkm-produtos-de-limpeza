import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { AutoComplete } from 'primereact/autocomplete';
import { Header, Form, Values } from './styles';
import { PrimaryButton } from '../../styles/button';

export default function AddSales() {
  const [productsSuggestions, setProductSuggestions] = useState([]);

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

  return (
    <div className="p-grid p-nogutter">
      <Header className="p-col-12">
        <p>
          <FiArrowLeft size={40} />
          Registrar nova venda
        </p>
        <PrimaryButton>Registrar</PrimaryButton>
      </Header>
      <Form className="p-col-12 p-lg-6">
        <AutoComplete
          dropdown
          value={product}
          onChange={e => setProduct(e.target.value)}
          suggestions={productsSuggestions}
          completeMethod={suggestsProducts}
          placeholder="Digite o nome do produto"
          onKeyUp={addProductToList}
        />
      </Form>
      <Values className="p-col-12 p-lg-6">3</Values>
    </div>
  );
}
