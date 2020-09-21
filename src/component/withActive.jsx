import React from 'react'
import {
    Switch,
    Route,
    Link, Redirect,
    useRouteMatch
} from "react-router-dom";

const withActive = ({ path, exact }) => {
    const active = useRouteMatch({ path, exact });
    return Component => (<Component active={active} />)
}

export default withActive