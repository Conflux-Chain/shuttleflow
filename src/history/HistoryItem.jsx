import React, { useState } from 'react'
import Accordion from '../component/Accordion'
import useStyle from '../component/useStyle'
import itemStyle from './historyItem.module.scss'
import { historyItem } from '../data/mock/historyDB'
import open from './open.svg'

export default function HistoryItem(props) {
    props = historyItem
    const { icon, token, steps, amount, status } = props
    const [expanded, setExpanded] = useState(false)
    const [cx] = useStyle(itemStyle)
    return <Accordion title={
        <div className={cx('title-container')}>
            <div className={cx('title')}>
                <div className={cx('start')}>
                    <img className={cx('img')} src={icon} ></img>
                    <div className={cx('two-row')}>
                        <div style={{ fontWeight: 500, color: 'white' }} className={cx('large-txt')}>{token}</div>
                        <div style={{ color: '#AEB0C2' }} className={cx('small-txt')}>{steps[1].txt}</div>
                    </div>
                </div>
                <div className={cx('two-row', 'end')}>
                    <div style={{ fontWeight: 'bold' }} className={cx('large-txt')}>{amount}</div>
                    <div className={cx('small-txt')}>{status}</div>
                </div>
            </div>
            <div style={{ visibility: expanded ? 'hidden' : 'visible' }} className={cx('arrow')} onClick={() => setExpanded(x => !x)}>
                <img className={cx('semi-circle')} src={open}></img>
            </div>
        </div>
    }
        expanded={expanded}
        content={
            <div>
                {steps.map(({ txt, complete }) => {
                    return <div key={txt} className={cx('item-container')}>
                        <div className={cx('bar-container')}>
                            <div className={cx('bar', { complete: complete >= 1 })}></div>
                            <div className={cx('bar', { complete: complete >= 2 })}></div>
                            <div className={cx('circle', { complete })}></div>
                        </div>
                        <div className={cx('item')}>
                            {txt}
                        </div>

                    </div>
                })}
                <div className={cx('arrow')}
                    style={{ transform: `rotate(180deg)` }}
                    onClick={() => setExpanded(x => !x)}>
                    <img className={cx('semi-circle')} src={open}></img>
                </div>
            </div>


        }
    />
}