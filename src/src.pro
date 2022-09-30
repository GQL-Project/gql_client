QT -= gui

TEMPLATE = lib
DEFINES += SRC_LIBRARY

CONFIG += staticlib
CONFIG += c++11

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    Logger.cpp \
    connection.pb.cc

HEADERS += \
    connection.pb.h \
    src_global.h \
    Logger.h

INCLUDEPATH += ../../builds/include

INCLUDEPATH += C:/GQL/protobuf-3.21.5/src

LIBS += -LC:/GQL/protobuf-3.21.5/out/build/x64-Debug -llibprotocd
LIBS += -LC:/GQL/protobuf-3.21.5/out/build/x64-Debug -llibprotobufd

# Default rules for deployment.
unix {
    target.path = /usr/lib
}
!isEmpty(target.path): INSTALLS += target
