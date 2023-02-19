import {
    fetchJson,
    getCookie,
    clearCache,
    loadCache,
    appendCache
} from './utility'

const studyApi = 'http://localhost:3000/api';

const login = (credentials) => {
    return new Promise((resolve, reject) => {
        const url = `${studyApi}/account/login`;

        fetchJson(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        })
            .then(res => {
                const token = res.token;
                return resolve(token);
            })
            .catch(err => {
                console.log(err);
                return reject(err);
            })
    });
}

export {
    login
}