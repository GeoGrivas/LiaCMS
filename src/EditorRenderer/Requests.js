export const getLayouts=()=>('https://api.adventurouscoding.com/management/layouts');

export const getLayout=(layout)=>('https://api.adventurouscoding.com/management/layouts/' + encodeURIComponent(layout));

export const deleteLayout=(layout)=>('https://api.adventurouscoding.com/management/layouts/delete/' + encodeURIComponent(layout));

export const putLayout=()=>('https://api.adventurouscoding.com/management/layouts/put');

export const getPages=()=>("https://api.adventurouscoding.com/management/pages");

export const getPage=(page)=>('https://api.adventurouscoding.com/management/pages/' + encodeURIComponent(page));

export const deletePage=(page)=>('https://api.adventurouscoding.com/management/pages/delete/' + encodeURIComponent(page));

export const putPage=()=>('https://api.adventurouscoding.com/management/pages/put');

export const getTemplates=()=>("https://api.adventurouscoding.com/management/templates");

export const getTemplate=(template)=>('https://api.adventurouscoding.com/management/templates/' + encodeURIComponent(template));

export const deleteTemplate=(template)=>('https://api.adventurouscoding.com/management/templates/delete/' + encodeURIComponent(template));

export const putTemplate=()=>('https://api.adventurouscoding.com/management/templates/put');

export const getPublicPaths=()=>("https://api.adventurouscoding.com/pages");

export const getPublicPage=(page)=>('https://api.adventurouscoding.com/pages/' + encodeURIComponent(page));

export const getRegisterUrl=()=>('https://api.adventurouscoding.com/authentication/register');
export const getLoginUrl=()=>('https://api.adventurouscoding.com/authentication/login');
export const getRedeployUrl=()=>('https://api.adventurouscoding.com/management/deployment/redeploy');