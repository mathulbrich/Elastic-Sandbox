import "mocha";
import { assert } from 'chai';
import { ESClientFactory } from '../../src/elastic/esClientFactory';

describe('test recovering Elastic Search client', () => {

    it('when has valid configuration', () => {

        const factory = new ESClientFactory();

        assert(factory.getClient());

    });

});