
import {
    atom,
} from 'recoil';

const layoutBottomState = atom({
    key: 'layoutBottom', // unique ID (with respect to other atoms/selectors)
    default: '0px', // default value (aka initial value)
});
export default layoutBottomState