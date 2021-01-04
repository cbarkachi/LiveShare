import React, { useContext, Fragment, useEffect, useState } from "react";
import { Route, NavLink, Link, Redirect } from "react-router-dom";
// import isEmpty from "lodash/isEmpty";
import { IoIosAdd } from "react-icons/io";
import { Menu } from "antd";
import Container from "components/UI/Container/Container";
import Heading from "components/UI/Heading/Heading";
import Text from "components/UI/Text/Text";
// import Loader from "components/Loader/Loader";
import AgentItemLists from "./AgentItemLists";
import AgentFavItemLists from "./AgentFavItemLists";
import AgentContact from "./AgentContact";
// import useDataApi from "library/hooks/useDataApi";
import { useHistory } from "react-router-dom";
import Image from "components/UI/Image/Image";
import { ProfilePicLoader } from "components/UI/ContentLoader/ContentLoader";
import {
  ADD_SKILL_PAGE,
  AGENT_PROFILE_FAVOURITE,
  AGENT_PROFILE_CONTACT,
} from "settings/constant";
import AgentDetailsPage, {
  BannerSection,
  UserInfoArea,
  ProfileImage,
  ProfileInformationArea,
  ProfileInformation,
  NavigationArea,
} from "./AgentDetails.style";
import { firestore } from "base-init";
import { AuthContext } from "context/AuthProvider";
import getImageFromUser from "library/helpers/getImageFromUser";

const ProfileNavigation = (props) => {
  const { match, className } = props;
  const { loggedIn } = useContext(AuthContext);
  return (
    <NavigationArea>
      <Container fluid={true}>
        <Menu className={className}>
          <Menu.Item key="0">
            <NavLink exact to={`${match.url}`}>
              Skill Pages
            </NavLink>
          </Menu.Item>
          {/* <Menu.Item key="1">
            <NavLink to={`${match.url}${AGENT_PROFILE_FAVOURITE}`}>
              Favourite
            </NavLink>
          </Menu.Item> */}
          {/* <Menu.Item key="2">
            <NavLink to={`${match.url}${AGENT_PROFILE_CONTACT}`}>
              Contact
            </NavLink>
          </Menu.Item> */}
        </Menu>

        {loggedIn && (
          <>
            <Link className="add_card" to={ADD_SKILL_PAGE}>
              <IoIosAdd /> Add Skill Page
            </Link>
          </>
        )}
      </Container>
    </NavigationArea>
  );
};

const ProfileRoute = (props) => {
  const { match } = props;
  return (
    <Container fluid={true}>
      <Route exact path={`${match.path}`} component={AgentItemLists} />
      <Route
        path={`${match.path}${AGENT_PROFILE_FAVOURITE}`}
        component={AgentFavItemLists}
      />
      <Route
        path={`${match.path}${AGENT_PROFILE_CONTACT}`}
        component={AgentContact}
      />
    </Container>
  );
};

const AgentProfileInfo = () => {
  const { user, loggedIn } = useContext(AuthContext);
  const profileUser = useHistory().location.pathname.split("/")[2];
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    photo: "",
    banner: "",
  });
  useEffect(() => {
    firestore
      .collection("users")
      .doc(profileUser)
      .get()
      .then((docSnapshot) => {
        const info = docSnapshot.data();
        setUserInfo(info);
      });
    async function getPictures() {
      setProfile(await getImageFromUser(profileUser, true));
      setCover(await getImageFromUser(profileUser, false));
    }
    getPictures();
  }, []);
  return (
    <Fragment>
      <BannerSection
        style={{
          background: `url(${cover}) center center / cover no-repeat`,
          backgroundPosition: "0 15%",
        }}
      />
      <UserInfoArea>
        <Container fluid={true}>
          <ProfileImage>
            {profile ? (
              <Image src={profile} alt="Profile Pic" />
            ) : (
              <ProfilePicLoader />
            )}
          </ProfileImage>
          <ProfileInformationArea>
            <ProfileInformation>
              <Heading
                content={
                  userInfo.firstName
                    ? `${userInfo.firstName} ${userInfo.lastName}`
                    : ""
                }
              />
              <Text content={userInfo.bio || ""} />
            </ProfileInformation>
            {/* <SocialAccount>
              <Popover content="Twitter">
                <a href={"a twitter"} target="_blank" rel="noopener noreferrer">
                  <IoLogoTwitter className="twitter" />
                </a>
              </Popover>
              <Popover content="Facebook">
                <a
                  href={"a a facebook"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoLogoFacebook className="facebook" />
                </a>
              </Popover>
              <Popover content="Instagram">
                <a
                  href={"a instagram"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoLogoInstagram className="instagram" />
                </a>
              </Popover>
            </SocialAccount> */}
          </ProfileInformationArea>
        </Container>
      </UserInfoArea>
    </Fragment>
  );
};

export default function AgentDetailsViewPage(props) {
  return (
    <AgentDetailsPage>
      {/* <UserContext> */}
      <AgentProfileInfo />
      <ProfileNavigation {...props} />
      <ProfileRoute {...props} />
      {/* </UserContext> */}
    </AgentDetailsPage>
  );
}
