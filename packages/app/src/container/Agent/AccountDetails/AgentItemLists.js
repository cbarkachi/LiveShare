import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import { withStyles } from "@material-ui/core/styles";
import { AuthContext } from "context/AuthProvider";
import { firestore } from "base-init";
import { Link } from "react-router-dom";
import formatPrice from "library/helpers/formatPrice";
import { useHistory } from "react-router-dom";
import getUrlComponents from "library/helpers/getUrlComponents";
import AgentItems from "./AgentItems";
import getImageFromListing from "library/helpers/getImageFromListing";
import { NavLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

const checkboxStyles = (theme) => ({
  root: {
    "&$checked": {
      color: "#008489",
    },
  },
  checked: {},
});

const CustomCheckbox = withStyles(checkboxStyles)(Checkbox);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function AgentItemLists() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);
  const [listings, setListings] = useState([]);
  const userId = getUrlComponents(useHistory())[1];
  useEffect(() => {
    firestore
      .collection("users")
      .doc(userId)
      .collection("listings")
      .get()
      .then((listingsSnapshot) => {
        const curListings = [];
        const picturePromises = [];
        listingsSnapshot.forEach(async (listingDoc) => {
          const { category, title, price } = listingDoc.data();
          picturePromises.push(getImageFromListing(listingDoc.ref.id, 0));
          curListings.push({
            category,
            title,
            price,
            listingId: listingDoc.ref.id,
          });
        });
        Promise.all(picturePromises).then((pictures) => {
          pictures.forEach((picture, index) => {
            curListings[index].image = picture;
          });
          setListings(curListings);
        });
      });
  }, []);
  console.log("listings", listings);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  return (
    <>
      {listings.length > 0 ? (
        <div className="mb-5">
          <AgentItems listings={listings} userId={userId} />
        </div>
      ) : (
<Typography variant="h6">
          You currently don't have any listings.{" "}
          <NavLink to="/add-skill">Create one</NavLink> now!
        </Typography>
      )}
    </>
  );
}
