import { createBrowserRouter, redirect } from 'react-router-dom';
import App from './App';
import Pie from './Pie';
import Map from './map';

const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    Component: Map,
  },
  {
    path: '/map',
    Component: Map,
  },
  {
    path: '/pie',
    Component: Pie,
    loader: () => {
      console.log('pie');
      return {};
    },
    //   async action() {
    //     return redirect("/");
    //   },
  },
]);
export default router;
