import UserFormComponent from "../Components/UserForm/UserFormComponent";
import StatusSettingComponent from "../Components/StatusSetting/StatusSettingComponent";
import RiskSettingComponent from "../Components/RiskSetting/RiskSettingComponent";


import { useEffect,  useState, useContext } from "react";
import { UserContext } from "..";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import urlString from "..";



const fetchAllStore = () => {
  try{
    console.log("fetching...");
    return fetch(`${urlString}/Store/GetAllStores`)
    .then((res) => res.json())
    .catch((err)=>console.error("Error during store fetch (first catch):"+err));
  }catch (error) {
    console.error("Error during store fetch (second catch)", error);
  };
 
};

const SettingPage = () => {

    const navigate= useNavigate();
    
    const [logOrSign, /*setLogOrSign*/] = useState("login");
    const [failedLogin, setFailedLogin] = useState(false);
    const [loading, setLoading] = useState(true);
  
    const [storeList, setStoreList] = useState(null);
    const [filteredStoreList, setFilteredStoreList] = useState(null);
    const [changedStore, setChangedStore] = useState(null);
    
    const {page}= useContext(UserContext);
    const {user}= useContext(UserContext);
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
      navigate("/");
    };


    
    //GET AND SAVED THE VISIT VISITS
    useEffect(() => {
      try{
        fetchAllStore()
        .then((stores) => {
         //setStoreList(stores);
        setFilteredStoreList(stores)
        }).catch((err)=>console.error("no stores",err))
      }catch(err){console.error("no stores",err)}
      setLoading(false)
    }, [changedStore]);
    
    console.log(loading)

    return (
     user?(
      user.hasAccess?
      <>
        {!filteredStoreList||loading?
          <Loading/> 
          :
          page==="Status"?
           <StatusSettingComponent stores={filteredStoreList}/>
           :
           <RiskSettingComponent stores={filteredStoreList}/>
          }
      </>
        :
      <>
        <h2>You don't have a permission yet. Please contact with the admin</h2>
      </>
     )
     :
     <>
     {loading?
      <Loading/> 
      :
     <UserFormComponent status={logOrSign} isLogOrSignFailed={failedLogin} watchClick={onSubmit}/>
     }
     </>
    )
  
  };
  
  export default SettingPage;
  