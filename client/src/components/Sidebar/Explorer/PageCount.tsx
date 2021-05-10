/* eslint-disable react/prop-types */

import React from 'react';

import Icon from '../common/Icon';

import { ADMIN_URLS } from '../../../config/wagtailConfig';

interface PageCountProps {
    page: {
        id: number;
        children: {
            count: number;
        }
    }
}

const PageCount: React.FunctionComponent<PageCountProps> = ({ page }) => {
    const count = page.children.count;

    return (
        <a
            href={`${ADMIN_URLS.PAGES}${page.id}/`}
            className="c-explorer__see-more"
        >
            {'See all'}{/* GETTEXT */}
            <span>{` ${count} ${count === 1 ? 'Page'.toLowerCase() : 'Pages'.toLowerCase()}`}</span>{/* GETTEXT */}
            <Icon name="arrow-right" />
        </a>
    );
};

export default PageCount;
