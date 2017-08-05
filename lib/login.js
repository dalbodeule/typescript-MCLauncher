"use strict";

const request = require('request-promise');

module.exports = class {
    /**
     * 로그인데이터 설정을 위한 Class 입니다.
     * @param {string} username 모장에 로그인 할 유저네임 또는 이메일 입니다.
     * @param {string} password 모장 계정의 패스워드입니다.
     * @param {string} clientToken 만약 ClientToken 이 있다면 전달해주세요.
     */
    constructor(username = null, password = null, clientToken = null) {
        if(username == null || password == null ) {
            this.ready = false;
            return false;
        } else {
            this.username = username;
            this.password = password;
            this.clientToken = clientToken;
            this.ready = true;
            return true;
        }
    }

    /**
     * Promise 로 유저데이터 또는 실패 메세지가 전달됩니다.
     * @return {Promise}
     */
    run() {
        return new Promise(async(resolve, reject) => {
            if(this.ready == true) {
                let result;
                try {
                    result = await request({
                        uri: 'https://authserver.mojang.com/authenticate',
                        method: 'POST',
                        body: {
                            agent: {
                                name: "Minecraft",
                                version: 1
                            },
                            username: this.username,
                            password: this.password,
                            clientToken: this.clientToken
                        },
                        json: true
                    });
                    resolve(result);
                } catch(e) {
                    reject(e.error);
                }
            } else {
                reject('request not ready');
            }
        });
    }

    valid(accessToken) {
        return new Promise(async(resolve, reject) => {
            if(this.ready == true) {
                let result;
                try {
                    result = await request({
                        uri: 'https://authserver.mojang.com/validate',
                        method: 'POST',
                        body: {
                            clientToken: this.clientToken,
                            accessToken: accessToken
                        },
                        json: true
                    });
                    resolve();
                } catch(e) {
                    reject(e.error);
                }
            } else {
                reject('request not ready');
            }
        });
    }
}