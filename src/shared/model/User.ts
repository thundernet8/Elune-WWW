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
    public bio: string;
    public url: string;
    public joinTime: number;
    public status: EntityStatus;
    public roleId: Role;
}

// /me
export default class UserInfo extends BaseUserInfo {
    public unreadCount: number;
    public unreadNotifications: Pagination<Notification>;
    public favoriteTopicIds: number[];
    public followingTopicIds: number[];
    public followingUserIds: number[];
    public balance: number;
    public dailySigned: boolean;
}

// /u/username
export class PublicUserInfo extends BaseUserInfo {
    public lastSeen: number;
    public online: boolean;
    public postsCount: number;
    public topicsCount: number;
    public favoritesCount?: number;
}
