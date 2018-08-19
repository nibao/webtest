include ($ENV{CMAKE}/common/prep.cmake)

CMAKE_MINIMUM_REQUIRED(VERSION 2.8)
CMAKE_POLICY(VERSION 2.8)

PROJECT(ShareWebCluster)

INSTALL(
    DIRECTORY 
        ../thrift/gen-node
        node_modules
        handlers
        dist/libs
        dist/scripts
        dist/styles
    DESTINATION 
        app/ShareWebCluster
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
        dist/index.html
        index.js
    DESTINATION
        app/ShareWebCluster
    PERMISSIONS
        OWNER_EXECUTE OWNER_WRITE OWNER_READ 
        GROUP_EXECUTE GROUP_READ WORLD_EXECUTE WORLD_READ 
)

include(package)