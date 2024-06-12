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
  <canvas id="topBarChart" width="500" height="150"></canvas>

  <!-- 수입 항목별 막대 그래프 -->
  <canvas id="incomeBarChart" width="500" height="150"></canvas>

  <!-- 지출 항목별 막대 그래프 -->
  <canvas id="expenseBarChart" width="500" height="150"></canvas>
</template>
<script>
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

          // 수입 및 지출 데이터 필터링
          const incomeData = data.filter(
            (item) =>
              item.type === 'income' &&
              item.date >= this.startDate &&
              item.date <= this.endDate
          );
          const expenseData = data.filter(
            (item) =>
              item.type === 'expense' &&
              item.date >= this.startDate &&
              item.date <= this.endDate
          );

          // 수입 및 지출 카테고리별 총액 계산
          const totalIncome = incomeData.reduce(
            (acc, item) => acc + item.amount,
            0
          );
          const totalExpense = expenseData.reduce(
            (acc, item) => acc + item.amount,
            0
          );

          // 아이콘 맵 정의
          const iconMap = {
            월급: '💵',
            이자: '📈',
            용돈: '💼',
            이월: '💰',
            기타: '❓',
            식비: '🍔',
            교통: '🚗',
            주거: '🏠',
            통신: '📱',
            문화생활: '🎬',
            쇼핑: '🛍️',
            적금: '💰',
            기타: '❓',
          };

          // 상단 막대 그래프 데이터
          const topBarData = {
            labels: ['총 수입', '총 지출'],
            datasets: [
              {
                label: '총 수입 및 지출',
                data: [totalIncome, totalExpense],
                backgroundColor: [
                  'rgba(54, 162, 235, 0.2)', // 파란색
                  'rgba(255, 99, 132, 0.2)', // 빨간색
                ],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
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
                    size: 14,
                  },
                  formatter: function (value, context) {
                    const label = context.chart.data.labels[context.dataIndex];
                    return `${label.includes('수입') ? '💵' : '🛒'} ${value}`;
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
          this.generateChart(
            'incomeBarChart',
            incomeData,
            iconMap,
            '수입 항목별',
            'rgba(54, 162, 235, 0.2)'
          );

          // 지출 항목별 막대 그래프 생성
          this.generateChart(
            'expenseBarChart',
            expenseData,
            iconMap,
            '지출 항목별',
            'rgba(255, 99, 132, 0.2)'
          );
        })
        .catch((error) => {
          console.error('데이터 불러오기 오류:', error);
        });
    },
    generateChart(canvasId, data, iconMap, label, backgroundColor) {
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
              borderColor: backgroundColor.replace('0.2', '1'), // 알파 값 변경
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
                size: 14,
              },
              formatter: (value, context) => {
                const label = context.chart.data.labels[context.dataIndex];
                return iconMap[label] + ' ' + value; // 아이콘과 텍스트 결합
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
  justify-content: center;
  margin-bottom: 20px;
}

.date-input {
  margin-right: 10px;
}

.date-input:last-child {
  margin-right: 0;
}

#topBarChart,
#incomeBarChart,
#expenseBarChart {
  margin-top: 20px;
}
</style>
