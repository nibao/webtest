import __ from './locale';

export function getCurrentAuditModel(auditModel) {
    switch (auditModel) {
        case 'one':
            return __('同级审核')
        case 'all':
            return __('汇签审核')
        case 'level':
            return __('逐级审核')
    }
}