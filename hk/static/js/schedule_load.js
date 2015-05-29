var lectures1 = [];
var lectures2 = []; 
var lectures2_thisweek = []; 
var added_lectures1 = [];
var added_lectures2 = [];
var day1; 
var day2; 
var date;

var clicking = false;   
var modifying = false;  
var painting  = 0; 
var current_day = "";
var start_time;
var fin_time;
var saving = false;


$(document).ready(function(){
  $(".minutes30").css("border","1px solid white");

  var week_num = 0;

  $.ajax({
    url: '/load_subjects',
    type:'POST',
    success:function(response){
      data = $.parseJSON(response);
      lectures1 = data.fixed_lst;
      lectures2 = data.floating_lst;
      paint_fixed_schedule();
      date = moment();
      set_date_range(date);
      lectures2_thisweek = get_lectures_thisweek(day1,day2,lectures2);
      paint_thisweek_schedule();
    },
    error: function(){
      console.log("error");
    },
    complete:function(){
      console.log('complete');
    }
    
  });





  $("#next_week").click(function() {
    if(modifying)
      alert("�섏젙以묒뿉�� 二쇰� �대룞�� �� �놁뒿�덈떎 :)");
    else{
        date.add(7,'days');
        set_date_range(date);
        lectures2_thisweek = get_lectures_thisweek(day1,day2,lectures2);
        $(".ok-time").removeClass("ok-time");

        paint_thisweek_schedule();

        week_num += 1;
        if(week_num == 0)
        {
          $("#prev_week").hide();
          $("#my-schedule-title").prepend("<span id = \"dummy-bar\" style = \"color: rgb(46, 85, 110) \" class=\"glyphicon glyphicon-chevron-left\"></span>");
        }
        else
        {
          $("#prev_week").show();
          $("#dummy-bar").remove();
        }
      }

  });

  
  $("#prev_week").click(function() {
    if(modifying)
      alert("�섏젙以묒뿉�� 二쇰� �대룞�� �� �놁뒿�덈떎 :)");
    else{
        date.add(-7,'days');
        set_date_range(date);
        lectures2_thisweek = get_lectures_thisweek(day1,day2,lectures2);

        $(".ok-time").removeClass("ok-time");
        paint_thisweek_schedule();

        week_num -= 1;
        if(week_num == 0)
        {
          $("#prev_week").hide();
          $("#my-schedule-title").prepend("<span id = \"dummy-bar\" style = \"color: rgb(46, 85, 110) \" class=\"glyphicon glyphicon-chevron-left\"></span>");
        }
        else
        {
          $("#prev_week").show();
          $("#dummy-bar").remove();
        }
      }


  });

  
  $("#prev_week").hide();
  $("#my-schedule-title").prepend("<span id = \"dummy-bar\" style = \"color: rgb(46, 85, 110)\" class=\"glyphicon glyphicon-chevron-left\"></span>");

  var stage = {};

  $(".day").click(function() {

    if(modifying) {
      var day = day_to_english($(this).text());
      var stage_num = stage[day];
      if(stage_num == 0 || stage_num == null) {
        $(".minutes30[day="+day+"]").removeClass("fixed-ok-time").addClass("ok-time");
        stage[day] = 1;
      }
      else if(stage_num == 1) {
        $(".minutes30[day="+day+"]").removeClass("ok-time").addClass("fixed-ok-time");
        stage[day] = 2;
      }
      else {
        $(".minutes30[day="+day+"]").removeClass("fixed-ok-time").removeClass("ok-time");
        stage[day] = 0;
      }
    }
    
  });

  var logged_in = $("#data_div").attr("logged_in");
  $("#modify_schedule").click(function()  
  {
    
    if(modifying)  
    {
      if(logged_in =="false")
        alert("濡쒓렇�� �꾩뿉 ���ν븷 �� �덉뒿�덈떎.");
      else{
        $(".day").css("cursor","default");
        $(".minutes30").css("none");
        modifying = false;
        $(this).html("<span class=\"glyphicon glyphicon-pencil\"></span>&nbsp");

        var ok_lec_lst = [];
        var fixed_ok_lec_lst = [];
        ok_lec_lst = ok_to_lec_lst();
        fixed_ok_lec_lst = fixed_ok_to_lec_lst();
     
        var x = compare_lec_lst(lectures2_thisweek,ok_lec_lst);
        var floating_id_lst = x[0];
        var floating_ok_lec_lst_final = x[1];

        var y = compare_fixed_lec_lst(lectures1,fixed_ok_lec_lst);
        var fixed_id_lst = y[0];
        var fixed_ok_lec_lst_final = y[1];

        if(!saving)
          modify_subjects(floating_id_lst, fixed_id_lst, floating_ok_lec_lst_final, fixed_ok_lec_lst_final);

      }
      

      
    }

  
    else 
    {
      
      modifying = true;
      $(".day").css("cursor","pointer");
      $(this).html("<span class=\"glyphicon glyphicon-ok\"></span>����");
    }

  });


  $(".minutes30").mousedown(function()
  {
    current_day = $(this).attr("day");
    start_time = $(this).attr("time");
    fin_time = $(this).attr("time");
    if(modifying)
    {
      if($(this).hasClass("ok-time"))
      {
        painting = 2;
        $(this).removeClass("ok-time").addClass("fixed-ok-time");
      }
      else if($(this).hasClass("fixed-ok-time"))
      {
        painting = 0;
        $(this).removeClass("fixed-ok-time");
      }
      else
      {
        painting = 1;
        $(this).addClass("ok-time");
      }

      clicking = true;
    }
  });

  $(".minutes30").mouseenter(function()
  {

    fin_time = $(this).attr("time");
    var time1 = Math.min(start_time,fin_time);
    var time2 = Math.max(start_time,fin_time);

    // console.log(time1);
    // console.log(time2);
    // console.log("-------------------");
    if(modifying)
    { 

      if(clicking)
      {
        if(painting == 0)
          remove_dragged_ok_time(time1,time2,current_day);    
        else if(painting == 1)
          paint_dragged_ok_time(time1,time2,current_day);
        else
          paint_fixed_ok_time(time1,time2,current_day);
      }
    }

   
  });


  $("body").mouseup(function()
  {

    if(modifying)
    {
      clicking = false;
      
    }

  });



}); 

