import React, { Component } from 'react';
import { createBook } from '../util/APIUtils';
import './NewBook.css';
import Button from "react-bootstrap/Button";
import { Form } from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import {
    MIN_TITLE_LENGTH,
    MAX_TITLE_LENGTH,
    MIN_FIRSTNAME_LENGTH,
    MAX_FIRSTNAME_LENGTH,
    MIN_LASTNAME_LENGTH,
    MAX_LASTNAME_LENGTH,CURRENT_YEAR
} from '../constants/Stuff';

class NewBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                value: ''
            },
            authorFirstName: {
                value: ''
            },
            authorLastName: {
                value: ''
            },
            theYearOfPublishment: {
                value: 0.0
            },
            price: {
                value: 0
            },
            errors: {},
            message: "",
            open: false

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const bookData = {
            title: this.state.title.value,
            authorFirstName: this.state.authorFirstName.value,
            authorLastName: this.state.authorLastName.value,
            theYearOfPublishment: this.state.theYearOfPublishment.value,
            price: this.state.price.value,
            whoAddedItId: this.props.currentUser.id
        };
        createBook(bookData)
            .then(response => {
                this.props.history.push("/books");
            }).catch(error => {
            if (error.status === 401) {
                this.props.handleLogout('/login');
            } else {
                this.setState({
                    open: true,
                    message: 'Sorry! Something went wrong. Please try again!'
                });
            }
        });
    }

    handleClose = (event, reason) => {
        this.setState({ open: false });
    };


    isFormInvalid() {
        return !(this.state.title.validateStatus === 'success' &&
            this.state.authorFirstName.validateStatus === 'success' &&
            this.state.authorLastName.validateStatus === 'success' &&
            this.state.theYearOfPublishment.validateStatus === 'success' &&
            this.state.price.validateStatus === 'success'
        );
    }

    validateTitle = (title) => {
        let re = /^[a-zA-Z]+$/; //

        if (!re.test(title)) {
            return {
                validateStatus: 'error',
                errorMsg: `Incorrect title`
            }
        } else if(title.length < MIN_TITLE_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Title is too short (Minimum ${MIN_TITLE_LENGTH} characters needed.)`
            }
        } else if (title.length > MAX_TITLE_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Username is too long (Maximum ${MAX_TITLE_LENGTH} characters allowed.)`
            }
        } else {
            this.setState({
                title: {
                    value: title,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    };

    validateAuthorFirstName = (authorFirstName) => {
        let re = /^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]+$/;

        if (!re.test(authorFirstName)) {
            return {
                validateStatus: 'error',
                errorMsg: `Incorrect first name`
            }
        } else if(authorFirstName.length < MIN_FIRSTNAME_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `First name is too short (Minimum ${MIN_FIRSTNAME_LENGTH} characters needed.)`
            }
        } else if (authorFirstName.length > MAX_FIRSTNAME_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `First name is too long (Maximum ${MAX_FIRSTNAME_LENGTH} characters allowed.)`
            }
        } else {
            this.setState({
                authorFirstName: {
                    value: authorFirstName,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    };

    validateAuthorLastName = (authorLastName) => {
        let re = /^[a-zA-Z]+$/;
        if (!re.test(authorLastName)) {
            return {
                validateStatus: 'error',
                errorMsg: `Incorrect first name`
            }
        } else if(authorLastName.length < MIN_LASTNAME_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Last name is too short (Minimum ${MIN_LASTNAME_LENGTH} characters needed.)`
            }
        } else if (authorLastName.length > MAX_LASTNAME_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Last name is too long (Maximum ${MAX_LASTNAME_LENGTH} characters allowed.)`
            }
        } else {
            this.setState({
                authorLastName: {
                    value: authorLastName,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    };

    validateYear = (theYearOfPublishment) => {
        if(theYearOfPublishment === ''){
            return {
                validateStatus: 'error',
                errorMsg: 'Empty year'
            }
        }
        if(theYearOfPublishment > CURRENT_YEAR || theYearOfPublishment < 1900){
            return {
                validateStatus: 'error',
                errorMsg: 'Incorrect year'
            }
        } else {
            this.setState({
                theYearOfPublishment: {
                    value: theYearOfPublishment,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }

    };

    validatePrice = (price) => {
        if(price === ''){
            return {
                validateStatus: 'error',
                errorMsg: 'Empty price'
            }
        }
        if(price <= 0 || price > 200){
            return {
                validateStatus: 'error',
                errorMsg: "Incorrect price"
            }
        }
        this.setState({
            price: {
                value: price,
                validateStatus: 'success',
                errorMsg: null
            }
        });
        return {
            validateStatus: 'success',
            errorMsg: null
        }
    };

    render() {
        return (
            <div className="new-book-container">
                <br/>
                <h1 className="page-title">Add book</h1>
                <br/>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">

                        <h5>Title</h5>
                        <Form.Group className="poll-form-row">
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="title"
                                // onBlur={this.validateUsernameAvailability} tu jest takie cos
                                onChange={(event) => this.handleInputChange(event, this.validateTitle)}
                                value={this.state.title.value}
                            />
                            <span style={{color: "red"}}>{this.state.errors["title"]}</span>
                        </Form.Group>

                        <h5>Author's first name</h5>
                        <Form.Group className="poll-form-row">
                            <Form.Control
                                type="text"
                                placeholder="Enter author's first name"
                                name="authorFirstName"
                                onChange={(event) => this.handleInputChange(event, this.validateAuthorFirstName)}
                                value={this.state.authorFirstName.value}
                            />
                            <span style={{color: "red"}}>{this.state.errors["authorFirstName"]}</span>
                        </Form.Group>

                        <h5>Author's last name</h5>
                        <Form.Group className="poll-form-row">
                            <Form.Control
                                type="text"
                                placeholder="Enter author's last name"
                                name="authorLastName"
                                onChange={(event) => this.handleInputChange(event, this.validateAuthorLastName)}
                                value={this.state.authorLastName.value}
                            />
                            <span style={{color: "red"}}>{this.state.errors["authorLastName"]}</span>
                        </Form.Group>

                        <h5>The year of publishment</h5>
                        <Form.Group className="poll-form-row">
                            <Form.Control
                                type="number"
                                placeholder="Enter the year of publishment"
                                name="theYearOfPublishment"
                                onChange={(event) => this.handleInputChange(event, this.validateYear)}
                                value={this.state.theYearOfPublishment.value}
                            />
                            <span style={{color: "red"}}>{this.state.errors["theYearOfPublishment"]}</span>
                        </Form.Group>

                        <h5>Price (zł)</h5>
                        <Form.Group className="poll-form-row">
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                name="price"
                                onChange={(event) => this.handleInputChange(event, this.validatePrice)}
                                value={this.state.price.value}
                            />
                            <span style={{color: "red"}}>{this.state.errors["price"]}</span>
                        </Form.Group>

                        <Form.Group className="poll-form-row">
                            <Button variant="success" type="submit"
                                    className="create-book-form-button" disabled={this.isFormInvalid()}>Add Book</Button>
                        </Form.Group>
                    </Form>
                    <div className="label1">
                        <label>{this.state.title.errorMsg} </label> <br/>
                        <label>{this.state.authorFirstName.errorMsg} </label> <br/>
                        <label>{this.state.authorLastName.errorMsg} </label> <br/>
                        <label>{this.state.theYearOfPublishment.errorMsg} </label> <br/>
                        <label>{this.state.price.errorMsg}</label>
                    </div>
                    <Snackbar
                        style = {{width: 300, color: 'green'}}
                        open={this.state.open}  onClose={this.handleClose}
                        autoHideDuration={3000} message={this.state.message}
                    />
                </div>
            </div>
        );
    }
}
export default NewBook;
