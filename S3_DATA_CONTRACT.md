# 共通データ契約（草案・既存契約を変更しない）

全レコードにschema_version、site_id、run_id、generated_at、source_refsを持たせる。IDはサイト内だけでなくsite_idとの組で照合。元URLを保持し、正規化で別記事を誤結合しない。

|データ|主要項目|
|---|---|
|Evidence参照|file_id, signature, period_start/end, dataset, quality_status, coverage, limitations|
|記事台帳|article_id, url, title, published_at, SBM状態, GSC照合状態|
|診断|article_id, metrics, evidence_refs, findings, proposed_action, confidence, missing_evidence|
|候補|candidate_id, keyword, normalized_key, origin, related_article_ids, demand, serp, overlap, priority|
|施策|action_id, target_ids, action_type, approval, request_id, execution_state, result_refs|

需要とSERPは独立。需要状態 CONFIRMED/ZERO/UNKNOWN/UNAVAILABLE。数値・範囲・取得日・地域・言語・提供元を保持。ZEROは提供元の値であって絶対的な需要ゼロではない。GSC表示数を検索ボリュームに変換しない。
SERPは順位帯TOP10/TOP20/TOP30/OUT、未評価、根拠、取得日、確信度、強制停止理由を保持。LIGHT BLUE等の旧表示は原値保持し根拠なしに変換しない。
GSCのquery_summary.csvとpage_query_top.csvは異なる粒度。重複期間を加算しない。未取得・匿名化・上限による欠損と実測ゼロを区別。365日未満は不足を明示。季節性は観測可能な範囲のみ。
既存の外部JSON契約は本草案で置き換えない。変換アダプタを設計し、受け手の最新版で検証する。

## v0.1.109
SERP依頼・回答の純粋関数を追加。BOS契約識別子を継承し5件未満は保留、重複証拠拒否、自サイト検出はカニバリ保留。確認は構造のみ、実在性・保存・ZIP入出力・GAS UI未実装。

## v0.1.110
M2暫定関連記事分析を実機試験用メニューに接続。SKE所有性・BOSリスク処理を監査し、候補とGSC観測を統合。確定判定・永続保存・SERP入出力は未完。GAS未試験。

## v0.1.111
- v0.1.110実機：454記事、識別保留0、Chrome 太字の語彙候補1、記事別観測なし。
- サイト全体クエリと記事別上位クエリの観測を分離表示。未観測は需要ゼロではない。GAS実機未検証。
