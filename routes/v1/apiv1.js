import fetch from 'node-fetch';
import parser from 'node-html-parser'; 
import express from 'express';

var router = express.Router();

router.get('/', (req, res) => {
  res.send('this is the api/v1 endpoint');
});

router.get('/urls/preview', async (req,res) => {
  try {
    let url = req.query.url;
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }
    let previwText = await response.text();
    
    let htmlPage = parser.parse(previwText);
    let metaTags = htmlPage.querySelectorAll("meta");

    let ogUrl = url;
    let title = "";
    let image = "";
    let description = "";
    let site_name = "";

    metaTags.forEach((ogTag) => {
      let property = ogTag.attributes.property;
      let content = ogTag.attributes.content;

      if (property && property.startsWith("og:")) {
        if (property === "og:url") {
          ogUrl = content || url;
        } else if (property === "og:title") {
          title = content;
        } else if (property === "og:image") {
          image = content;
        } else if (property === "og:description") {
          description = content;
        } else if (property === "og:site_name" || property === "og:sitename") {
          site_name = content;
        }
      }
    });

    if (!title) {
      let titleTag = htmlPage.querySelector("title");
      title = titleTag ? titleTag.text : url;
    };

    let htmlReturn = `
      <div style='max-width: 300px; border: solid 1px; padding: 5px; text-align: center; box-shadow: #E7473C 4px 4px 0 0;
      ;'>
        <a href="${ogUrl}">
        ${site_name ? `<p><strong>${title}</strong>, ${site_name}`: `<p><strong>${title}</strong>`}</p>
          ${image ? `<img src="${image}" alt="image preview" style='max-height: 200px; max-width: 270px;'/>` : ""}
        </a>
        ${description ? `<p>${description}</p>` : ""}
      </div>
    `;

    console.log(htmlReturn);

    res.type("html");
    res.send(htmlReturn);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Error fetching or parsing the URL');
  }
});

export default router;