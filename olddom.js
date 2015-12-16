//API keys
var apiTMDBKey = "d5a7fb8a0b7dadfb9db32196dd24e784";
var apiBaconOracleKey = "?p=38b99ce9ec87";
var baconOracleUrl =  "http://oracleofbacon.org/cgi-bin/json" + apiBaconOracleKey;
var centerParam = "&center=Kevin+Bacon" //Use actor name here
var actorsParam = "&a=Kevin+Bacon&b=Kyra+Sedgwick";


$('#calcDegSepBtn').click(function() {

  //Replace blanks with + (check all blanks)
  var actor1 = $('#actor1').val().replace(" ", "+");
  var actor2 = $('#actor2').val().replace(" ", "+");
  var url = baconOracleUrl + "&a=" + actor1 + "&b=" + actor2;

  // Call the API to get the results of the search
  // for this connection.
  apiGet(url, doneBaconOracle, failBaconOracle);
});

function apiGet(urlToGet, doneFcn, failFcn) {
console.log("urlToGet: ", urlToGet);
  var getter = $.ajax({
    url: urlToGet,
    method: "GET",
    datatype: "json"}
  );

  getter.done(function(response) {
    doneFcn(response, urlToGet);
  });

  getter.fail(function() {
console.log("error");
    failFcn(response);
  });
}

function doneBaconOracle(response, url) {
console.log("inside doneBaconOracle");
  if (response.status === "success"){
    // Clear last results
    clearResults();
console.log(response);
    //Build the connection chain
    buildSeparationDisplay(response.link);
  }
//
//   else if (response.status === "spellcheck") {
// console.log(jsonResponse);
// console.log(response.matches);
//
//     //Pick the first suggested name...FIX this to
//     // allow spell suggestions to come up.
//     //Can't call api within an api.
//     var spellCorrectedActor = response.matches[0];
//     url.replace(response.name, spellCorrectedActor);
// console.log(url);
//     apiGet(url, doneBaconOracle, failBaconOracle);
//   }

  else if (response.status === "error") {
console.log("error");
    clearResults();
    console.log(response.message);

  }
}

function buildSeparationDisplay(separationArray) {

  //The first element is an artist, and the array
  // alternates between artists and works from there on.
  for (var i = 0; i < separationArray.length; i+=2) {

    //Display artist, chain, and work.  First the artist.
    displayNode(separationArray[i], "artist");      // artist

    //If this is not the last artist, display the connecting work.
    if ((i+2) < separationArray.length) {
      displayNode("|", "chain");                   // chain link
      displayNode(separationArray[i+1], "work");  // work
    }

    //If there are more artists to follow,
    // display another chain.
    if ((i+2) < separationArray.length)  {
     displayNode("|", "chain");                  // chain link
   }
 }
}

function displayNode(text) {
  var node = document.createElement("p");
  node.innerHTML = text;
  $('#results').append(node);
  return(node);
}


function clearResults() {
  $('#results').empty();

}
function failBaconOracle(response) {
  console.log("Failed Bacon Oracle");
}
