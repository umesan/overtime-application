import $ from 'jquery'
import overtimeReport from '../common/js/overtimeReport'

if (__DEV__ || document.domain === 'www.4628.jp' && $('#lbl_disp_reflect_date').length) {
  alert('[残業さんインポート処理を実行します]\n\n1. 日時を自動挿入します\n2. 内容を確認し、問題なければ申請をしてください。')
  overtimeReport()
}
else {
  alert('万屋一家シリーズ勤之助ver.2の「残業申請画面」で実行してください')
}
