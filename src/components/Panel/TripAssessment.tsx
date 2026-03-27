interface Props {
  assessment: any;
}

const ratingConfig: Record<string, { label: string; className: string; emoji: string }> = {
  excellent: { label: 'Excellent Conditions', className: 'assessment--good', emoji: '🟢' },
  good: { label: 'Good Conditions', className: 'assessment--good', emoji: '🟢' },
  fair: { label: 'Fair — Check Details', className: 'assessment--fair', emoji: '🟡' },
  poor: { label: 'Caution Advised', className: 'assessment--poor', emoji: '🟠' },
  dangerous: { label: 'Not Recommended', className: 'assessment--dangerous', emoji: '🔴' },
};

export default function TripAssessment({ assessment }: Props) {
  if (!assessment) return null;

  const rating = assessment.overallRating ?? 'fair';
  const config = ratingConfig[rating] ?? ratingConfig.fair;
  const summary = assessment.summary ?? '';
  const reasons = assessment.reasons ?? [];
  const factors = assessment.factors ?? [];

  return (
    <div className={`assessment ${config.className}`}>
      <div className="assessment-header">
        <span className="assessment-badge">{config.emoji} {config.label}</span>
      </div>
      {summary && <p className="assessment-summary">{summary}</p>}

      {reasons.length > 0 && (
        <ul className="assessment-reasons">
          {reasons.map((r: string, i: number) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      {factors.length > 0 && (
        <div className="assessment-factors">
          {factors.map((factor: any) => (
            <div key={factor.name} className="assessment-factor">
              <span className="assessment-factor-name">{factor.name}</span>
              <span className="assessment-factor-detail">{factor.detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
