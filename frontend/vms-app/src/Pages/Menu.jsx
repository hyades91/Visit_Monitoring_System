import UserFormComponent from "../Components/UserForm/UserFormComponent";


import { useEffect,  useState, useContext } from "react";
import { UserContext } from "..";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import urlString from "..";


const Menu = () => {

    const navigate= useNavigate();
    
    const [logOrSign, /*setLogOrSign*/] = useState("login");
    const [failedLogin, setFailedLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    const {user}= useContext(UserContext);
    const {page}= useContext(UserContext);
    const context= useContext(UserContext);
    
    //POST FETCH (LOGIN)
    function LoginFetch(userObject){
      console.log(userObject)
  
        fetch(`${urlString}/Auth/Login`,{
          method: "POST",
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userObject)
        })
        .then(response=>{ 
          console.log(response)
          return response.json()
        })
        .then(response=>{ //Ha jó az URL és van szerver, akkor ezt dobja vissza, 200-as ha jó a jelszó, vagy pl.400-as ha nem
          console.log(response);
          if (response["Bad credentials"]){
            console.log("Login failed!")
            setFailedLogin(response["Bad credentials"])
          }
          else{
            console.log("Login success!");
            setFailedLogin(null);
            context.setUser(response);
          }
          setLoading(false)
        }).catch(error=>{ //Ez pl rossz URL-nél van, vagy a szerver nem működik
            console.log(error);
      })
    }
      
  
    const onSubmit = (e) => {
      e.preventDefault();
      console.log(e.target[0].value)
      let userObject={
        Email: e.target[0].value,
        Password: e.target[1].value,
      }
      setLoading(true)
      LoginFetch(userObject);
      //setLogOrSign(false);
    };

    const watchClick=(e)=>{
      e.preventDefault();
      console.log(e)
      context.setPage(e.target.name)
      navigate("/mainpage")

    }

    return (
     user?(
      user.hasAccess?
      <div className="MainMenuButtons">
          <button name="All" onClick={e=>watchClick(e)}>Visits</button>
          <button name="Missing" onClick={e=>watchClick(e)}>Underperformed Visits</button>
          <button name="Deactivate" onClick={()=>navigate("/setsites")}>Deactivate Sites</button>
      </div>
        :
      <>
        <h2>You don't have a permission yet. Please contact with the admin</h2>
      </>
     )
     :
     <>
     <UserFormComponent status={logOrSign} isLogOrSignFailed={failedLogin} watchClick={onSubmit}/>
     </>
    )
  
  };
  
  export default Menu;
  