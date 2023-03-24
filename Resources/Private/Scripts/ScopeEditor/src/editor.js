import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {neos} from '@neos-project/neos-ui-decorators';
import style from './editor.css';

@neos(globalRegistry => {
  return {
    i18nRegistry: globalRegistry.get('i18n')
  };
})


class Editor extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    commit: PropTypes.func.isRequired,
    i18nRegistry: PropTypes.object.isRequired,
    options: PropTypes.shape({
      lower: PropTypes.shape({
        label: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        initial: PropTypes.number,
        step: PropTypes.number,
		disabled: PropTypes.bool
      }),
      higher: PropTypes.shape({
        label: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        initial: PropTypes.number,
        step: PropTypes.number,
		disabled: PropTypes.bool
      }),
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        disabled: PropTypes.bool,
        type: PropTypes.oneOf(['basic', 'graphic']),
    })
  };



  static defaultProps = {
    options: {
      lower: {
        min: 0,
        max: 100,
        initial: 0,
        step: 1,
		disabled: false
      },
      higher: {
        min: 0,
        max: 100,
		initial: 0,
        step: 1,
		disabled: false
      },
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      type: 'basic'
    }
  };

  constructor(props) {
    super(props);
    this.lowerRef = React.createRef();
    this.higherRef = React.createRef();
  }

	componentDidMount() {
		this.lowerRef.current.value	 = this.checkValue( this.props.value.lower, this.props.options.lower.initial );
		this.higherRef.current.value = this.checkValue( this.props.value.higher, this.props.options.higher.initial );
	}

	checkValue(value, defaultValue) {
		return ( typeof value !== 'undefined' && value ) ? value : defaultValue;
	}

  handleChange = event => {
    const {options} = this.props;
    const {target} = event;

    let value = parseInt(target.value || target.innerText);

    if (isNaN(value)) {
      return;
    }

    let lowValue    = parseInt(this.lowerRef.current.value);
    let highValue   = parseInt(this.higherRef.current.value);

    if (target.classList.value === 'lower' ) {
			let lowMin = options.lower.min ? options.lower.min : options.min;
			let lowMax = options.lower.max ? options.lower.max : options.max;

			value = Math.min(lowMax, Math.max(lowMin, value));

      if ( value > highValue ) {
				this.lowerRef.current.value = highValue;
			}
    }

    if (target.classList.value === 'higher' ) {
			let highMin = options.higher.min ? options.higher.min : options.min;
			let highMax = options.higher.max ? options.higher.max : options.max;

      value = Math.min(highMax, Math.max(highMin, value));

      if ( lowValue > value ) {
				this.higherRef.current.value = lowValue;
      }
    }

    this.props.commit({lower: this.lowerRef.current.value, higher: this.higherRef.current.value});

    this.forceUpdate();
  };

  onKeyPress = event => {
    if (isNaN(event.key)) {
      event.preventDefault();
    }
  };

  render() {
    const options = {...this.constructor.defaultProps.options, ...this.props.options};

		const lowerInputLabel = this.props.i18nRegistry.translate( options.lower.label ? options.lower.label :  'Skw.Neos.ScopeEditor:Main:scopeEditorMinimum');
		const higherInputLabel = this.props.i18nRegistry.translate( options.higher.label ? options.higher.label : 'Skw.Neos.ScopeEditor:Main:scopeEditorMaximum');

    return (
      <div className={style.scopeEditor + (options.disabled ? ' ' + style.scopeEditorDisabled : '')}>
        <div className={style.grid}>
					<div title={lowerInputLabel}>{lowerInputLabel}</div>
					<div title={higherInputLabel}>{higherInputLabel}</div>
          <div className={(options.lower.disabled ? ' ' + style.scopeEditorDisabled : '')}>
            <input
              type="number"
              min={options.lower.min ? options.lower.min : options.min}
              max={options.lower.max ? options.lower.max : options.max}
              step={options.lower.step ? options.lower.step : options.step}
              className="lower"
							disabled={options.lower.disabled || options.disabled}
							onChange={this.handleChange}
              ref={this.lowerRef}
            />
          </div>
					<div className={(options.higher.disabled ? ' ' + style.scopeEditorDisabled : '')}>
            <input
              type="number"
              min={options.higher.min ? options.higher.min : options.min}
              max={options.higher.max ? options.higher.max : options.max}
              step={options.higher.step ? options.higher.step : options.step}
              className="higher"
							disabled={options.higher.disabled || options.disabled}
              onChange={this.handleChange}
              ref={this.higherRef}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Editor;
