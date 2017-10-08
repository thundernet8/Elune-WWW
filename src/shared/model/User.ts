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
}
