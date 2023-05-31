import axios from 'axios'
import store from './index'
import Vue from 'vue'
import i18n from '@/i18n'

const axiosInstance = axios.create()
// Vue.prototype.$axios = axiosInstance
axiosInstance.defaults.withCredentials = true

if (process.env.NODE_ENV === 'development') {
    axiosInstance.defaults.baseURL = "https://dev-rx78-3.ff15.ru"
}

axiosInstance.interceptors.response.use(
    res => {
        if (res.success === false) {
            Vue.notify({
                group: 'n',
                text: i18n.t(res.code),
                duration: 1500,
                type: "error",
            })
        } else {
            return res
        }
    },
    error => {
        if (error.response && error.response.data && error.response.data.code === 'user.banned') {
            let penalty = error.response.data.penalty ? error.response.data.penalty : {}
            store.dispatch('main/setBannedPopup', {
                reason: penalty.reason,
                created_at: penalty.created_at,
                end: penalty.end
            })
            return Promise.reject(i18n.t('errors.banned'));
        } else {
            if (error.response &&
                error.response.data &&
                error.response.data.error === 'unauthorized'
                //  &&
                // (
                //     ['/', '/privacy', '/agreement']
                //         .includes(window.location.pathname)
                // )
            ) {
                    // 
            } else {
                Vue.notify({
                    group: 'n',
                    text: i18n.t(error.code || (error.response && String(error.response.status)) || error.message),
                    duration: 1500,
                    type: "error",
                })
            }
            return Promise.reject(error.message);
        }
    }
)
// axiosInstance.interceptors.response.use( response => response,
//     error => {
//         if (error.response && error.response.data && error.response.data.code === 'user.banned') {
//             let penalty = error.response.data.penalty ? error.response.data.penalty : {}
//             store.dispatch('main/setBannedPopup', {
//                 reason: penalty.reason,
//                 created_at: penalty.created_at,
//                 end: penalty.end
//             })
//             return Promise.reject('Забанен');
//         } else {
//             return Promise.reject(error.message);
//         }
        
        
//     }
// )

export default axiosInstance;