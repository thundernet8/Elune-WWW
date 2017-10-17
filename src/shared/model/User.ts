import { EntityStatus } from "enum/EntityStatus";

export default class UserInfo {
    public id: number;
    public username: string;
    public email: string;
    public nickname: string;
    public unreadCount: number;
    public joinTime: number;
    public avatar: string;
    public status: EntityStatus;
    public bio: string;
}

export class PublicUserInfo {
    public id: number;
    public username: string;
    public nickname: string;
    public joinTime: number;
    public avatar: string;
    public bio: string;
    public lastSeen: number;
}
