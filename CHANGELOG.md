## v0.1.192 — M4/M5成長分析・調査順序の統合基盤
- サイト日別Evidenceの30/90日比較を通常診断に統合。
- 保存済み役割の調査優先度を自動決定し、既存Claude精査を再利用対象として明示。
- 通常画面の手動調査ボタンを撤去。
- 収益改善の順位確定とSBM連携は未実装。HOLD/NONEを維持。

## v0.1.191 — ブログ総合診断の利用者向け要約
診断の結論・対象記事数・検索面の課題・未判定の成長機会・次の調査を先頭に表示。詳細な内部データは折りたたみ。記事処置は HOLD/NONE のまま。

## v0.1.190 — 2026-11-22
- ブログ総合診断ダイアログ内の重複見出しを削除（上部タイトルは維持）。
- 診断・証拠収集・保存・SBM保護の処理ロジックは変更なし。

## v0.1.188 — M3正式運用導線・暫定役割表示の明確化
- サイト戦略の「ブログ総合診断」から一括追加調査へ直接移動できるメニューを追加。総合診断画面の主要ボタン名も統一。
- 保存済みClaude精査と従来記事役割を別の暫定記録として明示し、役割の自動上書きは行わない。
- Claude検証応答の契約・サイト・検索語・記事数・HOLD/NONEをクライアント側でも検査してから保存ボタンを有効化。
- 記事・SBM・Evidenceへの新たな書き込みなし。

## v0.1.187 — 一括調査画面の初期化停止を修正
- HTMLテンプレート内のClaude依頼文にある改行エスケープを修正。ブラウザーに渡すJavaScriptが構文エラーとなり、検索語候補の読み込みが始まらない問題に対処。
- テンプレートを実際にレンダリングした状態でJavaScript構文を検証する回帰試験を追加。
- GAS実機での動作確認は未実施。SBM・記事・Evidenceへの書き込みは変更なし。

## v0.1.186 — M3統合回帰監査・リリース識別修復
- v0.1.185に同梱されていた80件のローカル試験を再実行。旧関数シグネチャを前提にした3件の試験を現行実装へ合わせて修正。
- 実行時バージョン定数とPRODUCT_IDENTITY.jsonが0.1.183のままだった不整合を0.1.186へ同期。
- GAS実機試験は未実施。M3の実機合格や正式リリースは宣言しない。

## v0.1.184
- M3統合診断に保存済みClaude追加精査の検索語別集計を読み取り専用表示。表示上は履歴であり処置優先度ではない。
- 精査台帳の保存キー重複判定を修正（2次元配列のincludes誤用）。同じ回答の二重保存を防止。
- GAS実機試験は未実施。

## v0.1.184 — M3暫定精査結果の安全保存と検索語別集計
- 監査済みClaude回答の検証後、利用者操作でS3専用「S3_M3_精査記録」シートへ保存。サイトID・検索語・対象記事を最新の保存済み調査候補と再照合。
- 重複保存防止、保存ロック、列構成保護、上限、HOLD/NONE/PROVISIONALを維持。SBM・記事・Evidenceは更新しない。
- 検証結果を検索語単位で読み取る集計APIを追加。これは履歴集計であり、最新SBM照合や処置優先度の確定ではない。
- GAS実機未検証。内容的な真偽、SERP・全文・最新SBM状態は未検証。

## v0.1.182 — M3一括調査のClaude精査結果検証
- 追加調査ワークスペースにClaude回答JSONの入力・検証を追加。別の試験メニューは増やさない。
- 監査した検索語・サイト・記事IDとの完全一致、HOLD/NONE、暫定判定、重複・対象外ID・不正な役割を拒否。
- Claude依頼文に厳密な回答契約を同梱。検証結果は画面内のみ、S3/他製品へ保存せず処置なし。
- SERP・全文・最新SBM状態の不足を維持し、根拠が揃わない場合に確定診断しない。GAS実機未検証。

