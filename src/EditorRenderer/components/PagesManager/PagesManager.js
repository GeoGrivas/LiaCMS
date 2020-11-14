import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './PagesManager.module.css';
import axios from 'axios';
class PagesManager extends Component {
    state = {
        currentPage: '',
        pages: [],
        selectedPage: '',
        layouts: [],
        currentLayout: '',
        selectedLayout: '',
        enabled:false
    }

    componentDidMount = () => {
        axios.get("https://api.adventurouscoding.com/api/management/pages", {
            headers: {
                'Authorization': `bearer ${this.props.token}`
            }
        }).then(response => {
            const pages = response.data.map(page => (decodeURIComponent(page)));
            axios.get("https://api.adventurouscoding.com/api/management/layouts", {
                headers: {
                    'Authorization': `bearer ${this.props.token}`
                }
            }).then(response => {
                const layouts = response.data;
                this.setState(prevState => ({enabled:this.props.enabled,pages: pages, selectedPage: this.props.currentPage, currentPage: this.props.currentPage, layouts: layouts, selectedLayout: this.props.selectedLayout }));
            });
        });
    }
    loadPageHandler = () => {
        axios.get('https://api.adventurouscoding.com/api/management/pages/' + encodeURIComponent(this.state.selectedPage), {
            headers: {
                'Authorization': `Bearer ${this.props.token}`
            }
        }).then(response => {
            const page = response.data.content;
            const layout = response.data.layout.content;
            const layoutName=response.data.layoutName;
            this.props.loadPage(JSON.parse(page),{title:response.data.title,image:response.data.image,type:response.data.type,description:response.data.description});
            this.setState(prevState => ({ ...prevState, currentLayout: layoutName, selectedLayout: layoutName }));
            this.props.drawLayout(layout);
        }).catch(err => {
            this.initEmptyPage();
            console.log("error" + err);
        });
    }
    removePageHandler = () => {
        axios.delete('https://api.adventurouscoding.com/api/management/pages/delete/' + encodeURIComponent(this.state.selectedPage), {
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
        axios.put('https://api.adventurouscoding.com/api/management/pages/put', { 
            path: encodeURIComponent(this.state.currentPage),
             content: JSON.stringify(this.props.design),
              layoutName: this.state.selectedLayout, 
            title:this.props.title,
            description:this.props.description,
            type:this.props.type,
            image:this.props.image,
            enabled:this.state.enabled
            }, {
            headers: {
                'Authorization': `Bearer ${this.props.token}`
            }
        }
        ).then(response1 => {
            axios.get("https://api.adventurouscoding.com/api/management/pages").then(response2 => {
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
    onSelectPage=(event)=>{
       const value = event.target.value; 
       this.setState(prevState => ({ ...prevState, currentPage: value, selectedPage: value }));
       setTimeout(this.loadPageHandler,150);
    }
    render() {
        return (<div className={classes.Container}>
            <input type='checkbox' onChange={event=>{const value = event.target.checked; this.setState(prevState=>({...prevState,enabled:value}))}}/>
            <input value={this.state.currentPage} onChange={event => { const value = event.target.value; this.setState(prevState => ({ ...prevState, currentPage: value })) }} />
            <button onClick={this.savePageHandler}>Save</button>
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
            <button onClick={this.removePageHandler}>Remove</button>

        </div>);
    }
}
const mapStateToProps = state => {
    return {
        token: state.auth.token
    };
}

export default connect(mapStateToProps, null)(PagesManager);