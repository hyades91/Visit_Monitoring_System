
import { useEffect,  useState, useContext } from "react";
import { UserContext } from "..";
import { useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import urlString from "..";
import saveAsImage from "../saveas.png"
//UPLOAD json
const uploadJson=(/*user,*/formData)=>{
console.log(formData)
  return fetch(`${urlString}/Visit/ResetAllVisitWithJsonObj`, {
    method: 'POST',
   
    headers:{
      "Content-Type":"application/json"
      /*
  
      'Authorization': `Bearer ${user.token}`,*/
    },
    body: JSON.stringify(formData),
  })
    .then((res) =>{
      console.log(res)
      return res.json()})
    .then((data) => {
      console.log(data)
      return data
    })
    .catch((err) => console.error(err));
    
}



const UpdateDatabasePage = () => {

  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user}= useContext(UserContext);

  function TranslateJson(jsonFile){
    console.log("jsonFile")
    console.log(jsonFile)
    console.log(jsonFile.payload[1])
    jsonFile.payload=jsonFile.payload.map(visit=>{
      
      switch (visit.status){
        case "Folyamatban":
          visit.status="Open";
          break;
        case "Nezahájen":
            visit.status="Open";
            break;
        
        case "Kész":
          visit.status="Finished";
          break;
        case "Ukončen":
            visit.status="Finished";
            break;
          
        case "Elkezdve":
          visit.status="Started";
          break;
        case "Zahájen":
            visit.status="Started";
            break;
      }

      switch (visit.reason){
        case "Általános":
          visit.reason="Regular";
          break;
        case "  Pravidelná kontrola":
          visit.reason="Regular";
          break;

        case "Eseti":
          visit.reason="On-Call";
          break;
        case "Intervenční kontrola":
          visit.reason="On-Call";
          break;
      }
      return visit
    })
  return jsonFile
  };

 //--File UPLOADER - START
  const [obj, setObj] = useState();
  const [rawFile, setRawFile] = useState();
 // const [file, setFile] = useState();

  const handleFileChange = (e) => {
    e.preventDefault();
    setRawFile(e.target.files[0])
    console.log(e.target.files[0])
    if (e.target.files) {

      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        console.log("e.target.result", e);
        setObj(TranslateJson(JSON.parse(e.target.result)));
      }

      
    }
  };



  const handleUploadClick = async() => {
    if (!obj) {
      return;
    }
    setLoading(true)
    try
    {
      const visitData = await uploadJson(/*user, */obj)
       .then((visitData) => {
          console.log(`VMS has been updated with ${visitData.result} visits from TLT Portal`);
          setResult(`VMS has been updated with ${visitData.result} visits from TLT Portal`)
          setLoading(false)
        })
        .catch((err)=>{
          console.log(err)
        })
        console.log(visitData);
    }catch(error){
      console.error("Hiba történt a JSON feltöltése során:", error);
      setResult("Hiba történt a JSON feltöltése során:", error)
      setLoading(false)
    }
  };
 //--IMAGE UPLOADER - END


    return (
      user&&user.userName==="admin"?
      <div className="DatabaseUpdater">
        <h3>1. Click on the link and login</h3>
        <a href="https://tlt.ourtesco.com/tlt/pst/storeInspectionView/result" target="_blank" download>Request updated visits</a>
        <h3>2. Press Ctrl+s, or right-click and "save as"</h3>
        <img src={saveAsImage}></img>
        <h3>3. Select the saved file with "Choose File" button </h3>
        <h3>4. Click on "Update Visits" button </h3>
        
        <div>   
          <input type="file" onChange={(e)=>handleFileChange(e)} />
          <div>{rawFile && `${rawFile.name} - ${rawFile.type}`}</div>
          <button onClick={handleUploadClick}>Update Visits</button>
        </div>
        {loading?
        <Loading/>
        :
        <h2>{result}</h2>
        }
      </div>

      :
      <h3>You have not permission...</h3>
    )
  
  };
  
  export default UpdateDatabasePage;
  