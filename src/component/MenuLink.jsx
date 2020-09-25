import { useRouteMatch } from 'react-router-dom'

export default function MenuLink({ render, to, exact }) {
  const active = useRouteMatch({
    path: to,
    exact,
  })

  return render({ active: !!active })
}
