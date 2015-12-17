//APIs

//TMDB API
var tmdbKey = "d5a7fb8a0b7dadfb9db32196dd24e784";
var tmdbUrlKey = "?api_key=" + tmdbKey;
var tmdbUrlBase = "https://api.themoviedb.org/3/";
var tmdbUrlConfig = tmdbUrlBase + "configuration" + tmdbUrlKey;
var tmdbUrlSearchPerson = tmdbUrlBase + "search/person/" + tmdbUrlKey + "&query=";
var tmdbUrlSearchMovie = tmdbUrlBase + "search/movie/" + tmdbUrlKey + "&query=";
var tmdbUrlImgPerson = tmdbUrlBase;
var tmdbUrlImgMovie = tmdbUrlBase;
var tmdbImgSizePerson = "w92";  // hardcoded preferred size
var tmdbImgSizeMovie = "w185"; // hardcoded preferred size
var tmdbImgUrlBase = "";
var tmdbImgUrlPerson = "";
var tmdbImgUrlMovie = "";
var tmdbIdToName = [];

 //Bacon Oracle API
var baconKey = "38b99ce9ec87";
var baconUrlKey = "?p=" + baconKey;
var baconUrlBase = "http://oracleofbacon.org/cgi-bin/json";
var baconUrlConnect = baconUrlBase + baconUrlKey;


//=======================================================
// When user clicks the submit button for connection,
// call the connection API
$('#calcDegSepBtn').click(function() {

  //Replace blanks with + (check all blanks)
  var actor1 = $('#actor1').val().replace(" ", "+");
  var actor2 = $('#actor2').val().replace(" ", "+");
  var url = baconUrlConnect + "&a=" + actor1 + "&b=" + actor2;

  // Call the API to get the results of the search
  // for this connection.
  apiGet(url, baconOracleDone, baconOracleFail);
});
//=======================================================

//=======================================================
// Call an API with the given callbacks
function apiGet(urlToGet, doneFcn, failFcn, doneArray) {
console.log("url to get: ", urlToGet);
  var getter = $.ajax({
    url: urlToGet,
    method: "GET",
    datatype: "json"}
  );

  getter.done(function(response) {
    doneFcn(response);
  });

  getter.fail(function() {
    failFcn(response);
  });
}
//=======================================================

//=======================================================
// Call an API with no callbacks: promises use these.
function apiGetWait(urlToGet) {
  console.log("urlToGet in apiGetWait:", urlToGet);
  var getter = $.ajax({
    url: urlToGet,
    method: "GET",
    datatype: "json"}
  );
  getter.fail(function() {console.log('error in apiGetWait')})
  console.log("apiGetWait getter = ", getter);
  return(getter);
}
//=======================================================

//=======================================================
// When the Bacon Oracle is complete, display the results.
function baconOracleDone(response) {
  if (response.status === "spellcheck") {
    var length = response.length;
    response.splice(1, length-1);
  } else if (response.status === "error") {
      clearResults();
      console.log("Error with Bacon Oracle get")

  } else if (response.status === "success") {

    // Clear last results
    clearResults();

    //Remove year from movie title
    removeYears(response.link);

    //Display the connection chain
    buildSeparationDisplay(response.link);

    //Display the connection chain with pictures.
    buildSeparationDisplayImgs(response.link);
  }

}
  //=======================================================

        //KEEP B BELOW
//
//   else if (response.status === "spellcheck") {
// console.log(jsonResponse);
// console.log(response.matches);
//
//     //Pick the first suggested name...FIX this to
//     // allow spell suggestions to come up.
//     //Can't call api within an api.
//     var spellCorrectedActor = response.matches[0];
//     .replace(response.name, spellCorrectedActor);
// console.log(url);
//     apiGet(url, doneBaconOracle, failBaconOracle);
//   }
//=======================================================

//=======================================================
// Remove the years at the end of the movie titles, if any.
function removeYears(artistWorkStringArray) {
  artistWorkStringArray.forEach(function (element, index) {
    var indexPara = element.indexOf('(');
console.log("para index: ", element, indexPara);
    if (indexPara === -1) {
      artistWorkStringArray[index]=element.slice(0);
    } else {
console.log("doing the para extraction!");
      artistWorkStringArray[index]=element.slice(0, indexPara);
console.log("Work without para: ", artistWorkStringArray[index]);
    }
  });
}
//=======================================================

