import React from "react";
import { withRouter } from 'react-router-dom';
import {getBoughtBooks, getAddedBooks} from "../util/APIUtils";
import Table from 'react-bootstrap/Table'

class MyBooks extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            books : [],
            isLoading: true,
            open: false,
            message: ''
        };
        this.loadProfile = this.loadProfile.bind(this);
    }

    componentDidMount(){
        this.loadProfile();
    }

    loadProfile(){
        let promise;
        if(this.props.type === 'added') {
            promise = getAddedBooks(this.props.username);
        } else if (this.props.type === 'bought') {
            promise = getBoughtBooks(this.props.username);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(responseData => {
                this.setState({books: responseData});
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    }


    render() {

        return (
            <Table bordered>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Price</th>
                    <th>The year of publishment</th>
                </tr>
                </thead>
                <tbody>
                {this.state.books.map((rowData, index) => (
                    <tr>
                        <th scope="row">{index + 1}</th>
                        <th>{rowData.title}</th>
                        <th>{rowData.authorFirstName}</th>
                        <th>{rowData.authorLastName}</th>
                        <th>{rowData.price}</th>
                        <th>{rowData.theYearOfPublishment}</th>
                    </tr>

                ))}

                </tbody>
            </Table>
        )
    }
}

export default withRouter(MyBooks);
