function generateRandomString(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

setTimeout(() => {
  //Get by class markdown
  const markdown = document.getElementsByClassName("markdown");
  //Get elements inside markdown[0]
  const elements = markdown[0].children;
  //Replace SecretCode from elements value to lol
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    element.innerHTML = element.innerHTML.replace(/SecretCode/g, ConfigSecret);
  }
}, 1000);

window.onload = function () {
  console.log(SwaggerUIBundle.plugins.DownloadUrl);
  console.log(SwaggerUIBundle.presets.apis);
  console.log(SwaggerUIStandalonePreset);

  // Build a system
  const ui = SwaggerUIBundle({
    //Get hostname with port used by the server
    url: `http://${window.location.host}${ConfigUrl}`,
    dom_id: "#swagger-ui",
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: "StandaloneLayout",
    requestInterceptor: function (req) {
      let jwt = KJUR.jws.JWS.sign(
        "HS256",
        { alg: "HS256", typ: "JWT" },
        {
          name: generateRandomString(50),
          iat: Math.floor(Date.now() / 1000),
        },
        ConfigSecret
      );
      req.headers["Tag"] = jwt;

      let Tag = $('*[placeholder="Tag"]');
      for (let index = 0; index < 100; index++) {
        const element = Tag[index];
        if (element) {
          let jwt = KJUR.jws.JWS.sign(
            "HS256",
            { alg: "HS256", typ: "JWT" },
            {
              name: generateRandomString(50),
              iat: Math.floor(Date.now() / 1000),
            },
            ConfigSecret
          );

          element.value = jwt;
        }
      }
      return req;
    },
  });

  window.ui = ui;
};
