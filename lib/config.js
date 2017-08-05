"use strict";

const fs = require('fs'), path = require('path');

module.exports = class {
    /**
     * Config 기본설정을 수행합니다.
     */
    async init() {
        let temp = await(() => {
            return new Promise(async(resolve, reject) => {
                fs.exists(path.join(nw.App.dataPath, 'config.json'), (exists) => {
                    if(exists == true) resolve(true);
                    else resolve(false);
                });
            });
        })();
        if(temp == true) {
            let config = require(path.join(nw.App.dataPath, 'config.json'));
            this.user = config.user;
        }
    }

    /**
     * 유저정보를 저장합니다.
     * @param {string} accessToken 
     * @param {string} clientToken 
     * @param {string} username 
     * @param {string} uuid 
     * @param {string} displayName 
     */
    setUser(accessToken = null, clientToken = null, username = null, uuid = null, displayName = null) {
        if(accessToken == null || clientToken == null || 
            username == null || uuid == null || displayName == null) {
            return false;
        } else {
            this.user = {
                accessToken,
                clientToken,
                username,
                uuid,
                displayName
            };
            return true;
        }
    }

    save() {
        return new Promise((resolve, reject) => {
            console.log(this);
            let config = this;
            fs.writeFile(path.join(nw.App.dataPath, 'config.json'), JSON.stringify(config), (err) => {
                if(err) reject(err);
                else resolve("success");
            });
        });
    }
}