export default (req, res) => {
    res.send({
        csf_level_enum: {
            '内部': 6,
            '机密': 8,
            '秘密': 7,
            '绝密': 9,
            '非密': 5
        },
        enable_doc_comment: true,
        enable_doc_watermark: false,
        enable_exchange_file: false,
        enable_invitation_share: true,
        enable_link_access_code: false,
        enable_secret_mode: false,
        entrydoc_view_config: 1,
        extapp: { enable_chaojibiaoge: false },
        forbid_ostype: '0',
        https: true,
        oemconfig: {
            allowauthlowcsfuser: true,
            allowowner: true,
            cadpreview: false,
            clearcache: false,
            clientlogouttime: -1,
            defaultpermexpireddays: -1,
            enableclientmanuallogin: true,
            enablefiletransferlimit: false,
            enableonedrive: false,
            enableshareaudit: false,
            enableuseragreement: false,
            hidecachesetting: false,
            indefiniteperm: true,
            maxpassexpireddays: -1,
            owasurl: '',
            rememberpass: true,
            wopiurl: ''
        },
        server_version: '5.0.14-20170623-6111',
        tag_max_num: 30,
        third_csfsys_config: {
            id: 'b937b8e3-169c-4bee-85c5-865b03d8c29a',
            only_share_classifie: false,
            only_upload_classifie: false
        },
        windows_ad_sso: { is_enabled: false }
    })
}