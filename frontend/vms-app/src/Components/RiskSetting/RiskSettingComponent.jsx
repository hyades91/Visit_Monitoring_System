//import { Link } from "react-router-dom";
import "./RiskSetting.css";
import Loading from "../Loading";
//import { useContext } from "react";
//import { UserContext } from "../..";
import { useEffect,  useState, useContext } from "react";
import urlString from "../..";


const ChangeStoreStatus = (storeNumber) => {
  try{
    console.log("put fetching...");
    return fetch(`${urlString}/Store/ChangeActivity?StoreNumber=${storeNumber}`,{
      method: "PUT",
    })
    .then((res) => res.json())
    .catch((err)=>console.error("Error during store fetch (first catch):"+err));
  }catch (error) {
    console.error("Error during store fetch (second catch)", error);
  };
 
};


const RiskSettingComponent = ({ stores}) => {

 
  const [storeList, setStoreList] = useState(stores);
  const [filteredStoreList, setFilteredStoreList] = useState(stores);
  
 
  const [selectedCountry, setSelectedCountry] = useState("all");
  
  const [number, setNumber] = useState("all");
  const [name, setName] = useState("all");

  
  const [orderDirection, setOrderDirection] = useState(1);
  const [orderBy, setOrderBy] = useState("storeNumber");

  const [loading, setLoading] = useState(true)
  const [activate, setActivate] = useState(null)
  


  function watchActivate(e, storeNumber){
    e.preventDefault()
    //setLoading(true)
    console.log(storeNumber)
    try{
    ChangeStoreStatus(storeNumber)
    .then((storesData) => {
      setStoreList(storesData);

      }).catch((err)=>console.error("hiba (1st catch)",err))
    }catch(err){console.error("hiba (2nd catch)",err)}
  }



  function watchClick(e){
    e.preventDefault()
    console.log(e)

    //select TIME interval
    if(e.type==="submit")
    {
      setNumber(e.target[0].value!==""?e.target[0].value.toLowerCase():"all")
      setName(e.target[1].value!==""?e.target[1].value.toLowerCase():"all")
      //setLoading(true)  
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
    else if(e.target.textContent==="Status")
    {
      setOrderDirection(orderDirection*-1)
      setOrderBy("active")
      setLoading(true)
    }
  }

  function sortByCustom(a,b){
    return a[orderBy]>b[orderBy]?1*orderDirection:-1*orderDirection
  }


  //Store (RISK, COUNTRY, FORMAT) Filter
  useEffect(() => {
    console.log(name)
    console.log(number)

    let FilterList=[selectedCountry,name,number]
    let keyList=["country","storeName","storeNumber"]
    let tempStoreList=storeList

    for(let i=0;i<FilterList.length;i++)
    {
      tempStoreList=FilterList[i]!=="all"?(tempStoreList.filter(store=>(store[keyList[i]].toString().toLowerCase().includes(FilterList[i])))):tempStoreList
    }

   
    setFilteredStoreList( tempStoreList.sort((a,b)=>sortByCustom(a,b)));
    setLoading(false)
    console.log("Store-os UseEffect")

  }, [storeList, selectedCountry,orderDirection,orderBy, number, name]);

  
  return(
  
    <div className="MainPageContent">
      <div className="StoreFilter">
        <form onSubmit={e=>watchClick(e)} className="DateFilterForm">
          <label>Store Number:</label>
          <input type="text" id="number"></input>
          <label>Store Name:</label>
          <input type="text" id="name"></input>
          <button type="submit">Search</button>
          <button type="submit">Clear</button>
        </form>
      </div>
      <div className="FilterButtons">
      <div className="Country">
        <label>Format: </label>
          <button disabled={selectedCountry==="All"&&true} onClick={e=>watchClick(e)}>All</button>
          <button disabled={selectedCountry==="Czechia"&&true} onClick={e=>watchClick(e)}>Czechia</button>
          <button disabled={selectedCountry==="Hungary"&&true} onClick={e=>watchClick(e)}>Hungary</button>
          <button disabled={selectedCountry==="Slovakia"&&true} onClick={e=>watchClick(e)}>Slovakia</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th className={orderBy==="storeNumber"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Store Number</th>
            <th className={orderBy==="storeName"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Store Name</th>
            <th className={orderBy==="active"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Status</th>
          </tr>
        </thead>
        {!loading?
        <tbody>
          {filteredStoreList&&filteredStoreList.map(store => {
            return(
            <tr key={store.storeNumber}>
              <td>{store.storeNumber}</td>
              <td>{store.storeName}</td>
              <td name="status" className={store.active===true?"activated":"deactivated"} onClick={e=>watchActivate(e, store.storeNumber)}>{store.active?"Activated":"Deactivated"}</td>
            </tr>)
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
