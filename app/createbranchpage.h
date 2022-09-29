#ifndef CREATEBRANCHPAGE_H
#define CREATEBRANCHPAGE_H

#include <QDialog>

namespace Ui {
class CreateBranchPage;
}

class CreateBranchPage : public QDialog
{
    Q_OBJECT

public:
    explicit CreateBranchPage(QWidget *parent = nullptr);
    ~CreateBranchPage();

private slots:
    void on_createBranch_accepted();

private:
    Ui::CreateBranchPage *ui;
};

#endif // CREATEBRANCHPAGE_H
