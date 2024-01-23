import UserFormComponent from "../Components/UserForm/UserFormComponent";
import Loading from "../Components/Loading";
import { useState } from "react";

import urlString from "..";

const SigninPage = () => {

  const [logOrSign, /*setLogOrSign*/] = useState("signin");
  const [failedSignin, setFailedSignin] = useState(false);
  const [loading, setLoading] = useState(false);

  //console.log(logOrSign)

  function SigninFetch(userObject){
      //console.log(userObject)
      try{
        fetch(`${urlString}/Auth/Register`,{
          method: "POST",
          headers:{"Content-Type": "application/json",
          },
          body: JSON.stringify(userObject)
        })
        .then(response=>response.json())
        .then(response=>{
          //console.log(response);
          if (Object.keys(response)[0]!=="email"){
            //console.log("Signin failed!")
            setFailedSignin(response[Object.keys(response)[1]])
          }
          else{
            //console.log("Signin success!")
            setFailedSignin("You're registration has been completed. Please Log in!")
          }
        })
        .catch(error=>{
            //console.log(error);
            //console.log("HIBA")
        })
      }catch(error){console.err(error)}
      setLoading(false)
    }
  

 
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    //console.log(e.target[0].value)
    let userObject={
      Email: e.target[0].value,
      Username: e.target[1].value,
      Password: e.target[2].value,
    }
    SigninFetch(userObject)
    //setLogOrSign(false)
  };

  return (
    <>
   <UserFormComponent status={logOrSign} isLogOrSignFailed={failedSignin} watchClick={onSubmit}/>
   {loading&&
    <Loading/>
    }
    </>
  )

};

export default SigninPage;
