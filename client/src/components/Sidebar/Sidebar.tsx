import React from 'react';
import styled from 'styled-components';

import { ExplorerContext, ShellProps } from '.';
import {SearchInput} from './SearchInput';
import {Menu} from './Menu';
import { Logo } from './Logo';

// @ts-ignore
// import LeftArrowIcon from '../icons/angle-double-left-solid.svg';
// @ts-ignore
// import RightArrowIcon from '../icons/angle-double-right-solid.svg';

const InnerWrapper = styled.div`
    height: 100%;
    background: #333;  // $nav-grey-1
    // On medium, make it possible for the nav links to scroll.
    display: flex;
    flex-flow: column nowrap;
`;

const CollapseToggleWrapper = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    color: #ccc;
    background-color: transparent;
    border: none;
    padding: 7px;
    margin: 2px;
    margin-right: 7px;
    border-radius: 3px;

    &:hover {
        background-color: rgba(100,100,100,0.15);
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

const ExplorerWrapper = styled.div`
    box-sizing: border-box;
    display: flex;
    flex: 1;

    * {
        box-sizing: border-box;
    }
`;

interface SidebarProps extends ShellProps {
    collapsed: boolean;
    onCollapse(collapse: boolean): void;
}

export const Sidebar: React.FunctionComponent<SidebarProps> =  ({homeUrl, logoImages, explorerStartPageId, searchUrl, menuItems, user, accountUrl, logoutUrl, collapsed, onCollapse}) => {
    const explorerWrapperRef = React.useRef<HTMLDivElement | null>(null);

    const onClickCollapseToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        onCollapse(!collapsed);
    };

    const navigate = (url: string) => {
        window.location.href = url;

        return Promise.resolve();
    };

    return (
        <>
            <InnerWrapper>
                <CollapseToggleWrapper onClick={onClickCollapseToggle} className="button">
                    {collapsed ? "Open" : "Close"}
                </CollapseToggleWrapper>

                <Logo collapsed={collapsed} images={logoImages} homeUrl={homeUrl} navigate={navigate} />

                <SearchInput collapsed={collapsed} searchUrl={searchUrl} navigate={navigate} />

                <ExplorerContext.Provider value={{startPageId: explorerStartPageId, wrapperRef: explorerWrapperRef}}>
                    <Menu collapsed={collapsed} activeUrl={window.location.pathname} user={user} accountUrl={accountUrl} logoutUrl={logoutUrl} menuItems={menuItems} navigate={navigate} />
                </ExplorerContext.Provider>
            </InnerWrapper>
            <ExplorerWrapper ref={explorerWrapperRef} data-explorer-menu />
        </>
    );
};
