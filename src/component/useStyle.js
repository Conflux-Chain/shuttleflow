import useIsSamll from './useSmallScreen'
import classNamesBind from 'classnames/bind'

const useClass = (...styles) => {
    const isSmall = useIsSamll()
    return styles.map(style=>{
        const cx=classNamesBind.bind(style)
        return (...params) => {
            return (cx(...params, (isSmall ? 'small' : 'large')))
        }
    })
}

export default useClass