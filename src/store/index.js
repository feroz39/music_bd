import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		trackQueue: JSON.parse(localStorage.getItem("trackQueue") || "[]"),
		trackSources: [],
		currentTrackId: localStorage.getItem('currentTrackId'),
		fileLocation: 'http://127.0.0.1:5501/src/assets/audio/',
		autoPlayStatus: Boolean(localStorage.getItem('autoPlayStatus')),
		stop: false,
	},
	getters: {
		currentTrack: state => {
			for (let i = 0; i < state.trackSources.length; i++) {
				var e = state.trackSources[i];
				if(e.id == state.currentTrackId){
					return e;
				}
			}
			return e;
		}
	},
	mutations: {

		nextTrack: (state, payload) => {
			if(state.trackSources.length > 1){
				state.trackSources.length = 0;
				state.trackQueue.forEach(el => {
					state.trackSources.push(el);
				});
				let nextTrack = state.trackSources.indexOf(payload.currentTrack) + 1;
				let firstTrack = state.trackSources[0];

				if(state.trackSources.length == nextTrack){
					localStorage.setItem('currentTrackId', firstTrack.id);
					state.currentTrackId = firstTrack.id;
				}else{
					localStorage.setItem('currentTrackId', state.trackSources[nextTrack].id);
					state.currentTrackId = state.trackSources[nextTrack].id;
				}
			}
		},
		prevTrack: (state, payload) => {
			if(state.trackSources.length > 1){
				state.trackSources.length = 0;
				state.trackQueue.forEach(el => {
					state.trackSources.push(el);
				});
				let prevTrack = state.trackSources.indexOf(payload.currentTrack) - 1;
				let lastTrack = state.trackSources[state.trackSources.length - 1];
				if(prevTrack == -1){
					localStorage.setItem('currentTrackId', lastTrack.id);
					state.currentTrackId = lastTrack.id;
				}else{
					localStorage.setItem('currentTrackId', state.trackSources[prevTrack].id);
					state.currentTrackId = state.trackSources[prevTrack].id;
				}

			}
		},
		selectTrack: (state, e) => {
			state.trackSources.length = 0;
			for (let i = 0; i < state.trackQueue.length; i++) {
				const el = state.trackQueue[i];
				state.trackSources.push(el);
				if(el.id == e){
					localStorage.setItem('currentTrackId', el.id);
					state.currentTrackId = el.id
				}
			}
		},
		removeTrack: (state, payload) => {
			let targetTrack = state.trackSources.indexOf(payload.e);
			let currentTrack = payload.currentTrack;
			let firstTrack = state.trackQueue[0];
			let nextTrack = state.trackSources.indexOf(payload.currentTrack);

			state.trackQueue.splice(targetTrack, 1);
			localStorage.setItem("trackQueue", JSON.stringify(state.trackQueue));

			// Start next or go top if current track removed.
			console.log(nextTrack)
			
			if(currentTrack.id == payload.e.id){
				state.trackSources.length = 0;
				state.trackQueue.forEach(el => {
					state.trackSources.push(el);
				});


				if(targetTrack == state.trackQueue.length){
					localStorage.setItem('currentTrackId', firstTrack.id);
					state.currentTrackId = firstTrack.id;
				}else{
					localStorage.setItem('currentTrackId', state.trackSources[nextTrack].id);
					state.currentTrackId = state.trackSources[nextTrack].id;
				}

				if(state.trackQueue.length == 0){
					state.stop = true;
					var trackQueueBlank = [{file: "blank", id: "blank"}]
					localStorage.setItem("trackQueue", JSON.stringify(trackQueueBlank));
					state.trackQueue = JSON.parse(localStorage.getItem("trackQueue"));
					state.trackSources = trackQueueBlank;
					localStorage.setItem('currentTrackId', 'blank');
					state.currentTrackId = "blank";
				}
			}

			// Clear upper track and get up other track.
			/* else if(state.currentTemp > e){
				state.currentTemp--;
			} */
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
			var trackQueueBlank = [{file: "blank", id: "blank"}]
			localStorage.setItem("trackQueue", JSON.stringify(trackQueueBlank));
			state.trackQueue = JSON.parse(localStorage.getItem("trackQueue"));
			state.trackSources = trackQueueBlank;
			localStorage.setItem('currentTrackId', 'blank');
			state.currentTrackId = 'blank'
		}
	},
	actions: {
		nextTrack: (context) => {
			context.commit('nextTrack', {currentTrack: context.getters.currentTrack})
		},
		prevTrack: (context) => {
			context.commit('prevTrack', {currentTrack: context.getters.currentTrack})
		},
		selectTrack: (context, e) => {
			context.commit('selectTrack', e)
		},
		removeTrack: (context, e) => {
			context.commit('removeTrack',  {e:e, currentTrack: context.getters.currentTrack})
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
