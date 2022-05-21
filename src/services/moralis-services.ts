
import Moralis from "moralis/node";
import {from, Observable, ObservedValueOf} from "rxjs";
import {defaultResponse, operations} from "moralis/types/generated/web3Api";

export const getNFTOwners = (options: any): Observable<ObservedValueOf<Promise<operations["getNFTOwners"]["responses"]["200"]["content"]["application/json"] & defaultResponse<operations["getNFTOwners"]["responses"]["200"]["content"]["application/json"]>>>> => {
    return  from(Moralis.Web3API.token.getNFTOwners(options));
}

export const MoralisAppId = 'kZT6T9OBTQdlMtF4strX1awYG8yMXTvbnjZqg5Rp';
export const ServerUrl = 'https://haoejff1r9fk.usemoralis.com:2053/server';
export const MasterKey = 'YSxEXtgjQrIiNyYQJFK7OrUwsAAut249L37dTUSS';

const initializeMoralis = () => {
    return from(Moralis.start({
        serverUrl: ServerUrl,
        appId: MoralisAppId,
        masterKey: MasterKey
    }));
};
export default initializeMoralis;
