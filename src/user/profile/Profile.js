import React, { Component } from 'react';
import { getUserProfile } from '../../util/APIUtils';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {Tabs, Tab} from 'react-bootstrap'
import MyBooks from "../../book/MyBooks";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        };
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
        .then(response => {
            this.setState({
                user: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }
      
    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }        
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        return (
            <div className="profile">
                { 
                    this.state.user ? (
                        <div className="user-profile">

                            <div className="user-poll-details">
                                <Tabs defaultActiveKey="added">
                                    <Tab eventKey="bought" title="Bought">
                                        <MyBooks username={this.props.match.params.username} type="added"/>
                                    </Tab>
                                    <Tab eventKey="added" title="Added">
                                        <MyBooks username={this.props.match.params.username} type="bought"/>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>  
                    ): null
                }
            </div>
        );
    }
}

export default Profile;
