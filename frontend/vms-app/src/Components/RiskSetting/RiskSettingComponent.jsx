//import { Link } from "react-router-dom";
import "./RiskSetting.css";
import Loading from "../Loading";
//import { useContext } from "react";
import { UserContext } from "../..";
import { useEffect,  useState, useContext } from "react";
import urlString from "../..";


const updateRisk = (storeNumber, risk, user) => {
  //console.log("fetch: "+storeNumber+", "+risk)
  
  try{
    //console.log("put fetching...");
    return fetch(`${urlString}/Store/ChangeRisk?StoreNumber=${storeNumber}&Risk=${risk}`,{
      method: "PUT",
      headers:{
        'Authorization': `Bearer ${user.token}`,
    }})
    .then((res) => res.json())
    .catch((err)=>console.error("Error during store fetch (first catch):"+err));
  }catch (error) {
    console.error("Error during store fetch (second catch)", error);
  };
 
};

const updateAllRisk = (user) => {
  try{
    //console.log("put fetching...");
    return fetch(`${urlString}/Store/UpdateRisks`,{
      method: "PUT",
      headers:{
        'Authorization': `Bearer ${user.token}`,
    }})
    .then((res) => res.json())
    .catch((err)=>console.error("Error during store fetch (first catch):"+err));
  }catch (error) {
    console.error("Error during store fetch (second catch)", error);
  };
 
};


