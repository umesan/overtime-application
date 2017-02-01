import $ from 'jquery';
import styles from './index.scss';

// 残業申請ページ表示に要するパラメータ
const overtimeReportState = {
  status: 'default',
  module: 'application_form',
  action: 'editor',
  application_form_master_id: '122'
}

// 各種申請画面の呼び出しに要するパラメータ
const appFormState = {
  module: 'application_form',
  action: 'application_form'
}

// 残業申請画面
const overtimeReportPath = __DEV__
  ? 'overtime_report.html'
  : '/'

// 各種申請画面
const appFormPath = __DEV__
  ? 'application_form.html'
  : `/?${$.param(appFormState)}`

/**
 * 初期実行処理
 *
 * 各種申請画面から残業申請フォームIDを取得したのち、行追加処理を開始
 */
export default () => {
  $.ajax({
    url: appFormPath,
    dataType: 'html'
  })
  .done(function(data) {
    overtimeReportState.application_form_master_id = $(data).find('#slct_appformmasterid').eq(0).find('option').filter(function(){
      return $(this).text() === '残業申請*';
    }).val();

    // ボタン追加
    addBtn();

  });
}


/**
 * 残業申請ボタンの追加
 */
const addBtn = () => {

  // 退社しているかチェック
  const $timebtnTd = $('#tr_submit_form').find('tr').eq(0).find('td:last-child');
  const timebtn = $timebtnTd.find('button');
  if (!timebtn.length){

    var dt = new Date();

    //年
    const year = dt.getFullYear();

    //月
    const month = dt.getMonth();

    //日
    const date = dt.getDate();

    // 退社時刻
    var timetext = $timebtnTd.text();
    timetext = timetext.replace('退社','');
    timetext = timetext.replace('(','');
    timetext = timetext.replace(')','');

    let param = [];
    let d = [year, month, date];
    d = d.concat(timetext.split(':'));
    param.push(d);

    if(__BOOKMARKLET__){
      alert('お疲れ様でした。残業申請画面へ遷移します。');
      location.href = `${overtimeReportPath}?${$.param(reqParam(param))}`
    }else{
      // タグの作成
      const btnTag = `<div class="zangyousan-top"><div class="zangyusan-top__main">お疲れ様でした。</div><div class="zangyusan-top__sub"><a href="${overtimeReportPath}?${$.param(reqParam(param))}" class="zangyousan-top__link" target="_blank">本日の残業を申請</a></div></div>`;
      $('#tr_submit_form').append(btnTag);
    }
  }else{
    if(__BOOKMARKLET__){
      alert('退社後に実行してください。');
    }
  }
}

/**
 * 残業時間をクエリ化
 * @param  {Array} param 配列
 * @return {String} クエリ
 */
const reqParam = (param) => {
  return Object.assign(true, overtimeReportState, {
    times: JSON.stringify(param),
    reflect_data_count: param.length - 1
  });
}
