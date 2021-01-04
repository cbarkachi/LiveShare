import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "antd";

import { LOGIN_PAGE, REGISTRATION_PAGE } from "settings/constant";
import { AuthContext } from "context/AuthProvider";
import { useHistory } from "react-router-dom";

const AuthMenu = ({ className }) => {
  const { loggedIn } = useContext(AuthContext);
  const history = useHistory();
  return loggedIn ? (
    <div></div>
  ) : (
    <Menu className={className}>
      <Menu.Item key="0">
        <NavLink to={LOGIN_PAGE}>Sign in</NavLink>
      </Menu.Item>
      <Menu.Item key="1">
        <NavLink to={REGISTRATION_PAGE}>Sign up</NavLink>
      </Menu.Item>
    </Menu>
  );
};

export default AuthMenu;