## v0.1.181 — M3調査証拠監査・Claude精査引き継ぎ
- 一括収集ワークスペースに証拠充足監査とClaude精査依頼文コピーを追加。GSC・SBM・本文の取得成功/失敗を明示し、SERP/全文/処置直前SBM照合を未確認として保持する。
- サーバ側の純粋な監査関数は工程の重複、検索語・サイトの不一致、HOLD/NONE逸脱を拒否。クライアントは監査用に証拠本文を除いた最小メタデータのみ送信する。
- Claude精査は暫定調査のみ。統合・改善・公開の依頼は発行しない。実機未検証。

## v0.1.180 — M3追加証拠の一括収集ワークスペース
- 総合診断から「証拠をまとめて確認」で検索語を引き継ぎ、GSCページ別→期間別GSC・SBM履歴→最大3記事の公開HTML部分本文を順番に取得する。
- GASの処理時間制限に備え、工程ごとに別RPCで実行。個別失敗時も次工程を継続し、取得できた証拠と失敗理由を表示する。
- 既存の10分間GSCキャッシュを再利用。調査結果は画面表示とJSONコピーのみ、記事・SBM・Evidence・S3保存済み調査記録は書き換えない。
- 調査対象と安全条件を各工程で検証。SERP、検索意図、全文の確認済み判定や記事処置は行わない。
- 実機試験未実施。開発フェーズの区切りで実機検証する。

## v0.1.179 — M3検索語別の調査ギャップ整理（まとめ改修）
- 保存済み記事役割を検索語ごとに集約。重複疑い、SBM処理中、状態不明、調査チェックリストを読み取り専用で生成。
- ブログ総合診断に検索語別の折り畳み確認リストとJSONコピーを統合。保存済み役割のない検索語を推測で追加しない。
- 同一検索語・記事ID重複、役割・状態の不正入力を安全停止。新規記事・改善・統合の自動処置はしない。
- GSC短期キャッシュの存在を「調査完了」と誤判定しない。SERP・本文全文・検索意図は引き続き未確定。
- GAS実機試験は未実施。v0.1.178の短期キャッシュと併せてフェーズ末に検証。

## v0.1.178 — M3調査ワークスペースの一括改善
- GSCページ別証拠と期間別GSC証拠を10分間のApps Script短期キャッシュで再利用。サイト・検索語・期間をSHA-256で識別し、利用時も候補を再検証。手動再取得ボタンを追加。
- SBM状態はキャッシュしない。期間別画面のSBM改善履歴はキャッシュ再利用時にも再取得。
- GSC証拠・期間別GSC・複数記事比較から、総合診断へ戻る導線を追加。
- 総合診断に保存済み役割ベースの進捗表示を追加。未取得のSERPや全文を「完了」と誤表示しない。
- キャッシュは10分・最大85KB・永続保存なし。公開・改善・統合・紹介状発行はしない。
- GAS実機試験は未実施。短期キャッシュのGAS実機確認が必要。

## v0.1.177 — 優先調査の検索語引き継ぎ
- 統合概要の優先順位行をクリックして調査検索語を選択。初期値は最優先検索語。
- GSC証拠・期間別GSC/履歴・本文比較の3画面に検索語を引き継ぎ、候補内に存在する場合に初期選択する。
- サーバー側で保存済み候補との一致を確認。不一致時は安全停止。既存の試験メニューから開く場合は従来どおり。
- 取得済み証拠の永続キャッシュ・調査後の自動復帰は未実装。記事・SBM・Evidenceへの書き込みなし。
- GAS実機試験は未実施。

## v0.1.176 — 統合診断から追加調査へ移動
- 正式メニューの統合概要画面に「GSC証拠」「期間別GSC・SBM履歴」「複数記事の本文比較」の3入口を追加。旧試験メニューは維持。
- ユーザーが押したときだけ既存の読み取り専用画面を起動する。検索語の自動選択・一括調査は未実装。
- 処置・紹介状・記事更新は一切実行しない。結果が未取得の場合は調査入口を隠す。
- GAS実機のダイアログ遷移は未確認。

