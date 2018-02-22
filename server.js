var express = require("express");
var path    = require ("path");
const app = express();

const ROOT = "./public";
const INDEX_HTML = ROOT + "/index.html";

app.get("/index", (req,res)=>{
	res.sendFile (path.join (__dirname, INDEX_HTML));
})

app.use(express.static(ROOT))


var port = process.env.PORT || 2501;
app.listen(port, ()=>{console.log("Listening on port " + port)});
