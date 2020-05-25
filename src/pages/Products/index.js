import React, { useState, useEffect } from 'react';
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

export default function Products() {
  let growl = {};

  function setGrowlObj(el) {
    growl = el;
  }

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

  // Function used to both create and edit
  function handleSave(isUpdate) {
    if (isUpdate) {
      ProductController.update(product, growl);
      setModalOpen(false);
    } else {
      ProductController.create(product, growl);
      cleanUpProductObject();
      setModalOpen({ ...modalOpen, addEditModal: false });
    }
  }

  function handleDelete(id) {
    ProductController.delete(id, growl);
    setModalOpen({ ...modalOpen, deleteModal: false });
  }

  // Modal functions
  function closeModal() {
    // TODO: Check if there is data to save
    setModalOpen({ ...modalOpen, addEditModal: false });
  }

  function openAddModal() {
    cleanUpProductObject();
    setModalTitle('Cadastrar novo Produto');
    setModalOpen({ ...modalOpen, addEditModal: true });
  }

  function openEditModal(p) {
    setModalTitle('Editar Produto');
    setProduct(p);
    setModalOpen({ ...modalOpen, addEditModal: true });
  }

  function toggleDeleteModal(p) {
    cleanUpProductObject();
    if (p) {
      setProduct(p);
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

  function handleStockHistoryItem(stockHistory) {
    if (stockHistory.stockChange && stockHistory.stockAdded) {
      return (
        <tr id={stockHistory.id}>
          <td>
            <FiChevronUp size={28} color="green" />
          </td>
          <td>Estoque adicionado</td>
          <td>{stockHistory.date.toDate().toLocaleString()}</td>
          <td>{stockHistory.seller}</td>
          <td>+{stockHistory.quantity}</td>
        </tr>
      );
    }
    if (stockHistory.stockChange) {
      return (
        <tr>
          <td>
            <FiChevronDown size={28} color="red" />
          </td>
          <td>Estoque removido</td>
          <td>{stockHistory.date.toDate().toLocaleString()}</td>
          <td>{stockHistory.seller}</td>
          <td>+{stockHistory.quantity}</td>
        </tr>
      );
    }
    if (!stockHistory.stockChange) {
      return (
        <tr>
          <td>
            <FiChevronDown size={28} color="red" />
          </td>
          <td>{`Venda ${stockHistory.saleId}`}</td>
          <td>{stockHistory.date.toDate().toLocaleString()}</td>
          <td>{`Cliente ${stockHistory.client}`}</td>
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
      <Growl ref={el => setGrowlObj(el)} />

      <ListHeader
        btnText="Cadastrar Produto"
        btnFunction={openAddModal}
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
          {productList.map(p => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{`R$${p.preco}`}</td>

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
                      onClick={() => toggleDeleteModal(p)}
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
        handleConfirm={() => handleDelete(product.id)}
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
