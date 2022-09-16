#ifndef LOGGER_H
#define LOGGER_H

#include "src_global.h"
#include <QString>
#include <QDebug>

class SRC_EXPORT Logger
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
