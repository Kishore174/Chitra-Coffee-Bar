import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import Dashboard from './components/Dashboard';
import './App.css'; // Ensure this includes your flex layout sty
import Navbar from './components/Navbar';
import MyShop from './components/Shps/MyShop';
import AddShop from './components/Shps/AddShop';
import Main from './components/Main';
import Table from './components/Aduit/Table';
import AddAudit from './components/Aduit/Form/AddAudit';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import AddAduit from './components/Aduit/Pages/AddAduit';
import TeaAduit from './components/Aduit/Pages/audit/TeaAduit';
import Coffee from './components/Aduit/Pages/audit/Coffee';
import LiveSnacks from './components/Aduit/Pages/audit/LiveSnacks';
import Bunzo from './components/Aduit/Pages/audit/Bunzo';
import Bakshanam from './components/Aduit/Form/Bakshanam';
import Next01 from './components/Aduit/Pages/Next01';
import InsideKitichen from './components/Aduit/Pages/InsideKitichen';
import OutSideShop from './components/Aduit/Pages/OutSideShop';
import Branding from './components/Aduit/Pages/Branding';
import Auditers from './components/Aduit/Pages/Auditers/Auditers';
import AddAuditer from './components/Aduit/Pages/Auditers/AddAuditer';
import Setting from './components/Aduit/Pages/Setting/Setting';
import Rotes from './components/Aduit/Pages/Setting/Rotes';
import SetRoutes from './components/Aduit/Pages/SetRoutes';
import Employee from './components/Aduit/Pages/Employee/Employee';
import Stock from './components/Aduit/Pages/Stock&Store/Stock';
import { WallPainting } from './components/Aduit/Pages/WallPanting/WallPanting';
import Recording from './components/Aduit/Pages/Recording/Recording';
 
 

function App() {
  return (
    <BrowserRouter>
      {/* <div className="flex    min-h-screen">
        <SideMenu />
        <div className="flex-1 flex flex-col">
          <div className="">
            <Navbar />
          </div>
          <main className="flex-1 p-4"> */}
            <Routes>
            <Route path='/' element={<Login />}/>

              <Route path='/' element={<Main />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="myshop" element={<MyShop />} />
              <Route path="AddShop" element={<AddShop />} />
              <Route path="aduit" element={<Table />} />
              <Route path="Add-audit" element={<AddAduit />} />
              <Route path="Profile" element={<Profile />} />
              <Route path="Tea" element={<TeaAduit />} />
              <Route path="coffee" element={<Coffee/>} />
              <Route path="livesnacks" element={<LiveSnacks/>} />
              <Route path="Bunzo" element={<Bunzo/>} />
              <Route path="bakshanm" element={<Bakshanam/>} />
              <Route path="nextProcess" element={<Next01/>} />
              <Route path="Kitchenarea" element={<InsideKitichen/>} />
              <Route path="Outsideshop" element={<OutSideShop/>} />
              <Route path="Branding" element={<Branding/>} />
              <Route path="Auditers" element={<Auditers/>} />
              <Route path="add-Auditers" element={<AddAuditer/>} />
              <Route path="setting" element={<Setting/>} />
              <Route path="rotes" element={<Rotes/>} />
              <Route path="SetRoutes" element={<SetRoutes/>} />
              <Route path="employee" element={<Employee/>} />
              <Route path="Stock" element={<Stock/>} />
              <Route path="Wallpanting" element={<WallPainting/>} />
              <Route path="Recording" element={<Recording/>} />
















            
              




              
              </Route>
              <Route path="signup" element={<Signup />} />

              {/* <Route path="/login" */}

              {/* Add other routes here */}
            </Routes>
          {/* </main>
        </div>
      </div> */}
    </BrowserRouter>
  );
}

export default App;
