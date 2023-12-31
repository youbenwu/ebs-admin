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
import ProductListPage from "./views/mall/product/list/ProductListPage";
import DataStatsListPage from "./views/stats/DataStatsListPage";
import ShopCategoryList from "./views/mall/shop/ShopCategoryList";
import ShopList from "./views/mall/shop/ShopList";
import MenuListPage from "./views/org/menu/MenuListPage";
import SysListPage from "./views/sys/list/SysListPage";
import ProductBsTypeListPage from "./views/mall/product/bstype/ProductBsTypeListPage";
import ProductTypeListPage from "./views/mall/product/type/ProductTypeListPage";
import ProductCategoryListPage from "./views/mall/product/category/ProductCategoryListPage";
import ProductEditPage from "./views/mall/product/list/ProductEditPage";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/hotel/register' element={<RegisterHotelPage/>}/>
        <Route path='/' element={<MainPage/>}>
            <Route path='/home' element={<HomePage/>}/>
            <Route path='/mall/order/list' element={<NoPage/>}/>
            <Route path='/mall/product/list' element={<ProductListPage/>}/>
            <Route path='/mall/product/edit' element={<ProductEditPage/>}/>
            <Route path='/mall/product/category/list' element={<ProductCategoryListPage/>}/>
            <Route path='/mall/shop/product/category/list' element={<ShopCategoryList/>}/>
            <Route path='/mall/shop/product/list' element={<ShopList/>}/>
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
            <Route path='/portal/data/stats/list' element={<DataStatsListPage/>}/>
        </Route>
        <Route path='/org/menus' element={<MenuListPage/>}/>
        <Route path='/sys/list' element={<SysListPage/>}/>
        <Route path='/mall/product/bstype/list' element={<ProductBsTypeListPage/>}/>
        <Route path='/mall/product/type/list' element={<ProductTypeListPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
