# 解压 node_modules
SHAREWEBNEW=$WORKSPACE/platform/ShareWebNew
THRIFTAPI=$WORKSPACE/platform/API/ThriftAPI

# tar -xzvf $SHAREWEBNEW/node_modules.tar.gz -C $SHAREWEBNEW
chmod +x $SHAREWEBNEW/node_modules/.bin/*

# 设定node_modules路径
export PATH=$PATH:$SHAREWEBNEW/node_modules/.bin

# 生成thrift

node $SHAREWEBNEW/make/thrift-gen-js.js $THRIFTAPI
node $SHAREWEBNEW/make/thrift-gen-node.js $THRIFTAPI

# Gulp
gulp --gulpfile $SHAREWEBNEW/ShareWebUtil/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebUI/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebCore/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebComponents/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebConsole/gulpfile.js

# ShareWebClient

# 解压 node_modules
# tar -xzvf $SHAREWEBNEW/ShareWebClient/node_modules.tar.gz -C $SHAREWEBNEW/ShareWebClient

# Gulp
gulp --gulpfile $SHAREWEBNEW/ShareWebClient/gulpfile.js

# WebPack
webpack \
    --config $SHAREWEBNEW/ShareWebClient/webpack.config.js \
    --env.production \
    --display errors-only

# ShareWebMobile

# Gulp
gulp --gulpfile $SHAREWEBNEW/ShareWebMobile/gulpfile.js

# WebPack
webpack \
    --config $SHAREWEBNEW/ShareWebMobile/webpack.config.js \
    --env.production \
    --display errors-only

# ShareWebCluster

# 解压 node_modules
# tar -xzvf $SHAREWEBNEW/ShareWebCluster/node_modules.tar.gz -C $SHAREWEBNEW/ShareWebCluster

# Gulp
gulp --gulpfile $SHAREWEBNEW/ShareWebCluster/gulpfile.js

# WebPack
webpack \
    --config $SHAREWEBNEW/ShareWebCluster/webpack.config.js \
    --env.production \
    --display errors-only

# ShareWebTProxy

# 解压 node_modules
# tar -xzvf $SHAREWEBNEW/ShareWebTProxy/node_modules.tar.gz -C $SHAREWEBNEW/ShareWebTProxy

# Gulp
gulp --gulpfile $SHAREWEBNEW/ShareWebTProxy/gulpfile.js
