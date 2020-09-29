
import "mocha";
import { Product } from '../../src/model/product';
import { assert, expect } from 'chai';
import { Client } from '@elastic/elasticsearch';
import ClientMock from '@elastic/elasticsearch-mock';

const mock = new ClientMock();
const client = new Client({
    node: 'http://localhost:9200',
    Connection: mock.getConnection()
});

mock.add({
  method: 'POST',
  path: '/products/_doc/AXYZ'
}, () => {
    return {
      _index : "products",
      _type : "_doc",
      _id : "AXYZ",
      result : "updated"
    }        
});

mock.add({
  method: 'DELETE',
  path: '/products/_doc/ABCDEF'
}, () => {
    return {
      _index : "products",
      _type : "_doc",
      _id : "ABCDEF",
      result : "deleted"
    }        
});

mock.add({
  method: 'GET',
  path: '/products/_doc/XYZ'
}, () => {
    return {
      _source : {
        name : "test",
        description : "test of description",
        price : 79.99,
        stock : 1
      }
    }            
});

describe('test product indexation operations', () => {

    it('when expected indexation occurs', () => {
      
      const prod = new Product('AXYZ');
      prod.name = 'test';
      prod.description = 'some testing...';
      prod.price = 10;
      prod.stock = 5;

      prod.idx(client).then(r => {
        
        expect(r.statusCode).equal(200);
        expect(r.body._index).equal("products");
        expect(r.body._type).equal("_doc");
        expect(r.body._id).equal("AXYZ");
        expect(r.body.result).equal("updated");

      }).catch((err) => assert.fail(err));

    });

    it('when expected index deletion occurs', () => {
      
      const prod = new Product('ABCDEF');

      prod.delIdx(client).then(r => {

        expect(r.statusCode).equal(200);
        expect(r.body._index).equal("products");
        expect(r.body._type).equal("_doc");
        expect(r.body._id).equal("ABCDEF");
        expect(r.body.result).equal("deleted");

      }).catch((err) => assert.fail(err));

    });

    it('when get product by uniqId', async () => {

      const prod = new Product("XYZ");

      await prod.getIdx(client);

      expect(prod.uniqId).equal("XYZ");
      expect(prod.name).equal("test");
      expect(prod.description).equal("test of description");
      expect(prod.price).equal(79.99);
      expect(prod.stock).equal(1);

    });

    it('when fails with undefined uniqId', () => {
      
      const prod = new Product(undefined);

      expect(() => prod.idx(client)).to.throw('Invalid product state... To index the product to indice an uniqId must be defined!');
      expect(() => prod.delIdx(client)).to.throw('Invalid product state... To remove the product from indice an uniqId must be defined!');

    });

    it('when fails with null uniqId', () => {
      
      const prod = new Product(null);

      expect(() => prod.idx(client)).to.throw('Invalid product state... To index the product to indice an uniqId must be defined!');
      expect(() => prod.delIdx(client)).to.throw('Invalid product state... To remove the product from indice an uniqId must be defined!');

    });
    
});
