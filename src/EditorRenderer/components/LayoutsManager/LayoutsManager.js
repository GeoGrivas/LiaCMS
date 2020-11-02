import React, { Component } from 'react';
import {connect} from 'react-redux';
import classes from './LayoutsManager.module.css';
import axios from 'axios';
class LayoutsManager extends Component {
    state = {
        currentPage: '',
        pages: [],
        selectedPage: ''
    }

    componentDidMount = () => {
        axios.get("https://api.adventurouscoding.com/api/layouts",{
            headers: {
            'Authorization': `bearer ${this.props.token}` 
          }}).then(response => {
            const pages = response.data;
            console.log(response.data);
            this.setState(prevState => ({ ...prevState, pages: pages, selectedPage: '', currentPage: this.props.currentPage }));
            this.props.cleanCanvas();
        });
    }
    loadPageHandler = () => {
        axios.get('https://api.adventurouscoding.com/api/layouts/' + encodeURIComponent(this.state.selectedPage),{
            headers: {
            'Authorization': `Bearer ${this.props.token}` 
          }}).then(response => {
              console.log(response);
            const page = response.data.content;
            this.props.loadPage(JSON.parse(page));
        }).catch(err => {
            this.initEmptyPage();
            console.log("error" + err);
        });
    }
    removePageHandler = () => {
        axios.delete('https://api.adventurouscoding.com/api/layouts/delete/' + encodeURIComponent(this.state.selectedPage),{
            headers: {
            'Authorization': `Bearer ${this.props.token}` 
          }});
        this.setState(prevState => {
            var idx = prevState.pages.indexOf(prevState.selectedPage);
            var currentPages = [...prevState.pages];
            currentPages.splice(idx, 1);
            return { ...prevState, pages: currentPages, selectedPage: currentPages.length > 0 ? currentPages[0] : null }
        });
    }
    savePageHandler = () => {
        axios.put('https://api.adventurouscoding.com/api/layouts/put', {name:this.state.currentPage, content: JSON.stringify(this.props.design) },{
            headers: {
            'Authorization': `Bearer ${this.props.token}` 
          }}
        ).then(response1 => {
            axios.get("https://api.adventurouscoding.com/api/layouts").then(response2 => {
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
            <select onChange={event => { const value = event.target.value;console.log(event.target); this.setState(prevState => ({ ...prevState, currentPage: value, selectedPage: value })); }}>
                <option>Select a layout</option>
                {this.state.pages.map(page => <option key={page}>{page}</option>)}
            </select>
            <br />
            <button onClick={this.removePageHandler}>Remove</button>
            <button onClick={this.loadPageHandler}>Load</button>

        </div>);
    }
}
const mapStateToProps = state => {
    return {
        token: state.auth.token
    };
}

export default connect(mapStateToProps, null)(LayoutsManager);