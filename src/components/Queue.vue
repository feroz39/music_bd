<template>
	<!-- Queue Area -->
	<div class="queue-area">
		<!-- Queue Area Title -->
		<div class="queue-title-area">
			<div>
				<span class="queue-title">Queue</span>
				<span class="iconify" data-icon="simple-line-icons:refresh"></span>
				<span class="iconify" data-icon="simple-line-icons:shuffle"></span>
			</div>
			<div>
				<span class="pointer" @click='clearQueue()'>Clear</span>
				<a class="btn" href="#">Save</a>
			</div>
		</div>

		<!-- Queue Songs Items -->
		<div class="queue-item-area" id="queue-item-area">
			<div class="queue-item" v-for="(item, index) in currentQueue"
			:index="index" :key="item.id" 
			:class="{ active: currentTrackItemId == item.id, hide: item.file == 'blank' }" :id="item.id">
				<div class="queue-head" @click="selectTrack(item.id)">
					<img src="https://via.placeholder.com/100x100" alt=""><div class="queue-head-content"><h4>{{item.title}}</h4><span>{{item.album}}</span></div>
				</div>
				<div class="queue-action">
					<div class="dropdown">
						<span 
							class="iconify dropdown-toggle" 
							data-icon="simple-line-icons:options" 
							id="dropdownMenuButton" 
							data-toggle="dropdown" 
							aria-haspopup="true" 
							aria-expanded="false"
						></span>
						<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<div class="dropdown-item" @click="removeTrack(item)">
							<span class="iconify" data-icon="simple-line-icons:close"></span> Remove from queue
						</div>
						<a class="dropdown-item" href="#"><span class="iconify" data-icon="simple-line-icons:heart"></span> Add to favourite </a>
						<a class="dropdown-item" href="#"><span class="iconify" data-icon="simple-line-icons:playlist"></span> Add to playlist</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
import { bus } from '@/main'
export default {
	name: 'Queue',
	props: {
		
	},
	data: function (){
		return{
		}
	},
	methods: {
		selectTrack: function(e){
			this.$store.dispatch('selectTrack', e);
			bus.$emit('scrollToActive');
		},
		removeTrack: function(e){
			this.$store.dispatch('removeTrack', e)
		},
		clearQueue: function(){
			this.$store.dispatch('clearQueue');
		},
	},
	computed: {
		currentQueue(){
			return this.$store.state.trackQueue;
		},
		currentTrackItemId() {
			return this.$store.state.currentTrackId
		},
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.queue-item .queue-head{
	cursor: pointer;
}
</style>
