
# protobuf Setup Instructions

To install protobuf you need to install protoc and the protobuf library and include files (using cmake).

## Install cmake:
1. Go to https://cmake.org/download/ and install the latest version of cmake using .msi installer file.
For example - Windows x64 Installer: `cmake-3.24.2-windows-x86_64.msi`

2. Complete the cmake installtion by adding cmake to your environment variables. Edit your *system* environment variables and add `C:\Program Files\CMake\bin` to the PATH variable.

3. Verify cmake has been installed by running this in your terminal/shell
```
cmake --help
```
## Install protoc

1. Go to https://github.com/protocolbuffers/protobuf/releases and install the latest version of protobuf. Example: `protobuf-cpp-3.21.6.zip` 

2. Create a folder called `protobuf` in `C:\Users\<name>`. 

3. Extract the files and move the folder `protobuf-3.21.6` to the newly created `protobuf` folder.

4. Create a new folder called `install` in the `protobuf` folder. Your `protobuf` folder should now contain `protobuf-3.21.6` and `install`

5. Open `protobuf-3.21.6\cmake` and create a new folder called `build`

6. Inside `build`, create three more folders: `debug`, `release` and `solution`.

7. From inside the `release` folder, run the following command (may take upto 10 minutes):
```
cmake -G "NMake Makefiles" -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=..\..\..\..\install ..\..

```

8. Similarly, from inside the `debug` folder, run the following command:
```
cmake -G "NMake Makefiles" -DCMAKE_BUILD_TYPE=Debug -DCMAKE_INSTALL_PREFIX=..\..\..\..\install ..\..
```

9. Finally, from inside the `solution` folder, run the following command (command could change depending on the verison of Visual Studio you have installed):
```
cmake -G "Visual Studio 17 2022" -DCMAKE_INSTALL_PREFIX=..\..\..\..\install ..\..
```     

10. To compile protobuf, from the `release` folder run the following command:
```
nmake
```

11. Then, to install protobuf, from the `release` folder run the following command:
```
nmake install
```

12. Now you protobuf should be completely installed on your machine. Verify the folders `bin`, `cmake`, `include` and `lib` are present in the `install` folder that was created in Step 4.

13. Add `protoc` to your environment variables by adding `C:\Users\<name>\protobuf\install\bin` to the Path variable

14. Verify `protoc` is working by running `protoc --version` from your terminal/shell

15. Copy the file `C:\Users\<name>\protobuf\install\lib\libprotobuf.lib` to the build\src and build\app folders of the Qt project
