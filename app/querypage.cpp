#include "querypage.h"
#include "ui_querypage.h"

querypage::querypage(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::querypage)
{
    ui->setupUi(this);
}

querypage::~querypage()
{
    delete ui;
}