function get_lectures_thisweek(day1,day2,lectures)
{
  $(".floating_schedule_cell").remove();
  var this_week_flt_lectures = [];
  var mom;
  for(var i = 0; i<lectures.length; i++)
  {
    mom = moment(lectures[i].date);
    if(mom.isSame(day1) || mom.isSame(day2))
    {
      this_week_flt_lectures.push(lectures[i]);

    }
    else if(mom.isAfter(day1) && mom.isBefore(day2))
    {
      this_week_flt_lectures.push(lectures[i]);

    }
  }


  return this_week_flt_lectures;
}


function set_date_range(date)
{
  date.isoWeekday(1); 
  day1 = date.weekday(1).format("YYYY-MM-DD");
  day2 = date.weekday(7).format("YYYY-MM-DD");
  
  $("#week_date").text(day1 + " ~ " + day2);
}


function day_to_date(day)
{
  date.isoWeekday(1); 

 

  if (day == "mon") return date.weekday(1).format("YYYY-MM-DD");
  if (day == "tue") return date.weekday(2).format("YYYY-MM-DD");
  if (day == "wed") return date.weekday(3).format("YYYY-MM-DD");
  if (day == "thu") return date.weekday(4).format("YYYY-MM-DD");
  if (day == "fri") return date.weekday(5).format("YYYY-MM-DD");
  if (day == "sat") return date.weekday(6).format("YYYY-MM-DD");
  if (day == "sun") return date.weekday(7).format("YYYY-MM-DD");
  return -1;

}



function time_to_num(hour,min)
{ 
  var num = 1;
  num = num + (hour - 8) * 2
  if (min == 30)
  {
    num = num + 1;
  }

  return num;


}

function num_to_start_hour(num)
{
  var hour = 8;
  hour = hour + ((num-1)/2);
  return parseInt(hour);
}

function num_to_start_min(num)
{
  var min = 0;
  if (num%2 == 0)
  {
    min = 30;
  }
  return min;
}

function num_to_fin_hour(num)
{
  var hour = 8;
  hour = hour + (num/2);
  return parseInt(hour);
}

function num_to_fin_min(num)
{
  var min = 0;
  if (num%2 == 1)
  {
    min = 30;
  }
  return min;
}


function wday_to_num(wday){
  if (wday == "mon") return 0;
  if (wday == "tue") return 1;
  if (wday == "wed") return 2;
  if (wday == "thu") return 3;
  if (wday == "fri") return 4;
  if (wday == "sat") return 5;
  if (wday == "sun") return 6;
  return -1;
}



function paint_fixed_schedule()
{
  for(var i = 0; i<lectures1.length; i++)
  {
    paint_fixed_lecture(lectures1[i]);
  }


}


function paint_thisweek_schedule()
{
  for(var i = 0; i<lectures2_thisweek.length; i++)
  {
    paint_lecture(lectures2_thisweek[i]);
  }
}


function paint_fixed_lecture(lec)
{
  var num1 = time_to_num(lec.start_hour,lec.start_min);
  var num2 = time_to_num(lec.fin_hour,lec.fin_min)-1;
  // var num3 = parseInt(num1) + 1;
  var day = lec.day;
  for(var i = num1; i<=num2; i++)
  {
    $("[day="+day+"][time="+i+"]").addClass("fixed-ok-time");
  }
}


