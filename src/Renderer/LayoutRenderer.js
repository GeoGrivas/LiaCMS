import PageRenderer from './PageRenderer';
class LayoutRenderer extends PageRenderer {
    state = {
        components: []
    };
    layoutName = '';
    shouldUpdate = true;
    componentDidUpdate = () => {
        if (this.props.layout && (this.layoutName !== this.props.layout.name)) {
            this.layoutName = this.props.layout.name;
            this.loadPage(JSON.parse(this.props.layout.content));
            this.shouldUpdate = true;
        }
    }
    
}

export default LayoutRenderer;
