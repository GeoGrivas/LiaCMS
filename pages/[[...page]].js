import Head from 'next/head';
import Aux from '../src/hoc/Auxilary';
import { useState, useEffect, useRef, Component } from 'react';
import PageRenderer from '../src/Renderer/PageRenderer';
import EditingPageRenderer from '../src/EditorRenderer/EditingPageRenderer';
import { useRouter } from 'next/router';
import InitAuthState from '../src/components/Authentication/InitAuthState';
import LayoutRenderer from '../src/Renderer/LayoutRenderer';
import componentsList from '../src/Renderer/componentsList';
const Page = (props) => {
    const router = useRouter();
    const counter = useRef(0);
    const editing = router.query.hasOwnProperty('edit');
    const currentPage = router.query.page ? router.query.page.join('/') : '';
    const [pageState, setPageState] = useState({ page: props.page, layout: props.layout });
    console.log('page rendering')
    const updateLayout = (nextLayout) => {
        if (nextLayout === 'remove') {
            setPageState({ ...pageState, layout: null });
        } else if ((!pageState.layout && nextLayout) || (nextLayout.name !== pageState.layout.name)) {
            setPageState({ ...pageState, layout: nextLayout });
        }
    };
    const LeanComponentRender = (block, idAdd) => {
        let Component = null;
        if (block.component === "AppContainer") {
            Component = React.Fragment;
        }
        else {
            Component = componentsList[block.component];
        }
        let children = null;
        if (block.children) {
            children = block.children.map(comp => {
                return LeanComponentRender(comp);
            });
        }

        if (block.component === "AppContainer") {
            return (
                <Component key={block.id + idAdd}>{children}</Component>
            );
        }
        else {
            return (
                <Component block={block} key={block.id + idAdd}>{children}</Component>
            );
        }
    }
    const render = LeanComponentRender(props.page[0], 'p');
    const layout = LeanComponentRender(JSON.parse(props.layout.content)[0], 'l');
    return (
        <Aux>
            <Head>
                <title>{props.pageName}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {layout}
            {render}

        </Aux>
    )
};

export default Page;

export async function getStaticPaths() {
    const response = await (await fetch("https://api.adventurouscoding.com/api/pages")).json();
    const paths = response.map(path => ({ params: { page: (decodeURIComponent(path).substring(1).split('/')) }, }));
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    let route = params.page ? params.page : '';
    const response = await (await fetch("https://api.adventurouscoding.com/api/pages/" + encodeURIComponent('/' + route))).json();
    const page = response.content;
    const layout = response.layout;
    return { props: { pageName: route, page: JSON.parse(page), layout, }, revalidate: 60 }
}
