import React from 'react';
import LeanComponentRender from './LeanComponentRender';
import axios from 'axios';
import Aux from '../hoc/Auxilary';
import Spinner from '../components/UI/Spinner/Spinner';
class PageRenderer extends React.PureComponent {

  state = {
    components: []
  }
  componentDidMount = () => {
    if (this.props.page) {
      console.log('trying to load page');
      this.loadPage(this.props.page, this.props.currentPage);
      console.log('page loaded');
      console.log(this.state.components);
    }
    if (this.props.loadedLayout) {
      this.props.updateLayout(this.props.loadedLayout);
    }
  }
  componentDidUpdate = () => {
    if (this.props.currentPage && this.props.currentPage !== this.state.currentPage) {
      axios.get('https://api.adventurouscoding.com/api/pages/' + encodeURIComponent(this.props.currentPage)).then(response => {
        const page = response.data.content;
        console.log(response.data.layout);
        if (!this.props.loadedLayout)
          this.props.updateLayout(response.data.layout);
        this.loadPage(JSON.parse(page), this.props.currentPage);
      }).catch(err => {
        console.log("error" + err);
      });
    }
  }
  loadPage = (design, currentPage = '') => {
    this.setState(prevState => ({ ...prevState, components: design, currentPage: currentPage }));
  }


  render() {
    let renderedComponents = <Spinner />;
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
