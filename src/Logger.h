#ifndef LOGGER_H
#define LOGGER_H

#include <QString>
#include <QDebug>

class Logger
{
public:
    enum LogType
    {
        INFO     = 0,
        DEBUG    = 1,
        CRITICAL = 2,
        FATAL    = 3
    };

    static bool Log(QString msg, LogType logType = LogType::INFO);
};

#endif // LOGGER_H
