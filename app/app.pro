include(../defaults.pri)

QT += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

# This allows us to dynamically link protobuf into the app
DEFINES += PROTOBUF_USE_DLLS

CONFIG += c++11

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    connectwindow.cpp \
    createbranchpage.cpp \
    main.cpp \
    mainwindow.cpp \
    sendquerypage.cpp

HEADERS += \
    connectwindow.h \
    createbranchpage.h \
    mainwindow.h \
    sendquerypage.h

FORMS += \
    connectwindow.ui \
    mainwindow.ui \
    sendquerypage.ui \
    createbranchpage.ui \
    mainwindow.ui

INCLUDEPATH += ../../builds/include

# Add include path for protobuf sources
# This is found at https://github.com/protocolbuffers/protobuf/releases  -->  protobuf-cpp-3.21.5.zip
INCLUDEPATH += C:/GQL/protobuf-3.21.5/src

# These are the libraries that were generated from compiling the above source
LIBS += -LC:/GQL/protobuf-3.21.5/out/build/x64-Debug-2 -llibprotocd
LIBS += -LC:/GQL/protobuf-3.21.5/out/build/x64-Debug-2 -llibprotobufd
LIBS += -LC:/GQL/protobuf-3.21.5/out/build/x64-Debug-2 -llibprotobuf-lited

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

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

RESOURCES += \
    assets.qrc
