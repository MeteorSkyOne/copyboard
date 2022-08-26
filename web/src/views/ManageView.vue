<template>
    <div class="login" v-if="isLogin === false">
        <div class="alert alert-danger" id="alert" role="fail" v-if="loginFailed">
            登陆失败
        </div>
        <form class="add-form pwd" method="post" @submit="login($event)">
            <div class="mb-3 row">
                <input class="form-control col-form-label" type="password" placeholder="请输入密码"
                    aria-label="default input example" v-model="pwd">
                <button class="btn btn-outline-primary login-btn col-form-label" type="submit" required>登录</button>
            </div>
        </form>
    </div>

    <div class="manage-panel" v-if="isLogin">

        <div class="chgpwd">
            <button class="btn btn-outline-danger btn-op" type="button" data-bs-toggle="modal"
                data-bs-target="#chgPwdModal">更改密码</button>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">标题</th>
                    <th scope="col">时间</th>
                    <th scope="col">作者</th>
                    <th scope="col">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in copyList" :key="item.id">
                    <th scope="row">{{ item.id }}</th>
                    <td>{{ item.title }}</td>
                    <td>{{ item.created_time }}</td>
                    <td>{{ item.author }}</td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm btn-op" type="button" data-bs-toggle="modal"
                            data-bs-target="#editModal" @click="edit(item)">编辑</button>
                        <button class="btn btn-outline-danger btn-sm btn-op" type="button"
                            @click="remove(item.id)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">Bootstrap</strong>
                <small class="text-muted">11 mins ago</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                Hello, world! This is a toast message.
            </div>
        </div>

        <!-- edit modal -->
        <div class="modal fade" id="editModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">编辑</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form class="add-form" method="post" @submit="submit($event)">
                            <div class="mb-3 row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">ID</label>
                                <div class="col-sm-9">
                                    <input type="text" readonly class="form-control-plaintext" v-model="editModal.id"
                                        required>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="title" class="col-sm-2 col-form-label">标题</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control" v-model="editModal.title" required>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="content" class="col-sm-2 col-form-label">内容</label>
                                <div class="col-sm-9">
                                    <textarea class="form-control" id="content" v-model="editModal.content" rows="3"
                                        required></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                            @click="save()">保存</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- change pwd modal -->
        <div class="modal fade" id="chgPwdModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">更改密码</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form class="add-form" method="post" @submit="submit($event)">
                            <div class="mb-3 row">
                                <label for="title" class="col-sm-3 col-form-label">新密码</label>
                                <div class="col-sm-8">
                                    <input type="password" class="form-control" v-model="chgPwdModal.pwd" required>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="title" class="col-sm-3 col-form-label">确认新密码</label>
                                <div class="col-sm-8">
                                    <input type="password" class="form-control" v-model="chgPwdModal.cfmPwd" required>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                            @click="chgPwd()">更改</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- alert modal -->
        <AlertModal :msg="alertModal.msg"></AlertModal>


    </div>

</template>

<script>
import axios from 'axios';
import $ from 'jquery';
import util from '../../utils/util';
import { useCookies } from "vue3-cookies";
import { Modal } from 'bootstrap'
import AlertModal from '../components/alertModal.vue';

export default {
    name: "ManageView",
    setup() {
        const { cookies } = useCookies();
        return { cookies };
    },
    data() {
        return {
            pwd: "",
            isLogin: false,
            loginFailed: false,
            copyList: [],
            editModal: {
                id: "",
                title: "",
                content: ""
            },
            chgPwdModal: {
                pwd: "",
                cfmPwd: ""
            },
            alertModal: {
                modal: null,
                msg: "",
                show: true,
            }
        };
    },
    created() {
        if (this.cookies.isKey("isLogin")) {
            this.isLogin = this.cookies.get("isLogin");
        }
        else {
            this.cookies.set("isLogin", false);
        }
        this.getLoginStatus();
    },
    mounted() {
        this.alertModal.modal = new Modal(document.getElementById('alertModal'));
    },
    watch: {
        isLogin(f) {
            if (f) {
                this.getCopyList();
            }
        }
    },
    methods: {
        getLoginStatus() {
            axios.get("/data/isLogin")
                .then(response => {
                    console.log(response.data);
                    if (response.data.code == 1) {
                        this.isLogin = true;
                        this.cookies.set("isLogin", true);
                    }
                    else {
                        this.isLogin = false;
                        this.cookies.set("isLogin", false);
                    }
                });
        },
        login(event) {
            event.preventDefault();
            const { pwd } = this;
            axios.post("/data/login", {
                pwd: pwd
            })
                .then(response => {
                    if (response.data.code === 1) {
                        this.isLogin = true;
                    }
                    else {
                        this.isLogin = false;
                        this.loginFailed = true;
                    }
                }).catch(() => {
                    this.isLogin = false;
                    this.loginFailed = true;
                });
        },
        getCopyList() {
            axios.get("/data/copyList")
                .then(response => {
                    var data = response.data;
                    $.each(data, function (index, value) {
                        value.created_time = util.formatDate(value.created_time);
                    });
                    this.copyList = data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        remove(id) {
            axios.post("/data/remove", {
                id: id
            })
                .then(response => {
                    if (response.data.code === 1) {
                        this.getCopyList();
                    }
                }).catch(error => {
                    console.log(error);
                }).finally(() => {
                    this.getCopyList();
                });
        },
        edit(item) {
            this.editModal.id = item.id;
            this.editModal.title = item.title;
            this.editModal.content = item.content;
        },
        save() {
            axios.post("/data/save", {
                id: this.editModal.id,
                title: this.editModal.title,
                content: this.editModal.content
            })
                .then(response => {
                    if (response.data.code === 1) {
                        this.getCopyList();
                    }
                }).catch(error => {
                    console.log(error);
                }).finally(() => {
                    this.getCopyList();
                });
        },
        chgPwd() {
            if (this.chgPwdModal.pwd != this.chgPwdModal.cfmPwd) {
                this.alertM("两次密码不一致");
                return;
            }
            axios.post("/data/chgPwd", {
                pwd: this.chgPwdModal.pwd,
                cfmPwd: this.chgPwdModal.cfmPwd
            })
                .then(response => {
                    if (response.data.code === 1) {
                        this.chgPwdModal.pwd = '',
                            this.chgPwdModal.cfmPwd = '';
                        this.getLoginStatus();
                    }
                }).catch(error => {
                    console.log(error);
                }).finally(() => {
                    this.getLoginStatus();
                });
        },
        alertM(msg) {
            this.alertModal.msg = msg;
            this.alertModal.modal.show();
        }
    },
    components: {
        AlertModal
    }
}

</script>

<style>
.chgpwd {
    margin: 1% auto;
}

.login {
    padding: 20px;
    width: 30%;
    margin: 1% auto;
}

.pwd {
    width: 100%;
}

.login-btn {
    margin-top: 5%;
}

.manage-panel {
    width: 80%;
    margin: 1% auto;
}

.btn-op {
    margin: 0 2%;
}
</style>