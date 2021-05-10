class MenuDefinition {
    constructor(items) {
        this.items = items;
    }
}

class LinkMenuItemDefinition {
    constructor({ label, url, icon_name = null }) {
        this.label = label;
        this.url = url;
        this.iconName = icon_name;
    }
}

class SubMenuItemDefinition {
    constructor({ label, menu, icon_name = null }) {
        this.label = label;
        this.menu = menu;
        this.iconName = icon_name;
    }
}

class PageExplorerMenuItemDefinition {
    constructor({ label, url, start_page_id, icon_name = null }) {
        this.label = label;
        this.url = url;
        this.startPageId = start_page_id;
        this.iconName = icon_name;
    }
}

class SettingsMenuItemDefinition extends SubMenuItemDefinition {
    constructor({ label, menu, icon_name = null }) {
        this.label = label;
        this.menu = menu;
        this.iconName = icon_name;
    }
}

window.telepath.register('wagtail.main_menu.Menu', MenuDefinition);
window.telepath.register('wagtail.main_menu.LinkMenuItem', LinkMenuItemDefinition);
window.telepath.register('wagtail.main_menu.SubMenuItem', SubMenuItemDefinition);
window.telepath.register('wagtail.main_menu.PageExplorerMenuItem', PageExplorerMenuItemDefinition);
window.telepath.register('wagtail.main_menu.SettingsMenuItem', SettingsMenuItemDefinition);