## v0.1.175 — 保存済み役割の追加調査優先順位
- ブログ総合診断・統合概要に追加調査の順番を表示。役割判定（重複疑い→証拠不足→総合→専門）による調査順で、SEO効果・収益の優先順位ではない。
- SBM処理中・状態不明の記事も読み取り専用の調査候補に残すが、処置は全件保留。
- 対象は保存済み役割判定のみ。454記事全体を自動順位付けしたものではない。
- 新しいメニューや外部への書き込みは追加しない。


## v0.1.174 — M3統合概要（読み取り専用）
- 正式メニュー「ブログ総合診断」に「診断概要と記事役割を確認（試験）」を追加。
- M3診断が未完了でも、保存済み役割とSBM最新状態を一覧できる。
- 完了済みM3診断は記事数・区分集計を同じ画面に表示。
- 両方の安全条件を検証し、処置・紹介状は発行しない。
- 診断の実行・進捗再開は既存メニューのまま。


## v0.1.173 — 正式運用入口と開発・試験入口の分離
- トップメニュー「S3｜サイト戦略」を追加し、ブログ総合診断・サイト構造最適化・既存ブログの成長戦略・データ収集・更新・設定・メンテナンスに分類。
- 既存の長い試験メニューは「S3｜開発・試験」に改名し、コマンドとハンドラを維持。
- 新規ブログ戦略は製品計画として保持し、未実装のため操作メニューには表示しない。
- 移設した未完成の機能は（試験）を明示。メニュー変更による記事処置やデータ変更はなし。

## v0.1.172 — 保存済み役割判定とSBM最新状態の読み取り専用照合
S3役割判定台帳と接続先SBM記事管理を照合。処理中・不明を安全保留し、既知状態でも処置は発行しない。GAS実機未検証。

## v0.1.171 — 暫定記事役割判定のS3専用保存
Claude判定を検証後にS3専用シートへ保存。サイト・候補・記事台帳を保存時に再照合。重複防止、HOLD/NONE、SBM/Evidence/公開記事への書き込みなし。SBM最新状態の再照合とM3総合診断への集約は次工程。GAS実機未検証。

## v0.1.169 — 複数記事の本文比較（試験）
検索語に紐づく2〜3記事の公開HTML部分本文・GSC前後比較・SBM履歴を一括取得し、Claude比較依頼文を作成。READ_ONLY、HOLD、NONEを維持。GAS実機未検証。

## v0.1.168 — Read-only public article evidence and Claude prompt
- Bounded single-article public HTML extraction (H2/H3, excerpt)
- Safe per-site URL allowlist and no redirects
- Claude evidence handoff remains HOLD/NONE
- No writes to SBM, Evidence or articles

## v0.1.168 — Integrated evidence dialog script fix
- Escape the newline separator in the embedded dialog JavaScript, preventing a parse error that left the candidate selector loading.
- Add regression test for the actual rendered inline script. No data access or SBM logic changes.
- GAS実機未検証。

## v0.1.166 — Integrated evidence package
- Added read-only combined GSC timeline, SBM history and S3 article title/URL display.
- Explicitly marks history dates as unverified and body/SERP as not fetched.
- No SBM, Evidence or article writes.

## v0.1.166 — GSC期間比較とSBM改善履歴の読み取り専用照合
- 保存済み検索語を前半・後半の2期間に分けてGSCを照合（各期間上位100ページ）。
- SBM改善履歴は記事ID列・改善日列を特定できる場合のみ参考情報として表示。特定できない場合は未取得。
- 検索意図・本文・SERP・因果関係は未確認。書き込みなし。GAS実機未検証。

## v0.1.164 — 保存済み追加調査からGSCページ別証拠を読取専用で取得
- 1検索語ずつ、最大100ページ。S3の保存済み追加調査から候補を選択。
- 記事ID別に表示・クリック・観測状況を表示。未観測をゼロ実績と断定しない。
- 本文・SERP・改善履歴は未取得。SBM・Evidence・記事への書き込みなし。
- GAS実機試験未実施。

