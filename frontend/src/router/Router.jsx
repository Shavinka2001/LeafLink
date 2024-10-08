import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import Payment from "../pages/Payment";
import ManagerProfile from "../pages/ManagerProfile";
import Dashboard from "../pages/Dashboard"; 
import EmployeeManagement from "../pages/InventoryManagement";
import Settings from "../pages/PaymentManagment"; 
import Profile from "../pages/Profile";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/managerProfile" element={<ManagerProfile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route profile="/EmployeeManagement" element={<Profile/>} />

    </Routes>
  );
};

export default AppRouter;
