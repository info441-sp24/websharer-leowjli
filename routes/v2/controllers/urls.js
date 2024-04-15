import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

router.get('/preview', async (req, res) => {
  try {
    let url = req.query.url;
    const html = await getURLPreview(url);
    res.type("html");
    res.send(html);
  } catch(err) {
    console.error('Error:', err.message);
    res.status(500).send('Error fetching or parsing the URL');
  }
});

export default router;