## v0.1.163
- 読み取り専用の検索戦略追加調査と、SBM記事処置の保留判定を分離。
- モニター中・再診中・状態不明の記事も調査対象とするが、全件処置はHOLD/NONE。
- 調査候補の状態照合と保存直前の再照合は維持。
- 照合画面の列幅を改善。

## v0.1.163
Claude追加調査回答をS3専用記録へ保存。保存直前にSBM作業状態を再照合し、変更時は安全停止。重複保存防止。SBM/Evidenceへの書込みなし。GAS実機未検証。

## v0.1.158 (2026-11-21)
- Claude追加調査回答を画面内で即時検証。検索語・記事ID・HOLD/NONE・必要根拠の整合性を確認。
- 純粋関数による同一契約のサーバー側検証を追加。回答を保存・処置発行はしない。
- 未実機確認。v0.1.157の照合機能を引き継ぐ。

## v0.1.157
- ライブSBM照合結果から安全な追加調査候補を最大5件選定。保留件数を表示。
- Claude追加調査依頼文を画面内に表示しコピー。未確認の本文・SERPを推測しない。
- 実行時バージョン定数とZIP内の版表示を同期。GAS実機未検証。

## v0.1.156
- 保存済み精査候補について、接続先SBMの記事管理を実行時に読み取り専用で再照合。処理中・状態不明・ID重複は安全保留。
- S3台帳の古い状態を処置判断に流用しない。紹介状は発行せず、実機確認は未実施。

## v0.1.155
- Added read-only saved strategy review routing preflight, with conservative SBM snapshot state guard and standalone dialog.
- No SBM/Evidence writes or automatic referral.

## v0.1.154
- Claude回答の形式検証後、利用者の明示操作でS3_検索戦略精査へ保存。サーバーで再検証しサイト一致・HOLD/NONEを強制。
- SHA-256保存キーによる重複登録防止、排他ロック、暫定優先度の付与。SBM/Evidenceへの書込みなし。
- 既存シートのヘッダ不一致は安全停止。GAS実機未検証。

## v0.1.153
Claude回答を画面内で形式検証し、サーバー通信待ちを廃止。GAS実機未検証。

## v0.1.152
- Fix: Generate Claude strategy prompt synchronously in the dialog from the already analyzed ten queries, avoiding a redundant Apps Script server round trip.
- Preserve the exact bounded schema and HOLD gates. Server-side Claude response verification remains unchanged.
- Add rendered inline JavaScript parity and no-RPC tests.

## v0.1.151
- v0.1.150の検索戦略ダイアログ内JavaScriptの改行エスケープを修正。クリックしても開始しない不具合を解消。
- Code.gsだけでなく、HTMLテンプレート展開後のインラインJavaScript構文も回帰検査対象に追加。
- SBM・Evidenceへの変更なし。GAS実機未検証。

## v0.1.150
- 一括検索戦略分析の完了結果から、Claude精査依頼文を生成・コピーしClaude回答JSONを検証する導線を追加。
- 最大10語の検索語・実績記事・数値・根拠を厳格検証し、HOLD/NONEを維持。
- 依頼文には観測限界・未確認事項・JSON回答契約を明記。記事変更なし。GAS実機未検証。

## v0.1.149
- 検索需要上位10語を2語ずつ自動分析する統合画面を追加。
- 検索語×実績ページの照合と追加調査分類を統合。
- 読み取り専用・保留ゲートを維持。

v0.1.147: GSC検索語×ページ上位250行から、複数記事観測・URL照合保留・単一記事観測・対応未確認を暫定分類する読取専用画面を追加。検索意図・競合・新記事必要性は未判定。GAS実機未検証。
## v0.1.146
- GSC query×page 上位250行の読み取り専用試験とSBM記事ID照合を追加。曖昧URLは未帰属、複数記事観測は競合未確定。
- 結果画面は単一スクロールで表示し、技術情報を折りたたみ。GAS実機未検証。

