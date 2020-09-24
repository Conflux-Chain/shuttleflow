
import {
    atom,
} from 'recoil';

const layoutBottomState = atom({
    key: 'layoutBottom', // unique ID (with respect to other atoms/selectors)
    default: '14rem', // default value (aka initial value)
});
export default layoutBottomState