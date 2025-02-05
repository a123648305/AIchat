import React from 'react';
import ReactDOM from 'react-dom/client';
import { XProvider } from '@ant-design/x';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import 'uno.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <XProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
        <RouterProvider
          router={router}
          fallbackElement={<p>Initial Load...</p>}
        />
      </XProvider>
    </React.StrictMode>,
  );
}
