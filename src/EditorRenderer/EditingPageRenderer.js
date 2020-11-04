import React, { Component, Suspense } from 'react';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import SidebarItem from './components/Layout/Sidebar/SidebarItem/SidebarItem';
import DraggableItem from './components/DraggableItem/DraggableItem';
import cloneDeep from 'lodash.clonedeep';
import ComponentRender from './Component';
import { connect } from 'react-redux';
import * as actions from '../components/Authentication/store/actions/index';
import PagesManager from './components/PagesManager/PagesManager';
import axios from 'axios';
import Aux from '../hoc/Auxilary';
import LayoutsManager from './components/LayoutsManager/LayoutsManager';
import LeanComponentRender from '../Renderer/LeanComponentRender';
import EditorLogin from './components/EditorLogin/EditorLogin';
import Spinner from '../components/UI/Spinner/Spinner';
import Modal from '../components/UI/Modal/Modal';
import SeoEditor from './components/SeoEditor/SeoEditor';
class PageRenderer extends React.PureComponent {

  state = {
    components: [],
    layoutComponents: [],
    layoutEditing: false,
    selectedLayout: '',
    loading: true
  }
  showSeoModal = false;
  draggingComponent = null;
  eventsEnabled = true;
  dragging = false;
  switchEditingMode = () => {
    this.setState((prevState) => ({ ...prevState, layoutEditing: !prevState.layoutEditing }));
  }
  toggleSeoModal = () => {
    this.setState((prevState) => ({ showSeoModal: !prevState.showSeoModal }));
  }
  componentDidMount = () => {
    if (this.props.isAuthenticated) {
      this.initEmptyPage();
      axios.get('https://api.adventurouscoding.com/api/pages/' + encodeURIComponent(this.props.currentPage)).then(response => {
        const page = response.data.content;
        const layout = response.data.layout.content;
        const layoutName = response.data.layoutName;
        if (page) {
          this.loadPage(JSON.parse(page));
          this.setState(prevState => ({ ...prevState,
             layoutComponents: JSON.parse(layout), 
             selectedLayout: layoutName, 
             loading: false ,
             title:response.data.title,
             image:response.data.image,
             type:response.data.type,
             description:response.data.description
            }));
        }
      }).catch(err => {
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

  getParent = (components, child) => {
    for (let i in components) {
      if (Array.isArray(components[i].children) && components[i].children.filter(chld => (chld.id === child.id)).length > 0) {
        return components[i];
      } else {
        if (components[i].children) {
          let res = this.getParent(components[i].children, child);
          if (res)
            return res;
        }
      }
    }
  }
  onSaveSeo = (properties) => {
    this.setState((prevState) => ({ ...prevState, ...properties }));
  }
  getCopy = (components, child) => {
    let foundComp = components.filter(chld => (chld.id === child.id));
    if (foundComp.length > 0) {
      return foundComp[0];
    } else {
      for (let i in components) {
        if (components[i].type === 'container') {
          let x = this.getCopy(components[i].children, child);
          if (x)
            return x;
        }
      }
    }
  }
  addBordersToComponents = () => {
    let editors = document.getElementsByClassName('editorContainer');
    for (let i = 0; i < editors.length; i++) {
      if (editors[i].childNodes.length > 2) {
        editors[i].childNodes[editors[i].childNodes.length - 1].classList.add('border');
      }
    }
  }
  removeBordersFromComponents = () => {
    let editors = document.getElementsByClassName('editorContainer');
    for (let i = 0; i < editors.length; i++) {
      if (editors[i].childNodes.length > 2) {
        editors[i].childNodes[editors[i].childNodes.length - 1].classList.remove('border');
      }
    }
  }

  onDragOver = (event, component) => {
    event.preventDefault();
    event.stopPropagation();
    let x = event.clientX;
    let y = event.clientY;
    const isShiftPressed = event.shiftKey;
    const coords = event.target.getBoundingClientRect();
    if (!this.dragging) {
      this.removeBordersFromComponents();
    } else {
      this.addBordersToComponents();
    }
    if (this.eventsEnabled) {
      if (x > coords.left + (coords.width * 0.01) && x < coords.right - (coords.width * 0.01) && y > coords.top + (coords.height * 0.01) && y < coords.bottom - (coords.height * 0.01)) {
        setTimeout(() => {
          this.eventsEnabled = true;
        }, 250);
        this.eventsEnabled = false;
        let newComponents = cloneDeep(this.state.components);
        component = this.getCopy(newComponents, component);
        const componentParent = this.getParent(newComponents, component);
        if (!component || !this.draggingComponent)
          return;
        let draggingParent = this.getParent(newComponents, this.draggingComponent);
        if (draggingParent) {
          this.draggingComponent = this.getCopy(draggingParent.children, this.draggingComponent);
          if (component.id === draggingParent.id || (componentParent && componentParent.id === this.draggingComponent.id)) {
            return;
          }
        }
        if (component.type && component.type === "container" && !isShiftPressed) {
          if (component.id === this.draggingComponent.id) {
            return;
          }
          if (draggingParent) {
            let parent = draggingParent;
            let children = [...parent.children];
            children.splice(children.indexOf(this.draggingComponent), 1);
            parent.children = children;
          }
          draggingParent = component;
          if (componentParent === undefined) {
            newComponents[newComponents.indexOf(component)].children.push(this.draggingComponent);
          } else {
            let draggingComponentParent = this.getParent(newComponents, component);
            draggingComponentParent.children[draggingComponentParent.children.indexOf(component)].children.push(this.draggingComponent);
          }
          this.setState({ components: newComponents });
        } else {
          if (component.id === this.draggingComponent.id) {
            return;
          }
          let index = -1;
          if (draggingParent) {
            index = draggingParent.children.indexOf(component);
            draggingParent.children.splice(draggingParent.children.indexOf(this.draggingComponent), 1);
          }
          componentParent.children.splice(index === -1 ? componentParent.children.indexOf(component) : index, 0, this.draggingComponent);
          this.setState({ components: newComponents });
        }
      }

    }
  }
  onDragHandler = (event, component) => {
    this.addBordersToComponents();
    this.dragging = true;
    this.draggingComponent = component;
    if (!this.draggingComponent.id)
      this.draggingComponent.id = this.idGenerator(this.draggingComponent.component);
  };
  draggingEndedHandler = (event) => {
    this.dragging = false;
    this.removeBordersFromComponents();
  }

  onEditSavedHandler = (event, component) => {
    event.preventDefault();
    this.removeBordersFromComponents();
    const newComponents = cloneDeep(this.state.components);
    component = this.getCopy(newComponents, component);
    const inputs = event.target.elements;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].nodeName !== "BUTTON") {
        component.params[inputs[i].name].value = inputs[i].value;
      }
    }
    this.setState({ components: newComponents });
    event.target.focus();
  }
  onRemoveClickedHandler = (component) => {
    const newComponents = cloneDeep(this.state.components);
    let parent = this.getParent(newComponents, component);
    let children = parent.children;
    children.splice(children.indexOf(children.filter(comp => comp.id === component.id)[0]), 1);
    parent.children = children;
    this.setState({ components: newComponents });
  }
  onMouseOverComponent = (event, id) => {
    let editor = document.getElementById(id);
    editor.style.display = 'block';
    editor.style.position = 'absolute';
    const elemCoords = event.target.getBoundingClientRect();
    editor.style.top = elemCoords.top + "px";
    editor.style.left = elemCoords.left + "px";
    editor.style.right = elemCoords.right + "px";
    editor.style.bottom = elemCoords.bottom + "px";
    editor.style.width = elemCoords.width + "px";
    editor.style.height = elemCoords.height + "px";
  }
  onMouseOutComponent = (event, id) => {
    let editor = document.getElementById(id);
    editor.style.display = 'none';
  }
  idGenerator = (componentName) => {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (componentName + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  };
  loadPage = (design) => {
    this.addEditingEventsToLoad(design);
    this.setState(prevState => ({ ...prevState, components: design }));
  }
  loadLayout = (layoutName) => {
    axios.get('https://api.adventurouscoding.com/api/layouts/' + encodeURIComponent(layoutName)).then(response => {
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
    const layoutRenderedComponents = this.state.layoutComponents.map(block => {
      return <LeanComponentRender key={block.id + 's'} block={block} methods={this.methods} ignoreAppContainer={true} />;
    });
    const renderedComponents = this.state.components.map(block => {
      return <ComponentRender key={block.id + 's'} block={block} methods={this.methods} />;
    });

    if (this.state.loading) {
      return <Spinner />
    }
    if (!this.props.isAuthenticated) {
      return <EditorLogin />
    }
    return (
      <Aux>
        <div className="App">
          <Sidebar>
            <SidebarItem>
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "ResponsiveNavigation",
                importLocation: "/Navigation/ResponsiveNavigation",
                type: 'container',
                children: []
              }}>Responsive Navigation 1</DraggableItem>

              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "NavigationItem",
                importLocation: "/Navigation/NavigationItems/NavigationItem/NavigationItem",
                params: { url: { value: "/home" }, text: { value: "Home" } }
              }}>Navigation Link 1</DraggableItem>
              <hr />

              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "Heading",
                params: { text: { value: 'alt-click to edit this title' }, size: { type: 'select', value: '1', options: [1, 2, 3, 4, 5, 6] } },
                importLocation: "/Heading/Heading"
              }}>Heading</DraggableItem>
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "Paragraph",
                importLocation: "/Paragraph/Paragraph",
                params: { text: { value: "alt-click to edit this paragraph" } }
              }}>Paragraph</DraggableItem>
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "ButtonLink",
                importLocation: "/ButtonLink/ButtonLink",
                params: { url: { value: "/" }, text: { value: "button link" } },
              }}>Button Link</DraggableItem>

              <hr />
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "Container",
                importLocation: "/Container/Container",
                children: [],
                type: "container"
              }}>Container</DraggableItem>
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "Row",
                importLocation: "/Row/Row",
                children: [],
                params: {
                  alignItems: { value: '', type: 'select', options: ['', 'center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'stretch'] },
                  justifyContent: { value: '', type: 'select', options: ['', 'center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'stretch'] }
                },
                type: "container"
              }}>Row</DraggableItem>

              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "Column",
                importLocation: "/Column/Column",
                params: {
                  breakPoint: { value: 'md', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
                  span: { value: '', type: 'select', options: ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', ''] }
                },
                children: [],
                type: "container"
              }}>Column</DraggableItem>

              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "Header",
                importLocation: "/Header/Header",
                params: { title: { value: "title" }, subtitle: { value: "sub title" }, backgroundImage: { value: "default" } }
              }}>Header</DraggableItem>
              <hr />
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "Card",
                importLocation: "/Card/Card",
                children: [],
                type: "container"
              }}>Card</DraggableItem>
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "Image1",
                importLocation: "/Card/Image1/Image1",
                params: { src: { value: "https://dummyimage.com/300.png/09f/fff" }, alt: { value: 'an image!' }, height: { value: '300px' }, width: { value: '300px' } }
              }}>Image1</DraggableItem>
              <hr />
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "List",
                importLocation: "/List/List",
                params: {
                  type: { value: 'unordered', options: ['unordered', 'ordered'], type: 'select' },
                  style: { value: 'unset', options: ['unset', 'none', 'circle', 'disc', 'square', 'decimal', 'decimal-leading-zero', 'lower-alpha', 'lower-greek', 'lower-latin', 'lower-roman', 'upper-alpha', 'upper-greek', 'upper-latin', 'upper-roman'], type: 'select' }
                },
                children: [],
                type: 'container'
              }}>List</DraggableItem>
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "ListItem",
                importLocation: "/List/ListItem/ListItem",
                type: 'container',
                children: [],
              }}>List Item</DraggableItem>
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "InitAuthState",
                importLocation: "/Authentication/InitAuthState",
                children: [],
              }}>Authorization</DraggableItem>
              <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
                component: "Authentication",
                importLocation: "/Authentication/Authentication",
                type: 'container',
                children: []
              }}>Login</DraggableItem>

            </SidebarItem>
            <button onClick={this.switchEditingMode}>Switch editing mode</button>
            <button onClick={this.toggleSeoModal}>Edit SEO properties</button>
            <SidebarItem>
              {this.state.layoutEditing
                ? <LayoutsManager cleanCanvas={this.cleanCanvas} loadPage={this.loadPage} design={this.state.components} currentDesign={this.state.components} currentPage={this.props.currentPage} /> :
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
                />
              }
            </SidebarItem>
          </Sidebar>

          <div style={{ marginLeft: '20%', width: '80%' }}>

            {layoutRenderedComponents}
            {renderedComponents}

          </div>

        </div>
        <Modal show={this.state.showSeoModal} modalClosed={this.toggleSeoModal}>
          <SeoEditor title={this.state.title} image={this.state.image} description={this.state.description} type={this.state.type} onSave={this.onSaveSeo} />
        </Modal>
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
