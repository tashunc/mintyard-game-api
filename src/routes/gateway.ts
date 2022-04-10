import express from 'express'
import Score from '../models/Score'
import {throws} from "assert";

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
        contestId: request.body.contestId,
        turns: request.body.turns,
        time: request.body.time,

    });
    if (!score || (!score.contestId || !score.nftId || !score.walletId)) {
        response.send("Please Enter Valid Data");
    }
    score.save( (err: any)=> {
        if (err) {
            response.send(err);
        } else {
            response.send("Data Saved Successfully!");
        }
    });
});
// update
// wallet -> nft -> attempts
router.get('/getScores', (request, response) =>{
    console.log('Hit for /getScores')
    Score.find( (err, scores) => {
        if (!err) {
            response.send(scores);
        } else {
            response.send(err)
        }
    });
});

router.post('/updateScores', (request, response) => {
    const score = new Score({
        // _id: request.body.walletId + '_' + request.body.nftId,
        walletId: request.body.walletId,
        nftId: request.body.nftId,
        contestId: request.body.contestId,
        turns: request.body.turns,
        time: request.body.time,

    });

    Score.updateOne({nftId: request.body.nftId, contestId: request.body.contestId}, {
        $set: {
            walletId: request.body.walletId,
            turns: request.body.turns,
            time: request.body.time,
        }
    }).then((result:any) => {
        if (result) {
            console.log(result);
        }
        response.status(200).json({ message: "Update successful! " + result });
    });
});


// module.exports = router;
