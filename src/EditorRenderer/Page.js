import Layout from './Layout';

class Page {
    path = '/new_page';
    enabled = false;
    title = '';
    description = '';
    type = '';
    image = '';
    content = [{
        component: "AppContainer",
        importLocation: "/AppContainer/AppContainer",
        children: [],
        id: 'main',
        type: 'container',
        ignoreHover: true
    }];
    layoutName = '';
    layout = new Layout();

    constructor(data) {
        if (data) {
            this.content = JSON.parse(data.content);
            this.layout.content = JSON.parse(data.layout.content);
            this.path = data.path;
            this.title = data.title;
            this.description = data.description;
            this.type = data.type;
            this.image = data.image;
            this.layoutName = data.layoutName;
            this.layout.name = data.layout.name;
        }
    }

}

export default Page;