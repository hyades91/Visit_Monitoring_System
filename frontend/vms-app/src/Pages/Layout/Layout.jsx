import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../..";

import "./Layout.css";

const Layout = () => {
  
//const [user, setUser] = useState(useContext(UserContext));
const context= useContext(UserContext);
const {user}= useContext(UserContext);
const navigate =useNavigate()
// Logout updates the user data to default
const logout = (e) => {
  e.preventDefault();
  context.setUser(null);
  navigate("/")
};


  return(
  <div className="Layout">
    <nav>
      <ul>
      <div className="MarketPlace">
        <li>
          <Link to="/">Visit Monitoring System</Link>
        </li>
        </div>
        <div className="UserManagement">
        <li>
          <Link to="/updatedatabase">{user&&user.userName==="admin"&&("Update Database")}</Link>
          {user&&
          <div className="LayoutMenu">
            <Link to="/myProfile" class="dropbtn">{user.userName}</Link>
          </div>}
          <Link onClick={e=>user&&logout(e)} to={"/"}>{user?"Log out":"Log in"}</Link>
          <Link to="/signup">{!user&&("Sign up")}</Link>
        </li>
        </div>
      </ul>
    </nav>
    <div className="Outlet">
      <Outlet />
    </div>
    <nav className="NavFooter">
      <ul>
        <div className="Footer">
          <li>
                <Link to="/contact">Contacts</Link>
          </li>
        </div>
      </ul>
    </nav>
  </div>
);
}

export default Layout;
