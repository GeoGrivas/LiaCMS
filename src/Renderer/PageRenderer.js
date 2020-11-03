import React from 'react';
import LeanComponentRender from './LeanComponentRender';
import axios from 'axios';
import Aux from '../hoc/Auxilary';
import Spinner from '../components/UI/Spinner/Spinner';
class PageRenderer extends React.PureComponent {

  state = {
    components: this.props.page?this.props.page:[],
    currentPage:this.props.currentPage
  }

  loadPage = (design, currentPage = '') => {
    this.setState(prevState => ({ ...prevState, components: design, currentPage: currentPage }));
  }
  render() {
    let renderedComponents = null;
    if (this.props.currentPage === this.state.currentPage || this.layoutName) {
      renderedComponents = this.state.components.map(block => {
        return <LeanComponentRender key={block.id + 's'} block={block} />;
      });
    }
    return (
      <Aux>
        {renderedComponents}
      </Aux>

    );
  }

}

export default PageRenderer;
