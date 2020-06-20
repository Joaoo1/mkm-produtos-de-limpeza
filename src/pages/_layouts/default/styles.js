import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  display: grid;
  grid-template-areas:
    'menu header'
    'menu main';
  grid-template-rows: 100px 1fr;
  grid-template-columns: 250px 1fr;
`;

/* Page header styles */
export const Header = styled.header`
  grid-area: header;
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 30px;

  div.header-icons {
    display: flex;
    justify-content: space-between;
    width: 90px;
    margin-right: 40px;

    svg:hover {
      transition: opacity 0.2s;
      opacity: 0.2;
    }
  }
`;

/* Left nav styles */
export const Menu = styled.aside`
  grid-area: menu;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  background-color: #feffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  /* Class for NavLink change color when menu button is selected */
  .active {
    color: #fff;
    background-color: var(--primary-color);
    border-radius: 7px;
  }

  .active p,
  .active svg {
    color: #fff;
  }
`;

export const MenuHeader = styled.header`
  width: 100%;
  display: flex;
  justify-content: center;
  img {
    width: 140px;
    margin-top: 10px;
  }
`;

export const MenuBody = styled.main`
  margin-top: 20px;
  width: 100%;
  height: 100%;
  a:hover {
    background-color: rgb(217, 231, 236);
    border-radius: 7px;
  }
  a {
    display: flex;
    text-decoration: none;
    color: #004a62;
    padding: 20px;
    margin: 0 10px;

    p {
      margin-top: 2.8px;
    }
    svg {
      margin-right: 18px;
    }
  }

  ul {
    list-style: none;

    li {
      transition: background-color 0.4s;
    }
  }
`;

export const MenuFooter = styled.footer`
  width: 100%;
  display: flex;
  padding: 20px;
  p,
  small {
    margin: 10px 4px 0 10px;
    white-space: nowrap;
  }

  small {
    color: #bcbfbe;
  }

  img {
    width: 60px;
    height: 58px;
  }
`;

export const Main = styled.main`
  grid-area: main;
  background-color: #feffff;
  margin: 0px 30px 20px 30px;
  padding: 5px 30px;
  border-radius: 8px;
  overflow-y: scroll;
  width: auto;
  height: auto;
`;
