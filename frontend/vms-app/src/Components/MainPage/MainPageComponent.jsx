//import { Link } from "react-router-dom";
import "./MainPage.css";
import Loading from "../Loading";
//import { useContext } from "react";
//import { UserContext } from "../..";
import { useEffect,  useState, useContext } from "react";


const MainPageComponent = ({visits, stores/*, watchClick*/}) => {

  const [allVisits, setAllVisits] = useState(visits);
  const [filteredVisits, setFilteredVisits] = useState(visits);
  const [storeList, setStoreList] = useState(stores);
  const [filteredStoreList, setFilteredStoreList] = useState(stores);
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [startDate, setStartDate] = useState(new Date().getFullYear().toString()+"-03");
  const [endDate, setEndDate] = useState(new Date().getFullYear().toString()+"-"+(new Date().getMonth()+1).toString());
  
  const [loading, setLoading] = useState(true)
  

  function watchClick(e){
    e.preventDefault()
    
    if(e.type==="submit")
    {
      setStartDate(e.target[0].value)
      setEndDate(e.target[1].value)
      setFilteredVisits(allVisits.filter(visit=>{
        let visitDate=visit.date.substring(3,10).split(".").reverse().join("-")
        return visitDate>=e.target[0].value&&visitDate<=e.target[1].value
      }))
    }

    if(e.target.parentElement.className=="Risk")
    {
      setSelectedRisk(e.target.name)
      setLoading(true)
    }
    else if(e.target.parentElement.className=="Format")
    {
       setSelectedFormat(e.target.textContent)
       setLoading(true)
    }
    else if(e.target.parentElement.className=="Country")
    {
      setSelectedCountry(e.target.textContent)
      setLoading(true)
    }
  }

  useEffect(() => {
  
    console.log(selectedFormat)
    console.log(selectedRisk)

    let FilterList=[selectedRisk, selectedFormat, selectedCountry]
    let keyList=["risk", "format", "country"]
    let tempStoreList=storeList

    for(let i=0;i<FilterList.length;i++)
    {
      tempStoreList=FilterList[i]!=="All"?(tempStoreList.filter(store=>(store[keyList[i]]===FilterList[i]))):tempStoreList
    }
    setFilteredStoreList(tempStoreList);
    setLoading(false)
  }, [selectedFormat,selectedRisk, selectedCountry]);

  console.log(filteredStoreList)

  return(
    !loading?
    <div className="MainPageContent">
      <div className="DateFilter">
        <form onSubmit={e=>watchClick(e)} className="DateFilterForm">
          <input type="month" min="2021-03" defaultValue={startDate} id="start"></input>
          <input type="month" min="2021-03" defaultValue={endDate} id="end"></input>
          <br></br>
          <button type="submit">Search between these dates</button>
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
        <div className="Risk">
          <label>Risk Level: </label>
          <button disabled={selectedRisk==="All"&&true} name="All" onClick={e=>watchClick(e)}>All</button>
          <button disabled={selectedRisk==="1"&&true} name="1" onClick={e=>watchClick(e)}>Low</button>
          <button disabled={selectedRisk==="2"&&true} name="2" onClick={e=>watchClick(e)}>Medium</button>
          <button disabled={selectedRisk==="3"&&true} name="3" onClick={e=>watchClick(e)}>High</button>
          <button disabled={selectedRisk==="4"&&true} name="4" onClick={e=>watchClick(e)}>High-DC</button>
        </div>
        <div className="Format">
        <label>Format: </label>
          <button disabled={selectedFormat==="All"&&true} onClick={e=>watchClick(e)}>All</button>
          <button disabled={selectedFormat==="HM"&&true} onClick={e=>watchClick(e)}>HM</button>
          <button disabled={selectedFormat==="SF"&&true} onClick={e=>watchClick(e)}>SF</button>
          <button disabled={selectedFormat==="DC"&&true} onClick={e=>watchClick(e)}>DC</button>
        </div>
       
      </div>
      <table>
        <thead>
          <tr>
            <th>Store Number</th>
            <th>Store Name</th>
            <th>Number of visits</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisits&&filteredStoreList&&filteredStoreList.map(store => {
            return(
            <tr>
              <td>{store.storeNumber}</td>
              <td>{store.storeName}</td>
              <td>{filteredVisits.filter(v=>v.storeNumber===store.storeNumber).length}</td>
            </tr>)
          })
          }
        </tbody>
      </table>
    </div>
    :
    <Loading/>
  )
}

export default MainPageComponent;
