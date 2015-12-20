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
var baconUrlCenter = "http://oracleofbacon.org/cgi-bin/xml?p=38b99ce9ec87&center="

var anonymousFile = "css/Questionmark.jpg";

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
// When user selects a name from the either dropdown spellcheck
// actor name lists, resend the actor connection request.
$("#spellList1").change(function () {
    var name = $(this).find(":selected").text();
    $('#actor1').val(name);
    $('#actor1').text(name);
    $('#spellList1').hide();
});

$("#spellList2").change(function () {
  var name = $(this).find(":selected").text();
  $('#actor2').val(name);
  $('#actor2').text(name);
  $('#spellList2').hide();
});
//=======================================================

//=======================================================
// Call an API with the given callbacks
function apiGet(urlToGet, doneFcn, failFcn, doneArray) {
  console.log(urlToGet);
  var getter = $.ajax({
    url: urlToGet,
    method: "GET",
    datatype: "json"}
  );

  getter.done(function(response) {
    doneFcn(response);
  });

  getter.fail(function(response) {
    failFcn(response);
  });
}
//=======================================================

//=======================================================
// Call an API with no callbacks: promises use these.
function apiGetWait(urlToGet) {
  var getter = $.ajax({
    url: urlToGet,
    method: "GET",
    datatype: "json"}
  );
  getter.fail(function() {console.log('error in apiGetWait')})
  return(getter);
}
//=======================================================

//=======================================================
// When the Bacon Oracle is complete, display the results.
function baconOracleDone(response) {
  if (response.status === "spellcheck") {
    var actorNumber = (response.name.toUpperCase() === $('#actor1').val().toUpperCase()) ? 1 : 2;
    buildSpellList(response.matches, actorNumber);

    // var length = response.length;
    // response.splice(1, length-1);  //later, look at response.matches[0] and
    // make another call to baconOracle with that name.
    // or bring up a pulldown selection.
  } else if (response.status === "error") {
      clearResults();
      $('#connectionNumber').text(response.message);

  } else if (response.status === "success") {

    // Clear last results
    clearResults();

    //Remove year from movie title
    removeYears(response.link);

    //Display the connection chain
    // buildSeparationDisplay(response.link);

    //Display the connection chain with pictures.
    buildSeparationDisplayImgs(response.link);
  }

}

//=======================================================
function buildSpellList(nameArray, actorNumber) {
  $('#spellLists'+actorNumber).empty();
  nameArray.forEach( function(element) {
   var nameOption = document.createElement("option");

   $(nameOption).val(element);
  //  $(nameOption).attr("value", element);
   $(nameOption).text(element);
   $('#spellList'+actorNumber).append($(nameOption));
   $('#spellList'+actorNumber).show();
  });
}

//=======================================================

//=======================================================
// Remove the years at the end of the movie titles, if any.
function removeYears(artistWorkStringArray) {
  artistWorkStringArray.forEach(function (element, index) {
    var indexPara = element.indexOf('(');
    if (indexPara === -1) {
      artistWorkStringArray[index]=element.slice(0);
    } else {
      artistWorkStringArray[index]=element.slice(0, indexPara);
    }
  });
}
//=======================================================

