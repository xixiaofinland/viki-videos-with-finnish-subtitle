'use strict';
var https = require('https');

var page = 1;
var perPage = 1;

var url = 'https://api.viki.io/v4/containers.json?page=' + page + '&per_page=' + perPage + '&with_paging=false&order=desc&sort=views_recent&origin_country=kr&licensed=true&app=100000a';

https.get(url, function(res){
    var body = '';
    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var more = false;
        var result = JSON.parse(body);
        more = result.more;

        result.response.forEach(r => {
          console.log(r.titles.en);
          console.log(r.clips.count);
          console.log('1: ' + r.subtitle_completions.fi);
          console.log('clips: ' + r.url.web);
          console.log('rate: ' + r.review_stats.average_rating);
          console.log('r-count: ' + r.review_stats.count);

        });

    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});
