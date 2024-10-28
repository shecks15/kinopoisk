const express = require("express");
const router = express.Router();
const genres = require("../genres/genres")
const country = require("../country/country")
const user = require("../auth/user");
const film = require("../Films/film");
const Rate = require("../Rates/Rates");

router.get("/", async(req, res) => {
    const options = {}
    const Genres = await genres.findOne({key : req.query.genre})
    if(Genres){
        options.genre = Genres._id
        res.locals.genre = req.query.genre
    }
    if(req.query.search && req.query.search.length > 0){
        options.$or = [
            {titleRus: new RegExp(req.query.search, "i")},
            {titleEng: new RegExp(req.query.search, "i")},
        ]
        res.locals.search = req.query.search;
    }
    let page = 0;
    const limit = 3;
    if(req.query.page && req.query.page > 0){
        page = req.query.page;
    };
    const totalFilms = await film.countDocuments(options);
    const allGenres = await genres.find(); 
    const films = await film.find(options).limit(limit).skip(page * limit).populate("country").populate("genre")
    const User = req.user ? await user.findById(req.user._id) : {};
    res.render("index", {genres: allGenres, user: User, films: films, pages: Math.ceil(totalFilms / limit)});
})

router.get("/login", (req, res) => {
    res.render("login", {user: req.user ? req.user : {}});
})

router.get("/register", (req, res) => {
    res.render("register", {user: req.user ? req.user : {}});
})

router.get("/profile/:id", async(req, res) => {
    const allGenres = await genres.find();
    const User = await user.findById(req.params.id).populate("toWatch")
    .populate({path: "toWatch", populate: {path: "country"}})
    .populate({path: "toWatch", populate: {path: "genre"}});
    if(User){
        res.render("profile", {user: User, genres: allGenres, loginUser: req.user});
    }else{
        res.redirect("/login");
    }
})

router.get("/admin/:id", async(req, res) => {
    const allGenres = await genres.find()
    const User = await user.findById(req.params.id);
    const films = await film.find().populate("country").populate("genre").populate("author");
    res.render("adminProfile", {genres: allGenres, loginUser: req.user ? req.user : {}, user: User, films: films});
})

router.get("/new", async(req, res) => {
    const allGenres = await genres.find() 
    const allCountries = await country.find()
    res.render("newFilm", {genres: allGenres, countries: allCountries, user: req.user ? req.user : {}});
})

router.get("/edit/:id", async(req, res) => {
    const allGenres = await genres.find()
    const allCountries = await country.find() 
    const films = await film.findById(req.params.id).populate("country").populate("genre").populate("author");
    res.render("editFilm", {genres: allGenres, countries: allCountries, user: req.user ? req.user : {}, films: films});
})

router.get("/detail/:id", async(req, res) => {
    const rates = await Rate.find({filmId: req.params.id}).populate("authorId");
    let averageRate = rates.reduce((sum, rate) => sum + rate.rate, 0) / rates.length;
    averageRate: averageRate / rates.length;
    averageRate = parseFloat(averageRate.toFixed(1));
    const films = await film.findById(req.params.id).populate("country").populate("genre").populate("author");
    res.render("detail", {user : req.user ? req.user : {}, films: films , rates: rates, averageRate});
})

module.exports = router;