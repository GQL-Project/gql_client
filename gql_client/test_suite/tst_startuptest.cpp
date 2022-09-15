#include <QtTest>
#include <QCoreApplication>

// add necessary includes here

class StartupTest : public QObject
{
    Q_OBJECT

public:
    StartupTest();
    ~StartupTest();

private slots:
    void initTestCase();
    void cleanupTestCase();
    void test_case1();

};

StartupTest::StartupTest()
{

}

StartupTest::~StartupTest()
{

}

void StartupTest::initTestCase()
{

}

void StartupTest::cleanupTestCase()
{

}

void StartupTest::test_case1()
{

}

QTEST_MAIN(StartupTest)

#include "tst_startuptest.moc"
