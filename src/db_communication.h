#ifndef DB_COMMUNICATION_H
#define DB_COMMUNICATION_H

#include <QString>
#include <QSharedPointer>
#include "connection.pb.h"

class db_communication
{
public:
    db_communication();
    QString get_connect_result();

private:
    QSharedPointer<db_connection::ConnectResult> connectResult;
};

#endif // DB_COMMUNICATION_H
