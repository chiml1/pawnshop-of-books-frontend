import React from 'react';
import {Route, withRouter, Switch} from 'react-router-dom';
import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants/Stuff';
import NewBook from '../book/NewBook';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';
import BookList from '../book/BookList3';
import Header from '../common/Header';
import {Container, Row}  from "react-bootstrap";

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });
        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
    }

    componentDidMount() {
        this.loadCurrentUser();
    }

    handleLogout(redirectTo="/") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);
    }

    handleLogin() {
        this.loadCurrentUser();
        this.props.history.push("/books");
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />
        }
        return(
            <Container>
                <Row>
                        <Header isAuthenticated={this.state.isAuthenticated}
                                    currentUser={this.state.currentUser}
                                    onLogout={this.handleLogout} />
                </Row>
                    <Switch>
                        <Route path="/login"
                           render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                        <Route path="/signup" component={Signup}></Route>
                        <Route path="/user/profile/:username"
                               render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                        </Route>
                        <PrivateRoute authenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} path="/book/new" component={NewBook} handleLogout={this.handleLogout}></PrivateRoute>
                        <PrivateRoute authenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} path="/books" component={BookList} handleLogout={this.handleLogout}></PrivateRoute>
                        {/*<Route path="/edit"*/}
                        {/*       render={(props) => <EditBook onLogin={this.handleLogin} {...props} />}></Route>*/}
                    </Switch>


            </Container>
        );
    }
}
export default withRouter(App);
