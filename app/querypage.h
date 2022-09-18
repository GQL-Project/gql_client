#ifndef QUERYPAGE_H
#define QUERYPAGE_H

#include <QWidget>

namespace Ui {
class querypage;
}

class querypage : public QWidget
{
    Q_OBJECT

public:
    explicit querypage(QWidget *parent = nullptr);
    ~querypage();

private:
    Ui::querypage *ui;
};

#endif // QUERYPAGE_H
