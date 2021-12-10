import Dashboard from "./views/CashierViews/Dashboard/index";

const routes = [
  { path: "/cashier/", exact: true, name: "Home", component: Dashboard },
  { path: "/cashier/dashboard", name: "Dashboard", component: Dashboard },
];

export default routes;
