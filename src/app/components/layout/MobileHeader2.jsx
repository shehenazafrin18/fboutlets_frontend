import React from 'react'
import { Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function MobileHeader2() {
    return (
        <>

            <Navbar className='mobile_header_two' collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#home">
                    <Link to="/">
                        <img alt="logo" src="images/logo.png" />
                    </Link> 
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Link to="/">Home</Link>
                        <Link to="#">My Jobs</Link> 
                        <Link to="/available-jobs">Available Job</Link> 
                        <Link to="/my-profile/personal-info">My Profile</Link> 
                    </Nav> 
                </Navbar.Collapse>
            </Navbar>
        
        </>
    )
}

