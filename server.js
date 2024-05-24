const express = require('express');
const cors = require('cors');
const app = express()
const port = 3000;

app.use(cors());

app.use(express.json());

app.post('/data',(req,res)=>{
    const recievedData = req.body;

    const processedData = {
        original: recievedData,
        processed: `${recievedData.message} - Processed by server`
    };

    res.json(processedData)

});

app.listen(port, ()=>{
    console.log(`server runninf at http://localhost:${port}/`);
});