include(../defaults.pri)

QT += testlib
QT += core
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += qt warn_on depend_includepath testcase

TEMPLATE = app

SOURCES += tst_startuptests.cpp

win32 {
    CONFIG(debug, debug|release) {
        LIBS += -L../src/debug -lsrc
    } else {
        LIBS += -L../src/release -lsrc
    }
}

macx {
    LIBS += -L../src -lsrc
}
