export interface IMatch {
    isExact: boolean;
    params: { [key: string]: string };
    path: string;
    url: string;
}

export interface ILocation {
    hash: string;
    pathname: string;
    search: string;
}

export default interface IStoreArgument {
    match: IMatch;
    location: ILocation;
    cookies: string; // SSR use
}
