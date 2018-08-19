import { assign } from 'lodash'
import { getRoots as getDepartmentRoots, getSubDeps, getSubUsers } from '../apis/eachttp/department/department';

const Items = {}

const Loaded = {}

const ChildrenIds = {}

class Department {
    constructor(depinfo) {
        assign(this, depinfo)
    }

    async list(withCache = true) {
        if (!(withCache && Loaded[this.depid])) {
            // 不用缓存
            const [{depinfos}, {userinfos}] = await Promise.all([getSubDeps({ depid: this.depid }), getSubUsers({ depid: this.depid })])

            assign(Loaded, { [this.depid]: true })

            assign(ChildrenIds, { [this.depid]: [...userinfos.map(info => info.userid), ...depinfos.map(info => info.depid)] })

            depinfos.map(info => {
                assign(Items, { [info.depid]: new Department(info) })
            })

            userinfos.map(info => {
                assign(Items, { [info.userid]: new Department(info) })
            })

        }

        return ChildrenIds[this.depid].map(id => Items[id])
    }
}

/**
 * 内链，获取组织结构
 */
export async function getRoots() {
    const {depinfos} = await getDepartmentRoots()

    depinfos.forEach(depinfo => assign(Items, { [depinfo.depid]: new Department(depinfo) }))

    return depinfos.map(depinfo => {
        const dep = new Department(depinfo)
        assign(Items, { [dep.depid]: dep })
        return dep
    })

}