//import { Link } from "react-router-dom";
import "./UserForm.css";
//import { useContext } from "react";
//import { UserContext } from "../..";


const UserFormComponent = ({status, isLogOrSignFailed, watchClick}) => {
  
  return(
    <div className="LoginForm">
    <form onSubmit={(event)=>watchClick(event)}>
    <div className="LoginInputs">

      <label>Email address: </label>
      <br></br>
      <input type="text" id="input" />
     
      {status==="signin"?
       <>
        <br></br>
        <label>Username: </label>
        <br></br>
        <input type="text" id="input" />
        </>
      :""}
      
      <br></br>
      <label>Password: </label>
      <br></br>
      <input type="password" id="input" />

    </div>

    <div className="buttons">
      <button type="submit">{status==="login"?"Log in":"Sign up"}</button>
    </div>

  </form>
  {isLogOrSignFailed&&
  <div id="failedLogOrSign">{isLogOrSignFailed}</div>}
  </div>
       )
}

export default UserFormComponent;
