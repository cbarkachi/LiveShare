import React, { useState, Fragment, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Sticky from "react-stickynode";
import Toolbar from "components/UI/Toolbar/Toolbar";
import CategotySearch from "components/Search/CategorySearch/CategotySearch";
import { PostPlaceholder } from "components/UI/ContentLoader/ContentLoader";
import SectionGrid from "components/SectionGrid/SectionGrid";
// import ListingMap from "./ListingMap";
import FilterDrawer from "components/Search/MobileSearchView";
import useWindowSize from "library/hooks/useWindowSize";
import useDataApi from "library/hooks/useDataApi";
import { SINGLE_POST_PAGE } from "settings/constant";
import ListingWrapper, { PostsWrapper } from "./Listing.style";
import { firestore } from "base-init";
import { getQueryMap } from "library/helpers/url_handler";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
  ClearRefinements,
  RefinementList,
  Configure,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import { Button } from "antd";
import { setStateToUrl } from "components/Search/url_handler.js";
import CategroySearchWrapper from "components/Search/CategorySearch/CategorySearch.style"; // ActionWrapper, // ItemWrapper, // RoomGuestWrapper,
import "components/UI/ViewWithPopup/ViewWithPopup";

const searchClient = algoliasearch(
  "X4H5NO5MI0",
  "728f889a1e5bbd20b8c99202f87108bb"
);
const InstantSearchComponent = () => (
  <InstantSearch indexName="listings" searchClient={searchClient}>
    <div className="left-panel">
      <ClearRefinements />
      <h2>Brands</h2>
      <RefinementList attribute="brand" />
      <Configure hitsPerPage={8} />
    </div>
    <div className="right-panel">
      <SearchBox />
      <Hits hitComponent={Hit} />
      <Pagination />
    </div>
  </InstantSearch>
);

function Hit(props) {
  return (
    <div>
      <img src={props.hit.image} align="left" alt={props.hit.title} />
      <div className="hit-name">
        <Highlight attribute="name" hit={props.hit} />
      </div>
      <div className="hit-description">
        <Highlight attribute="description" hit={props.hit} />
      </div>
      <div className="hit-price">${props.hit.price}</div>
    </div>
  );
}

export default function Listing() {
  const url = "/data/hotel.json";
  const { width } = useWindowSize();
  // const [showMap, setShowMap] = useState(false);
  const { loading, loadMoreData, total, limit } = useDataApi(url);
  const history = useHistory();
  const location = history.location;
  const [data, setData] = useState([]);
  const [curFavorites, setCurFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || {}
  );
  useEffect(() => {
    const queryMap = getQueryMap(location.search);
    let firebaseQuery = firestore.collectionGroup("listings");
    if (queryMap.get("favorites")) {
      const ids = Object.keys(curFavorites);
      console.log(ids);
      const dataItems = Array(ids.length);
      for (let i = 0; i < dataItems.length; i++) {
        dataItems[i] = {};
      }
      const innerPromises = Array(ids.length)
        .fill(0)
        .map(() => ({}));
      const outerPromises = Array(ids.length)
        .fill(0)
        .map(() => ({}));
      ids.forEach((listingId, index) => {
        outerPromises.push(
          firestore
            .collectionGroup("listings")
            .where("id", "==", listingId)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((docSnapshot) => {
                dataItems[index].skill = docSnapshot.data();
                dataItems[index].listingId = docSnapshot.ref.id;
                dataItems[index].instructorId =
                  docSnapshot.ref.parent.parent.id;
                innerPromises.push(
                  docSnapshot.ref.parent.parent
                    .get()
                    .then((parentDocSnapshot) => {
                      dataItems[index].instructor = parentDocSnapshot.data();
                    })
                );
              });
            })
        );
      });
      Promise.all(outerPromises).then(() => {
        Promise.all(innerPromises).then(() => {
          setData(dataItems);
        });
      });
    } else {
      const title = queryMap.get("skill");
      const skillLevels = queryMap.get("amenities")?.split(",");
      const freeConsultation = queryMap.get("property");
      const prices = queryMap.get("price");
      let lowPrice, highPrice;
      if (prices) {
        let [low, high] = prices.split(",").map((price) => +price);
        if (high === 100) {
          high = 5000;
        }
        lowPrice = low;
        highPrice = high;
      } else {
        lowPrice = 0;
        highPrice = 5000;
      }
      const queries = [
        ["title", "==", title || undefined],
        ["beginner", "==", skillLevels?.includes("beginner")],
        ["intermediate", "==", skillLevels?.includes("intermediate")],
        ["advanced", "==", skillLevels?.includes("advanced")],
        ["freeConsultation", "==", freeConsultation || undefined],
        ["price", ">=", lowPrice * 100],
        ["price", "<=", highPrice * 100],
      ];
      queries.forEach(([field, condition, value]) => {
        if (value !== undefined) {
          firebaseQuery = firebaseQuery.where(field, condition, value);
        }
      });
      firebaseQuery.get().then((querySnapshot) => {
        const promises = [];
        const skills = [];
        const listingIds = [];
        querySnapshot.forEach((doc) => {
          const skill = doc.data();
          skills.push(skill);
          listingIds.push(doc.id);
          const getTask = doc.ref.parent.parent.get();
          promises.push(getTask);
        });
        Promise.all(promises).then((docSnapshots) => {
          setData(
            docSnapshots.map((docSnapshot, index) => {
              return {
                instructor: docSnapshot.data(),
                skill: skills[index],
                listingId: listingIds[index],
                instructorId: docSnapshot.id,
              };
            })
          );
        });
      });
    }
  }, [location.search, curFavorites]);
  console.log("data", data);
  // useEffect(() => {
  //   firestore.collection("users").doc;
  // }, []);

  let columnWidth = [1 / 1, 1 / 2, 1 / 3, 1 / 4, 1 / 5];

  // if (showMap) {
  //   columnWidth = [1 / 1, 1 / 2, 1 / 2, 1 / 2, 1 / 3];
  // }
  // const handleMapToggle = () => {
  //   setShowMap((showMap) => !showMap);
  // };

  return (
    <>
      {/* <InstantSearchComponent /> */}
      <ListingWrapper>
        <Sticky top={82} innerZ={999} activeClass="isHeaderSticky">
          <Toolbar
            left={
              width > 991 ? (
                <CategotySearch history={history} location={location} />
              ) : (
                <FilterDrawer history={history} location={location} />
              )
            }
            right={
              <CategroySearchWrapper>
                <div className="view_with__popup text-right">
                  <div className="popup_handler">
                    <Button
                      type="default"
                      onClick={() => {
                        const search = setStateToUrl({
                          favorites: true,
                        });
                        history.push({
                          pathname: "/listings",
                          search: search,
                        });
                      }}
                    >
                      My Favorites
                    </Button>
                  </div>
                </div>
              </CategroySearchWrapper>
            }
          />
        </Sticky>

        <Fragment>
          <PostsWrapper className={"col-24"}>
            <SectionGrid
              link={SINGLE_POST_PAGE}
              columnWidth={columnWidth}
              listings={data}
              totalItem={total.length}
              loading={loading}
              limit={limit}
              handleLoadMore={loadMoreData}
              curFavorites={curFavorites}
              setCurFavorites={setCurFavorites}
              placeholder={<PostPlaceholder />}
            />
          </PostsWrapper>
        </Fragment>
      </ListingWrapper>
    </>
  );
}
