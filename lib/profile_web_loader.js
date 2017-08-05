"use strict";

const request = require('request-promise'), profile = require('./profile.js');

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
                });

                let profiles = {};
                for(let i in result.versions) {
                    let temp = new profile(true, result.versions[i].id, 
                        result.versions[i].type, result.versions[i].url);
                    try {
                        let tempResult = await temp.run();
                        profiles[result.versions[i].id] = tempResult;
                    } catch(e) {
                        reject(e);
                    }
                }
                resolve(profiles);
            } catch(e) {
                reject(e);
            }
        });
    }
}