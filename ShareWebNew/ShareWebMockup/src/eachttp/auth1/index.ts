import { EACHTTP } from '../../routes';
import getnew from './getnew';

export default EACHTTP.post('/auth1', (req, res) => {
    switch (req.query.method) {
        case 'getnew':
            return getnew(req, res);

        default:
            return res.send(404);
    }
});