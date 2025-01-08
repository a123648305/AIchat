import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { XProvider } from '@ant-design/x';
import 'uno.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <XProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
        <App />
      </XProvider>
    </React.StrictMode>,
  );
}