## v0.1.145
- M3: GSC検索クエリと保存済みSBM記事タイトルの語句類似候補を最大3件表示する読取専用試験を追加。新記事・改善・検索実績の帰属は判定しない。GAS実機未検証。

## v0.1.144
- サイト全体の検索クエリ上位200件を、既存Evidenceと同じ期間のGSC APIから読み取り専用で取得する試験画面を追加。
- クエリを記事へ帰属させず、検索意図・競合・カニバリゼーションを未検証として保留。
- GAS実機未検証。

## v0.1.143
- SBM作業状態の表示記号・表記揺れを吸収して処理中を識別。未知状態は改善候補にせず専用の保留区分へ。
- 診断結果にSBM状態の識別件数と未識別例を表示。既存M3完了データから再表示可能。
- 実機での454記事の判定は未検証。

## v0.1.142
- M3診断完了後、暫定診断の5区分・件数と最大20件の確認候補を日本語で表示。再表示ボタンあり。
- 全工程の完了・公開保留・区分件数の整合を確認し、結果は読み取り専用。HTMLへの文字列挿入はtextContentを使用。
- v0.1.141の実機5工程完了を基準に開発。v0.1.142 UIは実機未検証。

## v0.1.141
- 修正: M3最終診断でgetDisplayValues()が数値を文字列で返し、保存時の数値型配列とチェックサムが不一致になる問題を修正。
- 検証前に厳格な非負整数変換を行い、異常値は引き続き安全停止。既存のM3統合表・チェックポイントを変更しない。
- GAS実機は未検証。

## v0.1.140
- 修正: M3記事別実績統合の第2バッチ以降が常に0開始と誤認され安全停止する不具合を修正。
- 分割ジャーナル検証に開始オフセットを明示し、欠落・重複・逆行を拒否。
- 既存の完了済みARTICLE_INVENTORY/PAGE_INDEX/METRICS_JOURNALを維持し、進行中ROLLUPの再開を想定。
- GAS実機未検証。SBM/Evidenceは読み取り専用。

v0.1.139：2MB超の簡易Evidence ZIPを展開せず、検証済みEvidenceと同一期間のGSCページ実績を400件ずつ再取得する代替経路を追加。これは保存済みEvidenceの読出しではなく新規観測であり、数値の同一性・完全性は保証しない。既存454記事のチェックポイントを維持。GAS実機未検証。
v0.1.138：Collector作業表がない場合、検証済みの小容量（2MB以下）簡易Evidenceを代替利用するM3経路を追加。ZIP展開は非ストリーミングであり、上限超過時は安全停止。GAS実機未検証。

## v0.1.137 — M3自動進行UI
- 診断開始・再開を1回押すとクライアントから区間ごとに連続実行。工程と概算進捗を表示。
- 停止・安全停止・技術情報の折りたたみ・最大250回の連続実行ガード。保存済みチェックポイントは維持。
- SBM/Evidenceは読み取り専用。GAS実機での新UIは未検証。

## v0.1.136 — M3段階診断の工程整合・最終判定ゲートを強化
- 先行工程が未完了なのに後続工程が実行中・完了となっている矛盾を検出し、安全停止。
- 最終診断の戻り値が検証済みの暫定判定形式・公開保留であることを確認してから「完了」と表示。
- SBM/Evidenceの書き込みなし。GAS実機未検証。

## v0.1.135
- M3 pilot: Collectorの作業表確認を必要な工程だけに限定。完了済みの後続工程は作業表消失後も確認可能。
- 工程がNOT_AVAILABLEなどを返した際に成功扱いせず安全停止。作業表検査例外も画面で説明。
- GAS実機試験は未実施。

## v0.1.134
- M3段階診断の実機試験画面と1区間ずつのオーケストレーションを追加。
- Collector作業表がない場合は安全停止。ZIPの自動展開は行わない。
- GAS実機試験は未実施。

