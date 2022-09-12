#pragma once

#include <QtWidgets/QMainWindow>
#include <QDebug>
#include "ui_MainWindow.h"

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

public slots:
    // This is how you catch signals from UI elements.
    // You name the method 'on_<element name>_<element signal>(<element params>);
    void on_testButton_clicked();
    void on_testTextBox_textChanged(QString newText);

private:
    Ui::MainWindowClass ui;
};
