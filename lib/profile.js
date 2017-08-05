"use strict";

const request = require('request-promise'), fs = require('fs'),
    path = require('path');

module.exports = class {
    /**
     * 프로파일을 불러오는 클래스입니다.
     * @param {boolean} isweb 웹에서 프로파일을 받아올지 설정합니다.
     * @param {string} name 로컬에서 불러올 경우, 프로파일의 이름을 설정합니다.
     * @param {string} type 프로파일의 타입입니다.
     * @param {string} path 프로파일의 위치를 설정합니다.
     */
    constructor(isweb = true, name = null, type = "release", path = null) {
        if(name == null || path == null) {
            this.ready = false;
            return false;
        } else {
            this.isweb = isweb;
            this.name = name;
            this.type = type;
            this.path = path;
            this.ready = true;
            return true;
        }
    }

    /**
     * Promise 로 마인크래프트 실행 관련 객체 또는 실패 메세지가 전달됩니다.
     * @return {Promise}
     */
    run() {
        return new Promise(async(resolve, reject) => {
            if(this.ready == true) {
                try {
                    let profile;
                    if(this.isweb) { //만약에 웹 프로파일을 읽어온다면?
                        try {
                            profile = await request(this.path);
                        } catch(e) {
                            reject(e.message);
                        }
                    } else { //로컬 프로파일을 읽어온다면?
                        try {
                            profile = await(async(path) => {
                                return new Promise((resolve, reject) => {
                                    fs.readFile(path, 'utf8', (err, res) => {
                                        if(err) reject(err);
                                        else resolve(res);
                                    });
                                });
                            })(path.join(this.path, this.name+'.json'));
                        } catch(e) {
                            reject(e);
                        }
                    }
                    this.raw = profile; //this.raw 에 JSON Data를 저장한다.

                    profile = JSON.parse(profile); //profile 에 JSON Parse 데이터를 담아온다.

                    //resolve(profile);

                    // 실행에 필요한 정보들을 얻어온다.

                    let result = {};

                    if(profile.assetIndex == null) { //에셋 인덱스가 없다면?
                        result.assetsIndex = { //에셋 인덱스를 예전 인덱스를 적용한다.
                            id: "legacy",
                            url: "https://launchermeta.mojang.com/mc/assets/legacy/c0fd82e8ce9fbc93119e40d96d5a4e62cfa3f729/legacy.json"
                        }
                    } else { //만약 있다면
                        result.assetsIndex = profile.assetIndex; //프로파일의 에셋 인덱스를 적용한다.
                    }

                    if(profile.assets == null) { //에셋 데이터가 없다면?
                        result.assets = "legacy"; //에셋 데이터를 예전 데이터를 가져온다.
                    } else { //만약 있다면
                        result.assets = profile.assets; //프로파일의 에셋 데이터를 적용한다.
                    }

                    result.mainClass = profile.mainClass; //메인클래스 설정
                    result.minecraftArgument = profile.minecraftArguments; //세부 파라미터 설정
                    result.libraries = profile.libraries; //라이브러리 설정

                    if(profile.downloads == null) { //만약 다운로드 데이터가 없다면?
                        result.downloads = { //빈 데이터를 적용한다.
                            client: {
                                url : ""
                            }
                        }
                    } else { //만약 있다면
                        result.downloads == profile.downloads; //프로파일의 다운로드 데이터를 적용한다.
                    }

                    if(profile.jar != null) { //포지만 해당. 실행해야 될 파일이 따로 정해져있다면?
                        result.jar = profile.jar; //그 파일을 저장한다.
                    } else { //아니라면?
                        result.jar == null; //null 을 지정한다.
                    }

                    resolve(result); //필요한 데이터만 리턴한다.

                } catch(e) {
                    reject(e);
                }
            } else {
                reject('parse not ready');
            }
        });
    }
}