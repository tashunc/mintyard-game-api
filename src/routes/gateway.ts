import express from 'express'
import Score from '../models/Score'

export const router = express.Router();


router.get('/', (req, res) => {
    console.log('Hit for /')
    res.send('index');
});


router.post('/addScore', function (request, response) {
    console.log('Hit for /addScore')
    const score = new Score({
        // _id: request.body.walletId + '_' + request.body.nftId,
        walletId: request.body.walletId,
        nftId: request.body.nftId,
        turns: request.body.turns,
        time: request.body.time,

    });
    score.save( (err: any)=> {
        if (err) {
            throw err;
        } else {
            response.send("Data Saved Successfully!");
        }
    });
});

router.get('/getScores', (request, response) =>{
    console.log('Hit for /getScores')
    Score.find( (err, InventoryItems) => {
        if (!err) {
            response.send(InventoryItems);
        } else {
            response.send(err)
        }
    });
});

router.get('/getScoreById', (request, response) =>{
    Score.find( (err, InventoryItems) => {
        if (!err) {
            response.send(InventoryItems);
        } else {
            response.send(err)
        }
    });
});


// module.exports = router;
