import $ from 'jquery'
import styles from './index.scss'

// 残業申請ページ表示に要するパラメータ
const overtimeReportState = {
  status: 'default',
  module: 'application_form',
  action: 'editor',
  application_form_master_id: '122'
}
// 各種申請画面
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
    addRow();
    if(__BOOKMARKLET__){
      alert('残業申請ボタン列を追加しました。\n\nボタンを押して残業申請画面に進み、\n再度ブックマークレットを実行してください。');
    }
  });
}

/**
 * 行追加処理
 * @param {String} overtimeApplicationFormId 残業申請フォームID
 */
const addRow = (overtimeApplicationFormId) => {
  var bulkBuffer = [];
  var weeklyBuffer = [];
  var BULKCOUNT = 10;
  var WEEKEND = '金';
  var COLS = {
    MDAY: 0,
    WDAY: 1,
    TYPE: 2,
    EXTRA: 4,
    ATTEND: 6,
    LEAVE: 7,
    OVER: 11
  };

  var weeklyActionBtnTargetNo = 1;
  var year = $('select[name="Date_Year"]').val();
  var month = $('select[name="Date_Month"]').val() - 1;
  var $rows = $('#submit_form0').find('table.txt_12').find('tr');
  var lastWorkRowIndex = $rows.length - 2;

  var weeklyActionColTag = '<td nowrap class="weekly-action"></td>';
  var createBulkActionHasColRowspanTag = function(rowspan){
    return '<td nowrap class="bulk-action" rowspan="' + rowspan + '" style="background: #edfbf6;"></td>';
  };
  var createWeeklyActionHasColRowspanTag = function(rowspan){
    return '<td nowrap class="weekly-action" rowspan="' + rowspan + '" style="background: #eeeeee;"></td>';
  };


  // 行分処理を開始
  $rows.each(function (rowNo) {

    // 0行目には「残業申請」タイトル行を挿入
    if(rowNo === 0) {
      var $actionCol = $('<td nowrap colspan="2" class="zangyousan__col" />');
      $actionCol.text('残業申請').css('text-align', 'center');
      $(this).append($actionCol);
      return
    }

    // カラム一覧を取得
    var $cols = $(this).find('td');
    // 曜日を取得
    var dayOfTheWeek = colText($cols, COLS.WDAY);
    // 時間外終了時刻を取得
    var overtime = colText($cols, COLS.OVER);
    // 出社時刻を取得
    var attendtime = colText($cols, COLS.ATTEND);
    // 届け出内容列を取得
    var extra = colText($cols, COLS.EXTRA);
    // カレンダー
    var type = colText($cols, COLS.TYPE);
    // 月末判定
    var isEndOfMonth = rowNo === lastWorkRowIndex;

    // 残業申請が必要な行を抽出
    // [残業申請が必要な行とは？]
    //   - 届け出内容が一日有休ではない
    //   - 平日であること
    if(extra !== '一日有休' && type === '平日'){

      // 残業申請が可能な行をハイライトする
      $(this).css({'background-color':'#fff8db','color':'#98741c'});

      var mday = colText($cols, COLS.MDAY); // 日
      var time = colText($cols, COLS.LEAVE); // 退社時刻

      var d = [year, month, mday];
      if (time !== '') {
        d = d.concat(time.split(':'));
      }

      bulkBuffer.push(d);
      weeklyBuffer.push(d);
    }

    if(rowNo === 1) {
      // 月の始めが、月か土か日でない場合、最初の金曜日までを rowspan で一括りににする
      if(dayOfTheWeek === '火' || dayOfTheWeek === '水' || dayOfTheWeek === '木' || dayOfTheWeek === '金') {
        var rowspan = 1;
        for (var checkNextRows = 1; checkNextRows < 5; checkNextRows++) {
          var checkRowNo = rowNo + checkNextRows;
          if ($rows.eq(checkRowNo).find('td').eq(COLS.WDAY).text() === '金'){
            rowspan = checkNextRows + 1;
          }
        }
        // 申請カラム追加
        var weeklyActionHasColRowspanTag = createWeeklyActionHasColRowspanTag(rowspan,weeklyBuffer);
        $(this)
        .addClass('js-rowHasRowspan' + weeklyActionBtnTargetNo)
        .append(weeklyActionHasColRowspanTag);
        weeklyActionBtnTargetNo += 1;
      }
    }

    // 土日なら、2列追加
    if( dayOfTheWeek === '土' || dayOfTheWeek === '日'){
      $(this).append(weeklyActionColTag);
    }

    if (dayOfTheWeek === '月'){

      // 月曜日の場合は金曜日までを rowspan でグループ化
      var rowspan = 1;
      for (var checkNextRows = 1; checkNextRows < 6; checkNextRows++) {
        var checkRowNo = rowNo + checkNextRows;
        if (checkRowNo > lastWorkRowIndex){
          rowspan = checkNextRows;
          break;
        }
        if ($rows.eq(checkRowNo).find('td').eq(COLS.WDAY).text() === '金'){
          rowspan = checkNextRows + 1;
          break;
        }
      }

      // 申請カラム追加
      var weeklyActionHasColRowspanTag = createWeeklyActionHasColRowspanTag(rowspan,weeklyBuffer);
      $(this)
      .addClass('js-rowHasRowspan' + weeklyActionBtnTargetNo)
      .append(weeklyActionHasColRowspanTag);
      weeklyActionBtnTargetNo += 1;
    }

    // 1行目に「10件毎申請」列を挿入
    if(rowNo === 1) {
      var bulkActionHasColRowspanTag = createBulkActionHasColRowspanTag(lastWorkRowIndex,bulkBuffer);
      $(this).append(bulkActionHasColRowspanTag);
    }

    // 「週単位申請」ボタンを追加
    if (0 < weeklyBuffer.length) {

      if (dayOfTheWeek === '金' || isEndOfMonth) {

        $('.js-rowHasRowspan' + (weeklyActionBtnTargetNo - 1))
          .find('.weekly-action')
          .append(actionLink(weeklyBuffer, '週単位'));

        weeklyBuffer = [];
      }
    }

    // 「10件単位で申請」ボタンを追加
    if (0 < bulkBuffer.length) {
      if (bulkBuffer.length === BULKCOUNT || isEndOfMonth) {
        $('.bulk-action')
        .append(actionLink(bulkBuffer, '10件毎'));
        bulkBuffer = [];
      }
    }


  });
}

/**
 * カラムテキスト抽出
 * @param  {jQueryObject} $cols 対象のtd要素
 * @param  {Number} i    対象の列番号
 * @return {String}      td内のテキスト
 */
const colText = ($cols, i) => {
  return $.trim( $cols.eq(i).text() );
}

/**
 * 残業時間をクエリ化
 * TODO: Object.assignにしたい
 * @param  {Array} param 配列
 * @return {String}      td内のテキスト
 */
const reqParam = (param) => {
  return $.extend(true, overtimeReportState, {
    times: JSON.stringify(param),
    reflect_data_count: param.length - 1
  });
}

/**
 * 残業申請リンク生成
 * @param  {Array} param リンクに追加するGetパラメータ値
 * @param  {String} label ボタンのラベル名
 * @return {String}       生成した挿入するaタグ
 */
const actionLink = (param, label) => (
  $(`<a
    href="${overtimeReportPath}?${$.param(reqParam(param))}"
    class="zangyousan__link"
    target="_blank"
  >${label}</a>`)
)
