This tool fetches viki.com TV-series that have Finnish subtitles.

It contains 2 versions:

- `index.js` is the old callback function way
- `async.js` is the new async/await way

They both serve the same purpose.

With node installed, you can run `node index.js` to generate a `result.csv` in the same directory.
`node async.js` needs node version18 or later. It will generate a `result2.csv`.

Once the csv is generated, you can import it into googlesheet for better readability.