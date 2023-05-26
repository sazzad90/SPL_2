import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Executive/Home';
import PECHome from './components/PEC/PECHome';
import DeptHeadHome from './components/DeptHead/DeptHeadHome';
import AdvisorHome from './components/Advisor/AdvisorHome';
import { Routes,Route } from 'react-router-dom';
import OTP from './components/OTP';
 
import Notice from './components/Executive/EventNotice';
import TitlePage from './components/TitlePage';
import Fixture from './components/Fixture';
import  {BrowserRouter}  from 'react-router-dom';
import LogOut from './components/Executive/LogOut';
function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<TitlePage/>}/>
      <Route path="/Fixture" element={<Fixture/>}/>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/login" element={<Login/>} />
      <Route path="/logout" element={<LogOut/>} />
      <Route path="/Home/:email/*" element={<Home/>} /> 
      <Route path="/PECHome/:email/*" element={<PECHome/>} /> 
      <Route path="/AdvisorHome/:email/*" element={<AdvisorHome/>} /> 
      <Route path="/DeptHeadHome/:email/*" element={<DeptHeadHome/>} /> 
      <Route path="/OTP" element={<OTP/>} />     
    </Routes> 
    </BrowserRouter>



    </>
    
  );
}
export default App;