//=======================================================
// Build the text connection display
function buildSeparationDisplay(separationArray) {
console.log("separationArray = ", separationArray);
  //The first element is an artist, and the array
  // alternates between artists and works from there on.
  console.log("separationArray.length = ", separationArray.length);
  for (var i = 0; i < separationArray.length; i+=2) {

    //Display artist, chain, and work.  First the artist.
    displayNode(separationArray[i], $('#resultsChain'));      // artist
console.log("displaying artist");

    //If this is not the last artist, display the connecting work.
    if ((i+2) <= separationArray.length) {
      displayChainNode($('#resultsChain'));
      // displayNode("|", "chain", $('#resultsChain'));                   // chain link
      displayNode(separationArray[i+1], $('#resultsChain'));  // work
console.log("displaying movie");

      //If there are more artists to follow,
      // display another chain.
      if ((i+2) < separationArray.length)  {
console.log("i+2= ", i+2,  separationArray.length)
        displayChainNode($('#resultsChain'));
        // displayNode("|", "chain", $('#resultsChain'));                  // chain link
      }
    }
  }
}

//=======================================================

//=======================================================
// Build the URLs for the image connection display
function buildSeparationDisplayImgUrls(separationArray) {
  var separationArrayUrls=[];
console.log("separationArray = ", separationArray);
  for (var i = 0; i < separationArray.length; i+=2) {
    separationArrayUrls = separationArray.map(function(element, index) {
      if ((index % 2) === 0) {
        var url = getImgUrl(element, "artist");
console.log("url of artist: ", url);
      } else {
        var url = getImgUrl(element, "title");
console.log("url of movie: ", url);
      }
      return url;
    });
  };
  return (separationArrayUrls);
};
//=======================================================

//=======================================================
// Build the text connection display
function buildSeparationDisplayImgs(separationArray) {
  // Take an array of promises and wait on them all
  var separationArrayNameUrls =  buildSeparationDisplayImgUrls(separationArray);
  var separationArrayIdUrls = [];
  var idNameArray = [];
  var urlArray = [];

console.log("separationArrayNameUrls = ", separationArrayNameUrls);
  return Promise.all(
    separationArrayNameUrls.map(apiGetWait)).then (
      function(idArray) {
        console.log("idArray = ", idArray);
        idNameArray = saveIdNames(idArray);
        urlArray = idArray.map(convertUrlToId);
        console.log("urlArray = ", urlArray);
        return Promise.all (
          urlArray.map(apiGetWait)).then (
            function(imgArray) {
              console.log("imgArray = ", imgArray);
              displaySeparationImgs(imgArray, idNameArray);
              console.log($('img.caption'));
              $('img.caption').captionjs();
            }
          )
      }
    )
}

//=======================================================
// Save the id name pair for the display
function saveIdNames(idArray) {
  var name = "";
  var id = "";
  var idNameArray = [];
  var obj = {};
  idArray.forEach(function (element) {
    id = element["results"][0]["id"];
    obj = element["results"][0];
    if (elementIsArtist(obj)) {
      name = element["results"][0]["name"];
    } else {
      name = element["results"][0]["title"];
    }
    idNameArray.push({"id":id, "name": name});
  })
  console.log(idNameArray);
  return(idNameArray);
}

function elementIsArtist(obj) {
  return (obj.hasOwnProperty('name') );
}


//=======================================================
// Build one URL for either the movie or person location.
function convertUrlToId(element, index) {
  var id = "";
  console.log("element = ", element);
  if (element.results.length === 0) {
    console.log("No image for this element");
  } else {
    if ( element.results[0].hasOwnProperty('title') ) {
      //This is a movie, so get the movie id.
      id = tmdbUrlBase  + "movie/" + element.results[0].id + "/images" + tmdbUrlKey;

    } else {
      //This is a person, so get the person id.
      id = tmdbUrlBase + "person/" + element.results[0].id + "/images" + tmdbUrlKey;
    }
    console.log("id = ", id);

    return(id);
  }
}

//=======================================================

