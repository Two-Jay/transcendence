import axios, { AxiosRequestConfig }  from 'axios';
import { postAvatarUploadApiUrl, postAvatarDownloadApiUrl } from './avatarType';
import { resizeImageFile } from './avatarFn';
import resizer from 'image-resizer-js';

export const postAvatarDownloadQuery = async (avatarPath: string, size: number) => {

  const config = {withCredentials: true,
    responseType: "arraybuffer",
  } as AxiosRequestConfig;
  const postdata = { data: avatarPath};

  let ret;
  try {
    const response = await axios.post(postAvatarDownloadApiUrl, postdata, config);
    if (response.status !== 201) return ret;
    const prefix = "data:" + response.headers["content-type"] + ";base64,";

    const imgBase64 = Buffer.from(response.data, "base64").toString('base64');
    const imgSrc = prefix + imgBase64;

    if (size >= 300) return imgSrc;
    const iconImg = await resizer(response.data, size)  //64 by 64 for icon image
    const iconImgBase64 = Buffer.from(iconImg).toString('base64');
    const iconImgSrc = prefix + iconImgBase64;

    ret = iconImgSrc;
    //console.log("postAvatarDownloadQuery", response.status, prefix, ret);

  } catch (err) {
    console.log("postAvatarDownloadQuery catch", err)
  }
  return ret;
}

export const postAvatarUploadQuery = async (selectedFile: File, maxSize: number) => {

  let resizedFile;
  if (maxSize === 0)
    resizedFile = selectedFile;
  else
    resizedFile= await resizeImageFile(selectedFile, maxSize) as File;

  const formData = new FormData();
  //formData.append("file", selectedFile);
  formData.append("file", resizedFile)

  const config = {withCredentials: true,}
  let ret;

  try {
    const {data:response} = await axios.post(postAvatarUploadApiUrl, formData, config);
    //const response = await axios.post(postAvatarUploadApiUrl, formData, config);
    ret = response;
    //console.log("postAvatarUploadQuery", response, ret);

  } catch (err) {
    console.log("postAvatarUploadQuery catch", err)
  }
  return ret;
}


/*
export const avatarAtom = atom({
  key: 'avatarAtom',
  default: selector({
    key: 'avatarLoader',
    get: async({get}) => {

      const whoami = get(whoamiAtom);
      if (!whoami) return undefined;

      //const avatarPath = await getAvatarQuery();
      const whoamiDetail = get(whoamiDetailAtom);
      if (!whoamiDetail) return undefined;
      const avatarPath = whoamiDetail?.whoamiDetail.avatar;

      if (!avatarPath) return undefined;
      const imgsrc =  await postAvatarDownloadQuery(avatarPath, 64);

      if (!imgsrc) return undefined;
      //console.log("===avatarAtom===", avatarPath)
      return {path: avatarPath, imgsrc: imgsrc};
    },

    cachePolicy_UNSTABLE: {
      eviction: "most-recent",
    },
  }),
});
*/

