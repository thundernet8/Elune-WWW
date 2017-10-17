import User from "./User";
import { PostType } from "enum/PostType";
import { EntityStatus } from "enum/EntityStatus";

export default class Post {
    public id: number;
    public tid: number;
    public pid: number;
    public author: User;
    public authorName: string;
    public authorId: number;
    public topicAuthorName: string;
    public topicAuthorId: string;
    public ip: string;
    public ua: string;
    public upvotesCount: number;
    public downvotesCount: number;
    public type: PostType;
    public status: EntityStatus;
    public createTime: number;
    public content: string;
    public contentHtml: string;
    public contentRaw: string;
}
