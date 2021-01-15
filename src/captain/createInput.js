import { ErrorMessage } from '@hookform/error-message'
import WithQuestion from '../component/WithQuestion'
//NOTICE:
//input should NOT be a component, i.e. not Input
//remounted Conponent can not be identified by register
export default function createInput({
  label,
  name,
  readOnly,
  onReadonly,
  unit,
  decimals,
  errors,
  register,
  inputCx,
  formCx,
  t,
  clickLabel,
}) {
  let oldValue
  return (
    <div key={label}>
      <div
        onClick={readOnly ? onReadonly : undefined}
        className={
          inputCx('input-common', errors[name] ? 'error' : '') +
          ' ' +
          formCx('input-container')
        }
      >
        <div className={formCx('label')}>
          {clickLabel ? (
            <WithQuestion onClick={clickLabel}>{t(label)}</WithQuestion>
          ) : (
            t(label)
          )}
        </div>
        <input
          ref={register}
          name={name}
          autoComplete="off"
          readOnly={readOnly}
          data-lpignore="true"
          className={inputCx('input-common') + ' ' + formCx('input')}
          placeholder={t('enter')}
          onKeyDown={(e) => {
            oldValue = e.target.value
          }}
          onChange={(e) => {
            const value = e.target.value
            let [p0, p1] = (value + '').split('.')
            if ((p0 && p0.length > 40) || (p1 && p1.length > decimals)) {
              e.target.value = oldValue
            }
          }}
        />
        <div className={formCx('after')}>
          {unit && unit.length > 10 ? unit.slice(0, 10) + '...' : unit}
        </div>
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => {
          return <p className={formCx('error')}>{t(message)}</p>
        }}
      />
    </div>
  )
}