function paint_lecture(lec)
{
  var num1 = time_to_num(lec.start_hour,lec.start_min);
  var num2 = time_to_num(lec.fin_hour,lec.fin_min)-1;
  // var num3 = parseInt(num1) + 1;
  var day = lec.day;
  for(var i = num1; i<=num2; i++)
  {
    $("[day="+day+"][time="+i+"]").addClass("ok-time");
  }
}



function ok_to_lec_lst(){
  var lec_lst = [];

  make_lecture("mon",lec_lst);
  make_lecture("tue",lec_lst);
  make_lecture("wed",lec_lst);
  make_lecture("thu",lec_lst);
  make_lecture("fri",lec_lst);
  make_lecture("sat",lec_lst);
  make_lecture("sun",lec_lst);

  return lec_lst;
}

function fixed_ok_to_lec_lst(){
  var lec_lst = [];

  make_fixed_lecture("mon",lec_lst);
  make_fixed_lecture("tue",lec_lst);
  make_fixed_lecture("wed",lec_lst);
  make_fixed_lecture("thu",lec_lst);
  make_fixed_lecture("fri",lec_lst);
  make_fixed_lecture("sat",lec_lst);
  make_fixed_lecture("sun",lec_lst);

  return lec_lst;
}

//�됱튌�섏뼱 �덈뒗 移몃뱾�� �쒗쉶�섎ŉ floating_lec �⑥쐞濡� 留뚮뱾�댁＜�� �⑥닔.    void ->  flt_lec list
function make_lecture(day, lec_lst){
  
  var time1 = 0;
  var time2 = 0;
  var j = 0;
  var len = $(".ok-time[day='"+day+"']").length;

  for(var i = 0; i<len;)
  {
    time1  = $($(".ok-time[day='"+day+"']")[i]).attr("time");
    j = 0;
    while(ok_in_same_lecture(i+j,i+j+1,day))
    {
      j++;
    }
    time2 = $($(".ok-time[day='"+day+"']")[i+j]).attr("time");

    if(j==0)
      i++;
    else
      i = i+j+1;

    lec_lst.push(make_lec(day,time1,time2));


  }

  return lec_lst;
}

function make_fixed_lecture(day, lec_lst){
  
  var time1 = 0;
  var time2 = 0;
  var j = 0;
  var len = $(".fixed-ok-time[day='"+day+"']").length;

  for(var i = 0; i<len;)
  {
    time1  = $($(".fixed-ok-time[day='"+day+"']")[i]).attr("time");
    j = 0;
    while(fixed_ok_in_same_lecture(i+j,i+j+1,day))
    {
      j++;
    }
    time2 = $($(".fixed-ok-time[day='"+day+"']")[i+j]).attr("time");

    if(j==0)
      i++;
    else
      i = i+j+1;

    lec_lst.push(make_fixed_lec(day,time1,time2));


  }

  return lec_lst;
}




function make_lec(this_day, start, fin)
{
  var  dragged_lecture = {
      day : this_day,
      start_hour : num_to_start_hour(start),
      start_min : num_to_start_min(start),
      fin_hour : num_to_fin_hour(fin),
      fin_min : num_to_fin_min(fin),
      date : day_to_date(this_day)
    }
  return dragged_lecture;
}


function make_fixed_lec(this_day, start, fin)
{
  var  dragged_lecture = {
      day : this_day,
      start_hour : num_to_start_hour(start),
      start_min : num_to_start_min(start),
      fin_hour : num_to_fin_hour(fin),
      fin_min : num_to_fin_min(fin)
    }
  return dragged_lecture;
}

//i�� j�� 1李⑥씠 
function ok_in_same_lecture(i,j,day){
  var time1;
  var time2;

  time1  = parseInt($($(".ok-time[day='"+day+"']")[i]).attr("time"));
  time2 =  parseInt($($(".ok-time[day='"+day+"']")[j]).attr("time"));

  if(time2 - 1 == time1)
    return true;
  else
    return false;
}

function fixed_ok_in_same_lecture(i,j,day){
  var time1;
  var time2;

  time1  = parseInt($($(".fixed-ok-time[day='"+day+"']")[i]).attr("time"));
  time2 =  parseInt($($(".fixed-ok-time[day='"+day+"']")[j]).attr("time"));

  if(time2 - 1 == time1)
    return true;
  else
    return false;
}

function is_same_fixed_lec(lec1,lec2){
  if(lec1.day == lec2.day && lec1.start_hour == lec2.start_hour &&  lec1.fin_hour == lec2.fin_hour &&  lec1.start_min == lec2.start_min &&  lec1.fin_min == lec2.fin_min)
    return true;
  else
    return false;
}



