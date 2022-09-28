#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

#include "Logger.h"
#include "sendquerypage.h"
#include "createbranchpage.h"

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void TestButtonClicked();
    void TestLineEditTextChanged(QString newText);

    void on_testPushButton_clicked();

    void on_changePageButton_clicked();

private:
    Ui::MainWindow *ui;
    sendquerypage *querypage;
    CreateBranchPage *newbranchpage;
};
#endif // MAINWINDOW_H
