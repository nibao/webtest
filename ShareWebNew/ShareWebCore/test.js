// 导入所有测试用例
const testsContext = require.context("./src", true, /test\.ts$/);
testsContext.keys().forEach(testsContext);