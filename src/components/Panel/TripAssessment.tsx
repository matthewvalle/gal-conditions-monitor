import type { TripAssessment as TripAssessmentType } from '../../../api/lib/types';

interface Props {
  assessment: TripAssessmentType;
}

const ratingConfig: Record<string, { label: string; className: string }> = {
  excellent: { label: 'Excellent', className: 'assessment--excellent' },
  good: { label: 'Good', className: 'assessment--good' },
  fair: { label: 'Fair', className: 'assessment--fair' },
  poor: { label: 'Poor', className: 'assessment--poor' },
  dangerous: { label: 'Dangerous', className: 'assessment--dangerous' },
};

const factorColorMap: Record<string, string> = {
  green: 'var(--danger-low)',
  yellow: 'var(--danger-moderate)',
  orange: 'var(--danger-considerable)',
  red: 'var(--danger-high)',
};

export default function TripAssessment({ assessment }: Props) {
  const config = ratingConfig[assessment.overallRating] ?? ratingConfig.fair;

  return (
    <div className={`assessment ${config.className}`}>
      <div className="assessment-header">
        <span className="assessment-badge">{config.label}</span>
        <span className="assessment-confidence">
          {Math.round(assessment.confidence * 100)}% confidence
        </span>
      </div>
      <p className="assessment-summary">{assessment.summary}</p>

      <div className="assessment-factors">
        {assessment.factors.map((factor) => (
          <div key={factor.name} className="assessment-factor">
            <span
              className="assessment-factor-dot"
              style={{ backgroundColor: factorColorMap[factor.rating] ?? '#999' }}
            />
            <span className="assessment-factor-name">{factor.name}</span>
            <span className="assessment-factor-detail">{factor.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
