/**
 * Created by admin on 2017/3/17.
 */
(function (window) {
    const stragies = {
        isEmpty(val, error){
            if (val === ''){
                return error;
            }
        },
        minLength(val, length, error){
            if (val.length < length){
                return error;
            }
        },
        isMobile(val, error){
            if (!/^1[358]\d{9}$/.test(val)){
                return error;
            }
        }
    }

    class Validator{
        constructor(){

        }
        add(domNode, stragyType, error ){
            let val = domNode.value;
            let rule = stragyType.split(":");

            stragies[stragyType](val, error)
        }
    }

})(window);
