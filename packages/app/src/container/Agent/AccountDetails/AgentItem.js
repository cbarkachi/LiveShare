import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import formatPrice from "library/helpers/formatPrice";
import "./ItemStyles.css";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function MediaCard({ listing, userId }) {
  const classes = useStyles();
  const history = useHistory();
  console.log("image", listing.image);
  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={listing.image}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {listing.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {listing.category}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            history.push(`/listing/${userId}/${listing.listingId}`);
          }}
        >
          {formatPrice(listing.price, true, true)}
        </Button>
      </CardActions>
    </Card>
  );
}
