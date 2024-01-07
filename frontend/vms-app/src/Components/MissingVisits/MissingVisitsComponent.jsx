//import { Link } from "react-router-dom";
import "./MissingVisits.css";
import Loading from "../Loading";
//import { useContext } from "react";
//import { UserContext } from "../..";
import { useEffect,  useState, useContext } from "react";
//Excel export
import ExportToExcel from '../../ExportToExcel.jsx'

const MissingVisitsComponent = ({visits, stores/*, watchClick*/}) => {

  const [allVisits, setAllVisits] = useState(visits);
  const [filteredVisits, setFilteredVisits] = useState(visits);
  const [storeList, setStoreList] = useState(stores);
  const [filteredStoreList, setFilteredStoreList] = useState(stores);
  const [filteredUnderPerformedStoreList, setFilteredUnderPerformedStoreList] = useState(stores);

  const [selectedRisk, setSelectedRisk] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedReason, setSelectedReason] = useState("All");

  const [startDate, setStartDate] = useState(new Date().getMonth()<3?(new Date().getFullYear()-1).toString()+"-03":new Date().getFullYear().toString()+"-03");
  const [endDate, setEndDate] = useState(new Date().getMonth()!==0?(new Date().getFullYear().toString()+"-"+(new Date().getMonth()).toString()):(new Date().getFullYear()-1).toString()+"-12");
  
  const [durationInMonth, setDurationInMonth] = useState((Number(endDate.substring(5))+12*Number(endDate.substring(0,4)))-(Number(startDate.substring(5))+12*Number(startDate.substring(0,4)))+1);

  const [orderDirection, setOrderDirection] = useState(1);
  const [orderBy, setOrderBy] = useState("storeNumber");

  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState(false)
  
  
  //Excel
  const [data, setData] = useState([])
  const fileName = `Underperformed_visits_${startDate}-${endDate}`;
  
  useEffect(() => {
    const customHeadings = filteredUnderPerformedStoreList.map(store =>({
      "Store Number":store.storeNumber,
      "Store Name":store.storeName,
      "Performed visits":performedVisits(store),
      "Missing visits":requiredVisits(store)-performedVisits(store)>0?requiredVisits(store)-performedVisits(store):"",
      "Expected visits":requiredVisits(store)
  }))
    setData(customHeadings) 

  }, [filteredVisits,filteredUnderPerformedStoreList])



  function watchClick(e){
    e.preventDefault()
    console.log(e)

    //select TIME interval
    if(e.type==="submit")
    {
      if(startDate!==e.target[0].value||endDate!==e.target[1].value){
        setStartDate(e.target[0].value)
        setEndDate(e.target[1].value)
        setDurationInMonth(1+(Number(e.target[1].value.substring(5))+12*Number(e.target[1].value.substring(0,4)))-(Number(e.target[0].value.substring(5))+12*Number(e.target[0].value.substring(0,4))))
        setLoading(true)
    
      }
      
    }

    //filters
    if(e.target.parentElement.className==="Risk")
    {
      setSelectedRisk(e.target.name)
      setLoading(true)
    }
    else if(e.target.parentElement.className==="Format")
    {
       setSelectedFormat(e.target.textContent)
       setLoading(true)
    }
    else if(e.target.parentElement.className==="Country")
    {
      setSelectedCountry(e.target.textContent)
      setLoading(true)
    }
    else if(e.target.parentElement.className==="Reason")
    {
       setSelectedReason(e.target.textContent)
       setLoading(true)
    }
    else if(e.target.parentElement.className==="Reason")
    {
       setSelectedReason(e.target.textContent)
       setLoading(true)
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
    else if(e.target.textContent==="Performed visits")
    {
      setOrderDirection(orderDirection*-1)
      setOrderBy("visits")
      setLoading(true)
    }
    else if(e.target.textContent==="Missing visits")
    {
      setOrderDirection(orderDirection*-1)
      setOrderBy("missingVisits")
      setLoading(true)
    }
    else if(e.target.textContent==="Expected visits")
    {
      setOrderDirection(orderDirection*-1)
      setOrderBy("expectedVisits")
      setLoading(true)
    }
    
  }

  function sortByCustom(a,b){

    //Order by visits
    if (orderBy==="visits"){
      return performedVisits(a)>performedVisits(b)?1*orderDirection:-1*orderDirection
    }
    //Order by missing visits
    else if (orderBy==="missingVisits"){
      return requiredVisits(a)-performedVisits(a)>requiredVisits(b)-performedVisits(b)?1*orderDirection:-1*orderDirection
    }
    //Order by expected visits
    else if (orderBy==="expectedVisits"){
      return requiredVisits(a)>requiredVisits(b)?1*orderDirection:-1*orderDirection
    }
    //Order by storeNumber or storeName
    else{
      return a[orderBy]>b[orderBy]?1*orderDirection:-1*orderDirection
    }
    
  }

  function performedVisits(store){
    return filteredVisits.filter(v=>v.storeNumber===store.storeNumber).length
  } 

  function requiredVisits(store){
    switch (store.risk){
      case "1": return Math.floor(durationInMonth/2);
      case "2": return Math.floor(durationInMonth/3*2);
      case "3": return Math.floor(durationInMonth);
      case "4": return Math.floor(durationInMonth*2);
    }
    
  }

  //Store (RISK, COUNTRY, FORMAT) Filter
  useEffect(() => {
  
    console.log(selectedFormat)
    console.log(selectedRisk)
    //VISIT 
    let tempVisitList=allVisits
    //Reason
    tempVisitList=tempVisitList.filter(visit=>selectedReason==="All"?true:visit.type===selectedReason)
    //Date
    setFilteredVisits(tempVisitList.filter(visit=>{
      let visitDate=visit.date.substring(3,10).split(".").reverse().join("-")
      return visitDate>=startDate&&visitDate<=endDate
    }))

    //STORE
    let FilterList=[selectedRisk, selectedFormat, selectedCountry]
    let keyList=["risk", "format", "country"]
    let tempStoreList=storeList

    for(let i=0;i<FilterList.length;i++)
    {
      tempStoreList=FilterList[i]!=="All"?(tempStoreList.filter(store=>(store[keyList[i]]===FilterList[i]))):tempStoreList
    }

    setFilteredStoreList(tempStoreList)

  }, [selectedFormat, selectedRisk, selectedCountry, orderDirection, orderBy, startDate, endDate, allVisits, selectedReason]);


  useEffect(() => {

    let tempStoreList=filteredStoreList

    //Stores with underperformed visits
    tempStoreList=tempStoreList.filter(store=>requiredVisits(store)-performedVisits(store)>0)
   
    setFilteredUnderPerformedStoreList( tempStoreList.sort((a,b)=>sortByCustom(a,b)));
    setLoading(false)
  }, [filteredVisits, filteredStoreList]);

  console.log(filteredStoreList)
  console.log("duration: "+durationInMonth)
  console.log(selectedStore)

  return(
  
    <div className="MainPageContent">

<div className="Dashboard">
      <div className="DatabaseUpdateInfo">
      <h1>Missing Visits</h1>
      <p>Last uploaded visit: {allVisits[0].date+" "+allVisits[0].storeName}</p>
      </div>

      <div className="Filters">
      <div className="DateFilter">
      <label>Date: </label><br></br>
        <form onSubmit={e=>watchClick(e)} className="DateFilterForm">
          <input type="month" min="2021-03" defaultValue={startDate} id="start"></input>
          <input type="month" min="2021-03" defaultValue={endDate} id="end"></input>
          <br></br>
          <button type="submit">Search between these dates</button>
        </form>
      </div>


  
      {selectedStore !== false && (
        <div className="modal">
          <div className="modal-content">
          <button onClick={() => setSelectedStore(false)}>Close</button>
            <table>
              <thead><h3>Store {selectedStore.storeNumber} {selectedStore.storeName}  visits:</h3>
                <tr>
                  <th>Date</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.filter(visit=>visit.storeNumber===selectedStore.storeNumber).map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.date}</td>
                    <td>{visit.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="FilterButtons">
        <div className="Country">
          <label>Country: </label><br></br>
          <button disabled={selectedCountry==="All"&&true} onClick={e=>watchClick(e)}>All</button>
          <button disabled={selectedCountry==="Czechia"&&true} onClick={e=>watchClick(e)}>Czechia</button>
          <button disabled={selectedCountry==="Hungary"&&true} onClick={e=>watchClick(e)}>Hungary</button>
          <button disabled={selectedCountry==="Slovakia"&&true} onClick={e=>watchClick(e)}>Slovakia</button>
        </div>
        <div className="Risk">
          <label>Risk Level: </label><br></br>
          <button disabled={selectedRisk==="All"&&true} name="All" onClick={e=>watchClick(e)}>All</button>
          <button disabled={selectedRisk==="1"&&true} name="1" onClick={e=>watchClick(e)}>Low</button>
          <button disabled={selectedRisk==="2"&&true} name="2" onClick={e=>watchClick(e)}>Medium</button>
          <button disabled={selectedRisk==="3"&&true} name="3" onClick={e=>watchClick(e)}>High</button>
          <button disabled={selectedRisk==="4"&&true} name="4" onClick={e=>watchClick(e)}>High-DC</button>
        </div>
        <div className="Format">
         <label>Format: </label><br></br>
          <button disabled={selectedFormat==="All"&&true} onClick={e=>watchClick(e)}>All</button>
          <button disabled={selectedFormat==="HM"&&true} onClick={e=>watchClick(e)}>HM</button>
          <button disabled={selectedFormat==="SF"&&true} onClick={e=>watchClick(e)}>SF</button>
          <button disabled={selectedFormat==="DC"&&true} onClick={e=>watchClick(e)}>DC</button>
        </div>
        <div className="Reason">
          <label>Reason: </label><br></br>
          <button disabled={selectedReason==="All"&&true} onClick={e=>watchClick(e)}>All</button>
          <button disabled={selectedReason==="Regular"&&true} onClick={e=>watchClick(e)}>Regular</button>
        </div>
      </div>
</div>

      <div className="ExportButton">
        <ExportToExcel apiData={data} fileName={fileName} />
      </div>
</div>


      <table>
        <thead>
          <tr>
            <th className={orderBy==="storeNumber"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Store Number</th>
            <th className={orderBy==="storeName"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Store Name</th>
            <th className={orderBy==="visits"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Performed visits</th>
            <th className={orderBy==="missingVisits"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Missing visits</th>
            <th className={orderBy==="expectedVisits"?"markedColoumn":"notMarkedColoumn"} onClick={e=>watchClick(e)}>Expected visits</th>
          </tr>
        </thead>
        {!loading?
        <tbody>
          {filteredVisits&&filteredUnderPerformedStoreList&&filteredUnderPerformedStoreList.map(store => {
            return(
            <tr key={store.storeNumber} onClick={()=>setSelectedStore(store)}>
              <td>{store.storeNumber}</td>
              <td>{store.storeName}</td>
              <td>{performedVisits(store)}</td>
              <td >{requiredVisits(store)-performedVisits(store)>0?requiredVisits(store)-performedVisits(store):""}</td>
              <td>{requiredVisits(store)}</td>
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

export default MissingVisitsComponent;
