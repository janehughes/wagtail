import React, { MutableRefObject } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

import {LogoImages} from './Logo';

import {Sidebar} from './Sidebar';
import * as mixins from './common/mixins';

export type Mode = 'browser' | 'modal';

// A React context to pass some data down to the ExplorerMenuItem component
interface ExplorerContext {
    startPageId: number | null;
    wrapperRef: MutableRefObject<HTMLDivElement | null> | null;
}
export const ExplorerContext = React.createContext<ExplorerContext>({startPageId: null, wrapperRef: null});

export interface ShellProps {
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

interface WrapperProps {
    collapsed: boolean;
}

const ShellWrapper = styled.div<WrapperProps>`
    height: 100vh;
    padding-left: 200px;  // menu-width
    ${mixins.transition('padding-left 0.3s ease')}

    ${(props) => props.collapsed && css`
    padding-left: 50px;
    `}
`;

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

const Shell: React.FunctionComponent<ShellProps> = (props) => {
    const [collapsed, setCollapsed] = usePersistedState('wagtail-sidebar-collapsed', window.innerWidth < 800);

    return (
        <ShellWrapper collapsed={collapsed}>
            <SidebarWrapper collapsed={collapsed} className={collapsed ? 'sidebar-collapsed' : ''}>
                <Sidebar {...props} collapsed={collapsed} onCollapse={setCollapsed} />
            </SidebarWrapper>
        </ShellWrapper>
    );
}

export function initSidebar() {
    const element = document.getElementById('wagtail-sidebar');

    if (element instanceof HTMLElement && element.dataset.props) {
        const props = JSON.parse(element.dataset.props);

        ReactDOM.render(
            <Shell {...props}  />,
            element,
            () => {
                document.body.classList.add('ready');
            }
        );
    }
}
