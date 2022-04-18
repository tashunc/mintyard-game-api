import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface IScoreSchema {
    walletId: string
    nftId: string,
    contestId: string
    turns: number,
    time: number
}


const scoreSchema = new Schema<IScoreSchema>({
        walletId: {type: String, required: true},
        contractId: {type: String, required: true},
        nftId: {type: String, required: true},
        contestId: {type: String, required: true},
        turns: {type: Number, required: true},
        time: {type: Number, required: true},
    },
    {
        timestamps: true
    });
scoreSchema.index({ nftId: 1, contestId: 1 }, { unique: true })


const Score = mongoose.model('Score', scoreSchema);
export default Score;