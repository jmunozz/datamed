import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from "react-dom"
import PropTypes from 'prop-types';

import SearchBar from "./SearchBar.react"
import "./navbar.scss"
import logoANSM from "./logo.svg"
import searchIcon from "./search_icon.svg"


const BREAKPOINT_TABLET = 840;
const BREAKPOINT_MOBILE = 340;


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

  const url = window.location.pathname;

  return <ul className="NavbarNavigation">
    {React.Children.map(children, (child) => {
      let className = ["NavbarNavigationItem"]
      console.log(url, child.props.href)
      if (url.includes(child.props.href)) {
        className.push("NavbarNavigationItem-isCurrent")
      }
      return <li className={className.join(" ")}>{child}</li>
    })}
  </ul>
}

function Logo({ onClick }) {
  return <a href="/" onClick={onClick}><img className="CustomNavbarLogo" src={logoANSM}></img></a>
} 




function SearchIcon({ opts, fireOnSelect, setProps }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleSelect = (props) => {
    setIsOpen(false);
    setProps(props);
  }

  return <React.Fragment>
      <div className="SearchIcon" onClick={handleClick}>
        <img src={searchIcon} />
      </div>
      {isOpen && <div className="CustomNavbarSearchBarContainer-isMobile"> 
        <SearchBar opts={opts} fireOnSelect={fireOnSelect} setProps={handleSelect}></SearchBar>
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
export default function NavBar({ id, setProps, fireOnSelect, opts }) {

    const getWindowDimensions = () => {
    return { height: window.innerHeight, width: window.innerWidth };
  }

  const getModeFromWindowDimensions = () => {
    const width = getWindowDimensions().width;
    if (width  < BREAKPOINT_MOBILE) return "MOBILE";
    else if (width < BREAKPOINT_TABLET) return "TABLET";
    else return "NORMAL"
  }

  const handleClick = (e) => {
      e.preventDefault();
      setProps({url: e.currentTarget.href})
  }
      

  const [mode, setMode] = useState(getModeFromWindowDimensions())

  const items = [{label: "Analyses thématiques", href: "#"}, { label: "Explorer", href: "/apps/explorer"}, { label: "À propos", href: "/apps/a_propos" }]
  const menuItems = items.map(i => {
    return <a href={i.href} onClick={handleClick} style={{color: "inherit"}}>{i.label}</a>
  })


  const windowHasResized = () => {
    const nextMode = getModeFromWindowDimensions()
    if ( nextMode !== mode) {
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
      return <div className="CustomNavbarSearchBarContainer">
        <SearchBar opts={opts} fireOnSelect={fireOnSelect} setProps={setProps} />
      </div>
    } else {
      return <SearchIcon opts={opts} fireOnSelect={fireOnSelect} setProps={setProps}/>
    }
  }

  const getNavBarElems = (mode) => {
    if (mode === "NORMAL") {
      return <div className="CustomNavbar">
          <Logo onClick={handleClick}/>
          {getMenu(mode)}
          {getSearchBar(mode)}
        </div>
    } else if (mode === "TABLET") {
      return <div className="CustomNavbar">
          {getMenu(mode)}
          <Logo onClick={handleClick}/>
          {getSearchBar(mode)}
      </div>;
    }
    else{
      return <div id={id} className="CustomNavbar CustomNavbar-isMobile">
          {getMenu(mode)}
          <Logo onClick={handleClick}/>
          {getSearchBar(mode)}
      </div>;
    }
  }

  React.useEffect(() => {
    window.addEventListener("resize", windowHasResized)
    return () => {
      window.removeEventListener("resize", windowHasResized)
    }
  })

  return getNavBarElems(mode)

}

NavBar.defaultProps = {
};

const optsPropType = PropTypes.arrayOf(
    PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
        type: PropTypes.string,
    })
);


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

    url: PropTypes.string,


    opts: optsPropType,

    value: PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        type: PropTypes.string,
    }),

    fireOnSelect: PropTypes.bool,


};
