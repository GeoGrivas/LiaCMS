import React, { Component } from 'react';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import SidebarItem from './components/Layout/Sidebar/SidebarItem/SidebarItem';
import { connect } from 'react-redux';
import * as actions from '../components/Authentication/store/actions/index';
import PagesManager from './components/PagesManager/PagesManager';
import axios from 'axios';
import LayoutsManager from './components/LayoutsManager/LayoutsManager';
import EditorLogin from './components/EditorLogin/EditorLogin';
import Spinner from '../components/UI/Spinner/Spinner';
import SeoEditor from './components/SeoEditor/SeoEditor';
import { toggleBordersOfComponents, DraggingStarted, removeComponent, saveComponentEdit } from './Logic/EditingLogic';
import ComponentsList from './components/componentsList/componentsList2';
import RenderedComponents from './RenderedComponents';
import Redeploy from './components/Redeploy/Redeploy';
import Button from '../components/UI/Button/Button';
import TemplatingTool from './components/TemplatingTool/TemplatingTool';
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
    enabled: false,
    mode: 'building'
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
      axios.get('https://api.adventurouscoding.com/api/management/pages/' + encodeURIComponent(this.props.currentPage), {
        headers: {
            'Authorization': `Bearer ${this.props.token}`
        }
    }).then(response => {
        const page = response.data.content;
        const layout = response.data.layout.content;
        const layoutName = response.data.layoutName;
        this.loadPage(JSON.parse(page),
         { title: response.data.title, image: response.data.image, type: response.data.type, description: response.data.description },
         JSON.parse(layout),
         layoutName
         );
        //this.drawLayout(layout);

    }).catch(err => {
      this.loadPage( [{
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
         { title:'', image: '', type: '', description: ''},
         [{
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
         ''
         );
        console.log("error" + err);
    });
     
      
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

  setComponents=(components)=>{
      this.setState(prevState=>({...prevState,components:components}));
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
  loadPage = (design, seoProps,layout,layoutName) => {
    this.addEditingEventsToLoad(design);
    this.setState(prevState => ({ ...prevState, components: design, ...seoProps,layoutComponents:layout,layoutName:layoutName,loading:false }));
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
    let sidebarContent = null;
    if (this.state.mode === 'building') {
      sidebarContent = <React.Fragment>
        <Redeploy /><Button class='primary' onClick={() => { this.setState(prevState => ({ ...prevState, mode: 'template-mapping' })) }}>Templating</Button>
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
          <TemplatingTool components={this.state.components} />
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
              layoutName={this.state.layoutName}
            />
          }
        </SidebarItem>
      </React.Fragment>;
    } else if (this.state.mode === 'template-mapping') {
      sidebarContent = <React.Fragment>
        <Button class='primary' onClick={() => { document.querySelector('#sidebar').style.width = '20%';
        document.querySelector('#main').style.width='80%';
        document.querySelector('#main').style.marginLeft='20%'; this.setState(prevState => ({ ...prevState, mode: 'building' })) }}>Building</Button>
        <TemplatingTool setComponents={this.setComponents} components={this.state.components}/>
      </React.Fragment>;
    }


    return (
      <React.Fragment>
        <div className="App">
          {this.state.showSeoModal ?
            <SeoEditor show={this.state.showSeoModal} modalClosed={this.toggleSeoModal} title={this.state.title} image={this.state.image} description={this.state.description} type={this.state.type} onSave={this.onSaveSeo} />
            : null}
          <Sidebar>
            {sidebarContent}
          </Sidebar>
          <div id='main' style={{ marginLeft: '20%', width: '80%' }}>
            <RenderedComponents
              contentComponents={this.state.components}
              layoutComponents={this.state.layoutComponents}
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
