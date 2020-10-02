import React from 'react'
import { useHistory } from 'react-router-dom'

import commonButtonStyle from '../../component/button.module.scss'
import useStyle from '../../component/useStyle'
import buttonStyles from './Button.module.scss'


export default function Button({ disabled, children, path }) {
    const [btnCx, commonbtnCx] = useStyle(buttonStyles, commonButtonStyle)
    const history = useHistory()
    return <div className={btnCx('btn-container')}>
        <button
            onClick={() => {
                history.push(path)
            }}
            className={commonbtnCx('btn') + ' ' + btnCx('btn')}
            disabled={disabled}>
            {children}
        </button>
    </div>
}