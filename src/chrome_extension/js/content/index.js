import $ from 'jquery';

(() => {
  if(!__DEV__ && document.domain !== 'www.4628.jp'){
    return
  }
  if ($('#time_recorder').length) {
    // TOP画面
    require('../../../common/js/top').default()
  }
  else if ($('#submit_form0').length) {
    // 出勤簿画面
    require('../../../common/js/timesheet').default()
  }
  else if($('#lbl_disp_reflect_date').length) {
    // 残業申請画面
    require('../../../common/js/overtimeReport').default()
  }
})()
