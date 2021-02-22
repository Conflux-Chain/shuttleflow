import { useState } from 'react'
import triangle from './triangle.svg'
import tickSrc from './tick.svg'
import tickSolidSrc from './tick-solid.svg'
import Accordion from '../component/Accordion'
import styles from './Select.module.scss'
import useStyle from '../component/useStyle'

export default function Select({
  current,
  options,
  setCurrent,
  title,
  border,
  icon,
  right,
  type,
  dropdownTitle,
  render,
}) {
  const [expand, setExpand] = useState(false)
  const currentOption = options.find((x) => x.key === current)
  const [cx] = useStyle(styles)

  return (
    <Accordion
      contentStyle={{ position: 'absolute', top: '5rem', ...{ right } }}
      clickAway={() => setExpand(false)}
      expanded={expand}
      title={
        <div
          className={cx('select-title', 'item', { border })}
          onClick={() => {
            setExpand((x) => {
              return !x
            })
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>
            {title ||
              (render
                ? render({
                    key: (currentOption || options[0]).value,
                    title: true,
                  })
                : (currentOption || options[0]).value)}
          </span>
          {icon && (
            <img
              alt="up"
              className={cx('up', { 'icon-active': expand })}
              src={triangle}
            ></img>
          )}
        </div>
      }
      content={
        <div className={cx('dropdown-container')}>
          {dropdownTitle ? (
            <div className={cx('dropdown-title')}>{dropdownTitle}</div>
          ) : null}
          {options.map(({ key, value }, i) => {
            const selected = key && current && key === current
            return (
              <div
                key={i}
                onClick={() => {
                  if (setCurrent) {
                    setCurrent(key)
                  }
                  setExpand(false)
                }}
                className={cx('dropdown-item', type, {
                  selected,
                })}
              >
                {render ? render({ key }) : value}
                {selected && (
                  <img
                    className={cx('after')}
                    alt="tick"
                    src={type === 'lng' ? tickSrc : tickSolidSrc}
                  ></img>
                )}
              </div>
            )
          })}
        </div>
      }
    ></Accordion>
  )
}
