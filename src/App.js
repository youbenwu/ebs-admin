import React from "react";
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import LoginPage from "./views/login/LoginPage";
import MainPage from "./views/main/MainPage";
import OrgPage from "./views/org/OrgPage";
import OrgEditPage from "./views/org/OrgEditPage";
import AccountListPage from "./views/org/AccountListPage";
import RoleListPage from "./views/org/RoleListPage";
import RegisterHotelPage from "./views/hotel/RegisterHotelPage";
import ChannelListPage from "./views/portal/ChannelListPage";
import AdvertListPage from "./views/portal/AdvertListPage";
import UserListPage from "./views/user/UserListPage";
import HotelListPage from "./views/hotel/HotelListPage";
import MsgListPage from "./views/msg/MsgListPage";
import MsgSendPage from "./views/msg/MsgSendPage";
import HotelDeviceListPage from "./views/hotel/HotelDeviceListPage";
import NoPage from "./NoPage";
import HomePage from "./views/home/HomePage";
import HotelRoomTypeListPage from "./views/hotel/HotelRoomTypeListPage";
import HotelRoomListPage from "./views/hotel/HotelRoomListPage";
import HotelCustomerListPage from "./views/hotel/HotelCustomerListPage";
import HotelWorkListPage from "./views/hotel/HotelWorkListPage";
import HotelPage from "./views/hotel/HotelPage";
import HotelStayListPage from "./views/hotel/HotelStayListPage";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/hotel/register' element={<RegisterHotelPage/>}/>
        <Route path='/' element={<MainPage/>}>
            <Route path='/home' element={<HomePage/>}/>
            <Route path='/mall/order/ticketorders' element={<NoPage/>}/>
              <Route path='/org/info' element={<OrgPage/>}/>
              <Route path='/org/edit' element={<OrgEditPage/>}/>
              <Route path='/org/accounts' element={<AccountListPage/>}/>
              <Route path='/org/roles' element={<RoleListPage/>}/>
              <Route path='/portal/channels' element={<ChannelListPage/>}/>
              <Route path='/portal/adverts' element={<AdvertListPage/>}/>
              <Route path='/user/users' element={<UserListPage/>}/>

              <Route path='/message/list' element={<MsgListPage/>}/>
              <Route path='/message/send' element={<MsgSendPage/>}/>
              <Route path='/hotel/hotels' element={<HotelListPage/>}/>
              <Route path='/hotel/devices' element={<HotelDeviceListPage/>}/>
              <Route path='/hotel/roomtypes' element={<HotelRoomTypeListPage/>}/>
             <Route path='/hotel/rooms' element={<HotelRoomListPage/>}/>
             <Route path='/hotel/customers' element={<HotelCustomerListPage/>}/>
            <Route path='/hotel/works' element={<HotelWorkListPage/>}/>
            <Route path='/hotel/info' element={<HotelPage/>}/>
            <Route path='/hotel/stays' element={<HotelStayListPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
