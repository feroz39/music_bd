<template>
	
	<!-- Music Player -->
	<div class="player">
		<div class="current-track">
			<div class="track-item">
				<div class="track-head">
					<img src="https://via.placeholder.com/100x100" alt="">
					<div class="track-head-content">
						<h4>{{currentTrackItem ? currentTrackItem.title : "Nothing"}}</h4>
						<span :class="[currentTrackItem.album?'show':'hide']">{{currentTrackItem.album}} by {{currentTrackItem.artist}}</span>
					</div>
				</div>
				<div class="track-action">
					<span class="iconify" data-icon="simple-line-icons:heart"></span>
				</div>
			</div>
		</div>

		<div class="player-nav">

			<div class="seek-bar">
				<div class="buffer" :style="{'width': buffer + '%'}" style="height: 4px;display: block;"></div>
				<div class="process" :style="{'width': (progress * 100) + '%'}"></div>
				<input type="range" min="0" max="100" v-model.number="seekhandle" @click="setProgress(seekhandle / 100)">
			</div>

			<div class="nav-keys">
				<div class="nav-key prev" @click="prevTrack()">
					<span class="iconify" data-icon="simple-line-icons:control-start"></span>
				</div>
				<div class="nav-key play-pause" @click="togglePlayback()">
					<div v-bind:class="[ playing ? 'show' : 'hide' ]">
						<span class="iconify" data-icon="simple-line-icons:control-pause"></span>
					</div>
					<div v-bind:class="[ playing ? 'hide' : 'show' ]">
						<span class="iconify" data-icon="simple-line-icons:control-play"></span>
					</div>
				</div>
				<div class="nav-key next" @click="nextTrack()">
					<span class="iconify" data-icon="simple-line-icons:control-end"></span>
				</div>
			</div>

			<div class="track-timer">
				<span>{{seek | minutes }} - {{ duration | minutes }}</span>
			</div>

			<!-- <button @click="togglePlayback"></button> -->

			<div class="player-action">
				<div class="volume-icon mute-icon active" @click="toggleMute()" style="width: 20px;">
					<div v-bind:class="[ !volumeLow ? 'show' : 'hide']">
						<div v-bind:class="[ muted ? 'show' : 'hide' ]">
							<span class="iconify" data-icon="simple-line-icons:volume-off"></span>
						</div>
						<div v-bind:class="[ muted ? 'hide' : 'show' ]">
							<span class="iconify" data-icon="simple-line-icons:volume-2"></span>
						</div>						
					</div>
					
					<div v-bind:class="[ volumeLow ? 'show' : 'hide']">
						<div v-bind:class="[ muted ? 'show' : 'hide' ]">
							<span class="iconify" data-icon="simple-line-icons:volume-off"></span>
						</div>
						<div v-bind:class="[ muted ? 'hide' : 'show' ]">
							<span class="iconify" data-icon="simple-line-icons:volume-1"></span>
						</div>
					</div>
				</div>
				<div class="volume_bar">
					<span :style="[!muted ? {'width': (volume * 100) + '%'} : {'width': 0 + '%'}]"></span>
					<input type="range" min="0" max="100" v-model.number="volumHandle" @click="setVolume(volumHandle / 100)">
				</div>
				<div @click="autoPlayAction()" class="autoplay-action" :class="[ autoplay ? 'active' : 'deactive' ]">
					Autoplay
					<span class="iconify" data-icon="mdi:motion-play" style="top: 2px;"></span>
				</div>

				<div id="buffered-amount"></div>
				<div id="progress-amount"></div>
				
			</div>
		</div>
	</div>

</template>

<script>
import VueHowler from 'vue-howler'
import { bus } from '@/main'

export default {
	name: 'Player',
	mixins: [VueHowler],
	data(){
		return{
			seekhandle: 0,
			volumHandle: 100,
			buffer: 0,
			next_disable: false,
			prev_disable: false,
		}
	},
	methods:{
		playTrack: function(){this.play},
		pauseTrack: function(){this.pause},
		nextTrack: function(){
			this.$store.dispatch('nextTrack');
			bus.$emit('scrollToActive');
		},
		prevTrack: function(){
			this.$store.dispatch('prevTrack');
			bus.$emit('scrollToActive');
		},
		autoPlayAction: function(){
			if(this.$store.state.autoPlayStatus){
				localStorage.setItem("autoPlayStatus", '');
			}else{
				localStorage.setItem("autoPlayStatus", true);
			}
			this.$store.state.autoPlayStatus = !this.$store.state.autoPlayStatus;
		},
	},
	computed:{
		stopTrack(){
			return this.$store.state.stop;
		},
		currentTrackItem(){
            return this.$store.state.trackQueue[(this.$store.state.currentTemp)];
		},
		trackLimit: function(){
			return this.$store.state.trackSources.length
		},
		volumeLow(){
			if(this.volumHandle < 50){
				return true;
			}else{
				return false;
			}
		}
	},
	updated: function(){
		let self = this;
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new window.MediaMetadata({
				title: self.currentTrackItem.title,
				artist: self.currentTrackItem.album + ' by ' + self.currentTrackItem.artist,
				album: self.currentTrackItem.album,
				artwork: [{ src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' }],
			});
			navigator.mediaSession.setActionHandler('pause', function() {self.pause()});
			navigator.mediaSession.setActionHandler('play', function() {self.play()});
			navigator.mediaSession.setActionHandler('previoustrack', function() {self.prevTrack()});
			navigator.mediaSession.setActionHandler('nexttrack', function() {self.nextTrack()});
		}
	},
	watch: {
		stopTrack: function(){
			if(this.stopTrack){
				this.stop();
			}
		}, 
		progress: function(value) {  
			if(value >= .999){
				this.$store.state.trackSources.length = 0;
				for (const obj of this.$store.state.trackQueue) {
					this.$store.state.trackSources.push(obj);
				}
				this.nextTrack();
			}else if(value>= 0 && this.currentTrackItem.file == 'blank'){
				this.stop();
			}

			// check buffer and update instantly
			let myAudio = this.$data._howl._sounds[0]._node;
			function checkBuffer() {
				var duration =  myAudio.duration;
				let buffer;
				if (duration > 0) {
					for (var i = 0; i < myAudio.buffered.length; i++) {
						if (myAudio.buffered.start(myAudio.buffered.length - 1 - i) < myAudio.currentTime) {
							buffer = (myAudio.buffered.end(myAudio.buffered.length - 1 - i) / duration) * 100;
							break;
						}
					}
				}
				return buffer;
			}
			this.buffer = checkBuffer();// check buffer and update instantly
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.player-action{
	display: flex;
	&>*{
		cursor: pointer;
	}
}
.volume_bar{
	cursor: pointer;
}
.track-timer{
	width: 110px;
    flex-basis: 110px;
}
.autoplay-action{
	width: 90px;
}
</style>
