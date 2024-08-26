<template>
    <div class="add-border">
        <div class="alert alert-success" id="alert" role="success" v-if="status == 1">
            添加成功
        </div>
        <div class="alert alert-danger" id="alert" role="fail" v-if="status == 2">
            添加失败，错误信息: {{ err_msg }}
        </div>
        <form class="add-form" method="post" @submit="submit($event)" enctype="multipart/form-data">
            <div class="mb-3 row">
                <label for="title" class="col-sm-1 col-form-label">标题</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" v-model="title">
                </div>
            </div>
            <div class="mb-3 row">
                <label for="author" class="col-sm-1 col-form-label">作者</label>
                <div class="col-sm-9">
                    <input type="text" class="form-control" v-model="author">
                </div>
            </div>
            <div class="mb-3 row">
                <label for="content" class="col-sm-1 col-form-label">内容</label>
                <div class="col-sm-9">
                    <textarea class="form-control" id="content" v-model="content" rows="3" required></textarea>
                </div>
            </div>
            <div class="mb-3 row">
                <label for="file" class="col-sm-1 col-form-label">上传文件</label>
                <div class="col-sm-9">
                    <input type="file" class="form-control" @change="handleFileUpload">
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
            file: null,  // 用于存储上传的文件
        };
    },
    methods: {
        handleFileUpload(event) {
            this.file = event.target.files[0];  // 获取文件
        },
        submit(event) {
            event.preventDefault();
            const { title, author, content, file } = this;

            const formData = new FormData();
            formData.append('title', title === '' ? content.substring(0, 10) + '...' : title);
            formData.append('author', author === '' ? 'anonymous' : author);
            formData.append('content', content);

            if (file) {
                // 对文件名进行编码
                const encodedFileName = encodeURIComponent(file.name);
                // 将文件添加到 FormData 中
                formData.append('file', file, encodedFileName);
                // 可选：如果服务器端需要原始文件名进行某些处理，可以额外发送一个字段
                formData.append('originalFileName', encodedFileName);
            }

            axios.post('/data/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
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
