const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const fetch=require('node-fetch');
app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static('public'))
app.set("view engine", "ejs");
require('dotenv').config();
app.get("/", (req, res) => {
    let locDate = { temp: "Temp", disc: "Discription", location: "Location", humidity: "Humidity ", feel: "Feel ", speed: "Speed" };
    res.render("index", { locDate: locDate,});
});

app.post("/", async (req, res) => {
    try {
        const location = await req.body.city;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APIKEY}&units=metric`;
        let response = await fetch(url);
        let data = await response.json();
        let locDate = {};
        locDate.temp = Math.floor(data.main.temp);
        locDate.disc = data.weather[0].description;
        locDate.feel = data.main.feels_like;
        locDate.humidity = data.main.humidity;
        locDate.speed = data.wind.speed;
        locDate.location = location;
        locDate.country=data.sys.country;
        // console.log(data);
        console.log(locDate);
        res.render("index", { locDate: locDate,});
    }
     catch (err) {
        console.log(err);
        let locDate = {};
        locDate.location = await req.body.city;
        res.render("errorfile",{locDate: locDate,});
        // res.status(400).json({ data: 'not found!' })
    }
});

app.listen(3000,()=>
{
    console.log("server started");
});
