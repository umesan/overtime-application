(() => {
  if(!__DEV__ && document.domain !== 'www.4628.jp'){
    return
  }
  const $ = require('jquery')
  if ($('#submit_form0').length) {
    require('../../../common/js/timesheet').default()
  }
  else if($('#lbl_disp_reflect_date').length) {
    require('../../../common/js/overtimeReport').default()
  }
})()
