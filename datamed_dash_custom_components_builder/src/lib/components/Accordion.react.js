import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './accordion.css';
import toggleIcon from './expand_less.svg';



/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
export default class Accordion extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            isOpen: props.isOpenOnFirstRender
        }
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    
    
    render() {
        const { isOpen } = this.state;
        const { label, labelClass, children, id} = this.props
        const toggleIconStyle = isOpen ? {} : {"transform": "rotate(180deg)", "height":"1.5rem"};
        return <div id={id} className="Accordion">
            <React.Fragment>
                <div className="AccordionToggle" onClick={this.toggle}>
                    <img className="AccordionToggleIcon" src={toggleIcon} style={toggleIconStyle}/>
                </div>
                <div className={`AccordionLabel ${labelClass}`} onClick={this.toggle}>{label}</div>
                <div className={`AccordionContent ${isOpen ? "AccordionContent-isVisible" : ""}`}>
                    {children}
                </div>
            </React.Fragment>
        </div>
    }
}

Accordion.defaultProps = {
    isOpenOnFirstRender: false,
    labelClass: '',
};

Accordion.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,

    children: PropTypes.node,

    label: PropTypes.string,

    labelClass: PropTypes.string,

    isOpenOnFirstRender: PropTypes.bool

};
