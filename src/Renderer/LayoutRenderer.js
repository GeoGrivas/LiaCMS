import PageRenderer from './PageRenderer';
class LayoutRenderer extends PageRenderer {
    state = {
        components: this.props.layout?JSON.parse(this.props.layout.content):[]
    };
    layoutName = this.props.layout?this.props.layout.name:'';
    componentDidMount = () => {
    }
    componentDidUpdate = () => {
        if (this.props.layout && (this.layoutName !== this.props.layout.name)) {
            this.layoutName = this.props.layout.name;
            this.loadPage(JSON.parse(this.props.layout.content));
        }
    }

}

export default LayoutRenderer;
