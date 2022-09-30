#include "mainwindow.h"
#include "connectwindow.h"

#include <QApplication>

// <KADE DEMO>
#include "db_communication.h"
// </KADE DEMO>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    // <KADE DEMO>
    db_communication *db = new db_communication();
    QString result = db->get_connect_result();
    Logger::Log(result);
    // </KADE DEMO>

    // MainWindow w;
    ConnectWindow c;
    c.show();
    return a.exec();
}
