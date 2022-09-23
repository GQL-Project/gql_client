# -*- coding: utf-8 -*-

import names


def main():
    startApplication("app")
    clickButton(waitForObject(names.mainWindow_changePageButton_QPushButton))
    mouseClick(waitForObject(names.sendquerypage_lineEdit_QLineEdit), 78, 21, Qt.NoModifier, Qt.LeftButton)
    type(waitForObject(names.sendquerypage_lineEdit_QLineEdit), "testing123")
    clickButton(waitForObject(names.sendquerypage_pushButton_QPushButton))
