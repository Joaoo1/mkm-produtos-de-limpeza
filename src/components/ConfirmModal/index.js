import React from 'react';
import PropTypes from 'prop-types';

import { SecondaryButton, WarningButton } from '../../styles/button';
import { ModalButtonsContainer } from '../../styles/modal';
import Modal from './styles';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  msg: PropTypes.string.isRequired,
};

const defaultProps = {
  title: '',
};
export default function ConfirmModal({
  isOpen,
  handleClose,
  handleConfirm,
  title,
  msg,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      overlayClassName="modal-overlay"
    >
      <h2>{title}</h2>
      <hr />
      <p>{msg}</p>
      <hr />

      <ModalButtonsContainer>
        <SecondaryButton type="button" onClick={handleClose}>
          Cancelar
        </SecondaryButton>
        <WarningButton onClick={handleConfirm}>Confirmar</WarningButton>
      </ModalButtonsContainer>
    </Modal>
  );
}

ConfirmModal.propTypes = propTypes;
ConfirmModal.defaultProps = defaultProps;
