<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <font-awesome-icon :icon="['fas', 'gear']" class="dashboard-icon" />
      <span class="dashboard-text">DASHBOARD</span>
    </div>
    <div class="underline"></div>

    <div class="period-section">
      <label for="month-dropdown" class="period-label">Periode</label>
      <v-select
        id="month-dropdown"
        v-model="selectedMonth"
        :items="months"
        required
        class="month-dropdown"
        :menu-props="{ maxHeight: 'none', closeOnContentClick: false }"
      ></v-select>
    </div>

    <div class="unit-induk-section">
      <div class="unit-column-wrapper">
        <div
          v-for="meeting in meetings"
          :key="meeting.roomId"
          class="unit-column"
        >
          <div class="unit-section">
            <div class="unit-header">
              <font-awesome-icon :icon="['fas', 'bolt']" class="unit-icon" />
              <label class="unit-label">UNIT INDUK {{ meeting.officeId }}</label>
            </div>
            <div class="card-container">
              <div class="card">
                <h3 class="card-content">
                  {{ meeting.roomName }}
                </h3>
                <div class="chart-container">
                  <div>
                    <strong class="card-text">Persentase Pemakaian</strong>
                    <p class="percentNominal">{{ calculateUsagePercentage(meeting) }}%</p>
                  </div>
                  <div class="chart">
                    <canvas
                      :id="'chart-' + meeting.roomId"
                      width="200"
                      height="200"
                    ></canvas>
                  </div>
                </div>
                <div class="nominal-consumption">
                  <strong class="card-text">Nominal Konsumsi</strong>
                  <p class="percentNominal">
                    {{ formatRupiah(meeting.totalNominal) }}
                  </p>
                </div>
                <div class="item">
                  <div class="item-label">
                    <strong>Snack Pagi</strong>
                  </div>
                  <div class="item-details">
                    <span class="quantity">{{ meeting.snackPagiCount }}</span>
                    <div class="loading-bar">
                      <div
                        class="loading-bar-fill"
                        :style="
                        { width: calculateSnackPercentage(meeting.snackPagiCount, meeting.roomCapacity) + '%', }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="item">
                  <div class="item-label">
                    <strong>Makan Siang</strong>
                  </div>
                  <div class="item-details">
                    <span class="quantity">{{ meeting.makanSiangCount }}</span>
                    <div class="loading-bar">
                      <div
                        class="loading-bar-fill"
                        :style="
                        { width: calculateLunchPercentage(meeting.makanSiangCount, meeting.roomCapacity) + '%', }"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="item">
                  <div class="item-label">
                    <strong>Snack Sore</strong>
                  </div>
                  <div class="item-details">
                    <span class="quantity">{{ meeting.snackSoreCount }}</span>
                    <div class="loading-bar">
                      <div
                        class="loading-bar-fill"
                        :style="
                        { width: calculateEveningSnackPercentage(meeting.snackSoreCount, meeting.roomCapacity) + '%', }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGear, faBolt } from "@fortawesome/free-solid-svg-icons";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { VSelect } from "vuetify/components";
import { useMeetingStore } from "../stores/meetingStore";

library.add(faGear, faBolt);
Chart.register(
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
);

const months = [
  "Januari 2024",
  "Februari 2024",
  "Maret 2024",
  "April 2024",
  "Mei 2024",
  "Juni 2024",
  "Juli 2024",
  "Agustus 2024",
  "September 2024",
  "Oktober 2024",
  "November 2024",
  "Desember 2024",
];

const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const selectedMonth = ref(months[0]);

const meetingStore = useMeetingStore();
const meetings = ref([]);
onMounted(() => {
  meetings.value = meetingStore.meetings;
  renderCharts();
});

const formatPercentage = (value) => {
  return Number(value).toFixed(4);
};

const calculateUsagePercentage = (meeting) => {
  return (
    formatPercentage(meeting.participantCount / meeting.roomCapacity) * 100
  );
};

const calculateSnackPercentage = (snackCount, roomCapacity) => {
  return (snackCount / roomCapacity) * 100;
};

const calculateLunchPercentage = (lunchCount, roomCapacity) => {
  return (lunchCount / roomCapacity) * 100;
};

const calculateEveningSnackPercentage = (eveningSnackCount, roomCapacity) => {
  return (eveningSnackCount / roomCapacity) * 100;
};

const renderCharts = async () => {
  await nextTick();
  setTimeout(() => {
    meetings.value.forEach((meeting) => {
      const doughnutId = `chart-${meeting.roomId}`;
      const ctxDoughnut = document.getElementById(doughnutId)?.getContext("2d");
      if (ctxDoughnut) {
        new Chart(ctxDoughnut, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [
                  calculateUsagePercentage(meeting),
                  100 - calculateUsagePercentage(meeting),
                ],
                backgroundColor: ["#1E90FF", "#D3D3D3"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            elements: {
              arc: {
                borderRadius: 10,
              },
            },
            cutout: "65%",
          },
        });
      }
    });
  }, 500);
};
</script>

<style>
.dashboard {
  padding: 16px;
  position: relative;
}

.dashboard-header {
  display: flex;
  align-items: center;
  color: #505050;
}

.dashboard-icon {
  font-size: 28px;
  margin-right: 8px;
}

.dashboard-text {
  font-size: 1.25rem; 
  font-weight: bold;
}

.underline {
  margin-top: 16px;
  width: 100%;
  height: 1px;
  background-color: lightgrey;
}

.period-section {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.period-label {
  color: #505050;
}

.month-dropdown {
  width: 100%;
  max-width: 250px; 
}

.unit-induk-section {
  margin-top: 24px;
}

.unit-column-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 12px; 
}

.unit-column {
  flex: 1 1 calc(20% - 12px); 
  box-sizing: border-box;
  margin-bottom: 24px; 
  max-width: calc(20% - 12px); 
}

.unit-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.unit-header {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: gray;
  margin-bottom: 6px;
}

.unit-icon {
  font-size: 18px; 
  margin-right: 6px;
}

.unit-label {
  color: gray;
  font-weight: bold;
}

.card-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.card {
  display: flex;
  background-color: whitesmoke;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  border-radius: 8px;
  padding: 12px 16px; 
  min-width: 250px; 
  max-width: 100%; 
}

.card-text {
  color: gray;
}

.card-content {
  margin-bottom: 4px;
  color: #505050;
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
}

.nominal-consumption {
  display: flex;
  flex-direction: column;
  margin: 8px 0;
}

.chart {
  width: 80px; 
  height: 80px;
}

.percentNominal {
  font-size: 1.75rem;
  font-weight: bold; 
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px; 
}

.item-label {
  font-size: 1rem; 
}

.item-details {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 50%;
}

.loading-bar {
  position: relative;
  width: 100%;
  height: 12px;
  background-color: #d3d3d3;
  border-radius: 5px;
  overflow: hidden;
}

.loading-bar-fill {
  position: absolute;
  height: 100%;
  background-color: #1e90ff;
  transition: width 0.5s ease-in-out;
}

.quantity {
  margin-right: 12px;
  font-size: 1rem;
  font-weight: bold;
}

.bar-chart {
  margin: 8px 0;
  width: 10px;
  height: 50px;
}

@media (max-width: 768px) {
  .unit-column {
    flex: 1 1 calc(50% - 16px);
    max-width: calc(50% - 16px);
  }

  .card {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .unit-column {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .item-details {
    width: 100%;
  }
}
</style>
