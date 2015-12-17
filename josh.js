function buildSeparationDisplayImgs(separationArray) {
  // Take an array of promises and wait on them all
  var separationArrayNameUrls =  buildSeparationDisplayImgUrls(separationArray);
  var separationArrayIdUrls = [];

  return Promise.all(
    name_array_url.map(API_CALL_1)).then (

      function(url_array_getters) {
        var image_array_ = idArray.map(API_CALL_2);
        return Promise.all (
          urlArray.map(apiGetWait)).then (

            function(imgArray) {
              displaySeparationImgs(imgArray);
            }
          )
      }
    )
}
