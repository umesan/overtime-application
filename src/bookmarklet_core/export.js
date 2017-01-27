import $ from 'jquery'
import timesheet from '../common/js/timesheet'

if (__DEV__ || document.domain === 'www.4628.jp' && $('#submit_form0').length) {
  timesheet()
}
else {
  alert('万屋一家シリーズ勤之助ver.2の「出勤簿画面」で実行してください')
}
