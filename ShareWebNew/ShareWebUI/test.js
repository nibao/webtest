// 初始化enzyme适配器
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-14';

configure({ adapter: new Adapter() });
// 导入所有测试用例
const testsContext = require.context("./src", true, /\.test\.tsx$/);
testsContext.keys().forEach(testsContext);