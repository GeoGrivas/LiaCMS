import cloneDeep from 'lodash.clonedeep';

const getParent = (components, child) => {
    for (let i in components) {
      if (Array.isArray(components[i].children) && components[i].children.filter(chld => (chld.id === child.id)).length > 0) {
        return components[i];
      } else {
        if (components[i].children) {
          let res = getParent(components[i].children, child);
          if (res)
            return res;
        }
      }
    }
  }
  const getCopy = (components, child) => {
    let foundComp = components.filter(chld => (chld.id === child.id));
    if (foundComp.length > 0) {
      return foundComp[0];
    } else {
      for (let i in components) {
        if (components[i].type === 'container') {
          let x = getCopy(components[i].children, child);
          if (x)
            return x;
        }
      }
    }
  }
 export const saveComponentEdit=(components,component,inputs)=>{
    const newComponents = cloneDeep(components);
    component = getCopy(newComponents, component);
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].nodeName !== "BUTTON") {
        component.params[inputs[i].name].value = inputs[i].value;
      }
    }
    return newComponents;
  }
 const  addBordersToComponents = () => {
    let editors = document.getElementsByClassName('editorContainer');
    for (let i = 0; i < editors.length; i++) {
      if (editors[i].childNodes.length > 2) {
        editors[i].childNodes[editors[i].childNodes.length - 1].classList.add('border');
      }
    }
    return true;
  }
 export const removeBordersFromComponents = () => {
    let editors = document.getElementsByClassName('editorContainer');
    for (let i = 0; i < editors.length; i++) {
      if (editors[i].childNodes.length > 2) {
        editors[i].childNodes[editors[i].childNodes.length - 1].classList.remove('border');
      }
    }
  }
export const toggleBordersOfComponents=(dragging)=>{
    let bordersOn=false;
    if(dragging&&!bordersOn)
        bordersOn=addBordersToComponents();
    else
        bordersOn=removeBordersFromComponents();
    }

export const removeComponent=(component,components)=>{
    const newComponents = cloneDeep(components);
    let parent = getParent(newComponents, component);
    let children = parent.children;
    children.splice(children.indexOf(children.filter(comp => comp.id === component.id)[0]), 1);
    parent.children = children;
    return newComponents;
}

export const DraggingStarted=(draggingComponent,component,components,ignoreContainer)=>{
        let newComponents = cloneDeep(components);
        component = getCopy(newComponents, component);
        const componentParent = getParent(newComponents, component);
        if (!component || !draggingComponent)
          return null;
        let draggingParent = getParent(newComponents, draggingComponent);
        if (draggingParent) {
          draggingComponent = getCopy(draggingParent.children, draggingComponent);
          if (component.id === draggingParent.id || (componentParent && componentParent.id === draggingComponent.id)) {
            return null;
          }
        }
        if (component.type && component.type === "container" && !ignoreContainer) {
          if (component.id === draggingComponent.id) {
            return null;
          }
          if (draggingParent) {
            let parent = draggingParent;
            let children = [...parent.children];
            children.splice(children.indexOf(draggingComponent), 1);
            parent.children = children;
          }
          draggingParent = component;
          if (componentParent === undefined) {
            newComponents[newComponents.indexOf(component)].children.push(draggingComponent);
          } else {
            let draggingComponentParent = getParent(newComponents, component);
            draggingComponentParent.children[draggingComponentParent.children.indexOf(component)].children.push(draggingComponent);
          }
          return newComponents;
        } else {
          if (component.id === draggingComponent.id) {
            return null;
          }
          let index = -1;
          if (draggingParent) {
            index = draggingParent.children.indexOf(component);
            draggingParent.children.splice(draggingParent.children.indexOf(draggingComponent), 1);
          }
          componentParent.children.splice(index === -1 ? componentParent.children.indexOf(component) : index, 0, draggingComponent);
          return newComponents;
        }
}