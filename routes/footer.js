const express = require("express");
const router = express.Router();

router.get("/about",(req,res)=>{
    res.render("extra/about.ejs");
});

module.exports = router;