import React from 'react';
import logo from '../images/logo.png';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white ">
        <Link id="brand" className="navbar-brand" to="/">
          <img src={logo} alt="Bootstrap" width="300" height="60" />
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link id="hover" className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link id="hover" className="nav-link" to="/">
                Post Story
              </Link>
            </li>

            <li className="nav-item">
              <Link id="hover" className="nav-link" to="/feed">
                Feed
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
