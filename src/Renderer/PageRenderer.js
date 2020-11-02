import React from 'react';
import LeanComponentRender from './LeanComponentRender';
import axios from 'axios';
import Aux from '../hoc/Auxilary';
class PageRenderer extends React.PureComponent {

  state = {
    components: this.props.page ? JSON.parse(this.props.page) : []
  }
  componentDidMount = () => {

    if (this.props.loadedLayout) {
      this.props.updateLayout(this.props.loadedLayout);
    }
    if (this.props.currentPage && !this.state.components.length > 0) {
      axios.get('https://api.adventurouscoding.com/api/pages/' + encodeURIComponent(this.props.currentPage)).then(response => {
        const page = response.data.content;
        console.log(response.data.layout);
        if (!this.props.loadedLayout)
          this.props.updateLayout(response.data.layout);
        this.loadPage(JSON.parse(page));
      }).catch(err => {
        console.log("error" + err);
      });
    }
  }
  componentDidUpdate = () => {
    if (this.props.loadedLayout) {
      this.props.updateLayout(this.props.loadedLayout);
    }
  }

  loadPage = (design) => {
    this.setState(prevState => ({ ...prevState, components: design }));
  }


  render() {
    let renderedComponents = this.state.components.map(block => {
      return <LeanComponentRender key={block.id + 's'} block={block} />;
    });
    return (
      <Aux>
        {renderedComponents}
      </Aux>

    );
  }

}

export default PageRenderer;
