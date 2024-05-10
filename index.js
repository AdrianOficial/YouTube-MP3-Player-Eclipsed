const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const PORT = process.env.PORT || 5029;
const { GetListByKeyword } = require("./searchAPI.js");

app.get('/search', async (req, res) => {
	try {
        const key = req.query.key;
        if (!key) {
            return res.status(400).send('No key provided');
        }
		
		const response = await GetListByKeyword(key, false, 10);		
		res.header({
		  'Content-Type': 'audio/mpeg',
		  'Access-Control-Allow-Origin': '*'
		});
		res.send(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Something went wrong');
    }
});

app.get('/stream', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url || !ytdl.validateURL(url)) {
            return res.status(400).send('Invalid YouTube URL');
        }
        const videoInfo = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
        const highestQuality = ytdl.chooseFormat(formats, { quality: 'highestaudio' });
		res.header({
            'Content-Type': 'audio/wav',
            'Access-Control-Allow-Origin': '*'
        });
        ytdl(url, { format: 'wav', filter: 'audioonly' }).pipe(res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Something went wrong');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
