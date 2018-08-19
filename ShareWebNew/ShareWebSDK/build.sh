SHAREWEBNEW=$WORKSPACE/platform/ShareWebNew

# 解压 node_modules
tar -xzvf $SHAREWEBNEW/node_modules.tar.gz -C $SHAREWEBNEW
chmod +x $SHAREWEBNEW/node_modules/.bin/*

# 设定node_modules到PATH
export PATH=$PATH:$SHAREWEBNEW/node_modules/.bin
   
# Gulp
gulp --gulpfile $SHAREWEBNEW/ShareWebUtil/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebUI/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebCore/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebComponents/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebConsole/gulpfile.js
gulp --gulpfile $SHAREWEBNEW/ShareWebSDK/gulpfile.js

# WebPack
webpack \
	--config $SHAREWEBNEW/ShareWebSDK/webpack.config.js \
    --env.production \
    --display errors-only