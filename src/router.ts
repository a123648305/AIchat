import { createBrowserRouter, redirect } from "react-router-dom";
import App from './App';
import Pie from './Pie';

const router = createBrowserRouter([
    {
      id: "root",
      path: "/",
      Component: App,
    },
    {
      path: "/pie",
      Component: Pie,
      loader: () => {
        console.log("pie");
        return {}
      },
    //   async action() {
    //     return redirect("/");
    //   },
    },
  ]);
export default router;


