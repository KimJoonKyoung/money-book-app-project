// main.js 또는 main.ts 파일

import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // router 파일의 경로에 맞게 수정
import { createPinia } from 'pinia'; // Pinia를 임포트합니다.
import 'bootstrap/dist/css/bootstrap.css';
const app = createApp(App);

// Pinia를 애플리케이션에 등록합니다.
const pinia = createPinia();
app.use(pinia);

app.use(router); // 라우터를 애플리케이션에 등록합니다.

app.mount('#app');
