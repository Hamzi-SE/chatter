import React from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'
import Loader from '../Loader/Loader';
import "./header.css"

const Header = () => {


    const { user, isAuthenticated, loading } = useSelector(state => state.user);

    let activeStyle = {
        color: "white",
        fontWeight: "bold",
        fontSize: "1rem",
        transition: "all 0.2s ease-out",

    }



    if (loading) {
        return <Loader />
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <NavLink className="navbar-brand font-weight-bold" to="/">Chatter <i className="fa-regular fa-comments"></i></NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto mr-5">
                        <li className="nav-item mr-3">
                            <NavLink to="/" style={({ isActive }) => isActive ? activeStyle : { color: "white" }} className="nav-link" >Home</NavLink>
                        </li>
                        {isAuthenticated || <li className="nav-item mr-3">
                            <NavLink className="nav-link" style={({ isActive }) => isActive ? activeStyle : { color: "white" }} to="/login">Login</NavLink>
                        </li>}
                        {isAuthenticated || <li className="nav-item mr-3">
                            <NavLink className="nav-link" style={({ isActive }) => isActive ? activeStyle : { color: "white" }} to="/signup">Register</NavLink>
                        </li>}
                        {isAuthenticated && <li className="nav-item mr-3">
                            <NavLink className="nav-link" style={({ isActive }) => isActive ? activeStyle : { color: "white" }} to="/messenger">Messenger</NavLink>
                        </li>}
                        {isAuthenticated && <li className="nav-item mr-3">
                            <NavLink className="nav-link" style={({ isActive }) => isActive ? activeStyle : { color: "white" }} to="/about">About</NavLink>
                        </li>}
                        {isAuthenticated && <li className="nav-item mr-3">
                            <NavLink className="nav-link" style={({ isActive }) => isActive ? activeStyle : { color: "white" }} to="/logout">Logout</NavLink>
                        </li>}


                    </ul>

                    {isAuthenticated && <NavLink className="nav-link" to="/about"><img className='header-user-image' src={user?.avatar?.url} alt={user?.name} /></NavLink>}
                </div>
            </nav>
        </>
    )
}

export default Header