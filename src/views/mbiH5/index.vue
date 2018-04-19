<template>
	<div class="msg_title">
		<div class="title_change">
			<div class="change_view" :class=" isAllShow ? '' : 'change_btn'"  @click="changeP">
				<i>有数据内容</i>
			</div>
		</div>
		<div class="msg_main">
			<ul>
				<li v-for="(item,index) in labelData">
					<!-- 有无一级标签 -->
					<h3 class="first_tag" :id="'first' + index" v-show="item.firstTag">
						{{item.firstTag}}
					</h3>
					<!-- <div class="border_tag" v-if="item.firstTag"></div> -->
					<div class="tag_details" v-for="(val,valIndex) in item.details">
						<!-- 有无二级标签 -->
						<h4  class="second_tag" v-show="val.secondTag" :id="'second' + index + valIndex"> {{val.secondTag}} </h4>
						<!-- <div class="border_tag" v-if="val.secondTag"></div> -->
						<span v-for="detail in val.details" v-if="valueData[detail.infoPointCode] || isAllShow ? true : false" class="span_1" :class="detail.dataType=='Attachment' ? 'span_block' : ''">
							<i class="label_a">{{detail.infoPointName}}：</i>
							<i v-if="detail.dataType != 'Attachment'" class="value_a">{{valueData[detail.infoPointCode] ? valueData[detail.infoPointCode] : '-' }}{{detail.unit}}</i>
							<div class="img_view">
								<div v-if="detail.dataType == 'Attachment' && valueData[detail.infoPointCode]" v-for="pic in valueData[detail.infoPointCode]" :class=" pic.type == 'image' ? 'img_a' : 'file_a' ">
									<img @click="showImg(pic.key)" v-if="pic.type == 'image'" :src=" 'http://192.168.20.225:8080/image-service/common/image_get?systemId=dev&key=' + pic.key + '&width=200&height=200'" alt=""> 
									<em v-if="pic.type == 'image'">{{pic.name}}</em>
									<a v-if="pic.type == 'file'" :href="pic.key">{{pic.name}}</a>
								</div>
							</div>
							<i v-if="detail.dataType == 'Attachment' && !valueData[detail.infoPointCode]">
								-
							</i>
						</span>
						<span v-for="(detail,dIndex) in val.details" v-if="!(valueData[detail.infoPointCode] && !isAllShow)  && dIndex == dIndex-1" class="span_nodata">暂无数据</span>
					</div>
				</li>
			</ul>
		</div>
		<div class="nav_cainter" :class=" navShow ? 'w100' : 'w1' ">
			<div class="nav_zhezhao" v-if="navShow" @touchmove.prevent></div>
			<div class="turn" @touchmove.prevent :class=" navShow ? 'turn_right' : 'turn_left' " @click="changeNav"></div>
			<div class="tag_nav" v-show="navShow">
				<li v-for="(item,index) in labelData" v-if="!!item.firstTag">
					<h3>
						<a :href="'#first' + index" :class=" scroll == index ? 'a_active' : '' ">{{item.firstTag}}</a>
					</h3>
					<h4 v-for="(val,valIndex) in item.details" v-if="!!val.secondTag">
						<a :href="'#second' + index + valIndex" :class=" (index*10 + valIndex) == secondScroll ? 'a_active' : '' ">{{val.secondTag}}</a>
					</h4>
				</li>
			</div>
		</div>
		<div class="pic_big" v-show="imgShow" @click="imgShow = !imgShow" @scroll.prevent @touchmove.prevent>
			<img :src="bigImg" alt="">
		</div>
	</div>
