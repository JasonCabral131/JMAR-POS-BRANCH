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
import RemittedTax from "./views/tax/RemittedTax";
import CashierSales from "./views/cashier/cashierSales";
import ProductSalesInformation from "./views/product/Sales";
import SubSales from "./views/sub-brand/Sales";
import BrandSalesinfo from "./views/brand/Sales";
import AllSalesInformation from "./views/Sales";
import RecentSale from "./views/Sales/Recent/RecentSale";
import CreateBlogInfo from "./views/Blog/createBLog";

import BlogPersonal from "./views/Blog/PersonalBlogContent/BlogPersonal";
import BlogPhotoAlbum from "./views/Blog/PersonalBlogContent/BlogPhotoAlbum";
import Transaaction from "./views/Sales/Transaction";
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
    path: "/branch/BlogPosting/creatingBlog",
    name: "Create Blog",
    component: CreateBlogInfo,
  },
  {
    exact: true,
    path: "/branch/BlogPosting/personal-blog-content",
    name: "Personal Blog",
    component: BlogPersonal,
  },
  {
    exact: true,
    path: "/branch/BlogPosting/personal-blog-content/blog-photo-album",
    name: "Blog Photo Album",
    component: BlogPhotoAlbum,
  },
  {
    exact: true,
    path: "/branch/inventory-item/brand/archived-brand",
    name: "Archived Brand",
    component: DeletedBrand,
  },
  {
    exact: true,
    path: "/branch/inventory-item/brand/:brandId",
    name: "Brand Sales",
    component: BrandSalesinfo,
  },
  {
    exact: true,
    path: "/branch/inventory-item/brand",
    name: "Brand",
    component: Brand,
  },
  {
    exact: true,
    path: "/branch/inventory-item/sub-brand/archived-brand-sub",
    name: "Archived Brand Subcategory",
    component: ArchivedSubcategory,
  },
  {
    exact: true,
    path: "/branch/inventory-item/sub-brand/:subBrandId",
    name: "Brand Subcategory Sales",
    component: SubSales,
  },
  {
    exact: true,
    path: "/branch/inventory-item/sub-brand",
    name: "Brand Subcategory",
    component: SubBrand,
  },
  {
    exact: true,
    path: "/branch/inventory-item/product/archived-product",
    name: "Archived Brand Subcategory",
    component: ArchivedProductDataInformation,
  },
  {
    exact: true,
    path: "/branch/inventory-item/product/:productId",
    name: "Product Sales",
    component: ProductSalesInformation,
  },
  {
    exact: true,
    path: "/branch/inventory-item/product",
    name: "Product",
    component: TheProduct,
  },

  {
    exact: true,
    path: "/branch/inventory-item/government-tax",
    name: "Government Tax",
    component: GovernmentTaxInfo,
  },
  {
    exact: true,
    path: "/branch/inventory-item/government-tax/government-tax-archived",
    name: "Archived Government Tax",
    component: ArchivedTax,
  },
  {
    exact: true,
    path: "/branch/branch-cashier-information/arhived-branch-cashier-information",
    name: "Archived Branch Cashier",
    component: ArchivedBranchCashier,
  },
  {
    exact: true,
    path: "/branch/branch-cashier-information/:cashierId",
    name: "Cashier Sales Information",
    component: CashierSales,
  },
  {
    exact: true,
    path: "/branch/branch-cashier-information",
    name: "Branch Cashier",
    component: CashierInformation,
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
  {
    exact: true,
    path: "/branch/tax/tax-remitted",
    name: "Government Remitting Tax",
    component: RemittedTax,
  },
  {
    exact: true,
    path: "/branch/sales/",
    name: "Sales Information",
    component: AllSalesInformation,
  },
  {
    exact: true,
    path: "/branch/sales/recent-sales-info",
    name: "Recent Sales Information",
    component: RecentSale,
  },
  {
    exact: true,
    path: "/branch/sales/transaction/:id",
    name: "Transaction Information",
    component: Transaaction,
  },
];

export default routes;
