
	var fs=$(window).width()/7.5;
	$("html").css("fontSize",fs+"px");

	var app=angular.module("myApp",["ui.router"]);

		app.config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){
			
			$urlRouterProvider.otherwise("/index")

			$stateProvider
				.state('default',{
					url:"/index",
					templateUrl:"html/index.html",
					data:{"title":"食物查询工具"}
				})
				.state('foodGI',{
					url:"/foodgi",
					templateUrl:"html/foodGI.html",
					data:{"title":"食物GI表"}
				})
					.state('foodGI.gushu',{
						url:"/gushu",
						templateUrl:"html/gushu.html",
						data:{"title":"谷薯类"}
					})
				.state('foodChoose',{
					url:"/foodchoose",
					templateUrl:"html/foodChoose.html",
					data:{"title":"食物交换"}
				})
				.state('ingredient',{
					url:"/ingredient",
					templateUrl:"html/ingredient.html",
					data:{"title":"食物成分"}
				})
				.state('energy',{
					url:"/energy",
					templateUrl:"html/energy.html",
					data:{"title":"常见活动能量消耗转换"}
				})
				.state("BMI",{
					url:"/BMI",
					templateUrl:"html/BMItest.html",
					data:{"title":"BMI测试"},
					controller:function($state){
						$state.go("BMI.boy")
					}
				})
					.state('BMI.boy',{
						url:"/boy",
						templateUrl:"html/boy.html",
						data:{"title":"BMI测试"}
					})
					.state('BMI.girl',{
						url:"/girl",
						templateUrl:"html/girl.html",
						data:{"title":"BMI测试"}
					})
		}])

		app.controller("ctrl",function($scope,$rootScope,$state){

			$rootScope.title=$state.current.data.title;

			var arr=[1,0,0,0,0];

			$scope.arr=$rootScope._arr||arr;
			
			$scope.changeHighlight=function(num){

				arr=[0,0,0,0,0];
				arr[num]=1;

				$rootScope._arr=arr;
			}

		})

		app.controller("foodGI",function($scope,$http,$timeout,$rootScope,$state){

			$rootScope.title=$state.current.data.title;

			$http.get("data/foodGI.json").success(function(data){

				 $scope.data=data.img;
				 $scope.type=data.type;

			})


			$scope.$on("searchResult",function(event,data){			
				if(data){
					$scope.type=[{"cereal":data,"number":100,"background":"green"}]
				}	
			})	
		})

		app.controller("foodChoose",function($scope,$rootScope,$state){
			$rootScope.title=$state.current.data.title;
			$scope.scfl="谷薯类";
			$scope.xzsc="油条";
			var ss = new SlideSelector();
			$scope.shicai=function(){
				ss.show({
					"title":"食材分类",
					"startIndex":3,
					"data":["大豆类","水果类","肉蛋类","硬果类","谷薯类","蔬菜类","奶制品","油脂类"],
					 afterSwipe:function(selected){
	                    //console.log(selected);
	                },
	                done:function(data){
	                  // console.log(data.value)
	                   $scope.scfl=data.value;
	                   $scope.$digest();
	                }
				});
			}
			$scope.xuanze=function(){	

				ss.show({
					"title":"选择食材",
					"startIndex":3,
					"data":["油条","包子","鸡蛋","小米粥","酱香饼","汉堡包","面包"],
					afterSwipe:function(selected){
	                    //console.log(selected);
	                },
	                done:function(data){
	                  // console.log(data.value)
	                   $scope.xzsc=data.value;
	                   $scope.$digest();
	                }
				});
			}
		})

		app.controller("gushu",function($scope,$state,$http,$rootScope){
			$rootScope.title=$state.current.data.title;    //$state.current  当前路由对象的一些状态参数

			var json=null;
			$scope.goFoodGI=function(val){
				$state.go("foodGI")
				//console.log(val)
				$scope.$emit("searchResult",val);
			}
			$http.get("data/search.json").success(function(data){
				json=data.cereal;
			})

			$scope.$watch("searchValue",function(newValue,oldValue){
				// console.log("新值:"+newValue)
				// console.log("旧值:"+oldValue)
				var arr=[];
				if(json!=null&&newValue!=""){
					json.forEach(function(val,ind){
						if(newValue==val[0].substring(0,newValue.length)||newValue==val[1].substring(0,newValue.length)||newValue==val[2].substring(0,newValue.length)){
							arr.push(val[0])
						}
					})
					$scope.searchData=arr;
				}
				
			})
		})

		app.controller("energy",function($rootScope,$state,$scope){
			$rootScope.title=$state.current.data.title;
			$scope.activities="自行车";
			$scope.projects="洗衣服";
			var ss=new SlideSelector();
				$scope.health=function(){
					ss.show({
						title:"身体活动项目",
						"data":["自行车","跑步","游泳","瑜伽","健身","篮球","足球","乒乓球"],
						afterSwipe:function(data){
							//console.log(data)
						},
						done:function(data){
							$scope.$apply(function(){
								$scope.activities=data.value;

							})
						}
					})
				}
				$scope.project=function(){
					ss.show({
						title:"项目内容",
						"data":["洗衣服","洗碗","刷锅","擦桌子","擦地","吃饭","看电视"],
						afterSwipe:function(data){
							//console.log(data)
						},
						done:function(data){
							
							$scope.projects=data.value;

							$scope.$digest();
						}
					})
				}
		})

		app.controller("BMI",function($rootScope,$state){
			$rootScope.title=$state.current.data.title;
		})

		app.controller("boy",function(){
			var str="";
		    for(var i=1;i<=100;i++){
		        if(i%10==0){
		            str+="<li meter='"+(34-(12+i/10>>0))/10+"'></li>"
		        }else{
		             str+="<li></li>"
		        }
		    }
		    document.querySelector(".h_ruler ul").innerHTML=str;

		   var hRuler=new IScroll('.h_ruler',{
		        probeType:3,
		        mouseWheel: true,
		        startY:-224
		    })
		    hRuler.on("scroll",function(){
		        if(this.y<=0){
		            var num=(160+(224-Math.abs(this.y))/5)/100;
		        }else{
		            var num=(205+Math.abs(this.y)/5)/100;
		        }
		        
		       document.querySelector(".meter").innerHTML=num.toFixed(2)+"m"
		    })
		    var str2="";
		    for(var i=1;i<=100;i++){
		        if(i%10==0){
		            str2+="<li gram='"+(20+i)+"kg'></li>"
		        }else{
		             str2+="<li></li>"
		        }
		    }
		    document.querySelector(".w_ruler ul").innerHTML=str2;

		     var wRuler=new IScroll('.w_ruler',{
		        scrollX:true,
		        scrollY:false,
		        probeType:3,
		        startX:-20
		    })

		    wRuler.on("scroll",function(){
		        console.log(this.x)

		        if(this.x<=0){
		            var num2=55+(Math.abs(this.x)-20)/5
		        }else{
		            var num2=51-Math.abs(this.x)/5
		        }
		       document.querySelector(".gram").innerHTML=Math.floor(num2)+"kg"
		    })
		})

		app.directive("giSwiper",function(){
			return {
				restrict:"E",
				template:'<div class="variety swiper-container"><ul class="swiper-wrapper"><li class="swiper-slide" ng-repeat="v in data"><img ng-src="{{v.src}}" alt=""></li></ul></div>',
				replace:true,
				controller:function($timeout){
					$timeout(function(){
						var mySwiper=new Swiper(".variety",{
							slidesPerView:"auto",
							freeMode:true,
							onTap:function(s,e){
								mySwiper.slideTo(s.clickedIndex,300)
							}	
						})
					},300)
				}
			}
		})


	

