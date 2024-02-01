import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Pages/Layout";
import ErrorPage from "./Pages/ErrorPage";

import Menu from "./Pages/Menu.jsx";
import MainPage from "./Pages/MainPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import ContactPage from "./Pages/ContactPage.jsx";
import MyProfilePage from "./Pages/MyProfilePage.jsx";
import SettingPage from './Pages/SettingPage.jsx';
import UpdateDatabasePage from './Pages/UpdateDatabasePage.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Menu />,
      },
      {
        path: "/mainpage",
        element: <MainPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/myprofile",
        element: <MyProfilePage />,
      },
      {
        path: "/settingpage",
        element: <SettingPage />,
      },
      {
        path: "/updatedatabase",
        element: <UpdateDatabasePage />,
      },
      
     
    ],
  },
]);

//USERCONTEXTES CUCC
export const UserContext = React.createContext();

//szerver cím
//const urlString="https://localhost:44382"
const urlString="https://vms-server-y7pt.onrender.com";
export default urlString;

const App = () => {
  const [user, setUser] = React.useState(null);
  const [page, setPage] = React.useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  function keepAlive() {
    // Itt hajtsd végre a lekérdezést vagy műveletet, amely fenntartja a kapcsolatot
    console.log("Keep alive executed");
    try{
      //console.log("fetching...");
      return fetch(`${urlString}/Visit/GetAllVisitNumber`,{
        method: 'GET',
      })
      .then((res) => {
        console.log(res)
        return res.json()
      })
      .then((data)=>{
        console.log(data)
      })
      .catch((err)=>console.error("Error during visit fetch (first catch):"+err));
    }catch (error) {
      console.error("Error during visit fetch (second catch)", error);
    };
    // Újra beállítjuk a setTimeout-ot a következő időpontra
    setTimeout(keepAlive,  60 * 1000); // 10 percenként
  }
  
  // Az alkalmazás indításakor indítsd el az első lekérdezést
  keepAlive();


  return (
    <UserContext.Provider value={{ user, setUser, login, logout, page, setPage}}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </UserContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();