const cors_proxy = require("cors-anywhere");

cors_proxy.createServer({
  originWhitelist: [], 
  requireHeader: ["origin", "x-requested-with"],
  removeHeaders: ["cookie", "cookie2"]
}).listen(8080, () => {
  console.log("Proxy attivo su http://localhost:8080");
});
