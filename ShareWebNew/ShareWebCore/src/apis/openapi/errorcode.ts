/**
 * 错误码定义
 * 命名规则：操作／对象 + 状态
 * 常用状态表示：
 * * 非法值 Illegal
 * * 无效值 Invalid
 * * 操作对象不存在（被删除） Inaccessible
 * * 操作对象缺失（未配置） Missing
 * * 操作对象冲突 Conflict
 * * 超出允许范围 Exceeded
 * * 操作被限制 Restricted
 * * 操作对象不完整 Incomplete
 */
export const enum ErrorCode {
    URINotExists = 400001,
    ParametersIllegal = 400002,
    URIFormatIllegal = 400003,
    JSONFormatIllegal = 400004,
    PermConfigIllegal = 400005,
    AccessorIllegal = 400006,
    ChunkMismatched = 400007,
    SearchCharacterIllegal = 400008,
    SearchParameterInvalid = 400009,
    LocalTimeInvalid = 400010,
    ExpirationInvalid = 400011,
    NameInvalid = 400012,
    GroupNameInvalid = 400013,
    TagNameInvalid = 400014,
    PermConfigExpired = 400015,
    LinkConfigExpired = 400016,
    ExpirationConflict = 400017,
    TokenExpired = 401001,
    LinkAuthFailed = 401002,
    AuthFailed = 401003,
    UserDisabled = 401004,
    EncryptionInvalid = 401005,
    AdminLoginFailed = 401006,
    DomainDisabled = 401007,
    UserNotInDomain = 401008,
    DeviceBinded = 401011,
    PasswordFailure = 401012,
    PasswordInsecure = 401013,
    PasswordInvalid = 401014,
    PasswordWeak = 401015,
    PasswordChangeNotSupported = 401016,
    PasswordIsInitial = 401017,
    PasswordInvalidOnce = 401018,
    PasswordInvalidTwice = 401019,
    PasswordInvalidLocked = 401020,
    LicenseInvalid = 401021,
    AccountDuplicatedLogin = 401025,
    PasswordRestricted = 401026,
    PasswordExpired = 401027,
    LoginSiteInvalid = 401028,
    LicenseExpired = 401029,
    LinkVisitExceeded = 401030,
    IPRestricted = 401031,
    AccountLocked = 401032,
    ClientRestricted = 401033,
    NetworkChanged = 401036,
    VCodeMissing = 401037,
    VCodeExpired = 401038,
    VCodeInvalid = 401039,
    QuotaExhausted = 403001,
    PermissionRestricted = 403002,
    OwnershipRestricted = 403003,
    OwnershipTypeError = 403004,
    SelfOwnershipRestricted = 403005,
    SelfDeOwnershipRestricted = 403006,
    GroupCountLimited = 403007,
    PermissionAccessorInaccessible = 403008,
    PersonalQuotaZero = 403009,
    GroupNameDuplicated = 403010,
    OwnershipAccessorInaccessible = 403011,
    AccessorDuplicated = 403012,
    LinkDuplicated = 403013,
    WriteCompleteReversion = 403014,
    ObjectTypeError = 403015,
    RecycleDeleteInaccessible = 403016,
    RecycleRestoreInaccessible = 403017,
    DownloadReversionIncomplete = 403018,
    PathInvalid = 403019,
    PublicShareDuplicated = 403020,
    ParentPublicShareEnabled = 403021,
    DocumentDeleteInaccessible = 403022,
    PreviewSizeExceeded = 403023,
    GNSInvalid = 403024,
    SizeExceeded = 403025,
    PreviewFormatInvalid = 403026,
    ThumbnailFormatInvalid = 403027,
    CASDisabled = 403028,
    TicketInvalid = 403029,
    UserNotFound = 403030,
    FileLocked = 403031,
    FullnameDuplicated = 403039,
    NameDuplicatedReadonly = 403040,
    DiffTypeNameDuplicated = 403041,
    TrancodeFormatUnsupported = 403047,
    CopyToSelfDisabled = 403054,
    PermissionMismath = 403056,
    LinkRestricted = 403063,
    CSFLevelMismatch = 403065,
    TranscodeSpaceExhausted = 403069,
    DocumentSizeExceeded = 403070,
    TagsNumExceeded = 403092,
    ApplyAuditMissing = 403094,
    ShareApplyComplete = 403095,
    ShareApplyInvalid = 403096,
    ShareApplyAccessorInaccessible = 403097,
    ApplyDenyConcentMissing = 403098,
    ShareApplySharerInaccessible = 403099,
    ShareApplyExpired = 403100,
    LinkApplyInvalid = 403102,
    LinkApplyDuplicated = 403103,
    ExtLoginFailed = 403106,
    AuditCSFMismatch = 403107,
    InsufficientCSFLevel = 403108,
    ArchiveModificationRestriced = 403125,
    NotNullGroup = 403129,
    InvitationDuplicated = 403134,
    InvitationExcluded = 403135,
    InvitationDisabled = 403136,
    InvitationRestricted = 403137,
    ShareExpirationExpired = 403138,
    LinkExpirationExpired = 403139,
    LinkExpirationConflict = 403140,
    CommentSubmitDisabled = 403142,
    CommentDeleteDisabled = 403143,
    CommentSubmitDuplicated = 403144,
    CommentDeleteUnauthorized = 403145,
    PermissionExceeded = 403148,
    ExpireDaysExceeded = 403149,
    LimitationExceeded = 403150,
    LinkPasswordMissing = 403151,
    DownloadExceeded = 403153,
    SmallQuota = 403154,
    DeleteOutboxDisabled = 403155,
    PersonalShareUnauthorized = 403156,
    GroupShareUnauthorized = 403157,
    PersonalInvitationUnauthorized = 403158,
    GroupInvitationUnauthorized = 403159,
    PersonLinkUnauthorized = 403162,
    GroupLinkUnauthorized = 403163,
    PersonLinkModificationUnauthorized = 403164,
    GroupLinkModificationUnathorized = 403165,
    PersonalInvitationModificationUnauthorized = 403166,
    GroupInvitationModificationUnauthorized = 403167,
    CopyToWatermarkLibraryDisabled = 403168,
    MoveToWatermarkLibraryDisabled = 403169,
    AccountFrozen = 403171,
    DocumentFrozen = 403172,
    SourceDocLocked = 403176,
    UserNotRealName = 403179,
    CreatorNotRealName = 403180,
    FileTypeRestricted = 403182,
    PermModifyDeniedWithGroupCreater = 403184,
    EmailInvalid = 403185,
    EmailDuplicated = 403186,
    ContactGroupDuplicated = 403188,
    GroupInaccessible = 404001,
    DeparmentInaccessible = 404002,
    ParentObjectInaccessible = 404003,
    UserInfoInaccessible = 404004,
    EntrydocInaccessible = 404005,
    GNSInaccessible = 404006,
    LinkInaccessable = 404008,
    DataChunkInaccessible = 404009,
    ReversionIncomplete = 404010,
    DataChunkIncomplete = 404011,
    MissingDestination = 404013,
    SiteOffline = 404017,
    UserdocMissing = 404019,
    MailtoFormatInvalid = 404020,
    SMTPConfigMissing = 404021,
    SMTPUnknownError = 404022,
    SMTPInaccessible = 404023,
    DocumentInaccessible = 404024,
    InvitationInaccessible = 404025,
    OwnerMissing = 404026,
    HTTPMethodError = 405001,
    InternalError = 500001,
    PreviewFailed = 500002,
    StorageUninitialized = 500003,
    DataCorrupted = 500004,
    MetadataCorrupted = 500005,
    DataIncompatibale = 500006,
    ServerClientMismatch = 500007,
    SearchEngineIndexFailed = 500008,
    SearchEngineInternalError = 500009,
    SearchEngineNotInstalled = 500011,
    HTTPNotPOST = 501001,
    ServiceBusy = 503001,
    DocumentConverting = 503002,
    WatermarkProcessing = 503005,
    ResourcesNotEnough = 404027,
    NeedAction = 401040,
    UserActivated = 401041,
    SendCaprchaFail = 401046,
    NotOpenActivated = 401047,
    FailActivated = 401050,
    PhoneCorrectFormat = 401042,
    PhoneExist = 401043,
    CaprchaWrong = 401044,
    CaprchaOverstayed = 401045,
    EmailCorrectFormat = 401048,
    EmailExist = 401049,
}