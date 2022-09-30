#include "db_communication.h"

db_communication::db_communication()
{
    // Just allocate a new ConnectResult and set its value
    connectResult = QSharedPointer<db_connection::ConnectResult>(new db_connection::ConnectResult());
    connectResult->set_id("Dummy Test ID");
}


///
/// \brief send_db_query  Create a dummy function that just returns a value from protoc to test it works
/// \return
///
QString db_communication::get_connect_result()
{
    return QString::fromStdString(connectResult->id());
}
