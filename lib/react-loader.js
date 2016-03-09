(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['react', 'react-dom', 'spin.js'], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('react'), require('react-dom'), require('spin.js'));
  } else {
    root.Loader = factory(root.React, root.ReactDOM, root.Spinner);
  }

}(this, function (React, ReactDOM, Spinner) {

  var Loader = React.createClass({displayName: "Loader",
    propTypes: {
      component: React.PropTypes.any,
      loaded:    React.PropTypes.bool,
      options:   React.PropTypes.object,
      scale:     React.PropTypes.number,
      lines:     React.PropTypes.number,
      length:    React.PropTypes.number,
      width:     React.PropTypes.number,
      radius:    React.PropTypes.number,
      corners:   React.PropTypes.number,
      rotate:    React.PropTypes.number,
      direction: React.PropTypes.oneOf([1, -1]),
      color:     React.PropTypes.string,
      speed:     React.PropTypes.number,
      trail:     React.PropTypes.number,
      shadow:    React.PropTypes.bool,
      hwaccell:  React.PropTypes.bool,
      className: React.PropTypes.string,
      zIndex:    React.PropTypes.number,
      top:       React.PropTypes.string,
      left:      React.PropTypes.string
    },

    getDefaultProps: function () {
      return { component: 'div', loadedClassName: 'loadedContent' };
    },

    getInitialState: function () {
      return { loaded: false, options: {} };
    },

    componentDidMount: function () {
      this.updateState(this.props);
    },

    componentWillReceiveProps: function (nextProps) {
      this.updateState(nextProps);
    },

    updateState: function (props) {
      props || (props = {});

      var loaded = this.state.loaded;
      var options = this.state.options;

      // update loaded state, if supplied
      if ('loaded' in props) {
        loaded = !!props.loaded;
      }

      // update spinner options, if supplied
      var allowedOptions = Object.keys(this.constructor.propTypes);
      allowedOptions.splice(allowedOptions.indexOf('loaded'), 1);
      allowedOptions.splice(allowedOptions.indexOf('options'), 1);

      // allows passing options as either props or as an option object
      var propsOrObjectOptions = 'options' in props ? props.options : props;

      allowedOptions.forEach(function (key) {
        if (key in propsOrObjectOptions) {
          options[key] = propsOrObjectOptions[key];
        }
      });

      this.setState({ loaded: loaded, options: options }, this.spin);
    },

    spin: function () {
      if (this.isMounted() && !this.state.loaded) {
        var spinner = new Spinner(this.state.options);
        var target =  ReactDOM.findDOMNode(this.refs.loader);

        // clear out any other spinners from previous renders
        target.innerHTML = '';
        spinner.spin(target);
      }
    },

    render: function () {
      var props, children;

      if (this.state.loaded) {
        props = { key: 'content', className: 'loadedContent' };
        children = this.props.children;
      } else {
        props = { key: 'loader', ref: 'loader', className: 'loader' };
      }

      return React.createElement(this.props.component, props, children);
    }
  });

  return Loader;

}));
