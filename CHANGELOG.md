## v0.1.90
- 開発中データの移行方針を廃止し、新規収集へ変更。
- ブログ名フォルダー保存方式を維持し、移行関連メニューを非表示。
- 既存保存先bindingは自動変更せず、新規開発用シートでの再収集を案内。
- 収集・統合・分析ロジックは変更なし。

## v0.1.88
- 読取専用のステージング全件照合を追加。移行元・移行先の全階層で不足、余剰、重複、サイズ・SHA-256不一致を検出。
- 10MiB超・20,000項目超はHOLD。保存先切替は未実装。GAS実機未検証。

## v0.1.87
- ステージングコピー試作に移行元の同名ファイル・同名フォルダー検査を追加。
- 移行先のファイル／フォルダー名衝突時はコピー・フォルダー生成前に停止。
- GAS実機未検証。

## v0.1.85
- ブログ名フォルダー移行計画の読取専用プレビューを追加。
- 対象ファイル・階層・サイズを計測し、移行先Strategistの衝突を停止条件に設定。
- 実際のコピー、保存先切替、削除は行わない。

## v0.1.84
- Manager v9.2.4 の SIMS/ブログ名/Manager/Backups 構造を読取専用で確認。
- Manager固有bindingをS3が取得できない制約を明示。移行はHOLD。

## v0.1.82
- Manager照合画面の予備PASSを移行許可と誤解しない文言に修正。
- S3保存先フォルダー名の記録との不一致をHOLD扱いにする。
- Manager全件監査上限超過時は移行HOLDを明示。
- データ移動・書込なし。GAS実機試験未実施。

## v0.1.79
- Manager記事管理の全URL（最大10,000件）をGSCプロパティ範囲と照合する読取専用事前監査を追加。
- ブログ名フォルダー、Manager/Strategistフォルダーの重複を確認。
- URL一致は所有権の証明ではないため、移行は必ずHOLD。
- Manager ID保存、Evidenceコピー・移動、設定変更は実施しない。

## v0.1.78
- Consolidated migration overview into one read-only menu.
- Kept existing audit functions in source for compatibility; no data migration.
- Site identity and content verification remain HOLD.

## v0.1.76
- Added read-only risk review for blog-name folder alignment.
- Never treats a matching name or Manager folder as proof of ownership.
- No migration writes or bindings changed.

## v0.1.74
- Add read-only recursive Drive folder inventory and relative-path collision preflight.
- No migration or Manager mutation. GAS live test pending.

## v0.1.73
- Fix: Manager照合監査の保存済み候補キーを preview から top に修正。
- Add: Managerの最新状態を読取専用で表示する候補プレビュー。
- Safety: 未照合・重複・不明状態は保留、Manager IDを保存しない。

## v0.1.71
- Manager候補照合に最新監査PASSEDの整合ゲートを追加。
- URLの安全な照合と形式不明URLの停止条件を強化。
- 読取専用・Manager ID非保存を維持。

## v0.1.68
- 読取専用の保存先移行前監査を追加。目標フォルダー重複、現在の保存先、直下ファイル数を表示。
- 既存データの移動・削除・フォルダー作成・プロパティ変更なし。
- Managerのサイト識別との自動照合および移行実行は未実装。

## v0.1.66
- Add read-only impact triage for persisted top strategy candidates.
- Explicitly disclose limited candidate scope and unavailable Manager state.

## v0.1.66 (2026-11-03)
- Add read-only exploratory strategy priorities from persisted audited site diagnosis.
- Validate counts and data integrity; no source writes or automatic changes.
- Add matching menu callback and preserve all earlier features.

## v0.1.64
- Add audit-gated, read-only site-wide trend summary from existing strategy totals.
- Preserve all diagnostic calculations and stored Evidence.
- GAS device test pending.

## v0.1.63
- 診断結果の小数表示と欠損値の扱いを修正。前60日の30日換算値と実測CTR・順位を明確に区別。診断は調査候補である旨を表示。元Evidence・ZIP・判定ロジックは変更なし。

## v0.1.60
- PASSED済み最終ZIPを使用した30日対直前60日の探索的ページ診断。
- HIGH / MEDIUM / GROWTH / WATCH分類、上位40件のチェックポイント保存。
- 既存Evidence・ZIPを変更しない。
- GAS実機未検証。

