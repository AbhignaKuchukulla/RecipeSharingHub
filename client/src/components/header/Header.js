import React from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { resetState } from "../../redux/slices/userAuthorSlice";

function Header() {
  const { loginUserStatus, currentUser } = useSelector(
    (state) => state.userAuthoruserAuthorLoginReducer
  );

  const dispatch = useDispatch();

  function signOut() {
    // Remove token from local storage
    localStorage.removeItem('token');
    dispatch(resetState());
  }

  return (
    <nav
      className="navbar navbar-expand-sm fs-5 shadow-sm"
      style={{ backgroundColor: "var(--light-olive)" }}
    >
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img src={logo} alt="Logo" width="60px" className="rounded" />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {loginUserStatus === false ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/" style={{ color: "white" }}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup" style={{ color: "white" }}>
                    SignUp
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signin" style={{ color: "white" }}>
                    SignIn
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/signin"
                  style={{ color: "white" }}
                  onClick={signOut}
                >
                  <p className="fs-3">Welcome {currentUser.username},</p>
                  Signout
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
