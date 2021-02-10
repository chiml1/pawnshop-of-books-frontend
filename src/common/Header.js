import {Link, withRouter} from "react-router-dom";
import React from "react";
import Nav from 'react-bootstrap/Nav'
import {Navbar} from "react-bootstrap";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick() {
        this.props.onLogout();
    }

    render() {
        let menuItems;
        if (this.props.currentUser) {
            menuItems = [
                <Nav className="m-auto" key="1">
                    <Nav.Item className="navbar-nav ml-auto text-center" key="/books">
                        <Link to="/books" style={{marginRight: "20px"}}>
                            Home
                        </Link>
                    </Nav.Item>
                    <Nav.Item className="navbar-nav ml-auto text-center" key="/book/new">
                        <Link to="/book/new" style={{marginRight: "20px"}}>
                            Add Book
                        </Link>
                    </Nav.Item>
                    <Nav.Item className="navbar-nav ml-auto text-center" key="profile">
                        <Link to={"/user/profile/" + this.props.currentUser.username} style={{marginRight: "20px"}}>
                            Profile
                        </Link>
                    </Nav.Item>
                    <Nav.Item className="navbar-nav ml-auto text-center" key="logout">
                        <Nav.Link className="logout" onClick={this.handleMenuClick} style={{marginRight: "20px"}}>Logout</Nav.Link>
                    </Nav.Item>
                </Nav>
            ];
        } else {
            menuItems = [
                <Nav className="m-auto" key="1">
                    <Nav.Item className="navbar-nav ml-auto text-center" key="/">
                        <Link to="/" style={{marginRight: "20px"}}>My App</Link>
                    </Nav.Item>
                    <Nav.Item className="navbar-nav ml-auto text-center" key="/login">
                        <Link to="/login" style={{marginRight: "20px"}}>Login</Link>
                    </Nav.Item>
                    <Nav.Item className="navbar-nav ml-auto text-center" key="/signup">
                        <Link to="/signup" style={{marginRight: "20px"}}>Signup</Link>
                    </Nav.Item>
                </Nav>
            ];
        }
        return (
            <Navbar bg="dark" variant="dark" expand="sm" fixed="top">
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    {menuItems}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Header);