## v0.1.133
- M3記事健全性の保守的な読取専用トリアージ。データ品質確認を最優先、SBM処理中は重複依頼を抑制。
- 表示100回・クリック0回は暫定確認候補に限定し、削除・統合・noindex・公開は保留。GAS実機未検証。

## v0.1.132
- M3記事台帳と検証済み統合実績の読取専用全件照合を追加。欠損を需要ゼロとみなさず、ID重複・不正数値・出所不一致を安全停止。
- 最大5000記事、GAS実機未検証。

## v0.1.131
- M3ジャーナルを1コミットバッチずつ検証し、記事ID別の集計表へ再開可能な統合を追加。
- ジャーナル総行数10,000行超にも対応する設計。1回の読み込みは最大407行、記事別集計は最大5,000件。
- S3専用シートのみ更新。GAS実機試験は未実施。

## v0.1.129
- M3のページ別実績を400行ずつ読み取り、記事ID単位の部分集計をS3専用シートに追記する再開可能なジャーナルを追加。
- 実行ID・サイト・保存行数・ENDコミット行を検証し、中断時の二重計上を防止。
- 全件集計サマリー、GAS実機試験は未実施。

## v0.1.127
- M3: conservative exact/normalized URL matching with ambiguity and unowned-page safeguards.
- Read-only 400-row preview from staged pages; requires completed article and page staging.
- New pure matching regression test; no UI or GAS live test.

## 0.1.126
- M3: verified compact Collector page-period work table to resumable page-index staging (400 rows/call).
- Never decompress Evidence ZIP in this stage; refuse mismatched or unavailable source.
- No menu exposure or live GAS verification.

## v0.1.125 — M3 checkpoint correctness
SBM記事管理の空白行を飛ばした場合でも、走査済み行数と有効記事件数を区別して進捗を管理。元シート行番号を保持し、チェックポイントを検証。Evidenceの展開は未着手で、Utilities.unzipによる一括展開は記事単位の分割では解決しないことを明示。既存のv0.1.121実機確認版は変更不要。GAS実機未検証。

## v0.1.124
- M3分割記事台帳：列名・順序のフィンガープリント検査、カーソル境界・チェックポイント整合性強化。
- 分割開始前の必須列検査とロック取得順序の修正。
- ローカル試験を追加。Evidence ZIPの分割読込は未実装、GAS実機未試験。

## v0.1.123
- M3記事基盤の75行単位・チェックポイント付き読み取りを追加。
- S3専用シートに途中結果を保存し、SBMとEvidenceは読取専用。
- データソースの行数・列数変化を検知して中断。
- GSC/Evidenceの大容量ZIP分割処理は未実装。

## v0.1.122
- M3基礎集計の実機合格を受け、ZIPを展開しないEvidence登録状態の軽量確認を追加。
- 記事台帳とEvidence登録状態を別々のリクエストで確認し、操作ボタンの近くに通知。
- 既存の詳細分析処理は実行せず、GAS実機試験は未実施。

## v0.1.118
未処理依頼の再開・登録済み結果表示・履歴由来の最新候補一覧。GAS未検証。

## v0.1.117
- 精査画面の操作別通知をボタンの近くに配置。保存処理の模擬試験を追加。

## v0.1.116
- 精査履歴保存と日本語結果表示。

## v0.1.115
- 精査試験画面の状態通知を固定し、コピー成功・失敗を明示。処理中の二重実行防止と回答欄直後の結果表示。GAS実機未検証。

## v0.1.101
- GSC側のみのURLを形式別に暫定分類し、日本語の照合結果と代表URLを表示。
- v0.1.100実機：454記事、451一致、3未確認、GSCのみ4416。新分類の実機確認待ち。

## v0.1.100
- M1 SBM連携先の保存・再検証、Managerフォルダー探索、URL入力、中央進捗ダイアログ。
- GAS実機未検証。

## v0.1.99
- M1 read-only inventory candidate; existing collection unchanged. Local synthetic tests passed; GAS UAT pending.

