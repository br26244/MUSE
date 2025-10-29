import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

let accToken = "";
let tokExpiration = 0;

app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // We'll set this later
    credentials: true
}));

app.get("/api/random", async (req, res) => {
    const {genre = "soul", year = "1970-1980"} = req.query;

    try{
        const genreList = genre.split(/[,&]/);
        const randomGenre = genreList[Math.floor(Math.random() * genreList.length)];
        const DiscogResp = await axios.get("https://api.discogs.com/database/search" , {
            params: {
                genre,
                year,
                type: "release",
                per_page: 50,
                page: 1,
                token: process.env.DISCOGTOKEN,
            },
            headers: {"User-Agent": "RandomSampleApp/1.0"},
        });

        const releases = DiscogResp.data.results;

        if(releases.length === 0){
            return res.json({error: "No releases found for the specified genre and year."});
        }
        const randomSelect = releases[Math.floor(Math.random() * releases.length)];
        const artist = randomSelect.title.split(" - ")[0] || "Unknown Artist";
        const track = randomSelect.title.split(" - ")[1] || "Unknown Track";

        const ytResp = await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                part: "snippet",
                q: `${artist} ${track}`,
                type: "video",
                maxResults: 5,
                key: process.env.YOUTUBEAPIKEY,
            },
        });

        const videos = ytResp.data.items;
        if(videos.length === 0){
            return res.json({error: "No YouTube videos found for the selected track."});
        }
        const video = videos[0];

        res.json({
            artist,
            title: randomSelect.title,
            year: randomSelect.year || year,
            track,
            discogsUrl: `https://www.discogs.com${randomSelect.uri}`,
            youtubeUrl: `https://www.youtube.com/watch?v=${videos[0].id.videoId}`,
            thumbnail: videos[0].snippet.thumbnails.high.url,
            channel: videos[0].snippet.channelTitle,
        });
    } catch (error){
        console.error(error?.response?.data || error.message);
        res.status(500).json({error: "An error occurred while processing your request."});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running discogs and yt on port ${PORT}`);
});