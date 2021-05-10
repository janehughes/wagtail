import functools

from django.test import TestCase

from wagtail.admin.menu import Menu, MenuItem
from wagtail.core import hooks
from wagtail.core.telepath import JSContext


def menu_item_hook(*args, **kwargs):
    def hook_fn():
        return MenuItem(*args, **kwargs),

    return hook_fn


class TestMenu(TestCase):
    def test_simple_menu(self):
        # Note: initialise the menu before registering hooks as this is what happens in reality.
        # (the real menus are initialised at the module level in admin/menu.py)
        menu = Menu(register_hook_name='register_menu_item')

        with hooks.register_temporarily('register_menu_item', menu_item_hook("Pages", '/pages/')), hooks.register_temporarily('register_menu_item', menu_item_hook("Images", '/images/')):
            context = JSContext()
            packed = context.pack(menu)

        self.assertEqual(packed, {
            '_type': 'wagtail.menu.Menu',
            '_args': [
                [
                    [
                        {
                            '_type': 'wagtail.menu.MenuItem',
                            '_args': [
                                {
                                    'name': 'pages',
                                    'url': '/pages/',
                                    'classnames': '',
                                    'icon_name': '',
                                    'attr_string': '',
                                    'label': 'Pages'
                                }
                            ]
                        }
                    ],
                    [
                        {
                            '_type': 'wagtail.menu.MenuItem',
                            '_args': [
                                {
                                    'name': 'images',
                                    'url': '/images/',
                                    'classnames': '',
                                    'icon_name': '',
                                    'attr_string': '',
                                    'label': 'Images'
                                }
                            ]
                        }
                    ]
                ]
            ]
        })

    def test_menu_with_construct_hook(self):
        # Note: initialise the menu before registering hooks as this is what happens in reality.
        # (the real menus are initialised at the module level in admin/menu.py)
        menu = Menu(register_hook_name='register_menu_item', construct_hook_name='construct_menu')

        def remove_images(items):
            items[:] = [item for item in items if not item.name == 'images']

        with hooks.register_temporarily('register_menu_item', menu_item_hook("Pages", '/pages/')), hooks.register_temporarily('register_menu_item', menu_item_hook("Images", '/images/')):
            with hooks.register_temporarily('construct_menu', remove_images):
                context = JSContext()
                packed = context.pack(menu)

        self.assertEqual(packed, {
            '_type': 'wagtail.menu.Menu',
            '_args': [
                [
                    [
                        {
                            '_type': 'wagtail.menu.MenuItem',
                            '_args': [
                                {
                                    'name': 'pages',
                                    'url': '/pages/',
                                    'classnames': '',
                                    'icon_name': '',
                                    'attr_string': '',
                                    'label': 'Pages'
                                }
                            ]
                        }
                    ]
                ]
            ]
        })

    def test_submenu(self):
        pass
