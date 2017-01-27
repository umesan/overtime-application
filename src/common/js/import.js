/**
 * 残業申請インポート処理
 */
(function($){

  // 残業申請画面にいるかチェック
  if(bookmarklet && document.domain === 'www.4628.jp' && !$('#lbl_disp_reflect_date').length){
    alert('万屋一家シリーズ勤之助ver.2の「残業申請画面」で実行してください');
    return;
  }

  if(bookmarklet){
    alert('[残業さんインポート処理を実行します]\n\n1. 日時を自動挿入します\n2. 内容を確認し、問題なければ申請をしてください。');
  }

  var ONE_DAY = 86400000;
  var START_HOUR = 9;

  var zeroPadding = function(num, length){
    return ('0000' + num).slice(-length);
  };

  var toStrDate = function(d){
    return {
      year: zeroPadding(d.getFullYear(),4),
      month: zeroPadding(d.getMonth()+1,2),
      day: zeroPadding(d.getDate(),2),
      hour: zeroPadding(d.getHours(),2),
      minute: zeroPadding(d.getMinutes(),2)
    };
  }

  // import処理
  var args = [];
  var req = decodeURIComponent(window.location.search.substring(1)).split('&');
  req.some(function(r){
    var pair = r.split('=');
    if (pair[0] === 'times') {
      args = JSON.parse(pair[1]);
      return true
    }
    return false
  })

  // 入力フォームID
  var i = 1;
  // 計上日チェックボックス
  var $dispReflect = $('#lbl_disp_reflect_date');

  args.forEach(function(arg){
    // 退社時刻
    var hasTime = arg.length === 5;

    // date化
    var d = hasTime
    ? new Date(arg[0],arg[1],arg[2], arg[3], arg[4])
    : new Date(arg[0],arg[1],arg[2])

    if(d.toString() === "Invalid Date") {
      return;
    }

    // 計上日
    var reflectDate = toStrDate(d);

    // 終了日：0時〜始業時までなら翌日にする
    var valueDate;
    if(hasTime && d.getHours() < START_HOUR){
      valueDate = toStrDate( new Date(d.getTime() + ONE_DAY) );
      if(!$dispReflect.prop('checked')){
        $dispReflect.click();
      }
    }
    else {
      valueDate = reflectDate;
    }

    var id = zeroPadding(i++, 3);

    // 退社時刻が無ければ空欄にする
    if(!hasTime){
      valueDate.hour =
      valueDate.minute = "";

      // 退社時刻がない場合は、注記を表示する
      $('[name="value_time_' + id + '_Hour"]')
        .closest('tr')
        .find('td')
        .eq(0)
        .append('<p style="margin: 10px 0 0; padding: 5px 10px; background-color:#fff8db; border: 1px solid #98741c; color: #98741c; font-size: 11px;">退社時刻の入力が存在しませんでした。<br>手動で設定するか、不要であれば削除してください。</p>');
    }

    //計上時刻
    $('#application_reflect_date_' + id + '_Year_ID').val(reflectDate.year);
    $('#application_reflect_date_' + id + '_Month_ID').val(reflectDate.month);
    $('#application_reflect_date_' + id + '_Day_ID').val(reflectDate.day);
    $('[name="application_reflect_time_' + id + '_Hour"]').val(reflectDate.hour);
    $('[name="application_reflect_time_' + id + '_Minute"]').val(reflectDate.minute);

    //終了時刻
    $('#value_date_' + id + '_Year_ID').val(valueDate.year);
    $('#value_date_' + id + '_Month_ID').val(valueDate.month);
    $('#value_date_' + id + '_Day_ID').val(valueDate.day);
    $('[name="value_time_' + id + '_Hour"]').val(valueDate.hour);
    $('[name="value_time_' + id + '_Minute"]').val(valueDate.minute);

  });
})(jQuery);