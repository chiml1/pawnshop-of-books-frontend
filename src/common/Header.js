import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
import Container from "react-bootstrap/Container";
import React from "react";
import {withRouter} from 'react-router-dom';
import './Header.css';
import Nav from 'react-bootstrap/Nav'

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick() {
            this.props.onLogout();
    }

    render() {
        let menuItems;
        if (this.props.currentUser) {
            menuItems = [

                <Col lg="3" key="/books">
                    <Link to="/books">
                        Home
                    </Link>
                </Col>,
                <Col lg="3" key="/book/new">
                    <Link to="/book/new">
                        Add Book
                    </Link>
                </Col>,
                <Col lg="3" key="profile">
                    <Link to={"/user/profile/" + this.props.currentUser.username}>
                        Profile
                    </Link>
                </Col>,
                <Col  lg="3" key="logout">
                    <Nav.Link className="logout" onClick={this.handleMenuClick}>Logout</Nav.Link>
                </Col> ];
        } else {
            menuItems = [
                <Col lg="4" key="/">
                    <div className="app-title">
                        <Link to="/">My App</Link>
                    </div>
                </Col>,
                <Col lg="4" key="/login">
                    <Link to="/login">Login</Link>
                </Col>,
                <Col lg="4" key="/signup">
                    <Link to="/signup">Signup</Link>
                </Col>
            ];
        }
        return(
            <Container className="header1">
                <div className="header">
                <Row>

                    {menuItems}
                </Row>
                </div>
            </Container>
                );
    }
}
export default withRouter(Header);
