import React from 'react';
import auth from '../../server/Authentication';

export default function Dashboard() {
  function handleLogOut() {
    auth.LogOut();
  }
  return (
    <>
      <div>I did it</div>
      <button type="button" onClick={handleLogOut}>
        Sair
      </button>
    </>
  );
}
