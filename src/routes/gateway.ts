import express from 'express'
import ScoreModel from '../models/ScoreModel'
import {ERROR_CONSTANTS, StatusModel} from '../models/StatusModel';
import UsernameModel from "../models/UsernameModel";
import initializeMoralis, {getNFTOwners} from "../services/moralis-services";
import Moralis from "moralis/node";
import mongoose from "mongoose";
import {ERC1155DataModel} from "../models/ERC1155DataModel";
import {
    addStatsAndGenerateResponse,
    getERC1155DataBackupModelPromiseReject,
    getERC1155DataModelPromiseWithReject,
    mapToERC1155DataBackupModel,
    mapToERC1155DataModel,
    saveListRecursively,
    saveListRecursivelyWithBkp
} from "../utils/general-utils";
import {ERC1155DataModelBkp} from "../models/ERC1155DataModelBkp";
import usernameModel from "../models/UsernameModel";

export const router = express.Router();
let nonDistributiveLockAcquired = false;

router.get('/', (req: any, res: any) => {
    res.send('API Backend is up and Running!!');
});

router.get('/wakeMoralisServer', (req: any, res: any) => {
    initializeMoralis().subscribe(() => res.send('Server started!!'));
});

router.get('/getNFTOwnersFromServer', (req: any, res: any) => {
    const buckData = {
        address: req.query.address,
        chain: req.query.chain
    };
    const subscription = getNFTOwners(buckData).subscribe(data => {
        if (data) {
            subscription.unsubscribe();
            res.send(data);
        }
    });
});

router.get('/getNFTOwnersFromDB', (req: any, res: any) => {
    ERC1155DataModel.find((err:any, data:any) => {
        if (err) {
            res.status(500).json(new StatusModel(-1, 'Seems the details already exists', err.toString()));
        } else {
            res.send(data);
        }
    })
});

router.get('/persistInDB', (req: any, res: any) => {
    const buckData = {
        address: req.query.address,
        chain: req.query.chain
    };
    if (!buckData.chain || !buckData.address) {
        res.status(500).json(new StatusModel(-1, 'Invalid Data', ''));
    }
    if (!nonDistributiveLockAcquired) {
        nonDistributiveLockAcquired = true;
        const subscription = getNFTOwners(buckData).subscribe(async (data: any) => {
            if (data && data.result && data.result.length > 0) {
                let isError = false;
                let savedCount = 0;
                let backedUpCount = 0;
                let backedUpErrorCount = 0;
                subscription.unsubscribe()
                for (const item of data.result) {
                    getERC1155DataModelPromiseWithReject(item).then((status) =>{
                        if (status===ERROR_CONSTANTS.SUCCESS) {
                            savedCount++
                            addStatsAndGenerateResponse(isError,res,savedCount,backedUpCount,backedUpErrorCount,data,nonDistributiveLockAcquired);
                        }
                    }).catch((err) => {
                        getERC1155DataBackupModelPromiseReject(item).then(success => {
                            if (success===ERROR_CONSTANTS.SUCCESS) {
                                backedUpCount++
                                addStatsAndGenerateResponse(isError,res,savedCount,backedUpCount,backedUpErrorCount,data,nonDistributiveLockAcquired);
                            }
                        }).catch(err => console.error(item + '\n' + err));
                        backedUpErrorCount++;
                        addStatsAndGenerateResponse(isError,res,savedCount,backedUpCount,backedUpErrorCount,data,nonDistributiveLockAcquired);
                    })
                }
            }
        });
    } else {
        res.status(500).json(new StatusModel(-1, 'Server is busy processing', ''));
    }
});

router.get('/removePersistLock', (req: any, res:any) => {
    nonDistributiveLockAcquired = false;
});

router.get('/deleteAll', (req: any, res: any) => {
   const buckData = {
        address: req.query.address,
        chain: req.query.chain
    };
    if (!buckData.address || !buckData.address) {
        res.status(500).json(new StatusModel(-1, 'Invalid Data', ''));
    } else {
        ERC1155DataModel.find((err:any, data:any) => {
            if (!err) {
                const savingSchemaBkp = new ERC1155DataModelBkp({
                    token_address: data.token_address,
                    token_id: data.token_id,
                    owner_of: data.owner_of,
                    amount: data.amount,
                    name: data.name,
                    token_uri: data.token_uri,
                    last_token_uri_sync: data.last_token_uri_sync,
                    last_metadata_sync: data.last_metadata_sync
                });
                savingSchemaBkp.save();
                data.remove();
            } else {
                res.send(err)
            }
        });
    }
});

router.get('/getNFTIdsForUser', (req: any, res:any) => {

    const buckData = {
        owner_of: req.query.walletId,
        token_address: req.query.contractId
    };
    if (!buckData.owner_of || !buckData.token_address) {
        res.status(500).json(new StatusModel(-1, 'Invalid Data', ''));
    } else {
        ERC1155DataModel.find(buckData,(err:any, data:any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data)
            }
        })
    }
});



router.post('/addUsername', (request: any, response: any) => {
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

router.get('/getUsernames', (request: any, response: any) => {
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

router.get('/hasUsername', (request: any, response: any) => {
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
router.post('/addScore', function (request: any, response: any) {
    console.log('Hit for /addScore')
    console.log(request);
    const score = new ScoreModel({
        username: request.body.username,
        walletId: request.body.walletId,
        contractId: request.body.contractId,
        nftId: request.body.nftId,
        contestId: request.body.contestId,
        turns: request.body.turns,
        time: request.body.time,

    });
    if (!score || (!score.contestId || !score.nftId || !score.walletId || !score.contractId || !score.username)) {
        response.status(500).json(new StatusModel(-1, 'Invalid Data', ''));
        return;
    }
    UsernameModel.find({ walletId: request.body.walletId})
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
router.get('/getScores', (request: any, response: any) => {
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
router.get('/getScoresForContestId', (request: any, response: any) => {
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
router.get('/getAllNftId', (request: any, response: any) => {
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

router.put('/updateScores', (request: any, response: any) => {
    console.log('Hit for /updateScores')
    if (!request.body || (!request.body.contestId || !request.body.nftId || !request.body.walletId || !request.body.contractId
        || !(request.body.turns && request.body.turns > 0) || !(request.body.time && request.body.time > 0) || !request.body.username)) {
        response.status(500).json(new StatusModel(-1, 'Seems you have played using this NFT before', ''));
        return;
    }
    console.log(request);
    ScoreModel.updateOne({
        username: request.body.username,
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
