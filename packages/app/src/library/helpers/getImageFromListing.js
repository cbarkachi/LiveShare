import firebase from "firebase";

export default async function getImageFromListing(listingId, index) {
  const storageRef = firebase.storage().ref();
  const listingPath = "images/listings/" + listingId + "/";
  const images = await storageRef.child(listingPath).listAll();
  const indexStr = "" + index;
  console.log("bro: ", indexStr);
  // console.log("images: ", images);
  for (let img of images.items) {
    const pathComponents = img.fullPath.split("/");
    console.log(
      "this",
      pathComponents,
      pathComponents[pathComponents.length - 1]
    );
    if (pathComponents[pathComponents.length - 1] === indexStr) {
      return await img.getDownloadURL();
    }
  }
  return null;
}
