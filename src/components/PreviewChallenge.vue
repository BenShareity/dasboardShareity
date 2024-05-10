<script setup>
import { watchEffect } from "vue";
const props = defineProps({
  badge: {
    required: true,
  },
  title: {
    required: true,
  },
  sponsor: {
    required: true,
  },
  amount: {
    required: true,
  },
  organization: {
    required: true,
  },
  bg_video: {
    required: true,
  },
  description: {
    required: true,
  },
  color: {
    required: true,
  },
});
console.log(props);
watchEffect(() => {
  console.log("props", props);
});
</script>
<template>
  <div style="width: 400px; position: relative; height: 100%">
    <div class="header-search">
      <div class="header-search_container">
        <div class="header-search_title" :style="props.color"></div>
        <div class="header-search_badge">
          <div class="header-search_badge-img">
            <img :src="props.badge" class="header-search_badge-img_item" />
          </div>
          <div class="header-search_info">
            <div class="header-search_info-name">
              <div class="header-search_info-name-title">{{ props.title }}</div>
            </div>
            <div class="header-search_info-container">
              <div class="header-search_info-title">
                <div class="header-search_info-title_item">
                  <div class="header-search_info-title_item-name">
                    {{ props.title }}
                  </div>
                </div>
                <div class="header-search_info-title_item">
                  <div class="header-search_info-title_item-name">MONEY</div>
                </div>
                <div class="header-search_info-title_item">
                  <div class="header-search_info-title_item-name">TO</div>
                </div>
              </div>
              <div class="header-search_info-images">
                <div class="header-search_info-images_sponsor">
                  <div class="header-search_info-images_sponsor-img">
                    <img :src="props.sponsor" alt="" />
                  </div>
                </div>
                <div class="header-search_info-images_donation">
                  <div class="header-search_info-images_donation-name">
                    {{ props.amount }}
                  </div>
                </div>
                <div class="header-search_info-images_organization">
                  <div class="header-search_info-images_organization-img">
                    <img :src="props.organization" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="overlay-bg"></div>
    <div class="sound-item-top">
      <div>
        <button
          type="button"
          class="v-icon notranslate parpadea v-icon--link mdi mdi-volume-off theme--dark white--text"
          style="font-size: 30px"
        ></button>
      </div>
    </div>
    <img src="" alt="" class="video-url-play" />
    <video
      autoplay
      style="height: 100%; width: 100%; object-fit: cover"
      id="video-element-1"
      class="video player__video"
      width="100%"
      height="auto"
    >
      <source :src="props.bg_video" type="video/mp4" />
      <source :src="props.bg_video" type="video/ogg" />
    </video>
    <div class="bottom-container">
      <p class="text-description">
        {{ props.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.overlay-bg {
  position: absolute;
  width: 100%;
  height: 50%;
  z-index: 20;
  opacity: 1;
  background-image: linear-gradient(179deg, transparent, rgba(0, 0, 0, 0.86));
  bottom: 0;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.video-url-play {
  position: absolute;
  z-index: 99999;
  color: white;
  left: 42%;
  bottom: 45%;
  right: 50%;
  width: 70px;
}

.text-description {
  color: white;
  width: 96%;
  text-align: left;
  font-size: 18px;
  font-family: poppinsregular;
}

.controls[data-state="hidden"] {
  display: none;
}

.controls {
  width: 100%;
  /*  position: absolute; */
  height: 100%;
  object-fit: cover;
  z-index: 50;
  background-size: cover;
  background-position: center center;
}

section {
  height: 100%;
  scroll-snap-align: center;
  position: relative;
  width: 100%;
  align-items: center;
  justify-content: center;
  /* background-color: #353535; */
}

.sound-item-top {
  position: absolute;
  display: flex;
  right: 0;
  top: 17%;
  padding: 20px;
  z-index: 300;
}

.bottom-container {
  width: 100%;
  position: absolute;
  display: flex;
  bottom: 0;
  justify-content: space-between;
  flex-direction: column;
  padding: 50px 30px;
  align-items: center;
  z-index: 80;
  padding-left: 10px;
}

/* body {
    overflow: hidden !important;
  } */

.buttons-container-left {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
}

.terms {
  position: absolute;
  color: white;
  bottom: 2%;
  font-size: 16px;
  z-index: 90;
  bottom: 8px;
  opacity: 0.5;
  font-weight: 500;
  text-shadow: 1px 1px 2px #747474;
  width: 100%;
  text-align: center;
}

.button__play {
  position: absolute;
  color: white;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  font-size: 82px;
  z-index: 9999999999;
  display: block;
}

.button__stop {
  position: absolute;
  color: white;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  font-size: 82px;
  z-index: 9999999999;
  display: none;
}

@keyframes pulsee {
  0% {
    box-shadow: 0px 0px 0px 0px red;
  }

  100% {
    box-shadow: 0px 0px 5px 25px rgba(35, 130, 220, 0);
  }
}

.acceptCallenge-btn {
  background: linear-gradient(0deg, rgba(#0a84e8, 1) 0%, rgba(#13a7de, 1) 100%);
  color: white;
}

.donates {
  font-size: 30px;
  font-weight: 700;
  color: black;
  text-align: center;
}

.groups-text {
  position: absolute;
  bottom: 23%;
  color: #f5f5f5;
  width: 100%;
}

.groups-text__name-avatar {
  display: flex;
  padding: 20px;
  justify-content: left;
  align-items: center;
  gap: 20px;
}

.groups-text_name-avatar_title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 3;
  /* padding: 3px; */
  padding: 0 36px 0px 14px;
  overflow: hidden;
}

.video-fullScreen {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 0;
  object-fit: cover;
  background-color: white;
  background-position: center;
}

section h2 {
  opacity: 0;
  transition: all 3000ms;
}

section.is-visible h2 {
  opacity: 1;
  transform: scale(1.25);
}

@media (max-width: 640px) {
  .dialog-custom {
    width: 100%;
  }
}

.header-search_info-name-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.header-search {
  position: absolute;
  left: 0;
  background-color: #ffffffb8;
  width: 100%;
  height: 115px;
  border-radius: 28px 28px 22px 22px;
  inline-size: -webkit-fill-available;
  margin: 20px 0px;
  z-index: 80;
}

.header-search_container {
  position: relative;
  width: 100%;
  height: 100%;
}

.header-search_title {
  position: absolute;
  height: 32px;
  top: 0;
  width: 100%;
  z-index: 1;
  overflow: hidden;
  border-radius: 22px 22px 0px 0px;
}

.header-search_badge {
  width: 100%;
  height: 100%;
  display: flex;
}

.header-search_badge-img {
  width: 30%;
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-search_badge-img_item {
  width: 100%;
  height: 100%;
  padding: 5px;
  object-fit: contain;
}

.header-search_info {
  width: 75%;
  position: relative;
  z-index: 30;
}

.header-search_info-name {
  height: 32px;
  font-family: poppinsregular;
  font-size: 18px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-search_info-images_organization--noSponsor {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.header-search_info-images_organization--container {
  display: flex;
  justify-content: space-between;
  height: 72%;
}

.header-search_info-images_organization--title {
  width: 100%;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: gotham_htfmedium;
  color: black;
  font-size: 9pt;
}

.header-search_info-container {
  display: flex;
  flex-direction: column;
  height: 83px;
}

.header-search_info-title {
  display: flex;
  justify-content: space-between;
  padding-top: 5px;
}

.header-search_info-title_item {
  width: 100%;
  font-family: "poppinsmedium";
  font-weight: bolder;
  font-size: 15px;
  color: black;
}

.header-search_info-title_item-name {
  width: 100%;
  text-align: center;
  font-size: 10pt;
}

.header-search_info-images_sponsor {
  width: 33%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-search_info-images {
  display: flex;
  height: 62px;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding-bottom: 7px;
}

.header-search_info-images_sponsor-img {
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position-y: center;
  background-position-x: center;
  object-fit: fill;
}

.header-search_info-images_donation {
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-search_info-images_donation-name {
  font-family: poppinsbold;
  font-size: 50px;
  color: black;
}

.header-search_info-images_organization {
  display: flex;
  position: relative;
  width: 33%;
  height: 100%;
}

.header-search_info-images_organization-img {
  background-repeat: no-repeat;
  width: 90%;
  height: 100%;
  background-size: contain;
  background-position-y: center;
  background-position-x: center;
  object-fit: fill;
}

.header {
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
  height: auto;
  width: 100%;
  position: absolute;
  top: 0;
  margin-top: 4%;
  z-index: 10;
}

.header-top {
  display: grid;
  grid-template-columns: 20% 70%;
  height: 27px;
  border-start-start-radius: 15px;
  border-start-end-radius: 15px;
}

.header-top-title {
  font-size: 18px;
  color: white;
  width: 100%;
  text-align: center;
  font-family: poppinsregular;
}

.header-description {
  position: relative;
  background: rgba(255, 255, 255, 0.688);
  -webkit-border-bottom-right-radius: 15px;
  -webkit-border-bottom-left-radius: 15px;
  -moz-border-radius-bottomright: 15px;
  -moz-border-radius-bottomleft: 15px;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
}

.header-description-items {
  display: grid;
  grid-template-columns: 30% 1fr 1fr 1fr;
}

.header-description-item {
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding-top: 5px;
  align-items: center;
}

.header-description-item img {
  height: 50px;
  width: 60%;
  object-fit: contain;
}

.header-description-item h1 {
  font-size: 14px;
  text-align: center;
}

.header-description-items__item-Img {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-description-items__item-Img img {
  position: relative;
  top: -18px;
}

.donates {
  font-family: poppinsbold;
  font-size: 2.6em;
  color: black;
}

.img-sponsor {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 640px) {
  .img-sponsor {
    width: 80%;
    margin-top: 10px;
    margin-left: 10px;
  }
}
</style>
