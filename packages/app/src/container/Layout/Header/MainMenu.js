import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "antd";
import {
  AGENT_PROFILE_PAGE,
  HOME_PAGE,
  LISTING_POSTS_PAGE,
  AGENT_ACCOUNT_SETTINGS_PAGE,
} from "settings/constant";
import { AuthContext } from "context/AuthProvider";
import { Button } from "components/UI/Button/Button";
import { useHistory } from "react-router-dom";
const MainMenu = ({ className }) => {
  const [state, setState] = useState(false);
  // const handleDropdown = () => {
  //   setState(!state);
  // };
  const { user, loggedIn, logOut } = useContext(AuthContext);
  const closeDropdown = () => {
    setState(false);
  };
  const history = useHistory();
  return (
    <div className="dropdown-handler">
      <Menu
        // selectedKeys={[history.location.pathname]}
        // hidden={state}
        // style={{ display: "fixed" }}
        className={className}
      >
        <Menu.Item key="0">
          <NavLink exact to={HOME_PAGE}>
            Home
          </NavLink>
        </Menu.Item>
        <Menu.Item key="1">
          <NavLink to={`${LISTING_POSTS_PAGE}`}>Explore</NavLink>
        </Menu.Item>
        {loggedIn ? (
          <Menu.Item onClick={closeDropdown}>
            <NavLink to={`${AGENT_PROFILE_PAGE}/${user.uid}`}>
              View Profile
            </NavLink>
          </Menu.Item>
        ) : (
          <></>
        )}
        {loggedIn ? (
          <Menu.Item onClick={closeDropdown} key={3}>
            <NavLink to={AGENT_ACCOUNT_SETTINGS_PAGE}>Account</NavLink>
          </Menu.Item>
        ) : (
          <></>
        )}
        {loggedIn ? (
          <Menu.Item key={4}>
            <Button onClick={logOut}>Log Out</Button>
          </Menu.Item>
        ) : (
          <></>
        )}
      </Menu>
    </div>
  );
};

export default MainMenu;
