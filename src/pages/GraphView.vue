<template>
  <div class="date-range-selector">
    <!-- Date Range Selector -->
    <div class="date-input">
      <label for="start-date">시작 날짜:</label>
      <input
        type="date"
        id="start-date"
        v-model="startDate"
        @change="fetchData"
      />
    </div>
    <div class="date-input">
      <label for="end-date">종료 날짜:</label>
      <input type="date" id="end-date" v-model="endDate" @change="fetchData" />
    </div>
    <!-- 새로운 버튼 추가 -->
    <button @click="fetchData" class="btn btn-primary">조회</button>
  </div>
  <!-- 상단 막대 그래프 -->
  <canvas id="topBarChart" width="500" height="150"></canvas><br />
  <!-- 수입 항목별 막대 그래프 -->
  <canvas id="incomeBarChart" width="500" height="150"></canvas><br />
  <!-- 지출 항목별 막대 그래프 -->
  <canvas id="expenseBarChart" width="500" height="150"></canvas>
</template>
<script scoped>
import axios from 'axios';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // 추가
export default {
  data() {
    return {
      startDate: '', // 시작 날짜
      endDate: '', // 종료 날짜
    };
  },
  mounted() {
    this.setDefaultDates(); // 기본 날짜 설정
    this.fetchData(); // 데이터 불러오기
  },
  methods: {
    setDefaultDates() {
      // 기본 시작 및 종료 날짜 설정 (현재 달)
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      this.startDate = firstDayOfMonth.toISOString().split('T')[0];
      this.endDate = lastDayOfMonth.toISOString().split('T')[0];
    },
    fetchData() {
      // 데이터 불러오기
      axios
        .get('./db.json')
        .then((response) => {
          const data = response.data.budget;
          // 카테고리별로 수입 및 지출 데이터 필터링
          const incomeCategories = ['월급', '이자', '용돈', '이월', '기타'];
          const expenseCategories = [
            '식비',
            '교통',
            '주거',
            '통신',
            '문화생활',
            '쇼핑',
            '적금',
            '기타',
          ];
          const incomeData = incomeCategories.map((category) => {
            const items = data.filter(
              (item) =>
                item.type === 'income' &&
                item.category === category &&
                item.date >= this.startDate &&
                item.date <= this.endDate
            );
            const amount = items.reduce((acc, item) => acc + item.amount, 0);
            return { category, amount };
          });
          const expenseData = expenseCategories.map((category) => {
            const items = data.filter(
              (item) =>
                item.type === 'expense' &&
                item.category === category &&
                item.date >= this.startDate &&
                item.date <= this.endDate
            );
            const amount = items.reduce((acc, item) => acc + item.amount, 0);
            return { category, amount };
          });
          // 상단 막대 그래프 데이터
          const topBarData = {
            labels: ['총 수입', '총 지출', '잔액'],
            datasets: [
              {
                label: '총 수입, 지출 및 잔액',
                data: [
                  incomeData.reduce((acc, item) => acc + item.amount, 0),
                  expenseData.reduce((acc, item) => acc + item.amount, 0),
                  incomeData.reduce((acc, item) => acc + item.amount, 0) -
                    expenseData.reduce((acc, item) => acc + item.amount, 0),
                ],
                backgroundColor: [
                  'rgba(100, 190, 235, 0.2)', // 파란색
                  'rgba(255, 99, 70, 0.2)', // 빨간색
                  'rgba(75, 252, 192, 0.2)', // 초록색
                ],
                borderColor: [
                  'rgba(123, 180, 195, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
              },
            ],
          };
          // 상단 막대 그래프 생성
          const topBarCtx = document
            .getElementById('topBarChart')
            .getContext('2d');
          new Chart(topBarCtx, {
            type: 'bar',
            data: topBarData,
            options: {
              plugins: {
                datalabels: {
                  anchor: 'end',
                  align: 'start',
                  offset: 10,
                  backgroundColor: null,
                  borderWidth: 0,
                  color: '#000',
                  font: {
                    family: "'Jua', sans-serif", // 글꼴 설정
                    size: 14, // 글자 크기 설정
                  },
                  formatter: function (value, context) {
                    const label = context.chart.data.labels[context.dataIndex];
                    if (label.includes('수입')) return ':달러: ' + value;
                    if (label.includes('지출')) return ':쇼핑_카트: ' + value;
                    return ':돈가방: ' + value; // 총 잔액
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });
          // 수입 항목별 막대 그래프 생성
          this.generateChart('incomeBarChart', incomeData, '수입 항목별', [
            'rgba(54, 180, 235, 0.4)',
            'rgba(54, 162, 105, 0.5)',
            'rgba(10, 92, 235, 0.6)',
            'rgba(54, 802, 235, 0.4)',
            'rgba(54, 16, 235, 0.8)',
          ]);
          // 지출 항목별 막대 그래프 생성
          this.generateChart('expenseBarChart', expenseData, '지출 항목별', [
            'rgba(164, 0, 11, 0.7)',
            'rgba(100, 40, 101, 0.4)',
            'rgba(200, 70, 31, 0.4)',
            'rgba(210, 50, 61, 0.4)',
            'rgba(236, 170, 102, 0.4)',
            'rgba(200, 158, 222, 0.5)',
            'rgba(197, 120, 165, 0.6)',
            'rgba(163, 192, 221, 0.7)',
          ]);
        })
        .catch((error) => {
          console.error('데이터 불러오기 오류:', error);
        });
    },
    generateChart(canvasId, data, label, backgroundColor) {
      const ctx = document.getElementById(canvasId).getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map((item) => item.category),
          datasets: [
            {
              label: label,
              data: data.map((item) => item.amount),
              backgroundColor: backgroundColor,
              borderColor: backgroundColor.map((color) =>
                color.replace('0.4', '1')
              ), // 알파 값 변경
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              anchor: 'end',
              align: 'top',
              offset: -6, // 아이콘 위치 조정
              color: '#000',
              font: {
                family: "'Jua', sans-serif", // 글꼴 설정
                size: 14, // 글자 크기 설정
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  plugins: [ChartDataLabels],
};
</script>
<style>
.date-range-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.date-input {
  display: flex;
  flex-direction: column;
}
.btn {
  align-self: flex-end;
}
</style>
