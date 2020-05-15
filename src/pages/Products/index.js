import React, { useState, useEffect } from 'react';
import { Growl } from 'primereact/growl';
import { Checkbox } from 'primereact/checkbox';
import {
  FiMoreVertical,
  FiX,
  // FiChevronDown,
  // FiChevronUp,
} from 'react-icons/fi';

// Styled Components
import { ProductModal, ModalButtonsContainer } from '../../styles/modal';
import { PrimaryButton, SecondaryButton } from '../../styles/button';
import { CheckboxContainer } from './styles';
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

export default function Products() {
  ProductModal.setAppElement('#root');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stockHistoryModalOpen, setStockHistoryModalOpen] = useState(false);
  const [stockHistories, setStockHistories] = useState([]);
  const [product, setProduct] = useState({});
  const [productList, setProductList] = useState([]);

  let growl = {};

  function setGrowlObj(el) {
    // console.log('growl: ', el);
    growl = el;
  }
  useEffect(() => {
    async function fetchProducts() {
      const products = await ProductController.index();
      setProductList(products);
    }
    fetchProducts();
  }, []);

  function cleanUpProductObject() {
    setProduct({
      nome: '',
      preco: '',
      manageStock: false,
      currentStock: 0,
    });
  }

  function setGrowl(severity, summary) {
    growl.show({ severity, summary });
  }

  // Function used to both create and edit
  function handleSave(isUpdate) {
    if (isUpdate) {
      ProductController.update(product, growl);
      setModalOpen(false);
    } else {
      ProductController.create(product, growl);
      cleanUpProductObject();
    }
  }

  function handleDelete(id) {
    ProductController.delete(id, growl);
    setDeleteModalOpen(false);
  }

  // Modal functions
  function closeModal() {
    // TODO: Check if there is data to save
    setModalOpen(false);
  }

  function openModal(p) {
    // If Product is {} add a new one, otherwise edit
    if (!p) {
      cleanUpProductObject();
      setModalTitle('Cadastrar novo Produto');
      setModalOpen(true);
    } else {
      setModalTitle('Editar Produto');
      setProduct(p);
      setModalOpen(true);
    }
  }

  function toogleDeleteModal(p) {
    cleanUpProductObject();
    if (p) {
      setProduct(p);
      setDeleteModalOpen(true);
    } else {
      setDeleteModalOpen(false);
    }
  }

  async function toogleStockHistoryModal(p) {
    // if (p) {
    //   setProduct(p);
    //   const stockHist = await StockHistoryController.index(p.id);
    //   setStockHistories(stockHist);
    //   setStockHistoryModalOpen(true);
    // } else {
    //   setStockHistoryModalOpen(false);
    // }
  }

  return (
    <div>
      <Growl ref={el => setGrowlObj(el)} />

      <ListHeader
        btnText="Cadastrar Produto"
        // btnFunction={() => setGrowl('error', 'teste')}
        btnFunction={openModal}
        placeHolder="Digite aqui o nome do produto"
      />
      <ProductList>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Qtd em estoque</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {productList.map(p => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>
                R$
                {p.preco}
              </td>
              {p.manageStock ? <td>{p.currentStock}</td> : <td>0</td>}
              <td className="more-icon">
                <DropdownList>
                  <FiMoreVertical size={24} />
                  <DropdownContent>
                    <DropdownItem onClick={() => openModal(p)}>
                      Editar produto
                    </DropdownItem>

                    <DropdownItem
                      type="button"
                      onClick={() => toogleDeleteModal(p)}
                    >
                      Excluir produto
                    </DropdownItem>

                    <DropdownItem onClick={() => toogleStockHistoryModal(p)}>
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
        isOpen={deleteModalOpen}
        title="Excluir produto"
        msg={`Deseja realmente excluir o produto ${product.nome}?`}
        handleClose={() => toogleDeleteModal(null)}
        handleConfirm={() => handleDelete(product.id)}
      />
      {/* Add/Edit modal */}
      <ProductModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        closeTimeoutMS={450}
        overlayClassName="modal-overlay"
      >
        <h2>{modalTitle}</h2>
        <hr />
        <p>Nome</p>
        <input
          id="product-name"
          value={product.nome}
          onChange={e => setProduct({ ...product, nome: e.target.value })}
        />
        <p>Preco</p>
        <input
          type="number"
          value={product.preco}
          onChange={e => setProduct({ ...product, preco: e.target.value })}
        />

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
      <ProductModal
        isOpen={stockHistoryModalOpen}
        onRequestClose={() => toogleStockHistoryModal(null)}
        closeTimeoutMS={0}
        className="modal modal-stock-history"
        overlayClassName="modal-overlay"
      >
        <div className="header d-flex-between">
          <p>Historico de estoque de {product.nome}</p>
          <FiX
            size={24}
            color="#837B7B"
            onClick={() => toogleStockHistoryModal(null)}
          />
        </div>
        <hr />
        <table>
          <tbody>
            {/* {stockHistories.map(doc => handleStockHistoryItem(doc))} */}
          </tbody>
        </table>
      </ProductModal>
    </div>
  );
}
