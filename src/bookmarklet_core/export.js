import $ from 'jquery';
import timesheet from '../common/js/timesheet';
import top from '../common/js/top';

if (__DEV__ || document.domain === 'www.4628.jp' || document.domain === 'localhost') {
  if ($('#submit_form0').length) {
    timesheet();
  } else if ($('#time_recorder').length){
    top();
  } else{
    alert('万屋一家シリーズ勤之助ver.2の「出勤簿画面」で実行してください');
  }
} else {
  alert('万屋一家シリーズ勤之助ver.2の「出勤簿画面」で実行してください');
}
