import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // router 파일의 경로에 맞게 수정
import { createPinia } from 'pinia'; // Pinia를 임포트합니다.
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMoneyBillWave, faReceipt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.css';
// FontAwesome 아이콘을 라이브러리에 추가합니다.
library.add(faMoneyBillWave, faReceipt);
const app = createApp(App);
// Pinia를 애플리케이션에 등록합니다.
const pinia = createPinia();
app.use(pinia);
// FontAwesome 아이콘을 전역 컴포넌트로 등록합니다.
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router); // 라우터를 애플리케이션에 등록합니다.
app.mount('#app');
