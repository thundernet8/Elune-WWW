export default class Pagination<T> {
    public total: number;
    public page: number;
    public pageSize: number;
    public items: T[];
}
