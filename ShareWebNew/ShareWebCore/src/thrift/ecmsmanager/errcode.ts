export const enum ErrorCode {
    /**
     * 用户名或密码不正确
     */
    InvalidAccountOrPassword = 10001,

    /**
     * 节点已在集群中
     */
    NodeAlreadayInCluster = 10002,

    /**
     * 网卡不存在
     */
    NicNotAvailabel = 10003,

    /**
     * 通过ssh连接远程主机失败
     */
    SshToRemoteHostFailed = 10004,

    /**
     * 节点数超过授权数
     */
    NodeNumOverFlow = 20520
}