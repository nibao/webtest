/**
 * 求一个正数从指定数开始的所有约数
 * @param {number} num  求约数的数
 * @param {number} startNum 指定的开始数
 * @returns {ReadonlyArray<number>} 所有约数数组
 */
export function getApproximateNumber(num: number, startNum: number): ReadonlyArray<number> {
    let approximateNumberArr: Array<number> = []

    if (num < 0) {
        return approximateNumberArr
    } else {
        if (num < startNum) {
            return approximateNumberArr
        } else {
            if (startNum < 0) {
                startNum = 1
            }
            for (let i: number = startNum; i <= num; i++) {
                if (num % i === 0) {
                    approximateNumberArr.push(i)
                }
            }
            return approximateNumberArr
        }
    }
}