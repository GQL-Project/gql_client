#include "MainWindow.h"
#include <QtWidgets/QApplication>

/// <summary>
/// This is the entrance point for the entire program.
/// It is only in charge of starting up the first window.
/// </summary>
/// <param name="argc"></param>
/// <param name="argv"></param>
/// <returns></returns>
int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    w.show();
    return a.exec();
}
