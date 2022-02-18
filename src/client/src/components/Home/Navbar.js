import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

class Navbar extends Component{
    render(){
        return(
            <div className="flex-nowrap">
                <div className="navbar">
                    <NavLink exact to="/" className="logo">SC</NavLink>
                    <nav>
                        <ul>
                            <NavLink exact to="/" activeClassName="selectedNav" className="navbarItem">Home</NavLink>
                            <NavLink exact to="/clients" activeClassName="selectedNav" className="navbarItem">Clients</NavLink>
                            <NavLink exact to="/calendar" activeClassName="selectedNav" className="navbarItem">Calendar</NavLink>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Navbar;