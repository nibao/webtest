import { map, flattenDeep, isArray } from 'lodash'
import { getDepartmentOfUsers, getSubDepartments } from '../core/thrift/user/user';


export enum Range {
    DEPARTMENT_DEEP, // 部门及其子部门

    DEPARTMENT, // 当前部门

    USERS // 当前选中的用户
}

/**
 * 系统类型
 */
export enum SystemType {
    /**
     * 控制台
     */
    Console,

    /**
     * 集群
     */
    Cluster
}

/**
 * 递归获取所有部门及子部门
 * @param deps {object|object[]}
 * @param result {undefined || object[]}
 * @return {promise}
 */
export function listDepsSince(deps, result?) {

    deps = isArray(deps) ? deps : [deps];

    result = result || deps;

    let getSubDeps = function (parentId) {
        return getSubDepartments(parentId)
    },
        // 构建任务队列
        tasks = map(deps, function (dep) {
            return getSubDeps(dep.id);
        });

    return Promise.all(tasks).then((...response) => {
        let children = flattenDeep(response);

        if (children && children.length) {

            result = result.concat(children);
            // 递归调用
            return listDepsSince(children, result);
        } else {
            return Promise.resolve(result);
        }
    })
}

/**
 * 列举部门下所有用户（含子部门）
 * @param dep {object}
 * @return {promise}
 */
export function listUsersSince(dep) {
    let getUsers = function (dep) {
        return getDepartmentOfUsers(dep.id, 0, -1)
    };

    return listDepsSince(dep).then(function (depsList) {
        let tasks = map(depsList, function (d) {
            return getUsers(d);
        });

        return Promise.all(tasks).then(function (...userlist) {
            return flattenDeep(userlist);
        });
    });
};


/**
  * 获取选中的用户
  */
export function getSeletedUsers(range, dep, users?) {

    if (range === Range.USERS) {
        return users
    } else if (range === Range.DEPARTMENT) {
        return getDepartmentOfUsers(dep.id, 0, -1)
    } else if (range === Range.DEPARTMENT_DEEP) {
        return listUsersSince(dep);
    }
}
