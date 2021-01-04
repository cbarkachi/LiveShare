import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGalleryWrapper from "./ImageGallery.style";

const PostImageGallery = ({ images }) => {
  // const imageObjs = images.map((image) => {
  //   return {
  //     original: image,
  //   };
  // });
  // const thumbnail = new ImageResize({ format: "jpg", width: 300 })
  //   .play("image.jpg")
  //   .then((response) => {
  //       //   });

  // async function resize() {
  //   // Read the image.
  //   const image = await jimp.read("test/image.png");

  //   // Resize the image to width 150 and auto height.
  //   await image.resize(150, jimp.AUTO);

  //   // Save and overwrite the image
  //   await image.writeAsync("test/image.png");
  // }
  return (
    <ImageGalleryWrapper>
      <ImageGallery
        items={images.map((image) => {
          return { original: image, thumbnail: image };
        })}
        showPlayButton={false}
        showFullscreenButton={false}
        showIndex={true}
        lazyLoad={true}
        slideDuration={550}
      />
    </ImageGalleryWrapper>
  );
};

export default PostImageGallery;
