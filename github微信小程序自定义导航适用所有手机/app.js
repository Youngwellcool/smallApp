//app.js
import page from './utils/page';

console.log(page)
App({
    onLaunch: function() {
        Page = page;
    },
    //globalData: {}
})