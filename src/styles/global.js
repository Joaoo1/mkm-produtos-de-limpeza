import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  :root{
    --height-button: 46px;
    --width-button-modal: 180px;
    --primary-font-color: #004A62;
    --primary-color: #06C1FF;
    --main-table-border-radius: 10px;
  }

  *{
    margin: 0;
    padding: 0;
    outline:0;
    box-sizing:border-box;
  }

  html, body, #app {
    min-height: 100%;
  }

  body {
    background-color: rgba(6,193,255,0.15);
    font: bold 15px 'Roboto Slab', sans-serif;
    -webkit-font-smoothing: antialiased;
    color: var(--primary-font-color);
  }

  input {
    font: 300 15px 'Roboto Slab', sans-serif;
    border: 1px solid rgba(0, 169, 225, 0.20) !important;
    padding-left: 20px;
    font-size: 16px;
    height: var(--height-button);
  }

  button:hover {
    opacity: 0.8;
    -moz-box-shadow:    inset 0 0 7px #0000002c;
    -webkit-box-shadow: inset 0 0 7px #0000002c;
    box-shadow:         inset 0 0 12px #0000002c;
  }

  ::placeholder, .p-autocomplete input::placeholder {
    opacity: 0.8;
    font-weight: 300;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  }
  ::-webkit-scrollbar {
    width: 10px;  
  }
  ::-webkit-scrollbar-thumb {
    background-color: #b9eafa;
    border-radius: 10px;
  }

/* Modal */ 
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:rgba(0,0,0,0.25);
    opacity: 0;
    transition: opacity 450ms ease-in-out;
  }
  
  .ReactModal__Overlay--after-open{
    opacity: 1;
  }

  .ReactModal__Overlay--before-close{
    opacity: 0;
  }

  .flex-nowrap {
    display: flex;
    flex-wrap: nowrap;
  }
`;
