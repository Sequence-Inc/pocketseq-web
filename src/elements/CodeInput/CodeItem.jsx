import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 */
class CodeItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.validate(props.initialValue),
            focus: false
        };
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onPaste = this.onPaste.bind(this);
    }

    onKeyDown(e) {
        if (
            e.keyCode === 8 &&
            (!this.state.value || !this.state.value.length)
        ) {
            this.props.onBackspace();
        }
    }

    clear() {
        this.setState({
            value: ''
        });
    }

    update(updatedValue, isPasting = false) {
        const value = this.validate(updatedValue);
        if (this.state.value === value && !isPasting) return;

        if (value.length < 2) {
            this.setState({
                value
            });

            setTimeout(() => {
                this.props.onChange(value, isPasting);
            }, 0);
        }
    }

    onChange(e) {
        this.update(e.target.value);
    }

    focus() {
        this.input.focus();
    }

    onFocus(e) {
        if (this.props.autoSelect) {
            e.target.select();
        }
        this.setState({ focus: true });
    }

    onBlur() {
        this.setState({ focus: false });
    }

    onPaste(e) {
        if (!this.props.onPaste) {
            return;
        }

        const value = e.clipboardData.getData('text');
        this.props.onPaste(value);
    }

    validate(value) {
        if (this.props.validate) {
            return this.props.validate(value);
        }

        if (this.props.type === 'numeric') {
            const numCode = value.charCodeAt(0);
            const isInteger =
                numCode >= '0'.charCodeAt(0) && numCode <= '9'.charCodeAt(0);
            return isInteger ? value : '';
        }
        if (this.props.regexCriteria.test(value)) {
            return value.toUpperCase();
        }

        return '';
    }

    render() {
        const { focus, value } = this.state;
        const {
            type,
            inputMode,
            inputStyle,
            inputFocusStyle,
            itemIndex,
            itemLength
        } = this.props;
        const inputType = type === 'numeric' ? 'tel' : type || 'text';

        let additionalClassName = '';
        // check first
        if (itemIndex === 0) {
            additionalClassName = 'rounded-l-md';
        }
        // check last
        if (itemIndex === itemLength - 1) {
            additionalClassName = 'rounded-r-md';
        }

        return (
            <div className="flex-1 min-w-0">
                <input
                    disabled={this.props.disabled ? 'disabled' : undefined}
                    className={`focus:ring-lightBlue-600 text-gray-600 focus:border-lightBlue-600 relative text-center block w-full rounded-none bg-transparent focus:z-10 sm:text-sm border-gray-300 ${additionalClassName}`}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    placeholder={value}
                    aria-label={value}
                    maxLength="1"
                    autoComplete="off"
                    type={this.props.secret ? 'password' : inputType}
                    inputMode={inputMode || 'text'}
                    pattern={
                        this.props.type === 'numeric'
                            ? '[0-9]*'
                            : '^[a-zA-Z0-9]+$'
                    }
                    ref={(n) => (this.input = n)}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onPaste={this.onPaste}
                    style={Object.assign(
                        {},
                        inputStyle,
                        focus ? Object.assign({}, inputFocusStyle) : {}
                    )}
                    value={value}
                />
            </div>
        );
    }
}

CodeItem.propTypes = {
    initialValue: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBackspace: PropTypes.func.isRequired,
    onPaste: PropTypes.func,
    secret: PropTypes.bool,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    inputMode: PropTypes.string,
    validate: PropTypes.func,
    inputStyle: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    inputFocusStyle: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    autoSelect: PropTypes.bool,
    regexCriteria: PropTypes.any,
    itemIndex: PropTypes.number,
    itemLength: PropTypes.number
};

CodeItem.defaultProps = {
    secret: false,
    type: 'numeric',
    inputMode: undefined,
    disabled: false,
    validate: undefined,
    autoSelect: false,
    onPaste: undefined,
    regexCriteria: /^[a-zA-Z0-9]+$/
};

export default CodeItem;
