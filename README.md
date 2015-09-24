# react-loader

react-loader provides your [React.js](http://facebook.github.io/react/)
component a simple mechanism for rendering a loading spinner (via
[spin.js](http://fgnass.github.io/spin.js/)) while data is loading, such as an
asynchronous request to load data for a view.

## Installation

react-loader is available through both [Bower](http://bower.io/) and
[npm](https://www.npmjs.org/) via:

    npm install react-loader

or:

    bower install react-loader

Be sure to include the `--save` option to add this as a dependency in your
application's `package.json` or `bower.json` file.

## Usage

Wrap the Loader component around your loading content within your React
component's `render` function.

    /** @jsx React.DOM */
    var Loader = require('react-loader');

    var MyComponent = React.createClass({
      getInitialState: function () {
        return { loaded: false, profile: null };
      },

      componentDidMount: function () {
        new Profile({ id: this.props.id }).fetch({
          success: this.onSuccess,
          error: this.onError
        })
      },

      onSuccess: function (profile) {
        this.setState({ profile: profile, loaded: true });
      },

      onError: function (err) {
        // error handling goes here
      },

      render: function () {
        return (
          <Container>
            <Header>My Profile</Header>

            <Loader loaded={this.state.loaded}>
              <Profile model={this.state.profile} />
            </Loader>
          </Container>
        );
      }
    });

### Options

Options can be passed to the Loader component as properties.  The Loader accepts
a `loaded` boolean that specified whether the spinner or content should be
displayed, defaulting to `false`.  It also accepts a `component` property to
specify the DOM node, defaulting to `"div"`.  Additionally, all options
available to spin.js are available to this component in two ways.

1. First, you can pass each option onto the loader as individual properties:

        <Loader loaded={false} lines={13} length={20} width={10} radius={30}
                corners={1} rotate={0} direction={1} color="#000" speed={1}
                trail={60} shadow={false} hwaccel={false} className="spinner"
                zIndex={2e9} top="50%" left="50%" scale={1.00} />

2. Alternatively, you can use supply an object using the `options` key:

        var options = {
            lines: 13,
            length: 20,
            width: 10,
            radius: 30,
            corners: 1,
            rotate: 0,
            direction: 1,
            color: '#000',
            speed: 1,
            trail: 60,
            shadow: false,
            hwaccel: false,
            zIndex: 2e9,
            top: '50%',
            left: '50%',
            scale: 1.00
        };

        <Loader loaded={false} options={options} className="spinner" />

### Styling

The loader is rendered inside a DIV element (unless otherwise specified via the
`component` property mentioned earlier) with class "loader".  A simple solution
for rendering the spinner on the center of your screen would be to use some CSS
like the following:

    .loader {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: white;
      z-index: 9999;
    }

Once the content is loaded and the spinner is removed, the DOM node is given a
class of "loadedContent".

### Use in flux

In the view:

    <Loader loaded={!this.state.data.isLoading} ... />

When send a xhr request:

    ...
    componentDidMount: function () {
        sampleStore.addChangeListener(this._change);

        if (this.isMounted()) {

            SampleActions.setIsLoading();
            SampleActions.loadData(); 
        }
    },
    ..

And in SampleActions.js:

    ...
    setIsLoading: function (params) {
        PlatformDispatcher.dispatch({
            actionType: 'order_statistic_set_isLoading',
            item: params
        });
    },
    ...

Then in sampleStore.js:

    PlatformDispatcher.register(function (payload) {
        var actionType = payload.actionType;

        switch (actionType) {
            ...
            case 'order_statistic_set_isLoading':
              orderStatisticStore.setIsLoading(payload.item);
              break;
            ...
        }
    });

    OrderStatisticStore.prototype = assign({}, EventEmitter.prototype, {
        setIsLoading: function (params) {
            // when send a xhr request, change state
            this.data.isLoading = true;
            this.emit('change');
        },
        loadData: function (params, callback) {
            var params = params || {};

            // send request
            PlatformRequest.getQuestHandle({
                url: ...,
                data: {
                    ...
                }
            }, function (res) {
                // when success, change the state of isLoading
                this.data.isLoading = false;
                this.data... = res;
                this.emitChange();
                callback && callback();
            }.bind(this));
        },
        ...
    });



## Contributing

To contribute:

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Add your changes to the `lib/react-loader.jsx` file along with associated
   tests under `test/spec/react-loader-test.js`.
4. Build any JSX changes to JS (`npm run build`), and run tests (`npm test`).
5. Commit your changes (`git commit -am 'Added some feature'`)
6. Push to the branch (`git push origin my-new-feature`)
7. Create new Pull Request

## License

react-loader is released under the [MIT License](http://opensource.org/licenses/MIT).
