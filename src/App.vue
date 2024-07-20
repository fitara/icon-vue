<template>
  <div class="app">
    <div class="navbar">
      <div class="content-container">
        <div class="content-left">
          <img :src="logo" alt="Logo" class="logo" />
          <p class="logo-text">iMeeting</p>
        </div>
        <div class="content-right">
          <font-awesome-icon :icon="['far', 'bell']" class="navbar-icon" />
          <div class="profile">
            <img :src="profile" alt="Profile" class="profile-pict" />
            <span class="profile-name">John Doe</span>
          </div>
          <font-awesome-icon
            :icon="['fas', 'angle-down']"
            class="navbar-icon"
          />
        </div>
      </div>
    </div>

    <div class="body-container">
      <div class="sidebar">
        <router-link to="/dashboard" class="sidebar-item">
          <font-awesome-icon :icon="['fas', 'home']" class="sidebar-icon" />
        </router-link>
        <router-link to="/meeting" class="sidebar-item">
          <font-awesome-icon :icon="['fas', 'file']" class="sidebar-icon" />
        </router-link>
      </div>
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHome, faFile, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import logo from "./assets/logo-PLN.png";
import profile from "./assets/anonym.jpg";

library.add(faHome, faFile, faBell, faAngleDown);
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #009fb5, #015065);
  padding: 0;
  box-shadow: none;
  color: white;
}

.content-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin: 0 30px;
}

.content-left {
  display: flex;
  align-items: center;
}

.content-right {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 50px;
  height: auto;
  margin-right: 8px;
}

.logo-text {
  margin-left: 10px;
  letter-spacing: 2px;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.navbar-icon {
  font-size: 24px;
  margin: 0 10px;
}

.profile {
  display: flex;
  align-items: center;
  margin: 0 16px;
}

.profile-pict {
  width: 50px;
  border-radius: 50%;
  margin: 0 8px;
}

.profile-name {
  font-weight: bold;
}

.body-container {
  display: flex;
  height: calc(100vh - 10vh);
}

.sidebar {
  width: 90px;
  box-shadow: 8px 0 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding-top: 2vh;
}

.sidebar-item {
  display: flex;
  padding: 10px;
  margin: 8px 20px;
  align-items: center;
  border-radius: 10px;
  color: gray;
}

.sidebar-item:hover {
  background-color: #027887;
  color: white;
}

.sidebar-icon {
  font-size: 24px;
  margin: 0 auto;
}

.main-content {
  flex: 1;
  margin: 24px;
  overflow-y: auto;
}
</style>
