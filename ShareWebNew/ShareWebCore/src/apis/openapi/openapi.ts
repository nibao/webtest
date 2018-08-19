import * as audit from '../eachttp/audit/audit';
import * as auth1 from '../eachttp/auth1/auth1';
import * as auth2 from '../eachttp/auth2/auth2';
import * as autolock from '../eachttp/autolock/autolock';
import * as ca from '../eachttp/ca/ca';
import * as config from '../eachttp/config/config';
import * as contact from '../eachttp/contact/contact';
import * as department from '../eachttp/department/department';
import * as entrydoc from '../eachttp/entrydoc/entrydoc';
import * as finder from '../eachttp/finder/finder';
import * as groupdoc from '../eachttp/groupdoc/groupdoc';
import * as invitation from '../eachttp/invitation/invitation';
import * as managedoc from '../eachttp/managedoc/managedoc';
import * as message from '../eachttp/message/message';
import * as owner from '../eachttp/owner/owner';
import * as perm from '../eachttp/perm/perm';
import * as device from '../eachttp/device/device';
import * as pki from '../eachttp/pki/pki';
import * as quota from '../eachttp/quota/quota';
import * as redirect from '../eachttp/redirect/redirect';
import * as update from '../eachttp/update/update';
import * as user from '../eachttp/user/user';
import * as dir from '../efshttp/dir/dir';
import * as file from '../efshttp/file/file';
import * as link from '../efshttp/link/link';
import * as favorites from '../efshttp/favorites/favorites';
import * as quarantine from '../efshttp/quarantine/quarantine';
import * as recycle from '../efshttp/recycle/recycle';
import * as search from '../efshttp/search/search';

export default {
    eachttp: {
        audit, auth1, auth2, autolock, ca, config, contact, department, entrydoc, finder, groupdoc, device,
        invitation, managedoc, message, owner, perm, pki, quota, redirect, update, user
    },
    efshttp: { dir, file, link, favorites, quarantine, recycle, search }
}