from typing import List

from django import forms
from django.utils.functional import cached_property
from wagtail.admin.staticfiles import versioned_static
from wagtail.core.telepath import adapter, Adapter


class BaseMenuItemAdapter(Adapter):
    @cached_property
    def media(self):
        return forms.Media(js=[
            versioned_static('wagtailadmin/js/telepath/main-menu.js'),
        ])


class MenuItem:
    def __init__(self, label: str, icon_name: str=None):
        self.label = label
        self.icon_name = icon_name

    def adapt(self):
        return [
            {
                'label': self.label,
                'icon_name': self.icon_name,
            }
        ]


@adapter('wagtail.main_menu.Menu', base=BaseMenuItemAdapter)
class Menu:
    def __init__(self, items: List[MenuItem]):
        self.items = items

    def adapt(self):
        return [
            self.items,
        ]


@adapter('wagtail.main_menu.LinkMenuItem', base=BaseMenuItemAdapter)
class LinkMenuItem(MenuItem):
    def __init__(self, label: str, url: str, icon_name: str=None):
        super().__init__(label, icon_name=icon_name)
        self.url = url

    def adapt(self):
        args = super().adapt()
        args[0]['url'] = self.url
        return args


@adapter('wagtail.main_menu.SubMenuItem', base=BaseMenuItemAdapter)
class SubMenuItem(MenuItem):
    def __init__(self, label: str, menu: Menu, icon_name: str=None):
        super().__init__(label, icon_name=icon_name)
        self.menu = menu

    def adapt(self):
        args = super().adapt()
        args.append(self.menu)
        return args


@adapter('wagtail.main_menu.PageExplorerMenuItem', base=BaseMenuItemAdapter)
class PageExplorerMenuItem(LinkMenuItem):
    def __init__(self, label: str, url: str, start_page_id: int, icon_name: str=None):
        super().__init__(label, url, icon_name=icon_name)
        self.start_page_id = start_page_id

    def adapt(self):
        args = super().adapt()
        args.append(self.start_page_id)
        return args


@adapter('wagtail.main_menu.SettingsMenuItem', base=BaseMenuItemAdapter)
class SettingsMenuItem(SubMenuItem):
    pass