//=======================================================
// Iterate through the array of images, and display them
// with chain nodes in between.
function displaySeparationImgs(separationArray, idNameArray) {
  var name = "";
console.log("separationArray = ", separationArray);
console.log("idNameArray = ", idNameArray);
  // Cycle through each element of the response to add to response display
  for (var i = 0; i < separationArray.length; i+=2) {
    //Display artist, chain, and work.  First the artist.
    console.log("calling displayImgNode with artist", i, separationArray[i]);

    //Get the name of this image for later retrieval of TMDB info.

    var id = separationArray[i]["id"];
    console.log("id inside displaySeparationImgs = ", id);
    for (var j = 0; j < idNameArray.length && idNameArray[j] !== id; j++) {
      name = idNameArray[j]["name"];
    }
console.log(name);
console.log("separationArray[i]", separationArray[i]);
    var artistFilePath =
    displayImgNode(separationArray[i], "artist", name);      // artist

    //If this is not the last artist, display the connecting work.
    if ((i+2) <= separationArray.length) {
      displayChainNode($('#resultsImgChain'));
      // displayNode("|", "chain", $('#resultsImgChain'));                   // chain link
      console.log("calling displayImgNode with movie", i+1, separationArray[i+1]);
      displayImgNode(separationArray[i+1], "movie", name);  // work

      //If there are more artists to follow,
      // display another chain.
      if ((i+2) < separationArray.length)  {
        displayChainNode($('#resultsImgChain'));
        // displayNode("|", "chain", $('#resultsImgChain'));
      }
    }
  }
}

//=======================================================

//=======================================================
// Build the API URL string depending on the type of image requested.
function getImgUrl(text, type) {
  var filePath;
  if (type === "artist") {
    filePath = getImagePersonUrl(text);
  } else {  //movie
    filePath = getImageMovieUrl(text);
  }
  console.log("filepath = ", filePath);
  return(filePath);
}

//=======================================================
// Build the API URL string for a movie
function getImageMovieUrl(title) {
  return (tmdbUrlSearchMovie + title);
}
//=======================================================

//=======================================================
//Build the API URL string for a person
function getImagePersonUrl(artist) {
  return (tmdbUrlSearchPerson + artist);
}

//=======================================================

//=======================================================
// Display one plain node of the chain to the results display.
function displayNode(text, container, label) {
  var node = document.createElement("p");
  node.innerHTML = text;
  $(node).prop("class", "chainNode");
  $(node).attr("data-caption", label);
  container.append(node);
  // $('#resultsChain').append(node);
}

function displayChainNode(container) {
  var node = document.createElement("i");
  $(node).prop("class", "fa fa-arrows-v chainNode");
  container.append(node);
}

//=======================================================

//=======================================================
// Display one image node of the chain to the results display.
function displayImgNode(image, type, name) {
  console.log("IMAGE = ", image);
  var filePath = imgFilePath(image, type);
  console.log("FILEPATH = ", filePath);

  var node = document.createElement("img");
console.log("image = ", image);
  $(node).attr("src", filePath);
  $(node).prop("class", "imgChainNode");
  $(node).attr("data-caption", name);
console.log("node = ", node);
console.log($(node).attr("src"));
  $('#resultsImgChain').append(node);
}

//=======================================================
// Build the image file path for the image location.
function imgFilePath(filePath, type) {
  console.log("FILEPATHHHH = ", filePath, "type = ", type);
  console.log("type =", type);
  if (type === "artist") {
    var wholeFilePath = tmdbImgUrlPerson + filePath["profiles"][0]["file_path"];

  } else {
    var wholeFilePath = tmdbImgUrlMovie + filePath["backdrops"][0]["file_path"];
  }
console.log("filePath =" , wholeFilePath);
  return (wholeFilePath);
}

//=======================================================

//=======================================================
// Empty out the results panels for both text and
// image displays.
function clearResults() {
  $('#resultsChain').empty();
  $('#resultsImgChain').empty();
}

//=======================================================
// Warn user upon a Bacon Oradle API fail
function baconOracleFail(response) {
  console.log("Failed Bacon Oracle");
}
//=======================================================

//=======================================================
// Do some prep to get the console complete.
function readyStart() {
  apiGet(tmdbUrlConfig, readyDone, readyFail);
}
//=======================================================

//=======================================================
// Do more prep once we get the image locations
// from the TMDB API.
function readyDone(response) {
  tmdbImgUrlBase = response["images"]["base_url"];
  tmdbImgUrlPerson = tmdbImgUrlBase  + tmdbImgSizePerson;
  tmdbImgUrlMovie = tmdbImgUrlBase + tmdbImgSizeMovie;
}

//=======================================================
// Warn the user after a TMDB API call.
function readyFail(response) {
  console.log("Failed Ready Start");
}
//=======================================================
$(window).load(function() {
  console.log("loading");
    $('img.caption').captionjs();
});

$(document).ready(readyStart());
