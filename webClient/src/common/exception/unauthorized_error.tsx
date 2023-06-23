import showUnauthorizedPopup from '../Screens/ErrorAlertLogout';

class UnauthorizedError {
    static checkError(error: { response: { status: any; data: { error_message: any } } }): boolean {
        if (!error.response) {
            return false;
        }
        const {
            status,
            data: { error_message: errorMessage },
        } = error.response;
        let flag = false;

        if (status === 401) {
            if (
                errorMessage === 'Token is not provided' ||
                errorMessage === 'Token is invalid' ||
                errorMessage === 'Token is expired'
            ) {
                flag = true;
            }
        } else if (status === 404) {
            if (errorMessage === 'Teacher no exists' || errorMessage === 'Student no exists') {
                flag = true;
            }
        }

        return flag;
    }
}

export default UnauthorizedError;
