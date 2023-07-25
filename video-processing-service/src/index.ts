import express from "express";
import ffmpeg from "fluent-ffmpeg";


const app = express(); 
app.use(express.json())
//const port = 3000;


app.post("/process-video", (req, res) => { 
    //get the path of the video file from the req body 
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath; 

    if(!inputFilePath || !outputFilePath){
        res.status(400).send("Bad Request: Missing input and/or output file path.")
    }

    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360") //video resolution 360p 
        .on("end", () =>{
            res.status(200).send("Video processing finished successfully.");
        })
        .on("error", (err) =>{
            console.log(`An error occured: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
});


app.get("/", (req, res) => {
    res.send("Hello YouTube!");
});

const port = process.env.PORT || 3000; 

app.listen(port, () => {
    console.log(`Video Processing Service listening at http://localhost:${port}`); 
})