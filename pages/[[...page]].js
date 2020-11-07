import Head from 'next/head';
import Aux from '../src/hoc/Auxilary';
import { useState, useEffect, useRef } from 'react';
import EditingPageRenderer from '../src/EditorRenderer/EditingPageRenderer';
import { useRouter } from 'next/router';
import InitAuthState from '../src/components/Authentication/InitAuthState';
import componentsList from '../src/Renderer/componentsList';
import axios from 'axios';
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
            if (pageState.currentPage !== currentPage) {
                axios.get('https://api.adventurouscoding.com/api/pages/' + encodeURIComponent(currentPage)).then(response => {
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
    const LeanComponentRender = (block, idAdd,content) => {
        let Component = null;
        if (block.component === "AppContainer") {
            Component = React.Fragment;
        } 
        else {
            if (block.component === "Content") {
                //console.log(props.page[0].children);
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
    //const render = LeanComponentRender(props.page[0], 'p');
    const page = LeanComponentRender(props.layout[0], 'l',props.page[0].children);
    return (
        <Aux>
            <Head>
                <title>{props.title}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {editing ?
                (<InitAuthState>
                    <EditingPageRenderer currentPage={currentPage} />
                </InitAuthState>) :
                <Aux>
                    {page}
                </Aux>
            }
        </Aux>
    )
};

export default Page;

export async function getStaticPaths() {
    const response = await (await fetch("https://api.adventurouscoding.com/api/pages")).json();
    const paths = response.map(path => ({ params: { page: (decodeURIComponent(path).substring(1).split('/')) }, }));
    return {
        paths,
        fallback: true
    }
}
export async function getStaticProps({ params }) {
    let route = params.page ? params.page : '';
    const response = await (await fetch("https://api.adventurouscoding.com/api/pages/" + encodeURIComponent('/' + route))).json();
    const page = response.content;
    const layout = response.layout;
    const title = response.title;
    return { props: { pageName: route, page: JSON.parse(page), layout: JSON.parse(layout.content), title }, revalidate: 60 }
}
