import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class RegisteredUsers extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            totalUsers: 0,
            numberPage: 0,
            currentPage: 1,
            search: ''
        }

        this.handlePaginate = this.handlePaginate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
    }

    componentDidMount () {
        axios.get(`/api/registered-users/${1}`).then(response => {
            this.setState({
                users: response.data.data,
                totalUsers: response.data.total,
                numberPage: response.data.last_page
            })
        });
    }

    handleSearch() {
        if (this.state.search === '') {
            axios.get(`/api/registered-users/${1}`).then(response => {
                this.setState({
                    users: response.data.data,
                    totalUsers: response.data.total,
                    numberPage: response.data.last_page
                })
            });
        } else {
            axios.get(`/api/search-users/${this.state.search}`).then(response => {
                this.setState({
                    users: response.data.data,
                    totalUsers: response.data.total,
                    numberPage: response.data.last_page
                })
            });
        }
    }

    handleFieldChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handlePaginate(event) {
        var page = event.target.innerText;
        if (page == 'next')
            page = this.state.currentPage + 1;
        else if (page == 'prev')
            page = this.state.currentPage - 1;
            
        if (page > 0 && page <= this.state.numberPage) {
            axios.get(`/api/registered-users/${page}`).then(response => {
                this.setState({
                    users: response.data.data
                })
            });
            this.setState({
                currentPage: page
            });
            
            $('li.active').removeClass();
            $('li#'+page).addClass('active');
        }
    }

    render() {
        const { users } = this.state;
        var pagination = [];

        pagination.push(<li key="left"><a href="#!" onClick={this.handlePaginate}>prev</a></li>);
        for (var i = 1; i <= this.state.numberPage; i++) {
            if (i == 1)
                pagination.push(<li className="active" id={i} key={i} onClick={this.handlePaginate}><a href="#!">{i}</a></li>);
            else 
                pagination.push(<li id={i} key={i} onClick={this.handlePaginate}><a href="#!">{i}</a></li>);
        }
        pagination.push(<li key="right"><a href="#!" onClick={this.handlePaginate}>next</a></li>);

        return (
            <div>
                <div className='row valign-wrapper sub-navigation'>
                    <h6 className='header-text-margin hide-on-small-only'>List of registered users</h6>
                    <div className='landing-page-div-buttons'>
                        <Link className="waves-effect waves-light btn landing-page-buttons" to='/login'>login</Link>
                        <Link className="waves-effect waves-light btn landing-page-buttons" to='/register'>register</Link>
                    </div>
                </div>
                <hr className="row margin-zero"></hr>
                <div className="landing-page-table">
                    <div className="row" style={{alignItems: 'center', justifyContent: 'flex-end'}}>
                        <input placeholder="Name" id="search" name="search" type="text" className="validate" style={{width: '250px'}} value={this.state.search} onChange={this.handleFieldChange}/>
                        <button className="waves-effect waves-dark btn white" type="submit" onClick={this.handleSearch}>&#128270;</button>
                    </div>
                    <table className="highlight responsive-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={ user.id }>
                                    <td>
                                        { user.name }
                                    </td>
                                    <td>
                                        { user.email }
                                    </td>
                                    <td>
                                        { user.gender }
                                    </td>
                                    <td>
                                        { user.description }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ul className="pagination" style={{marginTop: '10px', justifyContent: 'center'}}>
                        {pagination}
                    </ul>
                </div>
            </div>
        );
    }
}

export default RegisteredUsers;