# encoding: UTF-8

from objectmaphelper import *

mainWindow_MainWindow = {"name": "MainWindow", "type": "MainWindow", "visible": 1}
mainWindow_changePageButton_QPushButton = {"name": "changePageButton", "type": "QPushButton", "visible": 1, "window": mainWindow_MainWindow}
sendquerypage_sendquerypage = {"name": "sendquerypage", "occurrence": 2, "type": "sendquerypage", "visible": 1}
sendquerypage_lineEdit_QLineEdit = {"name": "lineEdit", "type": "QLineEdit", "visible": 1, "window": sendquerypage_sendquerypage}
sendquerypage_pushButton_QPushButton = {"name": "pushButton", "type": "QPushButton", "visible": 1, "window": sendquerypage_sendquerypage}
mainWindow_plainTextEdit_QPlainTextEdit = {"name": "plainTextEdit", "occurrence": 2, "type": "QPlainTextEdit", "visible": 1, "window": mainWindow_MainWindow}
