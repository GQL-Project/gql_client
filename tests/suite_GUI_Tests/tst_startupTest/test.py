# -*- coding: utf-8 -*-

import names


def main():
    startApplication("app")
    sendEvent("QCloseEvent", waitForObject(names.mainWindow_MainWindow))
