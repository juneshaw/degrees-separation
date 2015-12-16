//API keys
//TMDB API
var tmdbKey = "d5a7fb8a0b7dadfb9db32196dd24e784";
var tmdbUrlKey = "?api_key=" + tmdbKey;
var tmdbUrlBase = "https://api.themoviedb.org/3/";
var tmdbUrlConfig = tmdbUrlBase + "configuration" + tmdbUrlKey;
var tmdbUrlSearchPerson = tmdbUrlBase + "search/person/" + tmdbUrlKey + "&query=";
var tmdbUrlSearchMovie = tmdbUrlBase + "search/movie/" + tmdbUrlKey + "&query=";

var tmdbUrlImgPerson = tmdbUrlBase + "person/"; // then <id>/images, then access profiles[0].file_path.
var tmdbUrlImgMovie = tmdbUrlBase + "movie/"; // then <id>/images, then access backdrops[0].file_path

var tmdbImgSizePerson = "w92";  // hardcoded preferred size
var tmdbImgSizeMovie = "w185"; // hardcoded preferred size
var tmdbImgUrlBase = "";
var tmdbImgUrlPerson = "";
var tmdbImgUrlMovie = "";



//
 //"https://api.themoviedb.org/3/search/person/?api_key="+tmdbKey+"&query="
 //Bacon Oracle API
var baconKey = "38b99ce9ec87";
var baconUrlKey = "?p=" + baconKey;
var baconUrlBase = "http://oracleofbacon.org/cgi-bin/json";
var baconUrlConnect = baconUrlBase + baconUrlKey;

// var apiBaconOracleKey = "?p=38b99ce9ec87";
// var baconUrlBase =  "http://oracleofbacon.org/cgi-bin/json" + apiBaconOracleKey;
// var centerParam = "&center=Kevin+Bacon" //Use actor name here
// var actorsParam = "&a=Kevin+Bacon&b=Kyra+Sedgwick";
// aha = api call search person
  // get results.id
  // do another api search for the image  with that person id.
// get the configuration (start of program) with
// https://api.themoviedb.org/3/configuration?api_key=d5a7fb8a0b7dadfb9db32196dd24e784
$('#calcDegSepBtn').click(function() {

  //Replace blanks with + (check all blanks)
  var actor1 = $('#actor1').val().replace(" ", "+");
  var actor2 = $('#actor2').val().replace(" ", "+");
  var url = baconUrlConnect + "&a=" + actor1 + "&b=" + actor2;

  // Call the API to get the results of the search
  // for this connection.
  apiGet(url, baconOracleDone, baconOracleFail);
});

//
//
//     // /=================
// function LoadCategories(argument){
//   var deferred = $.ajax({
//      // ajax setup
//   }).then(function(response){
//      // optional callback to handle this response
//   });
//   return deferred;
// }
// Then to call LoadContact() after all three ajax calls have returned and optionally executed their own individual callbacks:
//
// // setting variables to emphasize that the functions must return deferred objects
// var deferred1 = LoadCategories($('#Category'));
// var deferred2 = LoadPositions($('#Position'));
// var deferred3 = LoadDepartments($('#Department'));
//
// $.when(deferred1, deferred2, deferred3).then(LoadContact);
//
// /=================


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

function apiGetWait(urlToGet) {
  console.log("urlToGet in apiGetWait:", urlToGet);
  var getter = $.ajax({
    url: urlToGet,
    method: "GET",
    datatype: "json"}
  );
  console.log("apiGetWait getter = ", getter);
  return(getter);
}

function baconOracleDone(response) {
  if (response.status === "success"){

    // Clear last results
    clearResults();

    //Remove year from movie title
    removeYears(response.link);

    //Display the connection chain
    buildSeparationDisplay(response.link);

    //Display the connection chain with pictures.
    buildSeparationDisplayImgs(response.link);

  }

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

  else if (response.status === "error") {
    clearResults();
    console.log("Error retrieving data");

  }
}

function removeYears(artistWorkStringArray) {
  artistWorkStringArray.forEach(function (element, index) {
    var indexPara = element.indexOf("(");
console.log("para index: ", element, indexPara);
    if (indexPara === -1) {
      artistWorkStringArray[index]=element.slice(0);
    } else {
console.log("doing the para extraction!");
      artistWorkStringArray[index]=element.slice(0, indexPara);
console.log("Work without para: ", artistWorkStringArray[index]);
    }
    // var arrayString = element.split('');
    // var index = arrayString.indexOf("(");
    // if !index {
    //   arrayString.splice(index, -1);
    // }
    // artistWorkStringArray[index] = (arrayString.join(''));
  });
}

