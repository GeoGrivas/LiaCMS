import Head from 'next/head';
import Aux from '../src/hoc/Auxilary';
import {useState,useEffect,useRef} from 'react';
import PageRenderer from '../src/Renderer/PageRenderer';
import EditingPageRenderer from '../src/EditorRenderer/EditingPageRenderer';
import { useRouter } from 'next/router';
import InitAuthState from '../src/components/Authentication/InitAuthState';
import LayoutRenderer from '../src/Renderer/LayoutRenderer';

const Page =  (props) => {
    const router=useRouter();
    const counter=useRef(0);
    const editing=router.query.hasOwnProperty('edit');
    const currentPage=router.query.page?router.query.page.join('/'):'';
    const [pageState,setPageState]=useState({page:props.page,layout:props.layout});
    console.log('page rendering')
    const updateLayout = (nextLayout) => {
        if (nextLayout === 'remove') {
            setPageState({...pageState,layout:null});
        } else if ((!pageState.layout && nextLayout) || (nextLayout.name !== pageState.layout.name)) {
            setPageState({...pageState, layout: nextLayout });
        }
    };

    return (
        <Aux>
            <Head>
                <title>{props.pageName}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {console.log('we;re rendering')}
            {editing?
            (<InitAuthState>
            <EditingPageRenderer removeLayout={()=>{updateLayout('remove')}}currentPage={'/'+currentPage} />
          </InitAuthState>):
          <Aux>
            <PageRenderer currentPage={'/'+currentPage}  updateLayout={updateLayout} layout={JSON.parse(props.layout.content)} loadedLayout={props.layout}  page={props.page} />
          </Aux>
        }
        </Aux>
    )
};

export default Page;

export async function getStaticPaths(){
    const response = await(await fetch("https://api.adventurouscoding.com/api/pages")).json();
    const paths=response.map(path=>({params:{page:(decodeURIComponent(path).substring(1).split('/'))},}));
    return {
        paths,
        fallback:false
    }
}

export async function getStaticProps({params}) {
    let route=params.page?params.page:'';
    const response = await (await fetch("https://api.adventurouscoding.com/api/pages/" + encodeURIComponent('/'+ route))).json();
    const page = response.content;
    const layout = response.layout;
    return { props: { pageName: route, page:JSON.parse(page), layout, },revalidate:60 }
}
