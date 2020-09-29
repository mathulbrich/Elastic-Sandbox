import { Product } from './model/product';
import { ESClientFactory } from './elastic/esClientFactory';
import { ApiResponse } from '@elastic/elasticsearch';

// load ES Client factory
const clientFactory = new ESClientFactory();
const client = clientFactory.getClient();

// create the product model
const prod = new Product("XZARGMAN1045BR");
prod.name = "Galaxy Note20";
prod.description = "First to unite phone and pen, Note brings a whole world of news to your pocket. Faced with the new normal, life calls for a new device.";
prod.price = 1000.99;
prod.stock = 13;

// make the indexation of product
prod.idx(client).then(indexResponse => {

    if (indexResponse.statusCode === 200 || indexResponse.statusCode === 201) {
        console.log("Product " + indexResponse.body._id + " was indexed!");

        const loadedProd = new Product("XZARGMAN1045BR");
        loadedProd.getIdx(client)
            .then(() => searchSuccessResponse(loadedProd))
            .catch(r => searchErrorResponse(r, loadedProd));
    }

});

function searchSuccessResponse(loadedProd: Product) {
    console.log("Product was loaded!");
    console.log(loadedProd);
}

function searchErrorResponse(response: ApiResponse, loadedProd: Product) {
    if (response.statusCode === 404) {
        console.log("Product " + loadedProd.uniqId + " was not found in indice!");
    } else {
        console.log("Unexpected response with status " + response.statusCode);
    }
}