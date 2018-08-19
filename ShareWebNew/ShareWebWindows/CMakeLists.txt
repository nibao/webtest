include ($ENV{CMAKE}/common/prep.cmake)

CMAKE_MINIMUM_REQUIRED(VERSION 2.8)
CMAKE_POLICY(VERSION 2.8)

PROJECT(ShareWebWindows)

INSTALL(
    DIRECTORY
        node_modules
        dist/scripts
        dist/styles
        dist/assets
        dist/libs
    DESTINATION 
        .
    FILE_PERMISSIONS 
        OWNER_EXECUTE OWNER_WRITE OWNER_READ 
        GROUP_EXECUTE GROUP_READ WORLD_EXECUTE WORLD_READ 
    DIRECTORY_PERMISSIONS 
        OWNER_EXECUTE OWNER_WRITE OWNER_READ 
        GROUP_EXECUTE GROUP_READ WORLD_EXECUTE WORLD_READ 
    PATTERN "*.svn" EXCLUDE
    PATTERN "*.pyc" EXCLUDE
    PATTERN "*.map" EXCLUDE 
)

INSTALL(
    FILES 
        dist/index.html
        logo.png 
        index.js 
        package.json
    DESTINATION 
        .
    PERMISSIONS 
        OWNER_EXECUTE OWNER_WRITE OWNER_READ 
        GROUP_EXECUTE GROUP_READ WORLD_EXECUTE WORLD_READ 
)

include(package)