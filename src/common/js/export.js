/**
 * 残業申請エクスポート処理
 */
(function($){

  // 出勤簿画面にいるかチェック
  if(bookmarklet && document.domain === 'www.4628.jp' && !$('#submit_form0').length && !$('#time_recorder').length){
    alert('万屋一家シリーズ勤之助ver.2の「TOP」か「出勤簿画面」で実行してください');
    return;
  }

  var overtimeApplication = {

    // 残業申請ページ表示に要するパラメータ
    state: {
      status: 'default',
      module: 'application_form',
      action: 'editor',
      application_form_master_id: '122'
    },

    /**
     * 初期実行処理
     *
     * 各種申請画面から残業申請フォームIDを取得したのち、行追加処理を開始
     */
    initialize:function(){
      var that = this;
      $.ajax({
        url: '/?module=application_form&action=application_form',
        dataType: 'html'
      })
      .done(function(data) {
        that.state.application_form_master_id = $(data).find('#slct_appformmasterid').eq(0).find('option').filter(function(){
          return $(this).text() === '残業申請*';
        }).val();

        // TOP画面の場合
        if($('#time_recorder').length){
          that.addBtn();
          return;
        }

        // 出勤簿画面の場合
        if ($('#submit_form0').length){
          that.addRow();
          if(bookmarklet){
            alert('[残業さんを実行します]\n下記の手順で残業申請を行ってください。\n\n1. この画面に残業申請ボタン列が追加されます。\n2. 各ボタンを押して残業申請画面に進んでください。\n3. 残業申請画面にてインポートブックマークレットを実行してください。\n4. 日時が自動挿入されます。確認後、申請してください。');
          }
          return;
        }

      });
    },

    /**
     * 行追加処理
     * @param {String} overtimeApplicationFormId 残業申請フォームID
     */
    addRow:function (overtimeApplicationFormId){
      var that = this;
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
        var dayOfTheWeek = that.colText($cols, COLS.WDAY);
        // 時間外終了時刻を取得
        var overtime = that.colText($cols, COLS.OVER);
        // 出社時刻を取得
        var attendtime = that.colText($cols, COLS.ATTEND);
        // 届け出内容列を取得
        var extra = that.colText($cols, COLS.EXTRA);
        // カレンダー
        var type = that.colText($cols, COLS.TYPE);
        // 月末判定
        var isEndOfMonth = rowNo === lastWorkRowIndex;

        // 残業申請が必要な行を抽出
        // [残業申請が必要な行とは？]
        //   - 届け出内容が一日有休ではない
        //   - 平日であること
        if(extra !== '一日有休' && type === '平日'){

          // 残業申請が可能な行をハイライトする
          $(this).css({'background-color':'#fff8db','color':'#98741c'});

          var mday = that.colText($cols, COLS.MDAY); // 日
          var time = that.colText($cols, COLS.LEAVE); // 退社時刻

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
              .append(that.actionLink(weeklyBuffer, '週単位'));

            weeklyBuffer = [];
          }
        }

        // 「10件単位で申請」ボタンを追加
        if (0 < bulkBuffer.length) {
          if (bulkBuffer.length === BULKCOUNT || isEndOfMonth) {
            $('.bulk-action')
            .append(that.actionLink(bulkBuffer, '10件毎'));
            bulkBuffer = [];
          }
        }


      });


    },

    /**
     * TOP画面残業申請ボタンの追加
     */
    addBtn: function(){

      // 退社しているかチェック
      var $timebtnTd = $('#tr_submit_form').find('tr').eq(0).find('td:last-child');
      var timebtn = $timebtnTd.find('button');
      if (!timebtn.length){

        var dt = new Date();

        //年
        var year = dt.getFullYear();

        //月
        var month = dt.getMonth();

        //日
        var date = dt.getDate();

        // 退社時刻
        var timetext = $timebtnTd.text();
        timetext = timetext.replace('退社','');
        timetext = timetext.replace('(','');
        timetext = timetext.replace(')','');

        var param = [];
        var d = [year, month, date];
        d = d.concat(timetext.split(':'));
        param.push(d);

        if(bookmarklet) {
          alert('お疲れ様でした。残業申請画面へ遷移します。');
          location.href = '/?' + $.param(this.reqParam(param));
        } else {
          // タグの作成
          var btnTag = '<div class="zangyousan-top"><div class="zangyusan-top__main">お疲れ様でした。</div><div class="zangyusan-top__sub"><a href="/?' + $.param(this.reqParam(param)) + '" class="zangyousan-top__link" target="_blank">本日の残業を申請</a></div></div>';
          $('#tr_submit_form').append(btnTag);
        }
      } else {
        if(bookmarklet) {
          alert('退社後に実行してください。');
        }
      }
    },

    /**
     * カラムテキスト抽出
     * @param  {jQueryObject} $cols 対象のtd要素
     * @param  {Number} i    対象の列番号
     * @return {String}      td内のテキスト
     */
    colText: function($cols, i) {
      return $.trim( $cols.eq(i).text() );
    },

    /**
     * 残業時間をクエリ化
     * TODO: Object.assignにしたい
     * @param  {Array} param 配列
     * @return {String}      td内のテキスト
     */
    reqParam: function(param) {
      return $.extend(true, this.state, {
        times: JSON.stringify(param),
        reflect_data_count: param.length - 1
      });
    },

    /**
     * 残業申請リンク生成
     * @param  {Array} param リンクに追加するGetパラメータ値
     * @param  {String} label ボタンのラベル名
     * @return {String}       生成した挿入するaタグ
     */
    actionLink: function(param, label) {
      var link = '<a href="?'
              + $.param(this.reqParam(param))
              + '" style="'
              + 'background: #ffffff;'
              + ' border: 1px solid buttonface;'
              + ' margin: 5px 3px;'
              + ' padding: 3px 6px 2px;'
              + ' border-radius: 3px;'
              + ' box-sizing: border-box;'
              + ' color: buttontext;'
              + ' display: inline-block;'
              + ' font-size: 10px;'
              + ' line-height: 1.2;'
              + '" target="_blank">'
              + label
              + '</a><br>';
      return link;
    }
  };
  overtimeApplication.initialize();
})(jQuery);