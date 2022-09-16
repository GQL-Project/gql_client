#include <QtTest>
#include <QCoreApplication>

// add necessary includes here
#include "Logger.h"

class StartupTests : public QObject
{
    Q_OBJECT

public:
    StartupTests();
    ~StartupTests();

private slots:
    void initTestCase();
    void cleanupTestCase();
    void test_case1();

};

StartupTests::StartupTests()
{

}

StartupTests::~StartupTests()
{

}

void StartupTests::initTestCase()
{

}

void StartupTests::cleanupTestCase()
{

}

void StartupTests::test_case1()
{
    QVERIFY(Logger::Log("Testing") == true);
    QVERIFY(false);
}

QTEST_MAIN(StartupTests)

#include "tst_startuptests.moc"
