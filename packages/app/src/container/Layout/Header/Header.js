import React, { useState, useContext, useEffect } from "react";
import Sticky from "react-stickynode";
import { withRouter } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { Button, Drawer } from "antd";
import Logo from "components/UI/Logo/Logo";
import Text from "components/UI/Text/Text";
import TextLink from "components/UI/TextLink/TextLink";
import Navbar from "components/Navbar/Navbar";
import { AuthContext } from "context/AuthProvider";
import { LayoutContext } from "context/LayoutProvider";
import useWindowSize from "library/hooks/useWindowSize";
import { AGENT_PROFILE_PAGE } from "settings/constant";
import AuthMenu from "./AuthMenu";
// import MainMenu from "./MainMenu";
import MobileMenu from "./MobileMenu";
import ProfileMenu from "./ProfileMenu";
import NavbarSearch from "./NavbarSearch";
import HeaderWrapper, {
  MobileNavbar,
  CloseDrawer,
  AvatarWrapper,
  AvatarImage,
  AvatarInfo,
  LogoArea,
} from "./Header.style";
import { firestore } from "base-init";
import MainMenu from "container/Layout/Header/MainMenu";
import liveshare from "assets/images/logo-ch.png";
import getImageFromUser from "library/helpers/getImageFromUser";

const LogoIcon = () => <img src={liveshare} width={30} height={30} alt="" />;

export default withRouter(function Header({ location }) {
  const [avatarImg, setAvatarImg] = useState("");
  const { user, loggedIn } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    if (loggedIn) {
      firestore
        .collection("users")
        .doc(user.uid)
        .get()
        .then((docSnapshot) => {
          const info = docSnapshot.data();
          setUserInfo(info);
        });
      async function getPicture() {
        setAvatarImg(await getImageFromUser(user.uid, true));
      }
      getPicture();
    }
  }, [loggedIn, user]);
  const [{ searchVisibility }] = useContext(LayoutContext);
  const { width } = useWindowSize();
  const [state, setState] = useState(false);

  const sidebarHandler = () => {
    setState(!state);
  };

  const headerType = location.pathname === "/" ? "transparent" : "default";

  return (
    <HeaderWrapper>
      <Sticky
        top={headerType === "transparent" ? -1 : 0}
        innerZ={10001}
        activeClass="isHeaderSticky"
      >
        {width > 991 ? (
          <Navbar
            logo={
              <>
                {headerType === "transparent" && <LogoIcon />}
                <Logo withLink linkTo="/" src={liveshare} title="LiveShare" />
              </>
            }
            navMenu={<MainMenu />}
            authMenu={<AuthMenu />}
            isLogin={loggedIn}
            avatar={<Logo src={avatarImg} />}
            profileMenu={<ProfileMenu avatar={<Logo src={avatarImg} />} />}
            headerType={headerType}
            searchComponent={<NavbarSearch />}
            location={location}
            searchVisibility={searchVisibility}
          />
        ) : (
          <MobileNavbar className={headerType}>
            <LogoArea>
              <>
                {headerType === "transparent" && <LogoIcon />}
                <Logo withLink linkTo="/" src={liveshare} title="LiveShare" />
              </>
              <NavbarSearch />
            </LogoArea>
            <Button
              className={`hamburg-btn ${state ? "active" : ""}`}
              onClick={sidebarHandler}
            >
              <span />
              <span />
              <span />
            </Button>
            <Drawer
              placement="right"
              closable={false}
              onClose={sidebarHandler}
              width="285px"
              className="mobile-header"
              visible={state}
            >
              <CloseDrawer>
                <button onClick={sidebarHandler}>
                  <IoIosClose />
                </button>
              </CloseDrawer>
              {loggedIn ? (
                <AvatarWrapper>
                  <AvatarImage>
                    <Logo src={avatarImg} />
                  </AvatarImage>
                  <AvatarInfo>
                    <Text
                      as="h3"
                      content={`${userInfo.firstName} ${userInfo.lastName}`}
                    />
                    <TextLink
                      link={`${AGENT_PROFILE_PAGE}/${user.uid}`}
                      content="View Profile"
                    />
                  </AvatarInfo>
                </AvatarWrapper>
              ) : (
                <AuthMenu className="auth-menu" />
              )}
              <MobileMenu className="main-menu" />
            </Drawer>
          </MobileNavbar>
        )}
      </Sticky>
    </HeaderWrapper>
  );
});
