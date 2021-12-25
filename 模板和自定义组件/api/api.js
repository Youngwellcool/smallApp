import { Fetch } from './fetch.js';

export default {
    getResource(data) {
        return Fetch({
            url: '/pxapp/api/project/userProjectList',
            data,
        })
    },

    getActivityList(data) {
        return Fetch({
            url: '/yxapp/api/mobile/activity/list',
            data,
            method: 'GET'
        })
    }
}