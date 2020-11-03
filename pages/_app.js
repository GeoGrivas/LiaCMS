import React from "react";
import { Provider } from 'react-redux';
import configureStore from '../src/Helpers/configureStore';
import LayoutRenderer from '../src/Renderer/LayoutRenderer';
import App from 'next/app';
import '../src/index.css';
class MyApp extends App {
    state = { layout: [] };
    updateLayout = (nextLayout) => {
        if (nextLayout === 'remove') {
            this.setState({ layout: null });
        } else if ((!this.state.layout && nextLayout) || (nextLayout.name !== this.state.layout.name)) {
            this.setState({ layout: nextLayout });
        }
    };
    render() {
        const { Component, pageProps } = this.props;
        const store = configureStore({});
        return <Provider store={store}>
            {this.state.layout !== null ?
                <LayoutRenderer layout={this.state.layout} /> : null}
            <Component {...pageProps} updateLayout={this.updateLayout} />
        </Provider>;
    }
}
export default MyApp;