import Dashboard from "./views/dashboard/Dashboard";
import Brand from "./views/brand";
import DeletedBrand from "./views/brand/deletedBrand";
import SubBrand from "./views/sub-brand";
import ArchivedSubcategory from "./views/sub-brand/archivedData";
import TheProduct from "./views/product";
import { ArchivedProductDataInformation } from "./views/product/ArchivedProduct";
import GovernmentTaxInfo from "./views/tax";
import ArchivedTax from "./views/tax/archivedTax";
import CashierInformation from "./views/cashier";
import ArchivedBranchCashier from "./views/cashier/ArchivedCashierDetailes";
import CustomerInformation from "./views/customer";
import { ArchivedCustomerInformation } from "./views/customer/ArchivedInformation";
import DepositCustomer from "./views/deposit";
import DepositHistory from "./views/deposit/DepositHistory";
import ScheduleCashier from "./views/cashier/schedule";
import RolesPermission from "./views/roles_permission";
import ReportInformation from "./views/Report";
import BlogPosting from "./views/Blog";
const routes = [
  { path: "/branch/", exact: true, name: "Home", component: Dashboard },
  { path: "/branch/dashboard", name: "Dashboard", component: Dashboard },
  {
    exact: true,
    path: "/branch/BlogPosting",
    name: "Blog",
    component: BlogPosting,
  },
  {
    exact: true,
    path: "/branch/inventory-item/brand",
    name: "Brand",
    component: Brand,
  },
  {
    path: "/branch/inventory-item/brand/archived-brand",
    name: "Archived Brand",
    component: DeletedBrand,
  },
  {
    exact: true,
    path: "/branch/inventory-item/sub-brand",
    name: "Brand Subcategory",
    component: SubBrand,
  },
  {
    path: "/branch/inventory-item/sub-brand/archived-brand-sub",
    name: "Archived Brand Subcategory",
    component: ArchivedSubcategory,
  },
  {
    exact: true,
    path: "/branch/inventory-item/product",
    name: "Product",
    component: TheProduct,
  },
  {
    path: "/branch/inventory-item/product/archived-product",
    name: "Archived Brand Subcategory",
    component: ArchivedProductDataInformation,
  },
  {
    exact: true,
    path: "/branch/inventory-item/government-tax",
    name: "Government Tax",
    component: GovernmentTaxInfo,
  },
  {
    path: "/branch/inventory-item/government-tax/government-tax-archived",
    name: "Archived Government Tax",
    component: ArchivedTax,
  },
  {
    exact: true,
    path: "/branch/branch-cashier-information",
    name: "Branch Cashier",
    component: CashierInformation,
  },
  {
    path: "/branch/branch-cashier-information/arhived-branch-cashier-information",
    name: "Archived Branch Cashier",
    component: ArchivedBranchCashier,
  },
  {
    path: "/branch/branch-cashier-information/scheduling",
    name: "Archived Branch Cashier",
    component: ScheduleCashier,
  },
  {
    exact: true,
    path: "/branch/branch-customer-information",
    name: "Branch Customer",
    component: CustomerInformation,
  },
  {
    path: "/branch/branch-customer-information/arhived-branch-customer-information",
    name: "Archived Branch Customer",
    component: ArchivedCustomerInformation,
  },
  {
    exact: true,
    path: "/branch/deposit-customer/:depositId/:customerId",
    name: "Customer Deposit History",
    component: DepositHistory,
  },
  {
    exact: true,
    path: "/branch/deposit-customer",
    name: "Branch Deposit Customer",
    component: DepositCustomer,
  },
  {
    exact: true,
    path: "/branch/roles-permission",
    name: "Roles & Permission",
    component: RolesPermission,
  },
  {
    exact: true,
    path: "/branch/report-information",
    name: "Report Information",
    component: ReportInformation,
  },
];

export default routes;
