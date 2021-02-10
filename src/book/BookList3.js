import React from "react";
import {buyBooks, getAllBooks} from "../util/APIUtils";
import {withRouter} from 'react-router-dom';
import './BookList.css';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import {Button, Modal} from "react-bootstrap";
import Snackbar from "@material-ui/core/Snackbar";
import {ACCESS_TOKEN, API_BASE_URL} from "../constants/Stuff";

class BookList3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            isLoading: true,
            openSnackbar: false,
            message: '',
            showModal: false,
            link: {}
        };

        this.loadAllBooks = this.loadAllBooks.bind(this);
        this.buy = this.buy.bind(this);
        this.updateBook = this.updateBook.bind(this);
        this.onDelClick = this.onDelClick.bind(this);

    }

    componentDidMount() {
        this.loadAllBooks();
    }

    loadAllBooks = () => {
        let promise;
        promise = getAllBooks();

        this.setState({
            isLoading: true
        });

        promise
            .then(responseData => {
                this.setState({books: responseData._embedded.bookList});
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    };

    buy(book, id) {
        buyBooks(id, book, this.props.currentUser.id)
            .then(res => {
                    this.setState({openSnackbar: true, message: 'A book was bought'});
                    this.loadAllBooks();
                }
            )
            .catch(err =>
                this.setState({openSnackbar: true, message: err.message}));
        this.props.history.push("/books");
    }

    updateBook(id, bookData) {
        let myHeaders = new Headers();
        let url = API_BASE_URL + "/books/" + id;
        if (localStorage.getItem(ACCESS_TOKEN)) {
            myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
        }
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Accept', 'application/json')
        let myInit = {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(bookData)
        };
        let myRequest = new Request(url, myInit);
        fetch(myRequest)
            .then(function (response) {
                return response.text();
            })
            .then(text => {
                this.setState({openSnackbar: true, message: text});
                this.componentDidMount();
            })
    }

    confirmDelete = (linki) => {
        this.setState({showModal: true, link: linki}
        );
    };

    onDelClick() {
        let myHeaders = new Headers();
        let url = API_BASE_URL + "/books/" + this.state.link;
        if (localStorage.getItem(ACCESS_TOKEN)) {
            myHeaders.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
        }
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Accept', 'application/json');
        let myInit = {
            method: "DELETE",
            headers: myHeaders
        };
        let myRequest = new Request(url, myInit);
        fetch(myRequest)
            .then(function (response) {
                return response.text();
            })
            .then(text => {
                this.setState({openSnackbar: true, message: text});
                this.componentDidMount();
            })
    }


    renderEditable = (cellInfo) => {
        return (
            <div
                style={{backgroundColor: "#fafafa"}}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.books];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({books: data});
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.books[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    };

    handleClose = (event, reason) => {
        this.setState({openSnackbar: false});
    };


    render() {

        const columns = [{
            Header: 'Title',
            accessor: 'title',
            Cell: this.renderEditable
        }, {
            Header: 'Author\'s first name',
            accessor: 'authorFirstName',
            Cell: this.renderEditable
        }, {
            Header: 'Author\'s last name',
            accessor: 'authorLastName',
            Cell: this.renderEditable
        }, {
            Header: 'The year of publishment',
            accessor: 'theYearOfPublishment',
            Cell: this.renderEditable
        }, {
            Header: 'Price (zł)',
            accessor: 'price',
            Cell: this.renderEditable
        }, {
            id: 'editbutton',
            sortable: false,
            filterable: false,
            width: 100,
            accessor: 'id',
            Cell: ({row, value}) => (<Button variant="light" onClick={() => {
                this.updateBook(value, row)
            }}>Edit</Button>)
        }, {
            id: 'delbutton',
            sortable: false,
            filterable: false,
            width: 100,
            accessor: 'id',
            Cell: ({value}) => (<Button variant="danger" onClick={() => {
                this.confirmDelete(value)
            }}>Delete</Button>)
        }, {
            id: 'buybutton',
            sortable: false,
            filterable: false,
            width: 100,
            accessor: 'id',
            Cell: ({row, value}) => (<Button variant="success" onClick={() => {
                this.buy(row, value)
            }}>Buy</Button>)
        }
        ];
        return (
            <div className="bookList">
                <ReactTable
                    data={this.state.books}
                    columns={columns}
                    filterable={true}
                    defaultPageSize={10}
                />
                <div>
                    <Modal show={this.state.showModal} onHide={!this.state.showModal} animation={false}>
                        <Modal.Body>Are you sure to delete?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => {
                                this.onDelClick();
                                this.setState({showModal: false})
                            }}>
                                Yes
                            </Button>
                            <Button variant="primary" onClick={() => {
                                this.setState({showModal: false})
                            }}>
                                No
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <Snackbar
                    style={{width: 300, color: 'green'}}
                    open={this.state.openSnackbar} onClose={this.handleClose}
                    autoHideDuration={1500} message={this.state.message}
                />
            </div>
        );
    }
}

export default withRouter(BookList3);
