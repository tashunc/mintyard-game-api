import express from 'express'
import Score from '../models/Score'

export const router = express.Router();


router.get('/', (req, res) => {
    res.send('API Backend is up and Running!!');
});


router.post('/addScore', function (request, response) {
    console.log('Hit for /addScore')
    console.log(request);
    const score = new Score({
        walletId: request.body.walletId,
        contractId: request.body.contractId,
        nftId: request.body.nftId,
        contestId: request.body.contestId,
        turns: request.body.turns,
        time: request.body.time,

    });
    if (!score || (!score.contestId || !score.nftId || !score.walletId)) {
        response.send("Please Enter Valid Data");
    }
    score.save((err: any) => {
        if (err) {
            response.send(err);
        } else {
            response.send("Data Saved Successfully!");
        }
    });
});
/**
 * get scores for all contests
 */
router.get('/getScores', (request, response) => {
    console.log('Hit for /getScores')
    console.log(request);
    Score.find((err, scores) => {
        if (!err) {
            response.send(scores);
        } else {
            response.send(err)
        }
    });
});
/**
 * get scores for a selected contest and contract ID
 */
router.get('/getScoresForContestId', (request, response) => {
    console.log('Hit for /getScoresForContestId')
    console.log(request);
    Score.find({
        contractId: request.body.contractId,
        contestId: request.body.contestId
    }, (err, scores) => {
        if (!err) {
            response.send(scores);
        } else {
            response.send(err)
        }
    });
});
/**
 * get scores for all contests and contract ID
 */
router.get('/getAllNftId', (request, response) => {
    console.log('Hit for /getAllNftId')
    console.log(request);
    Score.find({
        contractId: request.body.contractId,
        contestId: request.body.contestId
    }, (err, scores) => {
        const nftIds: any[] = [];
        scores.forEach(score => {
            nftIds.push(score.nftId)
        })
        if (!err) {
            response.send(nftIds);
        } else {
            response.send(err)
        }
    });
});

router.put('/updateScores', (request, response) => {
    console.log('Hit for /updateScores')
    console.log(request);
    Score.updateOne({
        walletId: request.body.walletId,
        contractId: request.body.contractId,
        nftId: request.body.nftId,
        contestId: request.body.contestId
    }, {
        $set: {
            turns: request.body.turns,
            time: request.body.time,
        }
    }).then((result: any) => {
        if (result) {
            console.log(result);
        }
        response.status(200).json({message: "Update successful! " + result});
    }).catch((error: any) => {
        response.status(500).json({message: "Update unSuccessful please contact support with a Screen Shot : " + error});

    });
});


// module.exports = router;
