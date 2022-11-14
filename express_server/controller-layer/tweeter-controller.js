const express = require("express");
const Twitter = require('twit');
// const log = require("../middleware/logger");
const router = express.Router();


const client = new Twitter({
    consumer_key: '1c8Twy9x9u1zpRMqSpwhe0v8R',
    consumer_secret: 'X1j8rtFQzb1ZkfbGmZJl0ZP57OQPRykAbzQQg7lmOlQhtbyM86',
    access_token: '1560912822929850368-owQ0fXu7cSXq7Jss4cSppO399uX3UN',
    access_token_secret: 'gvAsOeKiPTQFXNTi5c39gX4R3wOTwQxTd55unrygWXW1v'
});

//GET Latest 10 tweets on user's timeline
// http://localhost:3030/api/tweeter/home_timeline
router.get('/home_timeline', (req, res) => {
    const params = { tweet_mode: 'extended', count: 10 };

    client
        .get(`statuses/home_timeline`, params)
        .then(timeline => {

            res.send(timeline);
        })
        .catch(error => {
            res.send(error);
        });

});

// GET ALL the tweets where the authenticating user has been mentioned
// http://localhost:3030/api/tweeter/mentions_timeline
router.get('/mentions_timeline', (req, res) => {
    const params = { tweet_mode: 'extended', count: 10 };

    client
        .get(`statuses/mentions_timeline`, params)
        .then(timeline => {

            res.send(timeline);
        })
        .catch(error => {
            res.send(error);
        });

});

//POST a tweet 

router.post('/post_tweet', (req, res) => {

    tweet = req.body;

    client
        .post(`statuses/update`, tweet)
        .then(tweeting => {
            console.log(tweeting);

            res.send(tweeting);
        })

        .catch(error => {
            res.send(error);
        });
});




module.exports = router;