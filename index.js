"use strict";
const https = require("https");
const fs = require("fs");

var fileContent = "title_en,title_zh,url,FI,rate,rateCount,clipsCount\n";

var perPage = 50;

var countryIndex = 0;
const countryList = ["kr", "cn", "jp", "tw", "th"];

function query(page, country) {
  var url =
    "https://api.viki.io/v4/containers.json?page=" +
    page +
    "&per_page=50&with_paging=false&order=desc&sort=views_recent&origin_country=" +
    country +
    "&licensed=true&app=100000a";

  https
    .get(url, function (res) {
      var body = "";
      res.on("data", function (chunk) {
        body += chunk;
      });

      res.on("end", function () {
        var result = JSON.parse(body);

        result.response.forEach((r) => {
          if (r.subtitle_completions.fi) {
            fileContent += `\"${r.titles.en}\"` + ",";
            fileContent += `\"${r.titles.zh}\"` + ",";
            fileContent += r.url.web + ",";
            fileContent += r.subtitle_completions.fi + ",";
            fileContent += r.review_stats.average_rating + ",";
            fileContent += r.review_stats.count + ",";

            if (r.clips) {
              fileContent += r.clips.count + "\n";
            } else {
              fileContent += "\n";
            }
          }
        });

        if (result.more) {
          query(page + 1, country);
        } else {
          countryIndex++;
          if (countryIndex < countryList.length) {
            fileContent += "\n\n\n";
            query(1, countryList[countryIndex]);
          } else {
            fs.writeFile("./result.csv", fileContent, function (err) {
              if (err) {
                return console.log(err);
              }
              console.log("The file was saved!");
            });
          }
        }
      });
    })
    .on("error", function (e) {
      console.log("Got an error: ", e);
    });
}

query(1, countryList[countryIndex]);
