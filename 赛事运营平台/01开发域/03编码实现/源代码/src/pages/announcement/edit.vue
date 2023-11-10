<template>
  <div>
    <div class="page-container">
      <div class="title">
        {{ isEdit ? "编辑公告" : "新增公告" }}
        <span class="back" @click="handleCancel">
          <img src="@/assets/announcement/icon_back.png" alt="" />
          返回
        </span>
      </div>
    </div>
    <div class="box">
      <el-form
        class="form"
        :model="announcement"
        :rules="rules"
        ref="form"
        label-width="120px"
      >
        <el-form-item label="标题：" prop="title">
          <el-input v-model="announcement.title"></el-input>
        </el-form-item>
        <el-form-item label="公告内容：" prop="content">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              mode="default"
            />
            <Editor
              style="height: 300px; overflow-y: hidden"
              v-model="announcement.content"
              :defaultConfig="editorConfig"
              mode="default"
              class="editor"
              @onCreated="onEditorCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="公告类型：" prop="type">
          <el-select
            clearable
            placeholder="请选择公告类型"
            v-model="announcement.type"
            style="width: 224px"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态：" prop="status">
          <div
            class="status"
            @click="announcement.status = 1 - announcement.status"
          >
            <img
              v-if="announcement.status"
              src="@/assets/announcement/icon_status_on.png"
              alt
            />
            <img v-else src="@/assets/announcement/icon_status_off.png" alt />
          </div>
        </el-form-item>
        <template v-if="announcement.status">
          <el-form-item label="是否短信通知：" prop="smsNotify">
            <el-radio-group v-model="announcement.smsNotify">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发布范围：">
            <div
              class="auth-container"
              v-for="contest in rangeList"
              :key="contest.contestTypeId"
            >
              <span class="auth-title">{{ contest.contestTypeName }}</span>
              <el-checkbox-group v-model="auth[contest.contestTypeName]">
                <el-checkbox
                  v-for="checkboxData in contest.identityList"
                  :label="checkboxData.identityId"
                  :key="checkboxData.identityId"
                  >{{ checkboxData.identityName }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </el-form-item>
        </template>
        <el-form-item label="附件：" prop="attachment">
          <el-upload
            action="http://www.baidu.com"
            class="upload-demo"
            multiple
            :show-file-list="false"
            :before-upload="promiseReject"
            :on-change="handleChangeFile"
            :accept="fileType.join(',')"
          >
            <div slot="trigger" class="button-upload">
              <img src="@/assets/announcement/icon_upload.png" alt="" />
              点击上传
            </div>
            <div slot="tip" class="el-upload__tip">
            <div>
              支持文件类型：PDF、图片、压缩文件、PPT、Excel、Word，单个文件大小不超过20MB
              <!-- 文件列表 -->
              <file-list :value="announcement.attachment"></file-list>
            </div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </div>
  </div>
</template>
<script>
import "@wangeditor/editor/dist/css/style.css";
import { mapGetters } from "vuex";
import * as api_account from "@/api/account";
import dialogBox from "@/components/accountManage/dialog.vue";
import FileList from "./components/fileList.vue"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
  components: { dialogBox, Editor, Toolbar, FileList },
  data() {
    return {
      announcement: {
        title: "", //标题
        status: 0, // 发布状态
        smsNotify: 0, //是否短信通知
        content: "", //公告内容
        type: 1, //公告类型
        range: "",
        attachment: [],
      },
      rules: {
        title: [{ required: true, message: "请输入公告标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入公告内容", trigger: "change" },
        ],
      },
      editor: null,
      toolbarConfig: {},
      editorConfig: { 
        placeholder: "请输入内容...",
        MENU_CONF: {
          uploadImage: {
            customUpload: this.editorUpload
          }
        } 
      },
      rangeList: [],
      auth: {},
      fileType: [
        "image/*",
        ".png,.jpg,.jpeg",
        ".doc,.docx",
        ".xls,.xlsx",
        ".ppt,.pptx",
        ".pdf",
        ".zip,.rar",
      ], //1	图片 2	word文档 3	excel文档 4	ppt文档 5	pdf文档 6	压缩文件
      // 公告类型1日常公告 2处罚公告 3比赛公告
      typeOptions: [
        {label: "日常公告", value: 1},
        {label: "处罚公告", value: 2},
        {label: "比赛公告", value: 3},
      ],
    };
  },
  computed: {
    ...mapGetters(["partTimeCoach"]),
    isEdit() {
      return this.$route.params.id > 0;
    },
  },
  watch: {
    auth: {
      handler(nowV) {
        let rangeArr = Object.values(nowV).reduce((res, val) => {
          res.push(...val);
          return res;
        }, []);
        this.announcement.range = rangeArr.map((d) => d + "").join(",");
      },
      deep: true,
    },
  },
  created() {
    this.isEdit && (this.announcement.announcementId = this.$route.params.id);
    this.loadData();
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onEditorCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    editorUpload(file, callback) {
      var data = new FormData();
      data.append("file", file);
      data.append("userId", this.$store.getters.userInfo.id)
      // 上传文件
      api_account.uploadFile(data).then((res) => {
        if (res.success) {
          this.editor.dangerouslyInsertHtml(`<img src="${res.data.url}" alt="${res.data.name}" data-href="${res.data.url}" style="width: 100%;"/>`)
          // callback(res.data.url, res.data.name, res.data.url)
        }
      });
    },
    loadData() {
      if(!this.isEdit) {
        this.loadDataAdd();
        return
      }
      api_account
        .getAnnouncementDetail({
          announcementId: this.$route.params.id,
        })
        .then((res) => {
          if (res.success) {
            this.rangeList = res.data.range;
            this.auth = res.data.range.reduce((res, val) => {
              res[val.contestTypeName] = val.identityList
                .filter((d) => d.select)
                .map((d) => d.identityId);
              return res;
            }, {});
            if (res.data.detail) {
              for (let key in res.data.detail) {
                this.announcement.hasOwnProperty(key) &&
                  (this.announcement[key] = res.data.detail[key]);
              }
            }
            this.announcement.attachment = res.data.attachment;
          }
        });
    },
    // 新增时获取数据
    loadDataAdd() {
      api_account.getIdentityList({}).then(res => {
        if(res.success) {
          this.rangeList = res.data.list.map(d => ({
            ...d,
            identityList: d.identityList.map(d1 => ({
              ...d1,
              select: 0
            }))
          }))
          this.auth = this.rangeList.reduce((res, val) => {
            res[val.contestTypeName] = val.identityList
              .filter((d) => d.select)
              .map((d) => d.identityId);
            return res;
          }, {});
        }
      })
    },
    handleChangeFile(file) {
      let selectedFile = file.raw;
      // 判断文件大小
      if (selectedFile.size > 20 * 1024 * 1024) {
        this.$message.error(`${selectedFile.name}文件不得大于20M`);
        return;
      }
      this.announcement.attachment.push(selectedFile);
      var data = new FormData();
      data.append("userId", this.$store.getters.userInfo.id)
      data.append("file", selectedFile);
      // 上传文件
      api_account.uploadFile(data).then((res) => {
        if (res.success) {
          let selectedFileIndex = this.announcement.attachment.findIndex(
            (d) => d == selectedFile
          );
          console.log(selectedFileIndex);
          this.announcement.attachment.splice(selectedFileIndex, 1, res.data);
        }
      });
    },
    handleCancel() {
      this.$confirm("取消之后对于已作出的修改不会保存").then(() => {
        this.$router.go(-1);
      });
    },
    handleConfirm() {
      if(!this.announcement.title) {
        this.$message.error("请填写该公告的标题");
        return
      }
      if(!this.announcement.content || this.announcement.content == "<p><br></p>") {
        this.$message.error("请填写该公告的内容")
        return
      }
      this.$confirm(`确定要${this.isEdit ? "修改" : "新增"}该公告信息吗？`).then(() => {
        let method = this.isEdit
          ? api_account.updateAnnouncement
          : api_account.addAnnouncement;
        method({
          ...this.announcement,
          attachment: this.announcement.attachment.map(
            (d) => `${d.name},${d.type},${d.url}`
          ),
        }).then((res) => {
          if (res.success) {
            res.success && this.$message.success(this.isEdit ? "修改成功" : "新增成功");
            this.$router.go(-1);
          }
        });
      });
    },
    promiseReject() {
      return Promise.reject()
    }
  },
};
</script>
  
<style scoped lang="scss">
.page-container {
  padding-bottom: 0;
}
::v-deep .title {
  font-size: 14px;
  border: 0;
  color: inherit;
  font-weight: normal;
}
.title {
  position: relative;
  right: 20px;
  bottom: 20px;
  margin-bottom: -20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0;
  font-size: 20px;
  font-weight: bold;
  .back {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #1d81ee;
    font-weight: 400;
    cursor: pointer;
    img {
      margin-right: 6px;
      width: 16px;
      height: 13px;
    }
  }
}
.status {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  cursor: pointer;
  img {
    width: 52px;
    height: 22px;
  }
}
.auth-container {
  float: left;
  display: flex;
  width: 50%;
  height: 40px;
  .auth-title {
    padding-right: 10px;
    width: 60px;
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    color: #666666;
  }
}
.dialog-footer {
  border-top: 1px solid #e5e8ed;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form {
  padding: 0 20px;
}
.button-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 106px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #1d81ee;
  color: #1d81ee;
  cursor: pointer;
  img {
    margin-right: 8px;
    height: 14px;
    width: 14px;
  }
}
</style>
  