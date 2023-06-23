import SystemConst from '../consts/system_const';

class HeaderToken {
    token() {
        const config = {
            headers: {
                authorization: `Bearer ${SystemConst.TOKEN}`,
            },
        };
        return config;
    }
}
export default new HeaderToken();
