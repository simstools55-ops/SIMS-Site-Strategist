# 資産統合台帳

ソース確認対象：S3 v0.1.98、SKE v0.12.1、BOS v0.14.41。以下は移植候補であり統合済みを意味しない。

|機能|現行ソースの入口|方針|
|---|---|---|
|Evidence生成・検証|S3 sdscFinalizeEvidence_, sssVerifyEvidenceRow_|現行を保護|
|長期戦略診断|S3 sssP60BuildStrategy|診断計算を活用、全件保存を新設|
|SBM照合|S3 sssP69ManagerPreview, sssP70AuditManagerMatches|全記事台帳へ発展|
|内部探索|SKE skeRunInternalDiscovery|page_query_top依存と3表示閾値を修正|
|外部探索|SKE skeBuildExternalDiscoveryThemes, skeGenerateExternalDiscoveryPackage|候補取得アダプタ|
|需要CSV|BOS sbosParseKeywordText_, sbosWriteImportedKeywords_|範囲値・欠損の保持を検証|
|SERP依頼・登録|BOS sbosCreateSerpReviewPackage, sbosApplySerpReviewPayload_|契約・根拠・状態の共通化|
|順位帯|BOS sbosSerpGradeFromBand_, sbosSerpGradeFromRank_|評価基準統一|
|カニバリ|SKE skeOwnedQueryAssessment_, BOS sbosCannibalRisk_, sbosApplyCannibalReviewPayload_|意図判定を共通化|
|Creator|SKE skeGenerateCreatorPackageForSelected, BOS sbosBuildCreatorReferral_, sbosBuildNewSiteCreatorReferral_|現行aCreator契約確認後に統一|
|公開登録|SKE skeRegisterPublishedCreator, BOS sbosRegisterSbmResultFromCreatorDialog|SBM正本照合|

## 根拠と制限
S3 sssP60BuildStrategyは30日と直前60日比較、上位12件を保存し季節性未調整。SKE skeRunInternalDiscoveryはpage_query_topを入力としimpressions>=3で除外。BOS v0.14.41 Release Notesは実体験がない場合の公開情報ベース記事を許容する依頼条件整理。これを旧条件で上書きしない。
独立版の関数依存・シート依存・外部契約の詳細はM2/M6で確定。Google Adsの直接取得は未確立。クラスター、全件処置判定は新規開発。
