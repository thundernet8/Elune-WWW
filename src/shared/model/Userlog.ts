import UserlogType from "enum/UserlogType";

export default class Userlog {
    public id: number;
    public uid: number;
    public type: UserlogType;
    public beforeStatus: string;
    public afterStatus: string;
    public link: string;
    public ip: string;
    public ua: string;
    public createTime: number;
}
