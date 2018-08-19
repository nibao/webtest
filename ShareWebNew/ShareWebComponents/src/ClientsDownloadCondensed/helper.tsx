import { ClientTypes } from '../../core/clients/clients';
/**
 * get构建客户端Icon code
 */
export const clientIcon = function (type: ClientTypes) {
    switch (type) {
        case ClientTypes.WIN_32:
            return '\uf03d';

        case ClientTypes.WIN_64:
            return '\uf03d';

        case ClientTypes.MAC:
            return '\uf03f';

        case ClientTypes.ANDROID:
            return '\uf040';

        case ClientTypes.IOS:
            return '\uf03f';

        case ClientTypes.OFFICE_PLUGIN:
            return '\uf041';

    }
}
