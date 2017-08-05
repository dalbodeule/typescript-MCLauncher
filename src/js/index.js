"use strict";

const login = require('./lib/login.js'), configClass = require('./lib/config.js');

let header = new Vue({
    el: '#header',
    data: {
        showNav: false
    }
});
let main = new Vue({
    el: '#app',
    data: {
        viewpage: 'login',
        username: null,
        password: null,
        username_isvalid: false,
        username_isunvalid: false,
        password_isvalid: false,
        password_isunvalid: false
    },
    methods: {
        loginSubmit: async () => {
            if(main.viewpage == 'login') {
                if(main.username != null && main.password != null) {
                    main.username_isunvalid = false;
                    main.username_isvalid = true;
                    main.password_isunvalid = false;
                    main.password_isvalid = true;
                    try {
                        let request = new login(main.username, main.password);
                        let response = await request.run();
                        console.log(response.selectedProfile);
                        await global.config.init();
                        swal({
                            title: "Success!",
                            text: "로그인에 성공했습니다.",
                            type: "success"
                        });
                        let temp = global.config.setUser(response.accessToken, response.clientToken,
                            main.username, response.selectedProfile.id,
                            response.selectedProfile.name);
                        await global.config.save();
                    } catch(e) {
                        console.log(e);
                        if(typeof e.error == 'string') {
                            switch(e.error) {
                                case "Method Not Allowed":
                                case "Not Found":
                                case "Unsupported Media type":
                                    swal({
                                        title: "Error!",
                                        text: "잘못된 요청입니다.",
                                        type: "error"
                                    });
                                    break;
                                
                                case "IllegalArgumentException":
                                case "ForbiddenOperationException":
                                    if(e.cause == "UserMigratedException") swal({
                                        title: "Error!",
                                        text: "이메일을 입력해주세요.",
                                        type: "error"
                                    });
                                    else swal({
                                        title: "Error!",
                                        text: "잘못된 정보입니다. 다시 시도해주세요.",
                                        type: "error"
                                    });
                                    break;
                                default:
                                    swal({
                                        title: "Error!",
                                        text: "무언가 에러가 일어났습니다.",
                                        type: "error"
                                    });
                            }
                        }
                    }
                } else {
                    if(main.username == null) {
                        main.username_isunvalid = true;
                        main.username_isvalid = false;
                    }
                    if(main.password == null) {
                        main.password_isunvalid = true;
                        main.password_isvalid = false;
                    }
                }
            } else {
                console.log('is not login page')
            }
        }
    }
});
async function startLogin() {
    try {
        global.config = new configClass();
        await global.config.init();
        let request = new login(global.config.user.username, '', global.config.user.clientToken);
        let response = await request.valid(global.config.user.accessToken);
        swal({
            title: "Success!",
            text: "로그인에 성공했습니다.",
            type: "success"
        });
    } catch(e) {
        console.log(e);
        if(typeof e.error == 'string') {
            switch(e.error) {
                case "Method Not Allowed":
                case "Not Found":
                case "Unsupported Media type":
                    swal({
                        title: "Error!",
                        text: "잘못된 요청입니다.",
                        type: "error"
                    });
                    break;
                
                case "IllegalArgumentException":
                case "ForbiddenOperationException":
                    if(e.cause == "UserMigratedException") swal({
                        title: "Error!",
                        text: "이메일을 입력해주세요.",
                        type: "error"
                    });
                    else swal({
                        title: "Error!",
                        text: "잘못된 정보입니다. 다시 시도해주세요.",
                        type: "error"
                    });
                    break;
                default:
                    swal({
                        title: "Error!",
                        text: "무언가 에러가 일어났습니다.",
                        type: "error"
                    });
            }
        }
    }
}

$(document).ready(() => {
    startLogin();
});