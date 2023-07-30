// ? Функция принимает имя состояния из callback_query:data
function stateToggle(ctx, data) {

    let stateName = data.replace(/_/, '');
    let obj = ctx.session.states
    for (const key in obj) {
        if (obj.hasOwnProperty.call(obj, key)) {
            if(key.toLowerCase() === stateName.toLowerCase()){
                obj[key] = true
            }else{
                obj[key] = false;
            }
            
        }
    }

}

module.exports = {
    stateToggle,
};
