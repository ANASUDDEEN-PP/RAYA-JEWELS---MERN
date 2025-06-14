import StartPage from "../pages/Home/home"
import ViewProductPage from "../pages/viewProducts/viewProduct"
import CategoriesList from "../pages/categories/categories";
import CheckOut from "../pages/checkout/checkout"

//Authentication pages
import LoginPage from "../pages/Auth/login";

//Admin Module
import AdminDashboard from "../pages/Admin/Dashboard/Dahsboard";
import UserListPage from "../pages/Admin/Users/userList";
import ProductList from "../pages/Admin/product/productList"
import OrderList from "../pages/Admin/Orders/orders"
import SettingsMain from "../pages/Admin/Settings/settings";
import AboutUs from "../pages/Admin/Settings/settingsSub";
import ProfileSettings from "../pages/Admin/Settings/profileSettings"
import CollectionSettings from "../pages/Admin/Settings/collectionSettings";

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
  {
    path: "/auth",
    comp: <LoginPage />,
  },
  {
    path: "/admin-dash",
    comp: <AdminDashboard />,
  },
  {
    path: "/admin-user",
    comp: <UserListPage />,
  },
  {
    path: "/admin-product",
    comp: <ProductList />,
  },
  {
    path: "/admin-orders",
    comp: <OrderList />,
  },
  {
    path: "/admin-settings",
    comp: <SettingsMain />,
  },
  {
    path: "/admin-settings-about",
    comp: <AboutUs />,
  },
  {
    path: "/admin-settings-profile",
    comp: <ProfileSettings />,
  },
  {
    path: "/admin-settings-collections",
    comp: <CollectionSettings />,
  },
];

export default routeHelper;
