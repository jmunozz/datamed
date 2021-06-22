import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from "react-dom"
import PropTypes from 'prop-types';

import SearchBar from "./SearchBar.react"
import "./navbar.scss"
import logoANSM from "./logo.svg"
import searchIcon from "./search_icon.svg"


const BREAKPOINT_TABLET = 840;
const BREAKPOINT_MOBILE = 320;


function Overlay({ onClick }) {
  const root = document.getElementById("react-entry-point")
  const el = <div onClick={onClick} className="Overlay"></div>
  return ReactDOM.createPortal(el, root)
}


function BurgerIcon({ open, onClick }) {
  
  const currentClass = open ? "open" : "";

  return <div className={`${currentClass} b-container`}>
            <div className="b-menu"onClick={onClick}>
              <div className="b-bun b-bun--top"></div>
              <div className="b-bun b-bun--mid"></div>
              <div className="b-bun b-bun--bottom"></div>
            </div>
        </div>
} 

function BurgerNavigation({ open, children }) {

  const currentClass = open ? "open" : "";

  return (<div className={`${currentClass} b-nav`}>
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
            <BurgerIcon open={isOpen} onClick={handleBurgerClick} />
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

function SearchBarContainer({ opts }) {
  return <div className="CustomNavbarSearchBarContainer">
    <SearchBar opts={opts} />
  </div>
}

function SearchIcon() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  return <React.Fragment>
      <img src={searchIcon} onClick={handleClick}/>
      {isOpen && <div className="CustomNavbarSearchBarContainer-isMobile"> 
        <SearchBar opts={[]}></SearchBar>
        <Overlay onClick={handleClick} />
      </div>}
    </React.Fragment>
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

  const opts = [];
      

  const windowHasResized = () => {
    const nextMode = getModeFromWindowDimensions()
    if ( nextMode !== mode) {
      console.log(`next mode: ${nextMode}`, `mode: ${mode}`)
      setMode(nextMode);
    }
  }

  const getMenu = (mode) => {
    if (mode === "NORMAL") {
      return <ClassicNavigation>{menuItems}</ClassicNavigation>;
    } else {
      return <Burger>{menuItems}</Burger>;
    }
  }

  const getSearchBar = (mode) => {
    if (mode === "NORMAL" || mode === "TABLET") {
      return <SearchBarContainer opts={opts}></SearchBarContainer>
    } else {
      return <SearchIcon />
    }
  }

  const getNavBarElems = (mode) => {
    if (mode === "NORMAL") {
      return [<Logo />, getMenu(mode), getSearchBar(mode)];
    } else if (mode === "TABLET") {
      return [getMenu(mode), <Logo />, getSearchBar(mode)];
    }
    else{
      return [getMenu(mode), <Logo />, getSearchBar(mode)];
    }
  }

  React.useEffect(() => {
    window.addEventListener("resize", windowHasResized)
    return () => {
      window.removeEventListener("resize", windowHasResized)
    }
  })

  return (
    <div className="CustomNavbar">
    {getNavBarElems(mode)}
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
