var http = require('http');
var url = require('url');


//https://www.youtube.com/watch?v=YfVr-4hS_5o
//ALL TUTORIALS CODE FROM THE ABOVE URL 

function handle_income_request(req, res) {
    req.parse_url = url.parse(req.url,true);
    var coreurl = req.parse_url.pathname;
    console.log(req.headers);
    console.log(req.method);
    if (coreurl == "/albums")
        handle_loadalbums(req, res);
    else if (coreurl == "/movies")
        handle_loadmovies(req, res);
    else {
        handle_invalidurl(req, res);
    }
}
function handle_invalidurl(req, res) {
    


    console.log("incoming request" + req.method + " ");
    res.writeHead(200, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: "Invalid URL" }) + "\n");

}

function handle_loadmovies(req, res) {
    console.log("incoming request" + req.method + " ");
    res.writeHead(200, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: null,message:"movies" }) + "\n");

}
function handle_loadalbums(req, res) {
    
    //http://localhost:8080/albums?id=19
    
    

    req.parse_url = url.parse(req.url, true);
    console.log(req.parse_url.query.id);


    console.log("\n\n\n\nincoming request" + req.method + " ");
    res.writeHead(200, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: null, message: "albumbs" }) + "\n");

}

var s = http.createServer(handle_income_request);
s.listen(8080);
