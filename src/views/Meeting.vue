<template>
  <div class="meeting-container">
    <div class="meeting-header">
      <div class="back-and-title">
        <div v-if="isPesanRuangan" class="back-button-wrapper" @click="goBack">
          <button class="back-button">
            <font-awesome-icon :icon="['fas', 'angle-left']" />
          </button>
        </div>
        <div class="title-and-path">
          <div v-if="!isPesanRuangan" class="title-only">
            <h1 class="inline-title">Ruang Meeting</h1>
            <router-link to="/meeting" class="meeting-path"
              >Ruang Meeting</router-link
            >
          </div>
          <div v-if="isPesanRuangan" class="title-path-container">
            <h1 class="inline-title">Ruang Meeting</h1>
            <div class="meeting-path">Ruang Meeting > Pesan Ruangan</div>
          </div>
        </div>
      </div>
      <router-link
        v-if="!isPesanRuangan"
        class="pesan-button"
        to="/meeting/pesan-ruangan"
      >
        <font-awesome-icon :icon="['fas', 'plus']" /> Pesan Ruangan
      </router-link>
    </div>
    <div v-if="isPesanRuangan" class="form-container">
      <form class="meeting-form">
        <h2>Informasi Ruang Meeting</h2>
        <div class="form-row">
          <div class="form-column">
            <div class="form-group">
              <label for="unit">Unit</label>
              <select
                id="unit"
                v-model="selectedOfficeId"
                class="custom-select"
              >
                <option value="" disabled>Pilih Unit</option>
                <option
                  v-for="office in offices"
                  :key="office.id"
                  :value="office.id"
                >
                  {{ office.officeName }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-column">
            <div class="form-group">
              <label for="ruangMeeting">Ruang Meeting</label>
              <select
                id="ruangMeeting"
                v-model="selectedRoomId"
                class="custom-select"
                :disabled="!selectedOfficeId"
              >
                <option value="" disabled>Pilih Ruang Meeting</option>
                <option
                  v-for="room in filteredRooms"
                  :key="room.id"
                  :value="room.id"
                >
                  {{ room.roomName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="kapasitas">Kapasitas</label>
          <input
            type="number"
            id="kapasitas"
            v-model="selectedRoomCapacity"
            readonly
            style="background-color: lightgray"
          />
        </div>

        <hr class="form-divider" />

        <h2>Informasi Rapat</h2>
        <div class="form-row">
          <div class="form-column">
            <div class="form-group">
              <label for="tanggalRapat">Tanggal Rapat</label>
              <input type="date" id="tanggalRapat" v-model="tanggalRapat" />
            </div>
          </div>
          <div class="form-column">
            <div class="form-group">
              <label for="waktuMulai">Waktu Mulai</label>
              <input type="time" id="waktuMulai" v-model="waktuMulai" />
            </div>
          </div>
          <div class="form-column">
            <div class="form-group">
              <label for="waktuSelesai">Waktu Selesai</label>
              <input type="time" id="waktuSelesai" v-model="waktuSelesai" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <label for="jumlahPeserta">Jumlah Peserta</label>
          <input
            type="number"
            id="jumlahPeserta"
            placeholder="Masukkan Jumlah Peserta"
            v-model="participantCount"
          />
        </div>
        <div class="form-group checkbox-group">
          <label>Jenis Konsumsi</label>
          <div class="checkbox-item">
            <input type="checkbox" v-model="autoChecked.snackPagi" />
            <label for="snackSiang">Snack Siang</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" v-model="autoChecked.makanSiang" />
            <label for="makanSiang">Makan Siang</label>
          </div>
          <div class="checkbox-item">
            <input type="checkbox" v-model="autoChecked.snackSore" />
            <label for="snackSore">Snack Sore</label>
          </div>
        </div>
        <div class="form-nominal">
          <label for="total-nominal">Nominal Konsumsi</label>
          <div class="group-nominal">
            <span class="currency-label">Rp.</span>
            <input
              id="total-nominal"
              :value="formatNominal(totalNominal)"
              class="input-field"
              readonly
              style="background-color: lightgray"
            />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="cancel-button" @click="goBack">
            Batal
          </button>
          <button type="submit" class="save-button" @click="handleSubmit">
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { useMeetingStore } from "../stores/meetingStore";
import Swal from "sweetalert2";

library.add(faPlus, faAngleLeft);

const route = useRoute();
const router = useRouter();

const meetingStore = useMeetingStore();

const isPesanRuangan = computed(() => route.params.view === "pesan-ruangan");

const offices = ref([]);
const rooms = ref([]);
const selectedRoomName = ref("");
const selectedOfficeId = ref("");
const selectedRoomId = ref("");
const selectedRoomCapacity = ref(0);
const participantCount = ref(0);
const tanggalRapat = ref("");
const waktuMulai = ref("");
const waktuSelesai = ref("");
const autoChecked = ref({
  snackPagi: false,
  makanSiang: false,
  snackSore: false,
});
const totalNominal = ref(0);

const filteredRooms = computed(() => {
  const officeId = selectedOfficeId.value;
  if (!officeId) {
    return [];
  }
  return rooms.value.filter((room) => room.officeId === officeId);
});

const validateForm = () => {
  if (!selectedOfficeId.value) {
    Swal.fire({
      icon: "error",
      title: "Input Kosong",
      text: "Silakan pilih Unit.",
    });
    return false;
  }
  if (!selectedRoomId.value) {
    Swal.fire({
      icon: "error",
      title: "Input Kosong",
      text: "Silakan pilih Room.",
    });
    return false;
  }
  if (!tanggalRapat.value) {
    Swal.fire({
      icon: "error",
      title: "Input Kosong",
      text: "Silakan pilih Tanggal Rapat.",
    });
    return false;
  }
  const today = new Date().toISOString().split("T")[0];
  if (tanggalRapat.value <= today) {
    Swal.fire({
      icon: "error",
      title: "Tanggal Tidak Valid",
      text: "Tanggal rapat tidak boleh hari ini atau sebelumnya.",
    });
    return false;
  }

  if (!waktuMulai.value) {
    Swal.fire({
      icon: "error",
      title: "Input Kosong",
      text: "Silakan pilih Waktu mulai meeting.",
    });
    return false;
  }
  if (!waktuSelesai.value) {
    Swal.fire({
      icon: "error",
      title: "Input Kosong",
      text: "Silakan pilih waktu selesai.",
    });
    return false;
  }
  const startTime = new Date(`1970-01-01T${waktuMulai.value}:00`);
  const endTime = new Date(`1970-01-01T${waktuSelesai.value}:00`);
  if (endTime <= startTime) {
    Swal.fire({
      icon: "error",
      title: "Waktu Tidak Valid",
      text: "Waktu selesai tidak mungkin mundur dari waktu mulai.",
    });
    return false;
  }

  if (!participantCount.value) {
    Swal.fire({
      icon: "error",
      title: "Input Kosong",
      text: "Silakan masukkan jumlah peserta.",
    });
    return false;
  }
  if (participantCount.value > selectedRoomCapacity.value) {
    Swal.fire({
      icon: "error",
      title: "Jumlah Melebihi Kapasitas",
      text: "Jumlah peserta tidak boleh lebih besar dari kapasitas ruangan.",
    });
    return false;
  }

  return true;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    const startTime = new Date(`1970-01-01T${waktuMulai.value}:00`);
    const endTime = new Date(`1970-01-01T${waktuSelesai.value}:00`);

    autoChecked.value.snackPagi = startTime.getHours() < 11;
    autoChecked.value.makanSiang =
      startTime.getHours() < 14 && endTime.getHours() >= 11;
    autoChecked.value.snackSore = endTime.getHours() >= 14;

    const {
      totalNominalValue,
      totalSnackPagi,
      totalMakanSiang,
      totalSnackSore,
    } = calculateNominal();

    totalNominal.value = totalNominalValue;

    const selectedRoom = rooms.value.find(
      (room) => room.id === selectedRoomId.value
    );
    selectedRoomName.value = selectedRoom ? selectedRoom.roomName : "";

    const data = {
      officeId: selectedOfficeId.value,
      roomId: selectedRoomId.value,
      roomCapacity: selectedRoomCapacity.value,
      participantCount: participantCount.value,
      tanggalRapat: tanggalRapat.value,
      waktuMulai: waktuMulai.value,
      waktuSelesai: waktuSelesai.value,
      autoChecked: autoChecked.value,
      totalNominal: totalNominal.value,
      snackPagiCount: totalSnackPagi,
      makanSiangCount: totalMakanSiang,
      snackSoreCount: totalSnackSore,
      roomName: selectedRoomName.value,
    };

    meetingStore.saveMeetingData(data);

    Swal.fire({
      icon: "success",
      title: "Formulir Valid",
      text: "Formulir berhasil disimpan.",
    });
  }
};

const formatNominal = (nominal) => {
  if (typeof nominal === "number") {
    return nominal.toLocaleString("id-ID");
  }
  return nominal;
};

const calculateNominal = () => {
  let totalCostPerParticipant = 0;
  let totalSnackPagi = 0;
  let totalMakanSiang = 0;
  let totalSnackSore = 0;

  if (autoChecked.value.snackPagi) {
    totalCostPerParticipant += 20000;
    totalSnackPagi = participantCount.value;
  }
  if (autoChecked.value.makanSiang) {
    totalCostPerParticipant += 30000;
    totalMakanSiang = participantCount.value;
  }
  if (autoChecked.value.snackSore) {
    totalCostPerParticipant += 20000;
    totalSnackSore = participantCount.value;
  }

  const totalNominalValue = totalCostPerParticipant * participantCount.value;

  return {
    totalNominalValue,
    totalSnackPagi,
    totalMakanSiang,
    totalSnackSore,
  };
};

const goBack = () => {
  router.push("/meeting");
};

onMounted(async () => {
  try {
    const officeResponse = await axios.get(
      "https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterOffice"
    );
    offices.value = officeResponse.data;

    const roomResponse = await axios.get(
      "https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterMeetingRooms"
    );
    rooms.value = roomResponse.data;
  } catch (error) {
    console.error("Error fetching data", error);
  }
});

watch(selectedRoomId, (newId) => {
  const room = rooms.value.find((room) => room.id === newId);
  if (room) {
    selectedRoomCapacity.value = room.capacity;
    selectedRoomName.value = room.name;
  }
});
</script>

<style>
.meeting-container {
  padding: 8px 20px;
}

.meeting-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 20px;
}

.back-and-title {
  display: flex;
  align-items: start;
}

.back-button-wrapper {
  display: flex;
  margin-right: 20px;
  background-color: #027887;
  border-radius: 10px;
  cursor: pointer;
  width: 50px;
  height: 45px;
}

.back-button {
  display: flex;
  background-color: transparent;
  justify-content: center;
  align-items: center;
  border: none;
  color: white;
  font-size: 24px;
  margin: 0 auto;
}

.title-and-path {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-only {
  display: flex;
  flex-direction: column;
}

.title-path-container {
  display: flex;
  flex-direction: column;
}

.inline-title {
  margin: 0;
}

.meeting-path {
  color: #027887;
  text-decoration: none;
}

.pesan-button {
  background-color: #027887;
  color: white;
  padding: 10px 20px;
  font-size: 20px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: center;
}

.pesan-button .fa-plus {
  margin-right: 16px;
}

.form-container {
  margin-top: 20px;
}

.meeting-form {
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
  border-radius: 20px;
  padding: 16px;
}

.meeting-form label {
  font-weight: bold;
}

.meeting-form h2 {
  margin: 20px 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  margin-bottom: 8px;
  display: block;
}

.form-nominal label {
  margin-bottom: 8px;
  display: block;
}

.form-group input,
.form-group select {
  border: 1px solid lightgray;
  box-sizing: border-box;
  border-radius: 10px;
  width: 300px;
  height: 50px;
  padding: 8px;
}

.form-group input[type="checkbox"] {
  width: 24px;
  height: 24px;
  accent-color: #027887;
  margin-right: 8px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
}

.checkbox-item input[type="checkbox"] {
  width: 24px;
  height: 24px;
  accent-color: #027887;
  margin-right: 8px;
}

.checkbox-item label {
  font-weight: normal;
  margin: 0;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.group-nominal {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.currency-label {
  padding: 0.5em;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-right: none;
  height: 50px;
  border-radius: 10px 0 0 10px;
}

.input-field {
  border: 1px solid #ccc;
  border-left: none;
  border-radius: 0 10px 10px 0;
  padding: 0.5em;
  height: 50px;
  width: 270px;
}

.form-divider {
  border: 0;
  border-top: 1px solid lightgray;
  margin: 20px 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-actions button {
  padding: 10px 20px;
  cursor: pointer;
}

.form-actions .cancel-button {
  background-color: #f44336;
  color: white;
}

.form-actions .save-button {
  background-color: #027887;
  color: white;
}

.form-actions .cancel-button:hover {
  background-color: #d32f2f;
}

.form-actions .save-button:hover {
  background-color: #025f6d;
}
</style>
