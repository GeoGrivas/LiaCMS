import Head from 'next/head';
import Aux from '../src/hoc/Auxilary';
import PageRenderer from '../src/Renderer/PageRenderer';
import EditingPageRenderer from '../src/EditorRenderer/EditingPageRenderer';
import { useRouter } from 'next/router';
import InitAuthState from '../src/components/Authentication/InitAuthState';
const Page = (props) => {
    
    const router=useRouter();
    
    const editing=router.query.hasOwnProperty('edit');
     return (
        <Aux>
            <Head>
                <title>{props.pageName}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {editing?
            (<InitAuthState>
            <EditingPageRenderer currentPage={decodeURIComponent(props.pageName)} />
          </InitAuthState>):
            <PageRenderer currentPage={props.pageName} updateLayout={props.updateLayout} layout={props.layout} loadedLayout={props.layout}  page={props.page} />
        }
        </Aux>
    )
}

export default Page;



export async function getServerSideProps({params}) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    const response = await (await fetch("https://localhost:5001/api/pages/" + encodeURIComponent('/'+ params.page))).json();
    const page = response.content;
    const layout = response.layout;
    return { props: { pageName: response.path, page, layout } }
}
