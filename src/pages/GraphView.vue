<template>
  <div>
    <!-- 상단 막대 그래프 -->
    <canvas id="topBarChart" width="500" height="300"></canvas>

    <!-- 하단 막대 그래프 -->
    <canvas id="bottomBarChart" width="500" height="300"></canvas>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  mounted() {
    axios
      .get('./db.json')
      .then((response) => {
        const data = response.data.budget;

        // 수입 및 지출 데이터 필터링
        const incomeData = data.filter((item) => item.type === 'income');
        const expenseData = data.filter((item) => item.type === 'expense');

        // 수입 및 지출 카테고리별 총액 계산
        const totalIncome = incomeData.reduce(
          (acc, item) => acc + item.amount,
          0
        );
        const totalExpense = expenseData.reduce(
          (acc, item) => acc + item.amount,
          0
        );

        // Font Awesome 아이콘 정의
        const incomeIcon = '<i class="fas fa-money-bill-wave"></i>';
        const expenseIcon = '<i class="fas fa-shopping-cart"></i>';

        // 상단 막대 그래프 데이터
        const topBarData = {
          labels: [`${incomeIcon} Income`, `${expenseIcon} Expense`],
          datasets: [
            {
              label: 'Total',
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

        // 하단 막대 그래프 데이터
        const bottomBarData = {
          labels: [
            ...Array.from(
              new Set(
                incomeData.map((item) => `${incomeIcon} ${item.category}`)
              )
            ),
            ...Array.from(
              new Set(
                expenseData.map((item) => `${expenseIcon} ${item.category}`)
              )
            ),
          ],
          datasets: [
            {
              label: 'Total',
              data: [
                ...Array.from(
                  new Set(incomeData.map((item) => item.category))
                ).map((category) =>
                  incomeData
                    .filter((item) => item.category === category)
                    .reduce((acc, item) => acc + item.amount, 0)
                ),
                ...Array.from(
                  new Set(expenseData.map((item) => item.category))
                ).map((category) =>
                  expenseData
                    .filter((item) => item.category === category)
                    .reduce((acc, item) => acc + item.amount, 0)
                ),
              ],
              backgroundColor: [
                // 수입 카테고리 색상 (예: 파란색)
                ...Array.from(
                  new Set(incomeData.map((item) => item.category))
                ).fill('rgba(54, 162, 235, 0.2)'),
                // 지출 카테고리 색상 (예: 빨간색)
                ...Array.from(
                  new Set(expenseData.map((item) => item.category))
                ).fill('rgba(255, 99, 132, 0.2)'),
              ],
              borderColor: [
                // 수입 카테고리 색상 (예: 파란색)
                ...Array.from(
                  new Set(incomeData.map((item) => item.category))
                ).fill('rgba(54, 162, 235, 1)'),
                // 지출 카테고리 색상 (예: 빨간색)
                ...Array.from(
                  new Set(expenseData.map((item) => item.category))
                ).fill('rgba(255, 99, 132, 1)'),
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
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        // 하단 막대 그래프 생성
        const bottomBarCtx = document
          .getElementById('bottomBarChart')
          .getContext('2d');
        new Chart(bottomBarCtx, {
          type: 'bar',
          data: bottomBarData,
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  },
};
</script>

<style>
/* 필요한 스타일링이 있다면 추가할 수 있습니다. */
</style>
