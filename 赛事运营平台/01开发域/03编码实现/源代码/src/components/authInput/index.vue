<template>
    <div v-if="!isMobile()">
        <el-checkbox-group v-model="authSelected">
            <div
                class="identityList"
                v-for="authKey in Object.keys(authParams)"
                :key="authKey"
            >
                <div class="contestTypeName">{{ authKey }}</div>
                <div>
                    <div class="dialogBox-checkout">
                        <el-checkbox
                            :label="item.value"
                            v-for="item in authParams[authKey]"
                            :key="item.value"
                        >{{item.label}}</el-checkbox>
                    </div>
                </div>
            </div>
        </el-checkbox-group>
    </div>
    <!-- 移动端 -->
    <CheckBoxPopup v-else :visible.sync="showPopup" title="身份" :options="authParams" v-model="authSelected">
    </CheckBoxPopup>
</template>

<script>
import * as api_account from "@/api/account";
import CheckBoxPopup from "@/components/checkBoxPopup"
export default {
    components: {CheckBoxPopup},
    name: 'authInput',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            authParams: {},
            authSelected: [], //id
            showPopup: false
        };
    },
    watch: {
        show(nowVal) {
            this.showPopup = nowVal;
        },
        showPopup(nowVal) {
            this.$emit("update:show", this.showPopup)
            if(!nowVal) {
                // 关闭弹窗，整理好数据传出去
                let returnData = Object.keys(this.authParams).reduce((res, key) => {
                    let data = this.authParams[key].filter(d => this.authSelected.includes(d.value)).map(d => ({...d, text: d.label}))
                    if(data?.length) {
                        res[key] = data
                    }
                    return res
                }, {})
                this.$emit("confirm", returnData)
            }
        }
    },
    mounted() {
        this.loadData();
    },

    methods: {
        //身份列表
        loadData() {
            api_account.getIdentityList().then((res) => {
                if (res.success) {
                    this.authParams = res.data.list.reduce((res1, val) => {
                        res1[val.contestTypeName] = val.identityList.map(d => ({
                            ...d,
                            label: d.identityName,
                            value: d.identityId
                        }))
                        return res1;
                    }, {});
                    this.authSelected = res.data.list.reduce((res1, val) => {
                        res1.push(...val.identityList.filter(d => d.select).map(d => d.identityId));
                        return res1;
                    }, [])
                }
            });
        },
        getAuthListByType(authKey) {
            return this.authParams[authKey].filter(d => d.select).map(d => d.label).join("、")
        },
        getValue() {
            return this.authSelected
        }
    },
};
</script>

<style lang="less" scoped>
.identityList {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 14px;
}
.contestTypeName {
    flex: none;
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #333333;
  width: 87px;
}
.dialogBox-checkout /deep/ .el-checkbox__label {
  margin-left: 2px;
  padding-left: 0px;
}
.dialogBox-checkout /deep/ .el-checkbox {
  margin-right: 10px;
  width: auto;
  min-width: 110px;
}
</style>