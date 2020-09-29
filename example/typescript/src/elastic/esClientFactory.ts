
import { Client } from '@elastic/elasticsearch';

// load properties
//const props = PropertiesReader('../env/dev.properties');

/**
 * Factory for ElasticSearch client instances
 */
export class ESClientFactory {

    public getClient(): Client {

        return new Client({
            node: "http://localhost:9200"
        });

    }

}