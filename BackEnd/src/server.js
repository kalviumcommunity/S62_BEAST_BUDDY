const express = require('express')
const app = express()

if(process.env.NODE_ENV !== "PRODUCTION"){
    require('dotenv').config({
        path : './config/.env'
    });
}

app.get('/ping', (req, res) => {
    res.send("welcome to backend");
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})