## v0.1.98
- 365日Detailed自動収集専用トリガーを5分から1分へ短縮（待機時間削減）。
- 既存の1実行最大4日・110秒、LockService、保存済みZIP再利用、停止・再開処理を維持。
- 実行時間短縮の実機測定は未実施。

## v0.1.97
- 初回セットアップで Evidence/Detailed を作成。既存設定でも保存先再確認時に不足分を補完。
- 365日Detailed自動収集の開始前に、登録済みS3保存先を検証してDetailedフォルダーを安全に準備。14日試験収集にも同じ対策。
- 同名Detailedフォルダーが複数ある場合は停止。既存Evidence ZIPとSBM Managerは変更しない。
- GAS実機試験は未実施。

## v0.1.96
- GSC収集確認画面の対象URLがundefinedになる不具合を修正。
- S3固定サイトとCollector収集先の一致検証を確認画面より前に追加。
- GSC取得・Evidence処理は変更なし。
- 静的検査のみ。GAS実機試験は未実施。

## v0.1.95
- Fix GSC URL scope checks in Apps Script V8: replace unsupported URL constructor with strict HTTP(S) parser.
- Preserve SBM read-only setup validation, existing site binding, GSC collection and analysis.

## v0.1.95
- SBMの別スプレッドシートを開くため、OAuthスコープを spreadsheets.currentonly から spreadsheets に変更。
- セットアップウィザードとGSC収集・分析ロジックは変更なし。
- マニフェスト更新と再承認の手順をREADMEに追記。GAS実機試験は未実施。

## v0.1.92
- Added resumable single-dialog setup wizard for GSC site selection, blog name, SBM spreadsheet URL verification, and Drive folder preparation.
- Existing registered sites resume at SBM connection; existing storage resumes at completion.
- Fail closed when SBM blog folder does not exist, as SBM is installed first.
- Kept collection and analysis logic unchanged.
- GAS runtime test pending.

## v0.1.92
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

## v0.1.92
- 新規セットアップのブログ名を保存先に使用。既存Managerフォルダーを共用する場合はManagerスプレッドシートのBlogName、SearchConsoleProperty、BlogUrl範囲を読取照合し、不一致時は停止。
- 同名フォルダー重複、既存Strategist、Manager不在の既存ブログフォルダーは安全停止。移行処理は実行しない。
- 既存の収集・分析処理は変更しない。GAS実機未検証。

## v0.1.92
- Expose public google.script.run entrypoints for wizard status, sites, binding, Manager verification and storage.
- Display RPC errors and allow explicit retry on initialization; add 30-second wait notice (does not cancel writes).
- No changes to GSC collection or analytics. GAS live verification pending.

## v0.1.93
- SetupWizard.htmlをCode.gsに埋め込み、単一ファイル更新に対応。
- ウィザードのRPC、収集・統合・分析ロジックは変更なし。

## v0.1.102
- Port SBM v9.3.93 URL key into M1; retain raw variants and avoid metric summation. Simplify dialog. GAS validation pending.

## v0.1.103
- M1 compact fallback and refresh entry; GAS pending.

## v0.1.104
- M1: Select verified evidence by collection end date; verify completed compact run on status/update entry.
- GAS validation pending; no changes to manifest or collection engine.

## v0.1.105
- 採用データの期間・経過日数と新規収集の検証状態を分離表示。
- M1限定実機合格、残試験を記録しM2準備。

## v0.1.106
- BOS需要・SKE語彙分析の純粋関数を統合。範囲需要と欠損を保持。UI未接続。

## v0.1.107
BOS列定義を移植。CSV/TSV需要取込とM1台帳の暫定語彙候補抽出を追加。所有性確定・SERP・UI未実装。GAS未試験。

## v0.1.108
記事別上位クエリEvidenceをサイト・期間・件数確認後に台帳へ接続。1表示も保持し別表記は合算しない。BOS順位帯変換を追加。所有性確定・SERP回答検証・UIは未実装。GAS未試験。

