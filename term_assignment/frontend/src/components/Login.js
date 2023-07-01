import React, {useState} from 'react';

const Login = () => {

 const [registered, setRegistered] = useState(false);

 const [passIcon, setpassIcon] =useState(false);
 const [cIcon, setCIcon] =useState(false);

 const handleClick =() => {
    setRegistered(false);
 }

 const secondhandleClick =() => {
    setRegistered(true);
 }

 const showPassword = () => {
var x= document.getElementById("passwordField");
if(x.type==="password"){
x.type="text";
setpassIcon(true);
}
else{
    x.type="password";
    setpassIcon(false);
}

 }

 const showCPassword = () => {
    var x= document.getElementById("cPassword");
    if(x.type==="password"){
        x.type="text";
        setCIcon(true);
        }
        else{
            x.type="password";
            setCIcon(false);
        }
 }
  return (
<div className="col-md-4 text-center my-3 margin">
    <h3>{!registered ? "Login" : "Sign Up"}</h3>
    <form className="my-3" id="login-form" >
        {registered && 
    <div className ="input-group col-md-4 my-4">
        <div className="input-group flex-nowrap">
        <span className="input-group-text" id="addon-wrapping"><i class="fa-solid fa-user"></i></span>
  <input type="text" className="form-control" placeholder="Name" aria-label="Name" aria-describedby="addon-wrapping"/>

</div>
</div>}
        <div className ="input-group col-md-4 my-4">
        <div className="input-group flex-nowrap">
  <span className="input-group-text" id="addon-wrapping"><i className="fa-solid fa-square-envelope custom-icon"></i></span>
  <input type="text" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="addon-wrapping"/>
</div>
</div>

<div className="input-group col-md-4 my-4">
<div className="input-group flex-nowrap">
  <input id="passwordField" type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="addon-wrapping"/>
    <span className="input-group-text" id="addon-wrapping"> {!passIcon ? <i class="fa-sharp fa-solid fa-eye" onClick ={showPassword}></i> : <i onClick ={showPassword}className="fa-sharp fa-solid fa-eye-slash"></i>  }</span>
</div>
{!registered &&      
<h6 className ="my-2 mx-2 login-signup"> Forgot Password? </h6>
}
</div>

{registered && 
<div className="input-group col-md-4 my-4">
<div className="input-group flex-nowrap">
  <input id ="cPassword" type="password" className="form-control" placeholder="Confirm Password" aria-label="Confirm Password" aria-describedby="addon-wrapping"/>
    <span className="input-group-text" id="addon-wrapping"> {!cIcon ? <i class="fa-sharp fa-solid fa-eye" onClick ={showCPassword}></i> : <i onClick ={showCPassword}className="fa-sharp fa-solid fa-eye-slash"></i> }</span>
</div>
</div>} 
{registered && <h6 className ="login-signup" onClick ={handleClick}> Already a user? Login . </h6>} 
{!registered &&  <h6 className ="login-signup" onClick = {secondhandleClick}> New User? Sign Up. </h6>}
        <div className= "col-12">
<button type="button" class="btn btn-primary my3">{!registered ? "Login" : "Signup" }</button>
        </div>
    </form>
</div>
  );
};

export default Login;
