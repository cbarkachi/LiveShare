import React, { useContext, useEffect, useState } from "react";
import { Route, NavLink, Link } from "react-router-dom";
import { Row, Col, Menu, Avatar } from "antd";
import Container from "components/UI/Container/Container.style";
import AgentCreateOrUpdateForm from "./AgentCreateOrUpdateForm";
import AgentPictureChangeForm from "./AgentPictureChangeForm";
import ChangePassWord from "./ChangePassWordForm";
import Payment from "./Payment";
import Availability from "./Availability";
import IntegrateZoom from "./IntegrateZoom";
import {
  AGENT_IMAGE_EDIT_PAGE,
  AGENT_PASSWORD_CHANGE_PAGE,
  AGENT_PROFILE_PAGE,
  AGENT_PROFILE_EDIT_PAGE,
  AGENT_ZOOM_PAGE,
  AGENT_AVAILABILITY_PAGE,
  AGENT_PAYMENT_PAGE,
  AGENT_ACCOUNT_SETTINGS_PAGE,
} from "settings/constant";
import AccountSettingWrapper, {
  AccountSidebar,
  AgentAvatar,
  SidebarMenuWrapper,
  ContentWrapper,
  AgentName,
  FromWrapper,
} from "./AccountSettings.style";
import { AuthContext } from "context/AuthProvider";
import { firestore } from "base-init";
import getImageFromUser from "library/helpers/getImageFromUser";
import anonymousImg from "assets/images/anonymous-profile.png";
import { useHistory } from "react-router-dom";

const mainUrl = AGENT_ACCOUNT_SETTINGS_PAGE;
let curUrl;
const AccountSettingNavLink = () => {
  return (
    <SidebarMenuWrapper>
      <Menu
        defaultSelectedKeys={[curUrl]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
      >
        <Menu.Item key={mainUrl}>
          <NavLink exact to={`${mainUrl}`}>
            Edit Profile
          </NavLink>
        </Menu.Item>
        <Menu.Item key={`${mainUrl}${AGENT_AVAILABILITY_PAGE}`}>
          <NavLink to={`${mainUrl}${AGENT_AVAILABILITY_PAGE}`}>
            Availability
          </NavLink>
        </Menu.Item>
        {/* <Menu.Item key={`${mainUrl}${AGENT_PAYMENT_PAGE}1`}>
          <NavLink to={`${mainUrl}${AGENT_PAYMENT_PAGE}`}>
            Upcoming Sessions
          </NavLink>
        </Menu.Item> */}
        <Menu.Item key={`${mainUrl}${AGENT_PAYMENT_PAGE}`}>
          <NavLink to={`${mainUrl}${AGENT_PAYMENT_PAGE}`}>Payment</NavLink>
        </Menu.Item>
        <Menu.Item key={`${mainUrl}${AGENT_ZOOM_PAGE}`}>
          <NavLink to={`${mainUrl}${AGENT_ZOOM_PAGE}`}>Connect to Zoom</NavLink>
        </Menu.Item>
        <Menu.Item key={`${mainUrl}${AGENT_IMAGE_EDIT_PAGE}`}>
          <NavLink to={`${mainUrl}${AGENT_IMAGE_EDIT_PAGE}`}>
            Edit Photos
          </NavLink>
        </Menu.Item>
        <Menu.Item key={`${mainUrl}${AGENT_PASSWORD_CHANGE_PAGE}`}>
          <NavLink to={`${mainUrl}${AGENT_PASSWORD_CHANGE_PAGE}`}>
            Change Password
          </NavLink>
        </Menu.Item>
      </Menu>
    </SidebarMenuWrapper>
  );
};

const AccountSettingRoute = (props) => {
  return (
    <FromWrapper>
      <Route exact path={`${mainUrl}`} component={AgentCreateOrUpdateForm} />
      <Route
        path={`${mainUrl}${AGENT_AVAILABILITY_PAGE}`}
        component={Availability}
      />
      {/* <Route path={`${AGENT_PAYMENT_PAGE}`} component={Payment} /> */}
      <Route path={`${mainUrl}${AGENT_PAYMENT_PAGE}`} component={Payment} />
      <Route path={`${mainUrl}${AGENT_ZOOM_PAGE}`} component={IntegrateZoom} />
      <Route
        path={`${mainUrl}${AGENT_IMAGE_EDIT_PAGE}`}
        component={AgentPictureChangeForm}
      />
      <Route
        path={`${mainUrl}${AGENT_PASSWORD_CHANGE_PAGE}`}
        component={ChangePassWord}
      />
    </FromWrapper>
  );
};

export default function AgentAccountSettingsPage(props) {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  const [photo, setPhoto] = useState(null);
  curUrl = useHistory().location.pathname;
  useEffect(() => {
    firestore
      .collection("users")
      .doc(user.uid)
      .get()
      .then((docSnapshot) => setUserInfo(docSnapshot.data()));
    (async () => {
      setPhoto(await getImageFromUser(user.uid, true));
    })();
  }, []);
  useEffect(() => {}, []);
  return (
    <AccountSettingWrapper>
      <Container fullWidth={true}>
        <Row gutter={30}>
          <Col md={9} lg={6}>
            <AccountSidebar>
              <AgentAvatar>
                <Avatar src={photo || anonymousImg} alt="avatar" />
                <ContentWrapper>
                  <AgentName>
                    {userInfo.firstName} {userInfo.lastName}
                  </AgentName>
                  <Link to={`${AGENT_PROFILE_PAGE}/${user.uid}`}>
                    View profile
                  </Link>
                </ContentWrapper>
              </AgentAvatar>
              <AccountSettingNavLink {...props} />
            </AccountSidebar>
          </Col>
          <Col md={15} lg={18}>
            <AccountSettingRoute {...props} />
          </Col>
        </Row>
      </Container>
    </AccountSettingWrapper>
  );
}
