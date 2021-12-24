export const getDidFromTokenURI = tokenURI => {
  const [ipfsWithColon, _, cid, didFilename] = tokenURI.split("/");
  const [did] = didFilename.split(".json");
  return {
    did,
    cid,
    tokenURI,
    filename: didFilename,
  };
};