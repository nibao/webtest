include ($ENV{CMAKE}/common/prep.cmake)

CMAKE_MINIMUM_REQUIRED(VERSION 2.8)
CMAKE_POLICY(VERSION 2.8)

PROJECT(ShareWebSDK)

INSTALL(
    DIRECTORY 
        ../libs
        assets
    DESTINATION
        .
    FILE_PERMISSIONS 
        OWNER_EXECUTE OWNER_WRITE OWNER_READ 
        GROUP_EXECUTE GROUP_READ WORLD_EXECUTE WORLD_READ 
    DIRECTORY_PERMISSIONS OWNER_EXECUTE OWNER_WRITE OWNER_READ 
        GROUP_EXECUTE GROUP_READ WORLD_EXECUTE WORLD_READ 
    PATTERN "*.svn" EXCLUDE
    PATTERN "*.pyc" EXCLUDE
    PATTERN "*.map" EXCLUDE
)

INSTALL(
    FILES 
        dist/anyshare.desktop.public.js
        dist/anyshare.desktop.public.css
        dist/anyshare.mobile.public.js
        dist/anyshare.mobile.public.css
        dist/anyshare.openapi.js
    DESTINATION 
        .
    PERMISSIONS 
        OWNER_EXECUTE OWNER_WRITE OWNER_READ GROUP_EXECUTE GROUP_READ WORLD_EXECUTE WORLD_READ
)

include(package)