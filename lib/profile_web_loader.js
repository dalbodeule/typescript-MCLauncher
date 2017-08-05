"use strict";

const request = require('request-promise'), profile = require('./profile.js'),
    each = require('async-each');

module.exports = class {
    /**
     * 웹 프로파일을 불러옵니다.
     */
    constructor() {
        this.ready = true;
        return true;
    }

    run() {
        return new Promise(async(resolve, reject) => {
            try {
                let result = await request({
                    uri: "https://launchermeta.mojang.com/mc/game/version_manifest.json",
                    method: "GET",
                    json: true
                }); //웹 프로파일 받아오기

                let profiles = {}; //프로파일 저장공간

                each(result.versions, async(item, next) => {
                    let temp = new profile(true, item.id, 
                        item.type, item.url);
                    try {
                        let tempResult = await temp.run();
                        profiles[item.id] = tempResult;
                        next();
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