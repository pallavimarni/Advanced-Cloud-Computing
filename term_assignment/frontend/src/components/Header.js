import React from 'react';
import logo from '../images/logo.png';
import { Link, useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = () => {
    // Clear the email from sessionStorage
    sessionStorage.removeItem('userEmail');
    // Redirect the user to the login page
    navigate('/login');
  };

  // Check if the user is logged in (email is in sessionStorage)
  const isLoggedIn = sessionStorage.getItem('userEmail');

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white ">
        <Link id="brand" className="navbar-brand" to="/login">
          <img src={logo} alt="Bootstrap" width="300" height="60" />
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
            {/* Show different links based on user login status */}
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link id="hover" className="nav-link" to="/post">
                    Post Story
                  </Link>
                </li>
                <li className="nav-item">
                  <Link id="hover" className="nav-link" to="/feed">
                    Feed
                  </Link>
                </li>
                <li className="nav-item">
                  <Link id="hover" className="nav-link" to="/edits">
                   View Story Edits
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link id="hover" className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
      
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
