import { EACHTTP } from '../../routes';
import get from './get';

export default EACHTTP.post('/user', (req, res) => {
    switch (req.query.method) {
        case 'get':
            return get(req, res);

        default:
            return res.send(404);
    }
});