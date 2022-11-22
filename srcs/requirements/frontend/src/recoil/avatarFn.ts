import Resizer from "react-image-file-resizer";

export const resizeImageFile = async(file : File, maxSize: number) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxSize,
      maxSize,
      "png",
      100,
      0,
      (uri) => {resolve(uri as File);},
      "file"
    );
  }
);
