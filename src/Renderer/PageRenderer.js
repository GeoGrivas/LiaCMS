import React from 'react';
import LeanComponentRender from './LeanComponentRender';
import axios from 'axios';
import Aux from '../hoc/Auxilary';
import Spinner from '../components/UI/Spinner/Spinner';
class PageRenderer extends React.Component {

  state = {
    components:this.props.page,
    layout:this.props.layout
  }
  currentPage=this.props.currentPage;

  componentDidUpdate = () => {
    console.log('page 2');
    if (this.currentPage && this.props.currentPage !== this.currentPage) {
      axios.get('https://api.adventurouscoding.com/api/pages/' + encodeURIComponent(this.props.currentPage)).then(response => {
        const page = response.data.content;
        this.currentPage=this.props.currentPage;
        console.log(response.data.layout);
        //this.props.updateLayout(response.data.layout);
        this.loadPage(JSON.parse(page), this.props.currentPage,response.data.layout);
      }).catch(err => {
        console.log("error" + err);
      });
    }
  }
  loadPage = (design, currentPage = '',layout) => {
    this.setState(prevState => ({ ...prevState, components: design, currentPage: currentPage,layout:JSON.parse(layout.content) }));
  }
  render() {
    console.log(this.state);
    let renderedComponents = <Spinner />;
    if (this.props.currentPage === this.currentPage) {
      renderedComponents = this.state.components.map(block => {
        return <LeanComponentRender key={block.id + 's'} block={block} />;
      });
    }
    let layout=null;
    layout= this.state.layout.map(block => {
      return <LeanComponentRender key={block.id + 's'} block={block} />;
    });
    return (
      <Aux>
        {layout}
        {renderedComponents}
      </Aux>

    );
  }

}

export default PageRenderer;
