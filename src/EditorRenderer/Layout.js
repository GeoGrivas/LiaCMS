class Layout{
    name='new';
    content=[{
        component: "AppContainer",
        importLocation: "/AppContainer/AppContainer",
        children: [
          {
            component: "Content",
            importLocation: "/Content/Content",
            children: [
            ],
            id: 'Content1',
            type: 'container'
          }
        ],
        id: 'main',
        type: 'container',
        ignoreHover: true
      }];
}

export default Layout;