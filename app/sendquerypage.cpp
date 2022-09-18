#include "sendquerypage.h"
#include "ui_sendquerypage.h"
#include <QWidget>

sendquerypage::sendquerypage(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::sendquerypage)
{
    ui->setupUi(this);
    // Connect a signal from the testPushButton's QPushButton::clicked() method to this class' MainWindow::TestButtonClicked method.
    connect(ui->pushButton, &QPushButton::clicked, this, &sendquerypage::on_pushButton_clicked);

    // Connect a signal from the testLineEdit's QLineEdit::textChanged() method to this class' MainWindow::TestLineEditTextChanged method.
    connect(ui->lineEdit, &QLineEdit::textChanged, this, &sendquerypage::on_lineEdit_textChanged);
}

sendquerypage::~sendquerypage()
{
    delete ui;
}

void sendquerypage::on_pushButton_clicked()
{
    Logger::Log(QString("Query sent: '%1'").arg(ui->lineEdit->text()));
    QString query = ui->lineEdit->text();
}


//void sendquerypage::on_lineEdit_textChanged(const QString &arg1)
//{

//}


void sendquerypage::on_lineEdit_textChanged(const QString &arg1)
{
    Logger::Log(QString("Test Button Clicked. Text in Line Edit:"));
}

