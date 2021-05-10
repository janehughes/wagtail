import React, { MutableRefObject } from 'react';
import styled, { css } from 'styled-components';

import {SearchInput} from './SearchInput';
import {Menu} from './Menu';
import { Logo, LogoImages } from './Logo';
import Icon from './common/Icon';
import * as mixins from './common/mixins';

// A React context to pass some data down to the ExplorerMenuItem component
interface ExplorerContext {
    startPageId: number | null;
    wrapperRef: MutableRefObject<HTMLDivElement | null> | null;
}
export const ExplorerContext = React.createContext<ExplorerContext>({startPageId: null, wrapperRef: null});

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

interface WrapperProps {
    collapsed: boolean;
}

const SidebarWrapper = styled.aside<WrapperProps>`
    position: fixed;
    left: 0;
    width: 200px;  // $menu-width;
    float: left;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #333;  // $nav-grey-1;
    z-index: 1;

    ${mixins.transition('width 0.3s ease')}

    ${(props) => props.collapsed && css`
        width: 50px;
    `}
`;

export interface SidebarProps {
    homeUrl: string;
    logoImages: LogoImages
    explorerStartPageId: number | null;
    searchUrl: string;
    menuItems: any;
    user: {
        name: string;
        avatarUrl: string;
    };
    accountUrl: string;
    logoutUrl: string;
}

const usePersistedState = <T, _>(key: string, defaultValue: T): [T, (value: T) => void]  => {
    const value = localStorage.getItem(key);
    const [state, setState] = React.useState(
        value ? JSON.parse(value) : defaultValue
    );
    React.useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
}

export const Sidebar: React.FunctionComponent<SidebarProps> =  ({homeUrl, logoImages, explorerStartPageId, searchUrl, menuItems, user, accountUrl, logoutUrl}) => {
    const explorerWrapperRef = React.useRef<HTMLDivElement | null>(null);
    const [collapsed, setCollapsed] = usePersistedState('wagtail-sidebar-collapsed', window.innerWidth < 800);

    const onClickCollapseToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setCollapsed(!collapsed);
    };

    const navigate = (url: string) => {
        window.location.href = url;

        return Promise.resolve();
    };

    return (
        <SidebarWrapper collapsed={collapsed}>
            <InnerWrapper>
                <CollapseToggleWrapper onClick={onClickCollapseToggle} className="button">
                    {collapsed ? <Icon name="angle-double-right" /> : <Icon name="angle-double-left" />}
                </CollapseToggleWrapper>

                <Logo collapsed={collapsed} images={logoImages} homeUrl={homeUrl} navigate={navigate} />

                <SearchInput collapsed={collapsed} searchUrl={searchUrl} navigate={navigate} />

                <ExplorerContext.Provider value={{startPageId: explorerStartPageId, wrapperRef: explorerWrapperRef}}>
                    <Menu collapsed={collapsed} activeUrl={window.location.pathname} user={user} accountUrl={accountUrl} logoutUrl={logoutUrl} menuItems={menuItems} navigate={navigate} />
                </ExplorerContext.Provider>
            </InnerWrapper>
            <ExplorerWrapper ref={explorerWrapperRef} data-explorer-menu />
        </SidebarWrapper>
    );
};
