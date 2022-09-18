#ifndef SENDQUERYPAGE_H
#define SENDQUERYPAGE_H

#include <QWidget>

#include "Logger.h"

namespace Ui {
class sendquerypage;
}

class sendquerypage : public QWidget
{
    Q_OBJECT

public:
    explicit sendquerypage(QWidget *parent = nullptr);
    ~sendquerypage();

private slots:
    void on_pushButton_clicked();

   // void on_lineEdit_textChanged(const QString &arg1);

   // void on_textEdit_textChanged();

    void on_plainTextEdit_textChanged();

private:
    Ui::sendquerypage *ui;
};

#endif // SENDQUERYPAGE_H
