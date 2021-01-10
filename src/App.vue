<template>

<div id="app">
	<nav class="navbar navbar-expand-lg navbar-light bg-light">

		<router-link class="navbar-brand" to="/">Music_BD</router-link>

		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav ml-auto">
				<li class="nav-item active"><router-link class="nav-link" to="/">Home</router-link></li>
				<li class="nav-item"><router-link class="nav-link" to="/album/2">Album</router-link></li>
				<li class="nav-item"><router-link class="nav-link" to="/browse">browse</router-link></li>
			</ul>
		</div>

	</nav>

	<div class="container">
		<div class="wrapper">

			<router-view/>

			<Queue></Queue>
			<Player :sources="currentTrackFile" :html5="true" :loop="loopStatus" :autoplay="autoPlayStatus"></Player>

		</div>
	</div>
</div>

</template>

<script>
// @ is an alias to /src
import { bus } from '@/main.js'
import Queue from '@/components/Queue.vue'
import Player from '@/components/Player.vue'

export default {
	components: {
		Queue,
		Player
	},
	data(){
		return{
            loopStatus: true,
		}
    },
    methods:{
        beforeRefresh(){
            this.$store.state.currentTrack = this.$store.state.currentTemp;
            localStorage.setItem('currentTrack', this.$store.state.currentTrack);
        },
		scrollTo: function(){
            var e = this.currentTrackItemId;
            setTimeout(() => {
                if(document.querySelector('#'+e)){
                    document.querySelector('.queue-item-area').scrollBy({
                        top: document.querySelector('#'+e).offsetTop - document.querySelector('.queue-item-area').scrollTop,
                        behavior: 'smooth'
                    })
                }              
            }, 300);
			
		}
    },
    computed:{
        currentTrackFile(){
            return [
                this.$store.state.fileLocation + 
                this.$store.getters.currentTrack.file + ".mp3"
            ];
        },
        autoPlayStatus(){
            return this.$store.state.autoPlayStatus;
        },
        currentTrackItemId() {
			return this.$store.getters.currentTrack.id
		},
    },
    created: function (){
        if (this.$store.getters.currentTrack == undefined) {
            location.reload();
        }
        window.addEventListener('beforeunload', this.beforeRefresh);
        bus.$on('scrollToActive', () => { this.scrollTo() });
    },
    mounted: function(){
        this.scrollTo();
    },
    beforeCreate: function(){
        for (const obj of this.$store.state.trackQueue) {
            this.$store.state.trackSources.push(obj);
        }
		if (localStorage.getItem("currentTrackId") === null) {
			localStorage.setItem('currentTrackId', 'blank');
		}
		if (localStorage.getItem("autoPlayStatus") === null) {
			localStorage.setItem('autoPlayStatus', true);
		}
		if (localStorage.getItem("trackQueue") === null) {
            var trackQueue = [{file: "blank", id: "blank"}]
			localStorage.setItem('trackQueue', JSON.stringify(trackQueue));
        }
    }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap');

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
body{
    font-family: $font1;
    color: $black;
    overflow: hidden;
}
:focus{
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
}
a{
    color: $black;
    @include transition(300ms);
    &:hover{
        color: rgba($black, .7);
        text-decoration: none;
    }
}
button{
    border: none;
    background-color: transparent;
}
.pointer{
    cursor: pointer;
}
.container{
    width: 100% !important;
    max-width: initial !important;
}
svg.iconify {
    position: relative;
    top: 3px;
}
.dropdown{
    padding: 10px;
    cursor: pointer;
    .dropdown-item.active, .dropdown-item:active {
        color: #fff;
        text-decoration: none;
        background-color: rgba($black, .9);
    }
}
.btn{
    padding: 6px 20px;
    background-color: rgba($black, .9);
    border: none;
    color: $white;
    border-radius: 30px;
    &:hover{
        color: $white;
    }
}
.hide{
	display: none !important;
}
.show{
	display: initial !important;
}
/* width */
::-webkit-scrollbar {
    width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
.queue-area{
    width: 300px;
    border: 1px solid rgba($black, .3);
    border-radius: 4px;
    height: calc(100vh - 62px - 75px);
    @include respond-to(sm){
        width: 100%;
        position: absolute;
        right: 0;
        background-color: $white;
        display: none;
    }

    @include respond-to(xs){
        //grid-template-columns: 1fr;
    }
    .queue-title-area{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba($black, .3);
        padding: 15px 15px;
        >div>*{
            margin-right: 8px;
            &:last-child{
                margin-right: 0;
            }
        }
    }
    .queue-item-area{
        height: calc(100vh - 220px);
        overflow-y: scroll;
        padding: 10px 15px 0;
        position: relative;
        .queue-item{
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0px;
            padding: 8px;
            &.active{
                background-color: $black;
                color: $white;
            }
            .queue-head{
                display: flex;
                align-items: center;
                img{
                    width: 45px;
                    height: 45px;
                    margin-right: 10px;
                    border-radius: 2px;
                }
                h4{
                    font-size: 17px;
                    margin: 0;
                }
                span{
                    font-size: 13px;
                    opacity: .6;
                }
            }
            .queue-action{
                cursor: pointer;
                .iconify{
                    opacity: .7;
                }
            }
        }
    }
}
.player{
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: $white;
    padding: 0 15px;
    display: flex;
    .current-track{
        width: 400px;
        height: 100%;
        .track-item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            .track-head{
                display: flex;
                justify-content: space-between;
                align-items: center;
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 3px;
                    margin-right: 10px;
                }
                .track-head-content{
                    h4{
                        margin: 0;
                        font-size: 18px;
                        font-weight: 700;
                    }
                    span{
                        opacity: .7;
                        font-size: 13px;
                    }
                }
            }
            .track-action{
                display: flex;
                justify-content: space-between;
                align-items: center;
                >*{
                    margin-left: 10px;
                }
                padding-right: 20px;
                border-right: 2px solid rgba($black, .2);
            }
        }
    }

    /* Player Navigation */
    .player-nav{
        display: flex;
        align-items: center;
        .seek-bar{
            background-color: rgba($black, .1);
            width: calc(100% - 30px);
            position: absolute;
            top: 0;
            left: 15px;
            height: 4px;
            .buffer{
                width: 0%;
                height: 4px;
                background-color: rgba($black, .4);
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
            }
			.process{
				background-color: #000;
				height: 4px;
				width: 0%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
			}
			input[type="range"] {
				background-color: #555;
				width: 100%;
				position: absolute;
				top: -6px;
				opacity: 0;
				z-index: 55;
				cursor: pointer;
                margin-left: -2px;
			}
        }
        .nav-keys{
            display: flex;
            align-items: center;
            margin-left: 30px;
            margin-right: 30px;
            .nav-key{
                width: 28px;
                height: 28px;
                font-size: 11px;
                //border: 1px solid;
                margin: 0 5px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                @include transition(50ms);
                &:active{
                    /* background-color: $black;
                    color: $white; */
                    @include transition(200ms);
                }
                .iconify{
                    top: 0;
                }
				&.play-pause{
					>*{
						position: relative;
						top: 2px;
					}
				}
            }
        }
        .track-timer{
            span{
                font-size: 15px;
            }
        }
        .player-action{
            margin-left: 30px;
            >*{
                margin-left: 15px;
                opacity: .5;
                &.active{
                    opacity: 1;
                }
            }
        }
        .volume_bar{
            width: 80px;
            height: 4px;
            background-color: rgba($black, .2);
            opacity: 1;
            position: relative;
            top: 10px;
            margin-left: 5px;
            span{
                background-color: $black;
                height: 4px;
                position: absolute;
                top: 0;
                left: 0;
            }
            input{
                width: 60px;
                position: absolute;
                top: 0;
                left: 0;
                height: 3px;
                opacity: 0;
            }
        }
    }
}
.navbar{
    padding: 10px 15px;
    .navbar-brand{
        font-size: 28px;
        font-weight: 700;
    }
    .navbar-nav{
        .nav-item{
            .nav-link{
                padding: 5px 10px;
                margin-left: 10px;
                font-size: 17px;
            }
        }
    }
}
.wrapper{
    display: flex;
    .main-area{
        width: calc(100% - 300px);
        height: calc(100vh - 62px - 70px);
        padding-right: 20px;
        margin-right: 5px;
        overflow-y: scroll;
        @include respond-to(lg){
            width: calc(100% - 300px);
        }
        @include respond-to(md){
            width: calc(100% - 250px);
        }
        @include respond-to(sm){
            width: calc(100%);
        }
        @include respond-to(xs){
            //grid-template-columns: 1fr;
        }
        .album-section{
            margin-top: 25px;
            margin-bottom: 25px;
            .album-section-title{
                margin-bottom: 15px;
                h3{
                    font-size: 24px;
                    font-weight: 700;
                }
            }

            .album-items{
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
                grid-gap: 20px;
                @include respond-to(lg){
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                }
                @include respond-to(md){
                    grid-template-columns: 1fr 1fr 1fr;
                }
                @include respond-to(sm){
                    //grid-template-columns: 1fr 1fr 1fr;
                }
                @include respond-to(xs){
                    //grid-template-columns: 1fr;
                }
                .album-item{
                    .album-poster{
                        width: 100%;
                        padding-bottom: 100%;
                        background-size: cover;
                        background-position: center;
                        border-radius: 5px;
                        margin-bottom: 10px;
                        filter: grayscale(1);
                    }
                    .album-footer{
                        h4{
                            font-size: 19px;
                            font-weight: 700;
                            margin-bottom: 0;
                            opacity: .9;
                        }
                        span{
                            opacity: .6;
                        }
                    }
                }
            }
        }
    }
}
</style>