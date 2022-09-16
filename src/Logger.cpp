#include "Logger.h"


///
/// \brief Logger::Log  Prints the log message to the terminal.
/// \param msg          The message to print to the terminal.
/// \param logType      The type of info to display.
/// \return             True if an INFO or DEBUG message was printed.
///                     False if a CRITICAL or FATAL message was printed.
///
bool Logger::Log(QString msg, LogType logType/*= LogType::INFO*/)
{
    switch (logType)
    {
        case LogType::INFO:
        {
            qInfo() << msg;
            return true;
        }
        case LogType::DEBUG:
        {
            qDebug() << msg;
            return true;
        }
        case LogType::CRITICAL:
        {
            qCritical() << msg;
            return false;
        }
        case LogType::FATAL:
        {
            qFatal(msg.toStdString().c_str());
            return false;
        }
    }

    return false;
}
