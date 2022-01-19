import ReactDOM from 'react-dom';
import React, { Suspense } from 'react';
import { withRouter } from 'react-router';

export function suspenseLoad(promise) {
    const Component = withRouter(React.lazy(() => promise))
    return () => <Suspense fallback="loading">
        <Component />
    </ Suspense>
}