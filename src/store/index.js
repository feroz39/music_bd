import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		trackQueue: JSON.parse(localStorage.getItem("trackQueue") || "[]"),
		trackSources: [],
		stop: false,
		currentTrack: parseInt(localStorage.getItem('currentTrack')),
		currentTemp: parseInt(localStorage.getItem('currentTrack')),
		fileLocation: 'http://127.0.0.1:5501/src/assets/audio/',
		autoPlayStatus: Boolean(localStorage.getItem('autoPlayStatus')),
	},
	getters: {
	},
	mutations: {

		nextTrack: (state) => {
			if(state.trackSources.length > 1){
				state.trackSources.length = 0;
				state.trackQueue.forEach(el => {
					state.trackSources.push(el);
				});
				if(state.trackSources.length == (state.currentTrack + 1)){
					localStorage.setItem('currentTrack', 0);
					state.currentTrack = state.currentTemp = 0;
				}else{
					localStorage.setItem('currentTrack', (parseInt(localStorage.getItem('currentTrack')) + 1));
					state.currentTrack++;
					state.currentTemp = state.currentTrack;
				}
			}
		},
		prevTrack: (state) => {
			if(state.trackSources.length > 1){
				state.trackSources.length = 0;
				state.trackQueue.forEach(el => {
					state.trackSources.push(el);
				});
				if(state.currentTrack == 0){
					localStorage.setItem('currentTrack', state.trackSources.length - 1);
					state.currentTrack = state.trackSources.length - 1;
					state.currentTemp = state.currentTrack;
				}else{
					localStorage.setItem('currentTrack', (localStorage.getItem('currentTrack') - 1));
					state.currentTrack--;
					state.currentTemp = state.currentTrack;
				}

			}
		},
		selectTrack: (state, e) => {
			state.trackSources.length = 0;
			for (let i = 0; i < state.trackQueue.length; i++) {
				const el = state.trackQueue[i];
				state.trackSources.push(el);
				if(el.id == e){
					localStorage.setItem('currentTrack', i);
					state.currentTrack = state.currentTemp = i;
				}
			}
		},
		removeTrack: (state, e) => {
			state.trackQueue.splice(e, 1);
			localStorage.setItem("trackQueue", JSON.stringify(state.trackQueue));

			// Start next or go top if current track removed.
			if(state.currentTemp == e){
				state.trackSources.length = 0;
				state.trackQueue.forEach(el => {
					state.trackSources.push(el);
				});

				if(e == state.trackQueue.length){
					state.currentTrack = state.currentTemp = 0;
				}else{
					state.currentTrack = state.currentTemp;
				}

				if(state.trackQueue.length == 0){
					state.stop = true;
					var trackQueueBlank = [{file: "blank"}]
					localStorage.setItem("trackQueue", JSON.stringify(trackQueueBlank));
					state.trackQueue = JSON.parse(localStorage.getItem("trackQueue"));
					state.trackSources = trackQueueBlank;
					localStorage.setItem('currentTrack', 0);
					state.currentTrack = state.currentTemp = 0;
				}
			}

			// Clear upper track and get up other track.
			else if(state.currentTemp > e){
				state.currentTemp--;
			}
		},
		addQueue: (state, e) => {
			var checkStatus = false;
			for (let i = 0; i < state.trackQueue.length; i++) {
				const el = state.trackQueue[i];
				if(el.id == e.id){
					checkStatus = true
				}
				if(el.file == 'blank'){
					state.stop = false;
					state.trackQueue.splice(0, 1);
				}
			}
			checkStatus ? '' : state.trackQueue.push(e);

			localStorage.setItem("trackQueue", JSON.stringify(state.trackQueue));
		},
		clearQueue: state => {
			state.stop = true;
			var trackQueueBlank = [{file: "blank"}]
			localStorage.setItem("trackQueue", JSON.stringify(trackQueueBlank));
			state.trackQueue = JSON.parse(localStorage.getItem("trackQueue"));
			state.trackSources = trackQueueBlank;
			localStorage.setItem('currentTrack', 0);
			state.currentTrack = state.currentTemp = 0;
		}
	},
	actions: {
		nextTrack: (context) => {
			context.commit('nextTrack')
		},
		prevTrack: (context) => {
			context.commit('prevTrack')
		},
		selectTrack: (context, e) => {
			context.commit('selectTrack', e)
		},
		removeTrack: (context, e) => {
			context.commit('removeTrack', e)
		},
		addQueue: (context, e) => {
			context.commit('addQueue', e)
		},
		clearQueue: (context) => {
			context.commit('clearQueue')
		}
	},
	modules: {
	}
})
