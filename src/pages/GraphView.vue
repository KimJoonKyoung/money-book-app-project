<template>
  <h1 class="title">그래프</h1>
  <div class="date-range-selector">
    <!-- Date Range Selector -->
    <div class="date-input">
      <label for="graph-start-date">시작 날짜:</label>
      <input
        type="date"
        id="graph-start-date"
        v-model="startDate"
        @change="fetchData"
      />
    </div>
    <div class="date-input">
      <label for="graph-end-date">종료 날짜:</label>
      <input
        type="date"
        id="graph-end-date"
        v-model="endDate"
        @change="fetchData"
      />
    </div>
    <!-- 새로운 버튼 추가 -->
    <!-- <button @click="fetchData" class="btn btn-primary">조회</button> -->
  </div>
  <!-- 상단 막대 그래프 -->
  <canvas id="topBarChart" width="500" height="150"></canvas><br />
  <!-- 수입 항목별 막대 그래프 -->
  <canvas id="incomeBarChart" width="500" height="150"></canvas><br />
  <!-- 지출 항목별 막대 그래프 -->
  <canvas id="expenseBarChart" width="500" height="150"></canvas><br />
</template>
<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      topBarChartInstance: null,
      incomeBarChartInstance: null,
      expenseBarChartInstance: null,
    };
  },
  mounted() {
    this.setDefaultDates();
    this.fetchData();
  },
  methods: {
    setDefaultDates() {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        2
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      );
      this.startDate = firstDayOfMonth.toISOString().split('T')[0];
      this.endDate = lastDayOfMonth.toISOString().split('T')[0];
    },
    fetchData() {
      if (this.topBarChartInstance) {
        this.topBarChartInstance.destroy();
      }
      if (this.incomeBarChartInstance) {
        this.incomeBarChartInstance.destroy();
      }
      if (this.expenseBarChartInstance) {
        this.expenseBarChartInstance.destroy();
      }

      axios
        .get('./db.json')
        .then((response) => {
          const data = response.data.budget;
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
          const startDate = new Date(this.startDate);
          const endDate = new Date(this.endDate);

          const incomeData = incomeCategories.map((category) => {
            const items = data.filter(
              (item) =>
                item.type === 'income' &&
                item.category === category &&
                new Date(item.date) >= startDate &&
                new Date(item.date) <= endDate
            );
            const amount = items.reduce((acc, item) => acc + item.amount, 0);
            return { category, amount };
          });

          const expenseData = expenseCategories.map((category) => {
            const items = data.filter(
              (item) =>
                item.type === 'expense' &&
                item.category === category &&
                new Date(item.date) >= startDate &&
                new Date(item.date) <= endDate
            );
            const amount = items.reduce((acc, item) => acc + item.amount, 0);
            return { category, amount };
          });

          this.createTopBarChart(incomeData, expenseData);
          this.createIncomeBarChart(incomeData);
          this.createExpenseBarChart(expenseData);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    },
    createTopBarChart(incomeData, expenseData) {
      const topBarCtx = document.getElementById('topBarChart').getContext('2d');
      this.topBarChartInstance = new Chart(topBarCtx, {
        type: 'bar',
        data: {
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
                'rgba(100, 190, 235, 1)', // 파란색
                'rgba(255, 99, 70, 1)', // 빨간색
                'rgba(75, 252, 192, 1)', // 초록색
              ],
              borderColor: [
                'rgba(123, 180, 195, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
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
    },
    createIncomeBarChart(incomeData) {
      const incomeBarCtx = document
        .getElementById('incomeBarChart')
        .getContext('2d');
      this.incomeBarChartInstance = new Chart(incomeBarCtx, {
        type: 'bar',
        data: {
          labels: incomeData.map((item) => item.category),
          datasets: [
            {
              label: '수입 항목별',
              data: incomeData.map((item) => item.amount),
              backgroundColor: [
                'rgba(54, 180, 235, 1)',
                'rgba(54, 162, 105, 1)',
                'rgba(10, 92, 235, 1)',
                'rgba(54, 802, 235, 1)',
                'rgba(54, 16, 235, 1)',
              ],
              borderColor: [
                'rgba(54, 180, 235, 1)',
                'rgba(54, 162, 105, 1)',
                'rgba(10, 92, 235, 1)',
                'rgba(54, 802, 235, 1)',
                'rgba(54, 16, 235, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              anchor: 'end',
              align: 'top',
              offset: -6,
              color: '#000',
              font: {
                family: "'Jua', sans-serif",
                size: 14,
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
    createExpenseBarChart(expenseData) {
      const expenseBarCtx = document
        .getElementById('expenseBarChart')
        .getContext('2d');
      this.expenseBarChartInstance = new Chart(expenseBarCtx, {
        type: 'bar',
        data: {
          labels: expenseData.map((item) => item.category),
          datasets: [
            {
              label: '지출 항목별',
              data: expenseData.map((item) => item.amount),
              backgroundColor: [
                'rgba(164, 0, 11, 1)',
                'rgba(100, 40, 101, 1)',
                'rgba(200, 70, 31, 1)',
                'rgba(210, 50, 61, 1)',
                'rgba(236, 170, 102, 1)',
                'rgba(200, 158, 222, 1)',
                'rgba(197, 120, 165, 1)',
                'rgba(163, 192, 221, 1)',
              ],
              borderColor: [
                'rgba(164, 0, 11, 1)',
                'rgba(100, 40, 101, 1)',
                'rgba(200, 70, 31, 1)',
                'rgba(210, 50, 61, 1)',
                'rgba(236, 170, 102, 1)',
                'rgba(200, 158, 222, 1)',
                'rgba(197, 120, 165, 1)',
                'rgba(163, 192, 221, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              anchor: 'end',
              align: 'top',
              offset: -6,
              color: '#000',
              font: {
                family: "'Jua', sans-serif",
                size: 14,
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

<style scoped>
.date-range-selector {
  justify-content: center;
}
.title {
  text-align: center;
}
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
.date-input:last-child {
  margin-right: 0;
}
#topBarChart,
#incomeBarChart,
#expenseBarChart {
  margin-top: 20px;
}
</style>
