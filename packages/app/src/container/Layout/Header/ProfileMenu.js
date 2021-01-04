import React from "react";
// import { useHistory } from "react-router-dom";
// import useOnClickOutside from "library/hooks/useOnClickOutside";
import { withRouter } from "react-router-dom";
// import { AuthContext } from "context/AuthProvider";

const ProfileMenu = ({ avatar }) => {
  // const { logOut } = useContext(AuthContext);
  // const history = useHistory();

  // const [state, setState] = useState(false);
  // const handleDropdown = () => {
  //   setState(!state);
  // };
  // const closeDropdown = () => {
  //   setState(false);
  // };
  // const dropdownRef = useRef(null);
  // useOnClickOutside(dropdownRef, () => setState(false));
  // function handleLogout() {
  //   logOut();
  //   history.push("/");
  // }

  return (
    <></>
    /* <div className="dropdown-handler" onClick={handleDropdown}>
        {avatar}
      </div> */
    /* <Menu className={`hide`}>
        <Menu.Item onClick={closeDropdown} key="0">
          <NavLink to={AGENT_PROFILE_PAGE}>View Profile</NavLink>
        </Menu.Item>
        <Menu.Item onClick={closeDropdown} key="1">
          <NavLink to={ADD_SKILL_PAGE}>Add Skill Page</NavLink>
        </Menu.Item>
        <Menu.Item onClick={closeDropdown} key="2">
          <NavLink to={AGENT_ACCOUNT_SETTINGS_PAGE}>Account</NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <button onClick={handleLogout}>Log Out</button>
        </Menu.Item>
      </Menu> */
  );
};

export default withRouter(ProfileMenu);
