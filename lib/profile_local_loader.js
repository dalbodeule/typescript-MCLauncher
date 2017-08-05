"use strict";

const fs = require('fs'), profile = require('./profile.js');

module.exports = class {
    /**
     * 로컬 프로파일 목록을 반환합니다.
     * @param {string} path 검색할 장소를 선택합니다.
     */
    constructor(path = null) {
        if(path == null) {
            this.ready = false;
            return false;
        } else {
            this.path = path;
            this.ready = true;
            return true;
        }
    }

    /**
     * 로컬 프로파일 검색 및 처리를 수행합니다.
     * @return {promise}
     */
    run() {
        return new Promise(async(resolve, reject) => {
            try {
            let items = await((path) => {
                return new Promise(async(resolve, reject) => {
                    fs.readdir(path, (err, items) => {
                        if(err) reject(err);
                            else resolve(items);
                        });
                    })
                })(this.path); //폴더 확인

                let jobs = []; //Job task

                let profiles = {};

                for(let i in items) {
                    let status = await(async(path) => {
                        return new Promise((resolve, reject) => {
                            fs.exists(path, (exists) => {
                                if(exists == true) resolve(true);
                                else  resolve(false);
                            });
                        });
                    })(this.path+'\\'+items[i]+'\\'+items[i]+'.json');
                    if(status == true) {
                        let temp = new profile(false, items[i], 'release', this.path+'\\'+items[i]);
                        try {
                            let tempResult = await temp.run();
                            profiles[items[i]] = tempResult;
                        } catch(e) {
                            reject(e);
                        }
                    }
                }
                resolve(profiles);
            } catch(e) {
                reject(e);
            }
        });
    }
}