## v0.1.109
SERP依頼・回答の純粋関数を追加。BOS契約識別子を継承し5件未満は保留、重複証拠拒否、自サイト検出はカニバリ保留。確認は構造のみ、実在性・保存・ZIP入出力・GAS UI未実装。

## v0.1.110
M2暫定関連記事分析を実機試験用メニューに接続。SKE所有性・BOSリスク処理を監査し、候補とGSC観測を統合。確定判定・永続保存・SERP入出力は未完。GAS未試験。

## v0.1.111
- v0.1.110実機：454記事、識別保留0、Chrome 太字の語彙候補1、記事別観測なし。
- サイト全体クエリと記事別上位クエリの観測を分離表示。未観測は需要ゼロではない。GAS実機未検証。

## v0.1.112
- 関連クエリ探索を追加。完全一致と区別し合算しない。GAS未検証。

## v0.1.113
検索意図精査依頼・回答の純粋関数を追加。v0.1.112 関連語3件の実機確認。保存・UI接続は未実装。

## v0.1.114
Combined review pilot; one pending request stored in S3 properties only; response structurally validated, no publication approval or persistent candidate ledger. GAS untested.

## v0.1.116
実機v0.1.115の回答受付確認。S3精査履歴への保存と日本語結果表示を追加。GAS保存未検証。

## v0.1.119
- v0.1.118 実機：前回依頼の再開・操作近傍通知を確認。保存済み結果再開は未検証。
- M3全記事基礎集計を追加（読取専用）。記事状態、URL照合、GSC観測範囲、精査履歴件数を表示。削除・統合等の確定判定は行わない。GAS実機未検証。

## v0.1.120
- M3に全記事のEvidence観測状態を6分類する読み取り専用処理を追加。検索需要ゼロ・記事品質・削除などの判断は禁止。
- 基礎集計ダイアログに分類件数と要確認記事例を表示。GAS実機未検証。

## v0.1.121
- M3実機で `DEADLINE_EXCEEDED`（ストレージ読込中）を確認。同期実行で詳細Evidenceを展開する構成を回避。
- M3試験ダイアログの診断開始はSBM記事台帳のみの高速基礎集計に切替。GSC・Evidenceの未取得項目は明示し、ゼロ扱いしない。
- 詳細診断は内部関数として保持し、次版以降で分割読込・中間結果方式を実装するまで利用者向けに実行しない。
- M3_FAST_TEST.js追加。GAS実機未検証。

## v0.1.128
- M3ページ照合の400行以内スライスから、記事別クリック・表示回数を安全に集計する純粋関数と読取専用プレビューを追加。
- 未照合・曖昧なページの数値は記事に帰属させず別枠で保持。結果はPARTIAL_SLICEとして明示。
- 実データを使うGAS実機試験、全件集計、チェックポイント永続化は未実施。

## v0.1.130
- M3ジャーナルのバッチ連続性、コミット、数値整合を検証し、10,000行以内で記事別集計を統合する読み取り専用プレビューを追加。
- 大規模データはTOO_LARGE_FOR_PREVIEWで安全停止。GAS実機未検証。

## v0.1.148
- サイト全体の検索語上位20件から1語を選択し、GSCの完全一致フィルタでページ別実績を最大100件取得する読取専用の深掘り試験を追加。
- 保存済みSBM記事台帳とのURL照合、重複・数値検査、未照合保留、100件上限の明示。検索意図・競合は確定しない。
- GAS実機未検証。

## v0.1.163
- Fix rendered HTML dialog syntax: escape newline in research verification result join.
- Add regression test compiling cooked HTML script from routing dialog.

## v0.1.170
- Add Claude structured role-review contract and in-dialog strict client-side verification for 2–3 observed articles.
- No persistence, no publication, no SBM/Evidence changes. Unconfirmed roles remain provisional.
- GAS live test pending.

## v0.1.185
- 保存済み精査の完全な最新バッチを検索語・記事ID単位で選択し、SBM最新状態と照合。
- 調査順序を総合診断へ追加。SBM処理中・状態不明は安全保留。改善優先順位ではない。
- GAS実機未試験。
