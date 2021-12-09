import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { CashierRolesPermission } from "./Cashier";
import { CustomerRolesAndPermission } from "./Customer/Customer";

const RolesPermission = (props) => {
  return (
    <div className="card p-2">
      <div className="card-body">
        <h1 className="header-card-information p-1">
          <span>Roles and Permission</span>
        </h1>

        <Tabs defaultActiveKey="cashier" className="mb-3">
          <Tab eventKey="cashier" title="Cashier">
            <CashierRolesPermission />
          </Tab>
          <Tab eventKey="customer" title="Customer">
            <CustomerRolesAndPermission />
          </Tab>
          <Tab eventKey="inventory-management" title="Contact"></Tab>
        </Tabs>
      </div>
    </div>
  );
};
export default RolesPermission;
