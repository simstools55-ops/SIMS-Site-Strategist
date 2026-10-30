# SIMS Site Strategist v0.1.0 (P0)

初回セットアップと1サイト固定を実装した**試験版**です。Collector / Doctor / Explorer / BOSはまだ統合していません。

## 適用手順
1. 新規Googleスプレッドシートを作成します（既存ManagerやCollectorには適用しない）。
2. 拡張機能 → Apps Scriptを開き、Code.gsを置き換えます。
3. プロジェクト設定でマニフェストを表示し、appsscript.jsonを同梱ファイルの内容に置き換えます。
4. 保存し、スプレッドシートを再読み込みします。
5. メニュー「SIMS Site Strategist」→「初回セットアップ」。権限承認後、GSCプロパティとサイト名を選択します。
6. 「Homeを開く」「登録サイトを確認」で固定情報を確認します。

## 注意
- Search Console APIはApps Scriptが紐づくGoogle Cloudプロジェクトで有効にしてください。
- GSCのURLプレフィックスは登録値をそのまま保存します。ドメインプロパティにも対応します。
- 誤登録時のサイト変更・解除は未実装です。試験では新しいスプレッドシートを作り直してください。
- 本版ではGSCデータ収集、Site Doctor診断、BOS探索は実行できません。
- 実サイトの権限承認・実機動作は未検証です。
