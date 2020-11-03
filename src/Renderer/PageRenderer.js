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
  componentDidMount=()=>{
    console.log('page 1')
  }
  componentDidUpdate = () => {
    console.log('page 2');
    if (this.props.currentPage && this.props.currentPage !== this.state.currentPage) {
      axios.get('https://api.adventurouscoding.com/api/pages/' + encodeURIComponent(this.props.currentPage)).then(response => {
        const page = response.data.content;
        console.log(response.data.layout);
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
