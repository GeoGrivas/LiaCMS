import React,{Component} from 'react';
import Toolbar from './Toolbar/Toolbar';
import Sidedrawer from './Sidedrawer/Sidedrawer';
class ResponsiveNavigation extends Component
{
    state={
        showSidedrawer:false
    }
    sideDrawerClosedHandler=()=>{
        this.setState({showSidedrawer:false});
    };
    toggleSidedrawerHandler=()=>{
        this.setState((prevState)=>{return {showSidedrawer:!prevState.showSidedrawer}});
    }
    render(){
    return <div>
        <Toolbar backgroundColor={this.props.block.params.backgroundColor?.value} logo={this.props.block.params?.logo.value} navItems={this.props.children} isAuth={this.props.isAuthenticated} toggleSidedrawer={this.toggleSidedrawerHandler}/>
        <Sidedrawer backgroundColor={this.props.block.params.backgroundColor?.value} logo={this.props.block.params?.logo.value} navItems={this.props.children} isAuth={this.props.isAuthenticated} open={this.state.showSidedrawer} close={this.sideDrawerClosedHandler}></Sidedrawer>
    </div>
    };
}


export default ResponsiveNavigation;