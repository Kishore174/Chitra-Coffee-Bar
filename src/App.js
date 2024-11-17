import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import "./App.css"; // Ensure this includes your flex layout sty
import MyShop from "./components/Shps/MyShop";
import AddShop from "./components/Shps/AddShop";
import Main from "./components/Main";
import Table from "./components/Aduit/Table";
import Profile from "./components/Profile";
import Login from "./components/Login";
// import Signup from "./components/Signup";
import AddAduit from "./components/Aduit/Pages/AddAduit";
import TeaAduit from "./components/Aduit/Pages/audit/TeaAduit";
import Coffee from "./components/Aduit/Pages/audit/Coffee";
import LiveSnacks from "./components/Aduit/Pages/audit/LiveSnacks";
import Bunzo from "./components/Aduit/Pages/audit/Bunzo";
import Bakshanam from "./components/Aduit/Form/Bakshanam";
// import Next01 from './components/Aduit/Pages/Next01';
// import InsideKitichen from "./components/Aduit/Pages/InsideKitichen";
// import OutSideShop from './components/Aduit/Pages/OutSideShop';
// import Brandings from './components/Aduit/Pages/Brandings';
import Auditers from "./components/Aduit/Pages/Auditers/Auditers";
import AddAuditer from "./components/Aduit/Pages/Auditers/AddAuditer";
import Setting from "./components/Aduit/Pages/Setting/Setting";
import Rotes from "./components/Aduit/Pages/Setting/Rotes";
import SetRoutes from "./components/Aduit/Pages/Setting/SetRoutes";
import Employee from "./components/Aduit/Pages/Employee/Employee";
import Stock from "./components/Aduit/Pages/Stock&Store/Stock";
import { WallPainting } from "./components/Aduit/Pages/WallPanting/WallPanting";
import Recording from "./components/Aduit/Pages/Recording/Recording";
import AuditReport from "./components/Report/AuditReport";
import BakerProducts from "./components/Aduit/Pages/Setting/BakerProducts";
import Dressing from "./components/Aduit/Pages/Dressing/Dressing";
import BrandName from "./components/Aduit/Pages/Setting/BrandName";
import { Toaster } from "react-hot-toast";
import InsideKitchens from "./components/Aduit/Pages/Kitchen/InsideKitchens";
import LiveSnacksName from "./components/Aduit/Pages/Setting/LiveSnacksName";
import InsideShop from "./components/Aduit/Pages/insideall/InsideShop";
import OutSideShop from "./components/Aduit/Pages/Outsideall/OutSideShop";
import Branding from "./components/Aduit/Pages/Branding/Branding";
import AuthProvider from "./context/AuthProvider";
import Page404 from "./components/Page404";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* <div className="flex    min-h-screen">
        <SideMenu />
        <div className="flex-1 flex flex-col">
          <div className="">
            <Navbar />
          </div>
          <main className="flex-1 p-4"> */}
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="signup" element={<Signup />} /> */}
          <Route path="*" element={<Page404 />} />
          <Route
            element={
              <ProtectedRoute allowedRoles={["super-admin", "auditor"]} />
            }
          >
            <Route path="/" element={<Main />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="audit" element={<Table />} />
              <Route path="add-audit/:id" element={<AddAduit />} />
              <Route path="profile" element={<Profile />} />
              <Route path="tea/:auditId" element={<TeaAduit />} />
              <Route path="coffee/:auditId" element={<Coffee />} />
              <Route path="livesnacks/:auditId" element={<LiveSnacks />} />
              <Route path="bunzo/:auditId" element={<Bunzo />} />
              <Route path="bakshanm" element={<Bakshanam />} />
              <Route path="insideshop/:auditId" element={<InsideShop />} />

              {/* <Route path="nextProcess" element={<Next01/>} /> */}
              {/* <Route path="Kitchenarea" element={<InsideKitichen />} /> */}
              {/* <Route path="Outsideshop/:auditId" element={<OutSideShop/>} /> */}
              <Route path="branding/:auditId" element={<Branding />} />
              <Route path="employee/:auditId" element={<Employee />} />
              <Route path="Stock/:auditId" element={<Stock />} />
              <Route path="wallpanting/:auditId" element={<WallPainting />} />
              <Route path="recording" element={<Recording />} />
              <Route path="report/:auditId" element={<AuditReport />} />
              <Route path="dressing/:auditId" element={<Dressing />} />
              <Route path="outsideshop/:auditId" element={<OutSideShop />} />
              <Route path="kitchen/:auditId" element={<InsideKitchens />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["super-admin"]} />}>
            <Route path="/" element={<Main />}>
              <Route path="myshop" element={<MyShop />} />
              <Route path="addshop" element={<AddShop />} />
              <Route path="setting" element={<Setting />} />
              <Route path="auditers" element={<Auditers />} />
              <Route path="add-auditers" element={<AddAuditer />} />
              <Route path="routes" element={<Rotes />} />
              <Route path="set-routes" element={<SetRoutes />} />
              <Route path="backeryproducts" element={<BakerProducts />} />
              <Route path="brandName" element={<BrandName />} />
              <Route path="livesnackname" element={<LiveSnacksName />} />
            </Route>
          </Route>
          {/* <Route path="/login" */}

          {/* Add other routes here */}
        </Routes>
        {/* </main>
        </div>
      </div> */}
        <Toaster
          position="top-right"
          containerStyle={{
            top: 10,
          }}
          toastOptions={{
            className: "",
            style: {
              background: "#575555",
              color: "white",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
