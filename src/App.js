import React, { useEffect, useState } from 'react';
import {StaticRouter,Route, Switch } from 'react-router-dom';
import EditingPageRenderer from './EditorRenderer/EditingPageRenderer';
import PageRenderer from './Renderer/PageRenderer';
import axios from 'axios';
import InitAuthState from './components/Authentication/InitAuthState';
import EditorLogin from './EditorRenderer/components/EditorLogin/EditorLogin';
import LayoutRenderer from './Renderer/LayoutRenderer';
import Aux from './hoc/Auxilary';
import Spinner from './components/UI/Spinner/Spinner';
import configureStore from './Helpers/configureStore';
import { Provider } from 'react-redux';
const App = props => {
  const store = configureStore({});
  //const urlParams = new URLSearchParams(window.location.search);
  const [appState, setAppState] = useState({ pages: props.pages, layout: null });

  const updateLayout = (layout) => {
    if ((!appState.layout && layout) || (layout.name !== appState.layout.name))
      setAppState({ ...appState, layout: layout });

  };
  const editing = false;//urlParams.has('edit');
  if (editing)
    document.querySelector('body').style.height = '5000px';

    
  useEffect(() => {
    if(!props.pages)
    {
      console.log('fetching!');
    axios.get("http://localhost:5001/api/pages").then(response => {
      const keys = response.data;
      const pages = keys.map(key =>
        decodeURIComponent(key));
      if (pages.indexOf("/") < 0) {
        pages.push("/");
      }
      setAppState({ pages: pages, layout: null });
    });
  }}, []);
  //console.log("we're App rendering!!", appState.pages);
  let Layout = <Spinner />;
  if (!editing && appState.pages !== null && appState.pages.length > 0) {
    Layout = (
      <Aux>
        <LayoutRenderer layout={appState.layout} />
        <Switch>
          {appState.pages !== null ? appState.pages.map(page => {
            return (
              <Route exact key={page} path={page}>
                <PageRenderer currentPage={page} updateLayout={updateLayout} />
              </Route>);
          }) : null}
        </Switch>
      </Aux>
    );
  } else if (appState.pages !== null && appState.pages.length > 0) {
    Layout = (
      <Switch>
        <Route exact path={"/editor_login"}>
          <EditorLogin />
        </Route>
        {appState.pages !== null ? appState.pages.map(page => {
          return (
            <Route exact key={page} path={page}>
              <InitAuthState>
                <EditingPageRenderer currentPage={page} />
              </InitAuthState>
            </Route>);
        }) : null}
      </Switch>
    )
  }
  return (
    <Aux>
      <Provider store={store}>
        <StaticRouter>
          {Layout}
        </StaticRouter>
      </Provider>
    </Aux>
  );
}

export default App;
