#include "createbranchpage.h"
#include "ui_createbranchpage.h"
#include "Logger.h"


CreateBranchPage::CreateBranchPage(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::CreateBranchPage)
{
    ui->setupUi(this);
}

CreateBranchPage::~CreateBranchPage()
{
    delete ui;
}

void CreateBranchPage::on_createBranch_accepted()
{
     QString branchName = ui->lineEdit->text();
     Logger::Log(QString("Branch Name: %1").arg(ui->lineEdit->text()));
     //TODO Implement business logic for creating a branch and checking that a branch with the same name does not already exist
}


