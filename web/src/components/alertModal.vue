<template>
    <div id="alertModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">提示</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p v-text="msg"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'alertModal',
    props: {
        msg: String,
    }
}
</script>