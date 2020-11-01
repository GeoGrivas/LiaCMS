import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import SidebarItem from './components/Layout/Sidebar/SidebarItem/SidebarItem';
import DraggableItem from './components/DraggableItem/DraggableItem';
import cloneDeep from 'lodash.clonedeep';
import ComponentRender from './Component';
import PagesManager from './components/PagesManager/PagesManager';
class PageRenderer extends Component {

  state = {
    components: []
  }
  components = [];
  componentDidMount = () => {
    if (this.props.page) {
      this.loadPage(this.props.page);
    }
    else {
      this.setState(prevState => {
        return {
          ...prevState, components: [{
            component: "AppContainer",
            importLocation: "/AppContainer/AppContainer",
            children: [],
            id: 'main',
            type: 'container',
            draggable: 'false',
            ignoreHover: true,
            KeyUpHandler: this.onKeyUp,
            KeyDownHandler: this.onKeyDown,
            methods: this.methods
          }]
        }
      });
    }
  }
  draggingComponent = null;
  eventsEnabled = true;
  dragging = false;


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

    if (component.type === 'container') {
      document.getElementById(component.id).childNodes[document.getElementById(component.id).childNodes.length - 1].appendChild(document.getElementById(this.draggingComponent.id));

    } else {
      document.getElementById(component.id).after(document.getElementById(this.draggingComponent.id));
    }


    let x = event.clientX;
    let y = event.clientY;
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
        if (component.type && component.type === "container") {
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
          this.components = newComponents;
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
          this.components = newComponents;
        }
      }

    }
  }
  onDragHandler = (event, component) => {
    this.addBordersToComponents();
    this.dragging = true;
    this.draggingComponent = component;
    if (this.draggingComponent.id === null){
      this.draggingComponent.id = this.idGenerator(this.draggingComponent.component);
      var cmpnt = <ComponentRender key={this.draggingComponent.id} block={this.draggingComponent} />;
      ReactDOM.render(cmpnt, document.getElementById('draw_container'));
    }
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
    this.components = newComponents;
    event.target.focus();
  }
  onRemoveClickedHandler = (component) => {
    const newComponents = cloneDeep(this.state.components);
    let parent = this.getParent(newComponents, component);
    let children = parent.children;
    children.splice(children.indexOf(children.filter(comp => comp.id === component.id)[0]), 1);
    parent.children = children;
    this.components = newComponents;
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
    Remove: this.onRemoveClickedHandler,
    onDragStart: this.onDragHandler,
    onDragOver: this.onDragOver,
    onEdit: this.onEditSavedHandler,
    onDraggingEnded: this.draggingEndedHandler
  }
  render() {
    const renderedComponents = this.state.components.map(block => {
      return <ComponentRender key={block.id + 's'} block={block} />;
    });
    return (
      <div className="App">
        <Sidebar>
          <SidebarItem>
            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "ResponsiveNavigation",
              importLocation: "/Navigation/ResponsiveNavigation",
              type: 'container',
              id: null,
              draggable: 'true',
              children: [],
              methods: this.methods
            }}>Responsive Navigation 1</DraggableItem>

            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "NavigationItem",
              importLocation: "/Navigation/NavigationItems/NavigationItem/NavigationItem",
              id: null,
              draggable: 'true',
              params: { url: { value: "/home" }, text: { value: "Home" } },
              methods: this.methods
            }}>Navigation Link 1</DraggableItem>
            <hr />

            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "Heading",
              params: { text: { value: 'hover meh' }, size: { type: 'select', value: '1', options: [1, 2, 3, 4, 5, 6] } },
              importLocation: "/Heading/Heading",
              id: null,
              draggable: 'true',
              methods: this.methods
            }}>Heading</DraggableItem>
            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "Paragraph",
              importLocation: "/Paragraph/Paragraph",
              params: { text: { value: "hover to edit this paragraph" } },
              id: null,
              draggable: 'true',
              methods: this.methods
            }}>Paragraph</DraggableItem>
            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "ButtonLink",
              importLocation: "/ButtonLink/ButtonLink",
              params: { url: { value: "/" }, text: { value: "button link" } },
              id: null,
              draggable: 'true',
              methods: this.methods
            }}>Button Link</DraggableItem>

            <hr />
            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "Row",
              importLocation: "/Row/Row",
              children: [],
              id: null,
              draggable: 'true',
              type: "container",
              methods: this.methods
            }}>Row</DraggableItem>

            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "Column",
              importLocation: "/Column/Column",
              params: {
                flex: { value: null, type: 'checkbox' },
                alignContent: { value: '', type: 'select', options: ['', 'center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'strect'] },
                justifyContent: { value: '', type: 'select', options: ['', 'center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'strect'] },
                flexBreak: { value: '30%' }
              },
              children: [],
              id: null,
              draggable: 'true',
              type: "container",
              methods: this.methods
            }}>Column</DraggableItem>

            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "Header",
              importLocation: "/Header/Header",
              params: { title: { value: "title" }, subtitle: { value: "sub title" }, backgroundImage: { value: "default" } },
              id: null,
              draggable: 'true',
              methods: this.methods
            }}>Header</DraggableItem>
            <hr />
            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "Card",
              importLocation: "/Card/Card",
              children: [],
              id: null,
              draggable: 'true',
              type: "container",
              methods: this.methods
            }}>Card</DraggableItem>
            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "Image1",
              importLocation: "/Card/Image1/Image1",
              params: { src: { value: "https://dummyimage.com/300.png/09f/fff" }, alt: { value: 'an image!' } },
              id: null,
              draggable: 'true',
              methods: this.methods
            }}>Image1</DraggableItem>
            <hr />
            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "List",
              importLocation: "/List/List",
              params: { type: { value: 'unordered', options: ['unordered', 'ordered'], type: 'select' } },
              children: [],
              id: null,
              draggable: 'true',
              type: 'container',
              methods: this.methods
            }}>List</DraggableItem>
            <DraggableItem onDragEnd={this.draggingEndedHandler} onDragStart={this.onDragHandler} data={{
              component: "ListItem",
              importLocation: "/List/ListItem/ListItem",
              id: null,
              type: 'container',
              children: [],
              draggable: 'true',
              methods: this.methods
            }}>List Item</DraggableItem>


          </SidebarItem>
          <SidebarItem>
            <PagesManager loadPage={this.loadPage} design={this.state.components} currentDesign={this.state.components} currentPage={this.props.currentPage} />
          </SidebarItem>

          <div id='draw_container'>

          </div>

        </Sidebar>

        {renderedComponents}

      </div>
    );
  }

}

export default PageRenderer;
