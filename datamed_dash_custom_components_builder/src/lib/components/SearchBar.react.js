import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {InputGroup, Input} from 'reactstrap';
import classNames from 'classnames';

import './search_bar.css';
import searchIcon from './search_icon.svg';

const optsPropType = PropTypes.arrayOf(
    PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
        type: PropTypes.string,
    })
);

class SearchDropDown extends Component {
    constructor(props) {
        super(props);
    }

    buildItem(label, value, type) {
        return (
            <div
                onClick={() => this.props.onSelect({label, value, type})}
                className="search-dropdown-item"
            >
                <div className="search-dropdown-item-label">{label}</div>
                <div className="search-dropdown-item-caption">{type}</div>
            </div>
        );
    }

    buildNoResultItem() {
        return <div className="search-dropdown-item">Pas de résultat</div>;
    }

    render() {
        const {opts, isOpen} = this.props;
        const items = opts.length
            ? opts.map((opt) => {
                  return this.buildItem(opt.label, opt.value, opt.type);
              })
            : this.buildNoResultItem();
        return (
            <div
                className="search-dropdown-menu"
                style={{display: isOpen ? true : 'none'}}
            >
                {items}
            </div>
        );
    }
}

SearchDropDown.defaultProps = {};
SearchDropDown.propTypes = {
    opts: optsPropType,
    onSelect: PropTypes.func,
    isOpen: PropTypes.bool,
};

const initialState = {
    inputValue: '',
    isDropDownOpen: false,
    submitValue: null,
};

/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
export default class SearchBar extends Component {
    constructor(props) {
        super(props)
        this.state = initialState;
        this.inputRef = React.createRef();
    }

    handleDropDown = ({label, value, type}) => {
        if (this.props.fireOnSelect) {
            this.fire({ value, type })
        } else {
            this.setState({
                inputValue: label,
                isDropDownOpen: false,
                submitValue: {value, type},
            });
            //this is not working use dirty fix...
            //this.inputRef.current.focus();
            const input = document.querySelector(".search-bar-wrapper input.form-control");
            input.focus();
        }
    };

    handleInput = (event) => {
        const inputValue = event.target.value;
        this.setState({inputValue, isDropDownOpen: Boolean(inputValue)});
    };

    clearState() {
        this.setState(initialState);
    }

    fire(val) {
        this.props.setProps({value: val});
        this.clearState();
    }

    handleSubmit = (event) => {
        if (event.key === 'Enter') {
            const submitValue = this.state.submitValue;
            if (submitValue) {
                this.fire(submitValue)
            }
        }
    };

    render() {
        const {id, className, opts} = this.props;
        const {isDropDownOpen, inputValue} = this.state;
        const selectOpts = inputValue ? opts.filter((opt) =>
            opt.label.toLowerCase().startsWith(inputValue.toLowerCase())
        ).slice(0, 100) : [];


        return (
            <div
                id={id}
                className={classNames('search-bar-wrapper', className)}
            >
                <InputGroup>
                    <img src={searchIcon} />
                    <Input
                        type="text"
                        ref={this.inputRef}
                        onChange={this.handleInput}
                        placeholder="specialité, substance"
                        value={inputValue}
                        onKeyPress={this.handleSubmit}
                    />
                </InputGroup>
                <SearchDropDown
                    isOpen={isDropDownOpen}
                    opts={selectOpts}
                    onSelect={this.handleDropDown}
                />
            </div>
        );
    }
}

SearchBar.defaultProps = {
    opts: [],
};

SearchBar.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,

    opts: optsPropType,

    value: PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        type: PropTypes.string,
    }),

    fireOnSelect: PropTypes.bool,
};
