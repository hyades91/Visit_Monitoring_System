import "./MySettings.css";

const MySettings = ({ profile, watchClick, updateProfile}) => (
  <div className="PofileDetails">
  {profile?
    <div className="PofileDetail">
      
      <div className="PofileButtons">
        <br></br>
        <button className="BackToMyProfile" onClick={(e) => watchClick(e)}>Back</button>
        <br></br>
      </div>
      <form onSubmit={(event)=>updateProfile(event)} className="Pofile">
        <button className="MySettingsSave" type="submit">Save</button>


     
        <h2>Personal Details:</h2>
        <label>First Name: </label>
        <input type="text" id="input" defaultValue={profile.firstName}/>
        <br></br>

        <label>Second Name: </label>
        <input type="text" id="input" defaultValue={profile.secondName}/>
        <br></br>
        
        <label>UserName: </label>
        <input type="text" id="input" defaultValue={profile.userName}/>
        <br></br>

    
     </form>
  
   </div>
  :
    <h2>Loading...</h2>
  }
</div>
)

export default MySettings;
