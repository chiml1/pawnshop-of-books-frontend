import React, {Component} from 'react';
import {createBook} from '../util/APIUtils';
import './NewBook.css';
import Button from "react-bootstrap/Button";
import {Form} from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import {
    CURRENT_YEAR,
    MAX_FIRSTNAME_LENGTH,
    MAX_LASTNAME_LENGTH,
    MAX_TITLE_LENGTH,
    MIN_FIRSTNAME_LENGTH,
    MIN_LASTNAME_LENGTH,
    MIN_TITLE_LENGTH
} from '../constants/Stuff';

class NewBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            authorFirstName: '',
            authorLastName: '',
            theYearOfPublishment: '',
            price: '',
            formErrors: {
                title: '',
                authorFirstName: '',
                authorLastName: '',
                theYearOfPublishment: '',
                price: ''
            },
            formValid: false,
            titleValid: false,
            authorFirstNameValid: false,
            authorLastNameValid: false,
            theYearOfPublishmentValid: false,
            priceValid: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(event) {
        event.preventDefault();
        const bookData = {
            title: this.state.title,
            authorFirstName: this.state.authorFirstName,
            authorLastName: this.state.authorLastName,
            theYearOfPublishment: this.state.theYearOfPublishment,
            price: this.state.price,
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

    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
            () => {
                this.validateField(name, value)
            });
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let formValid = this.state.formValid;
        let titleValid = this.state.titleValid;
        let authorFirstNameValid = this.state.authorFirstNameValid;
        let authorLastNameValid = this.state.authorLastNameValid;
        let theYearOfPublishmentValid = this.state.theYearOfPublishmentValid;
        let priceValid = this.state.priceValid;

        switch (fieldName) {
            case 'title':
                let regexTitle = /^([a-zA-Z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż]+[\s]?)+$/;
                if (!regexTitle.test(value)) {
                    formValid = false;
                    fieldValidationErrors.title = 'Incorrect title';
                } else if (value.length < MIN_TITLE_LENGTH) {
                    console.log("wartosc vaue: " + value);
                    titleValid = false;
                    fieldValidationErrors.title = `Title is too short (Minimum ${MIN_TITLE_LENGTH} characters needed.)`;
                } else if (value.length > MAX_TITLE_LENGTH) {
                    titleValid = false;
                    fieldValidationErrors.title = `Username is too long (Maximum ${MAX_TITLE_LENGTH} characters allowed.)`;
                } else {
                    titleValid = true;
                    fieldValidationErrors.title = ''
                }
                break;
            case 'authorFirstName':
                let regexFirstName = /^[a-zA-Z0-9ĆŁŃŚŹŻąćęłńóśźż]+$/;
                if (!regexFirstName.test(value)) {
                    authorFirstNameValid = false;
                    fieldValidationErrors.authorFirstName = `Incorrect first name`;
                } else if (value.length < MIN_FIRSTNAME_LENGTH) {
                    authorFirstNameValid = false;
                    fieldValidationErrors.authorFirstName = `First name is too short (Minimum ${MIN_FIRSTNAME_LENGTH} characters needed.)`;
                } else if (value.length > MAX_FIRSTNAME_LENGTH) {
                    authorFirstNameValid = false;
                    fieldValidationErrors.authorFirstName = `First name is too long (Maximum ${MAX_FIRSTNAME_LENGTH} characters allowed.)`;
                } else {
                    authorFirstNameValid = true;
                    fieldValidationErrors.authorFirstName = ''
                }
                break;
            case 'authorLastName':
                let regexLastName = /^[a-zA-Z0-9ĆŁŃŚŹŻąćęłńóśźż]+$/;
                if (!regexLastName.test(value)) {
                    authorLastNameValid = false;
                    fieldValidationErrors.authorLastName = `Incorrect first name`
                } else if (value.length < MIN_LASTNAME_LENGTH) {
                    authorLastNameValid = false;
                    fieldValidationErrors.authorLastName = `Last name is too short (Minimum ${MIN_LASTNAME_LENGTH} characters needed.)`
                } else if (value.length > MAX_LASTNAME_LENGTH) {
                    authorLastNameValid = false;
                    fieldValidationErrors.authorLastName = `Last name is too long (Maximum ${MAX_LASTNAME_LENGTH} characters allowed.)`
                } else {
                    authorLastNameValid = true;
                    fieldValidationErrors.authorLastName = ''
                }
                break;
            case 'theYearOfPublishment':
                if (value === '') {
                    theYearOfPublishmentValid = false;
                    fieldValidationErrors.theYearOfPublishment = 'Empty year';
                } else if (value > CURRENT_YEAR || value < 1900) {
                    theYearOfPublishmentValid = false;
                    fieldValidationErrors.theYearOfPublishment = 'Incorrect year';
                } else {
                    theYearOfPublishmentValid = true;
                    fieldValidationErrors.theYearOfPublishment = ''
                }
                break;
            case 'price':
                let regexPrice = /^[0-9]{1,3}[.]?[0-9]{1,2}$/;
                if (!regexPrice.test(value)) {
                    priceValid = false;
                    fieldValidationErrors.price = `Incorrect price! It must be .(dot) between parts`;
                }
                //to remove 00.XX to 0.XX or 000.XX to 0.XX
                else if (parseFloat(value) > 200.00 || parseFloat(value) < 0.01) {
                    priceValid = false;
                    fieldValidationErrors.price = `Price must be less than 200 and greater than 0.00`;
                } else {
                    priceValid = true;
                    fieldValidationErrors.price = ''
                }
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            titleValid: titleValid,
            authorFirstNameValid: authorFirstNameValid,
            authorLastNameValid: authorLastNameValid,
            theYearOfPublishmentValid: theYearOfPublishmentValid,
            priceValid: priceValid,
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.titleValid && this.state.authorFirstNameValid && this.state.authorLastNameValid && this.state.theYearOfPublishmentValid && this.state.priceValid});
    }

    render() {
        return (
            <div className="new-book-container">
                <br/>
                <h1>Add book</h1>
                <br/>
                <div>
                    <Form onSubmit={this.handleSubmit}>
                        <h5>Title</h5>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="title"
                                onChange={this.handleChange}
                                value={this.state.title}
                                required
                            />
                            <span style={{color: "red"}}>{this.state.formErrors["title"]}</span>
                        </Form.Group>

                        <h5>Author's first name</h5>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter author's first name"
                                name="authorFirstName"
                                onChange={this.handleChange}
                                value={this.state.authorFirstName}
                                required
                            />
                            <span style={{color: "red"}}>{this.state.formErrors["authorFirstName"]}</span>
                        </Form.Group>

                        <h5>Author's last name</h5>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter author's last name"
                                name="authorLastName"
                                onChange={this.handleChange}
                                value={this.state.authorLastName}
                                required
                            />
                            <span style={{color: "red"}}>{this.state.formErrors["authorLastName"]}</span>
                        </Form.Group>

                        <h5>The year of publishment</h5>
                        <Form.Group>
                            <Form.Control
                                type="number"
                                placeholder="Enter the year of publishment"
                                name="theYearOfPublishment"
                                onChange={this.handleChange}
                                value={this.state.theYearOfPublishment}
                                required
                            />
                            <span style={{color: "red"}}>{this.state.formErrors["theYearOfPublishment"]}</span>
                        </Form.Group>

                        <h5>Price (zł)</h5>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter price"
                                name="price"
                                onChange={this.handleChange}
                                value={this.state.price}
                                required
                            />
                            <span style={{color: "red"}}>{this.state.formErrors["price"]}</span>
                        </Form.Group>

                        <Form.Group>
                            <Button variant="success" type="submit"
                                    className="create-book-form-button" disabled={!this.state.formValid}>Add
                                Book</Button>
                        </Form.Group>
                    </Form>
                </div>
                <Snackbar
                    style={{width: 300, color: 'green'}}
                    open={this.state.open} onClose={this.handleClose}
                    autoHideDuration={3000} message={this.state.message}
                />
            </div>
        );
    }
}

export default NewBook;
