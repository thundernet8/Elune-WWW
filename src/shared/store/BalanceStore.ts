import { observable, action, computed } from "mobx";
import IStoreArgument from "interface/IStoreArgument";
import {
    FetchBalanceDetail,
    FetchBalanceRank,
    FetchBalanceCostRank
} from "api/Balance";
import Userlog from "model/Userlog";
import BalanceRank from "model/BalanceRank";
import { SortOrder } from "enum/Sort";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../env";

declare var window;

/**
 * 积分中心Store(单例)
 */
export default class BalanceStore extends AbstractStore {
    private static instance: BalanceStore;

    private type: string;

    public static get Instance() {
        return BalanceStore.getInstance({} as any);
    }

    public static getInstance(
        arg: IStoreArgument = {} as IStoreArgument,
        type: string = "detail"
    ) {
        if (!BalanceStore.instance || BalanceStore.instance.type !== type) {
            BalanceStore.instance = new BalanceStore(arg, type);
        }
        return BalanceStore.instance;
    }

    public static rebuild(arg: IStoreArgument = {} as IStoreArgument) {
        const instance = BalanceStore.getInstance(arg);
        instance.reset(arg);
        instance.loading = false;
        instance.details = [];
        instance.ranks = [];
        instance.costranks = [];
        instance.page = Number(arg.match.params.page) || 1;
        instance.total = -1;
        instance.fetchData();
        return instance;
    }

    private constructor(arg: IStoreArgument, type) {
        super(arg);

        this.type = type;
        this.page = Number(arg.match.params.page) || 1;
        if (!IS_NODE) {
            // 浏览器端从全局InitialState中初始化Store
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.balanceStore) {
                this.fromJSON(initialState.balanceStore);
            } else {
                this.fetchData();
            }
        }
    }

    public destroy() {
        BalanceStore.instance = null as any;
    }

    @observable loading: boolean = false;

    @observable page: number = 1;
    @observable pageSize: number = 20;
    @observable total = -1;

    @computed
    get hasMore() {
        const { page, pageSize, total } = this;
        return total === -1 || page * pageSize < total;
    }

    @observable order: SortOrder = SortOrder.DESC;

    /**
     * 积分详细记录列表
     */
    @observable details: Userlog[] = [];

    @action
    getBalanceDetails = () => {
        const { page, pageSize, details, order, loading } = this;
        if (loading) {
            return Promise.reject(false);
        }

        const params: any = {
            page,
            pageSize,
            order
        };

        this.loading = true;
        return FetchBalanceDetail(params)
            .then(resp => {
                this.details = details.concat(resp.items);
                this.total = resp.total;
                return resp;
            })
            .finally(() => {
                this.loading = false;
            });
    };

    @action
    getNextPageDetails = () => {
        const { page, pageSize, total } = this;
        if ((page - 1) * pageSize > total) {
            return;
        }
        this.page = page + 1;
        this.getBalanceDetails();
    };

    @action
    refreshDetails = () => {
        this.details = [];
        this.page = 1;
        this.total = 0;
        this.getBalanceDetails();
    };

    /**
     * 排行记录列表
     */
    @observable ranks: BalanceRank[] = [];

    @action
    getBalanceRanks = () => {
        const { page, pageSize, ranks, order, loading } = this;
        if (loading) {
            return Promise.reject(false);
        }

        const params: any = {
            page,
            pageSize,
            order
        };

        this.loading = true;
        return FetchBalanceRank(params)
            .then(resp => {
                this.ranks = ranks.concat(resp.items);
                this.total = resp.total;
                return resp;
            })
            .finally(() => {
                this.loading = false;
            });
    };

    @action
    getNextPageRanks = () => {
        const { page, pageSize, total } = this;
        if ((page - 1) * pageSize > total) {
            return;
        }
        this.page = page + 1;
        this.getBalanceRanks();
    };

    @action
    refreshRanks = () => {
        this.ranks = [];
        this.page = 1;
        this.total = 0;
        this.getBalanceRanks();
    };

    /**
     * 消费排行记录列表
     */
    @observable costranks: BalanceRank[] = [];

    @action
    getBalanceCostRanks = () => {
        const { page, pageSize, costranks, order, loading } = this;
        if (loading) {
            return Promise.reject(false);
        }

        const params: any = {
            page,
            pageSize,
            order
        };

        this.loading = true;
        return FetchBalanceCostRank(params)
            .then(resp => {
                this.costranks = costranks.concat(resp.items);
                this.total = resp.total;
                return resp;
            })
            .finally(() => {
                this.loading = false;
            });
    };

    @action
    getNextPageCostRanks = () => {
        const { page, pageSize, total } = this;
        if ((page - 1) * pageSize > total) {
            return;
        }
        this.page = page + 1;
        this.getBalanceCostRanks();
    };

    @action
    refreshCostRanks = () => {
        this.costranks = [];
        this.page = 1;
        this.total = 0;
        this.getBalanceCostRanks();
    };

    /**
     * SSR数据初始化(必须返回promise)
     */
    fetchData() {
        const { type } = this;
        const promises: Promise<any>[] = [];
        if (type === "rank") {
            promises.push(this.getBalanceRanks());
        } else if (type === "costrank") {
            promises.push(this.getBalanceCostRanks());
        } else {
            promises.push(this.getBalanceDetails());
        }
        return Promise.all(promises);
    }

    public toJSON() {
        const obj = super.toJSON();
        const { details, ranks, costranks, total } = this;
        return Object.assign(obj, {
            details,
            ranks,
            costranks,
            total
        });
    }

    @action
    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { details, ranks, costranks, total } = json;
        if (typeof details !== "undefined") {
            this.details = details;
        }
        if (typeof ranks !== "undefined") {
            this.ranks = ranks;
        }
        if (typeof costranks !== "undefined") {
            this.costranks = costranks;
        }
        if (typeof total !== "undefined") {
            this.total = Number(total);
        }
        return this;
    }
}
