import React from 'react';
import App from './App.tsx';
import Portfolio from './Portfolio.tsx';

export default function Root() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/app') return <App />;
  return <Portfolio />;
}
