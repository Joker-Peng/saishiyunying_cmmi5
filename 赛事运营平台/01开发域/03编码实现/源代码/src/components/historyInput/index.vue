<template>
    <div class="history-container">
        <template v-if="isMobile()">
            <!-- 新增 -->
            <button class="add" @click="showYearPopup=true">
                <i class="el-icon-plus"></i>
                添加执裁经历
            </button>
            <!-- 列表 -->
            <div class="history-input mobile" v-for="item in cacheValue" :key="item.year" @click="handleClickItem(item)">
                <span class="year">{{item.year}}</span>
                <div class="history">
                    <span v-for="historyItem in selectOptions[item.year].filter(d => item.history.includes(d.value))" :key="historyItem.value">
                        {{historyItem.label}}
                    </span>
                </div>
                <button v-show="!readOnly" class="delete" @click.stop="handleDelete(historyItem)"><i class="el-icon-delete"></i></button>
            </div>
        </template>
        <template v-else>
            <!-- 新增 -->
            <div v-show="!readOnly" class="history-input">
                <el-select class="year" v-model="addData.year" @change="handleChangeYear(addData)" placeholder="请选择年份">
                    <el-option
                        v-for="year in yearOptions"
                        :disabled="cacheValue.map(d=>d.year).includes(year)"
                        :key="year"
                        :label="year"
                        :value="year">
                    </el-option>
                </el-select>
                <el-select class="history" v-model="addData.history" multiple collapse-tags placeholder="请选择赛事">
                    <el-option
                        v-for="item in selectOptions[addData.year]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 添加按钮 -->
                <button class="add" @click="handleAdd"><i class="el-icon-plus"></i></button>
            </div>
            <!-- 列表 -->
            <div class="history-input" v-for="item in cacheValue" :key="item.year">
                <el-select class="year" disabled v-model="item.year" placeholder="请选择">
                    <el-option
                        v-for="year in yearOptions"
                        :key="year"
                        :label="year"
                        :value="year">
                    </el-option>
                </el-select>
                <el-select class="history" v-model="item.history" multiple collapse-tags placeholder="请选择">
                    <el-option
                        v-for="item in selectOptions[item.year]"
                        :key="item.value"
                        :label="item.label"
                        :disabled="readOnly"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- 添加按钮 -->
                <button v-show="!readOnly" class="delete" @click="handleDelete(item)"><i class="el-icon-delete"></i></button>
            </div>
        </template>

        <!-- 移动端选择年份 -->
        <van-popup position="bottom" v-model="showYearPopup" :close-on-click-overlay="false">
            <Picker
                title="年份"
                show-toolbar
                :columns="yearOptions.filter(d => !cacheValue.some(d1 => d1.year == d))"
                @confirm="handleChooseYear"
                @cancel="showYearPopup=false"
            />
      </van-popup>
        <!-- 移动端选择历史赛事 -->
        <CheckBoxPopup :visible.sync="showHistoryPopup" :title="historyPopupTitle" :options="historyPopupOptions" v-model="addData.history" @input="handleAdd">
        </CheckBoxPopup>

    </div>
</template>

<script>
import * as api_account from "../../api/account";
import CheckBoxPopup from "@/components/checkBoxPopup"
import { Picker} from "vant";
export default {
    name: 'WorkspaceJsonIndex',
    components: {
        CheckBoxPopup, Picker
    },
    props: {
        value: {
            type: Object,
            default: () => ({})
        },
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            addData: {
                year: "",
                history: [],
            },
            cacheValue: [],
            selectOptions: {},
            showHistoryPopup: false,
            showYearPopup: false,
        };
    },
    computed: {
        yearOptions() {
            // 采用倒序 除去列表中已有的年份 在所有有历史赛事的年份
            return Object.keys(this.selectOptions).sort((a,b) => b-a);
        },
        historyPopupTitle() {
            return `执裁经历（${this.addData.year}）`
        },
        historyPopupOptions() {
            let list = this.selectOptions[this.addData.year] || [];
            let res = list.reduce((res, val) => {
                if(!res[val.type]) {
                    res[val.type] = []
                }
                res[val.type].push({
                    ...val,
                    label: val.name
                })
                return res
            }, {})
            return res;
        }
    },
    watch: {
        value: {
            handler(nowVal) {
                // 深拷贝 防止脏父组件数据
                this.cacheValue = Object.keys(nowVal).reverse().map(year => ({
                    year: year,
                    history: nowVal[year].map(d => d.id)
                }))
            },
            immediate: true
        },
    },
    mounted() {
        this.loadOptions()
    },

    methods: {
        loadOptions() {
            api_account.contestHistoryList({paging: 0}).then(res => {
                if(res.success) {
                    this.selectOptions = res.data.rows.reduce((res,val) => {
                        // 如果没有key 则创建
                        if(!Object.keys(res).some(d => d == val.year)) {
                            res[val.year] = [];
                        }
                        res[val.year].push({
                            ...val,
                            label: `${val.type} - ${val.name}`,
                            value: val.id
                        });
                        return res
                    }, {})
                }
            })
        },
        handleChangeYear(obj) {
            // 修改月份把当前行的赛事清空
            obj.history = [];
        },
        // 移动端添加 修改年份
        handleChooseYear(year) {
            this.addData.year = year;
            this.addData.history = [];
            this.showYearPopup = false;
            this.showHistoryPopup = true;
        },
        handleClickItem(item) {
            this.addData.year = item.year;
            this.addData.history = [...item.history];
            this.showHistoryPopup = true;
        },
        handleAdd() {
            if(this.addData.history.length) {
                // 判断是否为修改
                let isEdit = this.cacheValue.some(d => d.year == this.addData.year);
                if(isEdit) {
                    let changeItem = this.cacheValue.find(d => d.year == this.addData.year);
                    changeItem.history = this.addData.history;
                    this.addData = {
                        year: "",
                        history: [],
                    }
                } else {
                    this.cacheValue.unshift(this.addData);
                    this.addData = {
                        year: "",
                        history: [],
                    }
                }
            } else {
                this.$message.error("请先选择赛事")
            }
        },
        handleDelete(item) {
            let index = this.cacheValue.find(d => d == item);
            this.cacheValue.splice(index, 1);
        },
        getIdList() {
            let res = [...this.addData.history];
            this.cacheValue.forEach(d => {
                res.push(...d.history)
            })
            return res
        }
    },
};
</script>

<style lang="less" scoped>
.history-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    .history-input {
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
        &:last-of-type {
            margin-bottom: 0;
        }
        &.mobile {
            line-height: 24px;
            font-size: 14px;
            color: #666666;
            .year {
                margin-right: 5px;
                width: 82px;
            }
            .history {
                display: flex;
                flex-direction: column;
                width: 0;
                flex: auto;
                height: auto;
                span {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            button {
                width: 32px;
                height: 32px;
            }
        }
        .year {
            flex: none;
            margin-right: 10px;
            width: 121px;
            height: 40px;
        }
        .history {
            flex: 1;
            margin-right: 10px;
            width: 450px;
            height: 40px;
        }
        button {
            width: 42px;
            height: 42px;
            background: #FFFFFF;
            border-radius: 4px;
            font-size: 20px;
            border: 1px solid;
            cursor: pointer;
            &.delete {
                border-color: #F70000;
                color: #F70000;
            }
            &.add {
                border-color: #1D81EE;
                color: #1D81EE;
            }
        }
    }
    .add {
        margin-bottom: 10px;
        width: 100%;
        height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #1D81EE;
        font-size: 14px;
        color: #1D81EE;
    }
}
</style>