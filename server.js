const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const portNumber = 5001;
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

require("dotenv").config({ path: path.resolve(__dirname, '.env') })
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db = process.env.MONGO_DB_NAME;
const collection = process.env.MONGO_COLLECTION;
const apiKey = process.env.NEWS_API_KEY;


app.use(bodyParser.urlencoded({extended:false}));
process.stdin.setEncoding("utf8");

app.get("/", (request, response) => { 
    response.render("index");
});

app.get("/search", (request, response) => {
    response.render("search");
})

app.post("/searchResults", (request, response) => {
    let {query, country, category} = request.body;

    (async() => {
        try {

            let newsArticles = "";

            const link = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${query}&country=${country}&category=${category}`;
            const result = await fetch(link);
            const json = await result.json();

            if (json.totalResults === 0 || query.length === 0) {
                newsArticles += "Uh oh! There are no news articles associated with that title. Please try searching again.<br><br>";

                response.render("searchResults", {newsArticles});
            } else {
                newsArticles += "Here are the news articles that match your search query! <br>";
                newsArticles += "<table><tr><th>Title</th><th>Date Published</th><th>Link to Article</th></tr>";

                (json.results).forEach(article => {
                    newsArticles += `<tr><td>${article.title}</td><td>${article.pubDate}</td>
                    <td>click <a href=${article.link} target="_blank">here</a> for the article</td></tr>`;
                });

                newsArticles += "</table>";

                response.render("searchResults", {newsArticles});
            }
          } catch (e) {
            console.log("ERROR, ERROR: " + e);
          }
    })();

});

app.get("/reset", (request, response) => {
    response.render("reset");
});

app.post("/reset", (request, response) => {
    response.render("resetConfirmation", {count: 5});
});

app.listen(portNumber);