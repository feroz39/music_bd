<template>
	<!-- Main Area -->
	<div class="main-area">
		<section class="track-section">
			<div class="track-section-title">
				<h3>{{album}}</h3>
			</div>
			<div class="track-items">
				<div class="track-item pointer" v-for="(track, index) in trackList" :index="index" :key="track.id"
				:class="{ active: currentTrackId == track.id }">
					<div class="track-footer" @click="addAndPlayTrack(track)">
						<span class="track-index-container">
							<div v-if="index >= 9">{{index + 1}}</div>
							<div v-else>{{'0' + (index + 1)}}</div>
							
							<span class="track-index">
								<span class="iconify" data-icon="el:play" data-inline="false"></span>
							</span>
							<span class="track-index track-index-play-pause">
								<span class="iconify" data-icon="simple-line-icons:energy" data-inline="false"></span>
							</span>
						</span>
						<h4>{{track.title}}</h4>
						<span>{{track.album}}</span>
						<span>{{track.artist}}</span>
					</div>
					<div class="track-control">
						<span 
							class="iconify" 
							data-icon="simple-line-icons:options"
						></span>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import { bus } from '@/main'
export default {
	name: 'Album',
	data: function(){
		return{
			album: 'Ami Tomader Lok',
			artist: 'James',
			trackList: [
				{title: "Allah Ho Akbar", artist: "James", album: "Ami Tomader Lok", file: "ami tomader lok/1", id: "ami-tomader-lok-1"},
				{title: "Ami Tomadari Lok", artist: "James", album: "Ami Tomader Lok", file: "ami tomader lok/2", id: "ami-tomader-lok-2"},
				{title: "Aziz Bording", artist: "James", album: "Ami Tomader Lok", file: "ami tomader lok/3", id: "ami-tomader-lok-3"},
				{title: "Didi Moni", artist: "James", album: "Ami Tomader Lok", file: "ami tomader lok/4", id: "ami-tomader-lok-4"},
				{title: "Dil", artist: "James", album: "Ami Tomader Lok", file: "ami tomader lok/5", id: "ami-tomader-lok-5"},
				{title: "Dukhar Poth", artist: "James", album: "Ami Tomader Lok", file: "ami tomader lok/6", id: "ami-tomader-lok-6"},
				{title: "Ja Kichu Bujacho", artist: "James", album: "Ami Tomader Lok", file: "ami tomader lok/7", id: "ami-tomader-lok-7"},
				{title: "Loho Salam", artist: "James", album: "Ami Tomader Lok", file: "ami tomader lok/8", id: "ami-tomader-lok-8"},
				{title: "Shakki Akash", artist: "James", album: "Ami Tomader Lok", file: "ami tomader lok/9", id: "ami-tomader-lok-9"},
				{title: "Zindigi Tasting", artist: "James", album: "Ami Tomader Lok", file: "ami tomader lok/10", id: "ami-tomader-lok-10"},
			]
		}
	},
	computed: {
		currentTrackId: function(){
			return this.$store.state.trackSources[(this.$store.state.currentTrack)].id
		}
	},
	methods: {
		addQueue: function(e){
			this.$store.dispatch('addQueue', e)
		},
		addAndPlayTrack: function(e){
			this.$store.dispatch('addQueue', e);
			this.$store.dispatch('selectTrack', e.id);
			bus.$emit('scrollToActive');
		},
	},
	components: {

	}
}
</script>

<style scoped lang="scss">
$font1: 'Ubuntu Mono', monospace;

/* Color */
$black: rgb(20, 20, 20);
$white: #fff;

@mixin transition($time){
    -o-transition: ease-in-out all $time;
    -moz-transition: ease-in-out all $time;
    -webkit-transition: ease-in-out all $time;
    transition: ease-in-out all $time;
}

@mixin respond-to($breakpoint) {
    @if $breakpoint=="xs" {
        @media (max-width: 567px) {
            @content;
        }
    };
    @if $breakpoint=="sm" {
        @media (max-width: 767px) {
            @content;
        }
    };
    @if $breakpoint=="md" {
        @media (max-width: 991px) {
            @content;
        }
    };
    @if $breakpoint=="lg" {
        @media (max-width: 1200px) {
            @content;
        }
    };
}
.track-section{
	margin-top: 25px;
	margin-bottom: 25px;
	.track-section-title{
		margin-bottom: 15px;
		h3{
			font-size: 24px;
			font-weight: 700;
		}
	}

	.track-items{
		display: block;
		.track-item{
			display: flex;
			border-top: 1px solid;
			padding: 0 15px;
			position: relative;
			&:hover{
				background-color: rgba($black, .1);
				.track-footer{
					.track-index{
						display: block;
						&.track-index-play-pause{
							display: none;
						}
					}
				}
			}
			&.active{
				.track-footer{
					.track-index{
						display: none;
						&.track-index-play-pause{
							display: block;
						}
					}
				}
			}
			.track-control{
				width: 25px;
				height: 39px;
				display: flex;
				align-items: center;
				justify-content: center;
				.iconify{
					top: 1px;
				}
			}
			.track-footer{
				display: grid;
				grid-template-columns: 50px 2fr 1.5fr .5fr;
				padding: 7px 0;
				width: calc(100% - 25px);
				h4{
					font-size: 16px;
					font-weight: 700;
					margin-bottom: 0;
					opacity: .9;
					line-height: 22px;
				}
				span{
					opacity: .6;
					.track-index{
						padding: 10px;
						width: 40px;
						height: 39px;
						position: absolute;
						top: 0;
						left: 0;
						background-color: $black;
						display: flex;
						justify-content: center;
						align-items: center;
						opacity: 1;
						display: none;
						>*{
							position: relative;
							top: -3px;
							left: 3px;
							color: $white;
						}
					}
				}
			}
			&:last-child{
				border-bottom: 1px solid;
			}
		}
	}
}
</style>