function is_same_lec(lec1,lec2){
  if(lec1.date == lec2.date && lec1.start_hour == lec2.start_hour &&  lec1.fin_hour == lec2.fin_hour &&  lec1.start_min == lec2.start_min &&  lec1.fin_min == lec2.fin_min)
    return true;
  else
    return false;
}


function compare_fixed_lec_lst(db_lec_lst,ok_lec_lst)
{
  var remove_id_lst = [];
  var add_lec_lst = [];
  var same_index_lst = [];

  var k = 0;
  for(var i = 0; i<db_lec_lst.length; i++)
  {
    k = 0;

    for(var j = 0; j<ok_lec_lst.length;j++)
    {
      if(is_same_fixed_lec(db_lec_lst[i],ok_lec_lst[j]))
      {
        same_index_lst.push(j);
      }
      else
        k++;
    }

    if (k==ok_lec_lst.length)
    {
      remove_id_lst.push(db_lec_lst[i].id);
    }
  }


  add_lec_lst = lst_delete_lst(ok_lec_lst,same_index_lst);


  return [remove_id_lst, add_lec_lst];
}



function compare_lec_lst(db_lec_lst,ok_lec_lst)
{
  var remove_id_lst = [];
  var add_lec_lst = [];
  var same_index_lst = [];

  var k = 0;
  for(var i = 0; i<db_lec_lst.length; i++)
  {
    k = 0;

    for(var j = 0; j<ok_lec_lst.length;j++)
    {
      if(is_same_lec(db_lec_lst[i],ok_lec_lst[j]))
      {
        same_index_lst.push(j);
      }
      else
        k++;
    }

    if (k==ok_lec_lst.length)
    {
      remove_id_lst.push(db_lec_lst[i].id);
    }
  }


  add_lec_lst = lst_delete_lst(ok_lec_lst,same_index_lst);


  return [remove_id_lst, add_lec_lst];
}

// 由ъ뒪�� �먭컻瑜� 諛쏆븘�� �ㅼ쓽 由ъ뒪�몄쓽 紐⑤뱺 �먯냼�ㅼ쓣 �욎쓽 由ъ뒪�몄뿉�� �쒓굅�섍퀬 �⑥�嫄� 以���.
function lst_delete_lst(lst, index_lst)
{
  var result = [];
  var l = lst_minus(lst.length, index_lst);
  for(var i = 0; i<l.length; i++)
  {
    result.push(lst[l[i]]);
  }

  return result;
}


// [0,1, ... , n-1] �� 由ъ뒪�몃� 留뚮뱾�댁꽌 no_lst�� �먯냼�ㅼ쓣 吏��뚮쾭由ш퀬 �⑥� 由ъ뒪�몃� 由ы꽩. 
function lst_minus(n, no_lst)
{
  var lst = [];
  for(var i = 0; i<n; i++)
  {
    if(no_lst.indexOf(i) > -1)
      ;
    else
      lst.push(i);
  }

  return lst;


}


function paint_fixed_ok_time(start,fin,day)
{
  for(var i = start; i<=fin; i++)
  {
    $("[time = "+i+"][day = "+day+"]").removeClass("ok-time").addClass("fixed-ok-time");
  }
};




function paint_dragged_ok_time(start,fin,day)
{
  for(var i = start; i<=fin; i++)
  {
    $("[time = "+i+"][day = "+day+"]").addClass("ok-time");
  }
  $(".fixed-ok-time").removeClass("ok-time");
};

function remove_dragged_ok_time(start,fin,day)
{
  for(var i = start; i<=fin; i++)
  {
    $("[time = "+i+"][day = "+day+"]").removeClass("ok-time").removeClass("fixed-ok-time");
  }
};



function modify_subjects(floating_id_lst, fixed_id_lst, floating_ok_lec_lst_final, fixed_ok_lec_lst_final) {
    saving = true;
    $("#loading-modal").show();

    all_data = {"floating_id_lst": floating_id_lst,
                "fixed_id_lst" : fixed_id_lst,
                "floating_ok_lec_lst_final" : floating_ok_lec_lst_final,
                "fixed_ok_lec_lst_final" : fixed_ok_lec_lst_final};

    $.ajax({
        url: '/modify_subjects',
        data: {"sese" : JSON.stringify(all_data)},
        type:'POST',
        success:function(response){
         console.log("success");
         
         },
         error: function(){일
          console.log("error");
        },
        complete:function(){
            console.log('complete');
            saving = false;
            $("#loading-modal").hide();
            window.location.reload();
        }
    });

}



function day_to_english(day){
  if (day == "월")
    return "mon";
  else if (day == "화")
    return "tue";
  else if (day == "수")
    return "wed";
  else if (day == "목")
    return "thu";
  else if (day == "금")
    return "fri";
  else if (day == "토")
    return "sat";
  else if (day == "")
    return "sun";
  else
    return null;
}