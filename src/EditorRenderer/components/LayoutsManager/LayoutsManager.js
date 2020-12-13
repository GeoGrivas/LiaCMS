import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './LayoutsManager.module.css';
import axios from '../../../Helpers/axiosInstance';
import Button from '../../../components/UI/Button/Button';
import * as requests from '../../Requests';

class LayoutsManager extends Component {
    state = {
        currentPage: '',
        pages: [],
        selectedPage: ''
    }

    componentDidMount = () => {
        axios.get(requests.getLayouts())
        .then(response => {
            const pages = response.data;
            this.setState(prevState => ({ ...prevState, pages: pages, selectedPage: this.props.currentLayout, currentPage: this.props.currentLayout }));
            if (Array.isArray(pages) && pages.length > 0)
                this.loadPageHandler(this.props.currentLayout);
            else
                this.props.initEmptyPage();
        }).catch(err=>{
            this.props.initEmptyPage();
        });
    }
    loadPageHandler = (selectedPage) => {
        this.props.loadLayout(selectedPage);
      
    }
    removePageHandler = () => {
        axios.delete(requests.deleteLayout(this.state.selectedPage));
        this.setState(prevState => {
            var idx = prevState.pages.indexOf(prevState.selectedPage);
            var currentPages = [...prevState.pages];
            currentPages.splice(idx, 1);
            return { ...prevState, pages: currentPages, selectedPage: currentPages.length > 0 ? currentPages[0] : null }
        });
    }
    savePageHandler = () => {
        axios.put(requests.putLayout(), { name: this.state.currentPage, content: JSON.stringify(this.props.design) })
        .then(response1 => {
            axios.get(requests.getLayouts())
            .then(response2 => {
                const pages = response2.data;
                this.setState(prevState => ({ ...prevState, pages: pages }));
            }).catch(err => {
            });
        }).catch(err => {
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