import express from 'express'
import ScoreModel from '../models/ScoreModel'
import {StatusModel} from '../models/StatusModel';
import UsernameModel from "../models/UsernameModel";

export const router = express.Router();


router.get('/', (req, res) => {
    res.send('API Backend is up and Running!!');
});

router.post('/addUsername', (request, response) => {
    const username = new UsernameModel({
        username: request.body.username,
        walletId: request.body.walletId
    });
    username.save((err: any) => {
        if (err) {
            response.status(500).json(new StatusModel(-1, 'Seems the details already exists', err.toString()));
        } else {
            response.status(200).json(new StatusModel(1, 'Updated successful!', ''));
        }
    });
});

router.get('/getUsernames', (request, response) => {
    console.log('Hit for /getUsername')
    console.log(request);
    UsernameModel.find((err, usernames) => {
        if (!err) {
            response.send(usernames);
        } else {
            response.send(err)
        }
    });
});

router.get('/hasUsername', (request, response) => {
    console.log('Hit for /getUsername')
    console.log(request.query.walletId);
    UsernameModel.find({
        walletId: request.query.walletId
    }, (err: any, users: any[]) => {
        if (!err) {
            response.send(users && users[0] ? users[0] : null);
        } else {
            response.send(err)
        }
    });
});
router.post('/addScore', function (request, response) {
    console.log('Hit for /addScore')
    console.log(request);
    const score = new ScoreModel({
        walletId: request.body.walletId,
        contractId: request.body.contractId,
        nftId: request.body.nftId,
        contestId: request.body.contestId,
        turns: request.body.turns,
        time: request.body.time,

    });
    if (!score || (!score.contestId || !score.nftId || !score.walletId || !score.contractId)) {
        response.status(500).json(new StatusModel(-1, 'Invalid Data', ''));
        return;
    }
    score.save((err: any) => {
        if (err) {
            response.status(500).json(new StatusModel(-1, 'Seems you have played using this NFT before', err.toString()));
        } else {
            response.status(200).json(new StatusModel(1, 'Updated successful!', ''));
        }
    });
});
/**
 * get scores for all contests
 */
router.get('/getScores', (request, response) => {
    console.log('Hit for /getScores')
    console.log(request);
    ScoreModel.find((err, scores) => {
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
    console.log(request.query);
    if (!request|| !request.query || !request.query.contractId || !request.query.contestId) {
        response.status(500).json(new StatusModel(-1, 'Invalid Data', ''));
        return;
    }
    ScoreModel.find({
        contractId: request.query.contractId,
        contestId: request.query.contestId
    }, (err: any, scores: any[]) => {
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
    console.log(request.query);
    if (!request|| !request.query || !request.query.contractId || !request.query.contestId) {
        response.status(500).json(new StatusModel(-1, 'Invalid Data', ''));
        return;
    }
    ScoreModel.find({
        contractId: request.query.contractId,
        contestId: request.query.contestId
    }, (err: any, scores: any[]) => {
        console.log(err)
        console.log(scores)
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
    if (!request.body || (!request.body.contestId || !request.body.nftId || !request.body.walletId || !request.body.contractId
        || !(request.body.turns && request.body.turns > 0) || !(request.body.time && request.body.time > 0))) {
        response.status(500).json(new StatusModel(-1, 'Seems you have played using this NFT before', ''));
        return;
    }
    console.log(request);
    ScoreModel.updateOne({
        walletId: request.body.walletId,
        contractId: request.body.contractId,
        nftId: request.body.nftId,
        contestId: request.body.contestId,
        turns: 0,
        time: 0,
    }, {
        $set: {
            turns: request.body.turns,
            time: request.body.time,
        }
    }).then((result: any) => {
        if (result) {
            console.log(result);
        }
        response.status(200).json(new StatusModel(1, 'Updated successful!',  result.toString()));
    }).catch((error: any) => {
        response.status(500).json(new StatusModel(-1, 'Update unSuccessful please contact support with a Screen Shot', error.toString()));

    });
});


// module.exports = router;
