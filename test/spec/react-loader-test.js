/** @jsx React.DOM */

var React = require('react');
var Loader = require('../../lib/react-loader');
var expect = require('chai').expect;

describe('Loader', function () {
  var testCases = [{
    description: 'loading is in progress',
    props: { loaded: false },
    expectedOutput: /<div class="loader"[^>]*?><div class="spinner"/
  },
  {
    description: 'loading is in progress with component option',
    props: { loaded: false, component: 'span' },
    expectedOutput: /<span class="loader"[^>]*?><div class="spinner"/
  },
  {
    description: 'loading is in progress with spinner options',
    props: { loaded: false, radius: 17, width: 900 },
    expectedOutput: /<div class="loader"[^>]*?><div class="spinner"[^>]*?>.*translate\(17px, 0px\).*style="[^"]*?height: 900px;/
  },
  {
    description: 'loading is in progress with spinner options and options object is used instead of props',
    props: {
        loaded: false,
        width: 900,
        options: { width: 200 }
    },
    expectedOutput: /<div class="loader"[^>]*?><div class="spinner"[^>]*?>.*style="[^"]*?height: 200px;/
  },
  {
    description: 'loading is complete',
    props: { loaded: true },
    expectedOutput: /<div class="loadedContent"[^>]*>Welcome<\/div>/
  },
  {
    description: 'loading is complete with component option',
    props: { loaded: true, component: 'span' },
    expectedOutput: /<span class="loadedContent"[^>]*?>Welcome<\/span>/
  },
  {
    description: 'loading is in progress with custom className',
    props: {
      loaded: false,
      className: 'my-loader-class'
    },
    expectedOutput: /<div class="my-loader-class"[^>]*?><div class="spinner"/
  },];

  testCases.forEach(function (testCase) {
    describe(testCase.description, function () {
      var container;
      beforeEach(function () {
        var loader = React.createElement(Loader, testCase.props, 'Welcome');
        container = document.createElement('div');
        document.body.appendChild(container);
        React.render(loader, container);
      });

      afterEach(function () {
        document.body.removeChild(container);
      });

      it('renders the correct output', function () {
        expect(container.innerHTML).to.match(testCase.expectedOutput);
      })
    });
  });
});
