SHAREWEBNEW=$WORKSPACE/platform/ShareWebNew

# 解压 node_modules
# tar -xzvf $SHAREWEBNEW/node_modules.tar.gz -C $SHAREWEBNEW
chmod +x $SHAREWEBNEW/node_modules/.bin/*

# 设定node_modules到PATH
export PATH=$PATH:$SHAREWEBNEW/node_modules/.bin

# 解压ShareWebWindows模块依赖的node_modules
# tar -xzvf $SHAREWEBNEW/ShareWebWindows/node_modules.tar.gz -C $SHAREWEBNEW/ShareWebWindows
   
# Gulp
gulp --gulpfile $SHAREWEBNEW/ShareWebUtil/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebUI/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebCore/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebComponents/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebWindows/gulpfile.js

# WebPack
webpack \
    --config $SHAREWEBNEW/ShareWebWindows/webpack.config.js \
    --env.production