// function spliceSlice(str, index, count, add) {
//   return str.slice(0, index) + (add || "") + str.slice(index, -11);
// }

function buildSeparationDisplay(separationArray) {
console.log("separationArray = ", separationArray);
  //The first element is an artist, and the array
  // alternates between artists and works from there on.
  console.log("separationArray.length = ", separationArray.length);
  for (var i = 0; i < separationArray.length; i+=2) {

    //Display artist, chain, and work.  First the artist.
    displayNode(separationArray[i], "artist", i);      // artist

    //If this is not the last artist, display the connecting work.
    if ((i+2) <= separationArray.length) {
      displayNode("|", "chain", i);                   // chain link
      displayNode(separationArray[i+1], "work", i);  // work

      //If there are more artists to follow,
      // display another chain.
      if ((i+2) < separationArray.length)  {
        console.log("why am i here? ", "i+2 = ", (i+2), separationArray.length)
        displayNode("|", "chain");                  // chain link
      }
    }
  }
}

// OLD:
// function buildSeparationDisplayImgs(separationArray) {
// console.log("IMAGE separationArray = ", separationArray);
// for (var i = 0; i < separationArray.length; i+=2) {
//   console.log("separationArray = ", separationArray);
//   //Display artist, chain, and work.  First the artist.
//   //Get the image for the next artist and work.
//   image = getImage(separationArray[i], "artist")
//   console.log("image in build = ", image);
//   displayImgNode(image);
//
//   //If this is not the last artist, display the connecting work.
//   if ((i+2) < separationArray.length) {
//     // displayImgNode("|", "chain", i);
//     image = getImage(separationArray[i+1], "movie");         // chain link
//     console.log("image = ", image);
//     displayImgNode(image);  // work
//   }
//
//   //If there are more artists to follow,
//   // display another chain.
//   if ((i+2) < separationArray.length)  {
//     //  displayImgNode("|", "chain");                  // chain link
//   }
// }
// }

//NEW
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

