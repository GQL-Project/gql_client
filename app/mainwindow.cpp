#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QDebug>
#include "sendquerypage.h"


MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // Connect a signal from the testPushButton's QPushButton::clicked() method to this class' MainWindow::TestButtonClicked method.
    connect(ui->testPushButton, &QPushButton::clicked, this, &MainWindow::TestButtonClicked);

    // Connect a signal from the testLineEdit's QLineEdit::textChanged() method to this class' MainWindow::TestLineEditTextChanged method.
    connect(ui->testLineEdit, &QLineEdit::textChanged, this, &MainWindow::TestLineEditTextChanged);

    connect(ui->changePageButton, &QPushButton::clicked, this, &MainWindow::on_changePageButton_clicked);
}


MainWindow::~MainWindow()
{
    delete ui;
}


///
/// \brief MainWindow::TestButtonClicked
/// A slot that gets triggered every time the testPushButton is pressed.
///
void MainWindow::TestButtonClicked()
{
    Logger::Log(QString("Test Button Clicked. Text in Line Edit: '%1'").arg(ui->testLineEdit->text()));
}


///
/// \brief MainWindow::TestLineEditTextChanged
/// A slot that gets triggered every time the text in testLineEdit gets modified.
/// \param newText  The text that is now currently in the line edit.
///
void MainWindow::TestLineEditTextChanged(QString newText)
{
    Logger::Log(newText);
}

void MainWindow::on_testPushButton_clicked()
{
    Logger::Log(QString("Test clicked").arg(ui->testLineEdit->text()));
}


void MainWindow::on_changePageButton_clicked()
{
   Logger::Log(QString("Changing pages now...").arg(ui->testLineEdit->text()));
   auto newWindow = new sendquerypage();
   newWindow->show();
   close();
}

