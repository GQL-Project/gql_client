#include "sendquerypage.h"
#include "ui_sendquerypage.h"
#include "createbranchpage.h"
#include <QWidget>
//#include "connection.pb.h"

sendquerypage::sendquerypage(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::sendquerypage)
{
    ui->setupUi(this);
    // Connect a signal from the testPushButton's QPushButton::clicked() method to this class' MainWindow::TestButtonClicked method.
    connect(ui->pushButton, &QPushButton::clicked, this, &sendquerypage::on_pushButton_clicked);

    // Connect a signal form the sendQuery button to the on_pushButton_clicked() edit
    connect(ui->plainTextEdit, &QPlainTextEdit::textChanged, this, &sendquerypage::on_plainTextEdit_textChanged);

    //db_connection::QueryRequest *qr = new db_connection::QueryRequest();
}

sendquerypage::~sendquerypage()
{
    delete ui;
}

void sendquerypage::on_pushButton_clicked()
{
    QString query = ui->plainTextEdit->toPlainText();
    Logger::Log(QString("Query to send: '%1;").arg(ui->plainTextEdit->toPlainText()));
    //TODO Connect with the backend and execute a query
}

void sendquerypage::on_plainTextEdit_textChanged()
{
}


void sendquerypage::on_newBranch_clicked()
{
    CreateBranchPage newbranchpage;
    newbranchpage.setModal(true);
    newbranchpage.exec();
}

