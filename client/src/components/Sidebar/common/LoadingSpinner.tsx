import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';

const LoadingSpinnerIcon = styled(Icon)`
    display: inline-block;
    width: 1em;
    height: 1em;
    animation: spin 0.5s infinite linear;
`;

/**
 * A loading indicator with a text label next to it.
 */
const LoadingSpinner: React.FunctionComponent = () => (
    <span>
        <LoadingSpinnerIcon name="spinner" />{'Loading...'}{/* GETTEXT */}
    </span>
);

export default LoadingSpinner;
