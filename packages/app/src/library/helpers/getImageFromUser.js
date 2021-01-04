import firebase from "firebase";

export default async function getImageFromUser(userId, wantProfile) {
  const storageRef = firebase.storage().ref();
  const userPath = "images/users/" + userId + "/";
  const images = await storageRef.child(userPath).listAll();
  // console.log("images: ", images);
  for (let img of images.items) {
    const pathComponents = img.fullPath.split("/");
    if (
      pathComponents[pathComponents.length - 1] ===
      (wantProfile ? "profile" : "cover")
    ) {
      return await img.getDownloadURL();
    }
  }
  return null;
}
