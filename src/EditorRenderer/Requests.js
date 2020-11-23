export const getLayouts=()=>('https://api.adventurouscoding.com/api/management/layouts');

export const getLayout=(layout)=>('https://api.adventurouscoding.com/api/management/layouts/' + encodeURIComponent(layout));

export const deleteLayout=(layout)=>('https://api.adventurouscoding.com/api/management/layouts/delete/' + encodeURIComponent(layout));

export const putLayout=()=>('https://api.adventurouscoding.com/api/management/layouts/put');

export const getPages=()=>("https://api.adventurouscoding.com/api/management/pages");

export const getPage=(page)=>('https://api.adventurouscoding.com/api/management/pages/' + encodeURIComponent(page));

export const deletePage=(page)=>('https://api.adventurouscoding.com/api/management/pages/delete/' + encodeURIComponent(page));

export const putPage=()=>('https://api.adventurouscoding.com/api/management/pages/put');