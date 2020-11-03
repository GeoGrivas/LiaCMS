import PageRenderer from './PageRenderer';
class LayoutRenderer extends PageRenderer {
    state = {
        components:[]
    };
    layoutName = this.props.layout?this.props.layout.name:'';
    componentDidMount=()=>{
        if(this.props.layout)
        {
            this.layoutName = this.props.layout.name;
            this.loadPage(JSON.parse(this.props.layout.content));
        }
    }
    componentDidUpdate = () => {
        if (this.props.layout && (this.layoutName !== this.props.layout.name)) {
            this.layoutName = this.props.layout.name;
            this.loadPage(JSON.parse(this.props.layout.content));
            console.log('layout2');
        }
    }

}

export default LayoutRenderer;
