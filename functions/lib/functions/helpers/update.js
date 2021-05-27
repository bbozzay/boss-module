const uniqueMetaData = (sourceMeta, targetMeta) => {
  // If target user_metadata is null, return the sourceMeta without performing any checks
  // This is because we aren't worried about overriding anything
  return !targetMeta ? sourceMeta : (() => {
    let meta = null;
    for (let i in sourceMeta) {
      targetMeta.hasOwnProperty(i) ? false : (() => {
          // If meta is null, make it an object with this as the first property
          !meta ? meta = { [i]: sourceMeta[i] } : meta[i] = sourceMeta[i];
        })();
    }
    // Return an object with unique properties or null
    return meta;
  })()
}

module.exports = {
    uniqueMetaData
}