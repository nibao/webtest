include ($ENV{CMAKE}/common/prep.cmake)

CMAKE_MINIMUM_REQUIRED(VERSION 2.8)
CMAKE_POLICY(VERSION 2.8)

PROJECT(ShareWebClient)

INSTALL(
    DIRECTORY 
        ../thrift/gen-node
        node_modules
        download
        handlers
        dist/libs
        dist/assets
        dist/styles
        dist/scripts
    DESTINATION 
        app/ShareWebClient
    FILE_PERMISSIONS 
        OWNER_EXECUTE OWNER_WRITE OWNER_READ 
        GROUP_EXECUTE GROUP_READ WORLD_EXECUTE WORLD_READ 
    DIRECTORY_PERMISSIONS 
        OWNER_EXECUTE OWNER_WRITE OWNER_READ 
        GROUP_EXECUTE GROUP_READ WORLD_EXECUTE WORLD_READ 
    PATTERN "*.svn" EXCLUDE
    PATTERN "*.pyc" EXCLUDE
)

INSTALL(
    FILES
        index.js
        dist/index.html
    DESTINATION
        app/ShareWebClient
    PERMISSIONS
        OWNER_EXECUTE OWNER_WRITE OWNER_READ 
        GROUP_EXECUTE GROUP_READ WORLD_EXECUTE WORLD_READ 
)

include(package)