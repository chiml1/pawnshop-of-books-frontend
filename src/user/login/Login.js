import React, { Component } from 'react';
import { login } from '../../util/APIUtils';
import './Login.css';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants/Stuff';
import Button from "react-bootstrap/Button";
import { Form} from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: "",
            username: "",
            password: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        const loginRequest = {
            username: this.state.username,
            password: this.state.password
        };
        login(loginRequest)
            .then(response => {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                this.props.onLogin();
            }).catch(error => {
                if(error.status === 401) {
                    this.setState({
                        open: true,
                        username: "",
                        password: "",
                        message: 'Your Username or Password is incorrect. Please try again!'
                    });
                } else {
                    this.setState({
                        open: true,
                        message: error.message || 'Sorry! Something went wrong. Please try again!'
                    });
                }
            });
    }

    handleClose = (event, reason) => {
        this.setState({ open: false });
    };

    render() {
        return (
            <div className="login-container">
                <h1>Login</h1>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Group>
                            <Form.Control
                                required
                                name="username"
                                value={this.state.username}
                                placeholder="Username"
                                onChange={this.handleChange}
                            />
                    </Form.Group>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>

                    <Form.Group>
                            <Form.Control
                                required
                                name="password"
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                placeholder="Password"
                            />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Button variant="primary" type="submit" className="login-form-button">Login</Button>
                        Or <Link to="/signup">register now!</Link>
                    </Form.Group>
                </Form>
                <Snackbar
                    style = {{width: 300, color: 'green'}}
                    open={this.state.open}  onClose={this.handleClose}
                    autoHideDuration={3000} message={this.state.message} />
            </div>
        );
    }
}

export default Login;
