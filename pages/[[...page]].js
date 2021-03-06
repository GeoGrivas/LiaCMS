import Head from 'next/head';
import Aux from '../src/hoc/Auxilary';
import { useState, useEffect, useRef } from 'react';
import EditingPageRenderer from '../src/EditorRenderer/EditingPageRenderer';
import { useRouter } from 'next/router';
import InitAuthState from '../src/components/Authentication/InitAuthState';
import componentsList from '../src/EditorRenderer/componentsList';
import axios from 'axios';
import DefaultErrorPage from 'next/error';
import PageLoading from '../src/components/UI/PageLoading/PageLoading';
import * as requests from '../src/EditorRenderer/Requests';
const Page = (props) => {

    const router = useRouter();
    const isUpdate = useRef(false);
    const editing = router.query.hasOwnProperty('edit');
    const currentPage = '/' + (router.query.page ? router.query.page.join('/') : '');
    const [pageState, setPageState] = useState(
        {
            page: props.page,
            layout: props.layout,
            currentPage: currentPage,
            title: props.title
        });
  

    useEffect(() => {
        if (isUpdate.current) {
            if (pageState.currentPage !== currentPage && !props.notFound) {
                axios.get(requests.getPublicPage(currentPage)).then(response => {
                    setPageState(
                        {
                            page: JSON.parse(response.data.content),
                            layout: JSON.parse(response.data.layout.content),
                            currentPage: currentPage,
                            title: response.data.title
                        });
                }).catch(err => {
                    console.log("error" + err);
                });
            }
        } else isUpdate.current = true;
    });
    const LeanComponentRender = (block, idAdd) => {
        let Component = null;
        if (block.component === "AppContainer") {
            Component = React.Fragment;
        }
        else {
            if (block.component === "Content") {
                if (pageState.page)
                    block.children = pageState.page[0].children;
            }
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
    let page = null;
    if (editing) {
        return <React.Fragment>
            <InitAuthState>
                <EditingPageRenderer currentPage={currentPage} />
            </InitAuthState>
        </React.Fragment>
    }else if (router.isFallback) {
        page = (<PageLoading />);
    } else if (props.notFound && !editing) {
        return (
            <Aux>
                <Head>
                    <meta name="robots" content="noindex" />
                </Head>
                <DefaultErrorPage statusCode={404} />
            </Aux>
        )
    }
    else if (!editing && pageState.layout && pageState.page) {
        page = LeanComponentRender(pageState.layout[0] ? pageState.layout[0] : [], 'l');
    }
    return (
        <React.Fragment>
            <Head>
                <title>{props.title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
                    {page}
        </React.Fragment>
    )
};

export default Page;

export async function getStaticPaths() {
    try {
        const response = await (await fetch(requests.getPublicPaths())).json();
        const paths = response.map(path => ({ params: { page: (decodeURIComponent(path).substring(1).split('/')) }, }));
        return {
            paths,
            fallback: true
        }
    } catch {
        return {
            paths: ['/'],
            fallback: true
        }
    }

}
export async function getStaticProps({ params }) {
    let route = params.page ? params.page : '';
    try {
        const resp = await fetch(requests.getPublicPage('/' + route));
        if (!resp.ok) {
            if (resp.status >= 400 < 500) {
                return { props: { notFound: true } };
            } else {
                return { props: { serverError: true } };
            }
        }
        const response = await resp.json();
        const page = response.content;
        const layout = response.layout;
        const title = response.title;
        return { props: { pageName: route, page: JSON.parse(page), layout: JSON.parse(layout.content), title, notFound: false }, revalidate: 1 }
    } catch {
        return { props: { pageName: '/' } }
    }
}
