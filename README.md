# GQL CLient

<b>Table of Contents</b>
- [GQL Client Structure](https://github.com/GQL-Project/gql_client/blob/main/README.md#gql-client-structure)
- [Setting Up Qt](https://github.com/GQL-Project/gql_client/blob/main/README.md#setting-up-qt)

## GQL Client Structure

  The client is composed of 3 primary directories.
  * `app` - This contains all the UI interfaces and their classes.
  * `src` - This contains all the code that can be separated from the UI classes. Essentially the 'business logic' of the client side.
  * `tests` - As the name implies, this only contains the automated unit test files for the GQL client. **NOTE:** the tests are only for the `src` folder. The GUI cannot be unit tested.
  
  Running the unit tests can be done two ways. The first, just right-click the tests folder and click `run`.
  
  <kbd>![image](https://user-images.githubusercontent.com/54650222/190542187-6ca11a51-cdb8-49db-aad5-4a8a60449159.png)</kbd>
  
  The second way is to press the `Test Results` tab at the bottom and then hit the play button.
  
  <kbd>![image](https://user-images.githubusercontent.com/54650222/190542330-2d1d3b36-45a9-40b8-a017-dcf705c1cb61.png)</kbd>

## Setting Up QT
 - This is assuming you have VS 2019 installed. If you don't, that's fine. Just make sure during the installation steps, you choose the correct compiler (VS 2019 is MSVC2019).
 
 - Go to [this page](https://www.qt.io/download-open-source) to download the installer. It will auto-detect your OS, so just download the installer it recommends.
 
 <kbd>![QtInstaller](https://user-images.githubusercontent.com/54650222/189672746-9aab5ff5-a17a-4d71-96fd-1f7479b08a5d.gif)</kbd>
 
 <kbd>![image](https://user-images.githubusercontent.com/54650222/189673094-d3dd618a-1477-45b1-989b-d9ca8cc6a340.png)</kbd>
 
 - We are using the open source version, so you will have to create an account with your purdue email. Then you can just sign in.
 
 <kbd>![QtInstallerLogin](https://user-images.githubusercontent.com/54650222/189674881-7322b7b4-2702-49a6-a833-e8fe58cd581a.gif)</kbd>
 
 - Next we will need to choose the directory to install it to. I chose `C:\Qt`. <b>Make sure you know where it is installed</b>.
 
 <kbd>![QtInstallerDirectory](https://user-images.githubusercontent.com/54650222/189675783-f9693681-d08b-48d0-8dcf-71f4ee0f7a91.gif)</kbd>
 
 - Now we need to select the components we want. The version here is especially important: <b>5.15.2</b>. This will be slightly different for Mac. Especially the MSVC2019 stuff. I'm not sure exactly what that will need to be for Mac.
 
 <kbd>![image](https://user-images.githubusercontent.com/54650222/189676912-4be576e1-c762-4d6c-885c-fb33b6410ff2.png)</kbd>

 <kbd>![image](https://user-images.githubusercontent.com/54650222/189677123-287be466-1ebc-420e-9abd-24135f0c9ee1.png)</kbd>
 
 <kbd>![QtInstallerOptions](https://user-images.githubusercontent.com/54650222/189677237-f6ffc2d0-cce5-4f2f-bc99-117212e9d247.gif)</kbd>
 
 - <b>UPDATE: make sure to add the Qt Debug Information Files</b>
 
 <kbd>![image](https://user-images.githubusercontent.com/54650222/190489256-2d3d03cd-5860-4306-b804-05a84d84b04a.png)</kbd>
 
 - After that, just navigate through the rest of installer using the defaults. This will take about 4 GB of space, so make sure you have enough.
 
 - After the installation has finished, it should look similar to this.
 
 <kbd>![image](https://user-images.githubusercontent.com/54650222/189677744-ee5ce16a-760c-46c4-99a3-bbca9a132e95.png)</kbd>
 
 - The main directory for the libraries and stuff is within the `5.15.2/msvc2019_64` folder.
 
 <kbd>![QtMainFolder](https://user-images.githubusercontent.com/54650222/189678351-6bca2adb-7a44-4178-b1ec-e2b6fc66757f.gif)<kbd>

 - Go to your environment variables within your system settings. Make sure this is done in the system level environment variables, NOT the user level ones. We need to add the binaries to our PATH environment variable, which is `C:\Qt\5.15.2\msvc2019_64\bin` for me.
 
 <kbd>![QtMainFolder](https://user-images.githubusercontent.com/54650222/189679778-b0254fc3-ce99-4869-9974-6dcf78b4c207.gif)</kbd>
 
 - Now we need to create some new environment variables that are specific to QT. `QTDIR` must be set to the base directory of your QT libraries, which is `C:\Qt\5.15.2\msvc2019_64\bin` for me.
 
 <kbd>![QtDirEnvVar](https://user-images.githubusercontent.com/54650222/189681281-0847d663-5346-4867-a7f3-68eba6969754.gif)</kbd>
 
 - Now we need to make another named `QT_PLUGIN_PATH`, which points to the QT plugin directory. That is `C:\Qt\5.15.2\msvc2019_64\plugins` for me.
 
 <kbd>![QtPluginEnvVar](https://user-images.githubusercontent.com/54650222/189681869-7093d023-b084-4d26-a567-ce8e441783ed.gif)</kbd>
 
 - Now we need to make another named `QtMsBuild`, which points to compilation files. We can use the directory `%LOCALAPPDATA%\QtMsBuild` on Windows, which evaluates to `C:\Users\Kade\AppData\Local\QtMsBuild` for me.
 
 <kbd>![QtMsBuildEnvVar](https://user-images.githubusercontent.com/54650222/189684690-ea4b86bc-2e47-4d20-b61e-d9b4294ed6b5.gif)</kbd>
 
 - They should look like this once done in addition to the one you appended to the PATH variable.
 
 <kbd>![image](https://user-images.githubusercontent.com/54650222/189688069-90089c2b-43ea-44bb-bdb0-6496040e91dd.png)</kbd>
 
 - Now clone the GQL Client repository.
 
 - Open Qt Creator, which is installed by default with Qt. Then open the QGL Client.
 
 <kbd>![RunQtProject](https://user-images.githubusercontent.com/54650222/190543514-ae8cd160-5c99-4d1f-8dae-08fdccb0e92c.gif)</kbd>
  
 - Change your build path for the project now. By default, it is super wonky. I recommend putting it inside your GQL Client directory. I put mine here `C:\GQL\gql_client\builds`
  
  <kbd>![RunQtProject2](https://user-images.githubusercontent.com/54650222/190544112-eb07548f-dd2f-40ba-83dc-bd463fb3c3c1.gif)</kbd>
 
 - YAY! You should be done now. If it does not build, let Kade now immediately before you try to fix it yourself.
