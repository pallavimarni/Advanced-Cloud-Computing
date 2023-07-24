import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [registered, setRegistered] = useState(false);
  const [passIcon, setPassIcon] = useState(false);
  const [cIcon, setCIcon] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };
  const handleClick = () => {
    setRegistered(false);
  };

  const secondhandleClick = () => {
    setRegistered(true);
  };

  const showPassword = () => {
    const passwordField = document.getElementById('passwordField');
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      setPassIcon(true);
    } else {
      passwordField.type = 'password';
      setPassIcon(false);
    }
  };

  const showCPassword = () => {
    const cPasswordField = document.getElementById('cPassword');
    if (cPasswordField.type === 'password') {
      cPasswordField.type = 'text';
      setCIcon(true);
    } else {
      cPasswordField.type = 'password';
      setCIcon(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const email = form.elements.email.value;
    const password = form.elements.password.value;

    const requestData = {
      email,
      password,
    };

    if (registered) {
      const name = form.elements.name.value;
      const confirmPassword = form.elements.cPassword.value;

      requestData.name = name;
      requestData.confirmPassword = confirmPassword;
    }

    const endpoint = registered ? 'signup' : 'login';
    const url = `https://7s1z4yffh5.execute-api.us-east-1.amazonaws.com/dev/${endpoint}`;

    try {
      const response = await axios.post(url, requestData);

      if (endpoint === 'signup') {
        // Show success message for signup
        setSuccessMessage(response.data.message);
        setErrorMessage('');

        // Redirect to the login page after successful signup
        navigateToLogin();
      } else {
        // Login successful
        // Store the user's email in sessionStorage
        sessionStorage.setItem('userEmail', email);

        // Show success message for login
        setSuccessMessage(response.data.message);
        setErrorMessage('');

        // Redirect to the PostStory component after successful login
        navigate('/');
      }
    } catch (error) {
      // Show error message
      setErrorMessage('An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="col-md-4 text-center my-3 margin">
      <h3>{!registered ? 'Login' : 'Sign Up'}</h3>
      <form className="my-3" id="login-form" onSubmit={handleSubmit}>
        {registered && (
          <div className="input-group col-md-4 my-4">
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                aria-label="Name"
                aria-describedby="addon-wrapping"
                name="name"
              />
            </div>
          </div>
        )}
        <div className="input-group col-md-4 my-4">
          <div className="input-group flex-nowrap">
            <span className="input-group-text" id="addon-wrapping">
              <i className="fa-solid fa-square-envelope custom-icon"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              aria-label="Email"
              aria-describedby="addon-wrapping"
              name="email"
            />
          </div>
        </div>

        <div className="input-group col-md-4 my-4">
          <div className="input-group flex-nowrap">
            <input
              id="passwordField"
              type="password"
              className="form-control"
              placeholder="Password"
              aria-label="Password"
              aria-describedby="addon-wrapping"
              name="password"
            />
            <span className="input-group-text" id="addon-wrapping">
              {!passIcon ? (
                <i className="fa-sharp fa-solid fa-eye" onClick={showPassword}></i>
              ) : (
                <i onClick={showPassword} className="fa-sharp fa-solid fa-eye-slash"></i>
              )}
            </span>
          </div>
          {!registered && (
            <h6 className="my-2 mx-2 login-signup"> Forgot Password? </h6>
          )}
        </div>

        {registered && (
          <div className="input-group col-md-4 my-4">
            <div className="input-group flex-nowrap">
              <input
                id="cPassword"
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                aria-label="Confirm Password"
                aria-describedby="addon-wrapping"
                name="cPassword"
              />
              <span className="input-group-text" id="addon-wrapping">
                {!cIcon ? (
                  <i className="fa-sharp fa-solid fa-eye" onClick={showCPassword}></i>
                ) : (
                  <i onClick={showCPassword} className="fa-sharp fa-solid fa-eye-slash"></i>
                )}
              </span>
            </div>
          </div>
        )}

        {registered && (
          <h6 className="login-signup" onClick={handleClick}>
            Already a user? Login.
          </h6>
        )}
        {!registered && (
          <h6 className="login-signup" onClick={secondhandleClick}>
            New User? Sign Up.
          </h6>
        )}

        <div className="col-12">
          <button type="submit" className="btn btn-primary my3">
            {!registered ? 'Login' : 'Signup'}
          </button>
        </div>

        <br />

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
