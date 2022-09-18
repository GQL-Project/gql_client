#include "connectwindow.h"
#include "ui_connectwindow.h"

ConnectWindow::ConnectWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::ConnectWindow)
{
    ui->setupUi(this);
    connect(ui->connectButton, &QPushButton::clicked, this, &ConnectWindow::ConnectButtonClicked);
    ui->errorLabel->hide();
}

ConnectWindow::~ConnectWindow()
{
    delete ui;
}

void ConnectWindow::ConnectButtonClicked()
{
    bool invalid = false;
    // Input validation loop - highlights empty text fields and displays error label above form submit button
    const auto inputList = ui->formLayoutWidget->findChildren<QLineEdit *>();
    for (QLineEdit * input: inputList) {
        if (input->text().isEmpty()) {
            input->setStyleSheet("border: 1px solid red");
            invalid = true;
        }
        else {
            input->setStyleSheet("border: none");
        }
    }
    if (invalid) {
        ui->errorLabel->show();
        return;
    }
    ui->errorLabel->hide();

    QString username = ui->enterUsernameLineEdit->text();
    QString password = ui->enterPasswordLineEdit->text();
    QString ip = ui->enterIPAddressLineEdit->text();
    QString port = ui->enterPortLineEdit->text();

    Logger::Log(QString("Connect Button Clicked"));
    Logger::Log(QString("Username: %1 Password: %2 IP: %3 Port: %4").arg(username, password, ip, port), Logger::LogType::DEBUG);
}
