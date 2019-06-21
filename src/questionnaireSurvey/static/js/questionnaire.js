require('@commonJs/ajax/zeptoStringify.js');
// require('@commonJs/ajax/zeptoNoStringify.js');
require('@commonJs/layer/elasticLayer.js');
require('@commonJs/layer/elasticLayerTypeTwo.js');
var Jdate = require('@commonJs/jdate.js');
var tipAction = require('@commonJs/tipAction.js');
var splitUrl = require('@commonJs/splitUrl.js');
var item=null;
var statr=null;//星星分数
var rateListNumber="";//打分的值
var city=""//省级城市
var cityName=""//省级城市名字
var customerQuerstionWritePo=null//填写调查问卷
var useTime=0//答题用时
var unionid=""//用户id
var activityId=""//活动id
var questionnaireId=""//问卷id
var idAuthentication = {
    // wxToken: splitUrl()['wxtoken'],
    // channel: splitUrl()['channel'],
    // sysFrom: splitUrl()['from'],
    // url:  splitUrl()['redirect_uri'],
    // err:  splitUrl()['err'],
    init: function() {
        var that = this;
        unionid=splitUrl()['unionid']
        activityId=splitUrl()['activityId']
        questionnaireId=splitUrl()['questionnaireId']
        console.log(unionid)
        if(unionid==undefined||unionid==""){
           that.toWxOAuth() 
        }else{
            that.initData();
        }
        that.event();
        that.time();
    },
    time:function(){
        setInterval(function(){
            useTime++
        },1000)
    },
    //微信授权接口
    toWxOAuth:function(){
        $.ajax({
            url:apiUrl.toWxOAuth,
            type:"POST",
            // contentType: "application/json; charset=UTF-8",
            data:{
                activityId:activityId,
                questionnaireId:questionnaireId
            },
            success:function(data){
            },
            error:function(err){
                tipAction(err.message);
            }
        }) 
    },
    //问卷统计结果
    statistics:function(answerId){
        $.ajax({
            url:apiUrl.statistics,
            type:"POST",
            contentType: "application/json; charset=UTF-8",
            dataType : "json",
            data:JSON.stringify({
                activityId:activityId,
                unionid:unionid,
                answerId:answerId,
                questionnaireId:questionnaireId
            }),
            success:function(data){
            },
            error:function(err){
                tipAction(err.message);
            }

        })     
    },
    initData: function() {
        var that = this;
        $.ajax({
            url:apiUrl.isStatistics,
            type:"POST",
            // contentType: "application/json; charset=UTF-8",
            dataType : "json",
            data:{
                activityId:activityId,
                unionId:unionid  
            },
            success:function(data){
               if(data.data==1){
                window.location.href="./questionJump.html";
                return;
               }else{
                initCity()
                getQuistion()
               }
              
            },
            error:function(err){
                tipAction(err.message);
            }

        })    
       //初始化省级城市
        function initCity(){
            $.ajax({
                url:apiUrl.province,
                type:"POST",
                success:function(data){
                    city=data.data
                },
                error:function(err){
                    tipAction(err.message);
                }
    
            }) 
        }
        function getQuistion(){
            $.ajax({
                url:apiUrl.questionnaire,
                type:"POST",
                dataType : "json",
                data:{
                    // "id": 11251,//问卷id
                    "id": questionnaireId,//问卷id
                },
                success:function(data){
                    console.log(data)
                    setData(data)
                },
                error:function(err){
                    tipAction(err.message);
                }
    
            }) 
        }
        


    },
    event: function () {
        var that = this;
        //答案列表
        customerQuerstionWritePo={
            customerNo:"23512",//客户编号
            naireid:questionnaireId,//问卷id
            useTime:"",//答题用时
            list:[],//问题序号，答案选项
            createId:"23512",//创建人id
            updateId:"23512"//修改人id
            
        }
        //提交按钮
        $(".btn").on("click", function () {
            //获取提交所用时间
            customerQuerstionWritePo.useTime=useTime
            //获取创建时间
            var myDate = new Date();             
            var year=myDate.getFullYear();        //获取当前年
            var month=myDate.getMonth()+1;   //获取当前月
            var date=myDate.getDate();            //获取当前日
            var h=myDate.getHours();              //获取当前小时数(0-23)
            var m=myDate.getMinutes();          //获取当前分钟数(0-59)
            var s=myDate.getSeconds();
            var now=year+'-'+getNow(month)+"-"+getNow(date)+" "+getNow(h)+':'+getNow(m)+":"+getNow(s);
            // customerQuerstionWritePo.createTime=now

            for(var i=0;i<item.length;i++){
                var items=item[i]
                // console.log($("#"+item[i].questionOrderNum))
                if(items.questionType==0){
                  var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {
                                answerResult:$("input[name="+items.id+"]:checked").val()
                            }
                        ]
                  }
                //   obj.answerResult.push()
                  customerQuerstionWritePo.list.push(obj)

                }else if(items.questionType==1){
                    var str=""
                    for(var j=0;j<$("input[name="+items.id+"]:checked").length;j++){
                        str+=$("input[name="+items.id+"]:checked").eq(j).val()+","
                    }
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {
                                answerResult:str
                            }
                        ]
                    }
                    // obj.answerResult.push(str)
                    customerQuerstionWritePo.list.push(obj)
                }else if(items.questionType==2){
                    //小星星
                    // console.log($("#"+items.id).attr("data"))
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {answerResult:$("#"+items.id).attr("data")}
                        ]
                    }
                    // obj.answerResult.push($("#"+items.id).attr("data"))
                    customerQuerstionWritePo.list.push(obj)

                }else if(items.questionType==3){
                    //nps
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {answerResult:$("#"+items.id).attr("data")}
                        ]
                    }
                    // obj.answerResult.push($("#"+items.id).attr("data"))
                    customerQuerstionWritePo.list.push(obj)

                }else if(items.questionType==4){
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {
                                answerResult:$("#"+items.id).val()
                            }
                        ]
                    }
                    // obj.answerResult.push($("#"+items.id).val())
                    customerQuerstionWritePo.list.push(obj)

                }else if(items.questionType==5){
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {answerResult:$("input[name="+items.id+"]:text").val()}
                        ]
                    }
                    // obj.answerResult.push($("input[name="+items.id+"]:text").val())
                    customerQuerstionWritePo.list.push(obj)

                }else if(items.questionType==6){
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {answerResult:$("input[name="+items.id+"]:text").val()}
                        ]
                    }
                    // obj.answerResult.push($("input[name="+items.id+"]:text").val())
                    customerQuerstionWritePo.list.push(obj)

                }else if(items.questionType==7){
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {
                                answerResult:$("input[name="+items.id+"]:text").val()
                            }
                        ]
                    }
                    // obj.answerResult.push($("input[name="+items.id+"]:text").val())
                    customerQuerstionWritePo.list.push(obj)

                }else if(items.questionType==8){
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {
                                answerResult:$("input[name="+items.id+"]:text").val()
                            }
                        ]
                    }
                    // obj.answerResult.push($("input[name="+items.id+"]:text").val())
                    customerQuerstionWritePo.list.push(obj)

                }else if(items.questionType==9){
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {
                                answerResult:$("input[name="+items.id+"]:checked").val()
                            }
                        ]
                    }
                    // obj.answerResult.push( $("input[name="+items.id+"]:checked").val())
                    customerQuerstionWritePo.list.push(obj)

                  }else if(items.questionType==10){
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {
                                answerResult:$("input[name="+items.id+"]:text").val()
                            }
                        ]
                    }
                    // obj.answerResult.push($("input[name="+items.id+"]:text").val())
                    customerQuerstionWritePo.list.push(obj)

                  }else if(items.questionType==11){
                    var str=$("input[name="+items.id+"]:text").eq(0).val()+"时"+$("input[name="+items.id+"]:text").eq(1).val()+"分"
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {
                                answerResult:str
                            }
                        ]
                    }
                    // obj.answerResult.push(str)
                    customerQuerstionWritePo.list.push(obj)

                }else if(items.questionType==12){
                    var str=cityName+"-"+$("#country").val()
                    var obj={
                        contentOrderNum:items.questionOrderNum,
                        customerAnswerResultVOList:[
                            {
                                answerResult:str
                            }
                        ]
                    }
                    // obj.answerResult.push(str)
                    customerQuerstionWritePo.list.push(obj)
                }
                }
               alert(JSON.stringify(customerQuerstionWritePo))
                $.ajax({
                    url:apiUrl.questionnaireadd,
                    type:"POST",
                    contentType: "application/json; charset=UTF-8",
                    dataType : "json",
                    data:JSON.stringify(customerQuerstionWritePo),
                    success:function(data){
                        that.statistics(data.data)
                        // window.location.href="./questionJump.html"
                    },
                    error:function(err){
                        tipAction(err.message);
                    }
        
                })     
        })
    },
};
idAuthentication.init();
function setData(data){
    $(".questionnaire-title").text(data.data.questionnaireTitle);
    $(".questionnaire-content").text(data.data.subTitle);
    item=data.data.listCustomerQuestionVO
    var html=""
    //问题类型（0：单选；1：多选；2：打分；3：NPS量表；4：填空；5：姓名；6：电话；7：理财师工号；8：邮箱；9：性别；10：日期；11：时间；12：省市）
    for(var i=0;i<item.length;i++){
        var items=item[i]
        if(item[i].questionType==0){
            html="<div class='questionTwo'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"
                for(var j=0;j<items.questionItemList.length;j++){
                    html +="<div class='question_content'>"+
                    "<input class='question_input' type='radio' value="+items.questionItemList[j].questionContent+" name="+items.id+" />"+items.questionItemList[j].questionContent+
                "</div>"
                }

          html += "</div>"+
        "</div>"
        }else if(item[i].questionType==1){
            html +="<div class='questionTwo'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"
                for(var j=0;j<items.questionItemList.length;j++){
                    html +="<div class='question_content'>"+
                    "<input class='question_input' type='checkbox' value="+items.questionItemList[j].questionContent+" name="+items.id+" />"+items.questionItemList[j].questionContent+
                "</div>"
                }
         html += "</div>"+
        "</div>"
        }else if(item[i].questionType==2){
            html +="<div class='questionThree'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"+
                "<div class='question_content'>"+
                    " <div id="+items.id+" class='target-demo target-div-demo'></div>"+
                "</div>"+
            "</div>"+
        "</div>"
        }else if(item[i].questionType==3){
            html +="<div class='questionFour'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"+
                    "<div class='question_content'>"+
                        "<ul id="+items.id+" class='rateList'>"+
                            "<li>0</li>"+
                            "<li>1</li>"+
                            "<li>2</li>"+
                            "<li>3</li>"+
                            "<li>4</li>"+
                            "<li>5</li>"+
                            "<li>6</li>"+
                            "<li>7</li>"+
                            "<li>8</li>"+
                            "<li>9</li>"+
                            "<li>10</li>"+   
                        "</ul>"+
                       "<div class='question_content-title'>"+
                          " <span>0：不可能</span>"+
                          " <span class='fr'>10：极有可能</span>"+
                       "</div>"+
                   "</div>"+
            "</div>"+
        "</div>"
        }else if(item[i].questionType==4){
            html +="<div class='questionFour'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"+
                "<div class='question_content'>"+
                "<textarea class='textarea' id="+items.id+"></textarea>"+
                "</div>"+
            "</div>"+
        "</div>"
        }else if(item[i].questionType==5){
            html+="<div class='questionOne'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"+
                "<div class='question_content'>"+
                    "<input class='question_input js_name' name="+items.id+" type='text' placeholder='' />"+
                "</div>"+
            "</div>"+
        "</div>"
        }else if(item[i].questionType==6){
            html+="<div class='questionOne'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"+
                "<div class='question_content'>"+
                    "<input class='question_input js_name' name="+items.id+" type='text' placeholder='' />"+
                "</div>"+
            "</div>"+
        "</div>"
        }else if(item[i].questionType==7){
            html+="<div class='questionOne'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"+
                "<div class='question_content'>"+
                    "<input class='question_input js_name' name="+items.id+" type='text' placeholder='' />"+
                "</div>"+
            "</div>"+
        "</div>"
        }else if(item[i].questionType==8){
            html+="<div class='questionOne'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"+
                "<div class='question_content'>"+
                    "<input class='question_input js_name' name="+items.id+" type='text' placeholder='' />"+
                "</div>"+
            "</div>"+
        "</div>"
        }else if(item[i].questionType==9){
            html +="<div class='questionTwo'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"
                for(var j=0;j<items.questionItemList.length;j++){
                    html +="<div class='question_content'>"+
                    "<input class='question_input' type='radio' value="+items.questionItemList[j].questionContent+" name="+items.id+" />"+items.questionItemList[j].questionContent+
                "</div>"
                }

          html += "</div>"+
        "</div>"
        }else if(item[i].questionType==10){
            html+="<div class='questionOne'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"+
                "<div class='question_content'>"+
                    "<input class='question_input date-group1-1' readonly type='text' name="+items.id+" id='date-group1-1' placeholder='请选择时间'>"+
                "</div>"+
            "</div>"+
        "</div>"
        }else if(item[i].questionType==11){
            html+="<div class='questionOne'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"+
                "<div class='question_content'>"+
                    "<input class='question_input date-group1-2' readonly type='text'  name="+items.id+" id='date-group1-2' placeholder='请选择时'>"+
                "</div>"+
                "<div class='question_content'>"+
                    "<input class='question_input date-group1-3' readonly type='text'  name="+items.id+" id='date-group1-3' placeholder='请选择分'>"+
                "</div>"+
            "</div>"+
        "</div>"
        }else if(item[i].questionType==12){
            html+="<div class='questionfive'>"+
            "<div id="+items.questionOrderNum+">"+
                "<div class='question_title'>"+items.questionOrderNum+"."+items.questionTitle+"<i class='require'>*</i></div>"+
                "<div class='question_content'>"+
                    "<select class='question_input city' id=''>"+
                    "<option value=''>请选择省</option>"
                //渲染省级城市
                for(var j=0;j<city.length;j++){
                    html+="<option value='"+city[j].code+"-"+city[j].regionName+" '>"+city[j].regionName+"</option>"
                }    

                html+=" </select>"+
                "</div>"+
                "<div class='question_content'>"+
                    "<select class='question_input ' id='country'>"+
                    "<option value=''>请选择省</option>"+
                    "</select>"+
                "</div>"+
            "</div>"+
        "</div>"
        }
    }
    $("#questionFrom").html(html)
    begin()//页面动态加载完成后调用的方法
    
}
//渲染插件
function begin(){
       //日期弹出框 日期
       new Jdate({
        el: '.date-group1-1',
        format: 'YYYY-MM',
        beginYear: 2000,
        endYear: 2100
        })
        //日期弹出框 时
        new Jdate({
            el: '.date-group1-2',
            format: 'hh'
        })
        //日期弹出框 分
        new Jdate({
            el: '.date-group1-3',
            format: 'mm'
        })
        //星星组件
      jQuery('.target-div-demo').raty({
          // cancel: false,  //是否显示左边cancel按钮
          score:0,   //初始化
          number: 5,  //改变星星数量
          scoreName: 'entity[score]',
          starOff  : '../static/image/no.png',  //自定义等级图案
          starOn   : '../static/image/yes.png',
          click:function(score){
            $(this).attr("data",score)
          }
      });
     
      //NPS量表
      $(".rateList li").on("click",function(){
        // rateListNumber=$(this).html();
        $(this).parent().attr("data",$(this).html())
        $(this).siblings("li").css("borderColor","#c8c7c7").css("color","#7c7c7c")
        $(this).css("color","#ff6600").css("borderColor","#ff6600")
   })

        //选择城市
    $(".city").on("change",function(){
        var city= $(this).val()
        city=city.split("-")
        cityName=city[1]
        //获取市
        $.ajax({
            url:apiUrl.cityList,
            type:"POST",
            data:{
                "parentId":city[0],
            },
            success:function(data){
               var items=data.data
               var html=''
               for(var i=0;i<items.length;i++){
                  html+= "<option value="+items[i].regionName+">"+items[i].regionName+"</option>"
               }
                $("#country").html(html)
            },
            error:function(err){
                tipAction(err.message);
            }

        }) 
    })

    }
//判断获取的时间
function getNow(s) {
    return s < 10 ? '0' + s: s;
    }