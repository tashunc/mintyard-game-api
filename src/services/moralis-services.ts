import Moralis from "moralis/node";
import {from, Observable, ObservedValueOf, Subject} from "rxjs";
import {defaultResponse, operations} from "moralis/types/generated/web3Api";

export const getNFTOwners = (options: any): Observable<ObservedValueOf<Promise<operations["getNFTOwners"]["responses"]["200"]["content"]["application/json"] & defaultResponse<operations["getNFTOwners"]["responses"]["200"]["content"]["application/json"]>>>> => {
    return from(Moralis.Web3API.token.getNFTOwners(options));
}


const initializeMoralis = () => {
    const subject = new Subject();
    let returningObservable;
    try {
        // returningObservable = from(Moralis.start({
        //     serverUrl: (process.env.MORALIS_SERVER_URL) ? (process.env.MORALIS_SERVER_URL) : 'https://ujwkj69jqehg.usemoralis.com:2053/server',
        //     appId: process.env.MORALIS_APP_ID ? process.env.MORALIS_APP_ID : 'b7cTHjuYvIPoMjIdN8bBaUOvhKCr2ARGTek8UWCO',
        //     masterKey: (process.env.MASTER_KEY) ? process.env.MASTER_KEY : 'XnXh90R9K4do0yFp4mXLv5lE3PKM7yHon1x7Dg4K'
        // }));
    } catch (e) {
        console.error('Exception ', e);
    }
    returningObservable = subject.asObservable()
    return returningObservable;
};
export default initializeMoralis;
