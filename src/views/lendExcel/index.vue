<template>
  <div class="vue_xlsx">
    <h1>vue-xlsx-table</h1>
    <vue-xlsx-table @on-select-file="handleOk">on-select-file</vue-xlsx-table>
  </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    created(){

    },
    mounted(){

    },
    methods: {
        handleOk (convertedData) {
            console.log(convertedData)
        }
    }
}
</script>

<style lang="less">

</style>
