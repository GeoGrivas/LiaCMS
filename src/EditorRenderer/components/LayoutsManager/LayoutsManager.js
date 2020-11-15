import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './LayoutsManager.module.css';
import axios from 'axios';
import Button from '../../../components/UI/Button/Button';
class LayoutsManager extends Component {
    state = {
        currentPage: '',
        pages: [],
        selectedPage: ''
    }

    componentDidMount = () => {
        axios.get("https://api.adventurouscoding.com/api/management/layouts", {
            headers: {
                'Authorization': `bearer ${this.props.token}`
            }
        }).then(response => {
            const pages = response.data;
            this.setState(prevState => ({ ...prevState, pages: pages, selectedPage: pages[0], currentPage: this.props.currentPage }));
            if (Array.isArray(pages) && pages.length > 0)
                this.loadPageHandler(pages[0]);
            else
                this.props.cleanCanvas();
        });
    }
    loadPageHandler = (selectedPage) => {
        axios.get('https://api.adventurouscoding.com/api/management/layouts/' + encodeURIComponent(selectedPage), {
            headers: {
                'Authorization': `Bearer ${this.props.token}`
            }
        }).then(response => {
            const page = response.data.content;
            this.props.loadPage(JSON.parse(page));
        }).catch(err => {
            this.initEmptyPage();
            console.log("error" + err);
        });
    }
    removePageHandler = () => {
        axios.delete('https://api.adventurouscoding.com/api/management/layouts/delete/' + encodeURIComponent(this.state.selectedPage), {
            headers: {
                'Authorization': `Bearer ${this.props.token}`
            }
        });
        this.setState(prevState => {
            var idx = prevState.pages.indexOf(prevState.selectedPage);
            var currentPages = [...prevState.pages];
            currentPages.splice(idx, 1);
            return { ...prevState, pages: currentPages, selectedPage: currentPages.length > 0 ? currentPages[0] : null }
        });
    }
    savePageHandler = () => {
        axios.put('https://api.adventurouscoding.com/api/management/layouts/put', { name: this.state.currentPage, content: JSON.stringify(this.props.design) }, {
            headers: {
                'Authorization': `Bearer ${this.props.token}`
            }
        }
        ).then(response1 => {
            axios.get("https://api.adventurouscoding.com/api/management/layouts").then(response2 => {
                const pages = response2.data;
                this.setState(prevState => ({ ...prevState, pages: pages }));
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err.response.request._response);
        });
    }
    render() {
        return (<div className={classes.Container}>
            <input value={this.state.currentPage} onChange={event => { const value = event.target.value; this.setState(prevState => ({ ...prevState, currentPage: value })) }} />
            <button onClick={this.savePageHandler}>Save</button>
            <hr />
            <select value={this.state.selectedPage} onChange={event => { const value = event.target.value; this.setState(prevState => ({ ...prevState, currentPage: value, selectedPage: value })); this.loadPageHandler(value); }}>
                <option>Select a layout</option>
                {this.state.pages.map(page => <option key={page}>{page}</option>)}
            </select>
            <br />
            <Button class='danger' onClick={this.removePageHandler}>Remove</Button>

        </div>);
    }
}
const mapStateToProps = state => {
    return {
        token: state.auth.token
    };
}

export default connect(mapStateToProps, null)(LayoutsManager);