import Channel from "./Channel";
import Tag from "./Tag";
import User from "./User";
import { EntityStatus } from "enum/EntityStatus";

export default class Topic {
    public channel: Channel;
    public tags: Tag[];
    public author: User;

    public id: number;
    public cid: number;
    public title: string;
    public authorName: string;
    public authorId: number;
    public isPinned: number;
    public isEssence: number;
    public viewsCount: number;
    public upvotesCount: number;
    public downvotesCount: number;
    public favoritesCount: number;
    public postsCount: number;
    public status: EntityStatus;
    public commentStatus: number;
    public createTime: number;
    public updateTime: number;
    public postTime: number;
    public poster: string;
    public posterId: number;
    public factor: number;
    public content: string;
    public contentHtml: string;
    public contentRaw: string;
}