## v0.1.59
- 期間別最終ZIP品質監査を既存の5/73件から高速自動継続する専用トリガーを追加。
- 各ZIP処理後のチェックポイント保存、HOLD停止、PASSED後のトリガー削除。
- バックグラウンド処理からUI呼び出しを排除。

## v0.1.58
- Add read-only final period ZIP audit with bounded 5-part checkpoint scans.
- Validate CSV structure, duplicate pages, numeric types, manifest totals, and aggregate reconciliation against all 73 partial ZIPs.
- Fail closed with HOLD on mismatch; preserve evidence and final ZIP.

## v0.1.57
- Fix time-trigger UI access in silent page reduction.
- Add guarded recovery for the exact UI-related HOLD at 4/73 without resetting outputs.
- Keep all Evidence and partial ZIPs unchanged.

## v0.1.55
- Time-budgeted automated continuation for P53 hierarchical reduction; preserves existing checkpoint.
- Dedicated one-minute trigger with completion cleanup, HOLD handling and manual stop.
- Silent batch execution, maximum 24 steps per invocation and 210-second safety budget.

## v0.1.54
- Fix onOpen menu callbacks for period reduction: sssP53Start, sssP53Continue, sssP53Status. No aggregation logic changes.

## v0.1.53
- Add hierarchical, bounded 30/90/365 page aggregation (up to four inputs per execution).
- Measure read, CSV processing and ZIP save durations.
- Verify each input against its manifest and final totals against partial aggregation totals.
- Keep source evidence unchanged; checkpoints support manual resume.
- Automatic continuation is not enabled in this candidate.

## v0.1.52
- 30/90/365日中間集計の専用時間トリガー自動継続を追加。
- 既存チェックポイントから再開し、HOLD・完了時に専用トリガーを削除。
- トリガーからUIを呼ばない処理経路を追加。

## v0.1.51
- Add bounded 30/90/365-day per-page partial aggregation (one merged chunk per invocation).
- Preserve original evidence and audit state; do not claim final per-page period aggregation.
- Manual first-chunk test only; no auto continuation yet.

## v0.1.50 (2026-11-02)
- Added five-minute dedicated auto continuation for source-to-merged reconciliation, preserving checkpoint.
- Silent trigger execution; PASSED/HOLD cleans up only its own trigger.
- Read-only to source and merged ZIPs.
- GAS device test pending.

## v0.1.49
- Added checkpointed read-only reconciliation of source daily ZIP totals against merged ZIP daily totals (5 days per run).
- Requires PASSED merged-output audit; does not change source or merged ZIPs.
- Not a row-by-row content equality check.

## v0.1.49
- Add dedicated five-minute trigger to resume DetailedMerged ZIP quality audit from saved checkpoint.
- Stop dedicated trigger on PASSED/HOLD; retain read-only audit and source protections.

## v0.1.49
- Read-only, checkpointed audit of DetailedMerged index and 73 chunk ZIPs.
- Validate schema, identities, CSV row counts, day coverage, duplicate keys, click/impression totals, index sums.
- HOLD on inconsistencies; no source ZIP mutation. Manual one-chunk-per-run initial trial.

## v0.1.46 — Detailed分割統合の自動継続
5分間隔の専用トリガーで既存チェックポイントから最大5日ずつ自動統合。完了時のトリガー削除、エラー時停止、手動停止、状態確認に対応。元Evidenceは変更しません。

## v0.1.46
- 365日Detailedを5日単位のZIPへ分割統合。途中再開、元ZIP再検証、索引ZIP生成。
- 単一巨大ZIPや30/90/365日分析は未実装。手動続行で実機検証する。

## v0.1.46 (2026-11-01)
- Added guarded one-day Detailed Evidence gap repair for 2026-10-28.
- Preserve source ZIPs; verify newly generated ZIP before audit append.
- GSC API completeness is not guaranteed; zero-row results are not stored.
- Real-device test pending.

## v0.1.43 (2026-11-01)
- Added read-only DetailedAudit date coverage and duplicate fingerprint diagnostic.
- No GSC calls, ZIP extraction, source changes, or trigger changes.
- Existing v0.1.42 merge preflight remains fail-closed on missing dates.

## v0.1.42
- Fix DetailedAudit sheet Date-object normalization in merge preflight; preserve read-only HOLD gate.

