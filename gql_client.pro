TEMPLATE = subdirs

CONFIG += ordered

SUBDIRS += \
    src \
    app \
    tests

app.depends = src
tests.depends = src

PRE_TARGETDEPS += $$OUT_PWD/src/debug/src.lib
