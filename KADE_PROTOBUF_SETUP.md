1. Go here https://github.com/protocolbuffers/protobuf/releases and download protobuf-cpp-3.21.5.zip

2. Extract it. I put it here `C:/GQL/protobuf-3.21.5/`

3. Install CMake and make sure you add it to the path for all users: https://cmake.org/download/

4. Install Ninja: https://github.com/ninja-build/ninja/releases
    * Make sure to put ninja.exe in your PATH variable

5. Start Visual Studio.
    * Click open folder from the start menu of Visual Studio
    * Open the protobuf-3.21.5 folder that was unzipped in step 2

6. Click Build All under the build menu. It should succeed.

7. Open the `CMakeSettings.json` file and create a new configuration called `x64-Debug-Dynamic`

8. Save the file, then select it from the dropdown to the left of the green run button. 
    * After that click Build All from the build menu.

9. Now configure the arguments:
    * Add this to CMake command arguments:
        * `-DBUILD_SHARED_LIBS=ON`
    * Make sure you check the following: 
        * `protobuf_BUILD_LIBPROTOC`
        * `protobuf_BUILD_SHARED_LIBS`
    * Make sure you **UNCHECK** the following if it exists:
        * `protobuf_MSVC_STATIC_RUNTIME`
    * Then save the file.

10. Now clean it from the build menu and press Build All again.

11. The output is generated in `out/build/x64-Debug-Dynamic` Grab the following files from there and copy them into the `gql_client/protoc_lib` folder. You will need to create that folder.
    * NOTE: I'm not sure what they will be on Mac
    * `libprotobufd.dll`
    * `libprotobufd.lib`
    * `libprotobuf-lited.dll`
    * `libprotobuf-lited.lib`
    * `libprotocd.dll`
    * `libprotocd.lib`

12. Repeat steps 7-11 with a Release build. 

13. DONE!!!!


NOTES

1. If you need to regenerate the protoc files, run this `protoc -I=C:/GQL/gql_db/proto --cpp_out=C:/GQL/compiled_protoc C:/GQL/gql_db/proto/connection.proto`
    * Move the two files generated `connection.pb.h` and `connection.pb.cc` into the GQL_Client project.