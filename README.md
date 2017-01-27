# 残業さん

![](https://cloud.githubusercontent.com/assets/3190760/22357050/0625f9bc-e479-11e6-95cb-5f50f7c73af2.png)

## 残業さんとは
万屋一家シリーズの勤怠管理システム 勤之助ver.2 の残業申請入力を支援する非公式ツールです。  
Chrome 拡張版とブックマークレット版があります。

これまでは、残業申請画面で、手動でひとつづつ勤怠情報を入力していたため申請に時間がかかりました。  
残業さんを利用すると、出勤簿画面のデータを利用して、勤怠情報をまとめて設定可能になります。


## 画面イメージ
![](https://cloud.githubusercontent.com/assets/3190760/22358490/dfb923f8-e482-11e6-8717-5f765e13c0cd.png)


## インストール方法と使い方

### Chrome拡張版
1. [Chrome ウェブストア](https://chrome.google.com/webstore/detail/%E6%AE%8B%E6%A5%AD%E3%81%95%E3%82%93/icfemmjdbnbjkpghbjjeecfgolbdiajh?hl=ja) に移動し残業さんをインストールしてください
2. [勤之助の出勤簿のページ](https://www.4628.jp/?module=timesheet&action=browse)に移動してください
3. 画面に残業申請ボタン列が追加されています
4. 各ボタンを押して残業申請画面に進んでください
5. 日時が自動挿入されています
6. 内容を確認し、問題がなければ申請してください
7. 4 - 6 を繰り返してください


### ブックマークレット版
1. `./bookmarklet` に配置してある、[export.min.js](https://raw.githubusercontent.com/umesan/overtime-application/master/bookmarklet/export.min.js) と [import.min.js](https://raw.githubusercontent.com/umesan/overtime-application/master/bookmarklet/import.min.js)をChromeのブックマークに登録します
2. [勤之助の出勤簿のページ](https://www.4628.jp/?module=timesheet&action=browse)に移動した後、登録した`export.min.js` を実行します
3. 画面に残業申請ボタン列が追加されます
4. 各ボタンを押して残業申請画面に進んでください
5. 残業申請画面にて 登録した`import.min.js`を実行してください
6. 日時が自動挿入されます
7. 内容を確認し、問題がなければ申請してください
8. 4 - 7 を繰り返してください


## 更新履歴
[GitHub Releases](https://github.com/umesan/overtime-application/releases)


## License
MIT