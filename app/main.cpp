#include "mainwindow.h"
#include "connectwindow.h"

#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
//    MainWindow w;
    ConnectWindow c;
    c.show();
    return a.exec();
}