## v0.1.40
- Adds five-minute temporary audit trigger and resumable checkpoints; maximum three ZIPs per execution.
- Preserves existing DetailedAudit records and source Evidence.
- Stop removes only dedicated audit triggers. Status screen shows progress and errors.
- GAS device test pending.

## v0.1.40
- Added bounded resumable read-only Detailed ZIP audit (5 ZIP per invocation).
- Audit records are written to a dedicated DetailedAudit sheet; source Evidence is unchanged.
- Duplicate-day and content conflict reporting, CSV/manifest numeric checks, cap warnings.
- No automatic merge or collection in this release.

## v0.1.37
- Fix: replace one-shot continuation trigger with durable 5-minute repeating trigger to survive execution timeout.
- Add explicit stalled-job recovery menu, preserving existing progress and Evidence ZIPs.
- Bound each tick to four new days and 110-second soft budget (single blocking API calls may overrun).
- No change to Baseline, Delta, Merged, or EvidenceRegistry.

## v0.1.36
- Opt-in 14-day automatic continuation pilot with temporary trigger, lock, progress, stop, and fail-closed behavior.
- Existing ZIPs are not overwritten or deleted.
- Real-device verification pending.

## v0.1.34
- 365日の日付×ページ未収集日を読取専用で確認。
- 365日ウィンドウの不足日を1回最大7日収集し、途中再開。
- 30日試験メニューと既存Evidenceの非破壊運用を維持。
- 定期トリガーなし。実機未検証。

## v0.1.33
- 同日ZIPの個別品質検証と決定的な正本選択。
- 同一内容/内容差ありの重複を区別して警告表示。
- 破損・不整合は対象ファイル名を示して安全停止。
- 未収集日の差分収集を正常重複で阻害しない。

## v0.1.31
- Validate seven daily-page ZIPs, dates, identifiers, CSV values, and row counts.
- Detect duplicate dates and duplicate date/page keys; exclude one-day pilot ZIPs.
- Save new seven-day merged ZIP in Evidence/DetailedMerged after explicit approval.
- Preserve source Evidence and EvidenceRegistry.

# Changelog

## v0.1.29
- 日付×ページの7日限定収集を追加（1回につき1日）。
- DocumentPropertiesで途中再開し、日付別ZIPで二重保存を防止。
- 既存Evidence・台帳は不変更。

## v0.1.28
- Add read-only verification of latest daily-page pilot ZIP, including site identity, date, CSV structure, duplicate keys, metrics, CTR, and manifest limits.
- Distinguish internal integrity from GSC coverage completeness.
- Preserve existing Evidence and Registry.


## v0.1.27
- Added bounded one-day date×page GSC pilot with separate ZIP, explicit confirmation, row cap and provenance.
- Existing Baseline/Delta/Merged and registry remain unchanged.

## v0.1.26
- 成長機会・不調診断・サイト構造の3目的に対応する詳細Evidence収集計画を表示。
- 読取専用。GSC呼出しや既存Evidence変更なし。
- 詳細Evidence収集処理は未実装。

## v0.1.25
- ページ別Evidenceの読取専用構造監査を追加。
- Baseline/Deltaの期間重複、CSVヘッダー・列数・件数を確認。
- 期間集計の加算・元Evidence変更は行わない。

## v0.1.24
- 品質検証済み日別統合Evidenceによるサイト全体の成長診断（読取専用）を追加。
- 30日・90日の非重複期間比較、365日集計、データ不足判定。
- SiteConfigバージョン同期とREADMEの旧版記述を是正。

## v0.1.23
- 品質検証済み最新Merged Evidenceの分析候補を読取専用で表示。
- 不合格または欠落日ありの場合はfail closed。
- ページ・クエリ集計を分析対象に含めない。

# CHANGELOG

## v0.1.22
- 日別統合Evidenceの読取専用品質検証を追加。
- 日付・CTR・集計期間・統合元参照を確認。
- READMEの旧版説明を整理。

hangelog

## v0.1.21
- 日別Evidenceのみ統合し、新規Merged ZIPとして保存。30/90/365日集計をmanifestに追加。
- 元Evidenceと台帳を保護。実機未検証。

