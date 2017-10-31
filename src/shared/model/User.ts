import { EntityStatus } from "enum/EntityStatus";
import Role from "enum/Role";
import Notification from "model/Notification";
import Pagination from "model/Pagination";

export class BaseUserInfo {
    public id: number;
    public username: string;
    public email: string;
    public nickname: string;
    public avatar: string;
}

// /me
export default class UserInfo extends BaseUserInfo {
    public roleId: Role;
    public unreadCount: number;
    public unreadNotifications: Pagination<Notification>;
    public joinTime: number;
    public status: EntityStatus;
    public bio: string;
    public url: string;
    public favoriteTopicIds: number[];
    public followTopicIds: number[];
    public followUserIds: number[];
    public balance: number;
    public dailySigned: boolean;
}

// /u/username
export class PublicUserInfo extends BaseUserInfo {
    public roleId: Role;
    public joinTime: number;
    public bio: string;
    public url: string;
    public lastSeen: number;
    public postsCount: number;
    public topicsCount: number;
    public favoritesCount?: number;
}
