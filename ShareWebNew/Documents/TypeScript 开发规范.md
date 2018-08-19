## TypeScript
* 接口必须写文档注释，格式标准参考[JSDoc](http://usejsdoc.org/)
* 所有函数都必须定义参数和返回值的数据类型。
* 要复用的数据结构总是在单独的d.ts文件中定义好。
* 内联函数使用内联的数据类型定义。
```typescript
    function foo(): string {
        const bar = function(arg: string): string {
            // ...
        }
        //...
    }
```

* 不允许隐式any类型，如果值的类型为任意，就显式指定`any`类型。
```typescript
    // any不允许省略
    function foo(): any {
    }
```

* 不允许设定未定义过的对象属性，除非明确指明对象包含不确定的属性。
```typescript
    // bad 
    interface BadObj {
        foo?: string;
    }

    // good
    interface GoodObj {
        foo?: string;
        [key: string]?: string; // 如果包含其他属性，必须强制声明
    }
```
* 使用 `Array<string>` 的形式而不是 `string[]` 。