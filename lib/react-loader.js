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
      className:       React.PropTypes.string,
      color:           React.PropTypes.string,
      component:       React.PropTypes.any,
      corners:         React.PropTypes.number,
      direction:       React.PropTypes.oneOf([1, -1]),
      hwaccell:        React.PropTypes.bool,
      left:            React.PropTypes.string,
      length:          React.PropTypes.number,
      lines:           React.PropTypes.number,
      loaded:          React.PropTypes.bool,
      loadedClassName: React.PropTypes.string,
      opacity:         React.PropTypes.number,
      options:         React.PropTypes.object,
      parentClassName: React.PropTypes.string,
      radius:          React.PropTypes.number,
      rotate:          React.PropTypes.number,
      scale:           React.PropTypes.number,
      shadow:          React.PropTypes.bool,
      speed:           React.PropTypes.number,
      top:             React.PropTypes.string,
      trail:           React.PropTypes.number,
      width:           React.PropTypes.number,
      zIndex:          React.PropTypes.number
    },

    getDefaultProps: function () {
      return {
        component: 'div',
        loadedClassName: 'loadedContent',
        parentClassName: 'loader'
      };
    },

    getInitialState: function () {
      return { loaded: false, delay: null, options: {} };
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

      this.setState({ loaded: loaded, options: options, 
                      delay: this.props.delay }, this.showSpinner);
    },

    showSpinner: function() {
      var delay = this.state.delay;                                
      if (delay && !this.state.loaded) {
        this.setState({delay: null, waiting: true}, function() {
          setTimeout(function() {
            if (!this.state.loaded) {
              this.setState({waiting: false}, this.spin);
            }
          }.bind(this), delay)
        });
      } else
        this.spin();
    },

    spin: function () {
      var canUseDOM = !!(
        typeof window !== 'undefined' &&
        window.document &&
        window.document.createElement
      );

      if (canUseDOM && this.isMounted() && !this.state.loaded) {
        var spinner = new Spinner(this.state.options);
        var target =  ReactDOM.findDOMNode(this.refs.loader);

        // clear out any other spinners from previous renders
        if (target)
          target.innerHTML = '';
        spinner.spin(target);
      }
    },

    render: function () {
      var props, children;

      if (this.state.loaded || this.state.waiting) {
        props = { key: 'content', className: this.props.loadedClassName };
        children = this.props.children;
      } else {
        props = { key: 'loader', ref: 'loader', className: this.props.parentClassName };
      }

      return React.createElement(this.props.component, props, children);
    }
  });

  return Loader;

}));
