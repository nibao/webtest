/**
 * 在文件名后增加rev的后缀
 * name:text.doc, rev: 123 ->  text123.doc
 */
export function formatterName(name: string, rev: number): string {
    const index = name.lastIndexOf('.')

    if (index !== -1) {
        // 文件名包含'.'
        return name.substring(0, index) + rev + name.substring(index, name.length)
    }

    // 文件名不包含'.'
    return name + rev
}