</template>
<script type="ecmascript-6">
import {
	getEquipmentLabel,
	getEquipmentValue
} from 'api/repair'
export default {
	data(){
		return{
			present: '全部内容',//当前内容
			navShow: false,//左侧按钮
			scroll : 1,//一级tag滚动
			secondScroll: 0,//二级tag滚动
			perjectId: this.$route.query.perjectId,//项目ID'Pj1101080001'
			secret: this.$route.query.secret,//项目secret'123'
			FmId: this.$route.query.FmId,//资产id'Pe408470a74a0a4106a9d572c2ee274957'
			code: this.$route.query.code,//资产类型'CCA'
			imgShow: false,
			bigImg: null,//大图
			isAllShow: true,//是否显示暂无数据的数据
			valueData: null,//value数据
			labelData: null//label数据
		}
	},
	mounted () {
		// 获取左侧label标签内容
		getEquipmentLabel(this.code).then(
			result => {
				this.labelData = this.arrayCnt(result.data.Content)
			}
		)
		//获取右侧value值
		getEquipmentValue( 
			this.FmId,
			this.perjectId,
			this.secret
		).then(
			result => {
				this.valueData = result.data.Content[0].infos
			}
		)
		window.addEventListener('scroll', this.handleScroll)
	},
	methods: {
		//处理后台数据，转换成vue渲染格式
		arrayCnt(arr) {
			let newArr =  arr
			.map((value)=>{
				return value; 
			})
			.reduce((pre,next,index)=>{
				//一级tag判断
				if(!pre.some((value)=>{
					return value.firstTag === next.firstTag;
				})){
					//如果是不重复的一级标签，放入pro
					let pro = {
						"firstTag": next.firstTag,
						'details':[
							{
								'secondTag': next.secondTag,
								'infoPointCode': next.infoPointCode,
								'infoPointName': next.infoPointName,
								'dataType': next.dataType,
								'unit': next.unit
							}
						]
					}
					pre.push(pro);
					return pre;
				}else{
					//如果重复，将obj放入上一级标签中，使其属于一级标签
					let obj = {
						'secondTag': next.secondTag,
						'infoPointCode': next.infoPointCode,
						'infoPointName': next.infoPointName,
						'dataType': next.dataType,
						'unit': next.unit
					}
					let _index = pre.length-1
					pre[_index].details.push(obj)
					return pre;
				}
			},[])
			//二级标签处理
			for(let i = 0; i < newArr.length; i++){
				// 将一级标签下的details转换成包含二级标签的数组
				newArr[i].details = newArr[i].details
				.map((item)=>{
					return item
				})
				.reduce((pre,next,index) => {
					if(!pre.some((item) => {
						return item.secondTag === next.secondTag
					})){
						// 为不重复二级标签，直接放入输出pro中
						let pro = {
							'secondTag': next.secondTag,
							'details': [{
								'infoPointName': next.infoPointName,
								'infoPointCode': next.infoPointCode,
								'dataType': next.dataType,
								'unit': next.unit
							}]
						}
						pre.push(pro)
						return pre
					}else{
						//重复的二级标签，直接放入details中
						let obj = {
							'infoPointCode': next.infoPointCode,
							'infoPointName': next.infoPointName,
							'dataType': next.dataType,
							'unit': next.unit
						}
						let _index = pre.length-1
						pre[_index].details.push(obj) 
						return pre
					}
				},[])
			}
			return newArr
		},
		// 显示大图片
		showImg(img){
			this.imgShow = true
			this.bigImg = 'http://192.168.20.225:8080/image-service/common/image_get?systemId=dev&key=' + img
		},
		//nav显示
		changeNav(){
			this.navShow = !this.navShow
		},
		//是否显示全部数据
		changeP(){
			this.isAllShow = !this.isAllShow
		},
		//获取滚动高度
		getOffsetTop(id){
			return document.querySelector(id).offsetTop
		},
		//滚动触发事件
		handleScroll () {
			let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
			let data = this.labelData;
			//一级标签滚动判断，返回当前滚动的一级标签index
			data.map((item,index) => {
				if(this.getOffsetTop('#first' + index) <= scrollTop){
					this.secondScroll = 1
					return this.scroll = index
				}
			})
			//二级标签判断，返回滚动标签的一级标签index*10+二级标签index
			data[this.scroll].details.map((val,vIndex) => {
				if( val.secondTag != '' && this.getOffsetTop('#second' + (this.scroll*10 + vIndex)) <= scrollTop){
					return this.secondScroll = this.scroll*10 + vIndex
				}
			});
		},
	},
	
}
</script>
<style scoped lang="less">
html,body{
	overflow: hidden;
}
h2,h3,h4{
	font-weight: 400;
	font-size: normal;
}
.msg_title{
	height: 100%;
	width: 100%;
	padding: 0 3rem 1rem 3rem;
	position: relative;
	font-size: .4rem;
	// text-align: center;
	.title_change{
		width: 100%;
		font-size: .3rem;
		line-height: .8rem;
		color: #aaa;
		position: fixed;
		background: rgba(255, 255, 255, 1);
		div	{
			display: inline;
			overflow: hidden;
			cursor: pointer;
		}
		i{
			padding-left: .6rem;
		}
		em{
			display: inline-block;
			width: 2rem;
		}
		.change_btn{
			color: #02a9d1;
		}
	}
	.nav_cainter{
		position: fixed;
		background-color: rgba(0, 0, 0, 0);
		right: 0;
		top: 0;
		bottom: 0;
		font-size: .3rem;
		margin-left: 1rem;
		box-sizing: border-box;
		z-index: 99;
		.turn{
			width: .7rem;
			height: .7rem;
			position: absolute;
			top: 50%;
			left: -1rem;
			cursor: pointer;
		}
		.turn_right{
			&::after{
				content: '';
				display: inline-block;  
				border-right: .01rem solid #aaa; 
				border-bottom: .01rem solid #aaa;  
				width: .4rem;
				height: .4rem;  
				margin-top: .15rem;
				margin-right: .2rem;
				transform: rotate(-45deg); 
				-webkit-transform: rotate(-45deg);
				-ms-transform: rotate(-45deg);
				-o-transform: rotate(-45deg);
				-moz-transform: rotate(-45deg);
			}
		}
		.turn_left{
			&::after{
				content: '';
				display: inline-block;  
				border-left: .01rem solid #aaa; 
				border-bottom: .01rem solid #aaa;  
				width: .4rem;
				height: .4rem;  
				margin-top: .15rem;
				margin-left: .2rem;
				transform: rotate(45deg); 
				-webkit-transform: rotate(45deg);
				-ms-transform: rotate(45deg);
				-o-transform: rotate(45deg);
				-moz-transform: rotate(45deg);
			}
		}
		.tag_nav{
			overflow-y: auto;
			height: 100%;
			padding-top: 1.5rem;
			padding-bottom: 1.5rem;
			background-color: rgba(255,255,255,1);
			&::-webkit-scrollbar {/*滚动条整体样式*/
				width: 2px;     /*高宽分别对应横竖滚动条的尺寸*/
				height: 1px;
			}
			&::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
				border-radius: 2px;
				-webkit-box-shadow: inset 0 0 2px #aaa;
				background: #aaa;
			}
			&::-webkit-scrollbar-track {/*滚动条里面轨道*/
				-webkit-box-shadow: inset 0 0 2px #aaa;
				border-radius: 10px;
				background: #aaa;
			}
			li{
				text-align: left;
				h3,h4{
					display: block;
					width: 100%;
					a{
						display: block;
						height: .6rem;
						line-height: .6rem;
						color: #aaa;
						&:hover{
							color: #02a9d1;
						}
						&.a_active{
							color: #02a9d1;
						}
						&:hover, &:visited, &:link, &:active{
							text-decoration:none; 
						}
					}
				}
				h4{
					padding-left: .4rem;
				}
			}
		}
	}
	.msg_main{
		padding-top: .8rem;
		overflow-y: auto;
		ul{
			li{
				overflow: hidden;
				display: inline-block;
				width: 100%;
				.first_tag{
					height: 1rem;
					line-height: 1rem;
					margin-top: .5rem;
					font-weight: 520;
					padding-left: .2rem;
					margin-bottom: .3rem;
					border-bottom: .03rem dashed #e6e6e6;
				}
				.border_tag{
					width: 100%;
					height: .02rem;
					background-color: #d6d3d3;
				}
				.tag_details{
					padding-left: 1rem;
					box-sizing: border-box;
					.border_tag{
						width: 100%;
						height: .03rem;
						background-color: #d6d3d3;
					}
				}
				.second_tag{
					width: 100%;
					height: 1rem;
					line-height: 1rem;
					margin-bottom: .3rem;
					margin-top: .5rem;
					font-weight: 500;
					font-size: .4rem;
					border-bottom: .03rem dashed #e6e6e6;
				}
				.span_1{
					width: 9rem;
					font-size: .35rem;
					height: 1rem;
					line-height: 1rem;
					display: inline-block;
				}
				span.span_block{
					display: block;
					width: 100%;
					overflow: hidden;
					height: inherit;
					.label_a{
						float: left;
					}
					.file_a{
						width: 100%;
						display: block;
						text-align: center;
						overflow: hidden;
						a{
							display: block;
							color: #02a9d1;
						}
					}
					.img_view{
						float: left;
						overflow: hidden;
					}
					.img_a{
						width: 30%;
						display: inline-block;
						padding: 0.2rem .2rem;
						box-sizing: border-box;
						overflow: hidden;
						text-align: center;
						img{
							display: block;
							margin-left: auto;
							margin-right: auto;
							margin-bottom: .1rem;
						}
						em{
							display: block;
							height: .4rem;
							line-height: .4rem;
							text-align: center;
							color: #ccc;
						}
					}
				}
			}
		}
	}
	.pic_big{
		position: fixed;
		z-index: 120;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #eee;
		img{
			position:absolute;
			width: 15rem;
			height: 15rem;
			top:50%;
			left: 50%;
			-webkit-transform:translateY(-50%) translateX(-50%);
			transform:translateY(-50%) translateX(-50%);
			-ms-transform:translateY(-50%) translateX(-50%);
			-o-transform:translateY(-50%) translateX(-50%);
			-moz-transform:translateY(-50%) translateX(-50%);
		}
	}
}
@media screen and (min-width: 760px) and (max-width: 1199px) {
	.msg_title{
		padding: 0rem .5rem 0 0;
		font-size: .2rem;
		.tag_nav{
			width: 4rem;
			padding-left: .5rem;
		}
		.msg_main{
			padding-top: .8rem;
			ul{
				li{
					overflow: hidden;
					display: inline-block;
					width: 100%;
					.first_tag{
						height: 1rem;
						line-height: 1rem;
						margin-top: .5rem;
						font-size: .35rem;
						margin-bottom: .3rem;
						border-bottom: .03rem dashed #e6e6e6;
					}
					.border_tag{
						width: 100%;
						height: .02rem;
						background-color: #d6d3d3;
					}
					.tag_details{
						padding-left: 1rem;
						box-sizing: border-box;
						.border_tag{
							width: 100%;
							height: .03rem;
							background-color: #d6d3d3;
						}
					}
					.second_tag{
						width: 100%;
						height: 1rem;
						line-height: 1rem;
						margin-bottom: .3rem;
						margin-top: .5rem;
						font-weight: 500;
						font-size: .3rem;
						border-bottom: .03rem dashed #e6e6e6;
					}
					.span_1{
						width: 8rem;
						font-size: .25rem;
						height: 1rem;
						line-height: 1rem;
						display: inline-block;
					}
					span.span_block{
						display: block;
						width: 100%;
						overflow: hidden;
						height: inherit;
						.label_a{
							float: left;
						}
						.file_a{
							width: 100%;
							display: block;
							text-align: center;
							overflow: hidden;
							a{
								display: block;
								color: #02a9d1;
							}
						}
						.img_a{
							width: 30%;
							display: inline-block;
							padding: 0.2rem .2rem;
							box-sizing: border-box;
							overflow: hidden;
							text-align: center;
							img{
								display: block;
								margin-left: auto;
								margin-right: auto;
								margin-bottom: .1rem;
							}
							em{
								display: block;
								height: .4rem;
								line-height: .4rem;
								text-align: center;
								color: #ccc;
							}
						}
					}
				}
			}
		}
		.pic_big{
			img{
				width: 10rem;
				height: 10rem;
			}
		}
	}
}
@media screen and (max-width: 760px) {
	.no_scroll{
		overflow-y: hidden;
	}
	.msg_title{
		padding: 0;
		font-size: .3rem;
		.title_change{
			font-size: .23rem;
			border-bottom: .03rem solid #eee;
			i{
				padding-left: .3rem;
			}
		}
		.nav_cainter{
			.nav_zhezhao{
				position: fixed;
				left: 0;
				top: 0;
				bottom:0;
				right: 0;
			}
			.tag_nav{
				position: fixed;
				top: 0;
				right: 0;
				left: 1rem;
				bottom: 0;
				height: 100%;
				font-size: .25rem;
				padding: 0;
				border-left: 1px solid #aaa;
				padding-left: .3rem;
			}
			.turn{
				right: 0;
				left: inherit;
			}
			.turn_right{
				left: 0;
			}
		}
		.w100{
			width: 100%;
		}
		.w1{
			width: initial;
		}
		.msg_main{
			padding-top: .8rem;
			height: 100%;
			ul{
				li{
					.first_tag{
						margin-left: .5rem;
						border-width: .01rem;
						margin-top: 0;
						text-align: center;
						margin-left: 0;
					}
					.second_tag{
						font-size: .3rem;
						border-width: .01rem;
					}
					.span_1{
						font-size: .22rem;
						height: .7rem;
						line-height: .7rem;
					}
					.tag_details{
						padding-left: .1rem;
					}
					span.span_block{
						.img_a{
							width: 100%;
							padding: 0.2rem .2rem;
							text-align: center;
							img{
								display: block;
								margin-left: auto;
								margin-right: auto;
								margin-bottom: .1rem;
							}
							em{
								display: block;
								height: .4rem;
								line-height: .4rem;
								text-align: center;
								color: #ccc;
							}
						}
					}
				}
			}
		}
		.pic_big{
			img{
				width: 5rem;
				height: 5rem;
			}
		}
	}
}
</style>