const RiskSettingComponent = ({ stores}) => {

  const {user}= useContext(UserContext);

  const [storeList, setStoreList] = useState(stores);
  const [filteredStoreList, setFilteredStoreList] = useState(stores);
  const [selectedCountry, setSelectedCountry] = useState("all");
  
  const [number, setNumber] = useState("all");
  const [name, setName] = useState("all");
  
  const [orderDirection, setOrderDirection] = useState(1);
  const [orderBy, setOrderBy] = useState("storeNumber");

  const [loading, setLoading] = useState(true)
  const [changeRisk, setChangeRisk] = useState(false)
  const [changeAllRisk, setChangeAllRisk] = useState(false)
  
  const [riskList, setRiskList] = useState(["Low","Medium","High","High-DC"])

  const [inputNumber, setInputNumber] = useState('')
  const [inputName, setInputName] = useState('')

  //console.log(changeAllRisk)
  function watchRiskChanger(e, storeNumber){
    e.preventDefault();
    //console.log(e)
    //console.log(storeNumber)
    setChangeRisk(storeNumber)
  }

  function setRisk(e){
    e.preventDefault();
    //console.log(e.target.textContent)
    if(e.target.textContent!=="Cancel")
    {
      //console.log(user);
      try{
        updateRisk(changeRisk, riskList.findIndex((element)=>element===e.target.textContent)+1, user)
        .then((storesData) => {
          setStoreList(storesData);
    
          }).catch((err)=>console.error("hiba (1st catch)",err))
        }catch(err){console.error("hiba (2nd catch)",err)}
     

    }
    setChangeRisk(false)
  }

  function setAllRisk(e){
    e.preventDefault();
    //console.log(e.target.textContent)
    if(e.target.textContent!=="Cancel")
    {
      try{
        updateAllRisk(user)
        .then((storesData) => {
          setStoreList(storesData);
    
          }).catch((err)=>console.error("hiba (1st catch)",err))
        }catch(err){console.error("hiba (2nd catch)",err)}
     

    }
    setChangeAllRisk(false)
  }

  function handleChange(event){
  //console.log(event)
    if(event.target.id==="number"){
      setInputNumber(event.target.value)
    }
    else if(event.target.id==="name"){
      setInputName(event.target.value)
    }
  }

  function watchClick(e){
    e.preventDefault()
    //console.log(e)

    //select store
    if(e.type==="submit")
    {
      setNumber(e.target[0].value!==""?e.target[0].value.toLowerCase():"all")
      setName(e.target[1].value!==""?e.target[1].value.toLowerCase():"all")
      //setLoading(true)  
    }

      
    else if(e.target.textContent==="Clear"){
      setNumber("all")
      setName("all")
      setInputNumber('')
      setInputName('')
    }

    //filters
    if(e.target.parentElement.className==="Country")
    {
      setSelectedCountry(e.target.textContent.toLowerCase())
     // setLoading(true)
    }


    //Ordering/sorting
    else if(e.target.textContent==="Store Number")
    {
      setOrderDirection(orderDirection*-1)
      setOrderBy("storeNumber")
      setLoading(true)
    }
    else if(e.target.textContent==="Store Name")
    {
      setOrderDirection(orderDirection*-1)
      setOrderBy("storeName")
      setLoading(true)
    }
    else if(e.target.textContent==="Risk")
    {
      setOrderDirection(orderDirection*-1)
      setOrderBy("risk")
      setLoading(true)
    }
    else if(e.target.textContent==="Set all risks to default")
    {
      setChangeAllRisk(true)
    }

    else if(e.target.className==="modal")
    {
      setChangeRisk(false);
    }
    else if(e.target.className==="modal2")
    {
      setChangeAllRisk(false);
    }

  }

  function sortByCustom(a,b){
    return a[orderBy]>b[orderBy]?1*orderDirection:-1*orderDirection
  }


  //Store (RISK, COUNTRY, FORMAT) Filter
  useEffect(() => {
    //console.log(name)
    //console.log(number)

    let FilterList=[selectedCountry,name,number]
    let keyList=["country","storeName","storeNumber"]
    let tempStoreList=storeList

    for(let i=0;i<FilterList.length;i++)
    {
      tempStoreList=FilterList[i]!=="all"?(tempStoreList.filter(store=>(store[keyList[i]].toString().toLowerCase().includes(FilterList[i])))):tempStoreList
    }

   
    tempStoreList&&setFilteredStoreList( tempStoreList.sort((a,b)=>sortByCustom(a,b)));
    setLoading(false)
    //console.log("Store-os UseEffect")

  }, [storeList, selectedCountry,orderDirection,orderBy, number, name]);

  
  return(
  
    <div className="MainPageContent">
     
     <div className="RiskSettingDashboard">
        <div className="RiskUpdaterButton">
          <button onClick={e=>watchClick(e)}>Set all risks to default</button>
        </div>

        <div className="StoreFilter">
          <form onSubmit={e=>watchClick(e)}>
            <label>Store Number:</label>
            <input type="text" id="number" value={inputNumber} onChange={e=>handleChange(e)}></input>
            <label>Store Name:</label>
            <input type="text" id="name" value={inputName} onChange={e=>handleChange(e)}></input>
            <button type="submit">Search</button>
            <button onClick={e=>watchClick(e)}>Clear</button>
          </form>
        </div>

      
        <div className="FilterButtons">
          <div className="Country">
            <label>Country: </label>
              <button disabled={selectedCountry==="all"&&true} onClick={e=>watchClick(e)}>All</button>
              <button disabled={selectedCountry==="czechia"&&true} onClick={e=>watchClick(e)}>Czechia</button>
              <button disabled={selectedCountry==="hungary"&&true} onClick={e=>watchClick(e)}>Hungary</button>
              <button disabled={selectedCountry==="slovakia"&&true} onClick={e=>watchClick(e)}>Slovakia</button>
          </div>
        </div>
      </div>
      {changeAllRisk !== false && (
        <div className="modal2"  onClick={(e=>watchClick(e))}>
          <div className="modal2-content">
            <h3>The risks for all stores will be changed based on the most recently imported TLT Portal data</h3>
            <table>
              <tbody>
                  <tr>
                    <td className="yesButton" onClick={setAllRisk}>
                      Approve
                    </td>
                  </tr>
                <tr>
                  <td className="cancelButton" onClick={() => setChangeAllRisk(false)}>
                    Cancel
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {changeRisk !== false && (
        <div className="modal" onClick={(e=>watchClick(e))}>
          <div className="modal-content">
            <div className="modal-content-UpperLine">
              <h3>Change store {changeRisk} risk to: 
              <button onClick={() => setChangeRisk(false)}>Close</button></h3>
            </div>
            <table>
              <tbody>
                {riskList.map((risk) => (
                  <tr key={risk}>
                    <td className={"riskSelectorButton"} onClick={setRisk}>
                      {risk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
          <th className={orderBy==="storeNumber"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Store Number</th>
            <th className={orderBy==="storeName"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Store Name</th>
            <th className={orderBy==="risk"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Risk</th>
          </tr>
        </thead>

        {!loading?

        <tbody>
          {filteredStoreList&&filteredStoreList.map(store => {
            return(
            <tr key={store.storeNumber}>
              <td>{store.storeNumber}</td>
              <td>{store.storeName}</td>
              <td name="risk" className={riskList[store.risk-1]} onClick={e=>watchRiskChanger(e, store.storeNumber)}>{riskList[store.risk-1]}</td>
            </tr>
            )

          })
          }
        </tbody>
        :
        <Loading/>}
      </table>

    </div>

  )
}

export default RiskSettingComponent;
