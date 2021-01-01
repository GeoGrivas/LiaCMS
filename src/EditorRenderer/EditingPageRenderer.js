import React, { Component } from 'react';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import SidebarItem from './components/Layout/Sidebar/SidebarItem/SidebarItem';
import { connect } from 'react-redux';
import * as actions from '../components/Authentication/store/actions/index';
import PagesManager from './components/PagesManager/PagesManager';
import axios from '../Helpers/axiosInstance';
import LayoutsManager from './components/LayoutsManager/LayoutsManager';
import EditorLogin from './components/EditorLogin/EditorLogin';
import SeoEditor from './components/SeoEditor/SeoEditor';
import { toggleBordersOfComponents, DraggingStarted, removeComponent, saveComponentEdit } from './Logic/EditingLogic';
import ComponentsSideItem from './components/ComponentsSideItem/ComponentsSideItem';
import RenderedComponents from './RenderedComponents';
import Redeploy from './components/Redeploy/Redeploy';
import Button from '../components/UI/Button/Button';
import TemplatingTool from './components/TemplatingTool/TemplatingTool';
import * as requests from './Requests';
import Page from './Page';
import cloneDeep from 'lodash.clonedeep';
import PageLoading from '../components/UI/PageLoading/PageLoading';
import withErrorHandler from '../hoc/withErrorHandler/withErrorHandler';
class PageRenderer extends Component {

