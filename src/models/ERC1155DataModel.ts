import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IERC1155DataModel {
    token_address: String
    token_id: String
    owner_of: String,
    amount: String
    name: String,
    token_uri: String,
    last_token_uri_sync: String,
    last_metadata_sync: String
}

const ERC1155DataModelSchema = new Schema<IERC1155DataModel>({
        token_address: {type: String, required: true},
        token_id: {type: String},
        owner_of: {type: String, required: true},
        amount: {type: String, required: true},
        name: {type: String, required: true},
        token_uri: {type: String, required: true},
        last_token_uri_sync: {type: String, required: true},
        last_metadata_sync: {type: String, required: true},
    },
    {
        timestamps: true
    });
ERC1155DataModelSchema.index({
    token_address: 1,
    token_id: 1,
    owner_of: 1,
    amount: 1,
    name: 1,
    token_uri: 1,
    last_token_uri_sync: 1,
    last_metadata_sync: 1
}, {unique: true})



export const ERC1155DataModel = mongoose.model('ERC1155DataModel', ERC1155DataModelSchema);
