import { EntityStatus } from "enum/EntityStatus";

export default class Channel {
    public id: number;
    public pid: number;
    public title: string;
    public description: string;
    public slug: string;
    public link: string;
    public coverImg: string;
    public mainColor: number;
    public color: string;
    public topicsCount: number;
    public status: EntityStatus;
    public createTime: number;
    public updateTime: number;
    public hosts: string;
}
