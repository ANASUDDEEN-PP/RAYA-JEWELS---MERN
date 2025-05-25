import StartPage from "../pages/Home/home"
import ViewProductPage from "../pages/viewProducts/viewProduct"
import CategoriesList from "../pages/categories/categories";
import CheckOut from "../pages/checkout/checkout"

const routeHelper = [
  {
    path: "/",
    comp: <StartPage />,
  },
  {
    path: "/view/product",
    comp: <ViewProductPage />,
  },
  {
    path: "/view/categories",
    comp: <CategoriesList />,
  },
  {
    path: "/checkout",
    comp: <CheckOut />,
  },
];

export default routeHelper;
