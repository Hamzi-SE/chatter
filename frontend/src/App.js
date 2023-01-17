import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Home from './pages/Home/Home';
import Logout from './pages/Logout/Logout';
import Messenger from './pages/Messenger/Messenger';
import Error from './pages/Error/Error';

import { useDispatch, useSelector } from "react-redux"

import { callProfile } from './helpers/CallProfile';
import About from './pages/About/About';
import EditAbout from './pages/About/EditAbout';
import SingleUser from './pages/SingleUser/SingleUser';

export const toastOptions = {
  position: "top-right",
  autoClose: 1000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const Routing = ({ isAuthenticated }) => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path='/signup' element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
      <Route path="/logout" element={isAuthenticated ? <Logout /> : <Navigate to='/' />} />
      <Route path="/about" element={<About />} />
      <Route path="/user/:id" element={<SingleUser />} />
      <Route path="/editAbout" element={<EditAbout />} />
      <Route path="/messenger" element={<Messenger />} />

      {/* ERROR */}
      <Route path="*" element={<Error />} />

    </Routes>
  )
}

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.user);

  useEffect(() => {
    callProfile(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Hide footer on chat page
  useEffect(() => {
    if (location.pathname === "/messenger") {
      document.querySelector(".page-footer").style.display = "none";
    } else {
      document.querySelector(".page-footer").style.display = "block";
    }
  }, [location.pathname]);

  return (
    <>
      <ToastContainer option={toastOptions} />
      <Header />
      <Routing isAuthenticated={isAuthenticated} />
      <Footer />
    </>
  )
}

export default App