import React, { useState, useEffect, useRef } from 'react';
import Big from 'big.js';
import { Growl } from 'primereact/growl';
import { Checkbox } from 'primereact/checkbox';
import {
  FiMoreVertical,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

// Styled Components
import { ProductModal, ModalButtonsContainer } from '../../styles/modal';
import { PrimaryButton, SecondaryButton } from '../../styles/button';
import { CheckboxContainer, StockHistoryModal } from './styles';
import {
  List as ProductList,
  DropdownContent,
  DropdownList,
  DropdownItem,
} from '../../styles/table';

// Components import
import ListHeader from '../../components/ListHeader';
import ConfirmModal from '../../components/ConfirmModal';

// Database Controller imports
import ProductController from '../../controllers/ProductController';
import StockHistoryController from '../../controllers/StockHistoryController';

import Product from '../../models/Product';

import { successMsg, errorMsg } from '../../helpers/Growl';

export default function Products() {
  const growl = useRef(null);

  ProductModal.setAppElement('#root');
  const [modalTitle, setModalTitle] = useState('');
  const [modalOpen, setModalOpen] = useState({
    addEditModal: false,
    deleteModal: false,
    stockHistoryModal: false,
  });
  const [stockHistories, setStockHistories] = useState([]);
  const [product, setProduct] = useState({});
  const [productList, setProductList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  async function fetchProducts() {
    const products = await ProductController.index();
    setProductList(products);
    setFilteredList(products);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function filterList(event) {
    setFilteredList(
      productList.filter(prod =>
        prod.nome.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  }

  function setPrice(event) {
    if (
      event.target.value.length === 0 ||
      Number.isNaN(Number(event.target.value))
    ) {
      setProduct({ ...product, preco: event.target.value.toString() });
    } else {
      setProduct({ ...product, preco: new Big(event.target.value) });
    }
  }

  // Modal functions
  function closeModal() {
    setModalOpen({ ...modalOpen, addEditModal: false });
  }

  function openAddModal() {
    setProduct(new Product());
    setModalTitle('Cadastrar novo Produto');
    setModalOpen({ ...modalOpen, addEditModal: true });
  }

  function openEditModal(p) {
    setModalTitle('Editar Produto');
    setProduct(p);
    setModalOpen({ ...modalOpen, addEditModal: true });
  }

  function toggleDeleteModal(p, index) {
    setProduct(new Product());
    if (p) {
      setProduct({ ...p, index });
      setModalOpen({ ...modalOpen, deleteModal: true });
    } else {
      setModalOpen({ ...modalOpen, deleteModal: false });
    }
  }

  async function toggleStockHistoryModal(p) {
    if (p) {
      setProduct(p);
      const stockHist = await StockHistoryController.index(p.id);
      setStockHistories(stockHist);
      setModalOpen({ ...modalOpen, stockHistoryModal: true });
    } else {
      setModalOpen({ ...modalOpen, stockHistoryModal: false });
    }
  }

  /**
   * CRUD Functions
   */

  // Validating nome and preco fields and if product already exists
  function validateForm() {
    if (product.newName.length === 0) {
      errorMsg(growl, `Digite um nome para o produto`);
      return false;
    }

    if (Number.isNaN(Number(product.preco)) || Number(product.preco) <= 0) {
      errorMsg(growl, `Informe um preço válido e maior que zero`);
      return false;
    }

    /**
     * Removes the current product from the list, so if it is an update,
     * do not accuse that the product already exists
     *
     * Case it's a create action, name will always be a empty string,
     * so the filter method will not filter any object.
     * */
    const listWithoutThisProduct = productList.filter(
      value => value.nome !== product.nome
    );

    const productAlreadyExists = listWithoutThisProduct.find(obj => {
      if (obj.nome.toLowerCase() === product.newName.toLowerCase()) {
        return true;
      }
      return false;
    });

    if (productAlreadyExists) {
      errorMsg(growl, `Produto já cadastrado no sistema!`);
      return false;
    }

    return true;
  }

  // Function used to both create and edit
  function handleSave(isUpdate) {
    if (!validateForm()) {
      return;
    }

    if (isUpdate) {
      ProductController.update(product).then(
        () => {
          fetchProducts();
          successMsg(growl, `${product.newName} atualizado com sucesso`);
        },
        () => errorMsg(growl, `Ocorreu um erro ao atualizar produto`)
      );
      closeModal();
      setProduct(new Product());
    } else {
      ProductController.create(product).then(
        () => {
          fetchProducts();
          successMsg(growl, `${product.newName} adicionado com sucesso`);
        },
        () => errorMsg(growl, `Ocorreu um erro ao adicionar produto`)
      );
      closeModal();
      setProduct(new Product());
    }
  }

  function handleDelete(p) {
    ProductController.delete(p.id).then(
      () => {
        fetchProducts();
        successMsg(growl, `${product.nome} excluido com sucesso`);
      },
      () => errorMsg(growl, `Ocorreu um erro ao excluir produto`)
    );
    setModalOpen({ ...modalOpen, deleteModal: false });
    setProduct(new Product());
  }

  function handleStockHistoryItem(stockHistory) {
    if (stockHistory.stockChange && stockHistory.stockAdded) {
      return (
        <tr id={stockHistory.id}>
          <td>
            <FiChevronUp size={28} color="green" />
          </td>
          <td>Estoque adicionado</td>
          <td>{stockHistory.date}</td>
          <td>{stockHistory.seller}</td>
          <td>+{stockHistory.quantity}</td>
        </tr>
      );
    }
    if (stockHistory.stockChange) {
      return (
        <tr id={stockHistory.id}>
          <td>
            <FiChevronDown size={28} color="red" />
          </td>
          <td>Estoque removido</td>
          <td>{stockHistory.date}</td>
          <td>{stockHistory.seller}</td>
          <td>+{stockHistory.quantity}</td>
        </tr>
      );
    }
    if (!stockHistory.stockChange) {
      return (
        <tr id={stockHistory.id}>
          <td>
            <FiChevronDown size={28} color="red" />
          </td>
          <td>{`Cliente ${stockHistory.client}`}</td>
          {/* <td>{`Venda ${stockHistory.saleId}`}</td> */}
          <td colSpan="2">{stockHistory.date}</td>
          <td>{`-${stockHistory.quantity}`}</td>
        </tr>
      );
    }

    return (
      <tr>
        <td>
          <h2>Ocorreu um erro com este item</h2>
        </td>
      </tr>
    );
  }
  return (
    <div>
      <Growl ref={growl} />

      <ListHeader
        btnText="Cadastrar Produto"
        btnFunction={openAddModal}
        filterList={filterList}
        placeHolder="Digite aqui o nome do produto"
      />
      <ProductList>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th colSpan="2">Qtd em estoque</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((p, idx) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{`R$${p.preco.toFixed(2)}`}</td>

              {p.manageStock ? <td>{p.currentStock}</td> : <td>0</td>}

              <td className="more-icon">
                <DropdownList>
                  <FiMoreVertical size={24} />
                  <DropdownContent>
                    <DropdownItem
                      type="button"
                      onClick={() => openEditModal(p)}
                    >
                      Editar produto
                    </DropdownItem>

                    <DropdownItem
                      type="button"
                      onClick={() => toggleDeleteModal(p, idx)}
                    >
                      Excluir produto
                    </DropdownItem>

                    <DropdownItem
                      type="button"
                      onClick={() => toggleStockHistoryModal(p)}
                    >
                      Visualizar histórico do estoque de {p.nome}
                    </DropdownItem>
                  </DropdownContent>
                </DropdownList>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductList>

      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={modalOpen.deleteModal}
        title="Excluir produto"
        msg={`Deseja realmente excluir o produto ${product.nome}?`}
        handleClose={() => toggleDeleteModal()}
        handleConfirm={() => handleDelete(product)}
      />

      {/* Add/Edit modal */}
      <ProductModal
        isOpen={modalOpen.addEditModal}
        onRequestClose={closeModal}
        closeTimeoutMS={450}
        overlayClassName="modal-overlay"
      >
        <h2>{modalTitle}</h2>
        <hr />
        <p>Nome</p>
        <input
          id="product-name"
          value={product.newName}
          onChange={e => setProduct({ ...product, newName: e.target.value })}
        />
        <p>Preço</p>
        <input type="number" value={product.preco} onChange={setPrice} />
        <CheckboxContainer>
          <Checkbox
            checked={product.manageStock}
            onChange={() =>
              setProduct({
                ...product,
                manageStock: !product.manageStock,
              })
            }
          />
          Gerenciar estoque
        </CheckboxContainer>
        <p>Estoque</p>
        <input
          type="number"
          value={product.currentStock}
          onChange={e => {
            setProduct({ ...product, currentStock: e.target.value });
          }}
          disabled={!product.manageStock}
        />
        <ModalButtonsContainer>
          <SecondaryButton onClick={() => closeModal()}>Fechar</SecondaryButton>
          <PrimaryButton onClick={() => handleSave(product.id)}>
            Salvar
          </PrimaryButton>
        </ModalButtonsContainer>
      </ProductModal>

      {/* StockHistory modal */}
      <StockHistoryModal
        isOpen={modalOpen.stockHistoryModal}
        onRequestClose={() => toggleStockHistoryModal()}
        closeTimeoutMS={0}
        overlayClassName="modal-overlay"
      >
        <div className="header">
          <p>Histórico de estoque de {product.nome}</p>
          <FiX
            size={24}
            color="#837B7B"
            onClick={() => toggleStockHistoryModal()}
          />
        </div>
        <hr />
        <table>
          <tbody>
            {stockHistories.map(doc => handleStockHistoryItem(doc))}
          </tbody>
        </table>
      </StockHistoryModal>
    </div>
  );
}
