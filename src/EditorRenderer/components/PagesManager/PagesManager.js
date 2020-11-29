import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './PagesManager.module.css';
import axios from 'axios';
import Button from '../../../components/UI/Button/Button';
import * as requests from '../../Requests';
import Page from '../../Page';
class PagesManager extends Component {
    state = {
        currentPage: '',
        pages: [],
        selectedPage: '',
        layouts: [],
        currentLayout: this.props.page.layoutName,
        selectedLayout: '',
        enabled: this.props.enabled
    }

    componentDidMount = () => {
        axios.get(requests.getPages())
            .then(response => {
                const pages = response.data.map(page => (decodeURIComponent(page)));
                axios.get(requests.getLayouts())
                    .then(response => {
                        const layouts = response.data;
                        this.setState(prevState => ({ currentLayout: this.props.layoutName, enabled: this.props.enabled, pages: pages, selectedPage: this.props.currentPage, currentPage: this.props.currentPage, layouts: layouts, selectedLayout: this.props.page.layoutName }));
                        console.log(this.props);
                        if (this.props.shouldLoadPage) {
                            this.loadPageHandler(this.props.currentPage);
                        }
                    });
            }).catch(err => {
                console.log(err);
            });
    }
    loadPageHandler = (selectedPage) => {
        axios.get(requests.getPage(selectedPage))
            .then(response => {
                this.props.loadPage(new Page(response.data));
                this.setState(prevState => ({ ...prevState, currentLayout: response.data.layoutName, selectedLayout: response.data.layoutName, enabled: response.data.enabled }));
            }).catch(err => {
                this.props.initEmptyPage();
                console.log("error" + err);
            });
    }
    removePageHandler = () => {
        axios.delete(requests.deletePage(this.state.selectedPage));
        this.setState(prevState => {
            var idx = prevState.pages.indexOf(prevState.selectedPage);
            var currentPages = [...prevState.pages];
            currentPages.splice(idx, 1);
            return { ...prevState, pages: currentPages, selectedPage: currentPages.length > 0 ? currentPages[0] : null }
        });
    }
    savePageHandler = () => {
        var page = this.props.page;
        console.log(page);
        axios.put(requests.putPage(), {
            path: encodeURIComponent(this.state.currentPage),
            enabled : this.state.enabled,
            title :page.title,
            description : page.description,
            type : page.type,
            image : page.image,
            content :JSON.stringify(page.content),
            layoutName : page.layoutName
        })
            .then(response1 => {
                axios.get(requests.getPages())
                    .then(response2 => {
                        const pages = response2.data.map(page => (decodeURIComponent(page)));
                        this.setState(prevState => ({ ...prevState, pages: pages }));
                    }).catch(err => {
                        console.log(err);
                    });
            }).catch(err => {
                console.log(err);
            });
    }
    onSelectLayout = (event) => {
        const value = event.target.value;
        this.setState(prevState => ({ ...prevState, currentLayout: value, selectedLayout: value }));
        this.props.loadLayout(value);
    }
    onSelectPage = (event) => {
        const value = event.target.value;
        this.setState(prevState => ({ ...prevState, currentPage: value, selectedPage: value }));
        this.loadPageHandler(value);
    }
    render() {
        return (<div className={classes.Container}>
            <div>
                <label htmlFor='checkbox_visible'>Enabled</label>
                <input id='checkbox_visible' type='checkbox' checked={this.state.enabled?this.state.enabled:false} onChange={event => { const value = event.target.checked; this.setState(prevState => ({ ...prevState, enabled: value })) }} />
            </div>
            <div>
                <label htmlFor='page_path'>Page Path</label>
                <input id='page_path' value={this.state.currentPage} onChange={event => { const value = event.target.value; this.setState(prevState => ({ ...prevState, currentPage: value })) }} />
            </div>
            <Button class='primary' onClick={this.savePageHandler}>Save</Button>
            <hr />
            <label className={classes.Label}>Layouts</label>
            <select onChange={this.onSelectLayout} value={this.state.selectedLayout}>
                <option>Select a layout</option>
                {this.state.layouts.map(layout => <option key={layout}>{layout}</option>)}
            </select>
            <label className={classes.Label}>Pages</label>
            <select onChange={this.onSelectPage} value={this.state.selectedPage}>
                <option>Select a page</option>
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

export default connect(mapStateToProps, null)(PagesManager);