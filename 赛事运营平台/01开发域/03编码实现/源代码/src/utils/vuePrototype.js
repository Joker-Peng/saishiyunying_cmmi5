// moment插件
import moment from 'moment';
export default {
    install: Vue => {
        Vue.prototype.$moment = moment
        Vue.prototype.isMobile = () => {
            const passPhoneType = window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
            const passPhoneWidth = window.screen.width < 550;
            return passPhoneType && passPhoneWidth;
        }
        Vue.prototype.$setMobileHeightByVh = (vh=100) => {
            const innerHeight = window.innerHeight;
            return parseInt(innerHeight * 100 / vh) + "px"
        }
        Vue.prototype.$dictionary = {
            contestType: [
                {
                    value: "1",
                    label: "LPL",
                },
                {
                    value: "2",
                    label: "LDL",
                },
                {
                    value: "3",
                    label: "WRL",
                },
                {
                    value: "4",
                    label: "VAL",
                }
            ],
            position: [
                {
                    value: "1",
                    label: "主裁判",
                },
                {
                    value: "2",
                    label: "场上裁判",
                },
                {
                    value: "3",
                    label: "场下裁判",
                },
                {
                    value: "4",
                    label: "场下裁判Leader",
                },
                {
                    value: "5",
                    label: "助理主裁判",
                },
            ],
            permission: [
                {
                    value: "1",
                    label: "超级管理员",
                },
                {
                    value: "2",
                    label: "管理员",
                },
                {
                    value: "3",
                    label: "核心兼职",
                },
                {
                    value: "4",
                    label: "自由兼职",
                }
            ],
            history: [
                {
                    value: "1",
                    label: "LOL",
                },
                {
                    value: "2",
                    label: "LOLM",
                },
                {
                    value: "3",
                    label: "VAL",
                }
            ],
            refereeStatus: [
                {
                    value: 1,
                    label: "在职"
                },
                {
                    value: 2,
                    label: "冻结"
                },
                {
                    value: 3,
                    label: "离职"
                }
            ]
        }
    }
}