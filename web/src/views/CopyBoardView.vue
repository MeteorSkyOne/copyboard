<template>
    <div class="accordion copy-list" id="copyList">
        <div class="accordion-item" v-for="item in copyList" :key="item.id">
            <h2 class="accordion-header" :id="item.heading">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    :data-bs-target="`#${item.collapse}`" aria-expanded="false" aria-controls="collapseTwo">
                    <table class="table list-table">
                        <tr>
                            <td class="id">{{ item.id }}</td>
                            <td class="title">{{ item.title }}</td>
                            <td class="time">{{ item.created_time }}</td>
                            <td class="author">{{ item.author }}</td>
                        </tr>
                    </table>
                </button>
            </h2>
            <div :id="item.collapse" class="accordion-collapse collapse" :aria-labelledby="`#${item.heading}`"
                data-bs-parent="#copyList">
                <div class="accordion-body">
                    <div>
                        <button type="button" class="btn btn-outline-primary float-end copy-btn btn-sm"
                            :data-clipboard-target="`#div${item.id}`">copy</button>
                    </div>
                    <div :id="`div${item.id}`">
                        <pre>
                            {{ item.content }}
                        </pre>
                    </div>
                    <div v-if="item.file_path">
                        <a :href="'/api/data/download/' + item.file_path">{{ item.filename }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import axios from 'axios';
import $ from 'jquery';
import Clipboard from 'clipboard';
import util from '../../utils/util.js';

export default {
    name: 'CopyBoard',
    data() {
        return {
            copyList: [],
        };
    },
    created() {

        this.getCopyList();
        this.clip();

    },
    methods: {
        getCopyList() {
            axios.get('/data/copyList')
                .then(response => {
                    var data = response.data;
                    $.each(data, function (index, value) {
                        value.collapse = 'collapse' + index;
                        value.heading = 'heading' + index;
                        value.created_time = util.formatDate(value.created_time);
                    });
                    // sort by time asc
                    data.sort(function (a, b) {
                        return a.created_time > b.created_time ? -1 : 1;
                    });
                    this.copyList = data;
                })
                .catch(error => {
                    console.log(error);
                })
        },
        clip() {
            var clipboard = new Clipboard('.copy-btn');
            clipboard.on('success', function (e) {
                $(e.trigger).text('copied');
                setTimeout(function () {
                    $(e.trigger).text('copy');
                }, 1000);
            });
        }
    }
}

</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.copy-list {
    width: 80%;
    margin: 1% auto;
}

.id {
    width: 10%;
}

.title {
    width: 40%;
}

.time {
    width: 20%;
}

.author {
    width: 20%;
}

.list-table {
    height: 80%;
    margin: auto auto;
}

pre {
    white-space: pre-line;
    /* css3.0 */
    white-space: -moz-pre-wrap;
    /* Firefox */
    white-space: -pre-wrap;
    /* Opera 4-6 */
    white-space: -o-pre-wrap;
    /* Opera 7 */
    word-wrap: break-word;
    /* Internet Explorer 5.5+ */
}
</style>
