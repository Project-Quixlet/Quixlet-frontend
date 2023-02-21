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

const fetchUserInfo = (auth) => {
    return new Promise((resolve, reject) => {
        const url = `${studyApi}/account/info`;

        fetchJson(url, {
            method: 'GET',
            headers: {
                token: auth
            }
        })
            .then(res => {
                return resolve(res);
            })
            .catch(err => {
                console.log(err);
                return reject(err);
            })
    });
}

const fetchTrending = () => {
    return new Promise((resolve, reject) => {
        const url = `${studyApi}/studies/trending`;

        fetchJson(url, {
            method: 'GET',
        })
            .then(res => {
                return resolve(res);
            })
            .catch(err => {
                console.log(err);
                return reject(err);
            })
    });
}

const fetchRecent = (auth) => {
    return new Promise((resolve, reject) => {
        const url = `${studyApi}/studies/recent`;

        fetchJson(url, {
            method: 'GET',
            headers: {
                token: auth
            }
        })
            .then(res => {
                return resolve(res);
            })
            .catch(err => {
                console.log(err);
                return reject(err);
            })
    });
}

const fetchStarred = (auth) => {
    return new Promise((resolve, reject) => {
        const url = `${studyApi}/studies/starred`;

        fetchJson(url, {
            method: 'GET',
            headers: {
                token: auth
            }
        })
            .then(res => {
                return resolve(res);
            })
            .catch(err => {
                console.log(err);
                return reject(err);
            })
    });
}

const fetchOwn = (auth) => {
    return new Promise((resolve, reject) => {
        const url = `${studyApi}/studies/own`;

        fetchJson(url, {
            method: 'GET',
            headers: {
                token: auth
            }
        })
            .then(res => {
                return resolve(res);
            })
            .catch(err => {
                console.log(err);
                return reject(err);
            })
    });
}


const fetchStudy = (auth, hash) => {
    return new Promise((resolve, reject) => {
        const url = `${studyApi}/studies/get/${hash}`;
        const headers = {};
        if(auth) headers['token'] = auth;
        

        fetchJson(url, {
            method: 'GET',
            headers
        })
            .then(res => {
                return resolve(res);
            })
            .catch(err => {
                console.log(err);
                return reject(err);
            })
    });
}

export {
    login,
    fetchUserInfo,
    fetchTrending,
    fetchRecent,
    fetchStarred,
    fetchOwn,
    fetchStudy
}