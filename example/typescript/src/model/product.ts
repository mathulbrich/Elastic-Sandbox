import { ApiResponse, Client } from '@elastic/elasticsearch';

/**
 * 
 * Product model class
 * 
 * @author Mathaus.Ulbrich
 */
export class Product {

    private static readonly INDEX = "products";
    private static readonly TYPE = "_doc";

    private readonly _uniqId: string;
    private _name: string;
    private _description: string;
    private _stock: number;
    private _price: number;

    constructor(uniqId: string) {
        this._uniqId = uniqId;
    }

    get uniqId(): string {
        return this._uniqId;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }

    get stock(): number {
        return this._stock;
    }

    set stock(stock: number) {
        this._stock = stock;
    }

    get price(): number {
        return this._price;
    }

    set price(price: number) {
        this._price = price;
    }

    /**
     * Make the indexation of the product instance.
     * @param client Client to connect to ElasticSearch instance
     * @throws Error if the property uniqId is undefined
     * @returns Promise object of ElasticSearch API response
     */
    public idx(client: Client): Promise<ApiResponse> {
        
        if (this.uniqId === undefined || this.uniqId === null) {
            throw new Error("Invalid product state... To index the product to indice an uniqId must be defined!");
        }

        return client.index({
            index: Product.INDEX,
            type: Product.TYPE,
            id: this.uniqId,
            body: {
                name: this._name,
                description: this._description,
                price: this._price,
                stock: this._stock
            }
        });

    }

    /**
     * 
     * @param client 
     */
    public async getIdx(client: Client): Promise<void> {

        return await client.get({
            index: Product.INDEX,
            type: Product.TYPE,
            id: this.uniqId
        }).then((r) => {
            this._name = r.body._source.name;
            this._description = r.body._source.description;
            this._price = r.body._source.price;
            this._stock = r.body._source.stock;
        });

    }

    /**
     * Make the deletion of the product register on indice
     * @param client Client to connect to ElasticSearch instance
     * @throws Error if the property uniqId is undefined
     * @returns Promise object of ElasticSearch API response
     */
    public delIdx(client: Client): Promise<ApiResponse> {

        if (this.uniqId === undefined || this.uniqId === null) {
            throw new Error("Invalid product state... To remove the product from indice an uniqId must be defined!");
        }

        return client.delete({
            index: Product.INDEX,
            type: Product.TYPE,
            id: this.uniqId
        });

    }

}