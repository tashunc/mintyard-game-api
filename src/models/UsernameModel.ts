import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface IUsername {
    walletId: string
    username: string
}

const usernameSchema = new Schema<IUsername>({
        walletId: {type: String, required: true},
        username: {type: String, required: true}
    },
    {
        timestamps: true
    });
usernameSchema.index({walletId: 1, username: 1}, {unique: true})



const UsernameModel = mongoose.model('UsernameModel', usernameSchema);
export default UsernameModel;