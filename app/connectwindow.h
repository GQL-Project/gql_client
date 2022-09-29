#ifndef CONNECTWINDOW_H
#define CONNECTWINDOW_H

#include <QMainWindow>

#include "Logger.h"

namespace Ui {
class ConnectWindow;
}

class ConnectWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit ConnectWindow(QWidget *parent = nullptr);
    ~ConnectWindow();

private slots:
    void ConnectButtonClicked();

private:
    Ui::ConnectWindow *ui;
};

#endif // CONNECTWINDOW_H
