#ifndef DB_COMMS_H
#define DB_COMMS_H

#include <QString>
#include <QSharedPointer>
#include "connection.pb.h"

class db_comms
{
public:
    db_comms();
    QString get_connect_result();
    QSharedPointer<db_connection::ConnectResult> get_connect_result_object() { return connectResult; };

private:
    QSharedPointer<db_connection::ConnectResult> connectResult;
};

#endif // DB_COMMS_H
