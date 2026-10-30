# Changelog

## v0.1.18
- 収集進捗の15秒ポーリングをRUNNING/PAUSED_AUTO_RESUME時に限定。
- 完了・エラー・履歴なし・ダイアログ終了時は停止。
- 手動更新と既存収集処理は維持。
- 実機未検証。

## v0.1.17
- 手動更新と15秒自動確認に実行中・成功・失敗・最終確認時刻を表示。
- 二重実行を防止。EvidenceおよびGSC収集処理は変更なし。実機未検証。

# Changelog

## v0.1.16
- 収集進捗画面の埋め込みJavaScriptのエスケープ不具合を修正。
- 15秒更新・既存Evidence保護を維持。実機未検証。

## v0.1.15
- 収集進捗の読み取り専用ダイアログを追加（15秒間隔で状態更新）。
- 工程、進捗文、開始・最終更新・完了時刻、エラーを表示。
- 収集ロジック・GSC API呼び出し・Evidence管理は変更なし。

## v0.1.14
- VERIFIED/DELTA_VERIFIED Evidenceの明示確認付き安全移行。
- サイト識別・ZIP manifest・収集期間・元保存先の照合。
- 移行済みスキップ、AuditLog記録、部分失敗時の安全停止。
- 既存台帳、ZIP内容、ファイルIDを維持。

# Changelog

## v0.1.13
- サイトIDを付したブログ別SIMS/Strategistフォルダーを明示操作で自動作成。
- 新規Baseline/Delta Evidenceの保存先を分離。
- Home保存先表示、Driveへのリンク、フォルダーIDと親子関係検証。
- 既存Evidenceの移動なし。Managerデータへの変更なし。

## v0.1.12
- 収集状況と再開処理のサイトID照合を修正。
