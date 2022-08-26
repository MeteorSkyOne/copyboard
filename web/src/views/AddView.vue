<template>
    <div class="add-border">
        <div class="alert alert-success" id="alert" role="success" v-if="status == 1">
            添加成功
        </div>
        <div class="alert alert-danger" id="alert" role="fail" v-if="status == 2">
            添加失败，错误信息: {{ err_msg }}
        </div>
        <form class="add-form" method="post" @submit="submit($event)">
            <div class="mb-3 row">
                <label for="title" class="col-sm-1 col-form-label">标题</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" v-model="title" required>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="author" class="col-sm-1 col-form-label">作者</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" v-model="author" required>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="content" class="col-sm-1 col-form-label">内容</label>
                <div class="col-sm-9">
                    <textarea class="form-control" id="content" v-model="content" rows="3" required></textarea>
                </div>
            </div>
            <button type="submit" class="btn btn-outline-primary" id="btn-sutmit">提交</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AddView',
    data() {
        return {
            title: '',
            author: '',
            content: '',
            status: 0,
            err_msg: '',
        };
    },
    methods: {
        submit(event) {
            event.preventDefault();
            const { title, author, content } = this;
            axios.post('/data/add', {
                title: title,
                author: author,
                content: content
            })
                .then(response => {
                    this.status = response.data.code;
                    this.err_msg = response.data.msg;
                }, error => {
                    this.status = 2;
                    this.err_msg = error.response.data.err_msg;
                })
        }
    }
}


</script>

<style>
.add-form {
    margin: 0 auto;
    width: 115%;
}

.add-border {
    border: 1px solid #ccc;
    padding: 20px;
    width: 50%;
    margin: 1% auto;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
}

#content {
    height: 25rem;
}

#btn-sutmit {
    margin-right: 10%;
}
</style>