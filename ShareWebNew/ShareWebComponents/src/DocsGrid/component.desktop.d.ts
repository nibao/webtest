/// <reference path="./component.base.d.ts" />


declare interface DocsGrid extends DocsGridBase {
    nameFormatter(name: string, record: Array<any>): any
}