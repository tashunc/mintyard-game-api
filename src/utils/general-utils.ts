import {ERC1155DataModel} from "../models/ERC1155DataModel";
import {ERROR_CONSTANTS, StatusModel} from "../models/StatusModel";
import {ERC1155DataModelBkp} from "../models/ERC1155DataModelBkp";

export const saveListRecursively = <T>(arr: Array<any>, mappingFunction: () => any) => {
    if (arr && arr.length > 0) {
        mapToERC1155DataModel(arr[0]).save();
        arr.pop()
        saveListRecursively(arr, mappingFunction)
    }
}

export const saveListRecursivelyWithBkp = async <T>(arr: Array<any>, successCount: number, failureCount: number) => {
    if (arr && arr.length > 0) {
        await mapToERC1155DataModel(arr[0]).save(async (err: any) => {
            if (err) {
                await mapToERC1155DataBackupModel(arr[0]).save();
                failureCount++;
            } else {
                successCount++;
            }
        });
        arr.pop()
        await saveListRecursivelyWithBkp(arr, successCount, failureCount);
    }
}
export const mapToERC1155DataModel = (item: any) => {
    return new ERC1155DataModel({
        token_address: item.token_address,
        token_id: item.token_id,
        owner_of: item.owner_of,
        amount: item.amount,
        name: item.name,
        token_uri: item.token_uri,
        last_token_uri_sync: item.last_token_uri_sync,
        last_metadata_sync: item.last_metadata_sync
    });
}

export const getERC1155DataModelPromise = (item: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const savingModel = mapToERC1155DataModel(item);
        savingModel.save( (err) => {
            if (err) {
                resolve(ERROR_CONSTANTS.ERROR)
            }else {
                resolve(ERROR_CONSTANTS.SUCCESS)
            }
        })

    })
}

export const getERC1155DataModelPromiseWithReject = (item: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const savingModel = mapToERC1155DataModel(item);
        savingModel.save( (err) => {
            if (err) {
                reject(ERROR_CONSTANTS.ERROR)
                console.error(err);
            }else {
                resolve(ERROR_CONSTANTS.SUCCESS)
            }
        })

    })
}

export const mapToERC1155DataBackupModel = (item: any) => {
    return new ERC1155DataModelBkp({
        token_address: item.token_address,
        token_id: item.token_id,
        owner_of: item.owner_of,
        amount: item.amount,
        name: item.name,
        token_uri: item.token_uri,
        last_token_uri_sync: item.last_token_uri_sync,
        last_metadata_sync: item.last_metadata_sync
    });
}

export const getERC1155DataBackupModelPromise = (item: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const savingModel = mapToERC1155DataBackupModel(item);
        savingModel.save( (err: any) => {
            if (err) {
                resolve(ERROR_CONSTANTS.ERROR)
                console.error(err);
            }else {
                resolve(ERROR_CONSTANTS.SUCCESS)
            }
        })

    })
}

export const getERC1155DataBackupModelPromiseReject = (item: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const savingModel = mapToERC1155DataBackupModel(item);
        savingModel.save( (err: any) => {
            if (err) {
                reject(ERROR_CONSTANTS.ERROR)
                console.error(err);
            }else {
                resolve(ERROR_CONSTANTS.SUCCESS)
            }
        })

    })
}

export const addStatsAndGenerateResponse = (isError: boolean, res: any, savedCount: number, backedUpCount: number, backedUpErrorCount: number, data: any, nonDistributiveLockAcquired: boolean) => {
    if (isError) {
        nonDistributiveLockAcquired=false;
        res.status(500).json(new StatusModel(-1, 'Seems the details already exists or saving error, backing up, ', 'backedUpCount' + backedUpCount + ', ' + 'savedCount' + savedCount));
    } else if(savedCount + backedUpCount + backedUpErrorCount === data.result.length) {
        nonDistributiveLockAcquired=false
        res.status(200).json(new StatusModel(1, 'Updated successful! , ', 'backedUpCount' + backedUpCount + ', ' + 'savedCount' + savedCount));
    }
}