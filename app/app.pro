include(../defaults.pri)

QT += core gui

app.depends = src

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

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

#INCLUDEPATH += C:/GQL/protobuf-3.21.5/src

#LIBS += -LC:/GQL/protobuf-3.21.5/out/build/x64-Debug -llibprotocd
#LIBS += -LC:/GQL/protobuf-3.21.5/out/build/x64-Debug -llibprotobufd

#app.depends = src

#PRE_TARGET_DEPS += ../src/debug/src.lib
#LIBS += -L../src/debug -lsrc

win32 {
    CONFIG(debug, debug|release) {
        #LIBS += -L../src/debug -lsrc
    } else {
        #LIBS += -L../src/release -lsrc
    }
}

macx {
    #LIBS += -L../src -lsrc
}

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

RESOURCES += \
    assets.qrc
