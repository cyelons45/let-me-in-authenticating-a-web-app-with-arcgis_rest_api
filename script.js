require([
  "esri/portal/Portal",
  "esri/identity/OAuthInfo",
  "esri/identity/IdentityManager",
  "esri/request"
], function (Portal, OAuthInfo, esriId,esriRequest) {


  const info = new OAuthInfo({
    appId: "hlWG6s0SZxxQkEtS",
    popup: false, // the default
    portal:"https://sc-dhec.maps.arcgis.com/home/index.html"
  });
  esriId.registerOAuthInfos([info]);

  esriId
  .checkSignInStatus(info.portalUrl+"/sharing/rest?")
  .then(() => {
    handleSignedIn();
  })
  .catch(() => {
    handleSignedOut();

  });
function handleSignedIn() {

  const portal = new Portal();
  portal.load().then(() => {
    const results = { name: portal.user.fullName, username: portal.user.username };
    // console.log(portal)
    document.getElementById("results").innerText = JSON.stringify(results, null, 2);
  });

  var featureServiceUrl = "https://services2.arcgis.com/XZg2efAbaieYAXmu/arcgis/rest/services/TESTPool/FeatureServer/0";
  options = {
    query: {
        f: "json",
        where: "1=1",
        token: esriId.findCredential(info.portalUrl).token, // Include the user's token
        returnGeometry: true,
        outFields: "*"
    },
    responseType: "json"
};

   // Make the request to the secured feature service
   esriRequest(featureServiceUrl,options).then(function (response) {
    // Handle the response data here
    console.log(response);
  }).catch(function (error) {
    // Handle any errors that occur during the request
    console.error("Error fetching data from the feature service:", error);
  });
}

document.getElementById("sign-in").addEventListener("click", function () {
  esriId.getCredential(info.portalUrl+"/sharing/rest?");
 
});

document.getElementById("sign-out").addEventListener("click", function () {
  esriId.destroyCredentials();
  window.location.reload();
});



function handleSignedOut() {
  document.getElementById("results").innerText = 'Signed Out'
}

});