function buildSeparationDisplayImgs(separationArray) {
  // Take an array of promises and wait on them all
  var separationArrayNameUrls =  buildSeparationDisplayImgUrls(separationArray);
  var separationArrayIdUrls = [];
console.log("separationArrayUrls = ", separationArrayNameUrls);
  return Promise.all(
    separationArrayNameUrls.map(apiGetWait).then (
      function(idArray) {
        idArray.map(convertUrlToId);
        return Promise.all(
          idArray.map(apiGetWait).then (
            //call function to draw images
            function(imgArray)
            displaySeparationImgs(imgArray);
          )
        )
      }
    )
  }

function displaySeparationImgs(separationArray) {
console.log("separationArray = ", separationArray);
  // Cycle through each element of the response to add to response display
  for (var i = 0; i < separationArray.length; i++) {
    //Display artist, chain, and work.  First the artist.
    var artistFilePath =
    displayImgNode(separationArray[i], "artist", i);      // artist

    //If this is not the last artist, display the connecting work.
    if ((i+2) <= separationArray.length) {
      displayNode("|", "chain", i);                   // chain link
      displayImgNode(separationArray[i+1], "work", i);  // work

      //If there are more artists to follow,
      // display another chain.
      if ((i+2) < separationArray.length)  {
        console.log("why am i here? ", "i+2 = ", (i+2), separationArray.length)
        displayNode("|", "chain");
      }
    }
  }
}

function getJSONPromise(url) {
  return (apiGetWait(url));
  // return apiGetWait(url).catch(function(error) {     Try later.
  //   console.log("getJSON failed for", url, error);
  //   throw err;
}


// //Old buildSeparationDisplayImgs
//   //The first element is an artist, and the array
//   // alternates between artists and works from there on.
//   ////////New below
//   for (var i = 0; i < separationArray.length; i+=2) {
// console.log("separationArray = ", separationArray);
//     //Display artist, chain, and work.  First the artist.
//     //Get the image for the next artist and work.
//     image = getImageUrl(separationArray[i], "artist")
// console.log("image in build = ", image);
//     displayImgNode(image);
//
//     //If this is not the last artist, display the connecting work.
//     if ((i+2) < separationArray.length) {
//       // displayImgNode("|", "chain", i);
//       image = getImageUrl(separationArray[i+1], "movie");         // chain link
//       console.log("image = ", image);
//       displayImgNode(image);  // work
//     }
//
//     //If there are more artists to follow,
//     // display another chain.
//     if ((i+2) < separationArray.length)  {
//     //  displayImgNode("|", "chain");                  // chain link
//    }
//  }
// }
////////New above

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

//     var imageUrl = tmdbUrlImgPerson + data["results"][0].id + "/images" + tmdbUrlKey;
//       var fullFilePath = tmdbImgUrlBasePerson + data.profiles[0].file_path;

//Old one
// function getImagePerson(name) {
//   console.log("getImagePerson api call 1: ", tmdbUrlSearchPerson + name);
//   var getterId = apiGetWait(tmdbUrlSearchPerson+name);
// console.log("getterId = ", getterId);
//   var getterImage = getterId.then(function(data) {
// console.log("data = ", data);
//     // var imageUrl = tmdbUrlImgPerson + data["results"][0].id + "/images" + tmdbUrlKey;
//     var imageUrl = tmdbUrlImgPerson + data["results"][0].id + "/images" + tmdbUrlKey;
//     console.log("imageUrl:-- ", imageUrl);
//     return(apiGetWait(imageUrl));
//   });
//   console.log("tmdbImgUrlBasePerson = ", tmdbImgUrlBasePerson);
//
//     $.when(getterImage).done(function(data) {
//       var fullFilePath = tmdbImgUrlBasePerson + data.profiles[0].file_path;
//       console.log("fullFilePath = ", fullFilePath);
//       return(fullFilePath);
//     }
//   )
//   return("Oops - beat the API for person");
// }
//New one
function getImagePersonUrl(name) {
  return (tmdbUrlSearchPerson + name);
}
//     var imageUrl = tmdbUrlImgMovie + data["results"][0].id + "/images" + tmdbUrlKey;
//       var fullFilePath = tmdbImgUrlBaseMovie + data.backdrops[0].file_path;


// $.when( { testing: 123 } ).done(function( x ) {

//Old one
// function getImageMovie(title) {
//   console.log("getImageMovie api call 1: ", tmdbUrlSearchMovie + title);
//   var getterId = apiGetWait(tmdbUrlSearchMovie+title);
//
//   var getterImage = getterId.then(function(data) {
//     console.log("getterImage data in getImageMovie 1: ", data);
//     var imageUrl = tmdbUrlImgMovie + data["results"][0].id + "/images" + tmdbUrlKey;
//     console.log("imageUrl: ", imageUrl);
//     return(apiGetWait(imageUrl))
//   });
//     getterImage.done(function(data) {
//       console.log("getterImage data in getImageMovie 2: ", data);
//       var fullFilePath = tmdbImgUrlBaseMovie + data.backdrops[0].file_path;
//       console.log("fullFilePath = ", fullFilePath);
//       return(fullFilePath);
//     }
//   )
//   return("Oops - beat the API for movie");
// }

//New one
function getImageMovieUrl(title) {
  return (tmdbUrlSearchMovie + title);
}

function displayNode(text, type, arrayIndex) {
  // var node = $("<p></p>").innerHTML(text);     // Create with jQuery
  // $(node).html(text);
  // $(node).attr("id", arrayIndex);

  var node = document.createElement("p");
  node.innerHTML = text;
  $(node).prop("class", "chainNode");
  $('#resultsChain').append(node);
}

function displayImgNode(image, type) {
  var filePath = imgFilePath(image, type);

  var node = document.createElement("img");
console.log("image = ", image);
  $(node).attr("src", filePath);
  $(node).prop("class", "imgChainNode");
console.log("node = ", node);
console.log($(node).attr("src"));
  $('#resultsImgChain').append(node);
}

function imgFilePath(filePath, type) {
  if (type === "artist") {
    var wholeFilePath = tmdbUrlImgPerson + "profiles[0]" + "." + filePath;
  } else {
    var wholeFilePath = tmdbUrlImgMovie + "backdrops[0]" + "." + filePath;
  }
console.log("filePath =" , wholeFilePath);
  return (wholeFilePath);
}

function clearResults() {
  $('#resultsChain').empty();
  $('#resultsImgChain').empty();
}

function baconOracleFail(response) {
  console.log("Failed Bacon Oracle");
}

function readyStart() {
  console.log(tmdbUrlConfig);
  apiGet(tmdbUrlConfig, readyDone, readyFail);
}

function readyDone(response) {
  tmdbImgUrlBase = response["images"]["base_url"];
  // tmdbImgUrlBase = response.tmdbImgs.base_url;
  tmdbImgUrlBasePerson = tmdbImgUrlBase  + tmdbImgSizePerson;
  tmdbImgUrlBaseMovie = tmdbImgUrlBase + tmdbImgSizeMovie;
}

function readyFail(response) {
  console.log("Failed Ready Start");
}

$(document).ready(readyStart());