//=======================================================
// Build the text connection display
function buildSeparationDisplay(separationArray) {

  //The first element is an artist, and the array
  // alternates between artists and works from there on.
  for (var i = 0; i < separationArray.length; i+=2) {

    //Display artist, chain, and work.  First the artist.
    displayNode(separationArray[i], $('#resultsChain'));      // artist

    //If this is not the last artist, display the connecting work.
    if ((i+2) <= separationArray.length) {
      displayChainNode($('#resultsChain'));
      // displayNode("|", "chain", $('#resultsChain'));                   // chain link
      displayNode(separationArray[i+1], $('#resultsChain'));  // work

      //If there are more artists to follow,
      // display another chain.
      if ((i+2) < separationArray.length)  {
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
  for (var i = 0; i < separationArray.length; i+=2) {
    separationArrayUrls = separationArray.map(function(element, index) {
      if ((index % 2) === 0) {
        var url = getImgUrl(element, "artist");
      } else {
        var url = getImgUrl(element, "title");
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

  Promise.all(
    separationArrayNameUrls.map(apiGetWait)).then (
      function(idArray) {
        idNameArray = saveIdNames(idArray);
        urlArray = idArray.map(convertUrlToId);
         Promise.all (
          urlArray.map(apiGetWait)).then (
            function(imgArray) {
              $('#connectionNumber').text(imgArray.length);
              displaySeparationImgs(imgArray, idNameArray);
              // console.log($('img.caption'));
              // $('img.caption').captionjs();
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

  return(idNameArray);
}

function elementIsArtist(obj) {
  return (obj.hasOwnProperty('name') );
}


//=======================================================
// Build one URL for either the movie or person location.
function convertUrlToId(element, index) {
  var id = "";
  if (element.results.length === 0) {
    console.log("No image for this element");
  } else if ( element.results[0].hasOwnProperty('title') ) {
    //This is a movie, so get the movie id.
    id = tmdbUrlBase  + "movie/" + element.results[0].id + "/images" + tmdbUrlKey;

  } else {
      //This is a person, so get the person id.
    id = tmdbUrlBase + "person/" + element.results[0].id + "/images" + tmdbUrlKey;
  }

  return(id);
}

//=======================================================

//=======================================================
// Iterate through the array of images, and display them
// with chain nodes in between.
function displaySeparationImgs(separationArray, idNameArray) {
  var name = "";
  // Cycle through each element of the response to add to response display
  for (var i = 0; i < separationArray.length; i+=2) {
    //Display artist, chain, and work.  First the artist.
    //Get the name of this image for later retrieval of TMDB info.

    var id = separationArray[i]["id"];
    for (var j = 0; j < idNameArray.length && idNameArray[j] !== id; j++) {
      name = idNameArray[j]["name"];
    }
    var artistFilePath =
    displayImgNode(separationArray[i], "artist", idNameArray[i].name);      // artist

    //If this is not the last artist, display the connecting work.
    if ((i+2) <= separationArray.length) {
      displayChainNode($('#resultsImgChain'));
      // displayNode("|", "chain", $('#resultsImgChain'));                   // chain link
      displayImgNode(separationArray[i+1], "movie", idNameArray[i+1].name);  // work

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
  var filePath = imgFilePath(image, type);

  var divNode = document.createElement("div");
  $('#resultsImgChain').append(divNode);

  var imgNode = document.createElement("img");
  $(imgNode).attr("src", filePath);
  $(imgNode).prop("class", "imgChainNode");
  $(imgNode).attr("data-caption", name);
  $(divNode).append(imgNode);
  var captionNode = document.createElement("p");
  $(captionNode).text(name);
  $(divNode).append(captionNode);
}

//=======================================================
// Build the image file path for the image location.
function imgFilePath(filePath, type) {
  var wholeFilePath ="";
  if (type === "artist") {
    if (filePath["profiles"].length === 0) {
      wholeFilePath = anonymousFile;
    } else {
      wholeFilePath = tmdbImgUrlPerson + filePath["profiles"][0]["file_path"];
    }
  } else {
      if (filePath["backdrops"].length === 0) {
        wholeFilePath = anonymousFile;
      } else {
         wholeFilePath = tmdbImgUrlMovie + filePath["backdrops"][0]["file_path"];
      }
  }
  return (wholeFilePath);
}

//=======================================================

//=======================================================
// Empty out the results panels for both text and
// image displays.
function clearResults() {
  $('#resultsChain').empty();
  $('#resultsImgChain').empty();
  $('#spellList1').find("option:gt(0)").remove();
  $('#spellList2').find("option:gt(0)").remove();

  // $('#spellList1').empty();
  // $('#spellList2').empty();
  $('#spellList1').hide();
  $('#spellList2').hide();
}

//=======================================================
// Warn user upon a Bacon Oradle API fail
function baconOracleFail(response) {
  console.log("Failed Bacon Oracle");
}
//=======================================================

//=======================================================
// Get the center number for an artist
// function baconCenter(name);

//
// Get the name
//
// Make API call for center
//
// Compute the center number
//  Parse the XML for the numbers
//  Compute the average number
//
// Return the center number


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
