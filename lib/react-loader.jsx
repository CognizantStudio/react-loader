/** @jsx React.DOM */

(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['react', 'spin'], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('react'), require('spin'));
  } else {
    root.Loader = factory(root.React, root.Spinner);
  }

}(this, function (React, Spinner) {

  var Loader = React.createClass({
    propTypes: {
      loaded:    React.PropTypes.bool,
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
      left:      React.PropTypes.string,
      delay:     React.PropTypes.number
    },

    getDefaultProps: function() {
      return { delay: 0 };
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
      allowedOptions.splice(allowedOptions.indexOf('delay'), 1);

      allowedOptions.forEach(function (key) {
        if (key in props) {
          options[key] = props[key];
        }
      });

      this.setState({ loaded: loaded, options: options }, this.spin);
    },

    spin: function () {
      var that = this;
      if (that.isMounted() && !that.state.loaded) {
        setTimeout(function () {
          if (that.state.loaded) return;
          var spinner = new Spinner(that.state.options);
          var target = that.refs.loader.getDOMNode();
          // clear out any other spinners from previous renders
          target.innerHTML = '';
          spinner.spin(target);
        }, that.props.delay);
      }
    },

    render: function () {
      if (this.state.loaded) {
        return ( <div key="content">{this.props.children}</div> );
      } else {
        return ( <div key="loader" ref="loader" className="loader"></div> );
      }
    }
  });

  return Loader;

}));
