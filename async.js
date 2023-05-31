const fs = require("fs");

const countryList = ["kr", "cn", "jp", "tw", "th"];
const rootURL = "https://api.viki.io/v4/containers.json?page=";
const parameters =
  "&per_page=50&with_paging=false&order=desc&sort=views_recent&licensed=true&app=100000a&origin_country=";

const queryCountryList = async function (list) {
  let fileContent = "";

  for (const c of list) {
    let i = 1;
    while (true) {
      const { result, hasMore } = await query(i, c);
      fileContent += result;
      if (!hasMore) {
        fileContent += "\n\n\n";
        break;
      }
      i++;
    }
  }
  return fileContent;
};

const query = async function (page, country) {
  const url = rootURL + page + parameters + country;

  let result = "";

  const res = await fetch(url);
  const data = await readResponse(res);

  data.response
    .filter((d) => d.subtitle_completions.fi)
    .forEach((d) => (result += pickData(d)));

  return { result: result, hasMore: data.more };
};

const readResponse = async function (data) {
  let allChunks = "";
  for await (const chunk of data.body) {
    allChunks += Buffer.from(chunk).toString("utf8");
  }

  return JSON.parse(allChunks);
};

const pickData = function (data) {
  let result = "";
  console.log(data);
  result += `\"${data.titles.en}\"` + ",";
  result += `\"${data.titles.zh}\"` + ",";
  result += data.url.web + ",";
  result += data.subtitle_completions.fi + ",";
  result += data.review_stats.average_rating + ",";
  result += data.review_stats.count + ",";
  result += data.clips ? data.clips.count + "\n" : "\n";

  return result;
};

(async () => {
  try {
    let fileResult = "title_en,title_zh,url,FI,rate,rateCount,clipsCount\n";
    fileResult += await queryCountryList(countryList);

    fs.writeFile("./result2.csv", fileResult, function (err) {
      if (err) {
        throw new Error(err);
      }
      console.log("The file is saved!");
    });
  } catch (err) {
    console.error(err);
  }
})();
