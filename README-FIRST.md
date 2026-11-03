SIMS Site Strategist v0.1.94 — 単一 Code.gs 配布版

【更新方法】
既存のApps Scriptの Code.gs を本ZIPの Code.gs に置き換え、保存し、スプレッドシートを再読み込みしてください。
SetupWizard.html の新規作成・更新は不要です。すでに追加済みの SetupWizard.html は参照されません。削除は任意ですが、試験中はそのまま残して構いません。

【初回セットアップ】
SIMS Site Strategist → 初回セットアップ。サイト登録済みの場合は途中から再開します。
SBMのスプレッドシートURLまたはIDを入力して照合し、既存の SIMS/ブログ名 フォルダーの下に Strategist を準備します。
SBMフォルダーがない場合は停止します。既存保存先の自動変更や旧Evidenceの移行は行いません。

【検証】
コード構文・ZIP整合性はローカル検査。GAS実機未検証。v0.1.61は過去の実機確認版です。
既存の収集・統合・分析ロジックは変更していません。

【重要：OAuth権限の更新】
Code.gsだけでなく appsscript.json も更新してください。Apps Scriptの「プロジェクトの設定」→「appsscript.json マニフェスト ファイルをエディタで表示する」を有効にし、既存のマニフェストをバックアップしたうえで本ZIPの内容に置き換えて保存します。
今回、spreadsheets.currentonly を spreadsheets に変更しました。SBMの別スプレッドシートを SpreadsheetApp.openById で参照するために必要です。Googleの再承認画面が出た場合は内容を確認して承認してください。権限承認が必要でも、初回セットアップ済みのサイト登録を消す必要はありません。
この権限はGoogleの仕様上、読み取り専用ではありません。SBM照合コードは読み取り用途に限定しています。
【注意】Code.gsだけを更新しても今回のエラーは解消しません。GAS実機未検証です。
