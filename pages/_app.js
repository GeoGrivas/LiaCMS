import React from "react";
import { Provider } from 'react-redux';
import configureStore from '../src/Helpers/configureStore';
import LayoutRenderer from '../src/Renderer/LayoutRenderer';
import App from 'next/app';
import '../src/index.css';
class MyApp extends App {
   
    render() {
        const { Component, pageProps } = this.props;
        const store = configureStore({});
        return <Provider store={store}>
            <Component {...pageProps} />
        </Provider>;
    }
}
export default MyApp;