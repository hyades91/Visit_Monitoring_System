import UserFormComponent from "../Components/UserForm/UserFormComponent";
import MainPageComponent from "../Components/MainPage/MainPageComponent";


import { useEffect,  useState, useContext } from "react";
import { UserContext } from "./..";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import urlString from "./..";


//GET FINISHED VISITS
const fetchAllVisit = () => {
  try{
    console.log("fetching...");
    return fetch(`${urlString}/Visit/GetFinishedVisit`)
    .then((res) => res.json())
    .catch((err)=>console.error("Error during visit fetch (first catch):"+err));
  }catch (error) {
    console.error("Error during visit fetch (second catch)", error);
  };
 
};

const fetchAllStore = () => {
  try{
    console.log("fetching...");
    return fetch(`${urlString}/Visit/GetActiveStores`)
    .then((res) => res.json())
    .catch((err)=>console.error("Error during store fetch (first catch):"+err));
  }catch (error) {
    console.error("Error during store fetch (second catch)", error);
  };
 
};



const MainPage = () => {

    const navigate= useNavigate();
    
    const [logOrSign, /*setLogOrSign*/] = useState("login");
    const [failedLogin, setFailedLogin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [allVisits, setAllVisits] = useState(null);
    const [filteredVisits, setFilteredVisits] = useState(null);
    const [storeList, setStoreList] = useState(null);
    const [filteredStoreList, setFilteredStoreList] = useState(null);
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
      //setLogOrSign(false);
    };


    //MAKE A STORELIST BASED ON FETCHED VISITS
    /*function allStore(visits){
      let tempStoreNumberList=[]
      visits.forEach(visit=>{
        if(!tempStoreNumberList.includes(visit.storeNumber)){
          tempStoreNumberList.push(visit.storeNumber);
        }
      })
      setStoreList(tempStoreNumberList.sort());
      setFilteredStoreList(tempStoreNumberList.sort());
    }
    */

    /*
    function clickFunction(e){
      e.preventDefault()
      let riskLevelObject={
        "Low": "1",
        "Medium": "2",
        "High": "3",
        "High-DC": "4",
      }
      console.log(e)
      let riskLevel=riskLevelObject[e.target.textContent]
      console.log(riskLevel)
      riskLevel?setFilteredStoreList(storeList.filter(store=>store.risk===riskLevel)):setFilteredStoreList(storeList)
    }
*/

    //GET AND SAVED THE VISIT VISITS
    useEffect(() => {
      try{
        fetchAllVisit()
        .then((visits) => {
         setAllVisits(visits);
         setFilteredVisits(visits);
        setLoading(false);
        }).catch((err)=>console.error("no visits",err))
      }catch(err){console.error("no visits",err)}
    }, []);

    useEffect(() => {
      try{
        fetchAllStore()
        .then((stores) => {
         setStoreList(stores);
         setFilteredStoreList(stores);
        setLoading(false);
        }).catch((err)=>console.error("no stores",err))
      }catch(err){console.error("no stores",err)}
    }, []);


    console.log(storeList)
    console.log(allVisits)

    return (
     user?(
      user.hasAccess?
      <>
        {loading?
          <Loading/> 
          :
          <MainPageComponent visits={filteredVisits} stores={filteredStoreList} /*watchClick={clickFunction}*//>
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
  
  export default MainPage;
  