  state = {
    page: new Page(),
    mode: 'building',
    loading: true
  }
  showSeoModal = false;
  draggingComponent = null;
  eventsEnabled = true;
  dragging = false;
  switchEditingMode = () => {
    this.setState((prevState) => ({ layoutEditing: !prevState.layoutEditing }));
  }
  toggleSeoModal = () => {
    this.setState((prevState) => ({ showSeoModal: !prevState.showSeoModal }));
  }
  componentDidMount = () => {
    axios.interceptors.request.use(function (config) {
      const token = localStorage.getItem('token');
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
    if (this.props.isAuthenticated) {
      this.setState(prevState => ({ ...prevState, loading: false }));

    } else {
      this.props.onTryAutoSignup();
      this.setState(prevState => ({ ...prevState, loading: false }));
    }
  }
  initEmptyPage = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        page: new Page()
      }
    });
  }

  cleanCanvas = () => {
    this.setState(prevState => {
      return {
        ...prevState, components: [],
        layoutComponents: []
      }
    });
  }


  onSaveSeo = (properties) => {
    let page = cloneDeep(this.state.page);
    page = { ...page, ...properties };
    this.setState((prevState) => ({ ...prevState, page: page }));
  }

  onDragOver = (event, component) => {
    event.preventDefault();
    event.stopPropagation();
     const isShiftPressed = event.shiftKey;
      toggleBordersOfComponents(this.dragging);
      if (this.state.layoutEditing) {
        const result = DraggingStarted(this.draggingComponent, component, this.state.page.layout.content, isShiftPressed);
        if (result !== null) {
          let tempPage = cloneDeep(this.state.page);
          tempPage.layout.content = result;
          this.setState((prevState) => ({ page: tempPage }));
        }
      } else {
        const result = DraggingStarted(this.draggingComponent, component, this.state.page.content, isShiftPressed);
        if (result !== null) {
          this.setState((prevState) => ({ page: { ...prevState.page, content: result } }));
        }
      }


  }
  setCorrectDragImage = (event,elementId) => {
    const parent = document.getElementById(elementId);
    if(parent)
    {
      const elem = parent.childNodes[parent.childNodes.length - 1];
      event.dataTransfer.setDragImage(elem, 0, 0);
      event.target.style.height = elem.offsetHeight + 'px';
      event.target.style.width = elem.offsetWidth + 'px';
    }
  }
  onDragHandler = (event, component) => {
    this.dragging = true;
    toggleBordersOfComponents(this.dragging);
    this.setCorrectDragImage(event,component.id);
    this.draggingComponent = component;
    if (!this.draggingComponent.id)
      this.draggingComponent.id = this.idGenerator(this.draggingComponent.component);
  };
  draggingEndedHandler = (event) => {
    this.dragging = false;
    toggleBordersOfComponents(this.dragging);
  }

  onEditSavedHandler = (event, component) => {
    event.preventDefault();
    toggleBordersOfComponents(this.dragging);
    let page = cloneDeep(this.state.page);
    if (this.state.layoutEditing) {
      const newComponents = saveComponentEdit(this.state.page.layout.content, component, event.target.elements);
      page.layout.content = newComponents;
    } else {
      const newComponents = saveComponentEdit(this.state.page.content, component, event.target.elements);
      page.content = newComponents;
    }
    this.setState({ page: page });
    event.target.focus();
  }
  setComponents = (components) => {
    let page = cloneDeep(this.state.page);
    page.content = components;
    this.setState({ page: page });
  }
  onRemoveClickedHandler = (component) => {
    let page = cloneDeep(this.state.page);
    if (this.state.layoutEditing) {
      const newComponents = removeComponent(component, this.state.page.layout.content);
      page.layout.content = newComponents;
    } else {
      const newComponents = removeComponent(component, this.state.page.content);
      page.content = newComponents;
    }
    this.setState({ page: page });
  }
  idGenerator = (componentName) => {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (componentName + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  };
  loadPage = (page) => {
    this.setState(prevState => ({ ...prevState, page: page }));
  }
  loadLayout = (layoutName) => {
    axios.get(requests.getLayout(layoutName))
      .then(response => {
        const layout = response.data.content;
        if (layout) {
          let page = cloneDeep(this.state.page);
          page.layoutName = layoutName;
          page.layout.name = response.data.name;
          page.layout.content = JSON.parse(response.data.content);
          this.setState(prevState => ({ page: page }));
        }
      }).catch(err => {
      });
  }


  methods = {
    onRemove: this.onRemoveClickedHandler,
    onDragStart: this.onDragHandler,
    onDragOver: this.onDragOver,
    onEdit: this.onEditSavedHandler,
    onDraggingEnded: this.draggingEndedHandler
  }
  render() {
    if (this.state.loading) {
      return <PageLoading />
    }
    if (!this.props.isAuthenticated) {
      return <EditorLogin />
    }
    let sidebarContent = null;
    if (this.state.mode === 'building') {
      sidebarContent = <React.Fragment>
        <Redeploy /><Button class='primary' onClick={() => { this.setState(prevState => ({ ...prevState, mode: 'template-mapping' })) }}>Templating</Button>
        <h4>
          Components
        </h4>
        <SidebarItem scrollable>
          <ComponentsSideItem
            draggingEndedHandler={this.draggingEndedHandler}
            onDragHandler={this.onDragHandler}
            layoutEditing={this.state.layoutEditing}
          />
        </SidebarItem>
        <SidebarItem>
          <Button class='warning' onClick={this.switchEditingMode}>Switch editing mode</Button>
          <Button class='primary' onClick={this.toggleSeoModal}>Edit SEO properties</Button>
        </SidebarItem>
        <SidebarItem>
          {this.state.layoutEditing
            ? <LayoutsManager
              initEmptyPage={this.initEmptyPage}
              currentLayout={this.state.selectedLayout}
              loadLayout={this.loadLayout}
              design={this.state.page.layout.content}
              currentDesign={this.state.page.layout.content}
              currentLayout={this.state.page.layoutName}
            /> :
            <PagesManager
              shouldLoadPage={this.state.page.content[0].children.length < 1}
              selectedLayout={this.state.selectedLayout}
              drawLayout={this.drawLayout}
              loadLayout={this.loadLayout}
              loadPage={this.loadPage}
              currentPage={this.props.currentPage}
              page={this.state.page}
              initEmptyPage={this.initEmptyPage}
            />
          }
        </SidebarItem>
      </React.Fragment>;
    } else if (this.state.mode === 'template-mapping') {
      sidebarContent = <React.Fragment>
        <Button class='primary' onClick={() => {
          document.querySelector('#sidebar').style.width = '20%';
          document.querySelector('#main').style.width = '80%';
          document.querySelector('#main').style.marginLeft = '20%'; this.setState(prevState => ({ ...prevState, mode: 'building' }))
        }}>Building</Button>
        <TemplatingTool setComponents={this.setComponents} components={this.state.page.content} />
      </React.Fragment>;
    }


    return (
      <React.Fragment>
        <div className="App">
          {this.state.showSeoModal ?
            <SeoEditor show={this.state.showSeoModal} modalClosed={this.toggleSeoModal}
              title={this.state.page.title}
              image={this.state.page.image}
              description={this.state.page.description}
              type={this.state.page.type}
              onSave={this.onSaveSeo} />
            : null}
          <Sidebar>
            {sidebarContent}
          </Sidebar>
          <div id='main' style={{ marginLeft: '20%', width: '80%' }}>
            <RenderedComponents
              contentComponents={this.state.layoutEditing ? this.state.page.layout.content : this.state.page.content}
              layoutComponents={this.state.page.layout.content}
              layoutEditing={this.state.layoutEditing}
              methods={this.methods}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

}
const mapStateToProps = state => {
  if (state)
    return {
      isAuthenticated: state.auth.token != null,
      redirectPath: state.auth.authRedirectPath
    };
  else
    return {};
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  }
}
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(PageRenderer)));
