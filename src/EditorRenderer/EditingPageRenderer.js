import React, { Component } from 'react';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import SidebarItem from './components/Layout/Sidebar/SidebarItem/SidebarItem';
import { connect } from 'react-redux';
import * as actions from '../components/Authentication/store/actions/index';
import PagesManager from './components/PagesManager/PagesManager';
import axios from 'axios';
import Aux from '../hoc/Auxilary';
import LayoutsManager from './components/LayoutsManager/LayoutsManager';
import EditorLogin from './components/EditorLogin/EditorLogin';
import Spinner from '../components/UI/Spinner/Spinner';
import SeoEditor from './components/SeoEditor/SeoEditor';
import { toggleBordersOfComponents, DraggingStarted, removeComponent, saveComponentEdit } from './Logic/EditingLogic';
import ComponentsList from './components/componentsList/componentsList2';
import RenderedComponents from './RenderedComponents';
import Redeploy from './components/Redeploy/Redeploy';
import Button from '../components/UI/Button/Button';
class PageRenderer extends Component {

  state = {
    components: [],
    layoutComponents: [],
    layoutEditing: false,
    selectedLayout: '',
    loading: true,
    title: '',
    description: '',
    type: '',
    image: '',
    enabled: false
  }
  showSeoModal = false;
  draggingComponent = null;
  eventsEnabled = true;
  dragging = false;
  switchEditingMode = () => {
    this.setState((prevState) => ({ ...prevState, layoutEditing: !prevState.layoutEditing }));
  }
  toggleSeoModal = () => {
    this.setState((prevState) => ({ ...prevState, showSeoModal: !prevState.showSeoModal }));
  }
  componentDidMount = () => {
    if (this.props.isAuthenticated) {
      this.initEmptyPage();

      this.setState(prevState => ({
        ...prevState,
        loading: false
      }));
    } else {
      this.props.onTryAutoSignup();
      this.setState(prevState => ({ ...prevState, loading: false }));
    }
  }
  initEmptyPage = () => {
    this.setState(prevState => {
      return {
        ...prevState, components: [{
          component: "AppContainer",
          importLocation: "/AppContainer/AppContainer",
          children: [],
          id: 'main',
          type: 'container',
          ignoreHover: true,
          KeyUpHandler: this.onKeyUp,
          KeyDownHandler: this.onKeyDown,
          methods: this.methods
        }]
      }
    });
  }

  cleanCanvas = () => {
    this.setState(prevState => {
      return {
        ...prevState, components: [{
          component: "AppContainer",
          importLocation: "/AppContainer/AppContainer",
          children: [],
          id: 'main',
          type: 'container',
          ignoreHover: true,
          KeyUpHandler: this.onKeyUp,
          KeyDownHandler: this.onKeyDown,
          methods: this.methods
        }],
        layoutComponents: []
      }
    });
  }


  onSaveSeo = (properties) => {
    this.setState((prevState) => ({ ...prevState, ...properties }));
  }
  onDragOver = (event, component) => {
    event.preventDefault();
    event.stopPropagation();
    const isShiftPressed = event.shiftKey;
    toggleBordersOfComponents(this.dragging);
    const result = DraggingStarted(this.draggingComponent, component, this.state.components, isShiftPressed);
    if (result !== null) {
      this.setState((prevState) => ({ components: result }));
    }
  }
  onDragHandler = (event, component) => {
    this.dragging = true;
    toggleBordersOfComponents(this.dragging);
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
    const newComponents = saveComponentEdit(this.state.components, component, event.target.elements);
    this.setState({ components: newComponents });
    event.target.focus();
  }
  onRemoveClickedHandler = (component) => {
    const newComponents = removeComponent(component, this.state.components);
    this.setState({ components: newComponents });
  }
  idGenerator = (componentName) => {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (componentName + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  };
  loadPage = (design, seoProps) => {
    this.addEditingEventsToLoad(design);
    this.setState(prevState => ({ ...prevState, components: design, ...seoProps }));
  }
  loadLayout = (layoutName) => {
    axios.get('https://api.adventurouscoding.com/api/management/layouts/' + encodeURIComponent(layoutName)).then(response => {
      const layout = response.data.content;
      if (layout) {
        this.drawLayout(layout);
      }
    }).catch(err => {
      console.log("error" + err);
    });
  }
  drawLayout = (content) => {
    this.setState(prevState => ({ ...prevState, layoutComponents: JSON.parse(content) }));
  }
  addEditingEventsToLoad = (components) => {
    if (Array.isArray(components)) {
      for (let i = 0; i < components.length; i++) {
        components[i].methods = this.methods;
        if (components[i].children && components[i].children.length > 0) {
          this.addEditingEventsToLoad(components[i].children);
        }
      }
    } else {
      components.methods = this.methods;
    }
  };
  methods = {
    onRemove: this.onRemoveClickedHandler,
    onDragStart: this.onDragHandler,
    onDragOver: this.onDragOver,
    onEdit: this.onEditSavedHandler,
    onDraggingEnded: this.draggingEndedHandler
  }
  render() {
    if (this.state.loading) {
      return <Spinner />
    }
    if (!this.props.isAuthenticated) {
      return <EditorLogin />
    }
    return (
      <Aux>
        <div className="App">
          {this.state.showSeoModal ?
            <SeoEditor show={this.state.showSeoModal} modalClosed={this.toggleSeoModal} title={this.state.title} image={this.state.image} description={this.state.description} type={this.state.type} onSave={this.onSaveSeo} />
            : null}
          <Sidebar>
            <Redeploy />
            <h4>
              Components
        </h4>
            <SidebarItem scrollable>
              <ComponentsList
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
                ? <LayoutsManager cleanCanvas={this.cleanCanvas} currentLayout={this.state.selectedLayout} loadPage={this.loadPage} design={this.state.components} currentDesign={this.state.components} currentPage={this.props.currentPage} /> :
                <PagesManager
                  selectedLayout={this.state.selectedLayout}
                  drawLayout={this.drawLayout}
                  loadLayout={this.loadLayout}
                  loadPage={this.loadPage}
                  design={this.state.components}
                  currentDesign={this.state.components}
                  currentPage={this.props.currentPage}
                  title={this.state.title}
                  image={this.state.image}
                  description={this.state.description}
                  type={this.state.type}
                  enabled={this.state.enabled}
                />
              }
            </SidebarItem>
          </Sidebar>

          <div style={{ marginLeft: '20%', width: '80%' }}>
            <RenderedComponents
              contentComponents={this.state.components}
              layoutComponents={this.state.layoutComponents}
              layoutEditing={this.state.layoutEditing}
              methods={this.methods}
            />
          </div>

        </div>

      </Aux>
    );
  }

}
const mapStateToProps = state => {
  if (state)
    return {
      isAuthenticated: state.auth.token != null,
      redirectPath: state.auth.authRedirectPath,
      token: state.auth.token
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
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(PageRenderer));
