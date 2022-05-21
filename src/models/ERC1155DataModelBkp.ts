import mongoose from 'mongoose';
import {IERC1155DataModel} from "./ERC1155DataModel";

const Schema = mongoose.Schema;


const ERC1155DataModelBkpSchema = new Schema<IERC1155DataModel>({
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


export const ERC1155DataModelBkp = mongoose.model('ERC1155DataModelBkp', ERC1155DataModelBkpSchema);
