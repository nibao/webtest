前提：
1.被测对象AS的服务端需要关闭防火墙

框架:
此次自动化测试框架采用的是unittest，这个为python的单元测试框架
https://www.cnblogs.com/fennudexiaoniao/p/7771931.html

测试过程可能会使用的库：selenium + requests + thrift + json + zbar + PIL 等

Pillow.exe、zbar.exe等详见：AnyShare://AnyShare产品线/7-AnyShare系统测试部/共享资源/工具类/python库

测试流程：
1.在dataprepared.py准备最基本的数据---》创建组织架构---》创建部门---》创建用户,大家如果使用单个用户，直接使用初始化的用户
2.所有的关键字都放置libraries里面
3.测试case放入cases文件夹中
4.每一个测试对象封装成test_xxx.py