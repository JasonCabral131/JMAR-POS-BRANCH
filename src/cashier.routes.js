import Dashboard from "./views/CashierViews/Dashboard/index";
import Transaction from "./views/Sales/Transaction";
import AllSalesInformation from "./views/Sales";
import RecentSale from "./views/Sales/Recent/RecentSale";
const routes = [
  { path: "/cashier/", exact: true, name: "Home", component: Dashboard },
  { path: "/cashier/dashboard", name: "Dashboard", component: Dashboard },
  {
    exact: true,
    path: "/cashier/sales/",
    name: "Sales Information",
    component: AllSalesInformation,
  },
  {
    exact: true,
    path: "/cashier/sales/recent-sales-info",
    name: "Recent Sales Information",
    component: RecentSale,
  },
  {
    exact: true,
    path: "/cashier/sales/transaction/:id",
    name: "Transaction Information",
    component: Transaction,
  },
];

export default routes;
