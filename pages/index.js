import Head from 'next/head';
import Aux from '../src/hoc/Auxilary';
import PageRenderer from '../src/Renderer/PageRenderer';
import EditingPageRenderer from '../src/EditorRenderer/EditingPageRenderer';
import { useRouter } from 'next/router';
import InitAuthState from '../src/components/Authentication/InitAuthState';
const Index = (props) => {
    
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

export default Index;



export async function getServerSideProps() {
    const response = await (await fetch("https://api.adventurouscoding.com/api/pages/" + encodeURIComponent('/'))).json();
    const page = response.content;
    const layout = response.layout;
    return { props: { pageName: response.path, page, layout } }
}
