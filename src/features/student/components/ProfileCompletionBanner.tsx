import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileCompletionData {
  percentage: number;
  missingFields: string[];
  completedFields: string[];
}

interface ProfileCompletionBannerProps {
  completion: ProfileCompletionData;
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Full Name',
  hackerHandle: 'Hacker Handle',
  country: 'Country',
  mobile: 'Phone Number',
  githubId: 'GitHub Account',
  bio: 'Bio',
  organization: 'Organization',
};

/**
 * ProfileCompletionBanner - Shows profile completion status and encourages users
 * to complete their profile for better verification and opportunities.
 */
const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({ completion }) => {
  const { percentage, missingFields } = completion;
  
  // Don't show if profile is 100% complete
  if (percentage >= 100) {
    return null;
  }

  const isLowCompletion = percentage < 70;
  
  return (
    <div className={`rounded-2xl border p-5 ${
      isLowCompletion 
        ? 'border-red-400/20 bg-red-400/5' 
        : 'border-accent/20 bg-accent/5'
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface">
          {isLowCompletion ? (
            <AlertCircle className="h-5 w-5 text-red-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-accent" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="type-h4 font-black uppercase tracking-tight text-text-primary">
              {"Profile "}
              <span className={isLowCompletion ? 'text-red-400' : 'text-accent'}>
                {percentage}% Complete
              </span>
            </h3>
          </div>
          
          <p className="type-body-sm mb-3 text-text-secondary">
            {isLowCompletion
              ? 'Complete your profile to unlock full platform features and increase your visibility to employers.'
              : "You're almost there! Complete the remaining fields to maximize your profile."}
          </p>

          {missingFields.length > 0 && (
            <div className="mb-3">
              <p className="type-meta mb-2 uppercase tracking-wider text-text-tertiary">
                {"Missing Fields:"}
              </p>
              <div className="flex flex-wrap gap-2">
                {missingFields.map((field) => (
                  <span
                    key={field}
                    className="rounded-lg border border-border-subtle bg-surface px-3 py-1 font-mono text-xs text-text-secondary"
                  >
                    {FIELD_LABELS[field] || field}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Link
            to="/dashboard/settings"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-mono text-sm font-bold text-on-accent transition-opacity hover:opacity-90"
          >
            {"Complete Profile"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionBanner;
