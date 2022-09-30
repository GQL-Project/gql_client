QT -= gui

TEMPLATE = lib
DEFINES += SRC_LIBRARY

CONFIG += staticlib
CONFIG += c++11

# This allows us to dynamically link protobuf into the app
DEFINES += PROTOBUF_USE_DLLS

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    Logger.cpp \
    connection.pb.cc \
    db_comms.cpp

HEADERS += \
    connection.pb.h \
    Logger.h \
    db_comms.h

INCLUDEPATH += ../../builds/include

# Add include path for protobuf sources
# This is found at https://github.com/protocolbuffers/protobuf/releases  -->  protobuf-cpp-3.21.5.zip
INCLUDEPATH += C:/GQL/protobuf-3.21.5/src

# These are the libraries that were generated from compiling the above source
LIBS += -LC:/GQL/protobuf-3.21.5/out/build/x64-Debug -llibprotocd
LIBS += -LC:/GQL/protobuf-3.21.5/out/build/x64-Debug -llibprotobufd

# Default rules for deployment.
unix {
    target.path = /usr/lib
}
!isEmpty(target.path): INSTALLS += target
