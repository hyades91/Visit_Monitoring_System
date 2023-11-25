import { useEffect, useState,  useContext } from "react";
import { UserContext } from "..";
import { useNavigate } from "react-router-dom";

import Loading from "../Components/Loading";
import MyProfile from "../Components/MyProfile";
import MySettings from "../Components/MySettings";

import urlString from "..";

//GET THE PROFILE DATA
const fetchUser = (user,email) => {
  console.log("fetchelünk");
  return fetch(`${urlString}/Auth/GetProfileData?email=${email}`,{
    headers:{
      'Authorization': `Bearer ${user.token}`,
    },
  }).then((res) => res.json());
};
//UPDATE PROFILE
const UpdateUser = (user, userObject) => {
  return fetch(`${urlString}/Auth/UpdateProfileData`,{
  method: 'PUT',
  headers:{
    "Content-Type": "application/json",
    'Authorization': `Bearer ${user.token}`,
  },
  body: JSON.stringify(userObject)
})
  .then((res) => {
    console.log(res)
    return res.json()})
  .catch((err) => console.error(err));
};


const MyProfilePage = () => {

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [mySettings, setMySettings] = useState(null);

  const {user}= useContext(UserContext);
  
  const navigate=useNavigate()

  console.log(profile);
  console.log(user);

async function watchClick(event){
  event.preventDefault();
  console.log(event);
  if(event.target.className==="BackToMainPage"){
    navigate("/")
  }
  else if(event.target.className==="MySettings"){
    setMySettings(true)
  }
  else if(event.target.className==="BackToMyProfile"){
    setMySettings(false)
  }
}



async function updateProfile(e){
  e.preventDefault();
  console.log(e)
  let UserObject={
    Id:"",
    FirstName: e.target[1].value,
    SecondName: e.target[2].value,
    Email: user.email,
  }
  try{
    UpdateUser(user, UserObject)
    .then((profileData) => {
      setLoading(false);
      console.log(profileData)
      setProfile(profileData);
    }).catch(err=>console.error("nem sikerült a user fetch",err))
  }catch(err){console.error("nem sikerült a user fetch (masodik catch)",err)}
  setMySettings(false)
}

  useEffect(() => {
    try{
      fetchUser(user,user.email)
      .then((profileData) => {
        setLoading(false);
        console.log(profileData)
        setProfile(profileData);
      }).catch(err=>console.error("nem sikerült a user fetch",err))
    }catch(err){console.error("nem sikerült a user fetch (masodik catch)",err)}
  }, [user]);


  if (loading) {
    return <Loading />;
  }
  return (
  <>
    {mySettings?
    <MySettings profile={profile} watchClick={watchClick} updateProfile={updateProfile} />
    :
    <MyProfile profile={profile} watchClick={watchClick}/>
    }
  </>
  )
};

export default MyProfilePage;