## v0.1.20
- Evidence台帳の日付がGMT付き文字列の場合に事前監査が失敗する問題を修正。
- Evidenceへの書込みなし。実機未検証。

## v0.1.19
- Add read-only merge readiness audit for verified Evidence ZIPs.
- Validate site identity, date ranges, CSV schema and daily metrics.
- Deduplicate daily dates by later verified Evidence; do not merge period-level aggregates.
- No Evidence ZIP or registry writes; actual merge is deferred.

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

## v0.1.30
- v0.1.29の7日間収集状態を引き継ぐ最大5日連続処理を追加。
- 日ごとにZIP保存と進捗確定。時間予算接近・エラー時は成功分を保持して停止。
- 既存ZIPを識別照合して再利用し、元Evidenceと台帳は不変更。

## v0.1.33
- 直近30日を対象にDetailed ZIPの未収集日を検出。
- 最大7日ずつ時間制限付きで取得・別ZIP保存。
- 重複や読取異常がある場合は安全停止。

## v0.1.36
- Add opt-in 365-day auto-collection from verified missing dates.
- Add read-only audit of dedicated continuation triggers.
- Preserve existing Evidence and bounded continuation.
- GAS real-device verification pending.

## v0.1.38
- Remove full 365-day Evidence scan from stalled-job recovery confirmation to prevent 6-minute timeout.
- Recheck job status under lock and re-arm dedicated trigger only.
- Show recorded progress as provisional; leave Evidence unchanged.


## v0.1.42 (2026-11-01)
- Add read-only 365-day Detailed merge preflight from persisted DetailedAudit metadata.
- Verify coverage, same-day fingerprints, duplicate candidates, caps, errors and checkpoint/row counts.
- Hold on missing, conflicting, capped or inconsistent records; do not modify Evidence or audit results.

## v0.1.61
- Limit stored site strategy preview to 8,500 characters and 12 top candidates to avoid Apps Script per-property quota errors.
- Keep full population counts and totals; source ZIPs remain read-only.

## v0.1.63
- 診断結果の日本語表示と比較数値・確認方針を追加（表示のみ）。
- 既存の診断データを再利用し、ZIPの再読込・書込を行わない。

## v0.1.67
- New Strategist folder setup uses blog name without SiteID suffix.
- Added read-only migration preview; existing bindings are not rewritten.
- Manager integration remains pending verified site ownership.

## v0.1.69
- Manager記事管理の読取専用事前確認を追加。明示入力したSpreadsheet IDは保存しない。
- 必須列、最大200行のURLホストを確認。サイト一致を断定せず、別ドメインは停止表示。
- ファイル移行、Manager書込、状態同期は未実装。GAS実機未試験。

## v0.1.72
- Manager候補照合時にGSC URL-prefixのパス・スキーム・ポートを含めてスコープを検査。
- sc-domainはドメインとサブドメインを許可。S3候補の範囲外も停止。
- 読取専用・実機未検証。

## v0.1.75
- Add conservative, read-only migration readiness display; explicitly HOLD pending authenticated site identity, collision checks and rollback verification.

## v0.1.80
- Manager記事URLの正規化後の重複を検出し、予備監査をHOLDにする。
- 旧Evidence移行実行メニューを一時非表示にして誤操作を防止（既存関数・データは維持）。
- 実移行・Manager書込なし。GAS実機未検証。

## v0.1.81
- Managerサイト照合で記事URL空欄を移行前HOLD要因として明示。
- URL・フォルダー構造の予備PASSを移行承認と誤認しない表示に変更。
- Evidence・Manager・保存先の書き込みなし。GAS実機未検証。

## v0.1.83
- Manager Settingsのサイト設定値を読取専用で予備照合。サイト所有権の認証や移行許可とは区別。

## v0.1.86
- メニュー非公開のステージングコピー試作。1回1ファイル、SHA-256照合、状態ID拘束。切替・削除なし。実機未検証。

## v0.1.90
- 新規セットアップのブログ名を保存先に使用。既存Managerフォルダーを共用する場合はManagerスプレッドシートのBlogName、SearchConsoleProperty、BlogUrl範囲を読取照合し、不一致時は停止。
- 同名フォルダー重複、既存Strategist、Manager不在の既存ブログフォルダーは安全停止。移行処理は実行しない。
- 既存の収集・分析処理は変更しない。GAS実機未検証。
