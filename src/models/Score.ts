import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface IScoreSchema {
    walletId: string
    nftId: string
    turns: number,
    time: string
}

const scoreSchema = new Schema<IScoreSchema>({
        walletId: {type: String, required: true},
        nftId: {type: String, required: true},
        turns: {type: Number, required: true},
        time: {type: String, required: true},
    },
    {
        timestamps: true
    });



const Score = mongoose.model('Score', scoreSchema);
export default Score;