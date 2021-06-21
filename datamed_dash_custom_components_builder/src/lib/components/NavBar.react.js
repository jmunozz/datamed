import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import "./navbar.scss"
import logoANSM from "./logo.svg"


const BREAKPOINT_TABLET = 600;
const BREAKPOINT_MOBILE = 320;


function BurgerIcon({ open, onClick }) {
  
  const currentClass = open ? "open" : "";

  return <div class={`${currentClass} b-container`}>
            <div class="b-menu"onClick={onClick}>
              <div class="b-bun b-bun--top"></div>
              <div class="b-bun b-bun--mid"></div>
              <div class="b-bun b-bun--bottom"></div>
            </div>
        </div>
} 

function BurgerNavigation({ open, children }) {

  const currentClass = open ? "open" : "";

  return (<div class={`${currentClass} b-nav`}>
          {React.Children.map(children, (child) => {
           return <li className="b-link">{child}</li>
          })}
        </div>)
}

function Burger({ children }) {

  const [isOpen, setIsOpen ] = useState(false)
  const handleBurgerClick = () => {
    setIsOpen(!isOpen)
  }

  return <React.Fragment>
            <BurgerIcon open={isOpen} onClick={handleBurgerClick} />,
            <BurgerNavigation open={isOpen}>
              {children}
            </BurgerNavigation>
  </React.Fragment>

}

function ClassicNavigation({ children }) {
  return <ul className="NavbarNavigation">
    {React.Children.map(children, (child) => {
      return <li>{child}</li>
    })}
  </ul>
}

function Logo() {
  return <img className="CustomNavbarLogo" src={logoANSM}></img>
} 

/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
export default function NavBar({ id, setProps }) {

    const getWindowDimensions = () => {
    return { height: window.innerHeight, width: window.innerWidth };
  }

  const getModeFromWindowDimensions = () => {
    const width = getWindowDimensions().width;
    if (width  < BREAKPOINT_MOBILE) return "MOBILE";
    else if (width < BREAKPOINT_TABLET) return "TABLET";
    else return "NORMAL"
  }

  const [mode, setMode] = useState(getModeFromWindowDimensions())

  const menuItems = [          <a href="https://github.com/mblode/burger" target="_blank">Analyses thématiques</a>,
          <a href="https://github.com/mblode" target="_blank">Explorer</a>,
          <a href="https://codepen.io/mblode/" target="_blank">À propos</a>]


      

  const windowHasResized = () => {
    const nextMode = getModeFromWindowDimensions()
    if ( nextMode !== mode) {
      console.log(`next mode: ${nextMode}`, `mode: ${mode}`)
      setMode(nextMode);
    }
  }

  React.useEffect(() => {
    window.addEventListener("resize", windowHasResized)
    return () => {
      window.removeEventListener("resize", windowHasResized)
    }
  })

  const menu = mode === "NORMAL" ? <ClassicNavigation>{menuItems}</ClassicNavigation> : <Burger>{menuItems}</Burger>
  const elems = [<Logo />, menu]
  if (mode !== "NORMAL") {
    elems.reverse()
  }

  return (
    <div className="CustomNavbar">
    {elems}
    </div>

  );
}

NavBar.defaultProps = {
};

NavBar.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,


};
