const ipfsUrl = "https://infura-ipfs.io/ipfs/";

const imageToSrc = (input, mediaType = undefined) => {
  if (input == null) return null;

  if (input.length === 0) {
    return null;
  }

  if (Array.isArray(input)) {
    input = input.join("");
  }

  const base64regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

  if (input.startsWith("http")) {
    return input;
  } else if (input.startsWith("data:image")) {
    return input;
  } else if (input.includes(";base64," && base64regex.test(input))) {
    if (mediaType) {
      return "data:" + mediaType + ";base64," + input;
    } else {
      return "data:image/png;base64," + input;
    }
  } else if (input.startsWith("ipfs://"))
    return ipfsUrl + input.split("ipfs://")[1].split("ipfs/").slice(-1)[0];
  else if (
    (input.startsWith("Qm") && input.length === 46) ||
    (input.startsWith("baf") && input.length === 59)
  ) {
    return ipfsUrl + input;
  }
  return null;
};

export default function AssetImage({ image, className }) {
  image = imageToSrc(image);
  return <>{image && <img src={image} className={className} />}</>;
}
