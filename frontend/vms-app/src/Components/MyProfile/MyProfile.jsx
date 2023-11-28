import "./MyProfile.css";


const MyProfile = ({ profile, watchClick}) => (
  <div className="PofileDetails">
  {profile?
    <div className="PofileDetail">
      
      <div className="PofileButtons">
        <br></br>
        <button className="MySettings" onClick={(e) => watchClick(e)}>Edit personal data</button>
      </div>

      <div className="Pofile">
        <h1>{profile.userName}' profile page:</h1>
        <h3>Name: {profile.firstName} {profile.secondName}</h3>
        <h3>Email: {profile.email}</h3>

     </div>
  
   </div>
  :
    <h2>Loading...</h2>
  }
</div>
)

export default MyProfile;
