"use strict";

const fs = require('fs'), profile = require('./profile.js'),
    each = require('async-each');

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

                let profiles = {}; //프로파일 저장공간

                each(items, async(item, next) => {
                    try {
                        let status = await(async(path) => {
                            return new Promise((resolve, reject) => {
                                fs.exists(path, (exists) => {
                                    if(exists == true) resolve(true);
                                    else  resolve(false);
                                });
                            });
                        })(this.path+'\\'+item+'\\'+item+'.json');
                        if(status == true) {
                            let temp = new profile(false, item, 'release', this.path+'\\'+item);
                            let tempResult = await temp.run();
                            profiles[item] = tempResult;
                            next();
                        }
                    } catch(e) {
                        next(e);
                    }
                }, (err, res) => {
                    if(err) reject(err);
                    else {
                        let orderedProfiles = {};
                        Object.keys(profiles).sort().forEach(function(key) {
                            orderedProfiles[key] = profiles[key];
                        });
                        resolve(orderedProfiles);
                    }
                });
            } catch(e) {
                reject(e);
            }
        });
    }
}