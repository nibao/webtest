import { includes } from 'lodash';
import * as organization from './assets/organization.png';
import * as department from './assets/department.png';
import * as user from './assets/user.png';

// 组织节点
interface OrganizationNode {
    name: string;
    subDepartmentCount: number;
    isOrganization: boolean;
    [key: string]: any;
}

// 部门节点
interface DepartmentNode {
    name: string;
    subDepartmentCount: number;
    responsiblePerson: Array<User>;
    [key: string]: any;
}

// 用户节点
interface UserNode {
    user: {
        displayName: string;
        loginName: string;
        [key: string]: any;
    };
    [key: string]: any;
}

// 节点类型
export enum NodeType {
    ORGANIZATION, // 组织

    DEPARTMENT, // 部门

    USER // 用户
}


/**
 * 根据节点获取图标
 * @param node 节点
 * @return 返回图标字体代码以及base64图片编码
 */
export function getIcon(node: any): { code: string, fallback: string } {
    return getNodeIcon(getNodeType(node))
}

/**
 * 获取节点类型
 * @param node 节点
 * @return 返回节点类型
 */
export function getNodeType(node: any): NodeType {
    switch (true) {
        case node.parentDepartId === '' || node.isOrganization:
            return NodeType.ORGANIZATION;

        case node.hasOwnProperty('responsiblePersons'):
            return NodeType.DEPARTMENT;

        case !!(node.loginName || node.user):
            return NodeType.USER;
    }
}

/**
 * 根据搜索节点获取图标
 * @param node 节点
 */
export function getSearchNodeIcon(node: any): { code: string, fallback: string } {
    return getNodeIcon(getNodeType(node))
}

function getNodeIcon(nodeType: NodeType) {
    switch (nodeType) {
        case NodeType.ORGANIZATION:
            return {
                code: '\uf008',
                fallback: organization
            }

        case NodeType.DEPARTMENT:
            return {
                code: '\uf009',
                fallback: department
            }

        case NodeType.USER:
            return {
                code: '\uf007',
                fallback: user
            }
    }
}

/**
 * 判断节点是否是叶子节点
 * @param node 节点
 * @param selectType 可选用户范围
 * @return 返回是否是子节点
 */
export function isLeaf(node: OrganizationNode & DepartmentNode & UserNode, selectType: Array<NodeType>): boolean {
    switch (getNodeType(node)) {
        case NodeType.ORGANIZATION:
            return !node.subDepartmentCount && !includes(selectType, NodeType.DEPARTMENT) && !includes(selectType, NodeType.USER);

        case NodeType.DEPARTMENT:
            return !node.subDepartmentCount && (!includes(selectType, NodeType.USER) || !node.subUserCount);

        case NodeType.USER:
            return true;
    }
}

/**
 * 根据组织架构节点获取节点名称
 * @param node 组织架构节点   
 */
export function getNodeName(node: OrganizationNode & DepartmentNode & UserNode): string {
    switch (getNodeType(node)) {
        case NodeType.ORGANIZATION:
        case NodeType.DEPARTMENT:
            return node.name;

        case NodeType.USER:
            return node.user.displayName;
    }
}