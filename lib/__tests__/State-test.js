'use strict';

var assert = require('assert');
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('../index');
var Route = require('../components/Route');
var TestLocation = require('../locations/TestLocation');

var _require = require('../TestUtils');

var Foo = _require.Foo;

describe('State', function () {

  describe('when a route is active', function () {
    describe('and it has no params', function () {
      it('is active', function (done) {
        var location = new TestLocation(['/foo']);
        var div = document.createElement('div');
        var routes = React.createElement(Route, { name: 'foo', handler: Foo });

        var router;

        Router.run(routes, location, function (Handler) {
          router = this;
          ReactDOM.render(React.createElement(Handler, null), div, function () {
            assert(router.isActive('foo'));
            done();
          });
        });
      });
    });

    describe('and the right params are given', function () {
      var location, router;
      var div = document.createElement('div');
      var routes = React.createElement(Route, { name: 'products', path: '/products/:id/:variant', handler: Foo });

      beforeEach(function (done) {
        location = new TestLocation(['/products/123/456?search=abc&limit=789']);
        Router.run(routes, location, function (Handler) {
          router = this;
          ReactDOM.render(React.createElement(Handler, null), div, function () {
            done();
          });
        });
      });

      afterEach(function () {
        ReactDOM.unmountComponentAtNode(div);
      });

      describe('and no query is used', function () {
        it('is active', function () {
          assert(router.isActive('products', { id: 123, variant: '456' }));
        });
      });

      describe('and a matching query is used', function () {
        it('is active', function () {
          assert(router.isActive('products', { id: 123 }, { search: 'abc' }));
        });
      });

      describe('but the query does not match', function () {
        it('is not active', function () {
          assert(router.isActive('products', { id: 123 }, { search: 'def' }) === false);
        });
      });

      describe('and the wrong params are given', function () {
        it('is not active', function () {
          assert(router.isActive('products', { id: 345 }) === false);
        });
      });
    });
  });
});