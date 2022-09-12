#include "MainWindow.h"


/// <summary>
/// Creates a new main window object.
/// </summary>
/// <param name="parent"></param>
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
{
    ui.setupUi(this);
}


/// <summary>
/// Destructor for main window.
/// </summary>
MainWindow::~MainWindow()
{
    exit(0);
}


/// <summary>
/// This method gets called every time the testButton is pressed.
/// </summary>
void MainWindow::on_testButton_clicked()
{
    qInfo() << "Button Pressed";
}


/// <summary>
/// This method gets called every time the text within the testTextBox gets changed.
/// Is called every time a keypress is made.
/// </summary>
/// <param name="newText">The text that is currently in the text box</param>
void MainWindow::on_testTextBox_textChanged(QString newText)
{
    qInfo() << "Text Updated: " << newText;
}